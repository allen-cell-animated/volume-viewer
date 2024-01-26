import { ImageInfo } from "../Volume";
import { CreateLoaderOptions, VolumeFileFormat, pathToFileType } from "../loaders";
import {
  ThreadableVolumeLoader,
  LoadSpec,
  RawChannelDataCallback,
  VolumeDims,
  LoadedVolumeInfo,
} from "../loaders/IVolumeLoader";
import { TiffLoader } from "../loaders/TiffLoader";
import {
  WorkerMsgType,
  WorkerRequest,
  WorkerRequestPayload,
  WorkerResponse,
  WorkerResponsePayload,
  ChannelLoadEvent,
  WorkerResponseResult,
} from "./types";
import { rebuildImageInfo, rebuildLoadSpec } from "./util";

type StoredPromise<T extends WorkerMsgType> = {
  type: T;
  resolve: (value: WorkerResponsePayload<T>) => void;
  reject: (reason?: unknown) => void;
};

/**
 * A handle that holds the worker and manages requests and messages to/from it.
 *
 * `VolumeLoaderContext` and every `LoaderWorker` it creates all hold references to one `SharedLoadWorkerHandle`.
 * They use it to interact with the worker via `sendMessage`, which speaks the protocol defined in ./types.ts and
 * converts messages received from the worker into resolved `Promise`s and called callbacks.
 *
 * This class exists to represent that access to the worker is shared between `VolumeLoaderContext` and any
 * `LoaderWorker`s. This is as opposed to implementing `sendMessage` directly on `VolumeLoaderContext`, where making
 * the method public to `LoaderWorker`s would require also allowing access to users of the class.
 */
class SharedLoadWorkerHandle {
  private worker: Worker;
  private pendingRequests: (StoredPromise<WorkerMsgType> | undefined)[] = [];
  private workerOpen = true;

  public onChannelData: ((e: ChannelLoadEvent) => void) | undefined = undefined;

  constructor() {
    this.worker = new Worker(new URL("./VolumeLoadWorker", import.meta.url));
    this.worker.onmessage = this.receiveMessage.bind(this);
  }

  /** Given a handle for settling a promise when a response is received from the worker, store it and return its ID */
  private registerMessagePromise(prom: StoredPromise<WorkerMsgType>): number {
    for (const [i, pendingPromise] of this.pendingRequests.entries()) {
      if (pendingPromise === undefined) {
        this.pendingRequests[i] = prom;
        return i;
      }
    }

    return this.pendingRequests.push(prom) - 1;
  }

  get isOpen(): boolean {
    return this.workerOpen;
  }

  /** Close the worker. */
  close(): void {
    this.worker.terminate();
    this.workerOpen = false;
  }

  /**
   * Send a message of type `T` to the worker.
   * Returns a `Promise` that resolves with the worker's response, or rejects with an error message.
   */
  sendMessage<T extends WorkerMsgType>(type: T, payload: WorkerRequestPayload<T>): Promise<WorkerResponsePayload<T>> {
    let msgId = -1;
    const promise = new Promise<WorkerResponsePayload<T>>((resolve, reject) => {
      msgId = this.registerMessagePromise({ type, resolve, reject } as StoredPromise<WorkerMsgType>);
    });

    const msg: WorkerRequest<T> = { msgId, type, payload };
    this.worker.postMessage(msg);

    return promise;
  }

  /**  */
  private receiveMessage<T extends WorkerMsgType>({ data }: MessageEvent<WorkerResponse<T>>): void {
    if (data.responseResult === WorkerResponseResult.EVENT) {
      this.onChannelData?.(data);
    } else {
      const prom = this.pendingRequests[data.msgId];

      if (prom === undefined) {
        throw new Error(`Received response for unknown message ID ${data.msgId}`);
      }
      if (prom.type !== data.type) {
        throw new Error(`Received response of type ${data.type} for message of type ${prom.type}`);
      }

      if (data.responseResult === WorkerResponseResult.ERROR) {
        prom.reject(data.payload);
      } else {
        prom.resolve(data.payload);
      }
      this.pendingRequests[data.msgId] = undefined;
    }
  }
}

/**
 * A context in which volume loaders can be run, which allows loading to run on a WebWorker (where it won't block
 * rendering or UI updates) and loaders to share a single `VolumeCache` and `RequestQueue`.
 *
 * ### To use:
 * 1. Create a `VolumeLoaderContext` with the desired cache and queue configuration.
 * 2. Before creating a loader, await `onOpen` to ensure the worker is ready.
 * 3. Create a loader with `createLoader`. This accepts nearly the same arguments as `createVolumeLoader`, but without
 *    options to directly link to a cache or queue (the loader will always be linked to the context's shared instances
 *    of these if possible).
 *
 * The returned `WorkerLoader` can be used like any other `IVolumeLoader` and acts as a handle to the actual loader
 * running on the worker.
 */
class VolumeLoaderContext {
  private workerHandle: SharedLoadWorkerHandle;
  private openPromise: Promise<void>;

  private activeLoader: WorkerLoader | undefined = undefined;
  private activeLoaderId = -1;

  constructor(maxCacheSize?: number, maxActiveRequests?: number, maxLowPriorityRequests?: number) {
    this.workerHandle = new SharedLoadWorkerHandle();
    this.openPromise = this.workerHandle.sendMessage(WorkerMsgType.INIT, {
      maxCacheSize,
      maxActiveRequests,
      maxLowPriorityRequests,
    });
  }

  /** Returns a `Promise` that resolves when the worker is ready. `await` it before trying to create a loader. */
  onOpen(): Promise<void> {
    if (!this.workerHandle.isOpen) {
      return Promise.reject("Worker is closed");
    }
    return this.openPromise;
  }

  /** Close this context, its worker, and any active loaders. */
  close(): void {
    this.workerHandle.close();
    this.activeLoader?.close();
  }

  /**
   * Create a new loader within this context. This loader will share the context's `VolumeCache` and `RequestQueue`.
   *
   * This works just like `createVolumeLoader`. A file format may be provided, or it may be inferred from the URL.
   */
  async createLoader(
    path: string | string[],
    options?: Omit<CreateLoaderOptions, "cache" | "queue">
  ): Promise<WorkerLoader | TiffLoader> {
    // Special case: TIFF loader doesn't work on a worker, has its own workers anyways, and doesn't use cache or queue.
    const pathString = Array.isArray(path) ? path[0] : path;
    const fileType = options?.fileType || pathToFileType(pathString);
    if (fileType === VolumeFileFormat.TIFF) {
      return new TiffLoader(pathString);
    }

    const success = await this.workerHandle.sendMessage(WorkerMsgType.CREATE_LOADER, { path, options });
    if (!success) {
      throw new Error("Failed to create loader");
    }

    this.activeLoader?.close();
    this.activeLoaderId += 1;
    this.activeLoader = new WorkerLoader(this.activeLoaderId, this.workerHandle);
    return this.activeLoader;
  }
}

/**
 * A handle to an instance of `IVolumeLoader` (technically, a `ThreadableVolumeLoader`) running on a WebWorker.
 *
 * Created with `VolumeLoaderContext.createLoader`. See its documentation for more.
 */
class WorkerLoader extends ThreadableVolumeLoader {
  private isOpen = true;
  private currentLoadId = -1;
  private currentLoadCallback: RawChannelDataCallback | undefined = undefined;

  constructor(private loaderId: number, private workerHandle: SharedLoadWorkerHandle) {
    super();
    workerHandle.onChannelData = this.onChannelData.bind(this);
  }

  private checkIsOpen(): void {
    if (!this.isOpen || !this.workerHandle.isOpen) {
      throw new Error("Tried to use a closed loader");
    }
  }

  /** Close and permanently invalidate this loader. */
  close(): void {
    this.isOpen = false;
  }

  loadDims(loadSpec: LoadSpec): Promise<VolumeDims[]> {
    this.checkIsOpen();
    return this.workerHandle.sendMessage(WorkerMsgType.LOAD_DIMS, loadSpec);
  }

  async createImageInfo(loadSpec: LoadSpec): Promise<LoadedVolumeInfo> {
    this.checkIsOpen();
    const { imageInfo, loadSpec: adjustedLoadSpec } = await this.workerHandle.sendMessage(
      WorkerMsgType.CREATE_VOLUME,
      loadSpec
    );
    return { imageInfo: rebuildImageInfo(imageInfo), loadSpec: rebuildLoadSpec(adjustedLoadSpec) };
  }

  async loadRawChannelData(
    imageInfo: ImageInfo,
    loadSpec: LoadSpec,
    onData: RawChannelDataCallback
  ): Promise<Partial<LoadedVolumeInfo>> {
    this.checkIsOpen();

    this.currentLoadCallback = onData;
    this.currentLoadId += 1;

    const { imageInfo: newImageInfo, loadSpec: newLoadSpec } = await this.workerHandle.sendMessage(
      WorkerMsgType.LOAD_VOLUME_DATA,
      {
        imageInfo,
        loadSpec,
        loaderId: this.loaderId,
        loadId: this.currentLoadId,
      }
    );

    return {
      imageInfo: newImageInfo && rebuildImageInfo(newImageInfo),
      loadSpec: newLoadSpec && rebuildLoadSpec(newLoadSpec),
    };
  }

  onChannelData(e: ChannelLoadEvent): void {
    if (e.loaderId !== this.loaderId || e.loadId !== this.currentLoadId) {
      return;
    }

    this.currentLoadCallback?.(e.channelIndex, e.data, e.atlasDims);
  }
}

export default VolumeLoaderContext;
export type { WorkerLoader };

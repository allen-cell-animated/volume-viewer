import { ImageInfo } from "../Volume";
import { CreateLoaderOptions } from "../loaders";
import { IVolumeLoader, LoadSpec, RawChannelDataCallback, VolumeDims } from "../loaders/IVolumeLoader";
import {
  WorkerMsgType,
  WorkerRequest,
  WorkerRequestPayload,
  WorkerResponse,
  WorkerResponsePayload,
  ChannelLoadEvent,
} from "./types";
import { rebuildImageInfo, rebuildLoadSpec } from "./util";

type StoredPromise<T extends WorkerMsgType> = {
  type: T;
  resolve: (value: WorkerResponsePayload<T>) => void;
  reject: (reason?: unknown) => void;
};

/**
 * A handle that holds the worker and lets us interact with it through async calls and events rather than messages.
 * This is separate from `LoadWorker` so that `sendMessage` and `onChannelData` can be shared with `WorkerLoader`s
 * without leaking the API outside this file.
 */
class SharedLoadWorkerHandle {
  private worker: Worker;
  private pendingRequests: (StoredPromise<WorkerMsgType> | undefined)[] = [];

  public onChannelData: ((e: ChannelLoadEvent) => void) | undefined = undefined;

  constructor() {
    this.worker = new Worker(new URL("./VolumeLoadWorker", import.meta.url));
    this.worker.onmessage = this.receiveMessage.bind(this);
    this.worker.onerror = this.receiveError.bind(this);
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

  sendMessage<T extends WorkerMsgType>(type: T, payload: WorkerRequestPayload<T>): Promise<WorkerResponsePayload<T>> {
    let msgId = -1;
    const promise = new Promise<WorkerResponsePayload<T>>((resolve, reject) => {
      msgId = this.registerMessagePromise({ type, resolve, reject } as StoredPromise<WorkerMsgType>);
    });

    const msg: WorkerRequest<T> = { msgId, type, payload, isEvent: false };
    this.worker.postMessage(msg);

    return promise;
  }

  private receiveMessage<T extends WorkerMsgType>({ data }: MessageEvent<WorkerResponse<T> | ChannelLoadEvent>): void {
    if (data.isEvent) {
      this.onChannelData?.(data);
    } else {
      const prom = this.pendingRequests[data.msgId];

      if (prom === undefined) {
        throw new Error(`Received response for unknown message ID ${data.msgId}`);
      }
      if (prom.type !== data.type) {
        throw new Error(`Received response of type ${data.type} for message of type ${prom.type}`);
      }

      prom.resolve(data.payload);
      this.pendingRequests[data.msgId] = undefined;
    }
  }

  private receiveError(e: ErrorEvent): void {
    // TODO propagate errors through promises
    // if (!e.error)
    console.log(e);
  }
}

class LoadWorker {
  private workerHandle: SharedLoadWorkerHandle;
  private openPromise: Promise<void>;

  private activeLoader: WorkerLoader | undefined = undefined;
  private activeLoaderId = -1;

  constructor(maxCacheSize?: number) {
    this.workerHandle = new SharedLoadWorkerHandle();
    this.openPromise = this.workerHandle.sendMessage(WorkerMsgType.INIT, { maxCacheSize });
  }

  onOpen(): Promise<void> {
    return this.openPromise;
  }

  async createLoader(path: string | string[], options?: CreateLoaderOptions): Promise<WorkerLoader> {
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

class WorkerLoader extends IVolumeLoader {
  private isActive = true;

  private currentLoadId = -1;
  private currentLoadCallback: RawChannelDataCallback | undefined = undefined;

  constructor(private loaderId: number, private workerHandle: SharedLoadWorkerHandle) {
    super();
    workerHandle.onChannelData = this.onChannelData.bind(this);
  }

  private checkIsActive(): void {
    if (!this.isActive) {
      throw new Error("Tried to use a closed loader");
    }
  }

  close(): void {
    this.isActive = false;
  }

  loadDims(loadSpec: LoadSpec): Promise<VolumeDims[]> {
    this.checkIsActive();
    return this.workerHandle.sendMessage(WorkerMsgType.LOAD_DIMS, loadSpec);
  }

  async createImageInfo(loadSpec: LoadSpec): Promise<[ImageInfo, LoadSpec]> {
    this.checkIsActive();
    const [imageInfo, adjustedLoadSpec] = await this.workerHandle.sendMessage(WorkerMsgType.CREATE_VOLUME, loadSpec);
    return [rebuildImageInfo(imageInfo), rebuildLoadSpec(adjustedLoadSpec)];
  }

  async loadRawChannelData(
    imageInfo: ImageInfo,
    loadSpec: LoadSpec,
    onData: RawChannelDataCallback
  ): Promise<[ImageInfo | undefined, LoadSpec | undefined]> {
    this.checkIsActive();

    this.currentLoadCallback = onData;
    this.currentLoadId += 1;

    const [newImageInfo, newLoadSpec] = await this.workerHandle.sendMessage(WorkerMsgType.LOAD_VOLUME_DATA, {
      imageInfo,
      loadSpec,
      loaderId: this.loaderId,
      loadId: this.currentLoadId,
    });

    return [newImageInfo && rebuildImageInfo(newImageInfo), newLoadSpec && rebuildLoadSpec(newLoadSpec)];
  }

  onChannelData(e: ChannelLoadEvent): void {
    if (e.loaderId !== this.loaderId || e.loadId !== this.currentLoadId) {
      return;
    }

    this.currentLoadCallback?.(e.channelIndex, e.data, e.atlasDims);
  }
}

export default LoadWorker;
export type { WorkerLoader };

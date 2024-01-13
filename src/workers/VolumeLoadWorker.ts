import VolumeCache from "../VolumeCache";
import { VolumeFileFormat, createVolumeLoader, pathToFileType } from "../loaders";
import { ThreadableVolumeLoader } from "../loaders/IVolumeLoader";
import RequestQueue from "../utils/RequestQueue";
import SubscribableRequestQueue from "../utils/SubscribableRequestQueue";
import {
  WorkerMsgType,
  WorkerRequest,
  WorkerRequestPayload,
  WorkerResponse,
  WorkerResponseKind,
  WorkerResponsePayload,
} from "./types";
import { rebuildImageInfo, rebuildLoadSpec } from "./util";

let cache: VolumeCache | undefined = undefined;
let queue: RequestQueue | undefined = undefined;
let subscribableQueue: SubscribableRequestQueue | undefined = undefined;
let loader: ThreadableVolumeLoader | undefined = undefined;
let initialized = false;
let copyOnLoad = false;

type MessageHandler<T extends WorkerMsgType> = (payload: WorkerRequestPayload<T>) => Promise<WorkerResponsePayload<T>>;

const messageHandlers: { [T in WorkerMsgType]: MessageHandler<T> } = {
  [WorkerMsgType.INIT]: ({ maxCacheSize, maxActiveRequests, maxLowPriorityRequests }) => {
    if (!initialized) {
      cache = new VolumeCache(maxCacheSize);
      queue = new RequestQueue(maxActiveRequests, maxLowPriorityRequests);
      subscribableQueue = new SubscribableRequestQueue(queue);
      initialized = true;
    }
    return Promise.resolve();
  },

  [WorkerMsgType.CREATE_LOADER]: async ({ path, options }) => {
    const pathString = Array.isArray(path) ? path[0] : path;
    const fileType = options?.fileType || pathToFileType(pathString);
    copyOnLoad = fileType === VolumeFileFormat.JSON;
    loader = await createVolumeLoader(path, { ...options, cache, queue: subscribableQueue });
    return loader !== undefined;
  },

  [WorkerMsgType.CREATE_VOLUME]: async (loadSpec) => {
    if (loader === undefined) {
      throw new Error("No loader created");
    }

    return await loader.createImageInfo(rebuildLoadSpec(loadSpec));
  },

  [WorkerMsgType.LOAD_DIMS]: async (loadSpec) => {
    if (loader === undefined) {
      throw new Error("No loader created");
    }
    return await loader.loadDims(rebuildLoadSpec(loadSpec));
  },

  [WorkerMsgType.LOAD_VOLUME_DATA]: async ({ imageInfo, loadSpec, loaderId, loadId }) => {
    if (loader === undefined) {
      throw new Error("No loader created");
    }

    return await loader.loadRawChannelData(
      rebuildImageInfo(imageInfo),
      rebuildLoadSpec(loadSpec),
      (channelIndex, data, atlasDims) => {
        const message: WorkerResponse<WorkerMsgType> = {
          responseKind: WorkerResponseKind.EVENT,
          loaderId,
          loadId,
          channelIndex,
          data,
          atlasDims,
        };
        (self as unknown as Worker).postMessage(message, copyOnLoad ? [] : [data.buffer]);
      }
    );
  },
};

self.onmessage = async <T extends WorkerMsgType>({ data }: MessageEvent<WorkerRequest<T>>) => {
  const { msgId, type, payload } = data;
  let message: WorkerResponse<T>;

  try {
    const response = await messageHandlers[type](payload);
    message = { responseKind: WorkerResponseKind.SUCCESS, msgId, type, payload: response };
  } catch (e) {
    message = { responseKind: WorkerResponseKind.ERROR, msgId, type, payload: (e as Error).message };
  }
  self.postMessage(message);
};

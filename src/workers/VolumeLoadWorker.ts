import { serializeError } from "serialize-error";

import VolumeCache from "../VolumeCache.js";
import { VolumeFileFormat, createVolumeLoader, pathToFileType } from "../loaders/index.js";
import { ThreadableVolumeLoader } from "../loaders/IVolumeLoader.js";
import RequestQueue from "../utils/RequestQueue.js";
import SubscribableRequestQueue from "../utils/SubscribableRequestQueue.js";
import type { WorkerRequest, WorkerRequestPayload, WorkerResponse, WorkerResponsePayload } from "./types.js";
import { WorkerMsgType, WorkerResponseResult } from "./types.js";
import { rebuildImageInfo, rebuildLoadSpec } from "./util.js";

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
      (channelIndex, data, ranges, atlasDims) => {
        const message: WorkerResponse<WorkerMsgType> = {
          responseResult: WorkerResponseResult.EVENT,
          loaderId,
          loadId,
          channelIndex,
          data,
          ranges,
          atlasDims,
        };
        const dataTransfers = data.map((d) => d.buffer);
        (self as unknown as Worker).postMessage(message, copyOnLoad ? [] : dataTransfers);
      }
    );
  },

  [WorkerMsgType.SET_PREFETCH_PRIORITY_DIRECTIONS]: (directions) => {
    // Silently does nothing if the loader isn't an `OMEZarrLoader`
    loader?.setPrefetchPriority(directions);
    return Promise.resolve();
  },

  [WorkerMsgType.SYNCHRONIZE_MULTICHANNEL_LOADING]: (syncChannels) => {
    loader?.syncMultichannelLoading(syncChannels);
    return Promise.resolve();
  },
};

self.onmessage = async <T extends WorkerMsgType>({ data }: MessageEvent<WorkerRequest<T>>) => {
  const { msgId, type, payload } = data;
  let message: WorkerResponse<T>;

  try {
    const response = await messageHandlers[type](payload);
    message = { responseResult: WorkerResponseResult.SUCCESS, msgId, type, payload: response };
  } catch (e) {
    message = { responseResult: WorkerResponseResult.ERROR, msgId, type, payload: serializeError(e) };
  }
  self.postMessage(message);
};

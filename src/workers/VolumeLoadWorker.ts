import { serializeError } from "serialize-error";

import VolumeCache from "../VolumeCache.js";
import { VolumeFileFormat, createVolumeLoader, pathToFileType } from "../loaders/index.js";
import { ThreadableVolumeLoader } from "../loaders/IVolumeLoader.js";
import { VolumeLoadError } from "../loaders/VolumeLoadError.js";
import RequestQueue from "../utils/RequestQueue.js";
import SubscribableRequestQueue from "../utils/SubscribableRequestQueue.js";
import type {
  WorkerMsgTypeWithLoader,
  WorkerRequest,
  WorkerRequestPayload,
  WorkerResponse,
  WorkerResponsePayload,
} from "./types.js";
import { WorkerEventType, WorkerMsgType, WorkerResponseResult } from "./types.js";
import { rebuildLoadSpec } from "./util.js";

let cache: VolumeCache | undefined = undefined;
let queue: RequestQueue | undefined = undefined;
let subscribableQueue: SubscribableRequestQueue | undefined = undefined;
const loaders: Map<number, ThreadableVolumeLoader> = new Map();
let initialized = false;
let copyOnLoad = false;

type MessageHandler<T extends WorkerMsgType> = (
  payload: WorkerRequestPayload<T>,
  loaderId: T extends WorkerMsgTypeWithLoader ? number : void
) => Promise<WorkerResponsePayload<T>>;

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
    const loader = await createVolumeLoader(path, { ...options, cache, queue: subscribableQueue });
    // TODO make an actual loader id rather than this hardcode!
    loaders.set(0, loader);
    return loader !== undefined;
  },

  [WorkerMsgType.CREATE_VOLUME]: async (loadSpec, loaderId) => {
    const loader = loaders.get(loaderId);
    if (loader === undefined) {
      throw new VolumeLoadError("No loader created");
    }

    return await loader.createImageInfo(rebuildLoadSpec(loadSpec));
  },

  [WorkerMsgType.LOAD_DIMS]: async (loadSpec, loaderId) => {
    const loader = loaders.get(loaderId);
    if (loader === undefined) {
      throw new VolumeLoadError("No loader created");
    }
    return await loader.loadDims(rebuildLoadSpec(loadSpec));
  },

  [WorkerMsgType.LOAD_VOLUME_DATA]: ({ imageInfo, loadSpec, loadId }, loaderId) => {
    const loader = loaders.get(loaderId);
    if (loader === undefined) {
      throw new VolumeLoadError("No loader created");
    }

    return loader.loadRawChannelData(
      imageInfo,
      rebuildLoadSpec(loadSpec),
      (imageInfo, loadSpec) => {
        const message: WorkerResponse<WorkerMsgType> = {
          responseResult: WorkerResponseResult.EVENT,
          eventType: WorkerEventType.METADATA_UPDATE,
          loaderId,
          loadId,
          imageInfo,
          loadSpec,
        };
        self.postMessage(message);
      },
      (channelIndex, dtype, data, ranges, atlasDims) => {
        const message: WorkerResponse<WorkerMsgType> = {
          responseResult: WorkerResponseResult.EVENT,
          eventType: WorkerEventType.CHANNEL_LOAD,
          loaderId,
          loadId,
          channelIndex,
          dtype,
          data,
          ranges,
          atlasDims,
        };
        (self as unknown as Worker).postMessage(message, copyOnLoad ? [] : data.map((d) => d.buffer));
      }
    );
  },

  [WorkerMsgType.SET_PREFETCH_PRIORITY_DIRECTIONS]: (directions, loaderId) => {
    const loader = loaders.get(loaderId);
    // Silently does nothing if the loader isn't an `OMEZarrLoader`
    loader?.setPrefetchPriority(directions);
    return Promise.resolve();
  },

  [WorkerMsgType.SYNCHRONIZE_MULTICHANNEL_LOADING]: (syncChannels, loaderId) => {
    const loader = loaders.get(loaderId);
    loader?.syncMultichannelLoading(syncChannels);
    return Promise.resolve();
  },

  [WorkerMsgType.UPDATE_FETCH_OPTIONS]: (fetchOptions, loaderId) => {
    const loader = loaders.get(loaderId);
    loader?.updateFetchOptions(fetchOptions);
    return Promise.resolve();
  },
};

self.onmessage = async <T extends WorkerMsgType>({ data }: MessageEvent<WorkerRequest<T>>) => {
  let message: WorkerResponse<T>;

  try {
    const response = await messageHandlers[data.type](data.payload, data.loaderId);
    message = { ...data, responseResult: WorkerResponseResult.SUCCESS, payload: response };
  } catch (e) {
    message = { ...data, responseResult: WorkerResponseResult.ERROR, payload: serializeError(e) };
  }

  self.postMessage(message);
};

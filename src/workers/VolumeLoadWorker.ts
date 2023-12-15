import VolumeCache from "../VolumeCache";
import { createVolumeLoader } from "../loaders";
import { IVolumeLoader } from "../loaders/IVolumeLoader";
import { WorkerMsgType, WorkerRequest, WorkerRequestPayload, WorkerResponsePayload } from "./types";

let cache: VolumeCache | undefined = undefined;
let loader: IVolumeLoader | undefined = undefined;

type MessageHandlersType = {
  [T in WorkerMsgType]: (payload: WorkerRequestPayload<T>) => Promise<WorkerResponsePayload<T>>;
};

const messageHandlers: MessageHandlersType = {
  [WorkerMsgType.INIT]: ({ maxCacheSize }) => {
    cache = new VolumeCache(maxCacheSize);
    return Promise.resolve();
  },

  [WorkerMsgType.CREATE_LOADER]: async ({ path, options }) => {
    loader = await createVolumeLoader(path, { ...options, cache });
    return loader !== undefined;
  },

  [WorkerMsgType.CREATE_VOLUME]: async (loadSpec) => {
    if (loader === undefined) {
      throw new Error("No loader created");
    }
    const volume = await loader.createVolume(loadSpec);
    return [volume.imageInfo, volume.loadSpec];
  },

  [WorkerMsgType.LOAD_DIMS]: async (loadSpec) => {
    if (loader === undefined) {
      throw new Error("No loader created");
    }
    return await loader.loadDims(loadSpec);
  },

  [WorkerMsgType.LOAD_VOLUME_DATA]: async ({ imageInfo, loadSpec, loaderId, loadId }) => {
    if (loader === undefined) {
      throw new Error("No loader created");
    }
    if (loaderId !== 0) {
      throw new Error("Only one loader is supported");
    }
    const [updatedImageInfo, updatedLoadSpec] = await loader.loadRawChannelData(
      imageInfo,
      loadSpec,
      (data, channelIndex, atlasDims) => {
        self.postMessage({
          isEvent: true,
          loaderId,
          loadId,
          channelIndex,
          data,
          atlasDims,
        });
      }
    );
    return [updatedImageInfo, updatedLoadSpec];
  },
};

self.onmessage = ({ data }: MessageEvent<WorkerRequest<WorkerMsgType>>) => {};

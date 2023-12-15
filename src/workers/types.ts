import { ImageInfo } from "../Volume";
import { CreateLoaderOptions } from "../loaders";
import { LoadSpec, VolumeDims } from "../loaders/IVolumeLoader";

export enum WorkerMsgType {
  INIT,
  CREATE_LOADER,
  CREATE_VOLUME,
  LOAD_DIMS,
  LOAD_VOLUME_DATA,
}

type WorkerMsgBase<T extends WorkerMsgType, P> = {
  isEvent: false;
  msgId: number;
  type: T;
  payload: P;
};

export type WorkerRequestPayload<T extends WorkerMsgType> = {
  [WorkerMsgType.INIT]: {
    maxCacheSize?: number;
  };
  [WorkerMsgType.CREATE_LOADER]: {
    path: string | string[];
    options?: CreateLoaderOptions;
  };
  [WorkerMsgType.CREATE_VOLUME]: LoadSpec;
  [WorkerMsgType.LOAD_DIMS]: LoadSpec;
  [WorkerMsgType.LOAD_VOLUME_DATA]: {
    imageInfo: ImageInfo;
    loadSpec: LoadSpec;
    loaderId: number;
    loadId: number;
  };
}[T];

export type WorkerResponsePayload<T extends WorkerMsgType> = {
  [WorkerMsgType.INIT]: void;
  [WorkerMsgType.CREATE_LOADER]: boolean;
  [WorkerMsgType.CREATE_VOLUME]: [ImageInfo, LoadSpec];
  [WorkerMsgType.LOAD_DIMS]: VolumeDims[];
  [WorkerMsgType.LOAD_VOLUME_DATA]: [ImageInfo | undefined, LoadSpec | undefined];
}[T];

export type WorkerRequest<T extends WorkerMsgType> = WorkerMsgBase<T, WorkerRequestPayload<T>>;
export type WorkerResponse<T extends WorkerMsgType> = WorkerMsgBase<T, WorkerResponsePayload<T>>;

export type ChannelLoadEvent = {
  isEvent: true;
  loaderId: number;
  loadId: number;
  channelIndex: number;
  data: Uint8Array;
  atlasDims?: [number, number];
};

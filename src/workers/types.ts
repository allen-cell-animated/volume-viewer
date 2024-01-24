import { ImageInfo } from "../Volume";
import { CreateLoaderOptions } from "../loaders";
import { LoadSpec, VolumeDims } from "../loaders/IVolumeLoader";

export const enum WorkerMsgType {
  INIT,
  CREATE_LOADER,
  CREATE_VOLUME,
  LOAD_DIMS,
  LOAD_VOLUME_DATA,
}

export const enum WorkerResponseResult {
  SUCCESS,
  ERROR,
  EVENT,
}

type WorkerMsgBase<T extends WorkerMsgType, P> = {
  msgId: number;
  type: T;
  payload: P;
};

export type WorkerRequestPayload<T extends WorkerMsgType> = {
  [WorkerMsgType.INIT]: {
    maxCacheSize?: number;
    maxActiveRequests?: number;
    maxLowPriorityRequests?: number;
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

export type ChannelLoadEvent = {
  loaderId: number;
  loadId: number;
  channelIndex: number;
  data: Uint8Array;
  atlasDims?: [number, number];
};

export type WorkerRequest<T extends WorkerMsgType> = WorkerMsgBase<T, WorkerRequestPayload<T>>;
export type WorkerResponse<T extends WorkerMsgType> =
  | ({ responseKind: WorkerResponseResult.SUCCESS } & WorkerMsgBase<T, WorkerResponsePayload<T>>)
  | ({ responseKind: WorkerResponseResult.ERROR } & WorkerMsgBase<T, string>)
  | ({ responseKind: WorkerResponseResult.EVENT } & ChannelLoadEvent);

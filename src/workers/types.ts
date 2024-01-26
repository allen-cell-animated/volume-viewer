import { ImageInfo } from "../Volume";
import { CreateLoaderOptions } from "../loaders";
import { LoadSpec, VolumeDims } from "../loaders/IVolumeLoader";

/** The types of requests that can be made to the worker. Mostly corresponds to methods on `IVolumeLoader`. */
export const enum WorkerMsgType {
  INIT,
  CREATE_LOADER,
  CREATE_VOLUME,
  LOAD_DIMS,
  LOAD_VOLUME_DATA,
}

/** The kind of response a worker can return - `SUCCESS`, `ERROR`, or `EVENT`. */
export const enum WorkerResponseResult {
  SUCCESS,
  ERROR,
  EVENT,
}

/** All messages to/from a worker carry a `msgId`, a `type`, and a `payload` (whose type is determined by `type`). */
type WorkerMsgBase<T extends WorkerMsgType, P> = {
  msgId: number;
  type: T;
  payload: P;
};

/** Maps each `WorkerMsgType` to the type of the payload of requests of that type. */
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

/** Maps each `WorkerMsgType` to the type of the payload of responses of that type. */
export type WorkerResponsePayload<T extends WorkerMsgType> = {
  [WorkerMsgType.INIT]: void;
  [WorkerMsgType.CREATE_LOADER]: boolean;
  [WorkerMsgType.CREATE_VOLUME]: [ImageInfo, LoadSpec];
  [WorkerMsgType.LOAD_DIMS]: VolumeDims[];
  [WorkerMsgType.LOAD_VOLUME_DATA]: [ImageInfo | undefined, LoadSpec | undefined];
}[T];

/** Currently the only event a loader can produce is a `ChannelLoadEvent` when a single channel loads. */
export type ChannelLoadEvent = {
  loaderId: number;
  loadId: number;
  channelIndex: number;
  data: Uint8Array;
  atlasDims?: [number, number];
};

/** All valid types of worker requests, with some `WorkerMsgType` and a matching payload type. */
export type WorkerRequest<T extends WorkerMsgType> = WorkerMsgBase<T, WorkerRequestPayload<T>>;
/** All valid types of worker responses: `SUCCESS` with a matching payload, `ERROR` with a message, or an `EVENT`. */
export type WorkerResponse<T extends WorkerMsgType> =
  | ({ responseResult: WorkerResponseResult.SUCCESS } & WorkerMsgBase<T, WorkerResponsePayload<T>>)
  | ({ responseResult: WorkerResponseResult.ERROR } & WorkerMsgBase<T, string>)
  | ({ responseResult: WorkerResponseResult.EVENT } & ChannelLoadEvent);

import type { ErrorObject } from "serialize-error";

import type { ImageInfo } from "../ImageInfo.js";
import type { VolumeDims } from "../VolumeDims.js";
import type { CreateLoaderOptions, PrefetchDirection } from "../loaders/index.js";
import type { LoadSpec, LoadedVolumeInfo } from "../loaders/IVolumeLoader.js";
import type { TypedArray, NumberType } from "../types.js";
import type { ZarrLoaderFetchOptions } from "../loaders/OmeZarrLoader.js";

/** The types of requests that can be made to the worker. Mostly corresponds to methods on `IVolumeLoader`. */
export const enum WorkerMsgType {
  INIT,
  CREATE_LOADER,
  CREATE_VOLUME,
  LOAD_DIMS,
  LOAD_VOLUME_DATA,
  SET_PREFETCH_PRIORITY_DIRECTIONS,
  SYNCHRONIZE_MULTICHANNEL_LOADING,
  UPDATE_FETCH_OPTIONS,
}

/** The kind of response a worker can return - `SUCCESS`, `ERROR`, or `EVENT`. */
export const enum WorkerResponseResult {
  SUCCESS,
  ERROR,
  EVENT,
}

/** The kind of events that can occur when loading */
export const enum WorkerEventType {
  /** Fired to update a `Volume`'s `imageInfo` and/or `loadSpec` based on loaded data (time, channels, region, etc.) */
  METADATA_UPDATE,
  /** Fired when data for a channel (or batch of channels) is loaded */
  CHANNEL_LOAD,
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
  [WorkerMsgType.SET_PREFETCH_PRIORITY_DIRECTIONS]: PrefetchDirection[];
  [WorkerMsgType.SYNCHRONIZE_MULTICHANNEL_LOADING]: boolean;
  [WorkerMsgType.UPDATE_FETCH_OPTIONS]: Partial<ZarrLoaderFetchOptions>;
}[T];

/** Maps each `WorkerMsgType` to the type of the payload of responses of that type. */
export type WorkerResponsePayload<T extends WorkerMsgType> = {
  [WorkerMsgType.INIT]: void;
  [WorkerMsgType.CREATE_LOADER]: boolean;
  [WorkerMsgType.CREATE_VOLUME]: LoadedVolumeInfo;
  [WorkerMsgType.LOAD_DIMS]: VolumeDims[];
  [WorkerMsgType.LOAD_VOLUME_DATA]: void;
  [WorkerMsgType.SET_PREFETCH_PRIORITY_DIRECTIONS]: void;
  [WorkerMsgType.SYNCHRONIZE_MULTICHANNEL_LOADING]: void;
  [WorkerMsgType.UPDATE_FETCH_OPTIONS]: void;
}[T];

/** Event for when a batch of channel data loads. */
export type ChannelLoadEvent = {
  eventType: WorkerEventType.CHANNEL_LOAD;
  loaderId: number;
  loadId: number;
  channelIndex: number[];
  dtype: NumberType[];
  data: TypedArray<NumberType>[];
  ranges: [number, number][];
  atlasDims?: [number, number];
};

/** Event for when metadata updates. */
export type MetadataUpdateEvent = {
  eventType: WorkerEventType.METADATA_UPDATE;
  loaderId: number;
  loadId: number;
  imageInfo?: ImageInfo;
  loadSpec?: LoadSpec;
};

/** All valid types of worker requests, with some `WorkerMsgType` and a matching payload type. */
export type WorkerRequest<T extends WorkerMsgType> = WorkerMsgBase<T, WorkerRequestPayload<T>>;
/** All valid types of worker responses: `SUCCESS` with a matching payload, `ERROR` with a message, or an `EVENT`. */
export type WorkerResponse<T extends WorkerMsgType> =
  | ({ responseResult: WorkerResponseResult.SUCCESS } & WorkerMsgBase<T, WorkerResponsePayload<T>>)
  | ({ responseResult: WorkerResponseResult.ERROR } & WorkerMsgBase<T, ErrorObject>)
  | ({ responseResult: WorkerResponseResult.EVENT } & (ChannelLoadEvent | MetadataUpdateEvent));

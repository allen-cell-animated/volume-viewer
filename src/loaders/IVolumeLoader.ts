import { Box3, Vector3 } from "three";

import Volume, { ImageInfo } from "../Volume.js";
import { TypedArray, NumberType } from "../types.js";
import { buildDefaultMetadata } from "./VolumeLoaderUtils.js";
import { PrefetchDirection } from "./zarr_utils/types.js";

export class LoadSpec {
  time = 0;
  multiscaleLevel?: number;
  /** Subregion of volume to load. If not specified, the entire volume is loaded. Specify as floats between 0-1. */
  subregion = new Box3(new Vector3(0, 0, 0), new Vector3(1, 1, 1));
  channels?: number[];
}

export function loadSpecToString(spec: LoadSpec): string {
  const { min, max } = spec.subregion;
  return `${spec.multiscaleLevel}:${spec.time}:x(${min.x},${max.x}):y(${min.y},${max.y}):z(${min.z},${max.z})`;
}

export class VolumeDims {
  // shape: [t, c, z, y, x]
  shape: number[] = [0, 0, 0, 0, 0];
  // spacing: [t, c, z, y, x]; generally expect 1 for non-spatial dimensions
  spacing: number[] = [1, 1, 1, 1, 1];
  spaceUnit = "μm";
  timeUnit = "s";
  // TODO make this an enum?
  dataType = "uint8";
}

export type LoadedVolumeInfo = {
  imageInfo: ImageInfo;
  loadSpec: LoadSpec;
};

/**
 * @callback PerChannelCallback
 * @param {string} imageurl
 * @param {Volume} volume
 * @param {number} channelindex
 */
export type PerChannelCallback = (volume: Volume, channelIndex: number) => void;

/**
 * @callback RawChannelDataCallback - allow lists of channel indices and data arrays to be passed to the callback
 * @param {number[]} channelIndex - The indices of the channels that were loaded
 * @param {NumberType[]} dtype - The data type of the data arrays
 * @param {TypedArray<NumberType>[]} data - The raw data for each channel (renormalized to 0-255 range)
 * @param {[number, number][]} ranges - The min and max values for each channel in their original range
 * @param {[number, number]} atlasDims - The dimensions of the atlas, if the data is in an atlas format
 */
export type RawChannelDataCallback = (
  channelIndex: number[],
  dtype: NumberType[],
  data: TypedArray<NumberType>[],
  ranges: [number, number][],
  atlasDims?: [number, number]
) => void;

/**
 * Loads volume data from a source specified by a `LoadSpec`.
 *
 * Loaders may keep state for reuse between volume creation and volume loading, and should be kept alive until volume
 * loading is complete. (See `createVolume`)
 */
export interface IVolumeLoader {
  /** Use VolumeDims to further refine a `LoadSpec` for use in `createVolume` */
  loadDims(loadSpec: LoadSpec): Promise<VolumeDims[]>;

  /**
   * Create an empty `Volume` from a `LoadSpec`, which must be passed to `loadVolumeData` to begin loading.
   * Optionally pass a callback to respond whenever new channel data is loaded into the volume.
   */
  createVolume(loadSpec: LoadSpec, onChannelLoaded?: PerChannelCallback): Promise<Volume>;

  /**
   * Begin loading a volume's data, as specified in its `LoadSpec`.
   * Pass a callback to respond when this request loads a new channel. This callback will execute after the
   * one assigned in `createVolume`, if any.
   */
  // TODO make this return a promise that resolves when loading is done?
  // TODO this is not cancellable in the sense that any async requests initiated here are not stored
  // in a way that they can be interrupted.
  // TODO explicitly passing a `LoadSpec` is now rarely useful. Remove?
  loadVolumeData(volume: Volume, loadSpec?: LoadSpec, onChannelLoaded?: PerChannelCallback): void;

  /** Change which directions to prioritize when prefetching. Currently only implemented on `OMEZarrLoader`. */
  setPrefetchPriority(directions: PrefetchDirection[]): void;

  /**
   * By default channel data can arrive out of order and at different times.
   * This can cause the rendering to update in a way that is not visually appealing.
   * In particular, during time series playback or Z slice playback, we would like
   * to see all channels update at the same time.
   * @param sync Set true to force all requested channels to load at the same time
   */
  syncMultichannelLoading(sync: boolean): void;
}

/** Abstract class which allows loaders to accept and return types that are easier to transfer to/from a worker. */
export abstract class ThreadableVolumeLoader implements IVolumeLoader {
  /** Unchanged from `IVolumeLoader`. See that interface for details. */
  abstract loadDims(loadSpec: LoadSpec): Promise<VolumeDims[]>;

  /**
   * Creates an `ImageInfo` object from a `LoadSpec`, which may be passed to the `Volume` constructor to create an
   * empty volume that can accept data loaded with the given `LoadSpec`.
   *
   * Also returns a new `LoadSpec` that may have been modified from the input `LoadSpec` to reflect the constraints or
   * abilities of the loader. This new `LoadSpec` should be used when constructing the `Volume`, _not_ the original.
   */
  abstract createImageInfo(loadSpec: LoadSpec): Promise<LoadedVolumeInfo>;

  /**
   * Begins loading per-channel data for the volume specified by `imageInfo` and `loadSpec`.
   *
   * Returns a promise that resolves to reflect any modifications to `imageInfo` and/or `loadSpec` that need to be made
   * based on this load. Actual loaded channel data is passed to `onData` as it is loaded. Depending on the format,
   * the returned array may be in simple 3d dimension order or reflect a 2d atlas. If the latter, the dimensions of the
   * atlas are passed as the third argument to `onData`.
   */
  abstract loadRawChannelData(
    imageInfo: ImageInfo,
    loadSpec: LoadSpec,
    onData: RawChannelDataCallback
  ): Promise<Partial<LoadedVolumeInfo>>;

  setPrefetchPriority(_directions: PrefetchDirection[]): void {
    // no-op by default
  }

  syncMultichannelLoading(_sync: boolean): void {
    // default behavior is async, to update channels as they arrive, depending on each
    // loader's implementation details.
  }

  async createVolume(loadSpec: LoadSpec, onChannelLoaded?: PerChannelCallback): Promise<Volume> {
    const { imageInfo, loadSpec: adjustedLoadSpec } = await this.createImageInfo(loadSpec);
    const vol = new Volume(imageInfo, adjustedLoadSpec, this);
    vol.channelLoadCallback = onChannelLoaded;
    vol.imageMetadata = buildDefaultMetadata(imageInfo);
    return vol;
  }

  async loadVolumeData(
    volume: Volume,
    loadSpecOverride?: LoadSpec,
    onChannelLoaded?: PerChannelCallback
  ): Promise<void> {
    const onChannelData: RawChannelDataCallback = (channelIndices, dtypes, dataArrays, ranges, atlasDims) => {
      for (let i = 0; i < channelIndices.length; i++) {
        const channelIndex = channelIndices[i];
        const dtype = dtypes[i];
        const data = dataArrays[i];
        const range = ranges[i];
        if (atlasDims) {
          volume.setChannelDataFromAtlas(channelIndex, data, atlasDims[0], atlasDims[1], dtype);
        } else {
          volume.setChannelDataFromVolume(channelIndex, data, range, dtype);
        }
        onChannelLoaded?.(volume, channelIndex);
      }
    };

    const spec = { ...loadSpecOverride, ...volume.loadSpec };
    const { imageInfo, loadSpec } = await this.loadRawChannelData(volume.imageInfo, spec, onChannelData);

    if (imageInfo) {
      volume.imageInfo = imageInfo;
      volume.updateDimensions();
    }
    volume.loadSpec = { ...loadSpec, ...spec };
  }
}

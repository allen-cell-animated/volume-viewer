import { Box3, Vector3 } from "three";

import Volume from "../Volume";

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

/**
 * @callback PerChannelCallback
 * @param {string} imageurl
 * @param {Volume} volume
 * @param {number} channelindex
 */
export type PerChannelCallback = (volume: Volume, channelIndex: number) => void;

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
   *
   * Loaders are allowed to assume that they will only be called on a single data source, in order to cache
   * information about that source. Once this method has been called, every subsequent call to it or
   * `loadVolumeData` should reference the same source.
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
}

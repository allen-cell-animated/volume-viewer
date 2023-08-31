import { Box3, Vector3 } from "three";

import Volume from "../Volume";

export class LoadSpec {
  url = "";
  subpath = "";
  scene = 0;
  time = 0;
  // sub-region; if not specified, the entire volume is loaded
  // specify as floats between 0 and 1
  subregion = new Box3(new Vector3(0, 0, 0), new Vector3(1, 1, 1));
}

export function loadSpecToString(spec: LoadSpec): string {
  const { min, max } = spec.subregion;
  return `${spec.url}:${spec.subpath}${spec.scene}:${spec.time}:x(${min.x},${max.x}):y(${min.y},${max.y}):z(${min.z},${max.z})`;
}

export class VolumeDims {
  subpath = "";
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
export type PerChannelCallback = (imageurl: string, volume: Volume, channelIndex: number) => void;

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
   *
   * May cache some values for use on only the next call to `loadVolumeData`; callers should guarantee that the next
   * call to this loader's `loadVolumeData` is made on the returned `Volume` before the volume's state is changed.
   */
  createVolume(loadSpec: LoadSpec): Promise<Volume>;

  /**
   * Begin loading a volume's data, as specified in its `LoadSpec`.
   * Pass a callback to respond whenever a new channel is loaded.
   */
  // TODO make this return a promise that resolves when loading is done?
  // TODO this is not cancellable in the sense that any async requests initiated here are not stored
  // in a way that they can be interrupted.
  loadVolumeData(volume: Volume, onChannelLoaded?: PerChannelCallback, loadSpec?: LoadSpec): void;
}

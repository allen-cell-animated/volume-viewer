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

  toString(): string {
    const { min, max } = this.subregion;
    return `${this.url}:${this.subpath}${this.scene}:${this.time}:x(${min.x},${max.x}):y(${min.y},${max.y}):z(${min.z},${max.z})`;
  }
}

// TODO remove unused type, functions
export type LoadSpecExtent = {
  minx: number;
  miny: number;
  minz: number;
  maxx: number;
  maxy: number;
  maxz: number;
};

/** Converts `LoadSpec` sub-region fields (`minx`, `maxy`, etc.) from [0, 1) range to pixels */
export function convertLoadSpecRegionToPixels<T extends Partial<LoadSpecExtent>>(
  loadSpec: T,
  sizex: number,
  sizey: number,
  sizez: number
): T & LoadSpecExtent {
  const minx = loadSpec.minx !== undefined ? Math.floor(sizex * loadSpec.minx) : 0;
  let maxx = loadSpec.maxx !== undefined ? Math.ceil(sizex * loadSpec.maxx) : sizex;
  const miny = loadSpec.miny !== undefined ? Math.floor(sizey * loadSpec.miny) : 0;
  let maxy = loadSpec.maxy !== undefined ? Math.ceil(sizey * loadSpec.maxy) : sizey;
  const minz = loadSpec.minz !== undefined ? Math.floor(sizez * loadSpec.minz) : 0;
  let maxz = loadSpec.maxz !== undefined ? Math.ceil(sizez * loadSpec.maxz) : sizez;

  // ensure it's always valid to specify the same number at both ends and get a single slice
  if (minx === maxx && minx < sizex) {
    maxx += 1;
  }
  if (miny === maxy && miny < sizey) {
    maxy += 1;
  }
  if (minz === maxz && minz < sizez) {
    maxz += 1;
  }

  return { ...loadSpec, minx, maxx, miny, maxy, minz, maxz };
}

/** Shrinks a `LoadSpec` to fit within a provided extent */
export function fitLoadSpecRegionToExtent<T extends Partial<LoadSpecExtent>>(
  loadSpec: T,
  extent: LoadSpecExtent
): T & LoadSpecExtent {
  const sizex = extent.maxx - extent.minx;
  const sizey = extent.maxy - extent.miny;
  const sizez = extent.maxz - extent.minz;
  const { minx = 0, maxx = 1, miny = 0, maxy = 1, minz = 0, maxz = 1 } = loadSpec;

  return {
    ...loadSpec,
    minx: minx * sizex + extent.minx,
    maxx: maxx * sizex + extent.minx,
    miny: miny * sizey + extent.miny,
    maxy: maxy * sizey + extent.miny,
    minz: minz * sizez + extent.minz,
    maxz: maxz * sizez + extent.minz,
  };
}

export const getExtentSize = (extent: LoadSpecExtent): [number, number, number] => [
  extent.maxx - extent.minx,
  extent.maxy - extent.miny,
  extent.maxz - extent.minz,
];

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

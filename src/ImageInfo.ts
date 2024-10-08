import { type VolumeDims, volumeSize, physicalPixelSize } from "./VolumeDims.js";
import { Vector3, Vector2 } from "three";

export type ImageInfo = Readonly<{
  name: string;

  /** XYZ size of the *original* (level 0) volume, in pixels */
  //originalSize: Vector3;
  /**
   * XY dimensions of the texture atlas used by `RayMarchedAtlasVolume` and `Atlas2DSlice`, in number of z-slice
   * tiles (not pixels). Chosen by the loader to lay out the 3D volume in the squarest possible 2D texture atlas.
   */
  atlasTileDims: [number, number];
  /** Size of the volume (current level), in pixels */
  //volumeSize: Vector3;
  /** Size of the currently loaded subregion, in pixels, in XYZ order */
  subregionSize: [number, number, number];
  /** Offset of the loaded subregion into the total volume, in pixels, in XYZ order */
  subregionOffset: [number, number, number];
  /** Size of a single *original* (not downsampled) pixel, in spatial units */
  //physicalPixelSize: Vector3;
  /** Symbol of physical spatial unit used by `pixelSize` */
  //spatialUnit: string;

  /** Number of channels in the image, accounting for convergence of multiple sources.
   * Because of multiple sources, which is not accounted for in ImageInfo,
   * that this could be different than the number of channels in the multiscaleLevelDims.
   * NOTE Currently there is one ImageInfo per Volume, not per source.
   */
  combinedNumChannels: number;
  /** The names of each channel */
  channelNames: string[];
  /** Optional overrides to default channel colors, in 0-255 range, RGB order */
  channelColors?: [number, number, number][];

  /** Number of timesteps in the time series, or 1 if the image is not a time series */
  //times: number;
  /** Size of each timestep in temporal units */
  //timeScale: number;
  /**
   * Symbol of temporal unit used by `timeScale`, e.g. "hr".
   *
   * If units match one of the following, the viewer will automatically format
   * timestamps to a d:hh:mm:ss.sss format, truncated as an integer of the unit specified.
   * See https://ngff.openmicroscopy.org/latest/index.html#axes-md for a list of valid time units.
   * - "ms", "millisecond" for milliseconds: `d:hh:mm:ss.sss`
   * - "s", "sec", "second", or "seconds" for seconds: `d:hh:mm:ss`
   * - "m", "min", "minute", or "minutes" for minutes: `d:hh:mm`
   * - "h", "hr", "hour", or "hours" for hours: `d:hh`
   * - "d", "day", or "days" for days: `d`
   *
   * The maximum timestamp value is used to determine the maximum unit shown.
   * For example, if the time unit is in seconds, and the maximum time is 90 seconds, the timestamp
   * will be formatted as "{m:ss} (m:s)", and the day and hour segments will be omitted.
   */
  //timeUnit: string;

  /** Number of scale levels available for this volume */
  //numMultiscaleLevels: number;
  /** Dimensions of each scale level, at original size, from the first data source */
  multiscaleLevelDims: VolumeDims[];

  /** The scale level from which this image was loaded, between `0` and `numMultiscaleLevels-1` */
  multiscaleLevel: number;

  transform: {
    /** Translation of the volume from the center of space, in volume voxels in XYZ order */
    translation: [number, number, number];
    /** Rotation of the volume in Euler angles, applied in XYZ order */
    rotation: [number, number, number];
  };

  /** Arbitrary additional metadata not captured by other `ImageInfo` properties */
  userData?: Record<string, unknown>;
}>;

export function defaultImageInfo(): ImageInfo {
  return {
    name: "",
    atlasTileDims: [1, 1],
    subregionSize: [1, 1, 1],
    subregionOffset: [0, 0, 0],
    combinedNumChannels: 1,
    channelNames: ["0"],
    channelColors: [[255, 255, 255]],
    multiscaleLevel: 0,
    multiscaleLevelDims: [
      {
        shape: [1, 1, 1, 1, 1],
        spacing: [1, 1, 1, 1, 1],
        spaceUnit: "",
        timeUnit: "",
        dataType: "uint8",
      },
    ],
    transform: {
      translation: [0, 0, 0],
      rotation: [0, 0, 0],
    },
  };
}

export class CImageInfo {
  imageInfo: ImageInfo;

  constructor(imageInfo?: ImageInfo) {
    this.imageInfo = imageInfo || defaultImageInfo();
  }

  get currentLevelDims(): VolumeDims {
    return this.imageInfo.multiscaleLevelDims[this.imageInfo.multiscaleLevel];
  }

  /** Number of channels in the image */
  get numChannels(): number {
    return this.imageInfo.combinedNumChannels;
    // // 1 is C
    // return this.currentLevelDims.shape[1];
  }

  /** XYZ size of the *original* (not downsampled) volume, in pixels */
  get originalSize(): Vector3 {
    return volumeSize(this.imageInfo.multiscaleLevelDims[0]);
  }

  /** Size of the volume, in pixels */
  get volumeSize(): Vector3 {
    return volumeSize(this.currentLevelDims);
  }

  /** Size of a single *original* (not downsampled) pixel, in spatial units */
  get physicalPixelSize(): Vector3 {
    return physicalPixelSize(this.imageInfo.multiscaleLevelDims[0]);
  }

  /** Symbol of physical spatial unit used by `physicalPixelSize` */
  get spatialUnit(): string {
    return this.imageInfo.multiscaleLevelDims[0].spaceUnit;
  }

  /** Number of timesteps in the time series, or 1 if the image is not a time series */
  get times(): number {
    // 0 is T
    return this.currentLevelDims.shape[0];
  }

  /** Size of each timestep in temporal units */
  get timeScale(): number {
    // 0 is T
    return this.currentLevelDims.spacing[0];
  }

  /**
   * Symbol of temporal unit used by `timeScale`, e.g. "hr".
   *
   * If units match one of the following, the viewer will automatically format
   * timestamps to a d:hh:mm:ss.sss format, truncated as an integer of the unit specified.
   * See https://ngff.openmicroscopy.org/latest/index.html#axes-md for a list of valid time units.
   * - "ms", "millisecond" for milliseconds: `d:hh:mm:ss.sss`
   * - "s", "sec", "second", or "seconds" for seconds: `d:hh:mm:ss`
   * - "m", "min", "minute", or "minutes" for minutes: `d:hh:mm`
   * - "h", "hr", "hour", or "hours" for hours: `d:hh`
   * - "d", "day", or "days" for days: `d`
   *
   * The maximum timestamp value is used to determine the maximum unit shown.
   * For example, if the time unit is in seconds, and the maximum time is 90 seconds, the timestamp
   * will be formatted as "{m:ss} (m:s)", and the day and hour segments will be omitted.
   */
  get timeUnit(): string {
    return this.currentLevelDims.timeUnit;
  }

  /** Number of scale levels available for this volume */
  get numMultiscaleLevels(): number {
    return this.imageInfo.multiscaleLevelDims.length;
  }

  /** The names of each channel */
  get channelNames(): string[] {
    return this.imageInfo.channelNames;
  }

  /** Optional overrides to default channel colors, in 0-255 range */
  get channelColors(): [number, number, number][] | undefined {
    return this.imageInfo.channelColors;
  }

  /** Size of the currently loaded subregion, in pixels */
  get subregionSize(): Vector3 {
    return new Vector3(...this.imageInfo.subregionSize);
  }

  /** Offset of the loaded subregion into the total volume, in pixels */
  get subregionOffset(): Vector3 {
    return new Vector3(...this.imageInfo.subregionOffset);
  }

  get multiscaleLevel(): number {
    return this.imageInfo.multiscaleLevel;
  }

  /**
   * XY dimensions of the texture atlas used by `RayMarchedAtlasVolume` and `Atlas2DSlice`, in number of z-slice
   * tiles (not pixels). Chosen by the loader to lay out the 3D volume in the squarest possible 2D texture atlas.
   */
  get atlasTileDims(): Vector2 {
    return new Vector2(...this.imageInfo.atlasTileDims);
  }

  get transform(): { translation: Vector3; rotation: Vector3 } {
    return {
      translation: new Vector3(...this.imageInfo.transform.translation),
      rotation: new Vector3(...this.imageInfo.transform.rotation),
    };
  }
}

export function computeAtlasSize(imageInfo: ImageInfo): [number, number] {
  const { atlasTileDims } = imageInfo;
  const volDims = imageInfo.multiscaleLevelDims[imageInfo.multiscaleLevel];
  // TCZYX: 4 = x, 3 = y
  return [atlasTileDims[0] * volDims.shape[4], atlasTileDims[1] * volDims.shape[3]];
}

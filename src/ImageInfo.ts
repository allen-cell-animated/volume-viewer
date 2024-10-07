import { type VolumeDims2, volumeSize, physicalPixelSize } from "./VolumeDims";
import { Vector3 } from "three";

export type ImageInfo2 = Readonly<{
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
  /** Size of the currently loaded subregion, in pixels */
  subregionSize: [number, number, number];
  /** Offset of the loaded subregion into the total volume, in pixels */
  subregionOffset: [number, number, number];
  /** Size of a single *original* (not downsampled) pixel, in spatial units */
  //physicalPixelSize: Vector3;
  /** Symbol of physical spatial unit used by `pixelSize` */
  //spatialUnit: string;

  /** Number of channels in the image, accounting for convergence of multiple sources */
  combinedNumChannels: number;
  /** The names of each channel */
  channelNames: string[];
  /** Optional overrides to default channel colors, in 0-255 range */
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
  // TODO THIS DATA IS SOMEWHAT REDUNDANT WITH SOME OF THE OTHER FIELDS IN HERE
  multiscaleLevelDims: VolumeDims2[];

  /** The scale level from which this image was loaded, between `0` and `numMultiscaleLevels-1` */
  multiscaleLevel: number;

  transform: {
    /** Translation of the volume from the center of space, in volume voxels */
    translation: [number, number, number];
    /** Rotation of the volume in Euler angles, applied in XYZ order */
    rotation: [number, number, number];
  };

  /** Arbitrary additional metadata not captured by other `ImageInfo` properties */
  userData?: Record<string, unknown>;
}>;

export function defaultImageInfo(): ImageInfo2 {
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
  imageInfo: ImageInfo2;
  constructor(imageInfo?: ImageInfo2) {
    this.imageInfo = imageInfo || defaultImageInfo();
  }

  get currentLevelDims(): VolumeDims2 {
    return this.imageInfo.multiscaleLevelDims[this.imageInfo.multiscaleLevel];
  }
  get numChannels(): number {
    // 1 is C
    return this.currentLevelDims.shape[1];
  }
  get originalSize(): Vector3 {
    return volumeSize(this.imageInfo.multiscaleLevelDims[0]);
  }
  get volumeSize(): Vector3 {
    return volumeSize(this.currentLevelDims);
  }
  get physicalPixelSize(): Vector3 {
    return physicalPixelSize(this.currentLevelDims);
  }
  get spatialUnit(): string {
    return this.currentLevelDims.spaceUnit;
  }
  get times(): number {
    // 0 is T
    return this.currentLevelDims.shape[0];
  }
  get timeScale(): number {
    // 0 is T
    return this.currentLevelDims.spacing[0];
  }
  get timeUnit(): string {
    return this.currentLevelDims.timeUnit;
  }
  get numMultiscaleLevels(): number {
    return this.imageInfo.multiscaleLevelDims.length;
  }
}

import { Camera, OrthographicCamera, PerspectiveCamera, Vector3 } from "three";

export interface Bounds {
  bmin: Vector3;
  bmax: Vector3;
}

// numeric types compatible with zarrita.js.
// see https://github.com/manzt/zarrita.js/blob/main/packages/core/src/metadata.ts
export type Int8 = "int8";
export type Int16 = "int16";
export type Int32 = "int32";
export type Int64 = "int64";
export type Uint8 = "uint8";
export type Uint16 = "uint16";
export type Uint32 = "uint32";
export type Uint64 = "uint64";
export type Float32 = "float32";
export type Float64 = "float64";
export type NumberType = Int8 | Int16 | Int32 | Uint8 | Uint16 | Uint32 | Float32 | Float64;
export type TypedArray<D> = D extends Int8
  ? Int8Array
  : D extends Int16
  ? Int16Array
  : D extends Int32
  ? Int32Array
  : D extends Int64
  ? BigInt64Array
  : D extends Uint8
  ? Uint8Array
  : D extends Uint16
  ? Uint16Array
  : D extends Uint32
  ? Uint32Array
  : D extends Uint64
  ? BigUint64Array
  : D extends Float32
  ? Float32Array
  : D extends Float64
  ? Float64Array
  : never;

export const ARRAY_CONSTRUCTORS = {
  int8: Int8Array,
  int16: Int16Array,
  int32: Int32Array,
  int64: globalThis.BigInt64Array,
  uint8: Uint8Array,
  uint16: Uint16Array,
  uint32: Uint32Array,
  uint64: globalThis.BigUint64Array,
  float32: Float32Array,
  float64: Float64Array,
};

export interface FuseChannel {
  chIndex: number;
  lut: Uint8Array;
  // zero is a sentinel value to disable from fusion
  rgbColor: [number, number, number] | number;
}

/** If `FuseChannel.rgbColor` is this value, it is disabled from fusion. */
export const FUSE_DISABLED_RGB_COLOR = 0;

/**
 * Provide options to control the visual appearance of a Volume
 * @typedef {Object} VolumeChannelDisplayOptions
 * @property {boolean} enabled array of boolean per channel
 * @property {Array.<number>} color array of rgb per channel
 * @property {Array.<number>} specularColor array of rgb per channel
 * @property {Array.<number>} emissiveColor array of rgb per channel
 * @property {number} glossiness array of float per channel
 * @property {boolean} isosurfaceEnabled array of boolean per channel
 * @property {number} isovalue array of number per channel
 * @property {number} isosurfaceOpacity array of number per channel
 * @example let options = {
   };
 */
export interface VolumeChannelDisplayOptions {
  enabled?: boolean;
  color?: [number, number, number];
  specularColor?: [number, number, number];
  emissiveColor?: [number, number, number];
  glossiness?: number;
  isosurfaceEnabled?: boolean;
  isovalue?: number;
  isosurfaceOpacity?: number;
}

export enum RenderMode {
  RAYMARCH = 0,
  PATHTRACE = 1,
  SLICE = 2,
}

/**
 * Provide options to control the visual appearance of a Volume
 * @typedef {Object} VolumeDisplayOptions
 * @property {Array.<VolumeChannelDisplayOptions>} channels array of channel display options
 * @property {number} density
 * @property {Array.<number>} translation xyz
 * @property {Array.<number>} rotation xyz angles in radians
 * @property {number} maskChannelIndex
 * @property {number} maskAlpha
 * @property {Array.<number>} clipBounds [xmin, xmax, ymin, ymax, zmin, zmax] all range from 0 to 1 as a percentage of the volume on that axis
 * @property {Array.<number>} scale xyz voxel size scaling
 * @property {boolean} maxProjection true or false (ray marching)
 * @property {number} renderMode 0 for raymarch, 1 for pathtrace
 * @property {number} shadingMethod 0 for phase, 1 for brdf, 2 for hybrid (path tracer)
 * @property {Array.<number>} gamma [min, max, scale]
 * @property {number} primaryRayStepSize in voxels
 * @property {number} secondaryRayStepSize in voxels
 * @property {boolean} showBoundingBox true or false
 * @property {Array.<number>} boundingBoxColor r,g,b for bounding box lines
 * @example let options = {
   };
 */
export interface VolumeDisplayOptions {
  channels?: VolumeChannelDisplayOptions[];
  density?: number;
  translation?: [number, number, number];
  rotation?: [number, number, number];
  maskChannelIndex?: number;
  maskAlpha?: number;
  clipBounds?: [number, number, number, number, number, number];
  maxProjection?: boolean;
  renderMode?: RenderMode;
  shadingMethod?: number;
  gamma?: [number, number, number];
  primaryRayStepSize?: number;
  secondaryRayStepSize?: number;
  showBoundingBox?: boolean;
  boundingBoxColor?: [number, number, number];
}

export const isOrthographicCamera = (def: Camera): def is OrthographicCamera =>
  def && (def as OrthographicCamera).isOrthographicCamera;

export const isPerspectiveCamera = (def: Camera): def is PerspectiveCamera =>
  def && (def as PerspectiveCamera).isPerspectiveCamera;

export const enum ViewportCorner {
  TOP_LEFT = "top_left",
  TOP_RIGHT = "top_right",
  BOTTOM_LEFT = "bottom_left",
  BOTTOM_RIGHT = "bottom_right",
}
export const isTop = (corner: ViewportCorner): boolean =>
  corner === ViewportCorner.TOP_LEFT || corner === ViewportCorner.TOP_RIGHT;
export const isRight = (corner: ViewportCorner): boolean =>
  corner === ViewportCorner.TOP_RIGHT || corner === ViewportCorner.BOTTOM_RIGHT;

export const DATARANGE_UINT8: [number, number] = [0, 255];

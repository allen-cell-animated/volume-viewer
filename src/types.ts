import { Camera, OrthographicCamera, Vector3 } from "three";

export interface Bounds {
  bmin: Vector3;
  bmax: Vector3;
}

export interface FuseChannel {
  chIndex: number;
  lut: Uint8Array;
  // zero is a sentinel value to disable from fusion
  rgbColor: [number, number, number] | 0;
}

/**
 * Provide options to control the visual appearance of a Volume
 * @typedef {Object} VolumeChannelDisplayOptions
 * @property {boolean} enabled array of boolean per channel
 * @property {<Array.<number>} color array of rgb per channel
 * @property {<Array.<number>} specularColor array of rgb per channel
 * @property {<Array.<number>} emissiveColor array of rgb per channel
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
  scale?: [number, number, number];
  maxProjection?: boolean;
  renderMode?: number;
  shadingMethod?: number;
  gamma?: [number, number, number];
  primaryRayStepSize?: number;
  secondaryRayStepSize?: number;
  showBoundingBox?: boolean;
  boundingBoxColor?: [number, number, number];
}

export const isOrthographicCamera = (def: Camera): def is OrthographicCamera =>
  def && (def as OrthographicCamera).isOrthographicCamera;

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

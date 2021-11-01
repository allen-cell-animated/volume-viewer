import { Camera, OrthographicCamera, Vector3 } from "three";

export interface Bounds {
  bmin: Vector3;
  bmax: Vector3;
}

export interface FuseChannel {
  chIndex: number;
  lut: Uint8Array;
  // zero is a sentinel value to disable from fusion
  rgbColor: [number, number, number] | number;
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
  enabled: boolean;
  color: [number, number, number];
  specularColor: [number, number, number];
  emissiveColor: [number, number, number];
  glossiness: number;
  isosurfaceEnabled: boolean;
  isovalue: number;
  isosurfaceOpacity: number;
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
}

export const isOrthographicCamera = (def: Camera): def is OrthographicCamera =>
  def && (def as OrthographicCamera).isOrthographicCamera;

export interface ChannelGuiOptions {
  colorD: [number, number, number];
  colorS: [number, number, number];
  colorE: [number, number, number];
  window: number;
  level: number;
  glossiness: number;
  isovalue: number;
  isosurface: boolean;
  enabled: boolean,
  autoIJ: (channelNum: number) => void;
  auto0: (channelNum: number) => void;
  bestFit: (channelNum: number) => void;
  pct50_98: (channelNum: number) => void;
  colorizeEnabled: boolean;
  colorize: (channelNum: number) => void;
  colorizeAlpha: number;
}
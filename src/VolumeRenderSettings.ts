import { Euler, Vector2, Vector3 } from "three";
import Volume from "./Volume";
import { Bounds } from "./types";

/**
 * Marks groups of related settings that may have changed.
 */
export enum SettingsFlags {
  /** parameters: translation, rotation, scale, currentScale, flipAxes */
  TRANSFORM = 1,
  /** parameters: gammaMin, gammaLevel, gammaMax, brightness*/
  CAMERA = 2,
  /** parameters: showBoundingBox, boundingBoxColor */
  BOUNDING_BOX = 4,
  /** parameters: bounds, zSlice */
  ROI = 8,
  /** parameters: maskChannelIndex, maskAlpha */
  MASK = 16,
  /** parameters: density, specular, emissive, glossiness */
  MATERIAL = 32,
  /** parameters: resolution, useInterpolation, pixelSamplingRate, primaryRayStepSize, secondaryRayStepSize*/
  SAMPLING = 64,
  /** parameters: isOrtho, orthoScale, viewAxis, visible, maxProjectMode */
  VIEW = 128,
  ALL = Number.MAX_SAFE_INTEGER,
}

export enum Axis {
  X = "x",
  Y = "y",
  Z = "z",
  NONE = "",
}

/**
 * Holds shared settings for configuring `VolumeRenderImpl` instances.
 */
export type VolumeRenderSettings = {
  // TRANSFORM
  translation: Vector3;
  rotation: Euler;
  scale: Vector3;
  currentScale: Vector3;
  flipAxes: Vector3;

  // VIEW
  isOrtho: boolean;
  orthoScale: number;
  viewAxis: Axis;
  visible: boolean;
  maxProjectMode: boolean;

  // CAMERA
  gammaMin: number;
  gammaLevel: number;
  gammaMax: number;
  brightness: number;

  // MASK
  maskChannelIndex: number;
  maskAlpha: number;

  // MATERIAL
  density: number;
  specular: [number, number, number][];
  emissive: [number, number, number][];
  glossiness: number[];

  // ROI
  bounds: Bounds;
  zSlice: number;

  // BOUNDING_BOX
  showBoundingBox: boolean;
  boundingBoxColor: [number, number, number];

  // SAMPLING
  resolution: Vector2;
  useInterpolation: boolean;
  pixelSamplingRate: number;
  primaryRayStepSize: number;
  secondaryRayStepSize: number;
};

/**
 * Returns a VolumeRenderSettings object with default fields. Default objects
 * created with this method will not have shared references.
 *
 * Note that default objects have volume-dependent properties that should be updated
 * with `VolumeRenderSettingUtils.updateWithVolume()`.
 */
export const defaultVolumeRenderSettings = (): VolumeRenderSettings => {
  return {
    translation: new Vector3(0, 0, 0),
    rotation: new Euler(),
    scale: new Vector3(1, 1, 1),
    currentScale: new Vector3(1, 1, 1),
    isOrtho: false,
    viewAxis: Axis.NONE,
    orthoScale: 1.0,
    flipAxes: new Vector3(1, 1, 1),
    maskChannelIndex: -1,
    maskAlpha: 1.0,
    gammaMin: 0.0,
    gammaLevel: 1.0,
    gammaMax: 1.0,
    density: 0,
    brightness: 0,
    showBoundingBox: false,
    bounds: {
      bmin: new Vector3(-0.5, -0.5, -0.5),
      bmax: new Vector3(0.5, 0.5, 0.5),
    },
    boundingBoxColor: [1.0, 1.0, 0.0],
    primaryRayStepSize: 1.0,
    secondaryRayStepSize: 1.0,
    useInterpolation: true,
    visible: true,
    maxProjectMode: false,
    // volume-dependent properties
    zSlice: 0,
    specular: new Array(1).fill([0, 0, 0]),
    emissive: new Array(1).fill([0, 0, 0]),
    glossiness: new Array(1).fill(0),

    pixelSamplingRate: 0.75,
    resolution: new Vector2(1, 1),
  };
};

/**
 * Static utility class for interacting with VolumeRenderSettings.
 */
export class VolumeRenderSettingUtils {
  public static resizeWithVolume(renderSettings: VolumeRenderSettings, volume: Volume): void {
    renderSettings.zSlice = Math.floor(volume.z / 2);
    renderSettings.specular = new Array(volume.num_channels).fill([0, 0, 0]);
    renderSettings.emissive = new Array(volume.num_channels).fill([0, 0, 0]);
    renderSettings.glossiness = new Array(volume.num_channels).fill(0);
  }
}

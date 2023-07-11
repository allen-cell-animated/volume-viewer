import { Euler, Vector2, Vector3 } from "three";
import Volume from "./Volume";
import { Bounds } from "./types";

/**
 * Marks groups of related settings that may have changed.
 */
export enum SettingsFlags {
  NONE = 0,
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
  RESOLUTION_AND_SAMPLING = 64,
  /** parameters: isOrtho, orthoScale, viewAxis, visible */
  VIEW = 128,
  ALL = Number.MAX_SAFE_INTEGER,
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
  viewAxis: "x" | "y" | "z" | "3D"; // TODO: Replace with enum
  visible: boolean;

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
  
  // RESOLUTION_AND_SAMPLING  
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
    viewAxis: "3D",
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

  /**
   * Recursively compares two arrays.
   * Non-array elements are compared using strict equality comparison.
   */
  private static compareArray(a1: unknown[], a2: unknown[]): boolean {
    if (a1.length !== a2.length) {
      return false;
    }
    for (let i = 0; i < a1.length; i++) {
      const elem1 = a1[i];
      const elem2 = a2[i];
      if (elem1 instanceof Array && elem2 instanceof Array) {
        if (!this.compareArray(elem1, elem2)) {
          return false;
        }
      } else if (elem1 !== elem2) {
        return false;
      }
    }
    return true;
  }

  /**
   * Compares two VolumeRenderSettings objects.
   * @returns true if both objects have identical settings.
   */
  public static isEqual(o1: VolumeRenderSettings, o2: VolumeRenderSettings): boolean {
    for (const key of Object.keys(o1)) {
      const v1 = o1[key];
      const v2 = o2[key];
      if (v1 instanceof Array) {
        if (!this.compareArray(o1[key], o2[key])) {
          return false;
        }
      } else if (v1 && v1.bmin !== undefined) {
        // Bounds object
        const bounds1 = v1 as Bounds;
        const bounds2 = v2 as Bounds;
        if (!bounds1.bmin.equals(bounds2.bmin) || !bounds1.bmax.equals(bounds2.bmax)) {
          return false;
        }
      } else if (v1 instanceof Vector3 || v1 instanceof Vector2 || v1 instanceof Euler) {
        if (!v1.equals(o2[key])) {
          return false;
        }
      } else {
        // number, boolean, string
        if (v1 !== o2[key]) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Recursively creates and returns a deep copy of an array.
   * Note: assumes values in the array are either primitives (numbers) or arrays of primitives.
   */
  private static deepCopyArray(a: unknown[]): unknown[] {
    const b: unknown[] = new Array(a.length);
    for (let i = 0; i < a.length; i++) {
      const val = a[i];
      if (val instanceof Array) {
        b[i] = this.deepCopyArray(val);
      } else {
        b[i] = val;
      }
    }
    return b;
  }

  /**
   * Creates a deep copy of a VolumeRenderSettings object.
   * @param src The object to create a clone of.
   * @returns a new VolumeRenderSettings object with identical fields that do not
   * share references with the original settings object.
   */
  public static clone(src: VolumeRenderSettings): VolumeRenderSettings {
    const dst = defaultVolumeRenderSettings();
    for (const key of Object.keys(src)) {
      const val = src[key];
      if (val instanceof Array) {
        dst[key] = this.deepCopyArray(val);
      } else if (key === "bounds") {
        // Bounds
        dst.bounds.bmax = src.bounds.bmax.clone();
        dst.bounds.bmin = src.bounds.bmin.clone();
      } else if (val instanceof Vector3 || val instanceof Vector2 || val instanceof Euler) {
        dst[key] = val.clone();
      } else if (val instanceof String) {
        dst[key] = "" + val;
      } else {
        // boolean, number, other primitives
        dst[key] = val;
      }
    }
    return dst;
  }
}

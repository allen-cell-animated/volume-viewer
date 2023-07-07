import { Euler, Vector2, Vector3 } from "three";
import Volume from "./Volume";
import { Bounds } from "./types";

export type VolumeRenderSettings = {
  translation: Vector3;
  rotation: Euler;

  scale: Vector3;
  isOrtho: boolean;
  orthoScale: number;
  // TODO: Replace with enum
  orthoAxis: "x" | "y" | "z" | null;
  currentScale: Vector3;

  flipAxes: Vector3;
  maskChannelIndex: number;
  maskAlpha: number;
  gammaMin: number;
  gammaLevel: number;
  gammaMax: number;
  density: number;
  brightness: number;

  showBoundingBox: boolean;
  bounds: Bounds;
  boundingBoxColor: [number, number, number];

  useInterpolation: boolean;
  visible: boolean;

  zSlice: number;
  specular: [number, number, number][];
  emissive: [number, number, number][];
  glossiness: number[];

  primaryRayStepSize: number;
  secondaryRayStepSize: number;

  // scale factor is a huge optimization.  Maybe use 1/dpi scale
  pixelSamplingRate: number;
  resolution: Vector2;
};

/**
 * Returns
 * @param volume
 * @returns
 */
export const defaultVolumeRenderSettings = (): VolumeRenderSettings => {
  return {
    translation: new Vector3(0, 0, 0),
    rotation: new Euler(),
    scale: new Vector3(1, 1, 1),
    currentScale: new Vector3(1, 1, 1),
    isOrtho: false,
    orthoAxis: null,
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

export class VolumeRenderSettingUtils {

  public static updateWithVolume(renderSettings: VolumeRenderSettings, volume: Volume): void {
    renderSettings.zSlice = Math.floor(volume.z / 2);
    renderSettings.specular = new Array(volume.num_channels).fill([0, 0, 0]);
    renderSettings.emissive = new Array(volume.num_channels).fill([0, 0, 0]);
    renderSettings.glossiness = new Array(volume.num_channels).fill(0);
  }

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

  public static isEqual(s1: VolumeRenderSettings, s2: VolumeRenderSettings): boolean {
    for (let key of Object.keys(s1)) {  
      const v1 = s1[key];
      const v2 = s2[key];
      if (v1 instanceof Array) {
        if (!this.compareArray(s1[key], s2[key])) {
          return false;
        }
      } else if (v1 && v1.bmin !== undefined) {  // Bounds object
        const bounds1 = v1 as Bounds;
        const bounds2 = v2 as Bounds;
        if (!bounds1.bmin.equals(bounds2.bmin) || !bounds1.bmax.equals(bounds2.bmax)) {
          return false;
        }
      } else if (v1 instanceof Vector3 || v1 instanceof Vector2 || v1 instanceof Euler) {
        if(!v1.equals(s2[key])) {
          return false;
        }
      } else {  // Vector3, Euler, number, boolean, string
        if (v1 !== s2[key]) {
          return false;
        }
      }
    }
    return true;
  }

  private static deepCopyArray<T>(a: unknown[]): unknown[] {
    const b: unknown[] = new Array(a.length);
    for (let i = 0; i < a.length; i++) { 
      const val = a[i];
      // Currently assumes only arrays of numbers (or arrays of arrays of numbers).
      if (val instanceof Array) {
        b[i] = this.deepCopyArray(val);
      } else {
        b[i] = val;
      }
    } 
    return b;
  }

  public static clone(src: VolumeRenderSettings): VolumeRenderSettings {
    const dst = defaultVolumeRenderSettings();
    for (let key of Object.keys(src)) { 
      const val = src[key];
      if (val instanceof Array) {
        dst[key] = this.deepCopyArray(val);
      } else if (key === "bounds") { // Bounds
        dst.bounds.bmax = src.bounds.bmax.clone();
        dst.bounds.bmin = src.bounds.bmin.clone();
      } else if (val instanceof Vector3 || val instanceof Vector2 ||val instanceof Euler) {
        dst[key] = val.clone();
      } else if (val instanceof String) {
        dst[key] = "" + val;
      } else {  // boolean, number, other primitives
        dst[key] = val;
      }
    }
    return dst;
  }
}



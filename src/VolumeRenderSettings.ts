import { Euler, Vector2, Vector3 } from "three";
import Volume from "./Volume";
import { Bounds } from "./types";

/**
 * Marks groups of related settings that may have changed.
 */
export enum SettingsFlags {
  /** parameters: translation, rotation, scale, contentSize, contentOffset, flipAxes */
  TRANSFORM = 0b00000001,
  /** parameters: gammaMin, gammaLevel, gammaMax, brightness*/
  CAMERA = 0b00000010,
  /** parameters: showBoundingBox, boundingBoxColor */
  BOUNDING_BOX = 0b00000100,
  /** parameters: bounds, zSlice */
  ROI = 0b00001000,
  /** parameters: maskChannelIndex, maskAlpha */
  MASK = 0b00010000,
  /** parameters: density, specular, emissive, glossiness */
  MATERIAL = 0b00100000,
  /** parameters: resolution, useInterpolation, pixelSamplingRate, primaryRayStepSize, secondaryRayStepSize*/
  SAMPLING = 0b01000000,
  /** parameters: isOrtho, orthoScale, viewAxis, visible, maxProjectMode */
  VIEW = 0b10000000,
  ALL = 0b11111111,
}

export enum Axis {
  X = "x",
  Y = "y",
  Z = "z",
  /** Alias for NONE, indicates 3D mode */
  XYZ = "",
  /** No current axis, indicates 3D mode */
  NONE = "",
}

/**
 * Holds shared settings for configuring `VolumeRenderImpl` instances.
 */
export class VolumeRenderSettings {
  // TRANSFORM
  public translation: Vector3;
  public rotation: Euler;
  public scale: Vector3;
  public contentSize: Vector3;
  public contentOffset: Vector3;
  public flipAxes: Vector3;

  // VIEW
  public isOrtho: boolean;
  public orthoScale: number;
  public viewAxis: Axis;
  public visible: boolean;
  public maxProjectMode: boolean;
  // CAMERA
  public gammaMin: number;
  public gammaLevel: number;
  public gammaMax: number;
  public brightness: number;

  // MASK
  public maskChannelIndex: number;
  public maskAlpha: number;

  // MATERIAL
  public density: number;
  public specular: [number, number, number][];
  public emissive: [number, number, number][];
  public glossiness: number[];

  // ROI
  public bounds: Bounds;
  public zSlice: number;

  // BOUNDING_BOX
  public showBoundingBox: boolean;
  public boundingBoxColor: [number, number, number];

  // SAMPLING
  public resolution: Vector2;
  public useInterpolation: boolean;
  public pixelSamplingRate: number;
  public primaryRayStepSize: number;
  public secondaryRayStepSize: number;

  /**
   * Creates a new VolumeRenderSettings object with default fields.
   * @param volume Optional volume data parameter used to initialize size-dependent settings.
   */
  constructor(volume?: Volume) {
    this.translation = new Vector3(0, 0, 0);
    this.rotation = new Euler();
    this.scale = new Vector3(1, 1, 1);
    this.contentSize = new Vector3(1, 1, 1);
    this.contentOffset = new Vector3(0, 0, 0);
    this.isOrtho = false;
    this.viewAxis = Axis.NONE;
    this.orthoScale = 1.0;
    this.flipAxes = new Vector3(1, 1, 1);
    this.maskChannelIndex = -1;
    this.maskAlpha = 1.0;
    this.gammaMin = 0.0;
    this.gammaLevel = 1.0;
    this.gammaMax = 1.0;
    this.density = 0;
    this.brightness = 0;
    this.showBoundingBox = false;
    this.bounds = {
      bmin: new Vector3(-0.5, -0.5, -0.5),
      bmax: new Vector3(0.5, 0.5, 0.5),
    };
    this.boundingBoxColor = [1.0, 1.0, 0.0];
    this.primaryRayStepSize = 1.0;
    this.secondaryRayStepSize = 1.0;
    this.useInterpolation = true;
    this.visible = true;
    this.maxProjectMode = false;
    // volume-dependent properties
    if (volume) {
      this.zSlice = Math.floor(volume.z / 2);
      this.specular = new Array(volume.num_channels).fill([0, 0, 0]);
      this.emissive = new Array(volume.num_channels).fill([0, 0, 0]);
      this.glossiness = new Array(volume.num_channels).fill(0);
    } else {
      this.zSlice = 0;
      this.specular = [[0, 0, 0]];
      this.emissive = [[0, 0, 0]];
      this.glossiness = [0];
    }
    this.pixelSamplingRate = 0.75;
    this.resolution = new Vector2(1, 1);
  }

  public resizeWithVolume(volume: Volume): void {
    this.zSlice = Math.floor(volume.z / 2);
    this.specular = new Array(volume.num_channels).fill([0, 0, 0]);
    this.emissive = new Array(volume.num_channels).fill([0, 0, 0]);
    this.glossiness = new Array(volume.num_channels).fill(0);
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
  public isEqual(o2: VolumeRenderSettings): boolean {
    for (const key of Object.keys(this)) {
      const v1 = this[key];
      const v2 = o2[key];
      if (v1 instanceof Array) {
        if (!VolumeRenderSettings.compareArray(v1, v2)) {
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
        if (!v1.equals(v2)) {
          return false;
        }
      } else {
        // number, boolean, string
        if (v1 !== v2) {
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
   * Creates a deep copy of this VolumeRenderSettings object.
   * @param src The object to create a clone of.
   * @returns a new VolumeRenderSettings object with identical fields that do not
   * share references with the original settings object.
   */
  public clone(): VolumeRenderSettings {
    const dst = new VolumeRenderSettings(); // initialize with empty volume
    for (const key of Object.keys(this)) {
      const val = this[key];
      if (val instanceof Array) {
        dst[key] = VolumeRenderSettings.deepCopyArray(val);
      } else if (key === "bounds") {
        // must use key string here because Bounds is a type alias and not a class
        dst.bounds.bmax = this.bounds.bmax.clone();
        dst.bounds.bmin = this.bounds.bmin.clone();
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

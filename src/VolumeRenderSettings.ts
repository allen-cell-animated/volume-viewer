import { Euler, Vector3 } from "three";
import Volume from "./Volume";
import { Bounds } from "./types";
import VolumeDrawable from "./VolumeDrawable";

export type VolumeRenderSettings = {
  translation: Vector3;
  rotation: Euler;

  scale: Vector3;
  isOrtho: boolean;
  orthoScale: number;
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
  };
};

export class VolumeRenderSettingUtils {

  public static updateWithVolume(renderSettings: VolumeRenderSettings, volume: Volume): void {
    renderSettings.zSlice = Math.floor(volume.z / 2);
    renderSettings.specular = new Array(volume.num_channels).fill([0, 0, 0]);
    renderSettings.emissive = new Array(volume.num_channels).fill([0, 0, 0]);
    renderSettings.glossiness = new Array(volume.num_channels).fill(0);
  }

  public static isEqual(s1: VolumeRenderSettings, s2: VolumeRenderSettings): boolean {
    for (let key of Object.keys(s1)) {
      
    }
  }

  // TODO: Replace JSON stringify/parsing
  public static clone(sourceSettings: VolumeRenderSettings): VolumeRenderSettings {
    return JSON.parse(JSON.stringify(sourceSettings));
  }
}



import { Euler, Vector3 } from "three";
import Volume from "./Volume";
import { Bounds } from "./types";
import VolumeDrawable from "./VolumeDrawable";

export type VolumeRenderSettings = {
  translation: Vector3,
  rotation: Euler,

  scale: Vector3,
  isOrtho: boolean,
  orthoScale: number,
  orthoAxis: "x" | "y" | "z" | null;
  currentScale: Vector3,

  flipAxes: Vector3,
  maskChannelIndex: number,
  maskAlpha: number,
  gammaMin: number,
  gammaLevel: number,
  gammaMax: number,
  density: number,
  brightness: number,

  showBoundingBox: boolean,
  bounds: Bounds,
  boundingBoxColor: [number, number, number],

  useInterpolation: boolean,
  visible: boolean,

  zSlice: number,
  specular: [number, number, number][],
  emissive: [number, number, number][],
  glossiness: number[],

  primaryRayStepSize: number,
  secondaryRayStepSize: number,

}

/**
 * Returns 
 * @param volume 
 * @returns 
 */
export const defaultVolumeRenderSettings: VolumeRenderSettings = {
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
}

export function updateDefaultVolumeRenderSettings(renderSettings: VolumeRenderSettings, volume: Volume): void {
  renderSettings.zSlice = Math.floor(volume.z / 2);
  renderSettings.specular = new Array(volume.num_channels).fill([0, 0, 0]);
  renderSettings.emissive = new Array(volume.num_channels).fill([0, 0, 0]);
  renderSettings.glossiness = new Array(volume.num_channels).fill(0);
}

// TODO: Replace JSON stringify/parsing
export function cloneSettings(sourceSettings: VolumeRenderSettings): VolumeRenderSettings {
  return JSON.parse(JSON.stringify(sourceSettings));
}

type FancySetting<T> = {
  value: T,
  dirty: boolean,
};

type SomeSettings = {
  one: number,
  two: string,
};

class MyRenderImplementation {
  private someSettings: SomeSettings;

  constructor(someSettings: SomeSettings) {
    this.someSettings = someSettings;
  }
  
  private handlers: { [K in keyof SomeSettings]: (val: SomeSettings[K]) => boolean | void } = {
    one: (value) => this.doSomeWork(value),
    two: () => {},
  }

  private doSomeWork(value: number): void {
    console.log(value);
  }

  changeOneSetting<K extends keyof SomeSettings>(setting: K, value: SomeSettings[K]): void {
    const result = this.handlers[setting](value);
    if (result !== false) {
      this.someSettings[setting] = value;
    }
  }

  changeSettings(settings: Partial<SomeSettings>): void {
    Object.keys(settings).map((key) => this.changeOneSetting(key as keyof SomeSettings, settings[key]));
  }
}

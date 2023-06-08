import { Euler, Object3D, Vector3 } from "three";

import { ThreeJsPanel } from "./ThreeJsPanel";
import Volume from "./Volume";

export declare var IVolumeRendering: {
  new (volume: Volume): IVolumeRendering;
};

export interface IVolumeRendering {
  cleanup(): void;
  doRender(canvas: ThreeJsPanel): void;
  get3dObject(): Object3D;
  onChannelData(batch: number[]): void; // NO-OP in both cases; remove?
  setVisible(isVisible: boolean): void;
  setShowBoundingBox(showBoundingBox: boolean): void;
  setBoundingBoxColor(color: [number, number, number]): void;
  setScale(scale: Vector3): void;
  setRayStepSizes(primary: number, secondary: number): void;
  setTranslation(vector: Vector3): void;
  setRotation(euler: Euler): void;
  setResolution(x: number, y: number): void;
  setPixelSamplingRate(rate: number): void;
  setDensity(density: number): void;
  setBrightness(brightness: number): void;
  setIsOrtho(isOrthoAxis: boolean): void;
  setOrthoScale(scale: number): void;
  setInterpolationEnabled(enabled: boolean): void;
  setGamma(gmin: number, glevel: number, gmax: number): void;
  setAxisClip(axis: "x" | "y" | "z", minval: number, maxval: number, isOrthoAxis: boolean): void;
  setFlipAxes(flipX: number, flipY: number, flipZ: number): void;
  setChannelAsMask(channelIndex: number): void;
  setMaskAlpha(maskAlpha: number): void;
  setOrthoThickness(thickness: number): void;
  viewpointMoved(): void;
  updateClipRegion(xmin: number, xmax: number, ymin: number, ymax: number, zmin: number, zmax: number): void;
}

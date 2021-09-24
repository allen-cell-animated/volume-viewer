import { Vector3 } from "three";

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

export interface VolumeDisplayOptions {
  channels: VolumeChannelDisplayOptions[];
  density: number;
  translation: [number, number, number];
  rotation: [number, number, number];
  maskChannelIndex: number;
  maskAlpha: number;
  clipBounds: [number, number, number, number, number, number];
  scale: [number, number, number];
  maxProjection: boolean;
  renderMode: number;
  shadingMethod: number;
  gamma: [number, number, number];
  primaryRayStepSize: number;
  secondaryRayStepSize: number;
}

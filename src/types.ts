import { Vector3 } from "three";

export interface Bounds {
  bmin: Vector3;
  bmax: Vector3;
}

export interface FuseChannel {
  chIndex: number;
  lut: Uint8Array;
  rgbColor: [number, number, number];
}

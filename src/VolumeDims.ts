import { type NumberType } from "./types.js";
import { Vector3 } from "three";

export type VolumeDims2 = {
  // shape: [t, c, z, y, x]
  shape: [number, number, number, number, number];
  // spacing: [t, c, z, y, x]; generally expect 1 for non-spatial dimensions
  spacing: [number, number, number, number, number];
  spaceUnit: string;
  timeUnit: string;
  dataType: NumberType;
};

export function defaultVolumeDims(): VolumeDims2 {
  return {
    shape: [0, 0, 0, 0, 0],
    spacing: [1, 1, 1, 1, 1],
    spaceUnit: "μm",
    timeUnit: "s",
    dataType: "uint8",
  };
}

export function volumeSize(volumeDims: VolumeDims2): Vector3 {
  return new Vector3(volumeDims.shape[4], volumeDims.shape[3], volumeDims.shape[2]);
}

export function physicalPixelSize(volumeDims: VolumeDims2): Vector3 {
  return new Vector3(volumeDims.spacing[4], volumeDims.spacing[3], volumeDims.spacing[2]);
}

export class CVolumeDims {
  volumeDims: VolumeDims2;
  constructor(volumeDims?: VolumeDims2) {
    this.volumeDims = volumeDims || defaultVolumeDims();
  }

  get sizeC(): number {
    return this.volumeDims.shape[1];
  }
  get sizeT(): number {
    return this.volumeDims.shape[0];
  }
  get sizeZ(): number {
    return this.volumeDims.shape[2];
  }
  get sizeY(): number {
    return this.volumeDims.shape[3];
  }
  get sizeX(): number {
    return this.volumeDims.shape[4];
  }
  // returns XYZ order
  get physicalPixelSize(): Vector3 {
    return physicalPixelSize(this.volumeDims);
  }
  get timeScale(): number {
    return this.volumeDims.spacing[0];
  }
  // returns XYZ order
  get volumeSize(): Vector3 {
    return volumeSize(this.volumeDims);
  }
}

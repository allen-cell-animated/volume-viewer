import { type NumberType } from "./types.js";

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

export class CVolumeDims {
  volumeDims: VolumeDims2;
  constructor(volumeDims?: VolumeDims2) {
    this.volumeDims = volumeDims || defaultVolumeDims();
  }
}

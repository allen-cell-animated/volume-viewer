import Volume, { ImageInfo } from "../Volume";

export interface LoadSpec {
  url: string;
  subpath: string;
  scene: number;
  time: number;
}

export class VolumeDims {
  subpath = "";
  shape: number[] = [0, 0, 0, 0, 0];
  spacing: number[] = [1, 1, 1, 1, 1];
  spatialUnit = "micron";
  dataType = "uint8";
}

export interface IVolumeLoader {
  loadDims(loadSpec: LoadSpec): Promise<VolumeDims[]>;
}

import { IVolumeLoader, LoadSpec, VolumeDims } from "./IVolumeLoader";

class OpenCellLoader implements IVolumeLoader {
  async loadDims(_: LoadSpec): Promise<VolumeDims[]> {
    const d = new VolumeDims();
    d.subpath = "";
    d.shape = [1, 2, 27, 600, 600];
    d.spacing = [1, 1, 2, 1, 1];
    d.spatialUnit = ""; // unknown unit.
    d.dataType = "uint8";
    return [d];
  }
}

export { OpenCellLoader };

import { IVolumeLoader } from "./IVolumeLoader";

import { OMEZarrLoader } from "./OmeZarrLoader";
import { JsonImageInfoLoader } from "./JsonImageInfoLoader";
import { TiffLoader } from "./TiffLoader";
import VolumeCache from "../VolumeCache";

const enum VolumeFileFormat {
  ZARR = "zarr",
  JSON = "json",
  TIFF = "tiff",
}

type CreateLoaderOptions = {
  fileType?: VolumeFileFormat;
  cache?: VolumeCache;
  scene?: number;
};

const forceString = (value: string | string[]): string => (typeof value === "object" ? value[0] : value);

async function createVolumeLoader(path: string | string[], options: CreateLoaderOptions): Promise<IVolumeLoader> {
  if (options.fileType) {
    switch (options.fileType) {
      case VolumeFileFormat.ZARR:
        return await OMEZarrLoader.createLoader(forceString(path), options.scene, options.cache);
      case VolumeFileFormat.JSON:
        return new JsonImageInfoLoader(path, options.cache);
      case VolumeFileFormat.TIFF:
        return new TiffLoader(forceString(path));
      default:
        throw new Error(`Unknown file type: ${options.fileType}`);
    }
  } else {
    const pathString = forceString(path);
    if (pathString.endsWith(".json")) {
      return new JsonImageInfoLoader(path, options.cache);
    } else if (pathString.endsWith(".tif") || pathString.endsWith(".tiff")) {
      return new TiffLoader(pathString);
    } else {
      return await OMEZarrLoader.createLoader(pathString, options.scene, options.cache);
    }
  }
}

export { VolumeFileFormat, CreateLoaderOptions, createVolumeLoader };

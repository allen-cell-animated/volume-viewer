import { IVolumeLoader } from "./IVolumeLoader";

import { OMEZarrLoader } from "./OmeZarrLoader";
import { JsonImageInfoLoader } from "./JsonImageInfoLoader";
import { TiffLoader } from "./TiffLoader";
import VolumeCache from "../VolumeCache";

export const enum VolumeFileFormat {
  ZARR = "zarr",
  JSON = "json",
  TIFF = "tiff",
}

export type CreateLoaderOptions = {
  fileType?: VolumeFileFormat;
  cache?: VolumeCache;
  scene?: number;
  concurrencyLimit?: number;
};

export async function createVolumeLoader(
  path: string | string[],
  options?: CreateLoaderOptions
): Promise<IVolumeLoader> {
  const pathString = typeof path === "object" ? path[0] : path;

  switch (options?.fileType) {
    case VolumeFileFormat.ZARR:
      return await OMEZarrLoader.createLoader(pathString, options.scene, options.cache);
    case VolumeFileFormat.JSON:
      return new JsonImageInfoLoader(path, options.cache);
    case VolumeFileFormat.TIFF:
      return new TiffLoader(pathString);
    default:
      if (pathString.endsWith(".json")) {
        return new JsonImageInfoLoader(path, options?.cache);
      } else if (pathString.endsWith(".tif") || pathString.endsWith(".tiff")) {
        return new TiffLoader(pathString);
      } else {
        return await OMEZarrLoader.createLoader(pathString, options?.scene, options?.cache, options?.concurrencyLimit);
      }
  }
}

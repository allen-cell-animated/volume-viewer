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

export function pathToFileType(path: string): VolumeFileFormat {
  if (path.endsWith(".json")) {
    return VolumeFileFormat.JSON;
  } else if (path.endsWith(".tif") || path.endsWith(".tiff")) {
    return VolumeFileFormat.TIFF;
  } else {
    return VolumeFileFormat.ZARR;
  }
}

export async function createVolumeLoader(
  path: string | string[],
  options?: CreateLoaderOptions
): Promise<IVolumeLoader> {
  const pathString = Array.isArray(path) ? path[0] : path;
  const fileType = options?.fileType || pathToFileType(pathString);

  switch (fileType) {
    case VolumeFileFormat.ZARR:
      return await OMEZarrLoader.createLoader(pathString, options?.scene, options?.cache, options?.concurrencyLimit);
    case VolumeFileFormat.JSON:
      return new JsonImageInfoLoader(path, options?.cache);
    case VolumeFileFormat.TIFF:
      return new TiffLoader(pathString);
  }
}

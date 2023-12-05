import { IVolumeLoader } from "./IVolumeLoader";

import { OMEZarrLoader } from "./OmeZarrLoader";
import { JsonImageInfoLoader } from "./JsonImageInfoLoader";
import { RawArrayLoader, RawArrayData, RawArrayInfo } from "./RawArrayLoader";
import { TiffLoader } from "./TiffLoader";
import VolumeCache from "../VolumeCache";

export const enum VolumeFileFormat {
  ZARR = "zarr",
  JSON = "json",
  TIFF = "tiff",
  DATA = "data",
}

// superset of all necessary loader options
export type CreateLoaderOptions = {
  fileType?: VolumeFileFormat;
  cache?: VolumeCache;
  scene?: number;
  concurrencyLimit?: number;
  // one array per channel
  imageData?: RawArrayData;
  imageDataInfo?: RawArrayInfo;
};

export async function createVolumeLoader(
  path: string | string[],
  options?: CreateLoaderOptions
): Promise<IVolumeLoader> {
  const pathString = typeof path === "object" ? path[0] : path;

  switch (options?.fileType) {
    case VolumeFileFormat.ZARR:
      return await OMEZarrLoader.createLoader(pathString, options.scene, options.cache, options.concurrencyLimit);
    case VolumeFileFormat.JSON:
      return new JsonImageInfoLoader(path, options.cache);
    case VolumeFileFormat.TIFF:
      return new TiffLoader(pathString);
    case VolumeFileFormat.DATA:
      return new RawArrayLoader(options.imageData, options.imageDataInfo, options.cache);
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

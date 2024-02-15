import { ThreadableVolumeLoader } from "./IVolumeLoader";

import { OMEZarrLoader, ZarrLoaderFetchOptions } from "./OmeZarrLoader";
import { JsonImageInfoLoader } from "./JsonImageInfoLoader";
import { TiffLoader } from "./TiffLoader";
import VolumeCache from "../VolumeCache";
import SubscribableRequestQueue from "../utils/SubscribableRequestQueue";

export { PrefetchDirection } from "./zarr_utils/types";

export const enum VolumeFileFormat {
  ZARR = "zarr",
  JSON = "json",
  TIFF = "tiff",
}

export type CreateLoaderOptions = {
  fileType?: VolumeFileFormat;
  cache?: VolumeCache;
  queue?: SubscribableRequestQueue;
  scene?: number;
  fetchOptions?: ZarrLoaderFetchOptions;
};

export function pathToFileType(path: string): VolumeFileFormat {
  if (path.endsWith(".json")) {
    return VolumeFileFormat.JSON;
  } else if (path.endsWith(".tif") || path.endsWith(".tiff")) {
    return VolumeFileFormat.TIFF;
  }
  return VolumeFileFormat.ZARR;
}

export async function createVolumeLoader(
  path: string | string[],
  options?: CreateLoaderOptions
): Promise<ThreadableVolumeLoader> {
  const pathString = Array.isArray(path) ? path[0] : path;
  const fileType = options?.fileType || pathToFileType(pathString);

  switch (fileType) {
    case VolumeFileFormat.ZARR:
      return await OMEZarrLoader.createLoader(
        pathString,
        options?.scene,
        options?.cache,
        options?.queue,
        options?.fetchOptions
      );
    case VolumeFileFormat.JSON:
      return new JsonImageInfoLoader(path, options?.cache);
    case VolumeFileFormat.TIFF:
      return new TiffLoader(pathString);
  }
}

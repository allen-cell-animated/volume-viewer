import { LoadSpec, loadSpecToString, IVolumeLoader, PerChannelCallback, VolumeDims } from "./IVolumeLoader";

import { OMEZarrLoader } from "./OmeZarrLoader";
import { JsonImageInfoLoader } from "./JsonImageInfoLoader";
import { TiffLoader } from "./TiffLoader";
import VolumeCache from "../VolumeCache";

const enum VolumeFileFormat {
  ZARR = "zarr",
  JSON = "json",
  TIFF = "tiff",
}

type CreateZarrLoaderOptions = { path: string; cache?: VolumeCache; scene?: number };
type CreateJsonLoaderOptions = { path: string | string[]; cache?: VolumeCache };
type CreateTiffLoaderOptions = { path: string };

type CreateLoaderOptionsMap = {
  [T in VolumeFileFormat]: {
    [VolumeFileFormat.ZARR]: CreateZarrLoaderOptions;
    [VolumeFileFormat.JSON]: CreateJsonLoaderOptions;
    [VolumeFileFormat.TIFF]: CreateTiffLoaderOptions;
  }[T];
};

type CreateLoaderOptions = CreateZarrLoaderOptions | CreateJsonLoaderOptions | CreateTiffLoaderOptions;

async function createVolumeLoader<T extends VolumeFileFormat>(
  fileType: T,
  options?: CreateLoaderOptionsMap[T]
): Promise<IVolumeLoader> {
  switch (fileType) {
    case VolumeFileFormat.ZARR:
      const zOptions = options as CreateZarrLoaderOptions;
      return await OMEZarrLoader.createLoader(zOptions.path, zOptions.scene, zOptions.cache);
    case VolumeFileFormat.JSON:
      const jOptions = options as CreateJsonLoaderOptions;
      return new JsonImageInfoLoader(jOptions.path, jOptions.cache);
    case VolumeFileFormat.TIFF:
      return new TiffLoader((options as CreateTiffLoaderOptions).path);
    default:
      throw new Error(`Unknown file type: ${fileType}`);
  }
}

export {
  LoadSpec,
  loadSpecToString,
  IVolumeLoader,
  PerChannelCallback,
  VolumeDims,
  OMEZarrLoader,
  JsonImageInfoLoader,
  TiffLoader,
  VolumeFileFormat,
  CreateLoaderOptions,
  createVolumeLoader,
};

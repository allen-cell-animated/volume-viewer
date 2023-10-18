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
  path: string | string[];
  cache?: VolumeCache;
  scene?: number;
};

const forceString = (value: string | string[]): string => (typeof value === "object" ? value[0] : value);

async function createVolumeLoader(fileType: VolumeFileFormat, options: CreateLoaderOptions): Promise<IVolumeLoader> {
  switch (fileType) {
    case VolumeFileFormat.ZARR:
      return await OMEZarrLoader.createLoader(forceString(options.path), options.scene, options.cache);
    case VolumeFileFormat.JSON:
      return new JsonImageInfoLoader(options.path, options.cache);
    case VolumeFileFormat.TIFF:
      return new TiffLoader(forceString(options.path));
    default:
      throw new Error(`Unknown file type: ${fileType}`);
  }
}

export { VolumeFileFormat, CreateLoaderOptions, createVolumeLoader };

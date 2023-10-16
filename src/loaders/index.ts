import { LoadSpec, loadSpecToString, IVolumeLoader, PerChannelCallback, VolumeDims } from "./IVolumeLoader";

import { OMEZarrLoader } from "./OmeZarrLoader";
import { JsonImageInfoLoader } from "./JsonImageInfoLoader";
import { TiffLoader } from "./TiffLoader";
import { OpenCellLoader } from "./OpenCellLoader";
import VolumeCache from "../VolumeCache";

const enum VolumeFileFormat {
  ZARR = "zarr",
  JSON = "json",
  TIFF = "tiff",
  OpenCell = "opencell",
}

type CreateZarrLoaderOptions = { path: string; cache?: VolumeCache; scene?: number };
type CreateJsonLoaderOptions = { path: string | string[]; cache?: VolumeCache };
type CreateTiffLoaderOptions = { path: string };

type CreateLoaderOptions = CreateZarrLoaderOptions | CreateJsonLoaderOptions | CreateTiffLoaderOptions;

function createLoader(fileType: VolumeFileFormat.ZARR, options: CreateZarrLoaderOptions): Promise<OMEZarrLoader>;
function createLoader(fileType: VolumeFileFormat.JSON, options: CreateJsonLoaderOptions): Promise<JsonImageInfoLoader>;
function createLoader(fileType: VolumeFileFormat.TIFF, options: CreateTiffLoaderOptions): Promise<TiffLoader>;
function createLoader(fileType: VolumeFileFormat.OpenCell): Promise<OpenCellLoader>;
async function createLoader(fileType: VolumeFileFormat, options?: CreateLoaderOptions): Promise<IVolumeLoader> {
  switch (fileType) {
    case VolumeFileFormat.ZARR:
      const zOptions = options as CreateZarrLoaderOptions;
      return await OMEZarrLoader.createLoader(zOptions.path, zOptions.scene, zOptions.cache);
    case VolumeFileFormat.JSON:
      const jOptions = options as CreateJsonLoaderOptions;
      return new JsonImageInfoLoader(jOptions.path, jOptions.cache);
    case VolumeFileFormat.TIFF:
      return new TiffLoader((options as CreateTiffLoaderOptions).path);
    case VolumeFileFormat.OpenCell:
      return new OpenCellLoader();
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
  OpenCellLoader,
  VolumeFileFormat,
  CreateLoaderOptions,
  createLoader,
};

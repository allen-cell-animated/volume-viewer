import { HTTPStore, ZarrArray, full, openArray, openGroup } from "zarr";
import { Box3, ConeGeometry, Vector2, Vector3 } from "three";

import Volume, { ImageInfo } from "../Volume";
import VolumeCache, { CacheStore } from "../VolumeCache";
import { IVolumeLoader, LoadSpec, PerChannelCallback, VolumeDims } from "./IVolumeLoader";
import {
  buildDefaultMetadata,
  composeSubregion,
  computePackedAtlasDims,
  convertSubregionToPixels,
  estimateLevelForAtlas,
  unitNameToSymbol,
} from "./VolumeLoaderUtils";

const MAX_ATLAS_DIMENSION = 2048;

type CoordinateTransformation =
  | {
      type: "identity";
    }
  | {
      type: "translation";
      translation: number[];
    }
  | {
      type: "scale";
      scale: number[];
    }
  | {
      type: "translation" | "scale";
      path: string;
    };

type Axis = {
  name: string;
  type?: string;
  unit?: string;
};

type OMEDataset = {
  path: string;
  coordinateTransformations?: CoordinateTransformation[];
};

// https://ngff.openmicroscopy.org/latest/#multiscale-md
type OMEMultiscale = {
  version?: string;
  name?: string;
  axes: Axis[];
  datasets: OMEDataset[];
  coordinateTransformations?: CoordinateTransformation[];
  type?: string;
  metadata?: Record<string, unknown>;
};

// https://ngff.openmicroscopy.org/latest/#omero-md
type OmeroTransitionalMetadata = {
  id: number;
  name: string;
  version: string;
  channels: {
    active: boolean;
    coefficient: number;
    color: string;
    family: string;
    inverted: boolean;
    label: string;
    window: {
      end: number;
      max: number;
      min: number;
      start: number;
    };
  }[];
};

type OMEZarrMetadata = {
  multiscales: OMEMultiscale[];
  omero: OmeroTransitionalMetadata;
};

function remapAxesToTCZYX(axes: Axis[]): [number, number, number, number, number] {
  const axisTCZYX: [number, number, number, number, number] = [-1, -1, -1, -1, -1];
  const axisNames = ["t", "c", "z", "y", "x"];

  axes.forEach((axis, idx) => {
    const axisIdx = axisNames.indexOf(axis.name);
    if (axisIdx > -1) {
      axisTCZYX[axisIdx] = idx;
    } else {
      console.error("ERROR: UNRECOGNIZED AXIS in zarr: " + axis.name);
    }
  });

  if (axisTCZYX[2] === -1 || axisTCZYX[3] === -1 || axisTCZYX[4] === -1) {
    console.error("ERROR: zarr loader expects a z, y, and x axis.");
  }

  return axisTCZYX;
}

async function loadMetadata(store: HTTPStore): Promise<OMEZarrMetadata> {
  const data = await openGroup(store, null, "r");
  return (await data.attrs.asObject()) as OMEZarrMetadata;
}

function pickLevelToLoad(loadSpec: LoadSpec, zarrMultiscales: ZarrArray[], zi: number, yi: number, xi: number): number {
  const size = loadSpec.subregion.getSize(new Vector3());

  const spatialDims = zarrMultiscales.map(({ shape }) => [
    Math.max(shape[zi] * size.z, 1),
    Math.max(shape[yi] * size.y, 1),
    Math.max(shape[xi] * size.x, 1),
  ]);

  const optimalLevel = estimateLevelForAtlas(spatialDims, MAX_ATLAS_DIMENSION);

  if (loadSpec.multiscaleLevel) {
    return Math.max(optimalLevel, loadSpec.multiscaleLevel);
  } else {
    return optimalLevel;
  }
}

class OMEZarrLoader implements IVolumeLoader {
  zarrMultiscales: ZarrArray[];
  multiscaleMetadata: OMEMultiscale;
  omeroMetadata: OmeroTransitionalMetadata;
  axesTCZYX: [number, number, number, number, number];

  // TODO: this property should definitely be owned by `Volume` if this loader is ever used by multiple volumes.
  //   This may cause errors or incorrect results otherwise!
  maxExtent?: Box3;

  cache?: VolumeCache;
  // TODO: in a multi-volume world, `cacheStore` may want to be owned by `Volume`
  cacheStore?: CacheStore;

  private constructor(
    zarrMultiscales: ZarrArray[],
    multiscaleMetadata: OMEMultiscale,
    omeroMetadata: OmeroTransitionalMetadata,
    axisTCZYX: [number, number, number, number, number],
    cache?: VolumeCache
  ) {
    this.zarrMultiscales = zarrMultiscales;
    this.multiscaleMetadata = multiscaleMetadata;
    this.omeroMetadata = omeroMetadata;
    this.axesTCZYX = axisTCZYX;
    this.cache = cache;
  }

  private getUnitSymbols(): [string, string] {
    // Assume all axes have the same units - we have no means of storing per-axis unit symbols
    const xi = this.axesTCZYX[4];
    const spaceUnitName = this.multiscaleMetadata.axes[xi].unit;
    const spaceUnitSymbol = unitNameToSymbol(spaceUnitName) || spaceUnitName || "";

    const ti = this.axesTCZYX[0];
    const timeUnitName = ti > -1 ? this.multiscaleMetadata.axes[ti].unit : undefined;
    const timeUnitSymbol = unitNameToSymbol(timeUnitName) || timeUnitName || "";

    return [spaceUnitSymbol, timeUnitSymbol];
  }

  private getScale(): number[] {
    const transforms =
      this.multiscaleMetadata[0].coordinateTransformations ?? this.multiscaleMetadata.coordinateTransformations;

    if (transforms === undefined) {
      console.error("ERROR: no coordinate transformations for scale level");
      return [1, 1, 1, 1, 1];
    }

    // this assumes we'll never encounter the "path" variant
    const isScaleTransform = (t: CoordinateTransformation): t is { type: "scale"; scale: number[] } =>
      t.type === "scale";

    // there can be any number of coordinateTransformations
    // but there must be only one of type "scale".
    const scaleTransform = transforms.find(isScaleTransform);
    if (!scaleTransform) {
      console.error(`ERROR: no coordinate transformation of type "scale" for scale level`);
      return [1, 1, 1, 1, 1];
    }

    return scaleTransform.scale;
  }

  static async createLoader(url: string, scene = 0, cache?: VolumeCache): Promise<OMEZarrLoader> {
    const store = new HTTPStore(url);
    const metadata = await loadMetadata(store);

    if (scene > metadata.multiscales.length) {
      console.warn(`WARNING: OMEZarrLoader: scene ${scene} is invalid. Using scene 0.`);
      scene = 0;
    }
    const multiscale = metadata.multiscales[scene];

    const arrPromises = multiscale.datasets.map(({ path }) => openArray({ store, path, mode: "r" }));
    const arrs = await Promise.all(arrPromises);

    const axisTCZYX = remapAxesToTCZYX(multiscale.axes);

    return new OMEZarrLoader(arrs, multiscale, metadata.omero, axisTCZYX, cache);
  }

  async loadDims(loadSpec: LoadSpec): Promise<VolumeDims[]> {
    throw new Error("Method not implemented.");
  }

  async createVolume(loadSpec: LoadSpec, onChannelLoaded?: PerChannelCallback): Promise<Volume> {
    const [t, c, z, y, x] = this.axesTCZYX;
    const hasT = t > -1;
    const hasC = c > -1;

    const shape0 = this.zarrMultiscales[0].shape;
    const levelToLoad = pickLevelToLoad(loadSpec, this.zarrMultiscales, z, y, x);
    const shapeLv = this.zarrMultiscales[levelToLoad].shape;

    const scaleSizes = this.zarrMultiscales.map(({ shape }) => new Vector3(shape[x], shape[y], shape[z]));
    this.cacheStore = this.cache?.addVolume(Math.max(shape0[c], 1), Math.max(shape0[t], 1), scaleSizes);

    const [spatialUnit, timeUnit] = this.getUnitSymbols();
    const numChannels = hasC ? shapeLv[c] : 1;
    const times = hasT ? shapeLv[t] : 1;

    if (!this.maxExtent) {
      this.maxExtent = loadSpec.subregion.clone();
    }
    const pxDims0 = convertSubregionToPixels(loadSpec.subregion, new Vector3(shape0[x], shape0[y], shape0[z]));
    const pxSize0 = pxDims0.getSize(new Vector3());
    const pxDimsLv = convertSubregionToPixels(loadSpec.subregion, new Vector3(shapeLv[x], shapeLv[y], shapeLv[z]));
    const pxSizeLv = pxDimsLv.getSize(new Vector3());

    const atlasTileDims = computePackedAtlasDims(pxSizeLv.z, pxSizeLv.x, pxSizeLv.y);
    const atlasSize = atlasTileDims.clone().multiply(new Vector2(pxSizeLv.x, pxSizeLv.y));

    const channelNames = this.omeroMetadata.channels.map((ch) => ch.label);

    const scale5d = this.getScale();
    const timeScale = hasT ? scale5d[t] : 1;

    const imgdata: ImageInfo = {
      name: this.omeroMetadata.name,

      originalSize: pxSize0,
      atlasTileDims,
      volumeSize: pxSizeLv,
      subregionSize: pxSizeLv.clone(),
      subregionOffset: new Vector3(0, 0, 0),
      physicalPixelSize: new Vector3(scale5d[x], scale5d[y], scale5d[z]),
      spatialUnit,

      numChannels,
      channelNames,
      times,
      timeScale,
      timeUnit,

      transform: {
        translation: new Vector3(0, 0, 0),
        rotation: new Vector3(0, 0, 0),
      },
    };

    const fullExtentLoadSpec: LoadSpec = {
      ...loadSpec,
      subregion: new Box3(new Vector3(0, 0, 0), new Vector3(1, 1, 1)),
    };

    const vol = new Volume(imgdata, fullExtentLoadSpec, this);
    vol.channelLoadCallback = onChannelLoaded;
    vol.imageMetadata = buildDefaultMetadata(imgdata);
    return vol;
  }

  loadVolumeData(vol: Volume, explicitLoadSpec?: LoadSpec, onChannelLoaded?: PerChannelCallback): void {
    vol.loadSpec = explicitLoadSpec ?? vol.loadSpec;
    const maxExtent = this.maxExtent ?? new Box3(new Vector3(0, 0, 0), new Vector3(1, 1, 1));
    const [t, c, z, y, x] = this.axesTCZYX;
    const subregion = composeSubregion(vol.loadSpec.subregion, maxExtent);
    const { numChannels, times } = vol.imageInfo;

    const levelIdx = pickLevelToLoad({ ...vol.loadSpec, subregion }, this.zarrMultiscales, z, y, x);
    const level = this.zarrMultiscales[levelIdx];
    const levelShape = level.shape;

    const regionPx = convertSubregionToPixels(subregion, new Vector3(levelShape[x], levelShape[y], levelShape[z]));
    // Update volume `imageInfo` to reflect potentially new dimensions
    const regionSizePx = regionPx.getSize(new Vector3());
    const atlasTileDims = computePackedAtlasDims(regionSizePx.z, regionSizePx.x, regionSizePx.y);
    const volExtentPx = convertSubregionToPixels(maxExtent, new Vector3(levelShape[x], levelShape[y], levelShape[z]));
    const volSizePx = volExtentPx.getSize(new Vector3());
    const regionExtentPx = convertSubregionToPixels(
      subregion,
      new Vector3(levelShape[x], levelShape[y], levelShape[z])
    );
    vol.imageInfo = {
      ...vol.imageInfo,
      atlasTileDims,
      volumeSize: volSizePx,
      subregionSize: regionSizePx,
      subregionOffset: regionExtentPx.min,
    };
    vol.updateDimensions();

    const channelIndexes = vol.loadSpec.channels ?? Array.from({ length: numChannels }, (_, i) => i);
    for (const i of channelIndexes) {
      // TODO: the hard part
    }

    throw new Error("Method not implemented.");
  }
}

export { OMEZarrLoader };

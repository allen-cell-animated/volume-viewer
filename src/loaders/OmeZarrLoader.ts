import { Box3, Vector3 } from "three";
import { HTTPStore, TypedArray, ZarrArray, openArray, openGroup, slice } from "zarr";
import { RawArray } from "zarr/types/rawArray";
import { AsyncStore } from "zarr/types/storage/types";
import { Slice } from "zarr/types/core/types";

import Volume, { ImageInfo } from "../Volume";
import VolumeCache from "../VolumeCache";
import RequestQueue from "../utils/RequestQueue";
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
const CHUNK_REQUEST_CANCEL_REASON = "chunk request cancelled";

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

/** Turns `axisTCZYX` into the number of dimensions in the array */
const getDimensionCount = ([t, c]: [number, number, number, number, number]) => 3 + Number(t > -1) + Number(c > -1);

/**
 * `Store` is zarr.js's minimal abstraction for anything that acts like a filesystem. (Local machine, HTTP server, etc.)
 * `SmartStoreWrapper` wraps another `Store` and adds (optional) connections to `VolumeCache` and `RequestQueue`.
 *
 * NOTE: if using `RequestQueue`, *ensure that calls made on arrays using this store do not also do promise queueing*
 * by setting the option `concurrencyLimit: Infinity`.
 */
class SmartStoreWrapper implements AsyncStore<ArrayBuffer, RequestInit> {
  // Required by `AsyncStore`
  listDir?: (path?: string) => Promise<string[]>;
  rmDir?: (path?: string) => Promise<boolean>;
  getSize?: (path?: string) => Promise<number>;
  rename?: (path?: string) => Promise<void>;

  baseStore: AsyncStore<ArrayBuffer, RequestInit>;

  cache?: VolumeCache;
  requestQueue?: RequestQueue;

  constructor(baseStore: AsyncStore<ArrayBuffer, RequestInit>, cache?: VolumeCache, requestQueue?: RequestQueue) {
    this.baseStore = baseStore;
    this.cache = cache;
    this.requestQueue = requestQueue;
    this.listDir = baseStore.listDir;
    this.rmDir = baseStore.rmDir;
    this.getSize = baseStore.getSize;
    this.rename = baseStore.rename;
  }

  private async getAndCacheItem(item: string, cacheKey: string, opts?: RequestInit): Promise<ArrayBuffer> {
    const result = await this.baseStore.getItem(item, opts);
    if (this.cache) {
      this.cache.insert(cacheKey, result);
    }
    return result;
  }

  getItem(item: string, opts?: RequestInit): Promise<ArrayBuffer> {
    // If we don't have a cache or aren't getting a chunk, call straight to the base store
    const zarrExts = [".zarray", ".zgroup", ".zattrs"];
    if (!this.cache || zarrExts.some((s) => item.endsWith(s))) {
      return this.baseStore.getItem(item, opts);
    }

    let keyPrefix = (this.baseStore as HTTPStore).url ?? "";
    if (keyPrefix !== "" && !keyPrefix.endsWith("/")) {
      keyPrefix += "/";
    }
    const key = keyPrefix + item;

    // Check the cache
    const cacheResult = this.cache.get(key);
    if (cacheResult) {
      return Promise.resolve(cacheResult);
    }

    // Not in cache; load the chunk and cache it
    if (this.requestQueue) {
      return this.requestQueue.addRequest(key, () => this.getAndCacheItem(item, key, opts));
    } else {
      return this.getAndCacheItem(item, key, opts);
    }
  }

  keys(): Promise<string[]> {
    return this.baseStore.keys();
  }

  async setItem(_item: string, _value: ArrayBuffer): Promise<boolean> {
    console.warn("zarr store wrapper: attempt to set data!");
    // return this.baseStore.setItem(item, value);
    return false;
  }

  async deleteItem(_item: string): Promise<boolean> {
    console.warn("zarr store wrapper: attempt to delete data!");
    // return this.baseStore.deleteItem(item);
    return false;
  }

  containsItem(item: string): Promise<boolean> {
    // zarr seems to never call this method on chunk paths (just .zarray, .zstore, etc.), so we don't check cache here
    return this.baseStore.containsItem(item);
  }
}

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

function convertChannel(channelData: TypedArray, dtype: string): Uint8Array {
  if (dtype === "|u1") {
    return channelData as Uint8Array;
  }

  const u8 = new Uint8Array(channelData.length);

  // get min and max
  let min = channelData[0];
  let max = channelData[0];
  for (let i = 0; i < channelData.length; i++) {
    const val = channelData[i];
    if (val < min) {
      min = val;
    }
    if (val > max) {
      max = val;
    }
  }

  // normalize and convert to u8
  const range = max - min;
  for (let i = 0; i < channelData.length; i++) {
    u8[i] = ((channelData[i] - min) / range) * 255;
  }

  return u8;
}

class OMEZarrLoader implements IVolumeLoader {
  scaleLevels: ZarrArray[];
  multiscaleMetadata: OMEMultiscale;
  omeroMetadata: OmeroTransitionalMetadata;
  axesTCZYX: [number, number, number, number, number];

  // TODO: should we be able to share `RequestQueue`s between loaders?
  // TODO: store sets of requests per volume via some unique key
  requestQueue: RequestQueue;

  // TODO: this property should definitely be owned by `Volume` if this loader is ever used by multiple volumes.
  //   This may cause errors or incorrect results otherwise!
  maxExtent?: Box3;

  private constructor(
    scaleLevels: ZarrArray[],
    multiscaleMetadata: OMEMultiscale,
    omeroMetadata: OmeroTransitionalMetadata,
    axisTCZYX: [number, number, number, number, number],
    requestQueue: RequestQueue
  ) {
    this.scaleLevels = scaleLevels;
    this.multiscaleMetadata = multiscaleMetadata;
    this.omeroMetadata = omeroMetadata;
    this.axesTCZYX = axisTCZYX;
    this.requestQueue = requestQueue;
  }

  static async createLoader(
    url: string,
    scene = 0,
    cache?: VolumeCache,
    concurrencyLimit = 10
  ): Promise<OMEZarrLoader> {
    // Setup: create queue and store, get basic metadata
    const queue = new RequestQueue(concurrencyLimit);
    const store = new SmartStoreWrapper(new HTTPStore(url), cache, queue);
    const group = await openGroup(store, null, "r");
    const metadata = (await group.attrs.asObject()) as OMEZarrMetadata;

    // Pick scene (multiscale)
    if (scene > metadata.multiscales.length) {
      console.warn(`WARNING: OMEZarrLoader: scene ${scene} is invalid. Using scene 0.`);
      scene = 0;
    }
    const multiscale = metadata.multiscales[scene];

    // Open all scale levels of multiscale
    const scaleLevelPaths = multiscale.datasets.map(({ path }) => path);
    const scaleLevelPromises = scaleLevelPaths.map((path) => openArray({ store, path, mode: "r" }));
    const scaleLevels = await Promise.all(scaleLevelPromises);
    const axisTCZYX = remapAxesToTCZYX(multiscale.axes);

    return new OMEZarrLoader(scaleLevels, multiscale, metadata.omero, axisTCZYX, queue);
  }

  private getUnitSymbols(): [string, string] {
    // Assume all spatial axes have the same units - we have no means of storing per-axis unit symbols
    const xi = this.axesTCZYX[4];
    const spaceUnitName = this.multiscaleMetadata.axes[xi].unit;
    const spaceUnitSymbol = unitNameToSymbol(spaceUnitName) || spaceUnitName || "";

    const ti = this.axesTCZYX[0];
    const timeUnitName = ti > -1 ? this.multiscaleMetadata.axes[ti].unit : undefined;
    const timeUnitSymbol = unitNameToSymbol(timeUnitName) || timeUnitName || "";

    return [spaceUnitSymbol, timeUnitSymbol];
  }

  private getScale(level = 0): number[] {
    const meta = this.multiscaleMetadata;
    const transforms = meta.datasets[level].coordinateTransformations ?? meta.coordinateTransformations;

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

    const scale = scaleTransform.scale.slice();
    while (scale.length < 5) {
      scale.unshift(1);
    }
    return scale;
  }

  async loadDims(loadSpec: LoadSpec): Promise<VolumeDims[]> {
    const [spaceUnit, timeUnit] = this.getUnitSymbols();
    // Compute subregion size so we can factor that in
    const maxExtent = this.maxExtent ?? new Box3(new Vector3(0, 0, 0), new Vector3(1, 1, 1));
    const subregion = composeSubregion(loadSpec.subregion, maxExtent);
    const regionSize = subregion.getSize(new Vector3());
    const regionArr = [1, 1, regionSize.z, regionSize.y, regionSize.x];
    const maxLevel = pickLevelToLoad(
      { ...loadSpec, subregion, multiscaleLevel: undefined },
      this.scaleLevels,
      regionSize.z,
      regionSize.y,
      regionSize.x
    );

    const result = this.scaleLevels.map((level, i) => {
      const scale = this.getScale(i);
      const dims = new VolumeDims();

      dims.spaceUnit = spaceUnit;
      dims.timeUnit = timeUnit;
      dims.shape = [-1, -1, -1, -1, -1];
      dims.spacing = [1, 1, 1, 1, 1];
      dims.canLoad = i <= maxLevel;

      this.axesTCZYX.forEach((val, idx) => {
        if (val > -1) {
          dims.shape[idx] = Math.ceil(level.shape[val] * regionArr[idx]);
          dims.spacing[idx] = scale[val];
        }
      });

      return dims;
    });

    return result;
  }

  async createVolume(loadSpec: LoadSpec, onChannelLoaded?: PerChannelCallback): Promise<Volume> {
    const [t, c, z, y, x] = this.axesTCZYX;
    const hasT = t > -1;
    const hasC = c > -1;

    const shape0 = this.scaleLevels[0].shape;
    const levelToLoad = pickLevelToLoad(loadSpec, this.scaleLevels, z, y, x);
    const shapeLv = this.scaleLevels[levelToLoad].shape;

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

    // The `LoadSpec` passed in at this stage should represent the subset which this loader loads, not that
    // which the volume contains. The volume contains the full extent of the subset recognized by this loader.
    const fullExtentLoadSpec: LoadSpec = {
      ...loadSpec,
      subregion: new Box3(new Vector3(0, 0, 0), new Vector3(1, 1, 1)),
    };

    const vol = new Volume(imgdata, fullExtentLoadSpec, this);
    vol.channelLoadCallback = onChannelLoaded;
    vol.imageMetadata = buildDefaultMetadata(imgdata);
    return vol;
  }

  async loadVolumeData(vol: Volume, explicitLoadSpec?: LoadSpec, onChannelLoaded?: PerChannelCallback): Promise<void> {
    // First, cancel any pending requests for this volume
    this.requestQueue.cancelAllRequests(CHUNK_REQUEST_CANCEL_REASON);

    vol.loadSpec = explicitLoadSpec ?? vol.loadSpec;
    const maxExtent = this.maxExtent ?? new Box3(new Vector3(0, 0, 0), new Vector3(1, 1, 1));
    const [z, y, x] = this.axesTCZYX.slice(2);
    const subregion = composeSubregion(vol.loadSpec.subregion, maxExtent);

    const levelIdx = pickLevelToLoad({ ...vol.loadSpec, subregion }, this.scaleLevels, z, y, x);
    const level = this.scaleLevels[levelIdx];
    const levelShape = level.shape;

    const regionPx = convertSubregionToPixels(subregion, new Vector3(levelShape[x], levelShape[y], levelShape[z]));
    // Update volume `imageInfo` to reflect potentially new dimensions
    const regionSizePx = regionPx.getSize(new Vector3());
    const atlasTileDims = computePackedAtlasDims(regionSizePx.z, regionSizePx.x, regionSizePx.y);
    const volExtentPx = convertSubregionToPixels(maxExtent, new Vector3(levelShape[x], levelShape[y], levelShape[z]));
    const volSizePx = volExtentPx.getSize(new Vector3());
    vol.imageInfo = {
      ...vol.imageInfo,
      atlasTileDims,
      volumeSize: volSizePx,
      subregionSize: regionSizePx,
      subregionOffset: regionPx.min,
    };
    vol.updateDimensions();

    const { numChannels } = vol.imageInfo;
    const channelIndexes = vol.loadSpec.channels ?? Array.from({ length: numChannels }, (_, i) => i);

    const channelPromises = channelIndexes.map(async (ch) => {
      // Build slice spec
      const { min, max } = regionPx;
      const unorderedSpec = [vol.loadSpec.time, ch, slice(min.z, max.z), slice(min.y, max.y), slice(min.x, max.x)];
      const specLen = getDimensionCount(this.axesTCZYX);
      const sliceSpec: (number | Slice)[] = Array(specLen);

      this.axesTCZYX.forEach((val, idx) => {
        if (val > -1) {
          if (val > specLen) {
            throw new Error("Unexpected axis index");
          }
          sliceSpec[val] = unorderedSpec[idx];
        }
      });

      try {
        const result = (await level.getRaw(sliceSpec, { concurrencyLimit: Infinity })) as RawArray;
        const u8 = convertChannel(result.data, result.dtype);
        vol.setChannelDataFromVolume(ch, u8);
        onChannelLoaded?.(vol, ch);
      } catch (e) {
        // TODO: verify that cancelling requests in progress doesn't leak memory
        if (e !== CHUNK_REQUEST_CANCEL_REASON) {
          throw e;
        }
      }
    });

    await Promise.all(channelPromises);
  }
}

export { OMEZarrLoader };

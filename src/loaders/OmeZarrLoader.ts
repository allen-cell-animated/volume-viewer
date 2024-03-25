import { Box3, Vector3 } from "three";

import * as zarr from "@zarrita/core";
import { get as zarrGet, slice, Slice } from "@zarrita/indexing";
import { AbsolutePath } from "@zarrita/storage";
// Importing `FetchStore` from its home subpackage (@zarrita/storage) causes errors.
// Getting it from the top-level package means we don't get its type. This is also a bug, but it's more acceptable.
import { FetchStore } from "zarrita";

import { ImageInfo } from "../Volume.js";
import VolumeCache from "../VolumeCache.js";
import SubscribableRequestQueue from "../utils/SubscribableRequestQueue.js";
import {
  ThreadableVolumeLoader,
  LoadSpec,
  type RawChannelDataCallback,
  VolumeDims,
  type LoadedVolumeInfo,
} from "./IVolumeLoader.js";
import {
  composeSubregion,
  computePackedAtlasDims,
  convertSubregionToPixels,
  unitNameToSymbol,
} from "./VolumeLoaderUtils.js";
import ChunkPrefetchIterator from "./zarr_utils/ChunkPrefetchIterator.js";
import WrappedStore from "./zarr_utils/WrappedStore.js";
import {
  getDimensionCount,
  getScale,
  orderByDimension,
  orderByTCZYX,
  pickLevelToLoad,
  remapAxesToTCZYX,
} from "./zarr_utils/utils.js";
import type {
  OMEZarrMetadata,
  PrefetchDirection,
  SubscriberId,
  TCZYX,
  NumericZarrArray,
  OMEMultiscale,
  OmeroTransitionalMetadata,
} from "./zarr_utils/types.js";

const CHUNK_REQUEST_CANCEL_REASON = "chunk request cancelled";

// returns the converted data and the original min and max values
function convertChannel(
  channelData: zarr.TypedArray<zarr.NumberDataType>,
  dtype: zarr.NumberDataType
): [zarr.TypedArray<zarr.NumberDataType>, zarr.NumberDataType, number, number] {
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

  // if (channelData instanceof Uint8Array) {
  //   return [channelData as Uint8Array, min, max];
  // }

  if (dtype === "float64") {
    // convert to float32
    const f32 = new Float32Array(channelData.length);
    for (let i = 0; i < channelData.length; i++) {
      f32[i] = channelData[i];
    }
    dtype = "float32";
  }

  return [channelData, dtype, min, max];
}

export type ZarrLoaderFetchOptions = {
  /** The max. number of requests the loader can issue at a time. Ignored if the constructor also receives a queue. */
  concurrencyLimit?: number;
  /**
   * The max. number of *prefetch* requests the loader can issue at a time. Set lower than `concurrencyLimit` to ensure
   * that prefetching leaves room in the queue for actual loads. Ignored if the constructor also receives a queue.
   */
  prefetchConcurrencyLimit?: number;
  /**
   * The max. number of chunks to prefetch outward in either direction. E.g. if a load requests chunks with z coords 3
   * and 4 and `maxPrefetchDistance` in z is 2, the loader will prefetch similar chunks with z coords 1, 2, 5, and 6
   * (or until it hits `maxPrefetchChunks`). Ordered TZYX.
   */
  maxPrefetchDistance: [number, number, number, number];
  /** The max. number of total chunks that can be prefetched after any load. */
  maxPrefetchChunks: number;
  /** The initial directions to prioritize when prefetching */
  priorityDirections?: PrefetchDirection[];
};

const DEFAULT_FETCH_OPTIONS = {
  maxPrefetchDistance: [5, 5, 5, 5] as [number, number, number, number],
  maxPrefetchChunks: 30,
};

class OMEZarrLoader extends ThreadableVolumeLoader {
  /** The ID of the subscriber responsible for "actual loads" (non-prefetch requests) */
  private loadSubscriber: SubscriberId | undefined;
  /** The ID of the subscriber responsible for prefetches, so that requests can be cancelled and reissued */
  private prefetchSubscriber: SubscriberId | undefined;

  // TODO: this property should definitely be owned by `Volume` if this loader is ever used by multiple volumes.
  //   This may cause errors or incorrect results otherwise!
  private maxExtent?: Box3;

  private syncChannels = false;

  private constructor(
    /** An abstraction representing a remote data source, used by zarrita to get chunks and by us to prefetch them. */
    private store: WrappedStore<RequestInit>,
    /** Representations of each scale level in this zarr. We pick one and pass it to `zarrGet` to load data. */
    private scaleLevels: NumericZarrArray[],
    /** OME-specified metadata record with most useful info on the current image, e.g. sizes, axis order, etc. */
    private multiscaleMetadata: OMEMultiscale,
    /** OME-specified "transitional" metadata record which we mostly ignore, but which gives channel & volume names. */
    private omeroMetadata: OmeroTransitionalMetadata,
    /**
     * Zarr dimensions may be ordered in many ways or missing altogether (e.g. TCXYZ, TYX). `axesTCZYX` represents
     * dimension order as a mapping from dimensions to their indices in dimension-ordered arrays for this zarr.
     */
    private axesTCZYX: TCZYX<number>,
    /** Handle to a `SubscribableRequestQueue` for smart concurrency management and request cancelling/reissuing. */
    private requestQueue: SubscribableRequestQueue,
    /** Options to configure (pre)fetching behavior. */
    private fetchOptions: ZarrLoaderFetchOptions = DEFAULT_FETCH_OPTIONS,
    /** Direction(s) to prioritize when prefetching. Stored separate from `fetchOptions` since it may be mutated. */
    private priorityDirections: PrefetchDirection[] = []
  ) {
    super();
  }

  static async createLoader(
    url: string,
    scene = 0,
    cache?: VolumeCache,
    queue?: SubscribableRequestQueue,
    fetchOptions?: ZarrLoaderFetchOptions
  ): Promise<OMEZarrLoader> {
    // Setup queue and store, get basic metadata
    if (!queue) {
      queue = new SubscribableRequestQueue(fetchOptions?.concurrencyLimit, fetchOptions?.prefetchConcurrencyLimit);
    }
    const store = new WrappedStore<RequestInit>(new FetchStore(url), cache, queue);
    const root = zarr.root(store);
    const group = await zarr.open(root, { kind: "group" });
    const { multiscales, omero } = group.attrs as OMEZarrMetadata;

    // Pick scene (multiscale)
    if (scene > multiscales.length) {
      console.warn(`WARNING: OMEZarrLoader: scene ${scene} is invalid. Using scene 0.`);
      scene = 0;
    }
    const multiscale = multiscales[scene];

    // Open all scale levels of multiscale
    const scaleLevelPromises = multiscale.datasets.map(({ path }) => zarr.open(root.resolve(path), { kind: "array" }));
    const scaleLevels = (await Promise.all(scaleLevelPromises)) as NumericZarrArray[];
    const axisTCZYX = remapAxesToTCZYX(multiscale.axes);

    const priorityDirs = fetchOptions?.priorityDirections ? fetchOptions.priorityDirections.slice() : undefined;
    return new OMEZarrLoader(store, scaleLevels, multiscale, omero, axisTCZYX, queue, fetchOptions, priorityDirs);
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

  private getLevelShapesZYX(): [number, number, number][] {
    const [z, y, x] = this.axesTCZYX.slice(-3);
    return this.scaleLevels.map(({ shape }) => [z === -1 ? 1 : shape[z], shape[y], shape[x]]);
  }

  private getScale(level: number): TCZYX<number> {
    return getScale(this.multiscaleMetadata.datasets[level], this.axesTCZYX);
  }

  private orderByDimension<T>(valsTCZYX: TCZYX<T>): T[] {
    return orderByDimension(valsTCZYX, this.axesTCZYX);
  }

  private orderByTCZYX<T>(valsDimension: T[], defaultValue: T): TCZYX<T> {
    return orderByTCZYX(valsDimension, this.axesTCZYX, defaultValue);
  }

  /**
   * Change which directions to prioritize when prefetching. All chunks will be prefetched in these directions before
   * any chunks are prefetched in any other directions.
   */
  setPrefetchPriority(directions: PrefetchDirection[]): void {
    this.priorityDirections = directions;
  }

  syncMultichannelLoading(sync: boolean): void {
    this.syncChannels = sync;
  }

  loadDims(loadSpec: LoadSpec): Promise<VolumeDims[]> {
    const [spaceUnit, timeUnit] = this.getUnitSymbols();
    // Compute subregion size so we can factor that in
    const maxExtent = this.maxExtent ?? new Box3(new Vector3(0, 0, 0), new Vector3(1, 1, 1));
    const subregion = composeSubregion(loadSpec.subregion, maxExtent);
    const regionSize = subregion.getSize(new Vector3());
    const regionArr = [1, 1, regionSize.z, regionSize.y, regionSize.x];

    const result = this.scaleLevels.map((level, i) => {
      const scale = this.getScale(i);
      const dims = new VolumeDims();

      dims.spaceUnit = spaceUnit;
      dims.timeUnit = timeUnit;
      dims.shape = this.orderByTCZYX(level.shape, 1).map((val, idx) => Math.ceil(val * regionArr[idx]));
      dims.spacing = this.orderByTCZYX(scale, 1);

      return dims;
    });

    return Promise.resolve(result);
  }

  createImageInfo(loadSpec: LoadSpec): Promise<LoadedVolumeInfo> {
    const [t, c, z, y, x] = this.axesTCZYX;
    const hasT = t > -1;
    const hasC = c > -1;
    const hasZ = z > -1;

    const shape0 = this.scaleLevels[0].shape;
    const levelToLoad = pickLevelToLoad(loadSpec, this.getLevelShapesZYX());
    const shapeLv = this.scaleLevels[levelToLoad].shape;

    const [spatialUnit, timeUnit] = this.getUnitSymbols();
    const numChannels = hasC ? shapeLv[c] : 1;
    const times = hasT ? shapeLv[t] : 1;

    if (!this.maxExtent) {
      this.maxExtent = loadSpec.subregion.clone();
    }
    const pxDims0 = convertSubregionToPixels(
      loadSpec.subregion,
      new Vector3(shape0[x], shape0[y], hasZ ? shape0[z] : 1)
    );
    const pxSize0 = pxDims0.getSize(new Vector3());
    const pxDimsLv = convertSubregionToPixels(
      loadSpec.subregion,
      new Vector3(shapeLv[x], shapeLv[y], hasZ ? shapeLv[z] : 1)
    );
    const pxSizeLv = pxDimsLv.getSize(new Vector3());

    const atlasTileDims = computePackedAtlasDims(pxSizeLv.z, pxSizeLv.x, pxSizeLv.y);

    const channelNames = this.omeroMetadata.channels.map((ch) => ch.label);

    // for physicalPixelSize, we use the scale of the first level
    const scale5d = this.getScale(0);
    // assume that ImageInfo wants the timeScale of level 0
    const timeScale = hasT ? scale5d[t] : 1;

    const imgdata: ImageInfo = {
      name: this.omeroMetadata.name,

      originalSize: pxSize0,
      atlasTileDims,
      volumeSize: pxSizeLv,
      subregionSize: pxSizeLv.clone(),
      subregionOffset: new Vector3(0, 0, 0),
      physicalPixelSize: new Vector3(scale5d[x], scale5d[y], hasZ ? scale5d[z] : Math.min(scale5d[x], scale5d[y])),
      spatialUnit,

      numChannels,
      channelNames,
      times,
      timeScale,
      timeUnit,
      numMultiscaleLevels: this.scaleLevels.length,
      multiscaleLevel: levelToLoad,

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

    return Promise.resolve({ imageInfo: imgdata, loadSpec: fullExtentLoadSpec });
  }

  private async prefetchChunk(basePath: string, coords: TCZYX<number>, subscriber: SubscriberId): Promise<void> {
    const separator = basePath.endsWith("/") ? "" : "/";
    const key = basePath + separator + this.orderByDimension(coords).join("/");
    try {
      // Calling `get` and doing nothing with the result still triggers a cache check, fetch, and insertion
      await this.store.get(key as AbsolutePath, { subscriber, isPrefetch: true });
    } catch (e) {
      if (e !== CHUNK_REQUEST_CANCEL_REASON) {
        throw e;
      }
    }
  }

  /** Reads a list of chunk keys requested by a `loadVolumeData` call and sets up appropriate prefetch requests. */
  private beginPrefetch(keys: string[], scaleLevel: NumericZarrArray): void {
    const numDims = getDimensionCount(this.axesTCZYX);

    // Convert keys to arrays of coords
    const chunkCoords = keys.map((key) => {
      const coordsInDimensionOrder = key
        .trim()
        .split("/")
        .slice(-numDims)
        .filter((s) => s !== "")
        .map((s) => parseInt(s, 10));
      return this.orderByTCZYX(coordsInDimensionOrder, 0);
    });

    // Get number of chunks per dimension in `scaleLevel`
    const chunkDimsUnordered = scaleLevel.shape.map((dim, idx) => Math.ceil(dim / scaleLevel.chunks[idx]));
    const chunkDims = this.orderByTCZYX(chunkDimsUnordered, 1);

    const subscriber = this.requestQueue.addSubscriber();
    // `ChunkPrefetchIterator` yields chunk coordinates in order of roughly how likely they are to be loaded next
    const chunkDimsTZYX: [number, number, number, number] = [chunkDims[0], chunkDims[2], chunkDims[3], chunkDims[4]];
    const prefetchIterator = new ChunkPrefetchIterator(
      chunkCoords,
      this.fetchOptions.maxPrefetchDistance,
      chunkDimsTZYX,
      this.priorityDirections
    );

    let prefetchCount = 0;
    for (const chunk of prefetchIterator) {
      if (prefetchCount >= this.fetchOptions.maxPrefetchChunks) {
        break;
      }
      this.prefetchChunk(scaleLevel.path, chunk, subscriber);
      prefetchCount++;
    }

    // Clear out old prefetch requests (requests which also cover this new prefetch will be preserved)
    if (this.prefetchSubscriber !== undefined) {
      this.requestQueue.removeSubscriber(this.prefetchSubscriber, CHUNK_REQUEST_CANCEL_REASON);
    }
    this.prefetchSubscriber = subscriber;
  }

  loadRawChannelData(
    imageInfo: ImageInfo,
    loadSpec: LoadSpec,
    onData: RawChannelDataCallback
  ): Promise<{ imageInfo: ImageInfo }> {
    const syncChannels = this.syncChannels;

    const maxExtent = this.maxExtent ?? new Box3(new Vector3(0, 0, 0), new Vector3(1, 1, 1));
    const [z, y, x] = this.axesTCZYX.slice(2);
    const subregion = composeSubregion(loadSpec.subregion, maxExtent);

    const levelIdx = pickLevelToLoad({ ...loadSpec, subregion }, this.getLevelShapesZYX());
    const level = this.scaleLevels[levelIdx];
    const levelShape = level.shape;

    const regionPx = convertSubregionToPixels(
      subregion,
      new Vector3(levelShape[x], levelShape[y], z === -1 ? 1 : levelShape[z])
    );
    // Update volume `imageInfo` to reflect potentially new dimensions
    const regionSizePx = regionPx.getSize(new Vector3());
    const atlasTileDims = computePackedAtlasDims(regionSizePx.z, regionSizePx.x, regionSizePx.y);
    const volExtentPx = convertSubregionToPixels(
      maxExtent,
      new Vector3(levelShape[x], levelShape[y], z === -1 ? 1 : levelShape[z])
    );
    const volSizePx = volExtentPx.getSize(new Vector3());
    const updatedImageInfo: ImageInfo = {
      ...imageInfo,
      atlasTileDims,
      volumeSize: volSizePx,
      subregionSize: regionSizePx,
      subregionOffset: regionPx.min,
      multiscaleLevel: levelIdx,
    };

    const { numChannels } = updatedImageInfo;
    const channelIndexes = loadSpec.channels ?? Array.from({ length: numChannels }, (_, i) => i);

    const subscriber = this.requestQueue.addSubscriber();

    // Prefetch housekeeping: we want to save keys involved in this load to prefetch later
    const keys: string[] = [];
    const reportKey = (key: string, sub: SubscriberId) => {
      if (sub === subscriber) {
        keys.push(key);
      }
    };

    const resultChannelIndices: number[] = [];
    const resultChannelData: zarr.TypedArray<zarr.NumberDataType>[] = [];
    const resultChannelDtype: zarr.NumberDataType[] = [];
    const resultChannelRanges: [number, number][] = [];

    const channelPromises = channelIndexes.map(async (ch) => {
      // Build slice spec
      const { min, max } = regionPx;
      const unorderedSpec = [loadSpec.time, ch, slice(min.z, max.z), slice(min.y, max.y), slice(min.x, max.x)];
      const sliceSpec = this.orderByDimension(unorderedSpec as TCZYX<number | Slice>);

      try {
        const result = await zarrGet(level, sliceSpec, { opts: { subscriber, reportKey } });
        const converted = convertChannel(result.data, level.dtype);
        if (syncChannels) {
          resultChannelDtype.push(converted[1]);
          resultChannelData.push(converted[0]);
          resultChannelIndices.push(ch);
          resultChannelRanges.push([converted[2], converted[3]]);
        } else {
          onData([ch], [converted[1]], [converted[0]], [[converted[2], converted[3]]]);
        }
      } catch (e) {
        // TODO: verify that cancelling requests in progress doesn't leak memory
        if (e !== CHUNK_REQUEST_CANCEL_REASON) {
          console.log(e);
          throw e;
        }
      }
    });

    // Cancel any in-flight requests from previous loads that aren't useful to this one
    if (this.loadSubscriber !== undefined) {
      this.requestQueue.removeSubscriber(this.loadSubscriber, CHUNK_REQUEST_CANCEL_REASON);
    }
    this.loadSubscriber = subscriber;

    this.beginPrefetch(keys, level);

    Promise.all(channelPromises).then(() => {
      if (syncChannels) {
        onData(resultChannelIndices, resultChannelDtype, resultChannelData, resultChannelRanges);
      }
      this.requestQueue.removeSubscriber(subscriber, CHUNK_REQUEST_CANCEL_REASON);
    });
    return Promise.resolve({ imageInfo: updatedImageInfo });
  }
}

export { OMEZarrLoader };

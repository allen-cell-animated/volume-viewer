import { Box3, Vector3 } from "three";

import * as zarr from "@zarrita/core";
import { get as zarrGet, slice, Slice } from "@zarrita/indexing";
import { AbsolutePath } from "@zarrita/storage";
// Importing `FetchStore` from its home subpackage (@zarrita/storage) causes errors.
// Getting it from the top-level package means we don't get its type. This is also a bug, but it's more acceptable.
import { FetchStore } from "zarrita";

import { ImageInfo } from "../Volume";
import VolumeCache from "../VolumeCache";
import SubscribableRequestQueue from "../utils/SubscribableRequestQueue";
import {
  ThreadableVolumeLoader,
  LoadSpec,
  RawChannelDataCallback,
  VolumeDims,
  LoadedVolumeInfo,
} from "./IVolumeLoader";
import {
  composeSubregion,
  computePackedAtlasDims,
  convertSubregionToPixels,
  unitNameToSymbol,
} from "./VolumeLoaderUtils";
import ChunkPrefetchIterator from "./zarr_utils/ChunkPrefetchIterator";
import WrappedStore from "./zarr_utils/WrappedStore";
import {
  getDimensionCount,
  getScale,
  matchSourceScaleLevels,
  orderByDimension,
  orderByTCZYX,
  pickLevelToLoad,
  remapAxesToTCZYX,
} from "./zarr_utils/utils";
import {
  OMEZarrMetadata,
  SubscriberId,
  TCZYX,
  PrefetchDirection,
  ZarrSource,
  NumericZarrArray,
} from "./zarr_utils/types";

const CHUNK_REQUEST_CANCEL_REASON = "chunk request cancelled";

function convertChannel(channelData: zarr.TypedArray<zarr.NumberDataType>): Uint8Array {
  if (channelData instanceof Uint8Array) {
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

type ZarrChunkFetchInfo = {
  sourceIdx: number;
  key: string;
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

  private constructor(
    /**
     * Array of records, each containing the objects and metadata we need to load from one source of multiscale zarr
     * data. See documentation on `ZarrSource` for more.
     */
    private sources: ZarrSource[],
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
    urls: string | string[],
    scenes: number | number[] = 0,
    cache?: VolumeCache,
    queue?: SubscribableRequestQueue,
    fetchOptions?: ZarrLoaderFetchOptions
  ): Promise<OMEZarrLoader> {
    // Setup queue and store, get basic metadata
    if (!queue) {
      queue = new SubscribableRequestQueue(fetchOptions?.concurrencyLimit, fetchOptions?.prefetchConcurrencyLimit);
    }
    const urlsArr = Array.isArray(urls) ? urls : [urls];
    const scenesArr = Array.isArray(scenes) ? scenes : [scenes];
    let channelCount = 0;

    // Create one `ZarrSource` per URL
    const sourceProms = urlsArr.map(async (url, i) => {
      const store = new WrappedStore<RequestInit>(new FetchStore(url), cache, queue);
      const root = zarr.root(store);
      const group = await zarr.open(root, { kind: "group" });
      const { multiscales, omero } = group.attrs as OMEZarrMetadata;

      // Pick scene (multiscale)
      let scene = scenesArr[Math.min(i, scenesArr.length - 1)];
      if (scene > multiscales.length) {
        console.warn(`WARNING: OMEZarrLoader: scene ${scene} is invalid. Using scene 0.`);
        scene = 0;
      }
      const multiscaleMetadata = multiscales[scene];

      // Open all scale levels of multiscale
      const lvlProms = multiscaleMetadata.datasets.map(({ path }) => zarr.open(root.resolve(path), { kind: "array" }));
      const scaleLevels = (await Promise.all(lvlProms)) as NumericZarrArray[];
      const axesTCZYX = remapAxesToTCZYX(multiscaleMetadata.axes);

      const channelOffset = channelCount;
      channelCount += omero.channels.length;
      return {
        scaleLevels,
        multiscaleMetadata,
        omeroMetadata: omero,
        axesTCZYX,
        channelOffset,
      } as ZarrSource;
    });
    const sources = await Promise.all(sourceProms);
    // Ensure the sizes of all sources' scale levels are matched up. See this function's docs for more.
    matchSourceScaleLevels(sources);
    // TODO: if `matchSourceScaleLevels` returned successfully, every one of these sources' `multiscaleMetadata` is the
    // same in every field we care about, so we only ever use the first source's `multiscaleMetadata` after this point.
    // Should we only store one `OMEMultiscale` record total, rather than one per source?
    const priorityDirs = fetchOptions?.priorityDirections ? fetchOptions.priorityDirections.slice() : undefined;
    return new OMEZarrLoader(sources, queue, fetchOptions, priorityDirs);
  }

  private getUnitSymbols(): [string, string] {
    const source = this.sources[0];
    // Assume all spatial axes in all sources have the same units - we have no means of storing per-axis unit symbols
    const xi = source.axesTCZYX[4];
    const spaceUnitName = source.multiscaleMetadata.axes[xi].unit;
    const spaceUnitSymbol = unitNameToSymbol(spaceUnitName) || spaceUnitName || "";

    const ti = source.axesTCZYX[0];
    const timeUnitName = ti > -1 ? source.multiscaleMetadata.axes[ti].unit : undefined;
    const timeUnitSymbol = unitNameToSymbol(timeUnitName) || timeUnitName || "";

    return [spaceUnitSymbol, timeUnitSymbol];
  }

  private getLevelShapesZYX(): [number, number, number][] {
    const source = this.sources[0];
    const [z, y, x] = source.axesTCZYX.slice(-3);
    return source.scaleLevels.map(({ shape }) => [z === -1 ? 1 : shape[z], shape[y], shape[x]]);
  }

  private getScale(level: number): TCZYX<number> {
    return getScale(this.sources[0].multiscaleMetadata.datasets[level], this.sources[0].axesTCZYX);
  }

  private orderByDimension<T>(valsTCZYX: TCZYX<T>, sourceIdx = 0): T[] {
    return orderByDimension(valsTCZYX, this.sources[sourceIdx].axesTCZYX);
  }

  private orderByTCZYX<T>(valsDimension: T[], defaultValue: T, sourceIdx = 0): TCZYX<T> {
    return orderByTCZYX(valsDimension, this.sources[sourceIdx].axesTCZYX, defaultValue);
  }

  /**
   * Converts a volume channel index to the index of its zarr source and its channel index within that zarr.
   * e.g., if the loader has 2 zarrs, the first with 3 channels and the second with 2, then `matchChannelToSource(4)`
   * returns `[1, 1]` (the second channel of the second zarr).
   */
  private matchChannelToSource(channelIdx: number): [number, number] {
    const sourceIdx = this.sources.findIndex((src) => src.channelOffset <= channelIdx);
    if (sourceIdx === -1) {
      throw new Error("Channel index out of range");
    }
    return [sourceIdx, channelIdx - this.sources[sourceIdx].channelOffset];
  }

  /**
   * Change which directions to prioritize when prefetching. All chunks will be prefetched in these directions before
   * any chunks are prefetched in any other directions.
   */
  setPrefetchPriority(directions: PrefetchDirection[]): void {
    this.priorityDirections = directions;
  }

  loadDims(loadSpec: LoadSpec): Promise<VolumeDims[]> {
    const [spaceUnit, timeUnit] = this.getUnitSymbols();
    // Compute subregion size so we can factor that in
    const maxExtent = this.maxExtent ?? new Box3(new Vector3(0, 0, 0), new Vector3(1, 1, 1));
    const subregion = composeSubregion(loadSpec.subregion, maxExtent);
    const regionSize = subregion.getSize(new Vector3());
    const regionArr = [1, 1, regionSize.z, regionSize.y, regionSize.x];

    const result = this.sources[0].scaleLevels.map((level, i) => {
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
    // We ensured most info (dims, chunks, etc.) matched between sources earlier, so we can just use the first source.
    const source0 = this.sources[0];
    const [t, , z, y, x] = source0.axesTCZYX;
    const hasT = t > -1;
    const hasZ = z > -1;

    const shape0 = source0.scaleLevels[0].shape;
    const levelToLoad = pickLevelToLoad(loadSpec, this.getLevelShapesZYX());
    const shapeLv = source0.scaleLevels[levelToLoad].shape;

    const [spatialUnit, timeUnit] = this.getUnitSymbols();

    // Now we care about other sources: # of channels is the `channelOffset` of the last source plus its # of channels
    const sourceLast = this.sources[this.sources.length - 1];
    const cLast = sourceLast.axesTCZYX[1];
    const lastHasC = cLast > -1;
    const numChannels = sourceLast.channelOffset + (lastHasC ? sourceLast.scaleLevels[levelToLoad].shape[cLast] : 1);
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

    // Channel names is the other place where we have to check every source
    const channelNamesMap = new Map<string, number>();
    const channelNames = this.sources.flatMap((src) => {
      return src.omeroMetadata.channels.map((ch) => {
        const numMatchingChannels = channelNamesMap.get(ch.label);
        if (numMatchingChannels !== undefined) {
          channelNamesMap.set(ch.label, numMatchingChannels + 1);
          return `${ch.label} (${numMatchingChannels})`;
        } else {
          channelNamesMap.set(ch.label, 1);
          return ch.label;
        }
      });
    });

    const scale5d = this.getScale(levelToLoad);
    const timeScale = hasT ? scale5d[t] : 1;

    const imgdata: ImageInfo = {
      name: source0.omeroMetadata.name,

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
      numMultiscaleLevels: source0.scaleLevels.length,
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

  private async prefetchChunk(
    scaleLevel: NumericZarrArray,
    coords: TCZYX<number>,
    subscriber: SubscriberId
  ): Promise<void> {
    const { store, path } = scaleLevel;
    const separator = path.endsWith("/") ? "" : "/";
    const key = path + separator + this.orderByDimension(coords).join("/");
    try {
      // Calling `get` and doing nothing with the result still triggers a cache check, fetch, and insertion
      await store.get(key as AbsolutePath, { subscriber, isPrefetch: true });
    } catch (e) {
      if (e !== CHUNK_REQUEST_CANCEL_REASON) {
        throw e;
      }
    }
  }

  /** Reads a list of chunk keys requested by a `loadVolumeData` call and sets up appropriate prefetch requests. */
  private beginPrefetch(keys: ZarrChunkFetchInfo[], scaleLevels: NumericZarrArray[]): void {
    // Convert keys to arrays of coords
    const chunkCoords = keys.map(({ sourceIdx, key }) => {
      const numDims = getDimensionCount(this.sources[sourceIdx].axesTCZYX);
      const coordsInDimensionOrder = key
        .trim()
        .split("/")
        .slice(-numDims)
        .filter((s) => s !== "")
        .map((s) => parseInt(s, 10));
      const sourceCoords = this.orderByTCZYX(coordsInDimensionOrder, 0, sourceIdx);
      sourceCoords[1] += this.sources[sourceIdx].channelOffset;
      return sourceCoords;
    });

    // Get number of chunks per dimension in `scaleLevel`
    const level0 = scaleLevels[0];
    const chunkDimsUnordered = level0.shape.map((dim, idx) => Math.ceil(dim / level0.chunks[idx]));
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
      const [sourceIdx, sourceCh] = this.matchChannelToSource(chunk[1]);
      const scaleLevel = scaleLevels[sourceIdx];
      chunk[1] = sourceCh;
      this.prefetchChunk(scaleLevel, chunk, subscriber);
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
    const maxExtent = this.maxExtent ?? new Box3(new Vector3(0, 0, 0), new Vector3(1, 1, 1));
    const [z, y, x] = this.sources[0].axesTCZYX.slice(2);
    const subregion = composeSubregion(loadSpec.subregion, maxExtent);

    const levelIdx = pickLevelToLoad({ ...loadSpec, subregion }, this.getLevelShapesZYX());
    const arraysAtLevel = this.sources.map((src) => src.scaleLevels[levelIdx]);
    const array0Shape = arraysAtLevel[0].shape;

    const regionPx = convertSubregionToPixels(
      subregion,
      new Vector3(array0Shape[x], array0Shape[y], z === -1 ? 1 : array0Shape[z])
    );
    // Update volume `imageInfo` to reflect potentially new dimensions
    const regionSizePx = regionPx.getSize(new Vector3());
    const atlasTileDims = computePackedAtlasDims(regionSizePx.z, regionSizePx.x, regionSizePx.y);
    const volExtentPx = convertSubregionToPixels(
      maxExtent,
      new Vector3(array0Shape[x], array0Shape[y], z === -1 ? 1 : array0Shape[z])
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
    const keys: ZarrChunkFetchInfo[] = [];
    const reportKeyBase = (sourceIdx: number, key: string, sub: SubscriberId) => {
      if (sub === subscriber) {
        keys.push({ sourceIdx, key });
      }
    };

    const channelPromises = channelIndexes.map(async (ch) => {
      // Build slice spec
      const { min, max } = regionPx;
      const [sourceIdx, sourceCh] = this.matchChannelToSource(ch);
      const unorderedSpec = [loadSpec.time, sourceCh, slice(min.z, max.z), slice(min.y, max.y), slice(min.x, max.x)];

      const level = this.sources[sourceIdx].scaleLevels[levelIdx];
      const sliceSpec = this.orderByDimension(unorderedSpec as TCZYX<number | Slice>, sourceIdx);
      const reportKey = (key: string, sub: SubscriberId) => reportKeyBase(sourceIdx, key, sub);

      try {
        const result = await zarrGet(level, sliceSpec, { opts: { subscriber, reportKey } });
        const u8 = convertChannel(result.data);
        onData(ch, u8);
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

    this.beginPrefetch(keys, arraysAtLevel);

    Promise.all(channelPromises).then(() => {
      this.requestQueue.removeSubscriber(subscriber, CHUNK_REQUEST_CANCEL_REASON);
    });
    return Promise.resolve({ imageInfo: updatedImageInfo });
  }
}

export { OMEZarrLoader };

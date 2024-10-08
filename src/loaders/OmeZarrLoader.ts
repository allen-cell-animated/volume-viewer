import { Box3, Vector3 } from "three";

import * as zarr from "@zarrita/core";
import { get as zarrGet, slice, Slice } from "@zarrita/indexing";
import { AbsolutePath } from "@zarrita/storage";
// Importing `FetchStore` from its home subpackage (@zarrita/storage) causes errors.
// Getting it from the top-level package means we don't get its type. This is also a bug, but it's more acceptable.
import { FetchStore } from "zarrita";

import { ImageInfo } from "../ImageInfo.js";
import { VolumeDims2 } from "../VolumeDims.js";
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
  pickLevelToLoad,
  unitNameToSymbol,
} from "./VolumeLoaderUtils.js";
import ChunkPrefetchIterator from "./zarr_utils/ChunkPrefetchIterator.js";
import WrappedStore from "./zarr_utils/WrappedStore.js";
import {
  getDimensionCount,
  getScale,
  getSourceChannelNames,
  matchSourceScaleLevels,
  orderByDimension,
  orderByTCZYX,
  remapAxesToTCZYX,
} from "./zarr_utils/utils.js";
import type {
  OMEZarrMetadata,
  PrefetchDirection,
  SubscriberId,
  TCZYX,
  ZarrSource,
  NumericZarrArray,
} from "./zarr_utils/types.js";
import { VolumeLoadError, VolumeLoadErrorType, wrapVolumeLoadError } from "./VolumeLoadError.js";
import { validateOMEZarrMetadata } from "./zarr_utils/validation.js";

const CHUNK_REQUEST_CANCEL_REASON = "chunk request cancelled";

// returns the converted data and the original min and max values
function convertChannel(
  channelData: zarr.TypedArray<zarr.NumberDataType>,
  dtype: zarr.NumberDataType
): { data: zarr.TypedArray<zarr.NumberDataType>; dtype: zarr.NumberDataType; min: number; max: number } {
  // get min and max
  // TODO FIXME Histogram will also compute min and max!
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

  if (dtype === "float64") {
    // convert to float32
    const f32 = new Float32Array(channelData.length);
    for (let i = 0; i < channelData.length; i++) {
      f32[i] = channelData[i];
    }
    dtype = "float32";
    channelData = f32;
  }

  return { data: channelData, dtype, min, max };
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
  /** only use priority directions */
  onlyPriorityDirections?: boolean;
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

  private syncChannels = false;

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

  /**
   * Creates a new `OMEZarrLoader`.
   *
   * @param urls The URL(s) of the OME-Zarr data to load. If `urls` is an array, the loader will attempt to find scale
   *  levels with exactly the same size in every source. If matching level(s) are available, the loader will produce a
   *  volume containing all channels from every provided zarr in the order they appear in `urls`. If no matching sets
   *  of scale levels are available, creation fails.
   * @param scenes The scene(s) to load from each URL. If `urls` is an array, `scenes` may either be an array of values
   *  corresponding to each URL, or a single value to apply to all URLs. Default 0.
   * @param cache A cache to use for storing fetched data. If not provided, a new cache will be created.
   * @param queue A queue to use for managing requests. If not provided, a new queue will be created.
   * @param fetchOptions Options to configure (pre)fetching behavior.
   */
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

    // Create one `ZarrSource` per URL
    const sourceProms = urlsArr.map(async (url, i) => {
      const store = new WrappedStore<RequestInit>(new FetchStore(url), cache, queue);
      const root = zarr.root(store);

      const group = await zarr
        .open(root, { kind: "group" })
        .catch(wrapVolumeLoadError(`Failed to open OME-Zarr data at ${url}`, VolumeLoadErrorType.NOT_FOUND));

      // Pick scene (multiscale)
      let scene = scenesArr[Math.min(i, scenesArr.length - 1)];
      if (scene > group.attrs.multiscales?.length) {
        console.warn(`WARNING: OMEZarrLoader: scene ${scene} is invalid. Using scene 0.`);
        scene = 0;
      }

      validateOMEZarrMetadata(group.attrs, scene, urlsArr.length > 1 ? `Zarr source ${i}` : "Zarr");
      const { multiscales, omero } = group.attrs as OMEZarrMetadata;
      const multiscaleMetadata = multiscales[scene];

      // Open all scale levels of multiscale
      const lvlProms = multiscaleMetadata.datasets.map(({ path }) =>
        zarr
          .open(root.resolve(path), { kind: "array" })
          .catch(
            wrapVolumeLoadError(
              `Failed to open scale level ${path} of OME-Zarr data at ${url}`,
              VolumeLoadErrorType.NOT_FOUND
            )
          )
      );
      const scaleLevels = (await Promise.all(lvlProms)) as NumericZarrArray[];
      const axesTCZYX = remapAxesToTCZYX(multiscaleMetadata.axes);

      return {
        scaleLevels,
        multiscaleMetadata,
        omeroMetadata: omero,
        axesTCZYX,
        channelOffset: 0,
      } as ZarrSource;
    });
    const sources = await Promise.all(sourceProms);

    // Set `channelOffset`s so we can match channel indices to sources
    let channelCount = 0;
    for (const s of sources) {
      s.channelOffset = channelCount;
      channelCount += s.omeroMetadata?.channels.length ?? s.scaleLevels[0].shape[s.axesTCZYX[1]];
    }
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
   * e.g., if the loader has 2 sources, the first with 3 channels and the second with 2, then `matchChannelToSource(4)`
   * returns `[1, 1]` (the second channel of the second source).
   */
  private matchChannelToSource(absoluteChannelIndex: number): { sourceIndex: number; channelIndexInSource: number } {
    const lastSrcIdx = this.sources.length - 1;
    const lastSrc = this.sources[lastSrcIdx];
    const lastSrcNumChannels = lastSrc.scaleLevels[0].shape[lastSrc.axesTCZYX[1]];

    const maxChannelIndex = lastSrc.channelOffset + lastSrcNumChannels;
    if (absoluteChannelIndex > maxChannelIndex) {
      throw new VolumeLoadError(
        `Volume channel index ${absoluteChannelIndex} out of range (${maxChannelIndex} channels available)`,
        { type: VolumeLoadErrorType.INVALID_METADATA }
      );
    }

    const firstGreaterIdx = this.sources.findIndex((src) => src.channelOffset > absoluteChannelIndex);
    const sourceIndex = firstGreaterIdx === -1 ? lastSrcIdx : firstGreaterIdx - 1;
    const channelIndexInSource = absoluteChannelIndex - this.sources[sourceIndex].channelOffset;
    return { sourceIndex, channelIndexInSource };
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

  updateFetchOptions(options: Partial<ZarrLoaderFetchOptions>): void {
    this.fetchOptions = { ...this.fetchOptions, ...options };
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
      dims.shape = this.orderByTCZYX(level.shape, 1).map((val, idx) => Math.max(Math.ceil(val * regionArr[idx]), 1));
      dims.spacing = this.orderByTCZYX(scale, 1);
      dims.dataType = level.dtype;

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

    //const shape0 = source0.scaleLevels[0].shape;
    const levelToLoad = pickLevelToLoad(loadSpec, this.getLevelShapesZYX());
    const shapeLv = source0.scaleLevels[levelToLoad].shape;

    const [spatialUnit, timeUnit] = this.getUnitSymbols();

    // Now we care about other sources: # of channels is the `channelOffset` of the last source plus its # of channels
    const sourceLast = this.sources[this.sources.length - 1];
    const cLast = sourceLast.axesTCZYX[1];
    const lastHasC = cLast > -1;
    const numChannels = sourceLast.channelOffset + (lastHasC ? sourceLast.scaleLevels[levelToLoad].shape[cLast] : 1);
    // we need to make sure that the corresponding matched shapes
    // use the min size of T
    let times = 1;
    if (hasT) {
      times = shapeLv[t];
      for (let i = 0; i < this.sources.length; i++) {
        const shape = this.sources[i].scaleLevels[levelToLoad].shape;
        const tindex = this.sources[i].axesTCZYX[0];
        if (shape[tindex] < times) {
          console.warn("The number of time points is not consistent across sources: ", shape[tindex], times);
          times = shape[tindex];
        }
      }
    }

    if (!this.maxExtent) {
      this.maxExtent = loadSpec.subregion.clone();
    }
    // TODO IS IT SAFE TO IGNORE THIS SUBREGION STUFF?
    // const pxDims0 = convertSubregionToPixels(
    //   loadSpec.subregion,
    //   new Vector3(shape0[x], shape0[y], hasZ ? shape0[z] : 1)
    // );
    //const pxSize0 = pxDims0.getSize(new Vector3());

    // from source 0:
    const pxDimsLv = convertSubregionToPixels(
      loadSpec.subregion,
      new Vector3(shapeLv[x], shapeLv[y], hasZ ? shapeLv[z] : 1)
    );
    const pxSizeLv = pxDimsLv.getSize(new Vector3());

    const atlasTileDims = computePackedAtlasDims(pxSizeLv.z, pxSizeLv.x, pxSizeLv.y);

    // Channel names is the other place where we have to check every source
    // Track which channel names we've seen so far, so that we can rename them to avoid name collisions
    const channelNamesMap = new Map<string, number>();
    const channelNames = this.sources.flatMap((src) => {
      const sourceChannelNames = getSourceChannelNames(src);

      // Resolve name collisions
      return sourceChannelNames.map((channelName) => {
        const numMatchingChannels = channelNamesMap.get(channelName);

        if (numMatchingChannels !== undefined) {
          // If e.g. we've seen channel "Membrane" once before, rename this one to "Membrane (1)"
          channelNamesMap.set(channelName, numMatchingChannels + 1);
          return `${channelName} (${numMatchingChannels})`;
        } else {
          channelNamesMap.set(channelName, 1);
          return channelName;
        }
      });
    });

    const alldims: VolumeDims2[] = source0.scaleLevels.map((level, i) => {
      const dims = {
        spaceUnit: spatialUnit,
        timeUnit: timeUnit,
        shape: this.orderByTCZYX(level.shape, 1),
        spacing: this.getScale(i),
        dataType: level.dtype,
      };
      return dims;
    });
    // for physicalPixelSize, we use the scale of the first level
    //const scale5d: TCZYX<number> = this.getScale(0);
    // assume that ImageInfo wants the timeScale of level 0
    //const timeScale = hasT ? scale5d[0] : 1;

    const imgdata: ImageInfo = {
      name: source0.omeroMetadata?.name || "Volume",

      //originalSize: pxSize0,
      atlasTileDims: [atlasTileDims.x, atlasTileDims.y],
      //volumeSize: pxSizeLv,
      subregionSize: [pxSizeLv.x, pxSizeLv.y, pxSizeLv.z], //pxSizeLv.clone(),
      subregionOffset: [0, 0, 0],
      //physicalPixelSize: new Vector3(scale5d[4], scale5d[3], hasZ ? scale5d[2] : Math.min(scale5d[4], scale5d[3])),
      //spatialUnit,

      combinedNumChannels: numChannels,
      channelNames,
      //times,
      //timeScale,
      //timeUnit,
      //numMultiscaleLevels: source0.scaleLevels.length,
      multiscaleLevel: levelToLoad,
      multiscaleLevelDims: alldims,

      transform: {
        translation: [0, 0, 0],
        rotation: [0, 0, 0],
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
    // Calling `get` and doing nothing with the result still triggers a cache check, fetch, and insertion
    await store
      .get(key as AbsolutePath, { subscriber, isPrefetch: true })
      .catch(
        wrapVolumeLoadError(
          `Unable to prefetch chunk with key ${key}`,
          VolumeLoadErrorType.LOAD_DATA_FAILED,
          CHUNK_REQUEST_CANCEL_REASON
        )
      );
  }

  /** Reads a list of chunk keys requested by a `loadVolumeData` call and sets up appropriate prefetch requests. */
  private beginPrefetch(keys: ZarrChunkFetchInfo[], scaleLevel: number): void {
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
      // Convert source channel index to absolute channel index for `ChunkPrefetchIterator`'s benefit
      // (we match chunk coordinates output from `ChunkPrefetchIterator` back to sources below)
      sourceCoords[1] += this.sources[sourceIdx].channelOffset;
      return sourceCoords;
    });

    // Get number of chunks per dimension in every source array
    const chunkDimsTCZYX = this.sources.map((src) => {
      const level = src.scaleLevels[scaleLevel];
      const chunkDimsUnordered = level.shape.map((dim, idx) => Math.ceil(dim / level.chunks[idx]));
      return this.orderByTCZYX(chunkDimsUnordered, 1);
    });
    // `ChunkPrefetchIterator` yields chunk coordinates in order of roughly how likely they are to be loaded next
    const prefetchIterator = new ChunkPrefetchIterator(
      chunkCoords,
      this.fetchOptions.maxPrefetchDistance,
      chunkDimsTCZYX,
      this.priorityDirections,
      this.fetchOptions.onlyPriorityDirections
    );

    const subscriber = this.requestQueue.addSubscriber();
    let prefetchCount = 0;
    for (const chunk of prefetchIterator) {
      if (prefetchCount >= this.fetchOptions.maxPrefetchChunks) {
        break;
      }
      // Match absolute channel coordinate back to source index and channel index
      const { sourceIndex, channelIndexInSource } = this.matchChannelToSource(chunk[1]);
      const sourceScaleLevel = this.sources[sourceIndex].scaleLevels[scaleLevel];
      chunk[1] = channelIndexInSource;
      this.prefetchChunk(sourceScaleLevel, chunk, subscriber);
      prefetchCount++;
    }

    // Clear out old prefetch requests (requests which also cover this new prefetch will be preserved)
    if (this.prefetchSubscriber !== undefined) {
      this.requestQueue.removeSubscriber(this.prefetchSubscriber, CHUNK_REQUEST_CANCEL_REASON);
    }
    this.prefetchSubscriber = subscriber;
  }

  private updateImageInfoForLoad(imageInfo: ImageInfo, loadSpec: LoadSpec): ImageInfo {
    // Apply `this.maxExtent` to subregion, if it exists
    const maxExtent = this.maxExtent ?? new Box3(new Vector3(0, 0, 0), new Vector3(1, 1, 1));
    const subregion = composeSubregion(loadSpec.subregion, maxExtent);

    // Pick the level to load based on the subregion size
    const multiscaleLevel = pickLevelToLoad({ ...loadSpec, subregion }, this.getLevelShapesZYX());
    const array0Shape = this.sources[0].scaleLevels[multiscaleLevel].shape;

    // Convert subregion to volume voxels
    const [z, y, x] = this.sources[0].axesTCZYX.slice(2);
    const regionPx = convertSubregionToPixels(
      subregion,
      new Vector3(array0Shape[x], array0Shape[y], z === -1 ? 1 : array0Shape[z])
    );

    // Derive other image info properties from subregion and level to load
    const subregionSize = regionPx.getSize(new Vector3());
    const atlasTileDims = computePackedAtlasDims(subregionSize.z, subregionSize.x, subregionSize.y);
    // const volumeExtent = convertSubregionToPixels(
    //   maxExtent,
    //   new Vector3(array0Shape[x], array0Shape[y], z === -1 ? 1 : array0Shape[z])
    // );
    //const volumeSize = volumeExtent.getSize(new Vector3());

    return {
      ...imageInfo,
      atlasTileDims: [atlasTileDims.x, atlasTileDims.y],
      //volumeSize,
      subregionSize: [subregionSize.x, subregionSize.y, subregionSize.z],
      subregionOffset: [regionPx.min.x, regionPx.min.y, regionPx.min.z],
      multiscaleLevel,
    };
  }

  async loadRawChannelData(
    imageInfo: ImageInfo,
    loadSpec: LoadSpec,
    onUpdateMetadata: (imageInfo: ImageInfo) => void,
    onData: RawChannelDataCallback
  ): Promise<void> {
    // This seemingly useless line keeps a stable local copy of `syncChannels` which the async closures below capture
    // so that changes to `this.syncChannels` don't affect the behavior of loads in progress.
    const syncChannels = this.syncChannels;

    const updatedImageInfo = this.updateImageInfoForLoad(imageInfo, loadSpec);
    onUpdateMetadata(updatedImageInfo);
    const { combinedNumChannels, multiscaleLevel } = updatedImageInfo;
    const channelIndexes = loadSpec.channels ?? Array.from({ length: combinedNumChannels }, (_, i) => i);

    const subscriber = this.requestQueue.addSubscriber();

    // Prefetch housekeeping: we want to save keys involved in this load to prefetch later
    const keys: ZarrChunkFetchInfo[] = [];
    const reportKeyBase = (sourceIdx: number, key: string, sub: SubscriberId) => {
      if (sub === subscriber) {
        keys.push({ sourceIdx, key });
      }
    };

    const resultChannelIndices: number[] = [];
    const resultChannelData: zarr.TypedArray<zarr.NumberDataType>[] = [];
    const resultChannelDtype: zarr.NumberDataType[] = [];
    const resultChannelRanges: [number, number][] = [];

    const channelPromises = channelIndexes.map(async (ch) => {
      // Build slice spec
      const min = new Vector3(...updatedImageInfo.subregionOffset);
      const max = min.clone().add(new Vector3(...updatedImageInfo.subregionSize));
      const { sourceIndex: sourceIdx, channelIndexInSource: sourceCh } = this.matchChannelToSource(ch);
      const unorderedSpec = [loadSpec.time, sourceCh, slice(min.z, max.z), slice(min.y, max.y), slice(min.x, max.x)];

      const level = this.sources[sourceIdx].scaleLevels[multiscaleLevel];
      const sliceSpec = this.orderByDimension(unorderedSpec as TCZYX<number | Slice>, sourceIdx);
      const reportKey = (key: string, sub: SubscriberId) => reportKeyBase(sourceIdx, key, sub);

      const result = await zarrGet(level, sliceSpec, { opts: { subscriber, reportKey } }).catch(
        wrapVolumeLoadError(
          "Could not load OME-Zarr volume data",
          VolumeLoadErrorType.LOAD_DATA_FAILED,
          CHUNK_REQUEST_CANCEL_REASON
        )
      );

      if (result?.data === undefined) {
        return;
      }

      const converted = convertChannel(result.data, level.dtype);
      if (syncChannels) {
        resultChannelDtype.push(converted.dtype);
        resultChannelData.push(converted.data);
        resultChannelIndices.push(ch);
        resultChannelRanges.push([converted.min, converted.max]);
      } else {
        onData([ch], [converted.dtype], [converted.data], [[converted.min, converted.max]]);
      }
    });

    // Cancel any in-flight requests from previous loads that aren't useful to this one
    if (this.loadSubscriber !== undefined) {
      this.requestQueue.removeSubscriber(this.loadSubscriber, CHUNK_REQUEST_CANCEL_REASON);
    }
    this.loadSubscriber = subscriber;

    this.beginPrefetch(keys, multiscaleLevel);

    await Promise.all(channelPromises);

    if (syncChannels) {
      onData(resultChannelIndices, resultChannelDtype, resultChannelData, resultChannelRanges);
    }
    this.requestQueue.removeSubscriber(subscriber, CHUNK_REQUEST_CANCEL_REASON);
  }
}

export { OMEZarrLoader };

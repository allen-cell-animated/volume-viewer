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
  estimateLevelForAtlas,
  unitNameToSymbol,
} from "./VolumeLoaderUtils";
import ChunkPrefetchIterator from "./zarr_utils/ChunkPrefetchIterator";
import { PrefetchDirection } from "./zarr_utils/types";
import WrappedStore from "./zarr_utils/WrappedStore";
import {
  OMEAxis,
  OMECoordinateTransformation,
  OMEMultiscale,
  OmeroTransitionalMetadata,
  OMEZarrMetadata,
  SubscriberId,
  TCZYX,
} from "./zarr_utils/types";

const CHUNK_REQUEST_CANCEL_REASON = "chunk request cancelled";

/** Turns `axesTCZYX` into the number of dimensions in the array */
const getDimensionCount = ([t, c, z]: TCZYX<number>) => 2 + Number(t > -1) + Number(c > -1) + Number(z > -1);

function remapAxesToTCZYX(axes: OMEAxis[]): TCZYX<number> {
  const axesTCZYX: TCZYX<number> = [-1, -1, -1, -1, -1];
  const axisNames = ["t", "c", "z", "y", "x"];

  axes.forEach((axis, idx) => {
    const axisIdx = axisNames.indexOf(axis.name);
    if (axisIdx > -1) {
      axesTCZYX[axisIdx] = idx;
    } else {
      console.error("ERROR: UNRECOGNIZED AXIS in zarr: " + axis.name);
    }
  });

  // it is possible that Z might not exist but we require X and Y at least.
  if (axesTCZYX[3] === -1 || axesTCZYX[4] === -1) {
    console.error("ERROR: zarr loader expects a y and an x axis.");
  }

  return axesTCZYX;
}

/**
 * Picks the best scale level to load based on scale level dimensions, a max atlas size, and a `LoadSpec`.
 * This works like `estimateLevelForAtlas` but factors in `LoadSpec`'s `subregion` property (shrinks the size of the
 * data, maybe enough to allow loading a higher level) and its `multiscaleLevel` property (sets a max scale level).
 */
function pickLevelToLoad(loadSpec: LoadSpec, spatialDimsZYX: [number, number, number][]): number {
  const size = loadSpec.subregion.getSize(new Vector3());
  const dims = spatialDimsZYX.map(([z, y, x]): [number, number, number] => [
    Math.max(z * size.z, 1),
    Math.max(y * size.y, 1),
    Math.max(x * size.x, 1),
  ]);

  const optimalLevel = estimateLevelForAtlas(dims);
  return Math.max(optimalLevel, loadSpec.multiscaleLevel ?? 0);
}

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

type NumericZarrArray = zarr.Array<zarr.NumberDataType, WrappedStore<RequestInit>>;

type ZarrSource = {
  /** Representations of each scale level in this zarr. We pick one and pass it to `zarrGet` to load data. */
  scaleLevels: NumericZarrArray[];
  /** OME-specified metadata record with most useful info on the current image, e.g. sizes, axis order, etc. */
  // TODO this field is only ever read on the first source. Move it back to `OMEZarrLoader`!
  multiscaleMetadata: OMEMultiscale;
  /** OME-specified "transitional" metadata record which we mostly ignore, but which gives channel & volume names. */
  omeroMetadata: OmeroTransitionalMetadata;
  /**
   * Zarr dimensions may be ordered in many ways or missing altogether (e.g. TCXYZ, TYX). `axesTCZYX` represents
   * dimension order as a mapping from dimensions to their indices in dimension-ordered arrays for this zarr.
   */
  axesTCZYX: TCZYX<number>;
  /** bleh */
  channelOffset: number;
};

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
    /** An abstraction representing a remote data source, used by zarrita to get chunks and by us to prefetch them. */
    // private store: WrappedStore<RequestInit>,
    /** Representations of each scale level in this zarr. We pick one and pass it to `zarrGet` to load data. */
    // private scaleLevels: NumericZarrArray[],
    /** OME-specified metadata record with most useful info on the current image, e.g. sizes, axis order, etc. */
    // private multiscaleMetadata: OMEMultiscale,
    /** OME-specified "transitional" metadata record which we mostly ignore, but which gives channel & volume names. */
    // private omeroMetadata: OmeroTransitionalMetadata,
    /**
     * Zarr dimensions may be ordered in many ways or missing altogether (e.g. TCXYZ, TYX). `axesTCZYX` represents
     * dimension order as a mapping from dimensions to their indices in dimension-ordered arrays for this zarr.
     */
    // private axesTCZYX: TCZYX<number>,
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

  private getScale(level = 0): TCZYX<number> {
    const meta = this.sources[0].multiscaleMetadata;
    const transforms = meta.datasets[level].coordinateTransformations ?? meta.coordinateTransformations;

    if (transforms === undefined) {
      console.error("ERROR: no coordinate transformations for scale level");
      return [1, 1, 1, 1, 1];
    }

    // this assumes we'll never encounter the "path" variant
    const isScaleTransform = (t: OMECoordinateTransformation): t is { type: "scale"; scale: number[] } =>
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
    return scale as TCZYX<number>;
  }

  private getLevelShapesZYX(): [number, number, number][] {
    const source = this.sources[0];
    const [z, y, x] = source.axesTCZYX.slice(-3);
    return source.scaleLevels.map(({ shape }) => [z === -1 ? 1 : shape[z], shape[y], shape[x]]);
  }

  /** Reorder an array of values [T, C, Z, Y, X] to the actual order of those dimensions in the zarr */
  private orderByDimension<T>(valsTCZYX: TCZYX<T>, sourceIdx = 0): T[] {
    const { axesTCZYX } = this.sources[sourceIdx];
    const specLen = getDimensionCount(axesTCZYX);
    const result: T[] = Array(specLen);

    axesTCZYX.forEach((val, idx) => {
      if (val > -1) {
        if (val > specLen) {
          throw new Error("Unexpected axis index");
        }
        result[val] = valsTCZYX[idx];
      }
    });

    return result;
  }

  /** Reorder an array of values in this zarr's dimension order to [T, C, Z, Y, X] */
  private orderByTCZYX<T>(valsDimension: T[], defaultValue: T, sourceIdx = 0): TCZYX<T> {
    const result: TCZYX<T> = [defaultValue, defaultValue, defaultValue, defaultValue, defaultValue];

    this.sources[sourceIdx].axesTCZYX.forEach((val, idx) => {
      if (val > -1) {
        if (val > valsDimension.length) {
          throw new Error("Unexpected axis index");
        }
        result[idx] = valsDimension[val];
      }
    });

    return result;
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
    const channelNames = this.sources.flatMap((src) => src.omeroMetadata.channels.map((ch) => ch.label));

    const scale5d = this.getScale();
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
    const source0 = this.sources[0];
    const [z, y, x] = source0.axesTCZYX.slice(2);
    const subregion = composeSubregion(loadSpec.subregion, maxExtent);

    const levelIdx = pickLevelToLoad({ ...loadSpec, subregion }, this.getLevelShapesZYX());
    const levels = this.sources.map((src) => src.scaleLevels[levelIdx]);
    const level0Shape = levels[0].shape;

    const regionPx = convertSubregionToPixels(
      subregion,
      new Vector3(level0Shape[x], level0Shape[y], z === -1 ? 1 : level0Shape[z])
    );
    // Update volume `imageInfo` to reflect potentially new dimensions
    const regionSizePx = regionPx.getSize(new Vector3());
    const atlasTileDims = computePackedAtlasDims(regionSizePx.z, regionSizePx.x, regionSizePx.y);
    const volExtentPx = convertSubregionToPixels(
      maxExtent,
      new Vector3(level0Shape[x], level0Shape[y], z === -1 ? 1 : level0Shape[z])
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

    this.beginPrefetch(keys, levels);

    Promise.all(channelPromises).then(() => {
      this.requestQueue.removeSubscriber(subscriber, CHUNK_REQUEST_CANCEL_REASON);
    });
    return Promise.resolve({ imageInfo: updatedImageInfo });
  }
}

export { OMEZarrLoader };

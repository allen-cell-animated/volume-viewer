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

/** Turns `axisTCZYX` into the number of dimensions in the array */
const getDimensionCount = ([t, c, z]: TCZYX<number>) => 2 + Number(t > -1) + Number(c > -1) + Number(z > -1);

function remapAxesToTCZYX(axes: OMEAxis[]): TCZYX<number> {
  const axisTCZYX: TCZYX<number> = [-1, -1, -1, -1, -1];
  const axisNames = ["t", "c", "z", "y", "x"];

  axes.forEach((axis, idx) => {
    const axisIdx = axisNames.indexOf(axis.name);
    if (axisIdx > -1) {
      axisTCZYX[axisIdx] = idx;
    } else {
      console.error("ERROR: UNRECOGNIZED AXIS in zarr: " + axis.name);
    }
  });

  // it is possible that Z might not exist but we require X and Y at least.
  if (axisTCZYX[3] === -1 || axisTCZYX[4] === -1) {
    console.error("ERROR: zarr loader expects a y and an x axis.");
  }

  return axisTCZYX;
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
    private store: WrappedStore<RequestInit>,
    private scaleLevels: NumericZarrArray[],
    private multiscaleMetadata: OMEMultiscale,
    private omeroMetadata: OmeroTransitionalMetadata,
    private axesTCZYX: TCZYX<number>,
    private requestQueue: SubscribableRequestQueue,
    private fetchOptions: ZarrLoaderFetchOptions = DEFAULT_FETCH_OPTIONS
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
    const metadata = group.attrs as OMEZarrMetadata;

    // Pick scene (multiscale)
    if (scene > metadata.multiscales.length) {
      console.warn(`WARNING: OMEZarrLoader: scene ${scene} is invalid. Using scene 0.`);
      scene = 0;
    }
    const multiscale = metadata.multiscales[scene];

    // Open all scale levels of multiscale
    const scaleLevelPromises = multiscale.datasets.map(({ path }) => zarr.open(root.resolve(path), { kind: "array" }));
    const scaleLevels = (await Promise.all(scaleLevelPromises)) as NumericZarrArray[];
    const axisTCZYX = remapAxesToTCZYX(multiscale.axes);

    return new OMEZarrLoader(store, scaleLevels, multiscale, metadata.omero, axisTCZYX, queue, fetchOptions);
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

  private getScale(level = 0): TCZYX<number> {
    const meta = this.multiscaleMetadata;
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
    const [z, y, x] = this.axesTCZYX.slice(-3);
    return this.scaleLevels.map(({ shape }) => [z === -1 ? 1 : shape[z], shape[y], shape[x]]);
  }

  /** Reorder an array of values [T, C, Z, Y, X] to the actual order of those dimensions in the zarr */
  private orderByDimension<T>(valsTCZYX: TCZYX<T>): T[] {
    const specLen = getDimensionCount(this.axesTCZYX);
    const result: T[] = Array(specLen);

    this.axesTCZYX.forEach((val, idx) => {
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
  private orderByTCZYX<T>(valsDimension: T[], defaultValue: T): TCZYX<T> {
    const result: TCZYX<T> = [defaultValue, defaultValue, defaultValue, defaultValue, defaultValue];

    this.axesTCZYX.forEach((val, idx) => {
      if (val > -1) {
        if (val > valsDimension.length) {
          throw new Error("Unexpected axis index");
        }
        result[idx] = valsDimension[val];
      }
    });

    return result;
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

    const scale5d = this.getScale();
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
      chunkDimsTZYX
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

    const channelPromises = channelIndexes.map(async (ch) => {
      // Build slice spec
      const { min, max } = regionPx;
      const unorderedSpec = [loadSpec.time, ch, slice(min.z, max.z), slice(min.y, max.y), slice(min.x, max.x)];
      const sliceSpec = this.orderByDimension(unorderedSpec as TCZYX<number | Slice>);

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

    this.beginPrefetch(keys, level);

    Promise.all(channelPromises).then(() => {
      this.requestQueue.removeSubscriber(subscriber, CHUNK_REQUEST_CANCEL_REASON);
    });
    return Promise.resolve({ imageInfo: updatedImageInfo });
  }
}

export { OMEZarrLoader };

import { Box3, Vector2, Vector3 } from "three";
import { openArray, openGroup, HTTPStore } from "zarr";

import { IVolumeLoader, LoadSpec, PerChannelCallback, VolumeDims } from "./IVolumeLoader";
import {
  buildDefaultMetadata,
  composeSubregion,
  convertSubregionToPixels,
  computePackedAtlasDims,
  estimateLevelForAtlas,
  unitNameToSymbol,
} from "./VolumeLoaderUtils";
import Volume, { ImageInfo } from "../Volume";
import { FetchZarrMessage } from "../workers/FetchZarrWorker";
import VolumeCache, { CacheStore } from "../VolumeCache";

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

function getScale({ coordinateTransformations }: OMEDataset | OMEMultiscale): number[] {
  if (coordinateTransformations === undefined) {
    console.log("ERROR: no coordinate transformations for scale level");
    return [1, 1, 1, 1, 1];
  }

  // this assumes we'll never encounter the "path" variant
  const isScaleTransform = (t: CoordinateTransformation): t is { type: "scale"; scale: number[] } => t.type === "scale";

  // there can be any number of coordinateTransformations
  // but there must be only one of type "scale".
  const scaleTransform = coordinateTransformations.find(isScaleTransform);
  if (!scaleTransform) {
    console.log(`ERROR: no coordinate transformation of type "scale" for scale level`);
    return [1, 1, 1, 1, 1];
  }

  return scaleTransform.scale;
}

function imageIndexFromLoadSpec(loadSpec: LoadSpec, multiscales: OMEMultiscale[]): number {
  // each entry of multiscales is a multiscale image.
  let imageIndex = loadSpec.scene;
  if (imageIndex !== 0) {
    console.warn("WARNING: OMEZarrLoader does not support multiple scenes. Results may be invalid.");
  }
  if (imageIndex >= multiscales.length) {
    console.warn(`WARNING: OMEZarrLoader: scene ${imageIndex} is invalid. Using scene 0.`);
    imageIndex = 0;
  }
  return imageIndex;
}

function remapAxesToTCZYX(axes: Axis[]): [number, number, number, number, number] {
  const axisTCZYX: [number, number, number, number, number] = [-1, -1, -1, -1, -1];
  for (let i = 0; i < axes.length; ++i) {
    const axis = axes[i];
    if (axis.name === "t") {
      axisTCZYX[0] = i;
    } else if (axis.name === "c") {
      axisTCZYX[1] = i;
    } else if (axis.name === "z") {
      axisTCZYX[2] = i;
    } else if (axis.name === "y") {
      axisTCZYX[3] = i;
    } else if (axis.name === "x") {
      axisTCZYX[4] = i;
    } else {
      console.log("ERROR: UNRECOGNIZED AXIS in zarr: " + axis.name);
    }
  }
  if (axisTCZYX[2] === -1 || axisTCZYX[3] === -1 || axisTCZYX[4] === -1) {
    console.log("ERROR: zarr loader expects a z, y, and x axis.");
  }
  return axisTCZYX;
}

// TODO use in `loadDims`
async function loadLevelShapes(store: HTTPStore, multiscale: OMEMultiscale): Promise<number[][]> {
  const { datasets, axes } = multiscale;

  const shapePromises = datasets.map(async ({ path }): Promise<number[]> => {
    const level = await openArray({ store, path, mode: "r" });
    const shape = level.meta.shape;
    if (shape.length !== axes.length) {
      console.log("ERROR: shape length " + shape.length + " does not match axes length " + axes.length);
    }
    return shape;
  });

  return await Promise.all(shapePromises);
}

async function loadMetadata(store: HTTPStore, loadSpec: LoadSpec): Promise<OMEZarrMetadata> {
  const data = await openGroup(store, loadSpec.subpath, "r");
  return (await data.attrs.asObject()) as OMEZarrMetadata;
}

function pickLevelToLoad(
  loadSpec: LoadSpec,
  multiscaleDims: number[][],
  { datasets }: OMEMultiscale,
  dimIndexes: number[]
): number {
  const numlevels = multiscaleDims.length;
  // default to lowest level until we find the match
  let levelToLoad = numlevels - 1;
  for (let i = 0; i < numlevels; ++i) {
    if (datasets[i].path == loadSpec.subpath) {
      levelToLoad = i;
      break;
    }
  }

  const size = loadSpec.subregion.getSize(new Vector3());
  const [zi, yi, xi] = dimIndexes.slice(-3);

  const spatialDims = multiscaleDims.map((shape) => [
    Math.max(shape[zi] * size.z, 1),
    Math.max(shape[yi] * size.y, 1),
    Math.max(shape[xi] * size.x, 1),
  ]);
  const optimalLevel = estimateLevelForAtlas(spatialDims, MAX_ATLAS_DIMENSION);
  // assume all levels are decreasing in size.  If a larger level is optimal then use it:
  if (optimalLevel < levelToLoad) {
    return optimalLevel;
  } else {
    return levelToLoad;
  }
}

class OMEZarrLoader implements IVolumeLoader {
  url: string;
  multiscaleDims?: number[][];
  metadata?: OMEZarrMetadata;
  axesTCZYX?: [number, number, number, number, number];
  maxExtent?: Box3;

  cache?: VolumeCache;
  cacheStore?: CacheStore;

  constructor(url: string, cache?: VolumeCache) {
    this.url = url;
    this.cache = cache;
  }

  async loadDims(loadSpec: LoadSpec): Promise<VolumeDims[]> {
    const store = new HTTPStore(this.url);

    const data = await openGroup(store, loadSpec.subpath, "r");

    // get top-level metadata for this zarr image
    const allmetadata = await data.attrs.asObject();
    // each entry of multiscales is a multiscale image.
    const imageIndex = imageIndexFromLoadSpec(loadSpec, allmetadata.multiscales);
    const datasets: OMEDataset[] = allmetadata.multiscales[imageIndex].datasets;
    const axes: Axis[] = allmetadata.multiscales[imageIndex].axes;

    const axisTCZYX = remapAxesToTCZYX(axes);

    // Assume all axes have the same units - we have no means of storing per-axis unit symbols
    const spaceUnitName = axes[axisTCZYX[4]].unit;
    const spaceUnitSymbol = unitNameToSymbol(spaceUnitName) || spaceUnitName || "";

    const timeUnitName = axisTCZYX[0] > -1 ? axes[axisTCZYX[0]].unit : undefined;
    const timeUnitSymbol = unitNameToSymbol(timeUnitName) || timeUnitName || "";

    const dimsPromises = datasets.map(async (dataset): Promise<VolumeDims> => {
      const level = await openArray({ store, path: dataset.path, mode: "r" });
      const shape = level.meta.shape;
      if (shape.length != axes.length) {
        console.log("ERROR: shape length " + shape.length + " does not match axes length " + axes.length);
      }

      const scale5d = getScale(dataset);

      const d = new VolumeDims();
      d.subpath = loadSpec.subpath;
      d.shape = [-1, -1, -1, -1, -1];
      for (let i = 0; i < d.shape.length; ++i) {
        if (axisTCZYX[i] > -1) {
          d.shape[i] = shape[axisTCZYX[i]];
        }
      }
      d.spacing = [1, 1, scale5d[axisTCZYX[2]], scale5d[axisTCZYX[3]], scale5d[axisTCZYX[4]]];
      d.spaceUnit = spaceUnitSymbol;
      d.timeUnit = timeUnitSymbol;
      d.dataType = "uint8";
      return d;
    });

    return Promise.all(dimsPromises);
  }

  async createVolume(loadSpec: LoadSpec, onChannelLoaded?: PerChannelCallback): Promise<Volume> {
    // Load metadata and dimensions.
    const store = new HTTPStore(this.url);
    this.metadata = await loadMetadata(store, loadSpec);
    const imageIndex = imageIndexFromLoadSpec(loadSpec, this.metadata.multiscales);
    const multiscale = this.metadata.multiscales[imageIndex];
    this.multiscaleDims = await loadLevelShapes(store, multiscale);
    this.axesTCZYX = remapAxesToTCZYX(multiscale.axes);
    this.maxExtent = loadSpec.subregion.clone();

    // After this point we consider the loader "open" (bound to one remote source)

    const [t, c, z, y, x] = this.axesTCZYX;
    const hasT = t > -1;
    const hasC = c > -1;

    const shape0 = this.multiscaleDims[0];
    const levelToLoad = pickLevelToLoad(loadSpec, this.multiscaleDims, multiscale, this.axesTCZYX);
    const shapeLv = this.multiscaleDims[levelToLoad];

    const scaleSizes = this.multiscaleDims.map((shape) => new Vector3(shape[x], shape[y], shape[z]));
    this.cacheStore = this.cache?.addVolume(shape0[c], shape0[t], scaleSizes);

    // Assume all axes have the same units - we have no means of storing per-axis unit symbols
    const spaceUnitName = multiscale.axes[x].unit;
    const spaceUnitSymbol = unitNameToSymbol(spaceUnitName) || spaceUnitName || "";

    const timeUnitName = hasT ? multiscale.axes[t].unit : undefined;
    const timeUnitSymbol = unitNameToSymbol(timeUnitName) || timeUnitName || "";

    const channels = hasC ? shapeLv[c] : 1;
    const sizeT = hasT ? shapeLv[t] : 1;

    // we want scale of level 0
    const scale5d = getScale(multiscale.datasets[0]);

    const timeScale = hasT ? scale5d[t] : 1;

    const pxDimsLv = convertSubregionToPixels(loadSpec.subregion, new Vector3(shapeLv[x], shapeLv[y], shapeLv[z]));
    const pxSizeLv = pxDimsLv.getSize(new Vector3());
    const pxDims0 = convertSubregionToPixels(loadSpec.subregion, new Vector3(shape0[x], shape0[y], shape0[z]));
    const pxSize0 = pxDims0.getSize(new Vector3());

    // compute rows and cols and atlas width and ht, given tw and th
    const { nrows, ncols } = computePackedAtlasDims(pxSizeLv.z, pxSizeLv.x, pxSizeLv.y);
    const atlaswidth = ncols * pxSizeLv.x;
    const atlasheight = nrows * pxSizeLv.y;
    console.log("atlas width and height: " + atlaswidth + " " + atlasheight);

    const displayMetadata = this.metadata.omero;
    const chnames: string[] = [];
    for (let i = 0; i < displayMetadata.channels.length; ++i) {
      chnames.push(displayMetadata.channels[i].label);
    }

    const imgdata: ImageInfo = {
      name: displayMetadata.name,

      originalSize: pxSize0,
      atlasTileDims: new Vector2(nrows, ncols),
      volumeSize: pxSizeLv,
      subregionSize: pxSizeLv.clone(),
      subregionOffset: new Vector3(0, 0, 0),
      physicalPixelSize: new Vector3(scale5d[x], scale5d[y], scale5d[z]),
      spatialUnit: spaceUnitSymbol,

      numChannels: channels,
      channelNames: chnames,
      times: sizeT,
      timeScale: timeScale,
      timeUnit: timeUnitSymbol,

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

    // got some data, now let's construct the volume.
    const vol = new Volume(imgdata, fullExtentLoadSpec, this);
    vol.channelLoadCallback = onChannelLoaded;
    vol.imageMetadata = buildDefaultMetadata(imgdata);
    return vol;
  }

  loadVolumeData(vol: Volume, explicitLoadSpec?: LoadSpec, onChannelLoaded?: PerChannelCallback): void {
    if (
      this.axesTCZYX === undefined ||
      this.metadata === undefined ||
      this.multiscaleDims === undefined ||
      this.maxExtent === undefined
    ) {
      console.error("ERROR: called `loadVolumeData` on zarr loader without first opening with `createVolume`!");
      return;
    }

    vol.loadSpec = explicitLoadSpec || vol.loadSpec;
    const subregion = composeSubregion(vol.loadSpec.subregion, this.maxExtent);
    const { numChannels, times } = vol.imageInfo;

    const imageIndex = imageIndexFromLoadSpec(vol.loadSpec, this.metadata.multiscales);
    const multiscale = this.metadata.multiscales[imageIndex];

    const levelToLoad = pickLevelToLoad(
      { ...vol.loadSpec, subregion },
      this.multiscaleDims,
      multiscale,
      this.axesTCZYX
    );
    const datasetPath = multiscale.datasets[levelToLoad].path;
    const levelShape = this.multiscaleDims[levelToLoad];

    const [zi, yi, xi] = this.axesTCZYX.slice(-3);
    const regionPx = convertSubregionToPixels(subregion, new Vector3(levelShape[xi], levelShape[yi], levelShape[zi]));
    const regionSizePx = regionPx.getSize(new Vector3());

    const { nrows, ncols } = computePackedAtlasDims(regionSizePx.z, regionSizePx.x, regionSizePx.y);

    const storepath = vol.loadSpec.subpath + "/" + datasetPath;
    // do each channel on a worker
    for (let i = 0; i < numChannels; ++i) {
      const cacheResult = this.cache?.get(this.cacheStore!, i, {
        region: regionPx,
        time: vol.loadSpec.time,
        scale: levelToLoad,
      });
      if (cacheResult) {
        vol.setChannelDataFromVolume(i, cacheResult);
        onChannelLoaded?.(this.url + "/" + vol.loadSpec.subpath, vol, i);
      } else {
        const worker = new Worker(new URL("../workers/FetchZarrWorker", import.meta.url));
        worker.onmessage = (e) => {
          const u8 = e.data.data;
          const channel = e.data.channel;
          this.cache?.insert(this.cacheStore!, u8, {
            region: regionPx,
            scale: levelToLoad,
            time: vol.loadSpec.time,
            channel,
          });
          vol.setChannelDataFromVolume(channel, u8);
          onChannelLoaded?.(this.url + "/" + vol.loadSpec.subpath, vol, channel);
          worker.terminate();
        };
        worker.onerror = (e) => {
          alert("Error: Line " + e.lineno + " in " + e.filename + ": " + e.message);
        };

        const msg: FetchZarrMessage = {
          url: this.url,
          spec: {
            ...vol.loadSpec,
            subregion: regionPx,
            time: Math.min(vol.loadSpec.time, times),
          },
          channel: i,
          path: storepath,
          axesTCZYX: this.axesTCZYX,
        };
        worker.postMessage(msg);
      }
    }

    // Update volume `imageInfo` to reflect potentially new dimensions
    const volExtentPx = convertSubregionToPixels(
      this.maxExtent,
      new Vector3(levelShape[xi], levelShape[yi], levelShape[zi])
    );
    const volSizePx = volExtentPx.getSize(new Vector3());
    const regionExtentPx = convertSubregionToPixels(vol.loadSpec.subregion, volSizePx);
    vol.imageInfo = {
      ...vol.imageInfo,
      atlasTileDims: new Vector2(nrows, ncols),
      volumeSize: volSizePx,
      subregionSize: regionSizePx,
      subregionOffset: regionExtentPx.min,
    };
    vol.updateDimensions();
  }
}

export { OMEZarrLoader };

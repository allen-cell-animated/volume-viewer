import { openArray, openGroup, HTTPStore } from "zarr";

import {
  IVolumeLoader,
  LoadSpec,
  LoadSpecExtent,
  PerChannelCallback,
  VolumeDims,
  convertLoadSpecRegionToPixels,
  fitLoadSpecRegionToExtent,
} from "./IVolumeLoader";
import {
  buildDefaultMetadata,
  computePackedAtlasDims,
  estimateLevelForAtlas,
  unitNameToSymbol,
} from "./VolumeLoaderUtils";
import Volume, { ImageInfo } from "../Volume";
import { FetchZarrMessage } from "../workers/FetchZarrWorker";

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

function pickLevelToLoad(loadSpec: LoadSpec, multiscaleDims: number[][], dimIndexes: number[]): number {
  const numlevels = multiscaleDims.length;
  // default to lowest level until we find the match
  const levelToLoad = numlevels - 1;
  for (let i = 0; i < numlevels; ++i) {
    // TODO put this back
    // if (multiscaleDims[i].subpath == loadSpec.subpath) {
    //   levelToLoad = i;
    //   break;
    // }
  }

  const { minx = 0, maxx = 1, miny = 0, maxy = 1, minz = 0, maxz = 1 } = loadSpec;
  const xSize = maxx - minx;
  const ySize = maxy - miny;
  const zSize = maxz - minz;
  const [zi, yi, xi] = dimIndexes.slice(-3);

  const spatialDims = multiscaleDims.map((shape) => {
    return [shape[zi] * zSize, shape[yi] * ySize, shape[xi] * xSize];
  });
  const optimalLevel = estimateLevelForAtlas(spatialDims, MAX_ATLAS_DIMENSION);
  // assume all levels are decreasing in size.  If a larger level is optimal then use it:
  if (optimalLevel < levelToLoad) {
    return optimalLevel;
  } else {
    return levelToLoad;
  }
}

class OMEZarrLoader implements IVolumeLoader {
  multiscaleDims?: number[][];
  metadata?: OMEZarrMetadata;
  axesTCZYX?: [number, number, number, number, number];
  maxExtent?: LoadSpecExtent;

  async loadDims(loadSpec: LoadSpec): Promise<VolumeDims[]> {
    const store = new HTTPStore(loadSpec.url);

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

  async createVolume(loadSpec: LoadSpec): Promise<Volume> {
    // Load metadata and dimensions.
    const store = new HTTPStore(loadSpec.url);
    this.metadata = await loadMetadata(store, loadSpec);
    const imageIndex = imageIndexFromLoadSpec(loadSpec, this.metadata.multiscales);
    const multiscale = this.metadata.multiscales[imageIndex];
    this.multiscaleDims = await loadLevelShapes(store, multiscale);
    this.axesTCZYX = remapAxesToTCZYX(multiscale.axes);

    const { minx, maxx, miny, maxy, minz, maxz } = loadSpec;
    this.maxExtent = {
      minx: minx || 0,
      miny: miny || 0,
      minz: minz || 0,
      maxx: maxx === undefined ? 1 : maxx,
      maxy: maxy === undefined ? 1 : maxy,
      maxz: maxz === undefined ? 1 : maxz,
    };
    // After this point we consider the loader "open" (bound to one remote source)

    const [t, c, z, y, x] = this.axesTCZYX;
    const levelToLoad = pickLevelToLoad(loadSpec, this.multiscaleDims, this.axesTCZYX);
    const multiscaleShape = this.multiscaleDims[levelToLoad];

    const shape0 = this.multiscaleDims[0];
    const hasT = t > -1;
    const hasC = c > -1;

    // Assume all axes have the same units - we have no means of storing per-axis unit symbols
    const spaceUnitName = multiscale.axes[x].unit;
    const spaceUnitSymbol = unitNameToSymbol(spaceUnitName) || spaceUnitName || "";

    const timeUnitName = hasT ? multiscale.axes[t].unit : undefined;
    const timeUnitSymbol = unitNameToSymbol(timeUnitName) || timeUnitName || "";

    const channels = hasC ? multiscaleShape[c] : 1;
    const sizeT = hasT ? multiscaleShape[t] : 1;

    // we want scale of level 0
    const scale5d = getScale(multiscale.datasets[0]);

    const timeScale = hasT ? scale5d[t] : 1;
    const multiscaleX = multiscaleShape[x];
    const multiscaleY = multiscaleShape[y];
    const multiscaleZ = multiscaleShape[z];

    const pxSpec = convertLoadSpecRegionToPixels(loadSpec, multiscaleX, multiscaleY, multiscaleZ);

    const tw = pxSpec.maxx - pxSpec.minx;
    const th = pxSpec.maxy - pxSpec.miny;
    const tz = pxSpec.maxz - pxSpec.minz;

    // compute rows and cols and atlas width and ht, given tw and th
    const { nrows, ncols } = computePackedAtlasDims(tz, tw, th);
    const atlaswidth = ncols * tw;
    const atlasheight = nrows * th;
    console.log("atlas width and height: " + atlaswidth + " " + atlasheight);

    const displayMetadata = this.metadata.omero;
    const chnames: string[] = [];
    for (let i = 0; i < displayMetadata.channels.length; ++i) {
      chnames.push(displayMetadata.channels[i].label);
    }

    /* eslint-disable @typescript-eslint/naming-convention */
    const imgdata: ImageInfo = {
      width: shape0[x],
      height: shape0[y],
      channels: channels,
      channel_names: chnames,
      rows: nrows,
      cols: ncols,
      // for webgl reasons, it is best for total atlas width and height to be <= 2048 and ideally a power of 2.
      //   This generally implies downsampling the original volume data for display in this viewer.
      tile_width: tw,
      tile_height: th,
      tiles: tz,
      vol_size_x: tw,
      vol_size_y: th,
      vol_size_z: tz,
      pixel_size_x: scale5d[x],
      pixel_size_y: scale5d[y],
      pixel_size_z: scale5d[z],
      pixel_size_unit: spaceUnitSymbol,
      name: displayMetadata.name,
      version: displayMetadata.version,
      transform: {
        translation: [0, 0, 0],
        rotation: [0, 0, 0],
      },
      times: sizeT,
      time_scale: timeScale,
      time_unit: timeUnitSymbol,
    };
    /* eslint-enable @typescript-eslint/naming-convention */

    const fullExtentLoadSpec = { ...loadSpec, minx: 0, miny: 0, minz: 0, maxx: 1, maxy: 1, maxz: 1 };

    // got some data, now let's construct the volume.
    const vol = new Volume(imgdata, fullExtentLoadSpec);
    vol.imageMetadata = buildDefaultMetadata(imgdata);
    return vol;
  }

  async loadVolumeData(vol: Volume, onChannelLoaded: PerChannelCallback, explicitLoadSpec?: LoadSpec): Promise<void> {
    if (
      this.axesTCZYX === undefined ||
      this.metadata === undefined ||
      this.multiscaleDims === undefined ||
      this.maxExtent === undefined
    ) {
      console.error("ERROR: called `loadVolumeData` on zarr loader without first opening with `createVolume`!");
      return;
    }

    const loadSpec = explicitLoadSpec || vol.loadSpec;
    vol.loadSpec = loadSpec;
    const normLoadSpec = fitLoadSpecRegionToExtent(loadSpec, this.maxExtent);
    const { channels, times } = vol.imageInfo;

    const imageIndex = imageIndexFromLoadSpec(normLoadSpec, this.metadata.multiscales);
    const multiscale = this.metadata.multiscales[imageIndex];

    const levelToLoad = pickLevelToLoad(normLoadSpec, this.multiscaleDims, this.axesTCZYX);
    const datasetPath = multiscale.datasets[levelToLoad].path;
    const datasetShape = this.multiscaleDims[levelToLoad];

    const [zi, yi, xi] = this.axesTCZYX.slice(-3);
    const pxSpec = convertLoadSpecRegionToPixels(normLoadSpec, datasetShape[xi], datasetShape[yi], datasetShape[zi]);
    const tw = pxSpec.maxx - pxSpec.minx;
    const th = pxSpec.maxy - pxSpec.miny;
    const tz = pxSpec.maxz - pxSpec.minz;

    const { nrows, ncols } = computePackedAtlasDims(tz, tw, th);

    const storepath = normLoadSpec.subpath + "/" + datasetPath;
    // do each channel on a worker
    for (let i = 0; i < channels; ++i) {
      const worker = new Worker(new URL("../workers/FetchZarrWorker", import.meta.url));
      worker.onmessage = (e) => {
        const u8 = e.data.data;
        const channel = e.data.channel;
        vol.setChannelDataFromVolume(channel, u8);
        if (onChannelLoaded) {
          // make up a unique name? or have caller pass this in?
          onChannelLoaded(normLoadSpec.url + "/" + normLoadSpec.subpath, vol, channel);
        }
        worker.terminate();
      };
      worker.onerror = (e) => {
        alert("Error: Line " + e.lineno + " in " + e.filename + ": " + e.message);
      };

      const msg: FetchZarrMessage = {
        spec: {
          ...pxSpec,
          time: this.axesTCZYX[0] > -1 ? Math.min(normLoadSpec.time, times) : -1,
        },
        channel: this.axesTCZYX[1] > -1 ? i : -1,
        path: storepath,
        axesZYX: this.axesTCZYX.slice(-3),
      };
      worker.postMessage(msg);
    }

    // Update volume `imageInfo` to reflect potentially new dimensions
    /* eslint-disable @typescript-eslint/naming-convention */
    vol.imageInfo = {
      ...vol.imageInfo,
      rows: nrows,
      cols: ncols,
      tile_width: tw,
      tile_height: th,
      tiles: tz,
      offset_x: pxSpec.minx,
      offset_y: pxSpec.miny,
      offset_z: pxSpec.minz,
    };
    // TODO induce some sort of uniforms update
    /* eslint-enable @typescript-eslint/naming-convention */
  }
}

export { OMEZarrLoader };

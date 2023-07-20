import { openArray, openGroup, HTTPStore } from "zarr";

import {
  IVolumeLoader,
  LoadSpec,
  PerChannelCallback,
  VolumeDims,
  convertLoadSpecRegionToPixels,
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

// function findSpatialAxesZYX(axisTCZYX: number[]): [number, number, number] {
//   // return in ZYX order
//   const spatialAxes: [number, number, number] = [-1, -1, -1];
//   if (axisTCZYX[2] > -1) {
//     spatialAxes[0] = axisTCZYX[2];
//   }
//   if (axisTCZYX[3] > -1) {
//     spatialAxes[1] = axisTCZYX[3];
//   }
//   if (axisTCZYX[4] > -1) {
//     spatialAxes[2] = axisTCZYX[4];
//   }
//   if (spatialAxes.some((el) => el === -1)) {
//     console.log("ERROR: zarr loader expects a z, y, and x axis.");
//   }
//   return spatialAxes;
// }

// async function fetchShapeOfLevel(store: HTTPStore, imagegroup: string, multiscale: OMEDataset): Promise<number[]> {
//   const level = await openArray({ store: store, path: imagegroup + "/" + multiscale.path, mode: "r" });
//   const shape = level.meta.shape;
//   return shape;
// }

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

// async function pickLevelToLoad(
//   multiscale: OMEMultiscale,
//   store: HTTPStore,
//   loadSpec: LoadSpec,
//   cachedSpatialAxes?: [number, number, number]
// ): Promise<number> {
//   const { datasets, axes } = multiscale;
//   const numlevels = datasets.length;

//   let spatialAxes: [number, number, number];
//   if (cachedSpatialAxes !== undefined) {
//     spatialAxes = cachedSpatialAxes;
//   } else {
//     const axisTCZYX = remapAxesToTCZYX(axes);
//     spatialAxes = findSpatialAxesZYX(axisTCZYX);
//   }

//   const shapePromises = datasets.map(async (dataset): Promise<[number, number, number]> => {
//     const shape = await fetchShapeOfLevel(store, loadSpec.subpath, dataset);
//     if (shape.length !== axes.length) {
//       console.log("ERROR: shape length " + shape.length + " does not match axes length " + axes.length);
//     }
//     return [shape[spatialAxes[0]], shape[spatialAxes[1]], shape[spatialAxes[2]]];
//   });
//   const spatialDims = await Promise.all(shapePromises);

//   // default to lowest level until we find the match
//   let levelToLoad = numlevels - 1;
//   for (let i = 0; i < numlevels; ++i) {
//     if (datasets[i].path == loadSpec.subpath) {
//       levelToLoad = i;
//       break;
//     }
//   }

//   const optimalLevel = estimateLevelForAtlas(spatialDims, 2048);
//   // assume all levels are decreasing in size.  If a larger level is optimal then use it:
//   if (optimalLevel < levelToLoad) {
//     return optimalLevel;
//   } else {
//     return levelToLoad;
//   }
// }

function pickLevelToLoad(loadSpec: LoadSpec, multiscaleDims: number[][], [_t, _c, zi, yi, xi]: number[]): number {
  const numlevels = multiscaleDims.length;
  // default to lowest level until we find the match
  const levelToLoad = numlevels - 1;
  for (let i = 0; i < numlevels; ++i) {
    // TODO
    // if (multiscaleDims[i].subpath == loadSpec.subpath) {
    //   levelToLoad = i;
    //   break;
    // }
  }

  const { minx = 0, maxx = 1, miny = 0, maxy = 1, minz = 0, maxz = 1 } = loadSpec;
  const xSize = maxx - minx;
  const ySize = maxy - miny;
  const zSize = maxz - minz;

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
    // const store = new HTTPStore(loadSpec.url);

    // const imagegroup = loadSpec.subpath;

    // const data = await openGroup(store, imagegroup, "r");

    // // get top-level metadata for this zarr image
    // const allmetadata = await data.attrs.asObject();
    // // each entry of multiscales is a multiscale image.
    // const imageIndex = imageIndexFromLoadSpec(loadSpec, allmetadata.multiscales);
    // const multiscale: OMEMultiscale = allmetadata.multiscales[imageIndex];
    // const { datasets, axes } = multiscale;

    // const axisTCZYX = remapAxesToTCZYX(axes);
    // this.hasT = axisTCZYX[0] > -1;
    // this.hasC = axisTCZYX[1] > -1;
    // // ZYX
    // this.spatialAxes = findSpatialAxesZYX(axisTCZYX);

    // // Assume all axes have the same units - we have no means of storing per-axis unit symbols
    // const spaceUnitName = axes[this.spatialAxes[2]].unit;
    // const spaceUnitSymbol = unitNameToSymbol(spaceUnitName) || spaceUnitName || "";

    // const timeUnitName = this.hasT ? axes[axisTCZYX[0]].unit : undefined;
    // const timeUnitSymbol = unitNameToSymbol(timeUnitName) || timeUnitName || "";

    // const levelToLoad = await pickLevelToLoad(multiscale, store, loadSpec);
    // const dataset = datasets[levelToLoad];
    // this.multiscalePath = dataset.path;

    // // get the shape for the level we want to load
    // const level = await openArray({ store: store, path: imagegroup + "/" + dataset.path, mode: "r" });

    // const multiscaleShape = level.meta.shape;
    // if (multiscaleShape.length != axes.length) {
    //   console.log("ERROR: shape length " + multiscaleShape.length + " does not match axes length " + axes.length);
    // }

    // Load metadata and dimensions. After this point we consider the loader "open."
    const store = new HTTPStore(loadSpec.url);
    this.metadata = await loadMetadata(store, loadSpec);
    const imageIndex = imageIndexFromLoadSpec(loadSpec, this.metadata.multiscales);
    const multiscale = this.metadata.multiscales[imageIndex];
    this.multiscaleDims = await loadLevelShapes(store, multiscale);
    this.axesTCZYX = remapAxesToTCZYX(multiscale.axes);
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
      tiles: tz,
      // for webgl reasons, it is best for total atlas width and height to be <= 2048 and ideally a power of 2.
      //   This generally implies downsampling the original volume data for display in this viewer.
      tile_width: tw,
      tile_height: th,
      vol_size_x: multiscaleX,
      vol_size_y: multiscaleY,
      vol_size_z: multiscaleZ,
      offset_x: pxSpec.minx,
      offset_y: pxSpec.miny,
      offset_z: pxSpec.minz,
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

    // got some data, now let's construct the volume.
    const vol = new Volume(imgdata, loadSpec);
    vol.imageMetadata = buildDefaultMetadata(imgdata);
    return vol;
  }

  async loadVolumeData(vol: Volume, onChannelLoaded: PerChannelCallback, explicitLoadSpec?: LoadSpec): Promise<void> {
    const loadSpec = explicitLoadSpec || vol.loadSpec;
    const { channels, times } = vol.imageInfo;

    // if (
    //   this.multiscalePath === undefined ||
    //   this.hasC === undefined ||
    //   this.hasT === undefined ||
    //   this.spatialAxes === undefined
    // ) {
    //   const store = new HTTPStore(loadSpec.url);
    //   const data = await openGroup(store, loadSpec.subpath, "r");
    //   const allmetadata = await data.attrs.asObject();

    //   const imageIndex = imageIndexFromLoadSpec(loadSpec, allmetadata.multiscales);
    //   const multiscale = allmetadata.multiscales[imageIndex];

    //   const axisTCZYX = remapAxesToTCZYX(multiscale.axes);
    //   this.hasT = axisTCZYX[0] > -1;
    //   this.hasC = axisTCZYX[1] > -1;
    //   this.spatialAxes = findSpatialAxesZYX(axisTCZYX);

    //   const levelToLoad = await pickLevelToLoad(multiscale, store, loadSpec, this.spatialAxes);
    //   this.multiscalePath = multiscale.datasets[levelToLoad].path;
    // }
    if (this.axesTCZYX === undefined || this.metadata === undefined || this.multiscaleDims === undefined) {
      console.error("ERROR: called `loadVolumeData` on zarr loader without first opening with `createVolume`!");
      return;
    }

    const imageIndex = imageIndexFromLoadSpec(loadSpec, this.metadata.multiscales);
    const multiscale = this.metadata.multiscales[imageIndex];

    const levelToLoad = pickLevelToLoad(loadSpec, this.multiscaleDims, this.axesTCZYX);
    const multiscalePath = multiscale.datasets[levelToLoad].path;

    const storepath = loadSpec.subpath + "/" + multiscalePath;
    // do each channel on a worker
    for (let i = 0; i < channels; ++i) {
      const worker = new Worker(new URL("../workers/FetchZarrWorker", import.meta.url));
      worker.onmessage = (e) => {
        const u8 = e.data.data;
        const channel = e.data.channel;
        vol.setChannelDataFromVolume(channel, u8);
        if (onChannelLoaded) {
          // make up a unique name? or have caller pass this in?
          onChannelLoaded(loadSpec.url + "/" + loadSpec.subpath, vol, channel);
        }
        worker.terminate();
      };
      worker.onerror = (e) => {
        alert("Error: Line " + e.lineno + " in " + e.filename + ": " + e.message);
      };

      const msg: FetchZarrMessage = {
        spec: {
          ...loadSpec,
          time: this.axesTCZYX[0] > -1 ? Math.min(loadSpec.time, times) : -1,
        },
        channel: this.axesTCZYX[1] > -1 ? i : -1,
        path: storepath,
        axesZYX: this.axesTCZYX.slice(-3),
      };
      worker.postMessage(msg);
    }
  }
}

export { OMEZarrLoader };

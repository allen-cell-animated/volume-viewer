import { IVolumeLoader, LoadSpec, PerChannelCallback, VolumeDims } from "./IVolumeLoader";
import {
  buildDefaultMetadata,
  computePackedAtlasDims,
  estimateLevelForAtlas,
  spatialUnitNameToSymbol,
} from "./VolumeLoaderUtils";
import { ImageInfo } from "../Volume";
import Volume from "../Volume";

import { openArray, openGroup, HTTPStore } from "zarr";

const DOWNSAMPLE_Z = 1; // z/downsampleZ is number of z slices in reduced volume

function imageIndexFromLoadSpec(loadSpec: LoadSpec, multiscales): number {
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

function remapAxesToTCZYX(axes): number[] {
  const axisTCZYX = [-1, -1, -1, -1, -1];
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
  return axisTCZYX;
}

function findSpatialAxesZYX(axisTCZYX): [number, number, number] {
  // return in ZYX order
  const spatialAxes: [number, number, number] = [-1, -1, -1];
  if (axisTCZYX[2] > -1) {
    spatialAxes[0] = axisTCZYX[2];
  }
  if (axisTCZYX[3] > -1) {
    spatialAxes[1] = axisTCZYX[3];
  }
  if (axisTCZYX[4] > -1) {
    spatialAxes[2] = axisTCZYX[4];
  }
  if (spatialAxes.some((el) => el === -1)) {
    console.log("ERROR: zarr loader expects a z, y, and x axis.");
  }
  return spatialAxes;
}

async function fetchShapeOfLevel(store, imagegroup, multiscale): Promise<number[]> {
  const level = await openArray({ store: store, path: imagegroup + "/" + multiscale.path, mode: "r" });
  const shape = level.meta.shape;
  return shape;
}

async function pickLevelToLoad(
  multiscale,
  store: HTTPStore,
  loadSpec: LoadSpec,
  spatialAxes?: [number, number, number]
): Promise<number> {
  const { datasets, axes } = multiscale;
  const numlevels = datasets.length;

  if (spatialAxes === undefined) {
    const axisTCZYX = remapAxesToTCZYX(axes);
    spatialAxes = findSpatialAxesZYX(axisTCZYX);
  }

  // fetch all shapes and find xyz spatial dimensions
  const spatialDims: number[][] = [];
  for (const i in datasets) {
    const shape = await fetchShapeOfLevel(store, loadSpec.subpath, datasets[i]);
    // just stick it in multiscales for now.
    if (shape.length != axes.length) {
      console.log("ERROR: shape length " + shape.length + " does not match axes length " + axes.length);
    }
    spatialDims.push([shape[spatialAxes[0]], shape[spatialAxes[1]], shape[spatialAxes[2]]]);
  }

  // default to lowest level until we find the match
  let levelToLoad = numlevels - 1;
  for (let i = 0; i < numlevels; ++i) {
    if (datasets[i].path == loadSpec.subpath) {
      levelToLoad = i;
      break;
    }
  }

  const optimalLevel = estimateLevelForAtlas(spatialDims, 2048);
  // assume all levels are decreasing in size.  If a larger level is optimal then use it:
  if (optimalLevel < levelToLoad) {
    return optimalLevel;
  } else {
    return levelToLoad;
  }
}

class OMEZarrLoader implements IVolumeLoader {
  multiscalePath?: string;
  hasT?: boolean;
  hasC?: boolean;

  async loadDims(loadSpec: LoadSpec): Promise<VolumeDims[]> {
    const store = new HTTPStore(loadSpec.url);

    const imagegroup = loadSpec.subpath;

    const data = await openGroup(store, imagegroup, "r");

    // get top-level metadata for this zarr image
    const allmetadata = await data.attrs.asObject();
    // each entry of multiscales is a multiscale image.
    const imageIndex = imageIndexFromLoadSpec(loadSpec, allmetadata.multiscales);
    const multiscales = allmetadata.multiscales[imageIndex].datasets;
    const axes = allmetadata.multiscales[imageIndex].axes;

    const axisTCZYX = remapAxesToTCZYX(axes);
    // ZYX
    const spatialAxes = findSpatialAxesZYX(axisTCZYX);

    // Assume all axes have the same units - we have no means of storing per-axis unit symbols
    const unitName = axes[spatialAxes[2]].unit;
    const unitSymbol = spatialUnitNameToSymbol(unitName) || unitName || "";

    const dims: VolumeDims[] = [];
    // get all shapes
    for (const i in multiscales) {
      const shape = await fetchShapeOfLevel(store, imagegroup, multiscales[i]);
      if (shape.length != axes.length) {
        console.log("ERROR: shape length " + shape.length + " does not match axes length " + axes.length);
      }

      // technically there can be any number of coordinateTransformations
      // but there must be only one of type "scale".
      // Here I assume that is the only one.
      const scale5d = multiscales[i].coordinateTransformations[0].scale;

      const d = new VolumeDims();
      d.subpath = "";
      d.shape = [1, 1, 1, 1, 1];
      for (let i = 0; i < d.shape.length; ++i) {
        if (axisTCZYX[i] > -1) {
          d.shape[i] = shape[axisTCZYX[i]];
        }
      }
      d.spacing = [1, 1, scale5d[spatialAxes[0]], scale5d[spatialAxes[1]], scale5d[spatialAxes[2]]];
      d.spatialUnit = unitSymbol; // unknown unit.
      d.dataType = "uint8";
      dims.push(d);
    }

    return dims;
  }

  async createVolume(loadSpec: LoadSpec): Promise<Volume> {
    const store = new HTTPStore(loadSpec.url);

    const imagegroup = loadSpec.subpath;

    const data = await openGroup(store, imagegroup, "r");

    // get top-level metadata for this zarr image
    const allmetadata = await data.attrs.asObject();
    // each entry of multiscales is a multiscale image.
    const imageIndex = imageIndexFromLoadSpec(loadSpec, allmetadata.multiscales);
    const multiscale = allmetadata.multiscales[imageIndex];
    const { datasets, axes } = multiscale;

    const axisTCZYX = remapAxesToTCZYX(axes);
    const hasT = axisTCZYX[0] > -1;
    const hasC = axisTCZYX[1] > -1;
    // ZYX
    const spatialAxes = findSpatialAxesZYX(axisTCZYX);

    // Assume all axes have the same units - we have no means of storing per-axis unit symbols
    const unitName = axes[spatialAxes[2]].unit;
    const unitSymbol = spatialUnitNameToSymbol(unitName) || unitName || "";

    const levelToLoad = await pickLevelToLoad(multiscale, store, loadSpec);
    const dataset = datasets[levelToLoad];

    // get the shape for the level we want to load
    const level = await openArray({ store: store, path: imagegroup + "/" + dataset.path, mode: "r" });

    const multiscaleShape = level.meta.shape;
    if (multiscaleShape.length != axes.length) {
      console.log("ERROR: shape length " + multiscaleShape.length + " does not match axes length " + axes.length);
    }

    const channels = hasC ? multiscaleShape[axisTCZYX[1]] : 1;
    const sizeT = hasT ? multiscaleShape[axisTCZYX[0]] : 1;

    // technically there can be any number of coordinateTransformations
    // but there must be only one of type "scale".
    // Here I assume that is the only one.
    const scale5d = dataset.coordinateTransformations[0].scale;
    const tw = multiscaleShape[spatialAxes[2]];
    const th = multiscaleShape[spatialAxes[1]];
    const tz = multiscaleShape[spatialAxes[0]];

    // compute rows and cols and atlas width and ht, given tw and th
    const loadedZ = Math.ceil(tz / DOWNSAMPLE_Z);
    const { nrows, ncols } = computePackedAtlasDims(loadedZ, tw, th);
    const atlaswidth = ncols * tw;
    const atlasheight = nrows * th;
    console.log("atlas width and height: " + atlaswidth + " " + atlasheight);

    const displayMetadata = allmetadata.omero;
    const chnames: string[] = [];
    for (let i = 0; i < displayMetadata.channels.length; ++i) {
      chnames.push(displayMetadata.channels[i].label);
    }
    /* eslint-disable @typescript-eslint/naming-convention */
    const imgdata: ImageInfo = {
      width: tw, // TODO where should we capture the original w?
      height: th, // TODO original h?
      channels: channels,
      channel_names: chnames,
      rows: nrows,
      cols: ncols,
      tiles: loadedZ, // TODO original z????
      tile_width: tw,
      tile_height: th,
      // for webgl reasons, it is best for atlas_width and atlas_height to be <= 2048
      // and ideally a power of 2.  This generally implies downsampling the original volume data for display in this viewer.
      atlas_width: atlaswidth,
      atlas_height: atlasheight,
      pixel_size_x: scale5d[spatialAxes[2]],
      pixel_size_y: scale5d[spatialAxes[1]],
      pixel_size_z: scale5d[spatialAxes[0]] * DOWNSAMPLE_Z,
      pixel_size_unit: unitSymbol,
      name: displayMetadata.name,
      version: displayMetadata.version,
      transform: {
        translation: [0, 0, 0],
        rotation: [0, 0, 0],
      },
      times: sizeT,
    };
    /* eslint-enable @typescript-eslint/naming-convention */

    // got some data, now let's construct the volume.
    const vol = new Volume(imgdata);
    vol.imageMetadata = buildDefaultMetadata(imgdata);
    return vol;
  }

  async loadVolumeData(vol: Volume, loadSpec: LoadSpec, onChannelLoaded: PerChannelCallback): Promise<void> {
    const { channels, times } = vol.imageInfo;

    if (this.multiscalePath === undefined || this.hasC === undefined || this.hasT === undefined) {
      const store = new HTTPStore(loadSpec.url);
      const data = await openGroup(store, loadSpec.subpath, "r");
      const allmetadata = await data.attrs.asObject();

      const imageIndex = imageIndexFromLoadSpec(loadSpec, allmetadata.multiscales);
      const multiscale = allmetadata.multiscales[imageIndex];

      const axisTCZYX = remapAxesToTCZYX(multiscale.axes);
      this.hasT = axisTCZYX[0] > -1;
      this.hasC = axisTCZYX[1] > -1;
      const spatialAxes = findSpatialAxesZYX(axisTCZYX);

      const levelToLoad = await pickLevelToLoad(multiscale, store, loadSpec, spatialAxes);
      this.multiscalePath = multiscale.datasets[levelToLoad];
    }

    const storepath = loadSpec.subpath + "/" + this.multiscalePath;
    // do each channel on a worker
    for (let i = 0; i < channels; ++i) {
      const worker = new Worker(new URL("../workers/FetchZarrWorker", import.meta.url));
      worker.onmessage = function (e) {
        const u8 = e.data.data;
        const channel = e.data.channel;
        vol.setChannelDataFromVolume(channel, u8);
        if (onChannelLoaded) {
          // make up a unique name? or have caller pass this in?
          onChannelLoaded(loadSpec.url + "/" + loadSpec.subpath, vol, channel);
        }
        worker.terminate();
      };
      worker.onerror = function (e) {
        alert("Error: Line " + e.lineno + " in " + e.filename + ": " + e.message);
      };
      worker.postMessage({
        urlStore: loadSpec.url,
        time: this.hasT ? Math.min(loadSpec.time, times) : -1,
        channel: this.hasC ? i : -1,
        downsampleZ: DOWNSAMPLE_Z,
        path: storepath,
      });
    }
  }
}

export { OMEZarrLoader };

import { IVolumeLoader, LoadSpec, PerChannelCallback, VolumeDims } from "./IVolumeLoader";
import { computePackedAtlasDims, spatialUnitNameToSymbol } from "./VolumeLoaderUtils";
import { ImageInfo } from "../Volume";
import Volume from "../Volume";

import { openArray, openGroup, HTTPStore } from "zarr";

class OMEZarrLoader implements IVolumeLoader {
  async loadDims(loadSpec: LoadSpec): Promise<VolumeDims[]> {
    const store = new HTTPStore(loadSpec.url);

    const imagegroup = loadSpec.subpath;

    const data = await openGroup(store, imagegroup, "r");

    // get top-level metadata for this zarr image
    const allmetadata = await data.attrs.asObject();
    // each entry of multiscales is a multiscale image.
    // take the first multiscales entry
    const imageIndex = 0;
    const multiscales = allmetadata.multiscales[imageIndex].datasets;
    const axes = allmetadata.multiscales[imageIndex].axes;

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
    // ZYX
    const spatialAxes: number[] = [];
    if (axisTCZYX[2] > -1) {
      spatialAxes.push(axisTCZYX[2]);
    }
    if (axisTCZYX[3] > -1) {
      spatialAxes.push(axisTCZYX[3]);
    }
    if (axisTCZYX[4] > -1) {
      spatialAxes.push(axisTCZYX[4]);
    }
    if (spatialAxes.length != 3) {
      console.log("ERROR: zarr loader expects a z, y, and x axis.");
    }

    // Assume all axes have the same units - we have no means of storing per-axis unit symbols
    const unitName = axes[spatialAxes[2]].unit;
    const unitSymbol = spatialUnitNameToSymbol(unitName) || unitName || "";

    const dims: VolumeDims[] = [];
    // get all shapes
    for (const i in multiscales) {
      const level = await openArray({ store: store, path: imagegroup + "/" + multiscales[i].path, mode: "r" });
      // just stick it in multiscales for now.
      multiscales[i].shape = level.meta.shape;
      if (multiscales[i].shape.length != axes.length) {
        console.log(
          "ERROR: shape length " + multiscales[i].shape.length + " does not match axes length " + axes.length
        );
      }

      const d = new VolumeDims();
      d.subpath = "";
      d.shape = [1, 2, 27, 600, 600];
      d.spacing = [1, 1, 2, 1, 1];
      d.spatialUnit = unitSymbol; // unknown unit.
      d.dataType = "uint8";
      dims.push(d);
    }

    return dims;
  }

  async createVolume(loadSpec: LoadSpec, onChannelLoaded: PerChannelCallback): Promise<Volume> {
    const store = new HTTPStore(loadSpec.url);

    const imagegroup = loadSpec.subpath;

    const data = await openGroup(store, imagegroup, "r");

    // get top-level metadata for this zarr image
    const allmetadata = await data.attrs.asObject();
    // each entry of multiscales is a multiscale image.
    // take the first multiscales entry
    const imageIndex = 0; // TODO is this LoadSpec.scene?
    const multiscales = allmetadata.multiscales[imageIndex].datasets;
    const axes = allmetadata.multiscales[imageIndex].axes;

    let hasT = false;
    let hasC = false;
    const axisTCZYX = [-1, -1, -1, -1, -1];
    for (let i = 0; i < axes.length; ++i) {
      const axis = axes[i];
      if (axis.name === "t") {
        hasT = true;
        axisTCZYX[0] = i;
      } else if (axis.name === "c") {
        hasC = true;
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
    // ZYX
    const spatialAxes: number[] = [];
    if (axisTCZYX[2] > -1) {
      spatialAxes.push(axisTCZYX[2]);
    }
    if (axisTCZYX[3] > -1) {
      spatialAxes.push(axisTCZYX[3]);
    }
    if (axisTCZYX[4] > -1) {
      spatialAxes.push(axisTCZYX[4]);
    }
    if (spatialAxes.length != 3) {
      console.log("ERROR: zarr loader expects a z, y, and x axis.");
    }

    const numlevels = multiscales.length;
    // Assume all axes have the same units - we have no means of storing per-axis unit symbols
    const unitName = axes[spatialAxes[2]].unit;
    const unitSymbol = spatialUnitNameToSymbol(unitName) || unitName || "";

    // default to lowest level until we find the match
    let levelToLoad = numlevels - 1;
    for (let i = 0; i < numlevels; ++i) {
      if (multiscales[i].path == loadSpec.subpath) {
        levelToLoad = i;
        break;
      }
    }

    const downsampleZ = 2; // z/downsampleZ is number of z slices in reduced volume

    const dataset = multiscales[levelToLoad];

    // get the shape for the level we want to load
    const level = await openArray({ store: store, path: imagegroup + "/" + dataset.path, mode: "r" });
    // just stick it in multiscales for now.
    dataset.shape = level.meta.shape;
    if (dataset.shape.length != axes.length) {
      console.log("ERROR: shape length " + dataset.shape.length + " does not match axes length " + axes.length);
    }

    const c = hasC ? dataset.shape[axisTCZYX[1]] : 1;
    const sizeT = hasT ? dataset.shape[axisTCZYX[0]] : 1;

    // technically there can be any number of coordinateTransformations
    // but there must be only one of type "scale".
    // Here I assume that is the only one.
    const scale5d = dataset.coordinateTransformations[0].scale;
    const tw = dataset.shape[spatialAxes[2]];
    const th = dataset.shape[spatialAxes[1]];
    const tz = dataset.shape[spatialAxes[0]];

    // compute rows and cols and atlas width and ht, given tw and th
    const loadedZ = Math.ceil(tz / downsampleZ);
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
      channels: c,
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
      pixel_size_z: scale5d[spatialAxes[0]] * downsampleZ,
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

    const storepath = imagegroup + "/" + dataset.path;
    // do each channel on a worker
    for (let i = 0; i < c; ++i) {
      const worker = new Worker(new URL("../workers/FetchZarrWorker", import.meta.url));
      worker.onmessage = function (e) {
        const u8 = e.data.data;
        const channel = e.data.channel;
        vol.setChannelDataFromVolume(channel, u8);
        if (onChannelLoaded) {
          // make up a unique name? or have caller pass this in?
          onChannelLoaded(loadSpec.url + "/" + imagegroup, vol, channel);
        }
        worker.terminate();
      };
      worker.onerror = function (e) {
        alert("Error: Line " + e.lineno + " in " + e.filename + ": " + e.message);
      };
      worker.postMessage({
        urlStore: loadSpec.url,
        time: hasT ? Math.min(loadSpec.time, sizeT) : -1,
        channel: hasC ? i : -1,
        downsampleZ: downsampleZ,
        path: storepath,
      });
    }

    return vol;
  }
}

export { OMEZarrLoader };

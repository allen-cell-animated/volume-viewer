import { IVolumeLoader, LoadSpec, VolumeDims } from "./IVolumeLoader";
import { spatialUnitNameToSymbol } from "./VolumeLoader";

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
}

export { OMEZarrLoader };

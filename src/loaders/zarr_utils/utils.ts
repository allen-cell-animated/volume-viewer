import { Vector3 } from "three";
import { LoadSpec } from "../IVolumeLoader";
import { estimateLevelForAtlas } from "../VolumeLoaderUtils";
import { OMEAxis, OMECoordinateTransformation, OMEDataset, OMEMultiscale, TCZYX } from "./types";

/** Turns `axesTCZYX` into the number of dimensions in the array */
export const getDimensionCount = ([t, c, z]: TCZYX<number>) => 2 + Number(t > -1) + Number(c > -1) + Number(z > -1);

export function remapAxesToTCZYX(axes: OMEAxis[]): TCZYX<number> {
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
export function pickLevelToLoad(loadSpec: LoadSpec, spatialDimsZYX: [number, number, number][]): number {
  const size = loadSpec.subregion.getSize(new Vector3());
  const dims = spatialDimsZYX.map(([z, y, x]): [number, number, number] => [
    Math.max(z * size.z, 1),
    Math.max(y * size.y, 1),
    Math.max(x * size.x, 1),
  ]);

  const optimalLevel = estimateLevelForAtlas(dims);
  return Math.max(optimalLevel, loadSpec.multiscaleLevel ?? 0);
}

/** Reorder an array of values [T, C, Z, Y, X] to the given dimension order */
export function orderByDimension<T>(valsTCZYX: TCZYX<T>, orderTCZYX: TCZYX<number>): T[] {
  const specLen = getDimensionCount(orderTCZYX);
  const result: T[] = Array(specLen);

  orderTCZYX.forEach((val, idx) => {
    if (val >= 0) {
      if (val >= specLen) {
        throw new Error("Unexpected axis index");
      }
      result[val] = valsTCZYX[idx];
    }
  });

  return result;
}

/** Reorder an array of values in the given dimension order to [T, C, Z, Y, X] */
export function orderByTCZYX<T>(valsDimension: T[], orderTCZYX: TCZYX<number>, defaultValue: T): TCZYX<T> {
  const result: TCZYX<T> = [defaultValue, defaultValue, defaultValue, defaultValue, defaultValue];

  orderTCZYX.forEach((val, idx) => {
    if (val >= 0) {
      if (val >= valsDimension.length) {
        throw new Error("Unexpected axis index");
      }
      result[idx] = valsDimension[val];
    }
  });

  return result;
}

/** Select the scale transform from an OME metadata object with coordinate transforms, and return it in TCZYX order */
export function getScale(dataset: OMEDataset | OMEMultiscale, orderTCZYX: TCZYX<number>): TCZYX<number> {
  const transforms = dataset.coordinateTransformations;

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
  return orderByTCZYX(scale, orderTCZYX, 1);
}

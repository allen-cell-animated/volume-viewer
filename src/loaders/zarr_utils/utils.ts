import { Vector3 } from "three";
import { LoadSpec } from "../IVolumeLoader";
import { estimateLevelForAtlas } from "../VolumeLoaderUtils";
import {
  NumericZarrArray,
  OMEAxis,
  OMECoordinateTransformation,
  OMEDataset,
  OMEMultiscale,
  TCZYX,
  ZarrSourceMeta,
} from "./types";

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
    if (val > -1) {
      if (val > specLen) {
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
    if (val > -1) {
      if (val > valsDimension.length) {
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

/**
 * Defines a partial order of zarr arrays based on their size. Specifically:
 * - If array size x, y, z are all equal, the arrays are equal
 * - otherwise, if all xyz of `a` are less than or equal to those of `b`, `a` is less than `b` (and vice versa)
 * - if some xyz is less and some is greater, the arrays are uncomparable
 */
function compareZarrArraySize(
  aArr: NumericZarrArray,
  aTCZYX: TCZYX<number>,
  bArr: NumericZarrArray,
  bTCZYX: TCZYX<number>
): number | undefined {
  const diffZ = aArr.shape[aTCZYX[2]] - bArr.shape[bTCZYX[2]];
  const diffY = aArr.shape[aTCZYX[3]] - bArr.shape[bTCZYX[3]];
  const aX = aTCZYX[4] > -1 ? aArr.shape[aTCZYX[4]] : 1;
  const bX = bTCZYX[4] > -1 ? bArr.shape[bTCZYX[4]] : 1;
  const diffX = aX - bX;

  if (diffZ === 0 && diffY === 0 && diffX === 0) {
    return 0;
  } else if (diffZ <= 0 && diffY <= 0 && diffX <= 0) {
    return -1;
  } else if (diffZ >= 0 && diffY >= 0 && diffX >= 0) {
    return 1;
  } else {
    return undefined;
  }
}

function scaleTransformsAreEqual(aSrc: ZarrSourceMeta, aLevel: number, bSrc: ZarrSourceMeta, bLevel: number): boolean {
  const aScale = getScale(aSrc.multiscaleMetadata.datasets[aLevel], aSrc.axesTCZYX);
  const bScale = getScale(bSrc.multiscaleMetadata.datasets[bLevel], bSrc.axesTCZYX);
  return aScale[2] === bScale[2] && aScale[3] === bScale[3] && aScale[4] === bScale[4];
}

/**
 * Ensures that all scale levels in `sources` are matched up by size. More precisely: for any scale level `i`, the size
 * of zarr array `s[i]` is equal for every source `s`. We accomplish this by removing any arrays (and their associated
 * scale transformations in OME metadata) which don't match up in all sources.
 *
 * Assumes all sources have scale levels ordered by size from largest to smallest. (This should always be true for
 * compliant OME-Zarr data.)
 */
export function matchSourceScaleLevels(sources: ZarrSourceMeta[]): void {
  if (sources.length < 2) {
    return;
  }

  // Save matching scale levels and metadata here
  const matchedLevels: NumericZarrArray[][] = new Array(sources.length).fill([]);
  const matchedMetas: OMEDataset[][] = new Array(sources.length).fill([]);

  // Start as many loop counters as we have sources
  const scaleIndexes: number[] = new Array(sources.length).fill(0);
  while (scaleIndexes.every((val, idx) => val < sources[idx].scaleLevels.length)) {
    // First pass: find the largest source / determine if all sources are equal
    let allEqual = true;
    const largestSrcIdx = sources.reduce((largestIdx, currentSrc, currentIdx) => {
      const largestSrc = sources[largestIdx];
      const largestArr = largestSrc.scaleLevels[scaleIndexes[largestIdx]];
      const currentArr = currentSrc.scaleLevels[scaleIndexes[currentIdx]];

      const ordering = compareZarrArraySize(largestArr, largestSrc.axesTCZYX, currentArr, currentSrc.axesTCZYX);
      if (!ordering) {
        // Arrays are equal, or they are uncomparable
        if (ordering === undefined) {
          throw new Error("Incompatible zarr arrays: pixel dimensions are mismatched");
        }
        // Now we know the arrays are equal, but they may still be invalid to match up because...
        // ...they have different scale transformations
        if (!scaleTransformsAreEqual(largestSrc, scaleIndexes[largestIdx], currentSrc, scaleIndexes[currentIdx])) {
          throw new Error("Incompatible zarr arrays: scale levels of equal size have different scale transformations");
        }
        // ...they have different chunk sizes (TODO update prefetching so this restriction can be removed)
        // ...they have different numbers of timesteps
        const largestT = largestSrc.axesTCZYX[0] > -1 ? largestArr.shape[largestSrc.axesTCZYX[0]] : 1;
        const currentT = currentSrc.axesTCZYX[0] > -1 ? currentArr.shape[currentSrc.axesTCZYX[0]] : 1;
        if (largestT !== currentT) {
          throw new Error("Incompatible zarr arrays: different numbers of timesteps");
        }
        return largestIdx;
      }

      allEqual = false;
      return ordering < 0 ? currentIdx : largestIdx;
    }, 0);

    if (allEqual) {
      // We've found a matching set of scale levels! Save it and increment all indexes
      for (let i = 0; i < scaleIndexes.length; i++) {
        const currentSrc = sources[i];
        const matchedScaleLevel = scaleIndexes[i];
        matchedLevels[i].push(currentSrc.scaleLevels[matchedScaleLevel]);
        matchedMetas[i].push(currentSrc.multiscaleMetadata.datasets[matchedScaleLevel]);
        scaleIndexes[i] += 1;
      }
    } else {
      // Increment the indexes of the sources which are smaller than the largest
      const largestSrc = sources[largestSrcIdx];
      const largestArr = largestSrc.scaleLevels[scaleIndexes[largestSrcIdx]];
      for (const [srcIdx, idx] of scaleIndexes.entries()) {
        const currentSrc = sources[idx];
        const currentArr = currentSrc.scaleLevels[srcIdx];
        const ordering = compareZarrArraySize(largestArr, largestSrc.axesTCZYX, currentArr, currentSrc.axesTCZYX);
        if (ordering !== 0) {
          scaleIndexes[idx] += 1;
        }
      }
    }
  }

  if (sources[0].scaleLevels.length === 0) {
    throw new Error("Incompatible zarr arrays: no sets of scale levels found that matched in all sources");
  }

  for (let i = 0; i < sources.length; i++) {
    sources[i].scaleLevels = matchedLevels[i];
    sources[i].multiscaleMetadata.datasets = matchedMetas[i];
  }
}
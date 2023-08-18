import "regenerator-runtime/runtime";
import { Box3, Vector3 } from "three";

import { ImageInfo } from "../Volume";

export type TypedArray =
  | Uint8Array
  | Int8Array
  | Uint16Array
  | Int16Array
  | Uint32Array
  | Int32Array
  | Float32Array
  | Float64Array;

// Map from units to their symbols
const UNIT_SYMBOLS = {
  angstrom: "Å",
  day: "d",
  foot: "ft",
  hour: "h",
  inch: "in",
  meter: "m",
  mile: "mi",
  minute: "min",
  parsec: "pc",
  second: "s",
  yard: "yd",
};

// Units which may take SI prefixes (e.g. micro-, tera-)
const SI_UNITS: (keyof typeof UNIT_SYMBOLS)[] = ["meter", "second"];

// SI prefixes which abbreviate in nonstandard ways
const SI_PREFIX_ABBVS = {
  micro: "μ",
  deca: "da",
};

/** Converts a full spatial or temporal unit name supported by OME-Zarr to its unit symbol */
// (see https://ngff.openmicroscopy.org/latest/#axes-md)
export function unitNameToSymbol(unitName?: string): string | null {
  if (unitName === undefined) {
    return null;
  }

  if (UNIT_SYMBOLS[unitName]) {
    return UNIT_SYMBOLS[unitName];
  }

  const prefixedSIUnit = SI_UNITS.find((siUnit) => unitName.endsWith(siUnit));
  if (prefixedSIUnit) {
    const prefix = unitName.substring(0, unitName.length - prefixedSIUnit.length);

    if (SI_PREFIX_ABBVS[prefix]) {
      // "special" SI prefix
      return SI_PREFIX_ABBVS[prefix] + UNIT_SYMBOLS[prefixedSIUnit];
    }

    // almost all SI prefixes are abbreviated by first letter, capitalized if prefix ends with "a"
    const capitalize = prefix.endsWith("a");
    const prefixAbbr = capitalize ? prefix[0].toUpperCase() : prefix[0];
    return prefixAbbr + UNIT_SYMBOLS[prefixedSIUnit];
  }

  return null;
}

// We want to find the most "square" packing of z tw by th tiles.
// Compute number of rows and columns.
export function computePackedAtlasDims(z: number, tw: number, th: number): { nrows: number; ncols: number } {
  let nextrows = 1;
  let nextcols = z;
  let ratio = (nextcols * tw) / (nextrows * th);
  let nrows = nextrows;
  let ncols = nextcols;
  while (ratio > 1) {
    nrows = nextrows;
    ncols = nextcols;
    nextcols -= 1;
    nextrows = Math.ceil(z / nextcols);
    ratio = (nextcols * tw) / (nextrows * th);
  }
  return { nrows, ncols };
}

export function estimateLevelForAtlas(spatialDimsZYX: number[][], maxAtlasEdge = 4096) {
  // update levelToLoad after we get size info about multiscales.
  // decide to max out at a 4k x 4k texture.
  let levelToLoad = spatialDimsZYX.length - 1;
  for (let i = 0; i < spatialDimsZYX.length; ++i) {
    // estimate atlas size:
    const x = spatialDimsZYX[i][2];
    const y = spatialDimsZYX[i][1];
    const z = spatialDimsZYX[i][0];
    const xtiles = Math.floor(maxAtlasEdge / x);
    const ytiles = Math.floor(maxAtlasEdge / y);

    if (xtiles * ytiles >= z) {
      console.log("Will load level " + i);
      levelToLoad = i;
      break;
    }
  }
  return levelToLoad;
}

export function convertSubregionToPixels(region: Box3, size: Vector3): Box3 {
  const min = region.min.clone().multiply(size).floor();
  const max = region.max.clone().multiply(size).ceil();

  // ensure it's always valid to specify the same number at both ends and get a single slice
  if (min.x === max.x && min.x < size.x) {
    max.x += 1;
  }
  if (min.y === max.y && min.y < size.y) {
    max.y += 1;
  }
  if (min.z === max.z && min.z < size.z) {
    max.z += 1;
  }

  return new Box3(min, max);
}

export function composeSubregion(region: Box3, container: Box3): Box3 {
  const size = container.getSize(new Vector3());
  const min = region.min.clone().multiply(size).add(container.min);
  const max = region.max.clone().multiply(size).add(container.min);
  return new Box3(min, max);
}

function isEmpty(obj) {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return false;
    }
  }
  return true;
}

// currently everything needed can come from the imageInfo
// but in the future each IVolumeLoader could have a completely separate implementation.
export function buildDefaultMetadata(imageInfo: ImageInfo): Record<string, unknown> {
  const physicalSize = imageInfo.volumeSize.clone().multiply(imageInfo.physicalPixelSize);
  const metadata = {};
  metadata["Dimensions"] = { ...imageInfo.subregionSize };
  metadata["Original dimensions"] = { ...imageInfo.originalSize };
  metadata["Physical size"] = {
    x: physicalSize.x + imageInfo.spatialUnit,
    y: physicalSize.y + imageInfo.spatialUnit,
    z: physicalSize.z + imageInfo.spatialUnit,
  };
  metadata["Physical size per pixel"] = {
    x: imageInfo.physicalPixelSize.x + imageInfo.spatialUnit,
    y: imageInfo.physicalPixelSize.y + imageInfo.spatialUnit,
    z: imageInfo.physicalPixelSize.z + imageInfo.spatialUnit,
  };
  metadata["Channels"] = imageInfo.numChannels;
  metadata["Time series frames"] = imageInfo.times || 1;
  // don't add User data if it's empty
  if (imageInfo.userData && !isEmpty(imageInfo.userData)) {
    metadata["User data"] = imageInfo.userData;
  }
  return metadata;
}

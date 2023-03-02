import "regenerator-runtime/runtime";

export type TypedArray =
  | Uint8Array
  | Int8Array
  | Uint16Array
  | Int16Array
  | Uint32Array
  | Int32Array
  | Float32Array
  | Float64Array;

// Preferred spatial units in OME-Zarr are specified as full names. We want just the symbol.
// See https://ngff.openmicroscopy.org/latest/#axes-md
export function spatialUnitNameToSymbol(unitName: string): string | null {
  const unitSymbols = {
    angstrom: "Å",
    decameter: "dam",
    foot: "ft",
    inch: "in",
    meter: "m",
    micrometer: "μm",
    mile: "mi",
    parsec: "pc",
    yard: "yd",
  };
  if (unitSymbols[unitName]) {
    return unitSymbols[unitName];
  }

  // SI prefixes not in unitSymbols are abbreviated by first letter, capitalized if prefix ends with "a"
  if (unitName.endsWith("meter")) {
    const capitalize = unitName[unitName.length - 6] === "a";
    const prefix = capitalize ? unitName[0].toUpperCase() : unitName[0];
    return prefix + "m";
  }

  return null;
}

// We want to find the most "square" packing of z tw by th tiles.
// Compute number of rows and columns.
export function computePackedAtlasDims(z, tw, th): { nrows: number; ncols: number } {
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

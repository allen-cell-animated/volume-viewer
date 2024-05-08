import { VolumeLoadError, VolumeLoadErrorType } from "../VolumeLoadError.js";
import { OMEZarrMetadata } from "./types.js";

function isObjectWithProp<P extends string>(obj: unknown, prop: P): obj is Record<P, unknown> {
  return typeof obj === "object" && obj !== null && prop in obj;
}

function assertMetadataHasProp<P extends string>(
  obj: unknown,
  prop: P,
  name = "zarr"
): asserts obj is Record<P, unknown> {
  if (!isObjectWithProp(obj, prop)) {
    throw new VolumeLoadError(`${name} metadata is missing required entry "${prop}"`, {
      type: VolumeLoadErrorType.INVALID_METADATA,
    });
  }
}

function assertPropIsArray<P extends string>(
  obj: Record<P, unknown>,
  prop: P,
  name = "zarr"
): asserts obj is Record<P, unknown[]> {
  if (!Array.isArray(obj[prop])) {
    throw new VolumeLoadError(`${name} metadata entry "${prop}" is not an array`, {
      type: VolumeLoadErrorType.INVALID_METADATA,
    });
  }
}

/**
 * Validates that the `OMEZarrMetadata` record `data` has the minimal amount of data required to open a volume. Since
 * we only ever open one multiscale, we only validate the multiscale metadata record at index `multiscaleIdx` here.
 * `name` is used in error messages to identify the source of the metadata.
 */
export function validateOMEZarrMetadata(
  data: unknown,
  multiscaleIdx = 0,
  name = "zarr"
): asserts data is OMEZarrMetadata {
  // data is an object with a key "multiscales", which is an array
  assertMetadataHasProp(data, "multiscales", name);
  assertPropIsArray(data, "multiscales", name);

  // check that a multiscale metadata entry exists at `multiscaleIdx`
  const multiscaleMeta = data.multiscales[multiscaleIdx];
  if (!multiscaleMeta) {
    throw new VolumeLoadError(`${name} metadata does not have requested multiscale level ${multiscaleIdx}`, {
      type: VolumeLoadErrorType.INVALID_METADATA,
    });
  }

  const multiscaleMetaName = isObjectWithProp(multiscaleMeta, "name") ? ` ("${multiscaleMeta.name})` : "";
  const multiscaleName = `${name} multiscale ${multiscaleIdx}${multiscaleMetaName}`;

  // multiscale has a key "axes", which is an array. Each axis has a "name".
  assertMetadataHasProp(multiscaleMeta, "axes", multiscaleName);
  assertPropIsArray(multiscaleMeta, "axes", multiscaleName);
  multiscaleMeta.axes.forEach((axis, i) => assertMetadataHasProp(axis, "name", `${multiscaleName} axis ${i}`));

  // multiscale has a key "datasets", which is an array. Each dataset has a "path".
  assertMetadataHasProp(multiscaleMeta, "datasets", name);
  assertPropIsArray(multiscaleMeta, "datasets", name);
  multiscaleMeta.datasets.forEach((data, i) => assertMetadataHasProp(data, "path", `${multiscaleName} dataset ${i}`));
}

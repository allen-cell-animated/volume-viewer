import { errorConstructors } from "serialize-error";
import { NodeNotFoundError, KeyError } from "@zarrita/core";
// geotiff doesn't export its error types...

/** Groups possible load errors into a few broad categories which we can give similar guidance to the user about. */
export const enum VolumeLoadErrorType {
  UNKNOWN,
  NOT_FOUND,
  LOAD_DATA_FAILED,
  INVALID_METADATA,
  INVALID_MULTI_SOURCE_ZARR,
}

export class VolumeLoadError extends Error {
  type: VolumeLoadErrorType;

  constructor(message?: string, options?: { cause?: unknown; type?: VolumeLoadErrorType }) {
    super(message, options);
    this.name = "VolumeLoadError";
    this.type = options?.type ?? VolumeLoadErrorType.UNKNOWN;
  }
}

errorConstructors.set("NodeNotFoundError", NodeNotFoundError as ErrorConstructor);
errorConstructors.set("KeyError", KeyError as ErrorConstructor);
errorConstructors.set("VolumeLoadError", VolumeLoadError as unknown as ErrorConstructor);

/** Curried function to re-throw an error wrapped in a `VolumeLoadError` with the given `message` and `type`. */
export function wrapVolumeLoadError<T>(
  message = "Unknown error occurred while loading volume data",
  type = VolumeLoadErrorType.UNKNOWN,
  ignore?: unknown
): (e: T) => T {
  return (e: T) => {
    if (ignore !== undefined && e === ignore) {
      return e;
    }
    if (e instanceof VolumeLoadError) {
      throw e;
    }
    throw new VolumeLoadError(message, { type, cause: e });
  };
}

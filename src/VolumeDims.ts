import { type NumberType } from "./types.js";
import { Vector3 } from "three";

export type VolumeDims = {
  // shape: [t, c, z, y, x]
  shape: [number, number, number, number, number];
  // spacing: [t, c, z, y, x]; generally expect 1 for non-spatial dimensions
  spacing: [number, number, number, number, number];
  spaceUnit: string;
  /**
   * Symbol of temporal unit used by `spacing[0]`, e.g. "hr".
   *
   * If units match one of the following, the viewer will automatically format
   * timestamps to a d:hh:mm:ss.sss format, truncated as an integer of the unit specified.
   * See https://ngff.openmicroscopy.org/latest/index.html#axes-md for a list of valid time units.
   * - "ms", "millisecond" for milliseconds: `d:hh:mm:ss.sss`
   * - "s", "sec", "second", or "seconds" for seconds: `d:hh:mm:ss`
   * - "m", "min", "minute", or "minutes" for minutes: `d:hh:mm`
   * - "h", "hr", "hour", or "hours" for hours: `d:hh`
   * - "d", "day", or "days" for days: `d`
   *
   * The maximum timestamp value is used to determine the maximum unit shown.
   * For example, if the time unit is in seconds, and the maximum time is 90 seconds, the timestamp
   * will be formatted as "{m:ss} (m:s)", and the day and hour segments will be omitted.
   */
  timeUnit: string;
  dataType: NumberType;
};

export function defaultVolumeDims(): VolumeDims {
  return {
    shape: [0, 0, 0, 0, 0],
    spacing: [1, 1, 1, 1, 1],
    spaceUnit: "μm",
    timeUnit: "s",
    dataType: "uint8",
  };
}

export function volumeSize(volumeDims: VolumeDims): Vector3 {
  return new Vector3(volumeDims.shape[4], volumeDims.shape[3], volumeDims.shape[2]);
}

export function physicalPixelSize(volumeDims: VolumeDims): Vector3 {
  return new Vector3(volumeDims.spacing[4], volumeDims.spacing[3], volumeDims.spacing[2]);
}

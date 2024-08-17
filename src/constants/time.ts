export const enum TimeUnit {
  MILLISECOND,
  SECOND,
  MINUTE,
  HOUR,
  DAY,
}

const recognizedTimeUnits: Record<TimeUnit, Set<string>> = {
  [TimeUnit.MILLISECOND]: new Set(["ms", "millisecond", "milliseconds"]),
  [TimeUnit.SECOND]: new Set(["s", "sec", "second", "seconds"]),
  [TimeUnit.MINUTE]: new Set(["m", "min", "minute", "minutes"]),
  [TimeUnit.HOUR]: new Set(["h", "hr", "hour", "hours"]),
  [TimeUnit.DAY]: new Set(["d", "day", "days"]),
};

/**
 * Parses an OME-compatible time unit into a TimeUnit enum.
 * @param unit string unit
 * @returns
 * - `TimeUnit.MILLISECOND` if unit is "ms", "millisecond", or "milliseconds"
 * - `TimeUnit.SECOND` if unit is "s", "sec", "second", or "seconds"
 * - `TimeUnit.MINUTE` if unit is "m", "min", "minute", or "minutes"
 * - `TimeUnit.HOUR` if unit is "h", "hr", "hour", or "hours"
 * - `TimeUnit.DAY` if unit is "d", "day", or "days"
 * - `undefined` if unit is not recognized
 */
export function parseTimeUnit(unit: string): TimeUnit | undefined {
  for (const [timeUnit, recognizedUnits] of Object.entries(recognizedTimeUnits)) {
    if (recognizedUnits.has(unit)) {
      return timeUnit as unknown as TimeUnit;
    }
  }
}

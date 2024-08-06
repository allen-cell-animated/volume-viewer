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

export function parseTimeUnit(unit: string): TimeUnit | undefined {
  for (const [timeUnit, recognizedUnits] of Object.entries(recognizedTimeUnits)) {
    if (recognizedUnits.has(unit)) {
      return timeUnit as unknown as TimeUnit;
    }
  }
}

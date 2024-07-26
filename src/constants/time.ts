export const enum TimeUnit {
  Millisecond,
  Second,
  Minute,
  Hour,
  Day,
}

const recognizedTimeUnits: Record<TimeUnit, Set<string>> = {
  [TimeUnit.Millisecond]: new Set(["ms", "millisecond", "milliseconds"]),
  [TimeUnit.Second]: new Set(["s", "sec", "second", "seconds"]),
  [TimeUnit.Minute]: new Set(["m", "min", "minute", "minutes"]),
  [TimeUnit.Hour]: new Set(["h", "hr", "hour", "hours"]),
  [TimeUnit.Day]: new Set(["d", "day", "days"]),
};

export function parseTimeUnit(unit: string): TimeUnit | undefined {
  for (const [timeUnit, recognizedUnits] of Object.entries(recognizedTimeUnits)) {
    if (recognizedUnits.has(unit)) {
      return timeUnit as unknown as TimeUnit;
    }
  }
}

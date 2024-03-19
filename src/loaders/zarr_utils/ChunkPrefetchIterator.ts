import { PrefetchDirection, TCZYX } from "./types";

type TZYX = [number, number, number, number];

type PrefetchDirectionState = {
  direction: PrefetchDirection;
  chunks: TCZYX<number>[];
  start: number;
  /** May be either a number for all channels or an array of ends per-channels */
  end: number | number[];
};

const allEqual = <T>(arr: T[]): boolean => arr.every((v) => v === arr[0]);

const pushN = <T>(arr: T[], val: T, n: number): void => {
  for (let i = 0; i < n; i++) {
    arr.push(val);
  }
};

const directionToIndex = (dir: PrefetchDirection): number => {
  const absDir = dir >> 1; // shave off sign bit to get index in TZYX
  return absDir + Number(absDir !== 0); // convert TZYX -> TCZYX by skipping c (index 1)
};

function updateMinMax(val: number, minmax: [number, number]): void {
  if (val < minmax[0]) {
    minmax[0] = val;
  }

  if (val > minmax[1]) {
    minmax[1] = val;
  }
}

/**
 * Since the user is most likely to want nearby data (in space or time) first, we should prefetch those chunks first.
 *
 * Given a list of just-loaded chunks and some bounds, `ChunkPrefetchIterator` iterates evenly outwards in T/Z/Y/X.
 */
// NOTE: Assumes `chunks` form a rectangular prism! Will create gaps otherwise! (in practice they always should)
export default class ChunkPrefetchIterator {
  directionStates: PrefetchDirectionState[];
  priorityDirectionStates: PrefetchDirectionState[];

  constructor(
    chunks: TCZYX<number>[],
    tzyxMaxPrefetchOffset: TZYX,
    tczyxChunksPerDimension: TCZYX<number>[],
    priorityDirections?: PrefetchDirection[]
  ) {
    // Get min and max chunk coordinates for T/Z/Y/X
    const extrema: [number, number][] = [
      [Infinity, -Infinity],
      [Infinity, -Infinity],
      [Infinity, -Infinity],
      [Infinity, -Infinity],
    ];

    for (const chunk of chunks) {
      updateMinMax(chunk[0], extrema[0]);
      updateMinMax(chunk[2], extrema[1]);
      updateMinMax(chunk[3], extrema[2]);
      updateMinMax(chunk[4], extrema[3]);
    }

    // Create `PrefetchDirectionState`s for each direction
    this.directionStates = [];
    this.priorityDirectionStates = [];

    for (const [direction, start] of extrema.flat().entries()) {
      const dimension = direction >> 1;
      const tczyxIndex = dimension + Number(dimension !== 0);
      let end: number | number[];
      if (direction & 1) {
        // Positive direction - end is either the max coordinate in the fetched set plus the max offset in this
        // dimension, or the max chunk coordinate in this dimension, whichever comes first
        const endsPerSource = tczyxChunksPerDimension.map((chunkDims) => {
          return Math.min(start + tzyxMaxPrefetchOffset[dimension], chunkDims[tczyxIndex] - 1);
        });

        // Save some time: if all sources have the same end, we can just store that
        if (allEqual(endsPerSource)) {
          end = endsPerSource[0];
        } else {
          // Otherwise, expand our ends per source array to ends per channel
          end = [];
          for (const [i, sourceEnd] of endsPerSource.entries()) {
            pushN(end, sourceEnd, tczyxChunksPerDimension[i][1]);
          }
          console.log(end);
        }
        // end = Math.min(start + tzyxMaxPrefetchOffset[dimension], tczyxChunksPerDimension[dimension] - 1);
      } else {
        // Negative direction - end is either the min coordinate in the fetched set minus the max offset in this
        // dimension, or 0, whichever comes first
        end = Math.max(start - tzyxMaxPrefetchOffset[dimension], 0);
        console.log(end);
      }
      const directionState = { direction, start, end, chunks: [] };

      if (priorityDirections && priorityDirections.includes(direction)) {
        this.priorityDirectionStates.push(directionState);
      } else {
        this.directionStates.push(directionState);
      }
    }

    // Fill each `PrefetchDirectionState` with chunks at the border of the fetched set
    for (const chunk of chunks) {
      for (const dir of this.directionStates) {
        if (chunk[directionToIndex(dir.direction)] === dir.start) {
          dir.chunks.push(chunk);
        }
      }
      for (const dir of this.priorityDirectionStates) {
        if (chunk[directionToIndex(dir.direction)] === dir.start) {
          dir.chunks.push(chunk);
        }
      }
    }
  }

  private static *iterateDirections(directions: PrefetchDirectionState[]): Generator<TCZYX<number>> {
    let offset = 1;

    while (directions.length > 0) {
      // Remove directions in which we have reached the end (or, if per-channel ends, the end for all channels)
      directions = directions.filter((dir) => {
        const end = Array.isArray(dir.end) ? Math.max(...dir.end) : dir.end;
        if (dir.direction & 1) {
          return dir.start + offset <= end;
        } else {
          return dir.start - offset >= end;
        }
      });

      // Yield chunks one chunk farther out in every remaining direction
      for (const dir of directions) {
        const offsetDir = offset * (dir.direction & 1 ? 1 : -1);
        for (const chunk of dir.chunks) {
          // Skip this chunk if this channel has a specific per-channel end and we've reached it
          if (Array.isArray(dir.end) && chunk[directionToIndex(dir.direction)] + offsetDir > dir.end[chunk[1]]) {
            continue;
          }
          const newChunk = chunk.slice() as TCZYX<number>;
          newChunk[directionToIndex(dir.direction)] += offsetDir;
          yield newChunk;
        }
      }

      offset += 1;
    }
  }

  *[Symbol.iterator](): Iterator<TCZYX<number>> {
    // Yield all chunks in priority direction(s) first, if any
    if (this.priorityDirectionStates.length > 0) {
      for (const chunk of ChunkPrefetchIterator.iterateDirections(this.priorityDirectionStates)) {
        yield chunk;
      }
    }

    // Then yield all chunks in other directions
    for (const chunk of ChunkPrefetchIterator.iterateDirections(this.directionStates)) {
      yield chunk;
    }
  }
}

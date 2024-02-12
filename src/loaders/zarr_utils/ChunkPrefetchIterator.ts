import { TCZYX } from "./types";

type TZYX = [number, number, number, number];

/**
 * Directions in which to move outward from the loaded set of chunks while prefetching.
 *
 * Ordered in pairs of opposite directions both because that's a sensible order in which to prefetch for our purposes,
 * and because it lets us treat the least significant bit as the sign. So `direction >> 1` gives the index of the
 * direction in TZYX-ordered arrays, and `direction & 1` gives the sign of the direction (e.g. positive vs negative Z).
 *
 * Note that this enum is mostly for documentation, and its variants are never explicitly used.
 */
export const enum PrefetchDirection {
  T_MINUS = 0,
  T_PLUS = 1,

  Z_MINUS = 2,
  Z_PLUS = 3,

  Y_MINUS = 4,
  Y_PLUS = 5,

  X_MINUS = 6,
  X_PLUS = 7,
}

type PrefetchDirectionState = {
  direction: PrefetchDirection;
  chunks: TCZYX<number>[];
  start: number;
  end: number;
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
    tzyxNumChunks: TZYX,
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
      let end: number;
      if (direction & 1) {
        // Positive direction - end is either the max coordinate in the fetched set plus the max offset in this
        // dimension, or the max chunk coordinate in this dimension, whichever comes first
        end = Math.min(start + tzyxMaxPrefetchOffset[dimension], tzyxNumChunks[dimension] - 1);
      } else {
        // Negative direction - end is either the min coordinate in the fetched set minus the max offset in this
        // dimension, or 0, whichever comes first
        end = Math.max(start - tzyxMaxPrefetchOffset[dimension], 0);
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
    }

    // Filter out prioritized direction(s), if any
    if (priorityDirections && priorityDirections.length > 0) {
      for (const [idx, dir] of this.directionStates.entries()) {
        if (priorityDirections.includes(dir.direction)) {
          this.directionStates.splice(idx, 1);
        }
      }
    }
  }

  static *iterateDirections(directions: PrefetchDirectionState[]): Generator<TCZYX<number>> {
    let offset = 1;

    while (directions.length > 0) {
      // Remove directions in which we have hit a boundary
      directions = directions.filter((dir) => {
        if (dir.direction & 1) {
          return dir.start + offset <= dir.end;
        } else {
          return dir.start - offset >= dir.end;
        }
      });

      // Yield chunks one chunk farther out in every remaining direction
      for (const dir of directions) {
        for (const chunk of dir.chunks) {
          const newChunk = chunk.slice() as TCZYX<number>;
          newChunk[directionToIndex(dir.direction)] += offset * (dir.direction & 1 ? 1 : -1);
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

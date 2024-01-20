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
const enum PrefetchDirection {
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

const skipC = (idx: number): number => idx + Number(idx !== 0);
const directionToIndex = (dir: PrefetchDirection): number => skipC(dir >> 1);

function updateMinMax(val: number, minmax: number[], offset: number): void {
  if (val < minmax[offset]) {
    minmax[offset] = val;
  }

  if (val > minmax[offset + 1]) {
    minmax[offset + 1] = val;
  }
}

/**
 * Since the user is most likely to want nearby data (in space or time) first, we should prefetch those chunks first.
 *
 * Given a list of just-loaded chunks and some bounds, `ChunkPrefetchIterator` iterates evenly outwards in T/Z/Y/X.
 */
// NOTE: Assumes `chunks` form a rectangular prism! Will create gaps otherwise! (in practice they always should)
export default class ChunkPrefetchIterator {
  directions: PrefetchDirectionState[];

  constructor(chunks: TCZYX<number>[], tzyxMaxOffset: TZYX, tzyxChunkSize: TZYX) {
    // Get max and min chunk coordinates for T/Z/Y/X
    const extrema = [Infinity, -Infinity, Infinity, -Infinity, Infinity, -Infinity, Infinity, -Infinity];

    for (const chunk of chunks) {
      updateMinMax(chunk[0], extrema, 0);
      updateMinMax(chunk[2], extrema, 2);
      updateMinMax(chunk[3], extrema, 4);
      updateMinMax(chunk[4], extrema, 6);
    }

    // Create `PrefetchDirectionState`s for each direction
    const directions: PrefetchDirectionState[] = extrema.map((start, direction) => {
      const dimension = direction >> 1;
      if (direction & 1) {
        // Positive direction - end is either the max coordinate in the fetched set plus the max offset in this
        // dimension, or the max chunk coordinate in this dimension, whichever comes first
        const end = Math.min(start + tzyxMaxOffset[dimension], tzyxChunkSize[dimension] - 1);
        return { direction, start, end, chunks: [] };
      } else {
        // Negative direction - end is either the min coordinate in the fetched set minus the max offset in this
        // dimension, or 0, whichever comes first
        const end = Math.max(start - tzyxMaxOffset[dimension], 0);
        return { direction, start, end, chunks: [] };
      }
    });

    // Fill each `PrefetchDirectionState` with chunks at the border of the fetched set
    for (const chunk of chunks) {
      for (const dir of directions) {
        if (chunk[directionToIndex(dir.direction)] === dir.start) {
          dir.chunks.push(chunk);
        }
      }
    }

    this.directions = directions;
  }

  *[Symbol.iterator](): Iterator<TCZYX<number>> {
    let offset = 1;

    while (this.directions.length > 0) {
      // Remove directions in which we have hit a boundary
      this.directions = this.directions.filter((dir) => {
        if (dir.direction & 1) {
          return dir.start + offset <= dir.end;
        } else {
          return dir.start - offset >= dir.end;
        }
      });

      // Yield chunks one chunk farther out in every remaining direction
      for (const dir of this.directions) {
        for (const chunk of dir.chunks) {
          const newChunk = chunk.slice() as TCZYX<number>;
          newChunk[directionToIndex(dir.direction)] += offset * (dir.direction & 1 ? 1 : -1);
          yield newChunk;
        }
      }

      offset += 1;
    }
  }
}

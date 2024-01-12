import { Vector4 } from "three";

import { TCZYX } from "./types";

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

/**
 * Since the user is most likely to want nearby data (in space or time) first, we should prefetch those chunks first.
 *
 * Given a list of just-loaded chunks and some bounds, `ChunkPrefetchIterator` iterates evenly outwards in T/Z/Y/X.
 */
// NOTE: Assumes `chunks` form a rectangular prism! Will create gaps otherwise! (in practice they always should)
export default class ChunkPrefetchIterator {
  directions: PrefetchDirectionState[];

  constructor(chunks: TCZYX<number>[], xyztMaxOffset: Vector4, xyztChunkSize: Vector4) {
    const maxOffsetArr = [xyztMaxOffset.w, xyztMaxOffset.z, xyztMaxOffset.y, xyztMaxOffset.x];
    const chunkSizeArr = [xyztChunkSize.w, xyztChunkSize.z, xyztChunkSize.y, xyztChunkSize.x];
    // Get max and min chunk coordinates for T/Z/Y/X
    const extrema = [Infinity, -Infinity, Infinity, -Infinity, Infinity, -Infinity, Infinity, -Infinity];

    for (const chunk of chunks) {
      for (let j = 0; j < 4; j++) {
        const val = chunk[skipC(j)];
        const extremaIdx = j << 1;

        if (val < extrema[extremaIdx]) {
          extrema[extremaIdx] = val;
        }

        if (val > extrema[extremaIdx + 1]) {
          extrema[extremaIdx + 1] = val;
        }
      }
    }

    // Create `PrefetchDirectionState`s for each direction and fill them with chunks at the borders of the fetched set
    const directions: PrefetchDirectionState[] = extrema.map((start, direction) => {
      const end =
        direction & 1
          ? Math.min(start + maxOffsetArr[direction >> 1], chunkSizeArr[direction >> 1] - 1)
          : Math.max(start - maxOffsetArr[direction >> 1], 0);
      return { direction, start, end, chunks: [] };
    });

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

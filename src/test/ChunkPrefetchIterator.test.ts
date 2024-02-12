import { expect } from "chai";

import { TCZYX } from "../loaders/zarr_utils/types";
import ChunkPrefetchIterator, { PrefetchDirection } from "../loaders/zarr_utils/ChunkPrefetchIterator";

const EXPECTED_3X3X3X3 = [
  [0, 0, 1, 1, 1], // T-
  [2, 0, 1, 1, 1], // T+
  [1, 0, 0, 1, 1], // Z-
  [1, 0, 2, 1, 1], // Z+
  [1, 0, 1, 0, 1], // Y-
  [1, 0, 1, 2, 1], // Y+
  [1, 0, 1, 1, 0], // X-
  [1, 0, 1, 1, 2], // X+
];

// move from the middle of a 3x3x3x3 cube to the middle of a 5x5x5x5 cube
const EXPECTED_5X5X5X5_1 = EXPECTED_3X3X3X3.map(([t, c, z, y, x]) => [t + 1, c, z + 1, y + 1, x + 1]);
// offset = 2!
const EXPECTED_5X5X5X5_2 = [
  [0, 0, 2, 2, 2], // T--
  [4, 0, 2, 2, 2], // T++
  [2, 0, 0, 2, 2], // Z--
  [2, 0, 4, 2, 2], // Z++
  [2, 0, 2, 0, 2], // Y--
  [2, 0, 2, 4, 2], // Y++
  [2, 0, 2, 2, 0], // X--
  [2, 0, 2, 2, 4], // X++
];

function validate(iter: ChunkPrefetchIterator, expected: number[][]) {
  expect([...iter]).to.deep.equal(expected);
}

describe("ChunkPrefetchIterator", () => {
  it("iterates outward in TZYX order, negative then positive", () => {
    // 3x3x3x3, with one chunk in the center
    const iterator = new ChunkPrefetchIterator([[1, 0, 1, 1, 1]], [1, 1, 1, 1], [3, 3, 3, 3]);
    validate(iterator, EXPECTED_3X3X3X3);
  });

  it("finds the borders of a set of multiple chunks and iterates outward from them", () => {
    // 4x4x4, with a 2x2x2 set of chunks in the center
    const fetchedChunks: TCZYX<number>[] = [
      [1, 0, 1, 1, 1],
      [1, 0, 1, 1, 2],
      [1, 0, 1, 2, 1],
      [1, 0, 1, 2, 2],
      [1, 0, 2, 1, 1],
      [1, 0, 2, 1, 2],
      [1, 0, 2, 2, 1],
      [1, 0, 2, 2, 2],
    ];
    const iterator = new ChunkPrefetchIterator(fetchedChunks, [1, 1, 1, 1], [3, 4, 4, 4]);

    const expected = [
      ...fetchedChunks.map(([_t, c, z, y, x]) => [0, c, z, y, x]), // T-
      ...fetchedChunks.map(([_t, c, z, y, x]) => [2, c, z, y, x]), // T+
      ...fetchedChunks.filter(([_t, _c, z, _y, _x]) => z === 1).map(([t, c, _z, y, x]) => [t, c, 0, y, x]), // Z-
      ...fetchedChunks.filter(([_t, _c, z, _y, _x]) => z === 2).map(([t, c, _z, y, x]) => [t, c, 3, y, x]), // Z+
      ...fetchedChunks.filter(([_t, _c, _z, y, _x]) => y === 1).map(([t, c, z, _y, x]) => [t, c, z, 0, x]), // Y-
      ...fetchedChunks.filter(([_t, _c, _z, y, _x]) => y === 2).map(([t, c, z, _y, x]) => [t, c, z, 3, x]), // Y+
      ...fetchedChunks.filter(([_t, _c, _z, _y, x]) => x === 1).map(([t, c, z, y, _x]) => [t, c, z, y, 0]), // X-
      ...fetchedChunks.filter(([_t, _c, _z, _y, x]) => x === 2).map(([t, c, z, y, _x]) => [t, c, z, y, 3]), // X+
    ];
    validate(iterator, expected);
  });

  it("iterates through the same offset in all dimensions before increasing the offset", () => {
    // 5x5x5, with one chunk in the center
    const iterator = new ChunkPrefetchIterator([[2, 0, 2, 2, 2]], [2, 2, 2, 2], [5, 5, 5, 5]);

    const expected = [
      // offset = 1
      ...EXPECTED_5X5X5X5_1,
      // offset = 2!
      ...EXPECTED_5X5X5X5_2,
    ];
    validate(iterator, expected);
  });

  it("stops at the max offset in each dimension", () => {
    // 5x5x5, with one chunk in the center
    const iterator = new ChunkPrefetchIterator([[2, 0, 2, 2, 2]], [1, 1, 1, 1], [5, 5, 5, 5]);
    validate(iterator, EXPECTED_5X5X5X5_1); // never reaches offset = 2, as it does above
  });

  it("stops at the borders of the zarr", () => {
    // 3x3x3x3, with one chunk in the center
    const iterator = new ChunkPrefetchIterator([[1, 0, 1, 1, 1]], [2, 2, 2, 2], [3, 3, 3, 3]);
    validate(iterator, EXPECTED_3X3X3X3);
  });

  it("does not iterate in dimensions which are entirely covered by the fetched set", () => {
    // 3x3x3x3, with a 1x1x3x3 slice covering all of x and y
    const fetchedChunks: TCZYX<number>[] = [
      [1, 0, 1, 0, 0], // 0, 0
      [1, 0, 1, 0, 1], // 0, 1
      [1, 0, 1, 0, 2], // 0, 2
      [1, 0, 1, 1, 0], // 1, 0
      [1, 0, 1, 1, 1], // 1, 1
      [1, 0, 1, 1, 2], // 1, 2
      [1, 0, 1, 2, 0], // 2, 0
      [1, 0, 1, 2, 1], // 2, 1
      [1, 0, 1, 2, 2], // 2, 2
    ];
    const iterator = new ChunkPrefetchIterator(fetchedChunks, [1, 1, 1, 1], [3, 3, 3, 3]);

    const expected = [
      ...fetchedChunks.map(([_t, c, z, y, x]) => [0, c, z, y, x]), // T-
      ...fetchedChunks.map(([_t, c, z, y, x]) => [2, c, z, y, x]), // T+
      ...fetchedChunks.map(([t, c, _z, y, x]) => [t, c, 0, y, x]), // Z-
      ...fetchedChunks.map(([t, c, _z, y, x]) => [t, c, 2, y, x]), // Z+
      // skips x and y
    ];
    validate(iterator, expected);
  });

  it("does not iterate in dimensions where the max offset is 0", () => {
    // 3x3x3x3, with one chunk in the center
    const iterator = new ChunkPrefetchIterator([[1, 0, 1, 1, 1]], [1, 0, 1, 0], [3, 3, 3, 3]);

    const expected = [
      [0, 0, 1, 1, 1], // T-
      [2, 0, 1, 1, 1], // T+
      // skips z
      [1, 0, 1, 0, 1], // Y-
      [1, 0, 1, 2, 1], // Y+
      // skips x
    ];
    validate(iterator, expected);
  });

  it("yields chunks in all prioritized directions first", () => {
    // 5x5x5, with one chunk in the center
    const iterator = new ChunkPrefetchIterator(
      [[2, 0, 2, 2, 2]],
      [2, 2, 2, 2],
      [5, 5, 5, 5],
      [PrefetchDirection.T_PLUS, PrefetchDirection.Y_MINUS]
    );

    const expected = [
      [3, 0, 2, 2, 2], // T+
      [2, 0, 2, 1, 2], // Y-
      [4, 0, 2, 2, 2], // T++
      [2, 0, 2, 0, 2], // Y--
      ...EXPECTED_5X5X5X5_1.filter(([t, _c, _z, y, _x]) => t <= 2 && y >= 2),
      ...EXPECTED_5X5X5X5_2.filter(([t, _c, _z, y, _x]) => t <= 2 && y >= 2),
    ];
    validate(iterator, expected);
  });

  it("continues iterating in other dimensions when some reach their limits", () => {
    // final boss: 4x4x6 volume with off-center fetched set
    // t has a max offset of 2, but is already at its maximum of 2 and never iterates in positive direction
    // z has a max offset of 2, but stops early in negative direction at 0
    // y has a max offset of 2, but is already covered in the negative direction by chunks in the fetched set
    // x has a max offset of 1, which stops iteration before it gets to either edge
    const fetchedChunks: TCZYX<number>[] = [
      [2, 0, 1, 0, 2],
      [2, 0, 1, 0, 3],
      [2, 0, 1, 1, 2],
      [2, 0, 1, 1, 3],
    ];
    const iterator = new ChunkPrefetchIterator(fetchedChunks, [2, 2, 2, 1], [3, 4, 4, 6]);

    // prettier-ignore
    const expected = [
      ...fetchedChunks.map(([_t, c, z, y, x]) => [1, c, z, y, x]), // T-
      // skip t+: already at max t
      ...fetchedChunks.map(([t, c, _z, y, x]) => [t, c, 0, y, x]), // Z-
      ...fetchedChunks.map(([t, c, _z, y, x]) => [t, c, 2, y, x]), // Z+
      // skip y-: already covered by fetched chunks
      [2, 0, 1, 2, 2], [2, 0, 1, 2, 3], // Y+
      [2, 0, 1, 0, 1], [2, 0, 1, 1, 1], // X-
      [2, 0, 1, 0, 4], [2, 0, 1, 1, 4], // X+
      ...fetchedChunks.map(([_t, c, z, y, x]) => [0, c, z, y, x]), // T--
      // skip t++: still at max t
      // skip z--: already reached z = 0 above
      ...fetchedChunks.map(([t, c, _z, y, x]) => [t, c, 3, y, x]), // Z++
      // skip y-: still already covered by fetched chunks
      [2, 0, 1, 3, 2], [2, 0, 1, 3, 3], // Y+
      // skip x: already at max offset in x
    ];
    validate(iterator, expected);
  });
});

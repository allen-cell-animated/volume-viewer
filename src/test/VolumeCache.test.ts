import { expect } from "chai";
import VolumeCache, { DataArrayExtent } from "../VolumeCache";

function testInsertFails(dataLength: number, extent?: Partial<DataArrayExtent>, maxSize?: number): void {
  const cache = new VolumeCache(maxSize);
  const vol = cache.addVolume(1, 1, [{ x: 2, y: 2, z: 2 }]);
  const insertionResult = cache.insert(vol, 0, new Uint8Array(dataLength), extent);
  expect(insertionResult).to.be.false;
  expect(cache.get(vol, 0)).to.be.undefined;
}

describe("VolumeCache", () => {
  describe("addVolume", () => {
    it("assigns unique IDs to multiple new volumes", () => {
      const cache = new VolumeCache();
      const id1 = cache.addVolume(1, 1, [{ x: 1, y: 1, z: 1 }]);
      const id2 = cache.addVolume(1, 1, [{ x: 1, y: 1, z: 1 }]);
      expect(id1).to.not.equal(id2);
    });
  });

  describe("insert", () => {
    it("adds a new entry to the cache", () => {
      const cache = new VolumeCache();
      const vol = cache.addVolume(2, 2, [{ x: 2, y: 2, z: 2 }]);
      expect(cache.get(vol, 1)).to.equal(undefined);

      const extent: DataArrayExtent = { time: 1, channel: 1, x: [0, 1], y: [0, 1], z: [1, 1] };
      const insertionResult = cache.insert(vol, 0, new Uint8Array(4), extent);
      expect(insertionResult).to.be.true;
      expect(cache.get(vol, 1, extent)).to.deep.equal(new Uint8Array(4));
    });

    it("defaults to the first channel, first timestep, and maximum extent when unspecified", () => {
      const cache = new VolumeCache();
      const vol = cache.addVolume(2, 2, [{ x: 2, y: 2, z: 2 }]);
      const insertionResult = cache.insert(vol, 0, new Uint8Array(8));
      expect(insertionResult).to.be.true;
      expect(cache.get(vol, 0)).to.deep.equal(new Uint8Array(8));
    });

    it("does not insert an entry if the extent does not match the data", () => {
      testInsertFails(7);
    });

    it("does not insert an entry if one or more dimensions of the extent is invalid", () => {
      testInsertFails(2, { z: [2, 0], y: [2, 0] });
    });

    it("does not insert an entry if the extent is out of range", () => {
      testInsertFails(12, { z: [0, 2] });
    });

    it("does not insert an entry if it is too big for the cache", () => {
      testInsertFails(8, {}, 6);
    });

    // TODO test eviction behavior
  });

  // TODO test `get`
});

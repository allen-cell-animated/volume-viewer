import { Box3, Vector3 } from "three";
import { expect } from "chai";
import VolumeCache, { CachedVolume, DataArrayExtent } from "../VolumeCache";

describe("VolumeCache", () => {
  it("creates an empty cache with the specified max size", () => {
    const cache = new VolumeCache(10);
    expect(cache.size).to.equal(0);
    expect(cache.maxSize).to.equal(10);
  });

  describe("addVolume", () => {
    it("assigns unique IDs to multiple new volumes", () => {
      const cache = new VolumeCache();
      const id1 = cache.addVolume(1, 1, [new Vector3(1, 1, 1)]);
      const id2 = cache.addVolume(1, 1, [new Vector3(1, 1, 1)]);
      expect(id1).to.not.equal(id2);
    });
  });

  describe("insert", () => {
    it("adds a new entry to the cache", () => {
      const cache = new VolumeCache();
      const vol = cache.addVolume(2, 2, [new Vector3(2, 2, 2), new Vector3(4, 4, 4)]);
      expect(cache.get(vol, 1)).to.be.undefined;

      const extent: DataArrayExtent = {
        scale: 1,
        time: 1,
        channel: 1,
        region: new Box3(new Vector3(0, 0, 1), new Vector3(1, 1, 1)),
      };
      const insertionResult = cache.insert(vol, new Uint8Array(4), extent);
      expect(insertionResult).to.be.true;
      expect(cache.get(vol, 1, extent)).to.deep.equal(new Uint8Array(4));
    });

    it("defaults to the first channel, first timestep, and maximum extent when unspecified", () => {
      const cache = new VolumeCache();
      const vol = cache.addVolume(2, 2, [new Vector3(2, 2, 2), new Vector3(4, 4, 4)]);
      const insertionResult = cache.insert(vol, new Uint8Array(8));
      expect(insertionResult).to.be.true;
      expect(cache.get(vol, 0)).to.deep.equal(new Uint8Array(8));
    });

    function testInsertFails(dataLength: number, extent?: Partial<DataArrayExtent>, maxSize?: number): void {
      const cache = new VolumeCache(maxSize);
      const vol = cache.addVolume(1, 1, [new Vector3(2, 2, 2)]);
      const insertionResult = cache.insert(vol, new Uint8Array(dataLength), extent);
      expect(insertionResult).to.be.false;
      expect(cache.get(vol, 0)).to.be.undefined;
    }

    it("does not insert an entry if the extent does not match the data", () => {
      testInsertFails(7);
    });

    it("does not insert an entry if one or more dimensions of the extent is invalid", () => {
      const region = new Box3();
      region.min.y = 2;
      region.min.z = 2;
      testInsertFails(2, { region });
    });

    it("does not insert an entry if the extent is out of range", () => {
      const region = new Box3();
      region.max.z = 2;
      testInsertFails(12, { region });
    });

    it("does not insert an entry if it is too big for the cache", () => {
      testInsertFails(8, {}, 6);
    });

    /**
     * - Cache has a memory limit of 12
     * - Volume 1 has 2 channels, 1 time, 2 scale levels: 2x1x1 and 4x2x2
     * - Volume 2 has 1 channel, 2 times, 1 scale level: 3x2x1
     */
    function setupEvictionTest(): [VolumeCache, CachedVolume, CachedVolume] {
      const cache = new VolumeCache(12);
      const id1 = cache.addVolume(2, 1, [new Vector3(2, 1, 1), new Vector3(4, 2, 2)]);
      const id2 = cache.addVolume(1, 2, [new Vector3(3, 2, 1)]);
      return [cache, id1, id2];
    }

    it("evicts the least recently used entry when above its size limit", () => {
      const [cache, id1] = setupEvictionTest(); // max: 12
      const region1 = new Box3(new Vector3(0), new Vector3(1));
      const region2 = new Box3(new Vector3(2), new Vector3(3));
      cache.insert(id1, new Uint8Array(8), { scale: 1, region: region1 }); // 8 < 12
      cache.insert(id1, new Uint8Array(2)); // 10 < 12
      cache.insert(id1, new Uint8Array(8), { scale: 1, region: region2 }); // 18 > 12! evict 1!
      expect(cache.size).to.equal(10);
      expect(cache.numberOfEntries).to.equal(2);
      expect(cache.get(id1, 0, { scale: 1, region: region1 })).to.be.undefined;
      expect(cache.get(id1, 0)).to.deep.equal(new Uint8Array(2));
      expect(cache.get(id1, 0, { scale: 1, region: region2 })).to.deep.equal(new Uint8Array(8));
    });

    it("evicts the least recently used entry regardless of which volume it's in", () => {
      const [cache, id1, id2] = setupEvictionTest();
      cache.insert(id1, new Uint8Array(2)); // 2
      cache.insert(id2, new Uint8Array(6)); // 8
      cache.insert(id2, new Uint8Array(6), { time: 1 }); // 14!
      expect(cache.size).to.equal(12);
      expect(cache.numberOfEntries).to.equal(2);
      expect(cache.get(id1, 0)).to.be.undefined;
      expect(cache.get(id2, 0)).to.deep.equal(new Uint8Array(6));
      expect(cache.get(id2, 0, { time: 1 })).to.deep.equal(new Uint8Array(6));
    });

    it("evicts as many entries as it takes to get below max size", () => {
      const [cache, id1, id2] = setupEvictionTest();
      const region = new Box3(new Vector3(0), new Vector3(1));
      cache.insert(id2, new Uint8Array(6)); // 6
      cache.insert(id2, new Uint8Array(6), { time: 1 }); // 12
      cache.insert(id1, new Uint8Array(8), { scale: 1, region }); // 20!
      expect(cache.size).to.equal(8);
      expect(cache.numberOfEntries).to.equal(1);
      expect(cache.get(id2, 0)).to.be.undefined;
      expect(cache.get(id2, 0, { time: 1 })).to.be.undefined;
      expect(cache.get(id1, 0, { scale: 1, region })).to.deep.equal(new Uint8Array(8));
    });

    it("reuses any entries that match the provided extent rather than growing the cache with duplicates", () => {
      const [cache, id1] = setupEvictionTest();
      const region1 = new Box3(new Vector3(0), new Vector3(0));
      const region2 = new Box3(new Vector3(1), new Vector3(2));
      cache.insert(id1, new Uint8Array([1, 2, 3, 4]), { scale: 1, region: region1 }); // 4
      cache.insert(id1, new Uint8Array(8), { scale: 1, region: region2 }); // 12
      cache.insert(id1, new Uint8Array([5, 6, 7, 8]), { scale: 1, region: region1 }); // still 12
      expect(cache.size).to.equal(12);
      expect(cache.numberOfEntries).to.equal(2);
      expect(cache.get(id1, 0, { scale: 1, region: region2 })).to.deep.equal(new Uint8Array(8));
      expect(cache.get(id1, 0, { scale: 1, region: region1 })).to.deep.equal(new Uint8Array([5, 6, 7, 8]));
    });
  });

  const region1 = new Box3(new Vector3(+Infinity, +Infinity, 0), new Vector3(-Infinity, -Infinity, 0));
  const region2 = new Box3(new Vector3(+Infinity, +Infinity, 1), new Vector3(-Infinity, -Infinity, 1));

  const SLICE_1_1 = [1, 2, 3, 4];
  const SLICE_1_2 = [5, 6, 7, 8];
  const SLICE_2_1 = [2, 4, 6, 8];
  const SLICE_2_2 = [1, 3, 5, 7];
  function setupGetTest(addSlices: [boolean, boolean, boolean, boolean]): [VolumeCache, CachedVolume] {
    const cache = new VolumeCache(12);
    const vol = cache.addVolume(2, 1, [new Vector3(2, 2, 2)]);
    const insertFuncs = [
      () => cache.insert(vol, new Uint8Array(SLICE_1_1), { region: region1 }),
      () => cache.insert(vol, new Uint8Array(SLICE_1_2), { region: region2 }),
      () => cache.insert(vol, new Uint8Array(SLICE_2_1), { region: region1, channel: 1 }),
      () => cache.insert(vol, new Uint8Array(SLICE_2_2), { region: region2, channel: 1 }),
    ];
    insertFuncs.forEach((fn, idx) => {
      if (addSlices[idx]) fn();
    });
    return [cache, vol];
  }

  describe("get", () => {
    it("gets a single channel when provided a channel index", () => {
      const [cache, id] = setupGetTest([false, false, false, true]);
      const region = new Box3(new Vector3(0, 0, 1), new Vector3(1, 1, 1));
      const result = cache.get(id, 1, { scale: 0, time: 0, region });
      expect(result).to.deep.equal(new Uint8Array(SLICE_2_2));
    });

    it("defaults to the first timestep and maximum extent when unspecified", () => {
      const cache = new VolumeCache();
      const id = cache.addVolume(2, 2, [new Vector3(2, 2, 2)]);
      cache.insert(id, new Uint8Array(8), { channel: 1 });
      expect(cache.get(id, 1)).to.deep.equal(new Uint8Array(8));
    });

    it("gets multiple channels when provided an array of indexes", () => {
      const [cache, id] = setupGetTest([false, true, false, true]);
      const result = cache.get(id, [1, 0], { region: region2 });
      expect(result).to.deep.equal([new Uint8Array(SLICE_2_2), new Uint8Array(SLICE_1_2)]);
    });

    it("gets all channels when provided no index", () => {
      const [cache, id] = setupGetTest([false, true, false, true]);
      const result = cache.get(id, { region: region2 });
      expect(result).to.deep.equal([new Uint8Array(SLICE_1_2), new Uint8Array(SLICE_2_2)]);
    });

    it("inserts `undefined` for missing entries when returning an array of channels", () => {
      const [cache, id] = setupGetTest([true, false, false, false]);
      const resultArr = cache.get(id, [0, 1], { region: region1 });
      const resultNone = cache.get(id, { region: region1 });
      expect(resultArr).to.deep.equal([new Uint8Array(SLICE_1_1), undefined], "array syntax");
      expect(resultNone).to.deep.equal([new Uint8Array(SLICE_1_1), undefined], "implicit syntax");
    });

    it("moves returned entries to the front of the LRU queue", () => {
      const [cache, id] = setupGetTest([true, true, true, false]); // size: 12; max: 12
      cache.get(id, 0, { region: region1 }); // SLICE_1_1 moves from last to first; SLICE_1_2 is now last
      cache.insert(id, new Uint8Array(SLICE_2_2), { channel: 1, region: region2 }); // 16! evict SLICE_1_2
      expect(cache.get(id, 0, { region: region2 })).to.be.undefined;
      expect(cache.get(id, 0, { region: region1 })).to.deep.equal(new Uint8Array(SLICE_1_1));
    });
  });

  const SPECIFIC_EXTENT: Partial<DataArrayExtent> = {
    time: 1,
    channel: 1,
    scale: 1,
    region: new Box3(new Vector3(1, 1), new Vector3(1, 1)),
  };

  function setupClearTest(): [VolumeCache, CachedVolume, CachedVolume] {
    const cache = new VolumeCache();
    const id1 = cache.addVolume(2, 2, [new Vector3(1, 1, 1), new Vector3(2, 2, 2)]);
    const id2 = cache.addVolume(1, 1, [new Vector3(1, 1, 1)]);
    cache.insert(id1, new Uint8Array(1));
    cache.insert(id1, new Uint8Array(2), SPECIFIC_EXTENT);
    cache.insert(id2, new Uint8Array(1));
    return [cache, id1, id2];
  }

  describe("clearVolume", () => {
    it("clears all entries associated with one volume from the cache", () => {
      const [cache, id1, id2] = setupClearTest();
      cache.clearVolume(id1);
      expect(cache.size).to.equal(1);
      expect(cache.numberOfEntries).to.equal(1);
      expect(cache.get(id1, 0)).to.be.undefined;
      expect(cache.get(id1, 1, SPECIFIC_EXTENT)).to.be.undefined;
      expect(cache.get(id2, 0)).to.deep.equal(new Uint8Array(1));
    });
  });

  describe("clear", () => {
    it("clears all entries from the cache", () => {
      const [cache, id1, id2] = setupClearTest();
      cache.clear();
      expect(cache.size).to.equal(0);
      expect(cache.numberOfEntries).to.equal(0);
      expect(cache.get(id1, 0)).to.be.undefined;
      expect(cache.get(id1, 1, SPECIFIC_EXTENT)).to.be.undefined;
      expect(cache.get(id2, 0)).to.be.undefined;
    });
  });
});

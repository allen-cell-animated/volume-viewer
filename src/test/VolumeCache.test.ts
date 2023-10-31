import { Vector3 } from "three";
import { expect } from "chai";
import VolumeCache, { CacheStore } from "../VolumeCache";

const setupEvictionTest = (): [VolumeCache, CacheStore, CacheStore] => [new VolumeCache(12), new Map(), new Map()];

describe("VolumeCache", () => {
  it("creates an empty cache with the specified max size", () => {
    const cache = new VolumeCache(10);
    expect(cache.size).to.equal(0);
    expect(cache.maxSize).to.equal(10);
  });

  describe("insert", () => {
    it("adds a new entry to the cache", () => {
      const cache = new VolumeCache();
      const store: CacheStore = new Map();
      expect(cache.get(store, "1")).to.be.undefined;

      const insertionResult = cache.insert(store, "1", new Uint8Array(4));
      expect(insertionResult).to.be.true;
      expect(cache.get(store, "1")).to.deep.equal(new Uint8Array(4));
    });

    it("does not insert an entry if it is too big for the cache", () => {
      const cache = new VolumeCache(6);
      const store: CacheStore = new Map();
      const insertionResult = cache.insert(store, "1", new Uint8Array(8));
      expect(insertionResult).to.be.false;
      expect(cache.get(store, "1")).to.be.undefined;
    });

    it("evicts the least recently used entry when above its size limit", () => {
      const [cache, store0] = setupEvictionTest(); // max: 12

      cache.insert(store0, "0", new Uint8Array(8)); // 8 < 12
      cache.insert(store0, "1", new Uint8Array(2)); // 10 < 12
      cache.insert(store0, "1", new Uint8Array(8)); // 18 > 12! evict 1!

      expect(cache.size).to.equal(10);
      expect(cache.numberOfEntries).to.equal(2);

      expect(cache.get(store0, "0")).to.be.undefined;
      expect(cache.get(store0, "1")).to.deep.equal(new Uint8Array(2));
      expect(cache.get(store0, "2")).to.deep.equal(new Uint8Array(8));
    });

    it("evicts the least recently used entry regardless of which volume it's in", () => {
      const [cache, store0, store1] = setupEvictionTest();

      cache.insert(store0, "0", new Uint8Array(2)); // 2
      cache.insert(store1, "0", new Uint8Array(6)); // 8
      cache.insert(store1, "1", new Uint8Array(6)); // 14!

      expect(cache.size).to.equal(12);
      expect(cache.numberOfEntries).to.equal(2);

      expect(cache.get(store0, "0")).to.be.undefined;
      expect(cache.get(store1, "0")).to.deep.equal(new Uint8Array(6));
      expect(cache.get(store1, "1")).to.deep.equal(new Uint8Array(6));
    });

    it("evicts as many entries as it takes to get below max size", () => {
      const [cache, store0, store1] = setupEvictionTest();

      cache.insert(store1, "0", new Uint8Array(6)); // 6
      cache.insert(store1, "1", new Uint8Array(6)); // 12
      cache.insert(store0, "0", new Uint8Array(8)); // 20!

      expect(cache.size).to.equal(8);
      expect(cache.numberOfEntries).to.equal(1);

      expect(cache.get(store1, "0")).to.be.undefined;
      expect(cache.get(store1, "1")).to.be.undefined;
      expect(cache.get(store0, "0")).to.deep.equal(new Uint8Array(8));
    });

    it("reuses any entries that match the provided key", () => {
      const [cache, store0] = setupEvictionTest();

      cache.insert(store0, "0", new Uint8Array([1, 2, 3, 4])); // 4
      cache.insert(store0, "1", new Uint8Array(8)); // 12
      cache.insert(store0, "0", new Uint8Array([5, 6, 7, 8])); // still 12

      expect(cache.size).to.equal(12);
      expect(cache.numberOfEntries).to.equal(2);

      expect(cache.get(store0, "1")).to.deep.equal(new Uint8Array(8));
      expect(cache.get(store0, "0")).to.deep.equal(new Uint8Array([5, 6, 7, 8]));
    });
  });

  const SLICE_0 = [1, 2, 3, 4];
  const SLICE_1 = [5, 6, 7, 8];
  const SLICE_2 = [2, 4, 6, 8];
  const SLICE_3 = [1, 3, 5, 7];
  function setupGetTest(): [VolumeCache, CacheStore] {
    const cache = new VolumeCache(12);
    const store: CacheStore = new Map();
    cache.insert(store, "0", new Uint8Array(SLICE_0));
    cache.insert(store, "1", new Uint8Array(SLICE_1));
    cache.insert(store, "2", new Uint8Array(SLICE_2));
    return [cache, store];
  }

  describe("get", () => {
    it("gets an entry when provided a key", () => {
      const [cache, store] = setupGetTest();
      const result = cache.get(store, "1");
      expect(result).to.deep.equal(new Uint8Array(SLICE_1));
    });

    it("moves returned entries to the front of the LRU queue", () => {
      const [cache, id] = setupGetTest(); // size: 12; max: 12

      cache.get(id, "0"); // SLICE_0 moves from last to first; SLICE_1 is now last
      cache.insert(id, "3", new Uint8Array(SLICE_3)); // 16! evict SLICE_1

      expect(cache.get(id, "0")).to.deep.equal(new Uint8Array(SLICE_0));
      expect(cache.get(id, "1")).to.be.undefined;
      expect(cache.get(id, "2")).to.deep.equal(new Uint8Array(SLICE_2));
      expect(cache.get(id, "3")).to.deep.equal(new Uint8Array(SLICE_3));
    });
  });

  function setupClearTest(): [VolumeCache, CacheStore, CacheStore] {
    const [cache, store0, store1] = setupEvictionTest();

    cache.insert(store0, "0", new Uint8Array(1));
    cache.insert(store0, "1", new Uint8Array(2));
    cache.insert(store1, "0", new Uint8Array(1));

    return [cache, store0, store1];
  }

  describe("clearVolume", () => {
    it("clears all entries associated with one volume from the cache", () => {
      const [cache, store0, store1] = setupClearTest();
      cache.clearStore(store0);

      expect(cache.size).to.equal(1);
      expect(cache.numberOfEntries).to.equal(1);

      expect(cache.get(store0, "0")).to.be.undefined;
      expect(cache.get(store0, "1")).to.be.undefined;
      expect(cache.get(store1, "0")).to.deep.equal(new Uint8Array(1));
    });
  });

  describe("clear", () => {
    it("clears all entries from the cache", () => {
      const [cache, store0, store1] = setupClearTest();

      cache.clear();

      expect(cache.size).to.equal(0);
      expect(cache.numberOfEntries).to.equal(0);

      expect(cache.get(store0, "0")).to.be.undefined;
      expect(cache.get(store0, "1")).to.be.undefined;
      expect(cache.get(store1, "0")).to.be.undefined;
    });
  });
});

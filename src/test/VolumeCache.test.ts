import VolumeCache from "../VolumeCache";

describe("VolumeCache", () => {
  test("creates an empty cache with the specified max size", () => {
    const cache = new VolumeCache(10);
    expect(cache.size).to.equal(0);
    expect(cache.maxSize).to.equal(10);
  });

  describe("insert", () => {
    test("adds a new entry to the cache", () => {
      const cache = new VolumeCache();
      expect(cache.get("1")).to.be.undefined;

      const insertionResult = cache.insert("1", new Uint8Array(4));
      expect(insertionResult).to.be.true;
      expect(cache.get("1")).to.deep.equal(new Uint8Array(4));
    });

    test("does not insert an entry if it is too big for the cache", () => {
      const cache = new VolumeCache(6);
      const insertionResult = cache.insert("1", new Uint8Array(8));
      expect(insertionResult).to.be.false;
      expect(cache.get("1")).to.be.undefined;
    });

    test("evicts the least recently used entry when above its size limit", () => {
      const cache = new VolumeCache(12); // max: 12

      cache.insert("0", new Uint8Array(8)); // 8 < 12
      cache.insert("1", new Uint8Array(2)); // 10 < 12
      cache.insert("2", new Uint8Array(8)); // 18 > 12! evict 1!

      expect(cache.size).to.equal(10);
      expect(cache.numberOfEntries).to.equal(2);

      expect(cache.get("0")).to.be.undefined;
      expect(cache.get("1")).to.deep.equal(new Uint8Array(2));
      expect(cache.get("2")).to.deep.equal(new Uint8Array(8));
    });

    test("evicts as many entries as it takes to get below max size", () => {
      const cache = new VolumeCache(12);

      cache.insert("0", new Uint8Array(6)); // 6
      cache.insert("1", new Uint8Array(6)); // 12
      cache.insert("2", new Uint8Array(8)); // 20!

      expect(cache.size).to.equal(8);
      expect(cache.numberOfEntries).to.equal(1);

      expect(cache.get("0")).to.be.undefined;
      expect(cache.get("1")).to.be.undefined;
      expect(cache.get("2")).to.deep.equal(new Uint8Array(8));
    });

    test("reuses any entries that match the provided key", () => {
      const cache = new VolumeCache(12);

      cache.insert("0", new Uint8Array([1, 2, 3, 4])); // 4
      cache.insert("1", new Uint8Array(8)); // 12
      cache.insert("0", new Uint8Array([5, 6, 7, 8])); // still 12

      expect(cache.size).to.equal(12);
      expect(cache.numberOfEntries).to.equal(2);

      expect(cache.get("1")).to.deep.equal(new Uint8Array(8));
      expect(cache.get("0")).to.deep.equal(new Uint8Array([5, 6, 7, 8]));
    });
  });

  const SLICE_0 = [1, 2, 3, 4];
  const SLICE_1 = [5, 6, 7, 8];
  const SLICE_2 = [2, 4, 6, 8];
  const SLICE_3 = [1, 3, 5, 7];
  function setupGetTest(): VolumeCache {
    const cache = new VolumeCache(12);
    cache.insert("0", new Uint8Array(SLICE_0));
    cache.insert("1", new Uint8Array(SLICE_1));
    cache.insert("2", new Uint8Array(SLICE_2));
    return cache;
  }

  describe("get", () => {
    test("gets an entry when provided a key", () => {
      const cache = setupGetTest();
      const result = cache.get("1");
      expect(result).to.deep.equal(new Uint8Array(SLICE_1));
    });

    test("moves returned entries to the front of the LRU queue", () => {
      const cache = setupGetTest(); // size: 12; max: 12

      cache.get("0"); // SLICE_0 moves from last to first; SLICE_1 is now last
      cache.insert("3", new Uint8Array(SLICE_3)); // 16! evict SLICE_1

      expect(cache.get("0")).to.deep.equal(new Uint8Array(SLICE_0));
      expect(cache.get("1")).to.be.undefined;
      expect(cache.get("2")).to.deep.equal(new Uint8Array(SLICE_2));
      expect(cache.get("3")).to.deep.equal(new Uint8Array(SLICE_3));
    });
  });

  function setupClearTest(): VolumeCache {
    const cache = new VolumeCache(12);

    cache.insert("0/0", new Uint8Array(1));
    cache.insert("0/1", new Uint8Array(2));
    cache.insert("1/0", new Uint8Array(1));

    return cache;
  }

  describe("clearWithPrefix", () => {
    test("clears all entries from the cache whose keys have the specified prefix", () => {
      const cache = setupClearTest();
      cache.clearWithPrefix("0/");

      expect(cache.size).to.equal(1);
      expect(cache.numberOfEntries).to.equal(1);

      expect(cache.get("0/0")).to.be.undefined;
      expect(cache.get("0/1")).to.be.undefined;
      expect(cache.get("1/0")).to.deep.equal(new Uint8Array(1));
    });
  });

  describe("clear", () => {
    test("clears all entries from the cache", () => {
      const cache = setupClearTest();

      cache.clear();

      expect(cache.size).to.equal(0);
      expect(cache.numberOfEntries).to.equal(0);

      expect(cache.get("0/0")).to.be.undefined;
      expect(cache.get("0/1")).to.be.undefined;
      expect(cache.get("1/0")).to.be.undefined;
    });
  });
});

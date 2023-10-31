import { Vector3 } from "three";

// The following two very similar types are kept separate because we may later want to allow more
// complex queries with respect to scale, e.g. "get the largest available scale within this range"
export type DataArrayExtent = {
  chunk: Vector3;
  scale: number;
  time: number;
  channel: number;
};

export type QueryExtent = {
  chunk: Vector3;
  scale: number;
  time: number;
};

type MaybeCacheEntry = CacheEntry | null;
type CacheEntry = {
  /** The data contained in this entry */
  data: ArrayBuffer;
  /** The coordinates of the volume chunk covered by this entry */
  chunk: Vector3;
  /** The previous entry in the LRU list (more recently used) */
  prev: MaybeCacheEntry;
  /** The next entry in the LRU list (less recently used) */
  next: MaybeCacheEntry;
  /** The array which contains this entry */
  parentArr: CacheEntry[];
};

type CacheStoreMultiscaleLevel = {
  // Entries are indexed by T and C, then stored in lists of ZYX chunks
  data: CacheEntry[][][];
  size: Vector3;
};

export type CacheStore = {
  scales: CacheStoreMultiscaleLevel[];
  numTimes: number;
  numChannels: number;
};

/** Default: 250MB. Should be large enough to be useful but safe for most any computer that can run the app */
const CACHE_MAX_SIZE_DEFAULT = 250_000_000;

export default class VolumeCache {
  public readonly maxSize: number;
  private currentSize: number;
  private currentEntries: number;

  // Ends of a linked list of entries, to track LRU and evict efficiently
  private first: MaybeCacheEntry;
  private last: MaybeCacheEntry;
  // TODO implement some way to manage used vs unused (prefetched) entries so
  // that prefetched entries which are never used don't get highest priority!

  constructor(maxSize = CACHE_MAX_SIZE_DEFAULT) {
    this.maxSize = maxSize;
    this.currentSize = 0;
    this.currentEntries = 0;

    this.first = null;
    this.last = null;
  }

  // Hide these behind getters so they're definitely never set from the outside
  /** The size of all data arrays currently stored in this cache, in bytes */
  public get size() {
    return this.currentSize;
  }

  /** The number of entries currently stored in this cache */
  public get numberOfEntries() {
    return this.currentEntries;
  }

  /**
   * Removes an entry from a volume but NOT the LRU list.
   * Only call from a method with the word "evict" in it!
   */
  private removeEntryFromStore(entry: CacheEntry): void {
    entry.parentArr.splice(entry.parentArr.indexOf(entry), 1);
    this.currentSize -= entry.data.byteLength;
    this.currentEntries--;
  }

  /**
   * Removes an entry from the LRU list but NOT its volume.
   * Entry must be replaced in list or removed from volume, or it will never be evicted!
   */
  private removeEntryFromList(entry: CacheEntry): void {
    const { prev, next } = entry;

    if (prev) {
      prev.next = next;
    } else {
      this.first = next;
    }

    if (next) {
      next.prev = prev;
    } else {
      this.last = prev;
    }
  }

  /** Adds an entry which is *not currently in the list* to the front of the list */
  private addEntryAsFirst(entry: CacheEntry): void {
    if (this.first) {
      this.first.prev = entry;
    } else {
      this.last = entry;
    }
    entry.next = this.first;
    entry.prev = null;
    this.first = entry;
  }

  /** Moves an entry which is *currently in the list* to the front of the list */
  private moveEntryToFirst(entry: CacheEntry): void {
    if (entry === this.first) return;
    this.removeEntryFromList(entry);
    this.addEntryAsFirst(entry);
  }

  /** Evicts the least recently used entry from the cache */
  private evictLast(): void {
    if (!this.last) {
      console.error("VolumeCache: attempt to evict last entry from cache when no last entry is set");
      return;
    }

    this.removeEntryFromStore(this.last);

    if (this.last.prev) {
      this.last.prev.next = null;
    }
    this.last = this.last.prev;
  }

  /** Evicts a specific entry from the cache */
  private evict(entry: CacheEntry): void {
    this.removeEntryFromStore(entry);
    this.removeEntryFromList(entry);
  }

  /**
   * Prepares a new cached volume with the specified channels, times, and scales.
   * @returns {CacheStore} A container for cache entries for this volume.
   * A `CacheStore` may only be accessed or modified by passing it to this class's methods.
   */
  public addVolume(numChannels: number, numTimes: number, scaleDims: Vector3[]): CacheStore {
    const makeTCArray = (): CacheEntry[][][] => {
      const tArr: CacheEntry[][][] = [];
      for (let i = 0; i < numTimes; i++) {
        const cArr: CacheEntry[][] = [];
        for (let j = 0; j < numChannels; j++) {
          cArr.push([]);
        }
        tArr.push(cArr);
      }
      return tArr;
    };

    const scales = scaleDims.map((size): CacheStoreMultiscaleLevel => ({ size, data: makeTCArray() }));
    return { scales, numTimes, numChannels };
  }

  /**
   * Add a new array to the cache (representing a subset of a channel's extent at a given time and scale)
   * @returns {boolean} a boolean indicating whether the insertion succeeded
   */
  public insert(volume: CacheStore, data: ArrayBuffer, optDims: Partial<DataArrayExtent> = {}): boolean {
    const scaleCache = volume.scales[optDims.scale || 0];
    const entryList = scaleCache.data[optDims.time || 0][optDims.channel || 0];
    const chunk = optDims.chunk ?? new Vector3(0, 0, 0);
    const { size } = scaleCache;

    if (chunk.x < 0 || chunk.y < 0 || chunk.z < 0 || chunk.x >= size.x || chunk.y >= size.y || chunk.z >= size.z) {
      console.error("VolumeCache: attempt to insert into nonexistent chunk");
      return false;
    }
    if (data.byteLength > this.maxSize) {
      console.error("VolumeCache: attempt to insert a single entry larger than the cache");
      return false;
    }

    // Check if entry is already in cache
    for (const existingEntry of entryList) {
      if (existingEntry.chunk.equals(chunk)) {
        existingEntry.data = data;
        this.moveEntryToFirst(existingEntry);
        return true;
      }
    }

    // Add new entry to cache
    const newEntry: CacheEntry = { data, chunk, prev: null, next: null, parentArr: entryList };
    this.addEntryAsFirst(newEntry);
    entryList.push(newEntry);
    this.currentSize += data.byteLength;
    this.currentEntries++;

    // Evict until size is within limit
    while (this.currentSize > this.maxSize) {
      this.evictLast();
    }
    return true;
  }

  /** Attempt to get a single entry from the cache. */
  private get(volume: CacheStore, channel: number, optDims: Partial<QueryExtent> = {}): ArrayBuffer | undefined {
    // TODO allow searching through a range of scales and picking the highest available one
    const scaleCache = volume.scales[optDims.scale || 0];
    const entryList = scaleCache.data[optDims.time || 0][channel];
    const chunk = optDims.chunk ?? new Vector3(0, 0, 0);

    for (const entry of entryList) {
      if (entry.chunk.equals(chunk)) {
        this.moveEntryToFirst(entry);
        return entry.data;
      }
    }

    return undefined;
  }

  /** Clears data associated with one volume from the cache */
  public clearVolume(volume: CacheStore): void {
    volume.scales.forEach((scale) => {
      scale.data.forEach((time) => {
        time.forEach((channel) => {
          channel.forEach((entry) => {
            this.evict(entry);
          });
        });
      });
    });
  }

  /** Clears all data from the cache */
  public clear(): void {
    while (this.last) {
      this.evictLast();
    }
  }
}

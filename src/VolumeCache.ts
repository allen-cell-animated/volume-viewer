type XYZ<T> = { x: T; y: T; z: T };
export type VolumeScaleDims = XYZ<number>;
type CacheEntryExtent = XYZ<[number, number]>;

export type DataArrayExtent = CacheEntryExtent & {
  time: number;
  channel: number;
};

export type QueryExtent = CacheEntryExtent & {
  scale: number;
  time: number;
};

type CacheEntry = {
  /** The data contained in this entry */
  data: Uint8Array;
  /** The subset of the volume covered by this entry */
  size: CacheEntryExtent;
  /** The previous entry in the LRU list */
  prev: MaybeCacheEntry;
  /** The next entry in the LRU list */
  next: MaybeCacheEntry;
  /** The array which contains this entry */
  parentArr: CacheEntry[];
};
type MaybeCacheEntry = CacheEntry | null;

type VolumeCacheScale = {
  // Entries are indexed by T and C, then stored in lists of ZYX subsets
  data: CacheEntry[][][];
  size: VolumeScaleDims;
};

type CachedVolume = {
  scales: VolumeCacheScale[];
  times: number;
  channels: number;
};

const extentIsEqual = (a: CacheEntryExtent, b: CacheEntryExtent): boolean => {
  return (
    a.x[0] === b.x[0] &&
    a.x[1] === b.x[1] &&
    a.y[0] === b.y[0] &&
    a.y[1] === b.y[1] &&
    a.z[0] === b.z[0] &&
    a.z[1] === b.z[1]
  );
};

// TODO if this is not well used, don't keep it!
const removeFromArray = <T>(arr: T[], el: T): T => arr.splice(arr.indexOf(el), 1)[0];

export default class VolumeCache {
  private store: CachedVolume[];
  private readonly maxSize: number;
  private currentSize: number;

  // TODO implement some way to manage used vs unused (prefetched) entries so
  // that prefetched entries which are never used don't get highest priority!

  // Ends of a linked list of entries, to track LRU and evict efficiently
  private first: MaybeCacheEntry;
  private last: MaybeCacheEntry;

  constructor(maxSize = 1_000_000) {
    this.maxSize = maxSize;
    this.currentSize = 0;
    this.store = [];

    this.first = null;
    this.last = null;
  }

  /**
   * Removes an entry from its store but NOT the LRU list.
   * Only call from a method with the word "evict" in it!
   */
  private removeEntryFromStore(entry: CacheEntry): void {
    removeFromArray(entry.parentArr, entry);
    this.currentSize -= entry.data.length;
  }

  /**
   * Remvoes an entry from the LRU list but NOT its store.
   * Entry must be replaced in list or removed from store, or it will never be evicted!
   */
  private removeEntryFromList(entry: CacheEntry): void {
    const { prev, next } = entry;

    if (prev) {
      prev.next = next;
    } else {
      this.last = next;
    }

    if (next) {
      next.prev = prev;
    } else {
      this.first = prev;
    }
  }

  /** Adds an entry which is *not currently in the list* to the front of the list */
  private addEntryAsFirst(entry: CacheEntry): void {
    if (this.first) {
      this.first.next = entry;
    } else {
      this.last = entry;
    }
    entry.prev = this.first;
    entry.next = null;
    this.first = entry;
  }

  /** Evicts the least recently used entry from the cache */
  private evictLast(): void {
    if (!this.last) {
      console.error("Attempt to evict last frame from cache when no last frame has been set");
      return;
    }

    if (this.last.next) {
      this.last.next.prev = null;
    }

    this.removeEntryFromStore(this.last);
    this.last = this.last.next;
  }

  /** Evicts a specific entry from the cache */
  // TODO use this to smartly evict redundant data from TCStore
  // @ts-ignore unused method
  private evict(entry: CacheEntry): void {
    this.removeEntryFromStore(entry);
    this.removeEntryFromList(entry);
  }

  private moveEntryToFirst(entry: CacheEntry): void {
    if (entry === this.first) return;
    this.removeEntryFromList(entry);
    this.addEntryAsFirst(entry);
  }

  public addVolume(times: number, channels: number, scaleDims: VolumeScaleDims[]): number {
    const makeTCArray = (): CacheEntry[][][] => {
      const arr: CacheEntry[][][] = [];
      for (let i = 0; i < times; i++) {
        arr.push(Array(channels).fill([]));
      }
      return arr;
    };

    const scales = scaleDims.map((size): VolumeCacheScale => ({ size, data: makeTCArray() }));
    this.store.push({ scales, times, channels });
    return this.store.length - 1;
  }

  public insert(volume: number, scale: number, data: Uint8Array, optDims?: Partial<DataArrayExtent>): void {
    const scaleCache = this.store[volume].scales[scale];
    // Apply defaults to `optDims`
    const {
      time = 0,
      channel = 0,
      z = [0, scaleCache.size.z],
      y = [0, scaleCache.size.y],
      x = [0, scaleCache.size.x],
    } = optDims || {};
    const entryList = scaleCache.data[time][channel];
    const size: CacheEntryExtent = { z, y, x };

    // TODO validate size of array is equal to extent?
    // TODO validate size of array is not larger than cache on its own

    // Check if entry is already in cache
    for (const existingEntry of entryList) {
      if (extentIsEqual(existingEntry.size, size)) {
        existingEntry.data = data;
        this.moveEntryToFirst(existingEntry);
        return;
      }
    }

    // Add new entry to cache
    const newEntry: CacheEntry = { data, size, prev: null, next: null, parentArr: entryList };
    this.addEntryAsFirst(newEntry);
    entryList.push(newEntry);
    this.currentSize += data.length;

    // Evict until size is within limit
    while (this.currentSize > this.maxSize) {
      this.evictLast();
    }
  }

  private getOneChannel(volume: number, channel: number, optDims?: Partial<QueryExtent>): Uint8Array | undefined {
    // TODO allow searching through a range of scales and picking the highest available one
    const scale = optDims?.scale || 0;
    const scaleCache = this.store[volume].scales[scale];
    // Apply defaults to `optDims`
    const {
      time = 0,
      z = [0, scaleCache.size.z],
      y = [0, scaleCache.size.y],
      x = [0, scaleCache.size.x],
    } = optDims || {};
    const entryList = scaleCache.data[time][channel];
    const size: CacheEntryExtent = { z, y, x };

    for (const entry of entryList) {
      if (extentIsEqual(entry.size, size)) {
        return entry.data;
      }
    }

    return undefined;
  }

  public get(volume: number, channel: number, optDims?: Partial<QueryExtent>): Uint8Array | undefined;
  public get(volume: number, channel: number[], optDims?: Partial<QueryExtent>): (Uint8Array | undefined)[];
  public get(volume: number, optDims?: Partial<QueryExtent>): (Uint8Array | undefined)[];
  public get(
    volume: number,
    channel?: number | number[] | Partial<QueryExtent>,
    optDims?: Partial<QueryExtent>
  ): Uint8Array | undefined | (Uint8Array | undefined)[] {
    if (typeof channel === "object" || channel === undefined) {
      // TODO is this the right spot to look for channel size?
      const channelKeys = [...Array(this.store[volume].channels).keys()];
      return channelKeys.map((c) => this.getOneChannel(volume, c, optDims));
    }

    if (Array.isArray(channel)) {
      return channel.map((c) => this.getOneChannel(volume, c, optDims));
    }

    return this.getOneChannel(volume, channel, optDims);
  }
}

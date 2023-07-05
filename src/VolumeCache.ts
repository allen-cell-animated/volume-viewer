type XYZ<T> = { x: T; y: T; z: T };
type CacheEntryExtent = XYZ<[number, number]>;
export type VolumeScaleDims = XYZ<number>;

// The following two very similar types are kept separate because we may later want to allow more
// complex queries with respect to scale, e.g. "get the largest available scale within this range"
export type DataArrayExtent = CacheEntryExtent & {
  scale: number;
  time: number;
  channel: number;
};

export type QueryExtent = CacheEntryExtent & {
  scale: number;
  time: number;
};

type MaybeCacheEntry = CacheEntry | null;
type CacheEntry = {
  /** The data contained in this entry */
  // TODO allow more types of `TypedArray` to be stored together in the cache?
  data: Uint8Array;
  /** The subset of the volume covered by this entry */
  extent: CacheEntryExtent;
  /** The previous entry in the LRU list */
  prev: MaybeCacheEntry;
  /** The next entry in the LRU list */
  next: MaybeCacheEntry;
  /** The array which contains this entry */
  parentArr: CacheEntry[];
};

type VolumeCacheScale = {
  // Entries are indexed by T and C, then stored in lists of ZYX subsets
  data: CacheEntry[][][];
  size: VolumeScaleDims;
};

export type CachedVolume = {
  scales: VolumeCacheScale[];
  numTimes: number;
  numChannels: number;
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

// Extent ranges are inclusive on both ends
const dimSize = ([min, max]: [number, number]): number => max + 1 - min;
const extentVolume = ({ x, y, z }: CacheEntryExtent): number => dimSize(x) * dimSize(y) * dimSize(z);
const dimInvalid = ([min, max]: [number, number]): boolean => min > max;
const extentIsInvalid = ({ x, y, z }: CacheEntryExtent): boolean => dimInvalid(x) || dimInvalid(y) || dimInvalid(z);
const validExtentIsOutsideDims = (ext: CacheEntryExtent, dims: VolumeScaleDims): boolean =>
  ext.x[1] >= dims.x || ext.y[1] >= dims.y || ext.z[1] >= dims.z;

export default class VolumeCache {
  public readonly maxSize: number;
  private currentSize: number;
  private currentEntries: number;

  // Ends of a linked list of entries, to track LRU and evict efficiently
  private first: MaybeCacheEntry;
  private last: MaybeCacheEntry;
  // TODO implement some way to manage used vs unused (prefetched) entries so
  // that prefetched entries which are never used don't get highest priority!

  constructor(maxSize = 250_000_000) {
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
    this.currentSize -= entry.data.length;
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
  // TODO use this to intelligently evict redundant data
  private evict(entry: CacheEntry): void {
    this.removeEntryFromStore(entry);
    this.removeEntryFromList(entry);
  }

  /**
   * Prepares a new cached volume with the specified channels, times, and scales.
   * @returns {number} a unique ID which identifies the volume when interacting with it in the cache.
   */
  public addVolume(numChannels: number, numTimes: number, scaleDims: VolumeScaleDims[]): CachedVolume {
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

    const scales = scaleDims.map((size): VolumeCacheScale => ({ size, data: makeTCArray() }));
    return { scales, numTimes, numChannels };
  }

  /**
   * Add a new array to the cache (representing a subset of a channel's extent at a given time and scale)
   * @returns {boolean} a boolean indicating whether the insertion succeeded
   */
  public insert(volume: CachedVolume, data: Uint8Array, optDims?: Partial<DataArrayExtent>): boolean {
    const scale = optDims?.scale || 0;
    const scaleCache = volume.scales[scale];
    // Apply defaults to `optDims`
    const {
      time = 0,
      channel = 0,
      z = [0, scaleCache.size.z - 1],
      y = [0, scaleCache.size.y - 1],
      x = [0, scaleCache.size.x - 1],
    } = optDims || {};
    const entryList = scaleCache.data[time][channel];
    const extent: CacheEntryExtent = { z, y, x };

    // Validate input
    if (extentVolume(extent) !== data.length) {
      console.error("VolumeCache: attempt to insert data which does not match the provided dimensions");
      return false;
    }
    if (extentIsInvalid(extent) || validExtentIsOutsideDims(extent, scaleCache.size)) {
      console.error("VolumeCache: attempt to insert data with bad extent");
      return false;
    }
    if (data.length > this.maxSize) {
      console.error("VolumeCache: attempt to insert a single entry larger than the cache");
      return false;
    }

    // Check if entry is already in cache
    for (const existingEntry of entryList) {
      if (extentIsEqual(existingEntry.extent, extent)) {
        existingEntry.data = data;
        this.moveEntryToFirst(existingEntry);
        return true;
      }
    }

    // Add new entry to cache
    const newEntry: CacheEntry = { data, extent, prev: null, next: null, parentArr: entryList };
    this.addEntryAsFirst(newEntry);
    entryList.push(newEntry);
    this.currentSize += data.length;
    this.currentEntries++;

    // Evict until size is within limit
    while (this.currentSize > this.maxSize) {
      this.evictLast();
    }
    return true;
  }

  /**
   * Attempts to get data from a single channel. Internal implementation of `get`,
   * which is overloaded to call this in different patterns.
   */
  private getOneChannel(volume: CachedVolume, channel: number, optDims?: Partial<QueryExtent>): Uint8Array | undefined {
    // TODO allow searching through a range of scales and picking the highest available one
    const scale = optDims?.scale || 0;
    const scaleCache = volume.scales[scale];
    // Apply defaults to `optDims`
    const {
      time = 0,
      z = [0, scaleCache.size.z - 1],
      y = [0, scaleCache.size.y - 1],
      x = [0, scaleCache.size.x - 1],
    } = optDims || {};
    const entryList = scaleCache.data[time][channel];
    const size: CacheEntryExtent = { z, y, x };

    for (const entry of entryList) {
      if (extentIsEqual(entry.extent, size)) {
        this.moveEntryToFirst(entry);
        return entry.data;
      }
    }

    return undefined;
  }

  /** Attempts to get data from a single channel of a cached volume. Returns `undefined` if not present in the cache. */
  public get(volume: CachedVolume, channel: number, optDims?: Partial<QueryExtent>): Uint8Array | undefined;
  /** Attempts to get data from multiple channels of a volume. Channels not present in the cache are `undefined`. */
  public get(volume: CachedVolume, channel: number[], optDims?: Partial<QueryExtent>): (Uint8Array | undefined)[];
  /** Attempts to get all channels of a volume from the cache. Channels not present in the cache are `undefined`. */
  public get(volume: CachedVolume, optDims?: Partial<QueryExtent>): (Uint8Array | undefined)[];
  public get(
    volume: CachedVolume,
    channel?: number | number[] | Partial<QueryExtent>,
    optDims?: Partial<QueryExtent>
  ): Uint8Array | undefined | (Uint8Array | undefined)[] {
    if (Array.isArray(channel)) {
      return channel.map((c) => this.getOneChannel(volume, c, optDims));
    }

    if (typeof channel === "object" || channel === undefined) {
      const channelKeys = [...Array(volume.numChannels).keys()];
      return channelKeys.map((c) => this.getOneChannel(volume, c, channel));
    }

    return this.getOneChannel(volume, channel, optDims);
  }

  /** Clears data associated with one volume from the cache */
  public clearVolume(volume: CachedVolume): void {
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

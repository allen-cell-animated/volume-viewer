type Nullable<T> = T | null;

type CacheEntry = {
  data: Uint8Array;
  parentTCStore: CacheTCStore;
  z: number;
  y: number;
  x: number;
  prev: Nullable<CacheEntry>;
  next: Nullable<CacheEntry>;
};

type CacheTCStore = {
  data: CacheEntry[];
  parentScale: VolumeCacheScale;
  t: number;
  c: number;
};

type VolumeScaleDims = {
  t: number;
  c: number;
  z: number;
  y: number;
  x: number;
};

type VolumeCacheScale = {
  // Entries are indexed by T and C, then stored in lists of ZYX subsets
  data: Nullable<CacheTCStore>[][];
  size: VolumeScaleDims;
};
type CachedVolume = VolumeCacheScale[];

// TODO if this is not well used, don't keep it!
const removeFromArray = <T>(arr: T[], el: T): T => arr.splice(arr.indexOf(el), 1)[0];

export default class VolumeCache {
  private data: CachedVolume[];
  private readonly maxSize: number;
  private currentSize: number;

  // TODO implement some way to manage used vs unused (prefetched) entries
  // so that prefetched entries which are never used don't get priority!
  private first: Nullable<CacheEntry>;
  private last: Nullable<CacheEntry>;

  constructor(maxSize = 1_000_000) {
    this.maxSize = maxSize;
    this.currentSize = 0;
    this.data = [];

    this.first = null;
    this.last = null;
  }

  /**
   * Removes an entry from its store but NOT the LRU list.
   * Only call from a method with the word "evict" in it!
   */
  private removeEntryFromStore(entry: CacheEntry): void {
    removeFromArray(entry.parentTCStore.data, entry);
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
  private setEntryAsFirst(entry: CacheEntry): void {
    if (this.first) {
      this.first.next = entry;
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
  private evict(entry: CacheEntry): void {
    this.removeEntryFromStore(entry);
    this.removeEntryFromList(entry);
  }

  private moveEntryToFirst(entry: CacheEntry): void {
    this.removeEntryFromList(entry);
    this.setEntryAsFirst(entry);
  }

  public addVolume(scales: VolumeScaleDims[]): number {
    const makeTCArray = ({ t, c }: VolumeScaleDims): null[][] => {
      const arr: null[][] = [];
      for (let i = 0; i < t; i++) {
        arr.push(new Array(c).fill(null));
      }
      return arr;
    };
    this.data.push(scales.map((size): VolumeCacheScale => ({ size, data: makeTCArray(size) })));
    return this.data.length - 1;
  }

  public insert(
    volume: number,
    scale: number,
    data: Uint8Array,
    { t = 0, c = 0, z = 1, y = 1, x = 1 }: Partial<VolumeScaleDims>
  ): void {}
}

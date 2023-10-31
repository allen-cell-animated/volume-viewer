type MaybeCacheEntry = CacheEntry | null;
type CacheEntry = {
  /** The data contained in this entry */
  data: ArrayBuffer;
  /** The previous entry in the LRU list (more recently used) */
  prev: MaybeCacheEntry;
  /** The next entry in the LRU list (less recently used) */
  next: MaybeCacheEntry;
  /** The key which indexes this entry within `parentStore */
  key: string;
};

/** Default: 250MB. Should be large enough to be useful but safe for most any computer that can run the app */
const CACHE_MAX_SIZE_DEFAULT = 250_000_000;

export default class VolumeCache {
  private entries: Map<string, CacheEntry>;

  public readonly maxSize: number;
  private currentSize: number;

  // Ends of a linked list of entries, to track LRU and evict efficiently
  private first: MaybeCacheEntry;
  private last: MaybeCacheEntry;
  // TODO implement some way to manage used vs unused (prefetched) entries so
  // that prefetched entries which are never used don't get highest priority!

  constructor(maxSize = CACHE_MAX_SIZE_DEFAULT) {
    this.entries = new Map();
    this.maxSize = maxSize;
    this.currentSize = 0;

    this.first = null;
    this.last = null;
  }

  // Hide these behind getters so they're definitely never set from the outside
  /** The size of all data arrays currently stored in this cache, in bytes. */
  public get size() {
    return this.currentSize;
  }

  /** The number of entries currently stored in this cache. */
  public get numberOfEntries() {
    return this.entries.size;
  }

  /**
   * Removes an entry from a store but NOT the LRU list.
   * Only call from a method with the word "evict" in it!
   */
  private removeEntryFromStore(entry: CacheEntry): void {
    this.entries.delete(entry.key);
    this.currentSize -= entry.data.byteLength;
  }

  /**
   * Removes an entry from the LRU list but NOT its store.
   * Entry must be replaced in list or removed from store, or it will never be evicted!
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

  /** Adds an entry which is *not currently in the list* to the front of the list. */
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

  /** Moves an entry which is *currently in the list* to the front of the list. */
  private moveEntryToFirst(entry: CacheEntry): void {
    if (entry === this.first) return;
    this.removeEntryFromList(entry);
    this.addEntryAsFirst(entry);
  }

  /** Evicts the least recently used entry from the cache. */
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

  /** Evicts a specific entry from the cache. */
  private evict(entry: CacheEntry): void {
    this.removeEntryFromStore(entry);
    this.removeEntryFromList(entry);
  }

  /**
   * Adds a new entry to the cache.
   * @returns {boolean} a boolean indicating whether the insertion succeeded.
   */
  public insert(key: string, data: ArrayBuffer): boolean {
    if (data.byteLength > this.maxSize) {
      console.error("VolumeCache: attempt to insert a single entry larger than the cache");
      return false;
    }

    // Check if entry is already in cache
    // This will move the entry to the front of the LRU list, if present
    const getResult = this.getEntry(key);
    if (getResult !== undefined) {
      getResult.data = data;
      return true;
    }

    // Add new entry to cache
    const newEntry: CacheEntry = { data, prev: null, next: null, key };
    this.addEntryAsFirst(newEntry);
    this.entries.set(key, newEntry);
    this.currentSize += data.byteLength;

    // Evict until size is within limit
    while (this.currentSize > this.maxSize) {
      this.evictLast();
    }
    return true;
  }

  /** Internal implementation of `get`. Returns all entry metadata, not just the raw data. */
  private getEntry(key: string): CacheEntry | undefined {
    const result = this.entries.get(key);
    if (result) {
      this.moveEntryToFirst(result);
    }
    return result;
  }

  /** Attempts to get a single entry from the cache. */
  public get(key: string): ArrayBuffer | undefined {
    return this.getEntry(key)?.data;
  }

  /** Clears all cache entries whose keys begin with the specified prefix. */
  public clearWithPrefix(prefix: string): void {
    for (const [key, entry] of this.entries.entries()) {
      if (key.startsWith(prefix)) {
        this.evict(entry);
      }
    }
  }

  /** Clears all data from the cache. */
  public clear(): void {
    while (this.last) {
      this.evictLast();
    }
  }
}

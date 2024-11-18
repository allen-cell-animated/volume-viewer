import { FetchStore } from "@zarrita/storage";
import { AbsolutePath, AsyncMutable, Readable } from "@zarrita/storage";

import SubscribableRequestQueue from "../../utils/SubscribableRequestQueue";
import VolumeCache from "../../VolumeCache";

import { SubscriberId } from "./types";

type WrappedStoreOpts<Opts> = {
  options?: Opts;
  subscriber: SubscriberId;
  reportKey?: (key: string, subscriber: SubscriberId) => void;
  isPrefetch?: boolean;
};

/**
 * `Readable` is zarrita's minimal abstraction for any source of data.
 * `WrappedStore` wraps another `Readable` and adds (optional) connections to `VolumeCache` and `RequestQueue`.
 */
class WrappedStore<Opts, S extends Readable<Opts> = Readable<Opts>> implements AsyncMutable<WrappedStoreOpts<Opts>> {
  constructor(private baseStore: S, private cache?: VolumeCache, private queue?: SubscribableRequestQueue) {}
  // Dummy implementation to make this class easier to use in tests
  set(_key: AbsolutePath, _value: Uint8Array): Promise<void> {
    return Promise.resolve();
  }

  private async getAndCache(key: AbsolutePath, cacheKey: string, opts?: Opts): Promise<Uint8Array | undefined> {
    const result = await this.baseStore.get(key, opts);
    if (this.cache && result) {
      this.cache.insert(cacheKey, result);
    }
    return result;
  }

  async get(key: AbsolutePath, opts?: WrappedStoreOpts<Opts> | undefined): Promise<Uint8Array | undefined> {
    const ZARR_EXTS = [".zarray", ".zgroup", ".zattrs", "zarr.json"];
    if (!this.cache || ZARR_EXTS.some((s) => key.endsWith(s))) {
      return this.baseStore.get(key, opts?.options);
    }
    if (opts?.reportKey) {
      opts.reportKey(key, opts.subscriber);
    }

    let keyPrefix = (this.baseStore as FetchStore).url ?? "";
    if (keyPrefix !== "" && !(keyPrefix instanceof URL) && !keyPrefix.endsWith("/")) {
      keyPrefix += "/";
    }

    const fullKey = keyPrefix + key.slice(1);

    // Check the cache
    const cacheResult = this.cache.get(fullKey);
    if (cacheResult) {
      return new Uint8Array(cacheResult);
    }

    // Not in cache; load the chunk and cache it
    if (this.queue && opts) {
      return this.queue.addRequest(
        fullKey,
        opts.subscriber,
        () => this.getAndCache(key, fullKey, opts?.options),
        opts.isPrefetch
      );
    } else {
      // Should we ever hit this code?  We should always have a request queue.
      return this.getAndCache(key, fullKey, opts?.options);
    }
  }
}

export default WrappedStore;

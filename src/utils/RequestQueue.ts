import Volume from "../Volume";
import { IVolumeLoader, LoadSpec } from "../loaders/IVolumeLoader";
import { StringifyingMap } from "./StringifyingMap";

// TODO: Revive cancelled requests, if the operations being run have not finished yet.

class JSONStringifyingMap<V> extends StringifyingMap<any, V> {
    protected stringifyKey(key: any): string {
        return JSON.stringify(key);
    }
}

export type RequestItem<T> = {
    key: any;
    requestIssuer: () => Promise<T>;
};

interface QueueItem<T> {
    // Key used to index this queue item
    key: any;
    // this is the actual task and the T is the return type
    action: () => Promise<T>;
    // value is of promise's type
    resolve: (value?: T | PromiseLike<T> | undefined) => void;
    // reason is really any
    reject: (reason?: unknown) => void;
}

export default class RequestQueue {
    // TODO: Consider limit for number of requests that can be operated on at once
    // TODO: Consider adding staggering for tasks (timeout for how they get added to this ^)
    // VolumeLoader calling .addRequest? -> write a new fake VolumeLoader :)
    //    .getDataVolume() => .addRequest()
    //    How does this change VolumeLoader?
    //    How does this integrate with cache?

    /** The maximum number of requests that can be inflight at once.
    Additional requests will be queued up to run after.*/
    private maxActiveRequests: number;

    private queue: QueueItem<any>[];

    /** Stores all requests, even those that are currently active. */
    private pendingRequests: JSONStringifyingMap<Promise<any>>;
    /** Stores requests that are currently processing. */
    private activeRequests: JSONStringifyingMap<Promise<any>>;

    constructor(maxActiveRequests = 10) {
        this.pendingRequests = new JSONStringifyingMap();
        this.activeRequests = new JSONStringifyingMap();
        this.queue = [];
        this.maxActiveRequests = maxActiveRequests;
    }

    /**
     * Adds a request with a unique key to the queue, if it doesn't already exist.
     * @param key The key used to track the request. Keys will be compared using JSON.stringify(). 
     * @param requestIssuer Function that should be called to complete the request. The function
     * will be called only once per unique key, and may be deferred at any time.
     * @returns A promise that will resolve on completion of the request.
     * TODO: Does this fail if you use the same key for different return types?
     */
    public async addRequest<T>(key: any, requestIssuer: () => Promise<T>): Promise<T> {
        if (!this.pendingRequests.has(key)) {  // First time we are adding this request, so do loadAction
            // Create a new promise, deferring the request action until 
            const promise = new Promise<T>((resolve, reject) => {
                this.queue.push({
                    key,
                    action: requestIssuer,
                    resolve,
                    reject
                });
                this.dequeue();  // Check to see if we can run a task.
            })
            // Store the request promise.
            this.pendingRequests.set(key, promise);
        }
        return this.pendingRequests.get(key);
    }

    public async addRequests<T>(requests: RequestItem<T>[], delayMs = 10) {
        let delay = 0;
        // TODO
    }

    /**
     * Attempts to remove and run the next queued request item, if resources are available.
     * @returns true if a request was started, or false if there are too many
     * requests already active.
     */
    private dequeue(): boolean {
        if (this.activeRequests.size() >= this.maxActiveRequests) {
            return false;
        }
        const requestItem = this.queue.shift();
        if (!requestItem){
            return false;  // Can't clean up request data because it doesn't exist.
        }
        try {
            // Mark that this request is active
            const promise = this.pendingRequests.get(requestItem)!;
            this.activeRequests.set(requestItem.key, promise);

            // Run the task
            requestItem.action().then((value) => {
                requestItem.resolve(value);
                // Clean up the item
                this.activeRequests.delete(requestItem.key);
                this.dequeue();
            }).catch((err) => {
                requestItem.reject(err);
                this.dequeue();
            })
        } catch (err) {
            requestItem.reject(err);
            this.dequeue();
        }
        return true;
    }

    public cancelRequest(loadSpec: LoadSpec) {

    }

    public cancelAllRequests(): void {

    }
}

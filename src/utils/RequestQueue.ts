import { LoadSpec } from "../loaders/IVolumeLoader";

// TODO: Revive cancelled requests, if the operations being run have not finished yet.

// Type used when making multiple requests.
export type Request<K, V> = {
    key: K;
    requestAction: () => Promise<V>;
};

interface QueueItem<V> {
    /** Key used to index this queue item. */
    key: string;
    /** Action to be run. */
    action: () => Promise<V>;
    /** Reference to the promise object that will be resolved when the action is complete. */
    promise: Promise<V>;
    // value is of promise's type
    resolve: (value?: V | PromiseLike<V> | undefined) => void;
    // reason is really any
    reject: (reason?: unknown) => void;
    /** Optional, used to track timeouts when the item will be added to the queue later. */
    timeoutId?: NodeJS.Timeout;
}

/**
 * Manages a queue of asynchronous requests with unique keys, which can be added to or cancelled.
 * If redundant requests with the same key are issued, the request action will only be run once per key
 * while the original request is still in the queue.
 */
export default class RequestQueue<K> {
    // TODO: Consider limit for number of requests that can be operated on at once
    // TODO: Consider adding staggering for tasks (timeout for how they get added to this ^)
    // VolumeLoader calling .addRequest? -> write a new fake VolumeLoader :)
    //    .getDataVolume() => .addRequest()
    //    How does this change VolumeLoader?
    //    How does this integrate with cache?

    /** The maximum number of requests that can be handled concurently.
    Additional requests will be queued up to run when a running request completes.*/
    private maxActiveRequests: number;

    private queue: string[];

    /** Stores all requests, even those that are currently active. */
    private allRequests: Map<string, QueueItem<any>>;
    /** Stores requests that are currently processing. */
    private activeRequests: Set<string>;

    /** Used to convert keys into a string identifier. Can be overridden in constructor. */
    private keyStringifyFn: (key: K) => string;

    /**
     * Creates a new RequestQueue.
     * @param keyStringifyFn Function used to turn the key type into a string identifier. By default, uses JSON.stringify.
     * @param maxActiveRequests The maximum number of requests that will be handled concurrently. This is 10 by default.
     */
    constructor(keyStringifyFn = (key: K) => JSON.stringify(key), maxActiveRequests = 10) {
        this.allRequests = new Map();
        this.activeRequests = new Set();
        this.queue = [];
        this.maxActiveRequests = maxActiveRequests;
        this.keyStringifyFn = keyStringifyFn;
    }

    /**
     * Stores request metadata to the internal map of all pending requests.
     * @param keyString string identifier of the request.
     * @param requestAction callable function action of the request.
     * @returns the promise of the request, to be resolved later.
     */
    private registerRequest<T>(keyString: string, requestAction: () => Promise<T>): Promise<T> {
        // Create a new promise and store the resolve and reject callbacks for later.
        // This lets us perform the actual action at a later point, when the request is ready to be
        // processed.
        let promiseResolve, promiseReject;
        const promise = new Promise<T>((resolve, reject) => {
            promiseResolve = resolve;
            promiseReject = reject;
        });
        // Store the request data.
        this.allRequests.set(keyString, {
            key: keyString,
            action: requestAction,
            resolve: promiseResolve,
            reject: promiseReject,
            promise,
        });
        return promise;
    }

    /**
     * Adds a request with a unique key to the queue, if it doesn't already exist.
     * @param key The key used to track the request. Keys will be compared using JSON.stringify(). 
     * @param requestAction Function that will be called to complete the request. The function
     *  will be run only once per unique key while the request exists, and may be deferred by the
     *  queue at any time.
     * @returns A promise that will resolve on completion of the request. If multiple requests are issued
     *  with the same key, the same promise will be returned until request is resolved or cancelled.
     */
    public addRequest<T>(key: K, requestAction: () => Promise<T>): Promise<T> {
        const keyString = this.keyStringifyFn(key);
        if (!this.allRequests.has(keyString)) {  // New request!
            const promise = this.registerRequest(keyString, requestAction);
            this.queue.push(keyString);
            this.dequeue();  // Check if we can run a task.
        }
        // TODO: Possible type error if addRequest is called with the same key on two different issuer return types?
        return this.allRequests.get(keyString)?.promise!;
    }

    /**
     * Adds multiple requests to the queue, with an optional delay between each.
     * @param requests An array of RequestItems, which include a key and a request action.
     * @param delayMs An optional delay in milliseconds to be added between each request.
     *  For example, a delay of 10 ms will cause the second request to be added to the queue
     *  after 10 ms, the third to added after 20 ms, and so on. Set to 10 ms by default. 
     * @returns 
     */
    public addRequests<T>(requests: Request<K, T>[], delayMs = 10): Promise<T>[] {
        const promises: Promise<T>[] = [];
        // TODO
        for (let i = 0; i < requests.length; i++) {
            const item = requests[i];
            const keyString = this.keyStringifyFn(item.key);
            if (this.allRequests.has(keyString)) {
                // Existing request
                promises.push(this.allRequests.get(keyString)?.promise!);
            } else {
                // Add this request to our map of all requests, but don't add to queue until after delay.
                const promise = this.registerRequest(keyString, item.requestAction);
                promises.push(promise);
                const timeoutId = setTimeout(() => {
                    this.queue.push(keyString);
                    this.dequeue();  // Check if we can run a task.
                }, delayMs * i);
                // Store the timeoutId to the request metadata in case we need to cancel this task later.
                const requestData = this.allRequests.get(keyString)!;
                requestData.timeoutId = timeoutId;
            }
            promises.push(
                
            );
        }
        return promises;
    }

    /**
     * Attempts to remove and run the next queued request item, if resources are available.
     * @returns true if a request was started, or false if there are too many
     * requests already active.
     */
    private dequeue(): boolean {
        if (this.activeRequests.values.length >= this.maxActiveRequests
            || this.queue.length === 0) {
            return false;
        }
        const requestKey = this.queue.shift();
        if (!requestKey){
            return false;
        }
        const requestItem = this.allRequests.get(requestKey);
        if (!requestItem) {
            return false;
        }

        const keyString = requestItem.key;
        try {
            // Mark that this request is active
            this.activeRequests.add(keyString);

            // Run the task
            requestItem.action().then((value) => {
                requestItem.resolve(value);
                // Clean up the item
                this.activeRequests.delete(keyString);
                this.allRequests.delete(keyString);
                this.dequeue();
            }).catch((err) => {
                this.activeRequests.delete(keyString);
                this.allRequests.delete(keyString);
                requestItem.reject(err);
                this.dequeue();
            })
        } catch (err) {
            this.activeRequests.delete(keyString);
            this.allRequests.delete(keyString);
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

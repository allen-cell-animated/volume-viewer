// TODO: Revive cancelled requests, if the operations being run have not finished yet.

// Type used when making multiple requests.
export type Request<K, V> = {
    key: K;
    requestAction: () => Promise<V>;
};

export const DEFAULT_REQUEST_CANCEL_REASON = "request cancelled";

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
    // VolumeLoader calling .addRequest? -> write a new fake VolumeLoader :)
    //    .getDataVolume() => .addRequest()
    //    How does this change VolumeLoader?
    //    How does this integrate with cache?

    /** The maximum number of requests that can be handled concurently.
    Once reached, additional requests will be queued up to run once a running request completes.*/
    private maxActiveRequests: number;

    /** A queue of requests that are ready to be executed, in order of request time. */
    private queue: string[];

    /** Stores all requests, even those that are currently active. */
    private allRequests: Map<string, QueueItem<unknown>>;

    /** Stores requests whose actions are currently being run. */
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
     * @param key The key used to track the request. Keys will be compared using the stringify function provided
     *  in the constructor.
     * @param requestAction Function that will be called to complete the request. The function
     *  will be run only once per unique key while the request exists, and may be deferred by the
     *  queue at any time.
     * 
     * NOTE: Cancelling a request while the action is running WILL NOT stop the action. Actions are responsible
     * for checking the RequestQueue, determining if the request is still valid, and stopping if this is desired
     * behavior.
     * 
     * @returns A promise that will resolve on completion of the request. If multiple requests are issued
     *  with the same key, a promise for the first request will be returned until the request is resolved or cancelled.
     *  Note that the return type of the promise will match that of the first request's instance.
     */
    public addRequest<T>(key: K, requestAction: () => Promise<T>): Promise<unknown> {
        const keyString = this.keyStringifyFn(key);
        if (!this.allRequests.has(keyString)) {  // New request!
            this.registerRequest(keyString, requestAction);
            this.queue.push(keyString);
            this.dequeue();  // Check if we can run a task.
        }
        const promise = this.allRequests.get(keyString)?.promise;
        if (!promise) {
            throw new Error("Found no promise to return when getting stored request data.");
        }
        return promise;

        // TODO: If request is known but is on a timeout, cancel the timeout and add to queue
    }

    /**
     * Adds multiple requests to the queue, with an optional delay between each.
     * @param requests An array of RequestItems, which include a key and a request action.
     * @param delayMs An optional delay in milliseconds to be added between each request.
     *  For example, a delay of 10 ms will cause the second request to be added to the queue
     *  after 10 ms, the third to added after 20 ms, and so on. Set to 10 ms by default. 
     * @returns An array of promises corresponding to the provided requests. (i.e., the `i`th value
     * of the returned array will be a Promise for the resolution of `requests[i]`). If a request
     *  with a matching key is already pending, returns the promise for the initial request.
     */
    public addRequests<T>(requests: Request<K, T>[], delayMs = 10): Promise<unknown>[] {
        const promises: Promise<unknown>[] = [];
        // TODO
        for (let i = 0; i < requests.length; i++) {
            const item = requests[i];
            const keyString = this.keyStringifyFn(item.key);
            if (this.allRequests.has(keyString)) {
                // Existing request
                const promise = this.allRequests.get(keyString)?.promise;
                if (!promise) {
                    throw new Error("Promise reference was not found in request metadata when expected.");
                }
                promises.push(promise);
            } else {
                // Add this request to our map of all requests, but don't add to queue until after delay.
                const promise = this.registerRequest(keyString, item.requestAction);
                promises.push(promise);
                const timeoutId = setTimeout(() => {
                    this.queue.push(keyString);
                    this.dequeue();  // Check if we can run a task.
                }, delayMs * i);
                // Store the timeoutId to the request metadata in case we need to cancel this task later.
                const requestData = this.allRequests.get(keyString);
                if (requestData) {
                    requestData.timeoutId = timeoutId;
                }
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
        if (this.activeRequests.size >= this.maxActiveRequests
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

    /**
     * Finds and deletes all requests with the matching keyString from internal state, and rejects the request
     * for the provided cancellation reason.
     */
    private cancelRequestByKeyString(keyString: string, cancelReason: unknown): void {
        if (!this.allRequests.has(keyString)) {
            return;
        }
        const requestItem = this.allRequests.get(keyString);
        if (requestItem) {
            if (requestItem.timeoutId) {   // Cancel requests that have not been queued yet.
                clearTimeout(requestItem.timeoutId);
            }
            // Reject the request, then clear from the queue and known requests.
            requestItem.reject(cancelReason);
        }
        this.queue = this.queue.filter(key => key !== keyString);
        this.allRequests.delete(keyString);
        this.activeRequests.delete(keyString);
    }

    /**
     * Removes any request matching the provided key from the queue and rejects its promise. 
     * @param key The key that should be matched against, using the stringify function provided in
     *  the RequestQueue constructor.
     * @param cancelReason A message or object that will be used as the promise rejection.
     */
    public cancelRequest(key: K, cancelReason: unknown = DEFAULT_REQUEST_CANCEL_REASON): void {
        this.cancelRequestByKeyString(this.keyStringifyFn(key), cancelReason);
    }

    /**
     * Rejects all request promises and clears the queue.
     * @param cancelReason A message or object that will be used as the promise rejection.
     */
    public cancelAllRequests(cancelReason: unknown = DEFAULT_REQUEST_CANCEL_REASON): void {
        this.queue = [];  // Clear the queue so we don't do extra work while filtering it
        for (const keyString of this.allRequests.keys()) {
            this.cancelRequestByKeyString(keyString, cancelReason);
        }
    }

    /**
     * Returns whether a request with the given key exists in the RequestQueue and is not cancelled.
     * @param key the key to search for.
     * @returns true if the request is in the RequestQueue, or false 
     */
    public hasRequest(key: K): boolean {
        return this.allRequests.has(this.keyStringifyFn(key));
    }
}

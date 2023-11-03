import RequestQueue from "./RequestQueue";

type Resolver = (value?: any) => void;
type Rejecter = (reason?: unknown) => void;

type RequestSubscription = {
  subscriberId: number;
  resolve: Resolver;
  reject: Rejecter;
};

export default class SubscribableRequestQueue {
  private queue: RequestQueue;

  private subscriberIds: number;
  /** "Reject" functions, keyed by subscriber ID *and* request key */
  private subscribers: Map<number, Map<string, Rejecter>>;
  /** "Resolve" functions, keyed by request key only */
  private requests: Map<string, RequestSubscription[]>;

  constructor(maxActiveRequests?: number) {
    this.queue = new RequestQueue(maxActiveRequests);
    this.subscriberIds = 0;
    this.subscribers = new Map();
    this.requests = new Map();
  }

  private resolveAll(key: string, value: any) {
    const requests = this.requests.get(key);
    if (requests) {
      for (const { resolve, subscriberId } of requests) {
        resolve(value);
        this.subscribers.get(subscriberId)?.delete(key);
      }
      this.requests.delete(key);
    }
  }

  private rejectAll(key: string, reason: unknown) {
    const requests = this.requests.get(key);
    if (requests) {
      for (const { reject, subscriberId } of requests) {
        reject(reason);
        this.subscribers.get(subscriberId)?.delete(key);
      }
      this.requests.delete(key);
    }
  }

  addSubscriber(): number {
    const subscriberId = this.subscriberIds;
    this.subscriberIds++;
    this.subscribers.set(subscriberId, new Map());
    return subscriberId;
  }

  addRequestToQueue<T>(
    key: string,
    subscriberId: number,
    requestAction: () => Promise<T>,
    delayMs?: number
  ): Promise<T> {
    // Create single underlying request if it does not yet exist
    if (!this.queue.hasRequest(key)) {
      this.queue
        .addRequest(key, requestAction, delayMs)
        .then((value) => this.resolveAll(key, value))
        .catch((reason) => this.rejectAll(key, reason));
    }
    if (!this.requests.has(key)) {
      this.requests.set(key, []);
    }

    // Validate subscriber
    if (subscriberId >= this.subscriberIds || subscriberId < 0) {
      throw new Error(`SubscribableRequestQueue: subscriber id ${subscriberId} has not been registered`);
    }
    if (!this.subscribers.has(subscriberId)) {
      throw new Error(`SubscribableRequestQueue: subscriber id ${subscriberId} has been removed`);
    }

    // Create promise and add to list of requests
    return new Promise<T>((resolve, reject) => {
      this.requests.get(key)?.push({ resolve, reject, subscriberId });
      this.subscribers.get(subscriberId)?.set(key, reject);
    });
  }

  private rejectSubscription(key: string, reject: Rejecter, cancelReason?: unknown) {
    // Reject the outer "subscription" promise
    reject(cancelReason);

    // Remove this request subscription by ref equality to `reject` (though we don't need to after rejecting it above)
    const subscriptions = this.requests.get(key);
    if (!subscriptions) {
      // This should never happen
      return;
    }
    const idx = subscriptions.findIndex((sub) => sub.reject === reject);
    if (idx >= 0) {
      subscriptions.splice(idx, 1);
    }

    // Remove the underlying request if there are no more subscribers and the request is not running
    if (subscriptions.length < 1 && !this.queue.requestRunning(key)) {
      this.queue.cancelRequest(key, cancelReason);
      this.requests.delete(key);
    }
  }

  cancelRequest(key: string, subscriberId: number, cancelReason?: unknown) {
    const reject = this.subscribers.get(subscriberId)?.get(key);
    if (reject) {
      this.rejectSubscription(key, reject, cancelReason);
    }
  }

  removeSubscriber(subscriberId: number, cancelReason?: unknown) {
    const subscriptions = this.subscribers.get(subscriberId);
    if (subscriptions) {
      for (const [key, reject] of subscriptions.entries()) {
        this.rejectSubscription(key, reject, cancelReason);
      }
    }
    this.subscribers.delete(subscriberId);
  }
}

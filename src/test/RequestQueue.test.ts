import { expect } from "chai";

import RequestQueue from "../utils/RequestQueue";
import { LoadSpec } from "../loaders/IVolumeLoader";

/**
 * Returns a promise that resolves once the timeout (give in ms) is completed.
*/
async function sleep(timeoutMs: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, timeoutMs));
}

describe("test RequestQueue", () => {
    it ("can issue one request", async () => {
        const rq = new RequestQueue();
        const loadSpec = new LoadSpec();
        let actionIsRun = false;
        rq.addRequest(loadSpec, async () => {
            // do something
            await sleep(10);
            actionIsRun = true;
            return null;
        });
        expect(rq.hasRequest(loadSpec)).to.be.true;
        await sleep (15);
        expect(actionIsRun).to.be.true;
        expect(rq.hasRequest(loadSpec)).to.be.false;
    });

    it ("only runs request once", async () => {
        const rq = new RequestQueue();
        const loadSpec = new LoadSpec();
        let count = 0;
        const promises: Promise<any>[] = [];
        const work = async () => {
            await sleep(100);
            count++;
        }
        promises.push(rq.addRequest(loadSpec, work));
        promises.push(rq.addRequest(loadSpec, work));
        await Promise.all(promises);
        expect(count).to.equal(1);
    });

    // Test that same promise is returned

    it ("handles identical key objects", async () => {
        const rq = new RequestQueue();
        const loadSpec1 = new LoadSpec();
        const loadSpec2 = new LoadSpec();

        let count = 0;
        const promises: Promise<any>[] = [];
        const work = async () => {
            await sleep(100);
            count++;
        }
        const promise1 = rq.addRequest(loadSpec1, work);
        const promise2 = rq.addRequest(loadSpec2, work);
        // Check that the promises are the same instance
        expect(promise1).to.deep.equal(promise2);
        promises.push(promise1);
        promises.push(promise2);
        await Promise.all(promises);
        expect(count).to.equal(1);
    });

    it ("handles multiple concurrent requests", async () => {
        const rq = new RequestQueue();
        const array = [false, false, false, false, false];
        const promises: Promise<any>[] = [];
        for (let i = 0; i < array.length; i++) {
            const work = async () => {
                await sleep(10);
                array[i] = true;
            }
            promises.push(rq.addRequest(i, work));
        }
        await Promise.all(promises);
        for (let i = 0; i < array.length; i++) {
            expect(array[i]).to.be.true;
        }
    });

    it ("completes all tasks sequentially when max requests is set", async () => {
        const rq = new RequestQueue(JSON.stringify, 1);
        const startTime = Date.now();
        const iterations = 5;
        const delayMs = 5;
        let counter: number[] = [];

        const promises: Promise<any>[] = [];
        for (let i = 0; i < iterations; i++) {
            const work = async () => {
                await sleep(delayMs);
                counter.push(i);
            }
            promises.push(rq.addRequest(i, work));
        }
        await Promise.all(promises);

        // Should run only one task at a time, so time should be
        // at LEAST the timeout * number of tasks
        const duration = Date.now() - startTime;
        expect(duration).to.be.greaterThan(delayMs * iterations);
    
        // Tasks should execute in sequential order, all tasks should run.
        for (let i = 0; i < iterations; i++) {
            expect(counter[i]).to.equal(i);
        }
    });

    it ("handles failing request actions", () => {

    });

    it ("handles sequential requests", async () => {
        const rq = new RequestQueue();
        let count = 0;
        const work = async () => {
            count++;
        }
        await rq.addRequest(0, work);
        expect(count).to.equal(1);
        await sleep(10);
        await rq.addRequest(0, work);
        expect(count).to.equal(2);
    });

    it ("can cancel a request", async () => {
        const rq = new RequestQueue();
        let count = 0;
        const work = async (key) => {
            await sleep(10);
            // Computation steps that should NOT be run when
            // a request is cancelled must be nested in a check for
            // validity of the current request
            if (rq.hasRequest(key)) {
                count++;
            }
        }
        const promise = rq.addRequest(0, () => work(0));
        rq.cancelRequest(0);

        let didReject = false;
        await promise.catch((err) => {
            didReject = true;
        });

        await sleep(10);

        expect(count).to.equal(0);
        expect(didReject).to.be.true;
        expect(rq.hasRequest(0)).to.be.false;
    });

    it ("does not resolve cancelled requests", async () => {
        const rq = new RequestQueue();
        const work = async () => {
            await sleep (10);
            throw new Error("some error message");
        }

        const promise = rq.addRequest(0, work);
        const cancelReason = "test cancel";
        rq.cancelRequest(0, cancelReason);

        await promise.catch((err) => {
            expect(err).to.equal(cancelReason);
        });
        await sleep(15);
        // Check that no unexpected error is thrown and that the rejection
        // reason does not change.
        await promise.catch((err) => {
            expect(err).to.equal(cancelReason);
        });
    });

    it ("can cancel all requests", async () => {
        const rq = new RequestQueue(JSON.stringify, 1);
        const iterations = 5;
        let counter: number[] = [];

        const promises: Promise<any>[] = [];
        for (let i = 0; i < iterations; i++) {
            const work = async () => {
                await sleep(10);
                if (rq.hasRequest(i)) {
                    counter.push(i);
                }
            }
            promises.push(rq.addRequest(i, work));
        }
        rq.cancelAllRequests();
        await Promise.all(promises);
        

    });

    // request implementation
    // request setTimeout, then try cancelling some or all of them
    /**
     * USE CASES:
     * 1. Requesting large amount of data (write mock requests)
     *   - ex: requesting 20 z-slices ahead of our current time,
     *     different t and same z-value for loadspec.
     *   - Some mock worker that returns typed array of some size
     *     (x by y size of fake volume) after a given delay
     * 2. Move to a new time from an existing one
     *   - Make a bunch of existing requests
     *   - Cancel all in-flight requests, make 20 new ones
     *   - Are base assumptions true after cancellation?
     * 
     */
});

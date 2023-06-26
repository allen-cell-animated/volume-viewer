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
    it ("can issue one request", () => {
        const rq = new RequestQueue();
        const loadSpec = new LoadSpec();
        let actionIsRun = false;
        rq.addRequest(loadSpec, async () => {
            // do something
            actionIsRun = true;
            return null;
        });
        expect(actionIsRun).to.be.true;
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
        const delayMs = 10;
        let count = 0;
        const promises: Promise<any>[] = [];
        for (let i = 0; i < iterations; i++) {
            const work = async () => {
                await sleep(delayMs);
                count++;
            }
            promises.push(rq.addRequest(i, work));
        }
        await Promise.all(promises);
        const duration = Date.now() - startTime;
        expect(duration).to.be.greaterThan(delayMs * iterations);
        expect(count).to.equal(iterations);
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

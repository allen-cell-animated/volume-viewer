import { expect } from "chai";

import RequestQueue, { Request } from "../utils/RequestQueue";
import { LoadSpec } from "../loaders/IVolumeLoader";
import { TypedArray } from "zarr";

/**
 * Returns a promise that resolves once the timeout (give in ms) is completed.
*/
async function sleep(timeoutMs: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, timeoutMs));
}

describe("test RequestQueue", () => {
    describe("adding requests", () => {

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
            const promises: Promise<unknown>[] = [];
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
            const promises: Promise<unknown>[] = [];
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
            const promises: Promise<unknown>[] = [];
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
            const counter: number[] = [];
            
            const promises: Promise<unknown>[] = [];
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
        
        it ("handles failing request actions", async () => {
            const maxActiveRequests = 10;
            const rq = new RequestQueue(JSON.stringify, maxActiveRequests);
            const iterations = maxActiveRequests * 10;
            
            const promises: Promise<unknown>[] = [];
            for (let i = 0; i < iterations; i++) {
                promises.push(rq.addRequest(i, async () => {
                    await sleep(5);
                    throw new Error("Test error (should be caught)");
                }));
            }
            await Promise.allSettled(promises).catch((_) => {return;});
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

        it ("ignores different promise return types.", async () => {
            const rq = new RequestQueue();
            const promise1 = rq.addRequest(0, async () => {
                await sleep(10);
                return "5";
            });
            const promise2 = rq.addRequest(0, async () => { 
                await sleep(10);
                return 5;
            });
            
            expect(promise1).to.equal(promise2);
            promise1.then((value) => {
                expect(value).to.be.a("string").and.to.equal("5");
            });
            promise2.then((value) => {
                expect(value).to.be.a("string").and.to.equal("5");
            });
        });

        it ("immediately queues delayed requests when re-requesting", async () => {
            const rq = new RequestQueue();
            let count = 0;
            const work = async () => {
                count++;
                return;
            }

            const requests: Request<number, void>[] = [{key: 0, requestAction: work}, {key: 1, requestAction: work}];
            const start = Date.now();
            const promises = rq.addRequests(requests, 1000);
            rq.addRequest(1, work); // requesting this again should remove the delay
            await Promise.allSettled(promises);
            expect(Date.now() - start).to.be.lessThan(1000);    
            expect(count).to.equal(2);
        });
    });

    describe("cancelling requests", () => {
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
        await promise.catch((_) => {
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
        const iterations = 10;
        let count = 0;
        const rejectionReason = "test reject";
        
        const promises: Promise<unknown>[] = [];
        for (let i = 0; i < iterations; i++) {
            const work = async () => {
                await sleep(10);
                if (rq.hasRequest(i)) {
                    count++;
                }
            }
            promises.push(rq.addRequest(i, work));
        }
        rq.cancelAllRequests(rejectionReason);
        // Use allSettled so it does not stop on a rejection
        await Promise.allSettled(promises).then((results) =>
        results.forEach((result) => {
            expect(result.status).to.equal("rejected");
            if (result.status === "rejected") {
                expect(result.reason).to.equal(rejectionReason);
            }
        }));
        await sleep(10);
        expect(count).to.equal(0);
    });
    
    async function mockLoader(loadSpec: LoadSpec, maxDelayMs = 10.0): Promise<TypedArray> {
        const x = loadSpec.maxx - loadSpec.minx;
        const y = loadSpec.maxy - loadSpec.miny;
        const z = loadSpec.maxz - loadSpec.minz;
        const data = new Uint8Array(x * y * z);
        const delayMs = Math.random() * maxDelayMs;
        
        await sleep(delayMs);
        return data;
    }    
    
    /**
     * Creates an array of requests where the keys are Loadspecs with the given dimensions and range, and the
     * requestAction is a mock loader that creates typed arrays after a random duration.
    */
   function getLoadSpecRequests<T>(startingFrame: number, frames: number, xDim: number, yDim: number, action: (LoadSpec) => Promise<T>): Request<LoadSpec, T>[] {
       const requests: Request<LoadSpec, T>[] = [];
       for (let i = startingFrame; i < startingFrame + frames; i++) {
           const loadSpec = new LoadSpec();
           loadSpec.minx = 0;
           loadSpec.maxx = xDim;
           loadSpec.miny = 0;
           loadSpec.maxy = yDim;
           loadSpec.minz = i;
           loadSpec.maxz = i + 1;
           
           requests.push({
               key: loadSpec,
               requestAction: () => {return action(loadSpec)}
            });
        }
        return requests;
    }
    
    it ("can issue and cancel mock loadspec requests", async () => {
        const rq = new RequestQueue(JSON.stringify, 1);
        const xDim = 400;
        const yDim = 600;
        const numFrames = 30;
        let workCount = 0;

        const action = async (loadSpec: LoadSpec) => {
            // Check if the work we were going to do has been cancelled.
            if(rq.hasRequest(loadSpec)) {
                workCount++;
                return await mockLoader(loadSpec);
            }
            return null;
        }
        
        let requests = getLoadSpecRequests(0, numFrames, xDim, yDim, action);
        let promises = rq.addRequests(requests);
        sleep(5);
        rq.cancelAllRequests();
        
        // Reissue overlapping requests
        requests = getLoadSpecRequests(60, numFrames, xDim, yDim, action);
        promises = rq.addRequests(requests);
        await Promise.all(promises);
        
        // Verify promise return types and dimensions
        let promiseCount = 0;
        for (const promise of promises) {
            await promise.then((value) => {
                promiseCount++;
                expect(value).to.be.a("Uint8Array");
                expect(value).to.be.instanceOf(Uint8Array);
                if (value instanceof Uint8Array) {
                    expect(value.buffer.byteLength).to.equal(xDim * yDim);
                } else {
                    throw new Error("Value is not a Uint8Array");
                }
            });
        }
        expect(promiseCount).to.equal(numFrames);
        // Expect some of the work to be cancelled correctly.
        expect(workCount).to.be.lessThan(2 * numFrames).and.greaterThanOrEqual(numFrames);
    });
    

});
});

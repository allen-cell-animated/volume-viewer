import { expect } from "chai";

import RequestQueue from "../RequestQueue";
import { LoadSpec } from "../loaders/IVolumeLoader";

describe("test requestqueue", () => {
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

    it ("only runs request once", () => {
        const rq = new RequestQueue();
        const loadSpec = new LoadSpec();
        let count = 0;
        rq.addRequest(loadSpec, async () => {
            // do something
            count++;
            return null;
        });
        rq.addRequest(loadSpec, async () => {
            // do something
            count++;
            return null;
        });
        expect(count).to.equal(1);
    });

    it ("handles duplicate identical load specs", () => {
        const rq = new RequestQueue();
        const loadSpec1 = new LoadSpec();
        const loadSpec2 = new LoadSpec();

        let count = 0;
        rq.addRequest(loadSpec1, async () => {
            // do something
            count++;
            return null;
        });
        rq.addRequest(loadSpec2, async () => {
            // do something
            count++;
            return null;
        });
        expect(count).to.equal(1);
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

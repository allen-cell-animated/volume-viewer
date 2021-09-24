import { DataTexture, LuminanceFormat, UnsignedByteType, ClampToEdgeWrapping } from "three";
import { LinearFilter } from "three/src/constants";

import Channel from "./Channel.js";

interface FuseChannel {
  chIndex: number;
  lut: [];
  rgbColor: [number, number, number];
}

// This is the owner of the fused RGBA volume texture atlas, and the mask texture atlas.
// This module is responsible for updating the fused texture, given the read-only volume channel data.
export default class FusedChannelData {
  private width: number;
  private height: number;
  private fused: Uint8Array;
  private fusedTexture: DataTexture;
  private maskTexture: DataTexture;

  private maskChannelLoaded: boolean;
  private maskChannelIndex: number;

  private useSingleThread: boolean;
  private fuseWorkersWorking: number;
  private isFusing: boolean;
  private workers: Worker[];
  private workersCount: number;

  private fuseRequested: FuseChannel[] | null;
  private fuseMethodRequested: string;
  private channelsDataToFuse: Channel[];

  constructor(atlasX: number, atlasY: number) {
    // allow for resizing
    this.width = atlasX;
    this.height = atlasY;

    // cpu memory buffer with the combined rgba texture atlas for display
    this.fused = new Uint8Array(this.width * this.height * 4);

    // webgl texture with the rgba texture atlas for display
    this.fusedTexture = new DataTexture(this.fused, this.width, this.height);
    this.fusedTexture.generateMipmaps = false;
    this.fusedTexture.magFilter = LinearFilter;
    this.fusedTexture.minFilter = LinearFilter;
    this.fusedTexture.wrapS = ClampToEdgeWrapping;
    this.fusedTexture.wrapT = ClampToEdgeWrapping;

    this.maskTexture = new DataTexture(
      new Uint8Array(this.width * this.height),
      this.width,
      this.height,
      LuminanceFormat,
      UnsignedByteType
    );
    this.maskTexture.generateMipmaps = false;
    this.maskTexture.magFilter = LinearFilter;
    this.maskTexture.minFilter = LinearFilter;
    this.maskTexture.wrapS = ClampToEdgeWrapping;
    this.maskTexture.wrapT = ClampToEdgeWrapping;
    // for single-channel tightly packed array data:
    this.maskTexture.unpackAlignment = 1;

    this.maskChannelLoaded = false;
    this.maskChannelIndex = 0;

    // force single threaded use even if webworkers are available
    this.useSingleThread = false;

    // thread control
    this.fuseWorkersWorking = 0;
    this.isFusing = false;
    this.fuseRequested = null;
    this.fuseMethodRequested = "";
    this.channelsDataToFuse = [];

    this.workers = [];
    this.workersCount = 0;
    this.setupWorkers();
  }

  static onFuseComplete(): void {
    // no op
  }

  static setOnFuseComplete(onFuseComplete: () => void): void {
    FusedChannelData.onFuseComplete = onFuseComplete;
  }

  public cleanup(): void {
    if (this.workers && this.workers.length > 0) {
      for (let i = 0; i < this.workers.length; ++i) {
        this.workers[i].onmessage = null;
        this.workers[i].terminate();
      }
    }
    this.workers = [];
    this.workersCount = 0;

    this.fusedTexture.dispose();
    this.maskTexture.dispose();
  }

  private setupWorkers(): void {
    if (this.useSingleThread || !window.Worker) {
      this.workersCount = 0;
      return;
    }
    // We will break up the image into one piece for each web-worker
    // can we assert that npx is a perfect multiple of workersCount??
    const npx = this.height * this.width;
    this.workersCount = 4;
    this.fuseWorkersWorking = 0;
    //  var segmentLength = npx / workersCount; // This is the length of array sent to the worker
    //  var blockSize = this.height / workersCount; // Height of the picture chunk for every worker

    // Function called when a job is finished
    const me = this;
    const onWorkEnded = function (e) {
      me.fuseWorkersWorking++;
      // copy e.data.data into fused
      me.fused.set(e.data.data, Math.floor(e.data.workerindex * (npx / me.workersCount)) * 4);
      if (me.fuseWorkersWorking === me.workersCount) {
        me.fusedTexture.image = { data: me.fused, width: me.width, height: me.height };
        me.fusedTexture.needsUpdate = true;
        me.fuseWorkersWorking = 0;
        if (FusedChannelData.onFuseComplete) {
          FusedChannelData.onFuseComplete();
        }

        // if there are any fusion requests in queue, execute the next one now.
        me.isFusing = false;
        if (me.fuseRequested) {
          me.fuse(me.fuseRequested, me.fuseMethodRequested, me.channelsDataToFuse);
        }
        me.fuseRequested = null;
        me.channelsDataToFuse = [];
      }
    };

    this.workers = [];
    for (let index = 0; index < this.workersCount; index++) {
      const worker = new Worker(new URL("./FuseWorker.js", import.meta.url));
      worker.onmessage = onWorkEnded;
      worker.onerror = function (e) {
        alert("Error: Line " + e.lineno + " in " + e.filename + ": " + e.message);
      };
      this.workers.push(worker);
    }
  }

  // batch is array containing which channels were just loaded
  // channels is the array containing the channel data.
  public onChannelLoaded(batch: number[], channels: Channel[]): void {
    if (this.useSingleThread || !window.Worker) {
      return;
    }
    const npx = this.height * this.width;
    // pass channel data to workers
    for (let i = 0; i < this.workersCount; ++i) {
      // hand some global data to the worker
      for (let j = 0; j < batch.length; ++j) {
        const channelIndex = batch[j];
        // chop up the arrays. this is a copy operation!
        const arr = channels[channelIndex].imgData.data.buffer.slice(
          Math.floor(i * (npx / this.workersCount)),
          Math.floor((i + 1) * (npx / this.workersCount) - 1)
        );
        //console.log(arr.byteLength);
        const workerData = {
          msgtype: "channeldata",
          channelindex: channelIndex,
          workerindex: i,
          w: this.width,
          h: this.height,
          data: arr,
        };
        //console.log("POST channeldata worker " + i + ", channel "+ channelIndex);
        // hand the data arrays to each worker. they will assume ownership.
        this.workers[i].postMessage(workerData, [workerData.data]);
      }
    }
  }

  fuse(combination: FuseChannel[], fuseMethod: string, channels: Channel[]): void {
    fuseMethod = fuseMethod || "m";

    // we can fuse if we have any loaded channels that are showing.
    // actually, we can fuse if no channels are showing (but they are loaded), too.
    let canFuse = false;
    for (let i = 0; i < combination.length; ++i) {
      const c = combination[i];
      const idx = c.chIndex;
      if (channels[idx].loaded) {
        // set the lut in this fuse combination.
        // can optimize by calling combineLuts more lazily
        c.lut = channels[idx].combineLuts(c.rgbColor);
        canFuse = true;
        //break;
      }
    }
    if (!canFuse) {
      return;
    }

    // If workers are not supported
    // Perform all calculations in current thread as usual
    if (this.useSingleThread || !window.Worker) {
      // console.log("SINGLE THREADED");
      this.singleThreadedFuse(combination, channels);
      if (FusedChannelData.onFuseComplete) {
        FusedChannelData.onFuseComplete();
      }
      return;
    }

    // Keep a queue of a maximum of 1 fuse request at a time.
    // if 1 fuse is already happening, queue the next one
    // if 1 is queued, replace it with the latest.
    if (this.isFusing) {
      this.fuseRequested = combination;
      this.channelsDataToFuse = channels;
      this.fuseMethodRequested = fuseMethod;
      return;
    }

    // We will break up the image into one piece for each web-worker
    // can we assert that npx is a perfect multiple of workersCount??
    this.fuseWorkersWorking = 0;
    this.isFusing = true;
    //  var segmentLength = npx / workersCount; // This is the length of array sent to the worker
    //  var blockSize = this.height / workersCount; // Height of the picture chunk for every worker

    // Launching every worker
    //console.log("BEGIN FUSE");
    for (let index = 0; index < this.workersCount; index++) {
      this.workers[index].postMessage({
        msgtype: "fuse",
        combination: combination,
        fuseMethod: fuseMethod,
      });
    }
  }

  // sum over [{chIndex, rgbColor}]
  private singleThreadedFuse(combination, channels): void {
    //console.log("BEGIN");

    // explore some faster ways to fuse here...

    let ar, ag, ab, aa, c, lr, lg, lb, la, opacity, channeldata;
    let cx, fx, idx;
    const cl = combination.length;

    const npx4 = this.height * this.width * 4;
    const npx = this.height * this.width;

    const fused = this.fused;
    // init the rgba image
    for (let x = 0; x < npx4; x += 4) {
      fused[x + 0] = 0;
      fused[x + 1] = 0;
      fused[x + 2] = 0;
      fused[x + 3] = 255;
    }
    let value = 0;
    for (let i = 0; i < cl; ++i) {
      c = combination[i];
      idx = c.chIndex;
      if (!channels[idx].loaded) {
        continue;
      }
      if (c.rgbColor) {
        channeldata = channels[idx].imgData.data;
        for (cx = 0, fx = 0; cx < npx; cx += 1, fx += 4) {
          value = channeldata[cx];
          lr = c.lut[value * 4 + 0];
          lg = c.lut[value * 4 + 1];
          lb = c.lut[value * 4 + 2];
          la = c.lut[value * 4 + 3];
          opacity = la / 255.0;

          // what if rgb*opacity > 255?
          ar = fused[fx + 0];
          fused[fx + 0] = Math.max(ar, lr * opacity);
          ag = fused[fx + 1];
          fused[fx + 1] = Math.max(ag, lg * opacity);
          ab = fused[fx + 2];
          fused[fx + 2] = Math.max(ab, lb * opacity);
          aa = fused[fx + 3];
          fused[fx + 3] = Math.max(aa, la);
        }
      }
    }
    // clamp the rgba image: ensure not over 255.
    for (let x = 0; x < npx4; x += 4) {
      fused[x + 0] = Math.min(fused[x + 0], 255);
      fused[x + 1] = Math.min(fused[x + 1], 255);
      fused[x + 2] = Math.min(fused[x + 2], 255);
    }

    this.fusedTexture.image = {
      data: this.fused,
      width: this.width,
      height: this.height,
    };
    this.fusedTexture.needsUpdate = true;

    //console.log("END");
  }

  // currently only one channel can be selected to participate as a mask
  public setChannelAsMask(idx: number, channel: Channel): boolean {
    if (!channel || !channel.loaded) {
      return false;
    }
    const datacopy = channel.imgData.data.buffer.slice(0);
    const maskData = {
      data: new Uint8Array(datacopy),
      width: this.width,
      height: this.height,
    };
    this.maskTexture.image = maskData;
    this.maskTexture.needsUpdate = true;
    this.maskChannelLoaded = true;
    this.maskChannelIndex = idx;
    return true;
  }
}

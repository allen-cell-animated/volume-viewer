import MyWorker from './AICSfuseWorker';

// This is the owner of the fused RGBA volume texture atlas, and the mask texture atlas.
// This module is responsible for updating the fused texture, given the read-only volume channel data.
function AICSchannelData(atlasX, atlasY, redraw) {

  // function to call when image is ready to redraw
  this.redraw = redraw;

  // allow for resizing
  this.width = atlasX;
  this.height = atlasY;

  // cpu memory buffer with the combined rgba texture atlas for display
  this.fused = new Uint8Array(this.width * this.height * 4);

  // webgl texture with the rgba texture atlas for display
  this.fusedTexture = new THREE.DataTexture(this.fused, this.width, this.height);
  this.fusedTexture.generateMipmaps = false;
  this.fusedTexture.magFilter = THREE.LinearFilter;
  this.fusedTexture.minFilter = THREE.LinearFilter;
  this.fusedTexture.wrapS = THREE.ClampToEdgeWrapping;
  this.fusedTexture.wrapT = THREE.ClampToEdgeWrapping;

  this.maskTexture = new THREE.DataTexture(new Uint8Array(this.width * this.height), this.width, this.height, THREE.LuminanceFormat, THREE.UnsignedByteType);
  this.maskTexture.generateMipmaps = false;
  this.maskTexture.magFilter = THREE.LinearFilter;
  this.maskTexture.minFilter = THREE.LinearFilter;
  this.maskTexture.wrapS = THREE.ClampToEdgeWrapping;
  this.maskTexture.wrapT = THREE.ClampToEdgeWrapping;
  // for single-channel tightly packed array data:
  this.maskTexture.unpackAlignment = 1;

  // force single threaded use even if webworkers are available
  this.useSingleThread = false;

  // thread control
  this.fuseWorkersWorking = 0;

  this.setupWorkers();
};

AICSchannelData.prototype.cleanup = function() {
  if (this.workers && this.workers.length > 0) {
    for (var i = 0; i < this.workers.length; ++i) {
      this.workers[i].onmessage = null;
      this.workers[i].terminate();
    }
  }
  this.workers = [];
  this.workersCount = 0;

  this.fusedTexture.dispose();
  this.maskTexture.dispose();

};

AICSchannelData.prototype.setupWorkers = function() {
  if (this.useSingleThread || !window.Worker) {
    this.workersCount = 0;
    return;
  }
  // We will break up the image into one piece for each web-worker
  // can we assert that npx is a perfect multiple of workersCount??
  var npx = this.height*this.width;
  this.workersCount = 4;
  this.fuseWorkersWorking = 0;
  //  var segmentLength = npx / workersCount; // This is the length of array sent to the worker
  //  var blockSize = this.height / workersCount; // Height of the picture chunk for every worker

  // Function called when a job is finished
  var me = this;
  var onWorkEnded = function (e) {
    me.fuseWorkersWorking++;
    // copy e.data.data into fused
    me.fused.set(e.data.data, Math.floor(e.data.workerindex*(npx/me.workersCount))*4);
    if (me.fuseWorkersWorking === me.workersCount) {
      me.fusedData = {data:me.fused, width:me.width, height:me.height};
      me.fusedTexture.image = me.fusedData;
      me.fusedTexture.needsUpdate = true;
      me.fuseWorkersWorking = 0;
      if (me.redraw) {
        me.redraw();
      }

      // if there are any fusion requests in queue, execute the next one now.
      me.isFusing = false;
      if (me.fuseRequested) {
        me.fuse(me.fuseRequested, me.fuseMethodRequested, me.channelsDataToFuse);
      }
      me.fuseRequested = false;
      me.channelsDataToFuse = null;
    }
  };

  this.workers = [];
  for (var index = 0; index < this.workersCount; index++) {
    var worker = new MyWorker();
    worker.onmessage = onWorkEnded;
    worker.onerror = function(e) {
      alert('Error: Line ' + e.lineno + ' in ' + e.filename + ': ' + e.message);
    };
    this.workers.push(worker);
  }
};


// batch is array containing which channels were just loaded
// channels is the array containing the channel data.
AICSchannelData.prototype.onChannelLoaded = function(batch, channels) {
  if (this.useSingleThread || !window.Worker) {
    return;
  }
  var npx = this.height*this.width;
  // pass channel data to workers
  for (var i = 0; i < this.workersCount; ++i) {
    // hand some global data to the worker
    for (var j = 0; j < batch.length; ++j) {
      var channelIndex = batch[j];
      // chop up the arrays. this is a copy operation!
      var arr = channels[channelIndex].imgData.data.buffer.slice(Math.floor(i*(npx/this.workersCount)), Math.floor((i+1)*(npx/this.workersCount) - 1));
      //console.log(arr.byteLength);
      var workerData = {
        msgtype:"channeldata",
        channelindex: channelIndex,
        workerindex: i,
        w: this.width,
        h: this.height,
        data: arr
      };
      //console.log("POST channeldata worker " + i + ", channel "+ channelIndex);
      // hand the data arrays to each worker. they will assume ownership.
      this.workers[i].postMessage(workerData, [workerData.data]);
    }
  }
};

AICSchannelData.prototype.getHistogram = function(channelIndex) {
  return this.channels[channelIndex].imgData ? this.channels[channelIndex].imgData.histogram : [];
};

AICSchannelData.prototype.fuse = function(combination, fuseMethod, channels) {
  fuseMethod = fuseMethod || "m";

  // we can fuse if we have any loaded channels that are showing. 
  var canFuse = false;
  for (var i = 0; i < combination.length; ++i) {
    var c = combination[i];
    var idx = c.chIndex;
    if (c.rgbColor && channels[idx].loaded) {
      // set the lut in this fuse combination.
      c.lut = channels[idx].lut;
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
    if (this.redraw) {
      this.redraw();
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
  for (var index = 0; index < this.workersCount; index++) {
    this.workers[index].postMessage({msgtype: "fuse", combination:combination, fuseMethod:fuseMethod});
  }
};

// sum over [{chIndex, rgbColor}]
AICSchannelData.prototype.singleThreadedFuse = function(combination, channels) {
  //console.log("BEGIN");

  // explore some faster ways to fuse here...

  var ar,ag,ab,c,r,g,b,channeldata;
  var x, i, cx, fx, idx;
  var cl = combination.length;

  var npx4 = this.height*this.width*4;
  var npx = this.height*this.width;

  var fused = this.fused;
  // init the rgba image
  for (x = 0; x < npx4; x+=4) {
    fused[x+0]=0;
    fused[x+1]=0;
    fused[x+2]=0;
    fused[x+3]=255;
  }
  var value = 0;
  for (i = 0; i < cl; ++i) {
    c = combination[i];
    idx = c.chIndex;
    if (!channels[idx].loaded) {
      continue;
    }
    if (c.rgbColor) {
      r = c.rgbColor[0]/255.0;
      g = c.rgbColor[1]/255.0;
      b = c.rgbColor[2]/255.0;
      channeldata = channels[idx].imgData.data;
      for (cx = 0, fx = 0; cx < npx; cx+=1, fx+=4) {
        value = channeldata[cx];
        value = c.lut[value];//this.channels[idx].lut[value];

        ar = fused[fx+0];
        fused[fx + 0] = Math.max(ar, r * value);
        ag = fused[fx+1];
        fused[fx + 1] = Math.max(ag, g * value);
        ab = fused[fx+2];
        fused[fx + 2] = Math.max(ab, b * value);
      }
    }
  }
  // clamp the rgba image: ensure not over 255.
  for (var x = 0; x < npx4; x+=4) {
    fused[x+0]=Math.min(fused[x+0], 255);
    fused[x+1]=Math.min(fused[x+1], 255);
    fused[x+2]=Math.min(fused[x+2], 255);
  }


  this.fusedData = {data:this.fused, width:this.width, height:this.height};
  this.fusedTexture.image = this.fusedData;
  this.fusedTexture.needsUpdate = true;

  //console.log("END");
};

// currently only one channel can be selected to participate as a mask
AICSchannelData.prototype.setChannelAsMask = function(idx, channel) {
  if (!channel || !channel.loaded) {
    return false;
  }
  var datacopy = channel.imgData.data.buffer.slice(0);
  var maskData = {data:new Uint8Array(datacopy), width:this.width, height:this.height};
  this.maskTexture.image = maskData;
  this.maskTexture.needsUpdate = true;
  this.maskChannelLoaded = true;
  this.maskChannelIndex = idx;
  return true;
};

export default AICSchannelData;

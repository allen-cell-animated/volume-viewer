import AICSchannel from './AICSchannel.js';
import MyWorker from './AICSfuseWorker';

function nop() {}

// This is the owner of all channel data (a whole multi channel tiff stack expressed as a series of 8bit texture atlases)
function AICSchannelData(options, redraw) {
  // resize the image by this factor! (depend on device type cpu capabilities?)
  this.scale = 1.0;

  // all the image source info including channel file urls
  this.options = options;

  // function to call when image is ready to redraw
  this.redraw = redraw;

  // track requests made so they can be cleaned up / aborted
  this.requests = {};

  // channel data stored here
  this.channels = [];
  for (var i = 0; i < options.count; ++i) {
    this.channels.push(new AICSchannel(options.channelNames[i]));
  }

  // allow for resizing
  this.width = Math.floor(options.atlasSize[0]*this.scale);
  this.height = Math.floor(options.atlasSize[1]*this.scale);

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

  // callback for batch observer (channel data arrives in sets of 3 packed into rgb of a png file)
  this.onChannelLoadedCallback = nop;
  // callback for all channels loaded
  this.onAllChannelsLoadedCallback = nop;
};

AICSchannelData.prototype.cleanup = function() {
  // try not to call the onload callbacks for requested images
  for (var i in this.requests) {
    this.requests[i].onload = null;
    this.requests[i].src = '';
  }

  if (this.workers && this.workers.length > 0) {
    for (var i = 0; i < this.workers.length; ++i) {
      this.workers[i].onmessage = null;
      this.workers[i].terminate();
    }
  }
  this.workers = [];
  this.workersCount = 0;
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
    //console.log("WORKER ENDED");
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
        me.fuse(me.fuseRequested, me.fuseMethodRequested);
      }
      me.fuseRequested = false;
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

// download channel data
AICSchannelData.prototype.loadBatch = function(url, batch, callback) {
  var me = this;
  // using Image is just a trick to download the bits as a png.
  // the Image will never be used again.
  var img = new Image;
  img.onerror = function() {
    alert("CAN NOT LOAD " + url);
  };
  img.onload = function() {
    //console.log("GOT ch " + me.src);
    // extract pixels by drawing to canvas
    var canvas = document.createElement('canvas');
    // nice thing about this is i can downsample here
    // var w = Math.floor(img.naturalWidth*me.scale);
    // var h = Math.floor(img.naturalHeight*me.scale);
    var w = Math.floor(me.width*me.scale);
    var h = Math.floor(me.height*me.scale);
    canvas.setAttribute('width', w);
    canvas.setAttribute('height', h);
    var ctx = canvas.getContext("2d");
    ctx.globalCompositeOperation = "copy";
    ctx.globalAlpha = 1.0;
    ctx.drawImage(img, 0, 0, w, h);
    // getImageData returns rgba.
    // optimize: collapse rgba to single channel arrays
    var iData = ctx.getImageData(0, 0, w, h);

    var channelsBits = [];
    // allocate channels in batch
    for (var i = 0; i < Math.min(batch.length, 4); ++i) {
      channelsBits.push(new Uint8Array(w*h));
    }
    // extract the data
    for (var i = 0; i < w*h; i++) {
      for (var j = 0; j < Math.min(batch.length, 4); ++j) {
        channelsBits[j][i] = iData.data[i*4+j];
      }
    }

    // done with img, iData, and canvas now.

    for (var i = 0; i < Math.min(batch.length, 4); ++i) {
      me.channels[batch[i]].setBits(channelsBits[i], w, h);
      me.channels[batch[i]].unpackVolume(me.options);
    }

    if (callback) {
      callback.call(me, batch);
    }

    delete me.requests[url];
  };
  img.crossOrigin = 'Anonymous';
  img.src = url;
  this.requests[url] = img;
};

// batch is array containing which channels were just loaded
AICSchannelData.prototype.onChannelLoaded = function(batch) {

  // see if cell shape mask was loaded.
  // DO THIS BEFORE PASSING DATA TO WORKERS
  // TODO: maybe masking can be part of the fuse evaluation on CPU rather than on GPU.
  // would save texture memory and gpu speed!
  for (var j = 0; j < batch.length; ++j) {
    var idx = batch[j];
    var n = this.channels[idx].name;
    // TODO: make channel layout here data-driven. (specify a channel name
    // for the cell mask, such as tag:cell_mask_channel="SEG_Memb")
    if (n === "SEG_Memb") {
      var datacopy = this.channels[idx].imgData.data.buffer.slice(0);
      var maskData = {data:new Uint8Array(datacopy), width:this.width, height:this.height};
      this.maskTexture.image = maskData;
      this.maskTexture.needsUpdate = true;
      this.maskChannelLoaded = true;
      this.maskChannelIndex = idx;
      break;
    }
  }


  var npx = this.height*this.width;
  // pass channel data to workers
  for (var i = 0; i < this.workersCount; ++i) {
    // hand some global data to the worker
    for (var j = 0; j < batch.length; ++j) {
      var channelIndex = batch[j];
      // chop up the arrays. this is a copy operation!
      var arr = this.channels[channelIndex].imgData.data.buffer.slice(Math.floor(i*(npx/this.workersCount)), Math.floor((i+1)*(npx/this.workersCount) - 1));
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

  this.onChannelLoadedCallback(batch);

  // check to see if all channels are now loaded, and fire an event(?)
  if (this.channels.every(function(element,index,array) {return element.loaded;})) {
    this.loaded = true;
    //console.log("END DOWNLOAD DATA");
    this.onAllChannelsLoadedCallback();
  }
};

AICSchannelData.prototype.load = function(onAllChannelsLoaded, onChannelLoaded) {
  this.onChannelLoadedCallback = onChannelLoaded || nop;
  this.onAllChannelsLoadedCallback = onAllChannelsLoaded || nop;


  //console.log("BEGIN DOWNLOAD DATA");
  if (this.options.channelAtlases) {
    var nch = this.options.channelAtlases.length;

    //console.log("BEGIN DOWNLOAD DATA");
    for (var i = 0; i < nch; ++i) {
      this.loadBatch(
        this.options.channelAtlases[i].url,
        this.options.channelAtlases[i].channelIndices,
        this.onChannelLoaded);
    }
  }
  else if (this.options.channelVolumes) {
    // one volume per channel. this is an array of UInt8Arrays and the UInt8Array is a 3d xyz volume!
    for (var i = 0; i < this.options.channelVolumes.length; ++i) {
      this.channels[i].setFromVolumeData(this.options.channelVolumes[i], this.options);
      if (this.onChannelLoaded) {
        this.onChannelLoaded.call(this, [i]);
      }
    }
  }

};

AICSchannelData.prototype.getHistogram = function(channelIndex) {
  return this.channels[channelIndex].imgData ? this.channels[channelIndex].imgData.histogram : [];
};

AICSchannelData.prototype.fuse = function(combination, fuseMethod) {
  fuseMethod = fuseMethod || "m";

  // if none of the channels in the combination are loaded, but the cell mask is, then show the cell mask only.
  var canFuse = false;
  for (var i = 0; i < combination.length; ++i) {
    var c = combination[i];
    var idx = c.chIndex;
    if (c.rgbColor && this.channels[idx].loaded) {
      c.lut = this.channels[idx].lut;
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
    this.singleThreadedFuse(combination);
    return;
  }

  // TODO: keep a queue of a maximum of 1 fuse request at a time.
  // if 1 fuse is already happening, queue the next one
  // if 1 is queued, replace it with the latest.
  if (this.isFusing) {
    this.fuseRequested = combination;
    this.fuseMethodRequested = fuseMethod;
    return;
  }

  // We will break up the image into one piece for each web-worker
  // can we assert that npx is a perfect multiple of workersCount??
  this.fuseWorkersWorking = 0;
  //  var segmentLength = npx / workersCount; // This is the length of array sent to the worker
  //  var blockSize = this.height / workersCount; // Height of the picture chunk for every worker

  // Launching every worker
  //console.log("BEGIN FUSE");
  for (var index = 0; index < this.workersCount; index++) {
    this.workers[index].postMessage({msgtype: "fuse", combination:combination, fuseMethod:fuseMethod});
  }
};

// sum over [{chIndex, rgbColor}]
AICSchannelData.prototype.singleThreadedFuse = function(combination) {
  //console.log("BEGIN");

  // explore some faster ways to fuse here...

  var ar,ag,ab,c,r,g,b,channeldata;
  var x, i, cx, fx;
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
    if (!this.channels[idx].loaded) {
      continue;
    }
    if (c.rgbColor) {
      r = c.rgbColor[0]/255.0;
      g = c.rgbColor[1]/255.0;
      b = c.rgbColor[2]/255.0;
      channeldata = this.channels[idx].imgData.data;
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

export default AICSchannelData;

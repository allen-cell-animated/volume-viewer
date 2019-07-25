var channels = [];
var npx = 0;

// sum over [{chIndex, rgbColor}]
// fusionType = "m" for maximum, "a" for average
function fuseWorker(combination, fusionType) {
  //console.log("BEGIN WORK");
  // explore some faster ways to fuse here...

  var ar,ag,ab,c,r,g,b,channeldata,lut,idx;
  var x, i, cx, fx;
  var cl = combination.length;

  var npx4 = npx*4;

  // init the rgba image
  // var fused4 = new Uint32Array(this.fused.buffer);
  // for (x = 0; x < npx; x+=1) {
  //   fused4[x] = 0xff000000;
  // }
  for (x = 0; x < npx4; x+=4) {
    fused[x+0]=0;
    fused[x+1]=0;
    fused[x+2]=0;
    fused[x+3]=255;
  }
  var value = 0;
  if (fusionType === "m") {
    for (i = 0; i < cl; ++i) {
      c = combination[i];
      idx = c.chIndex;
      if (!channels[idx]) {
        continue;
      }
      if (c.rgbColor) {
        r = c.rgbColor[0]/255.0;
        g = c.rgbColor[1]/255.0;
        b = c.rgbColor[2]/255.0;
        channeldata = channels[idx];
        lut = c.lut;

        for (cx = 0, fx = 0; cx < npx; cx+=1, fx+=4) {
          value = channeldata[cx];
          lr = lut[value*4+0];
          lg = lut[value*4+1];
          lb = lut[value*4+2];
          opacity = lut[value*4+3] / 255.0;

          // what if rgb*opacity > 255?
          ar = fused[fx+0];
          fused[fx + 0] = Math.max(ar, r * lr * opacity);
          ag = fused[fx+1];
          fused[fx + 1] = Math.max(ag, g * lg * opacity);
          ab = fused[fx+2];
          fused[fx + 2] = Math.max(ab, b * lb * opacity);
        }
      }
    }
  }
  else if (fusionType === "a") {
    // count
    var nchans = 0;
    for (i = 0; i < cl; ++i) {
      c = combination[i];
      idx = c.chIndex;
      if (!channels[idx] || !c.rgbColor) {
        continue;
      }
      nchans++;
    }
    for (i = 0; i < cl; ++i) {
      c = combination[i];
      idx = c.chIndex;
      if (!channels[idx] || !c.rgbColor) {
        continue;
      }
      if (c.rgbColor) {
        r = c.rgbColor[0]/255.0;
        g = c.rgbColor[1]/255.0;
        b = c.rgbColor[2]/255.0;
        channeldata = channels[idx];
        lut = c.lut;

        for (cx = 0, fx = 0; cx < npx; cx+=1, fx+=4) {
          value = channeldata[cx];
          lr = lut[value*4+0];
          lg = lut[value*4+1];
          lb = lut[value*4+2];
          opacity = lut[value*4+3] / 255.0;

          // what if rgb*opacity > 255?
          fused[fx + 0] += r * lr * opacity/nchans;
          fused[fx + 1] += g * lg * opacity/nchans;
          fused[fx + 2] += b * lb * opacity/nchans;
        }
      }
    }
  }

  //console.log("END WORK");
};

self.onmessage = function(e) {
  if (e.data.msgtype === "channeldata") {
    channels[e.data.channelindex] = new Uint8Array(e.data.data);
    if (npx === 0) {
      npx = channels[e.data.channelindex].length;
    }
    if (!self.fused) {
      self.fused = new Uint8Array(npx*4);
      self.workerindex = e.data.workerindex;
    }
  }
  else if (e.data.msgtype === "fuse") {
    // we got the starting message!
    fuseWorker(e.data.combination, e.data.fuseMethod);
    // transfer result data back to caller, and tell caller who is reporting back
    var results = {data:self.fused, workerindex:self.workerindex};
    postMessage(results, [results.data.buffer]);
    // reallocate self.fused, now that ownership of the underlying array has been passed back
    self.fused = new Uint8Array(npx*4);
  }
};

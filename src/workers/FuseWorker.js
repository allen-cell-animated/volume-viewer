const channels = [];
let npx = 0;

// sum over [{chIndex, rgbColor}]
// fusionType = "m" for maximum, "a" for average
function fuseWorker(combination, fusionType) {
  console.log("BEGIN fuseWorker WORK");
  // explore some faster ways to fuse here...

  let ar, ag, ab, aa, c, lr, lg, lb, la, opacity, channeldata, lut, idx;
  let i, cx, fx;
  const cl = combination.length;

  // init the rgba image
  self.fused.fill(0);

  let value = 0;
  //  if (fusionType === "m") {
  for (i = 0; i < cl; ++i) {
    c = combination[i];
    idx = c.chIndex;
    if (!channels[idx]) {
      continue;
    }
    if (c.rgbColor) {
      channeldata = channels[idx];
      lut = c.lut;

      for (cx = 0, fx = 0; cx < npx; cx += 1, fx += 4) {
        value = channeldata[cx];
        lr = lut[value * 4 + 0]; // 0..255
        lg = lut[value * 4 + 1]; // 0..255
        lb = lut[value * 4 + 2]; // 0..255
        la = lut[value * 4 + 3]; // 0..255
        opacity = la / 255.0;

        // what if rgb*opacity > 255?
        ar = self.fused[fx + 0];
        self.fused[fx + 0] = Math.max(ar, lr * opacity);
        ag = self.fused[fx + 1];
        self.fused[fx + 1] = Math.max(ag, lg * opacity);
        ab = self.fused[fx + 2];
        self.fused[fx + 2] = Math.max(ab, lb * opacity);
        aa = self.fused[fx + 3];
        self.fused[fx + 3] = Math.max(aa, la);
      }
    }
  }
  /*
  } else if (fusionType === "a") {
    // count
    let nchans = 0;
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
        channeldata = channels[idx];
        lut = c.lut;

        for (cx = 0, fx = 0; cx < npx; cx += 1, fx += 4) {
          value = channeldata[cx];
          lr = lut[value * 4 + 0];
          lg = lut[value * 4 + 1];
          lb = lut[value * 4 + 2];
          la = lut[value * 4 + 3];
          opacity = la / 255.0;

          // what if rgb*opacity > 255?
          self.fused[fx + 0] += (lr * opacity) / nchans;
          self.fused[fx + 1] += (lg * opacity) / nchans;
          self.fused[fx + 2] += (lb * opacity) / nchans;
          self.fused[fx + 3] += la / nchans;
        }
      }
    }
  }
*/
  console.log("END fuseWorker WORK");
}

self.onmessage = function (e) {
  if (e.data.msgtype === "channeldata") {
    channels[e.data.channelindex] = new Uint8Array(e.data.data);
    if (npx === 0) {
      npx = channels[e.data.channelindex].length;
    }
    if (!self.fused) {
      self.fused = new Uint8Array(npx * 4);
      self.workerindex = e.data.workerindex;
    }
  } else if (e.data.msgtype === "fuse") {
    // we got the starting message!
    fuseWorker(e.data.combination, e.data.fuseMethod);
    // transfer result data back to caller, and tell caller who is reporting back
    const results = { data: self.fused, workerindex: self.workerindex };
    postMessage(results, [results.data.buffer]);
    // reallocate self.fused, now that ownership of the underlying array has been passed back
    self.fused = new Uint8Array(npx * 4);
  }
};

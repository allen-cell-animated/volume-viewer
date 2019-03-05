(function() {if (!Math.clamp) { Math.clamp = function(val,cmin,cmax) {return Math.min(Math.max(cmin, val), cmax);};}})();

// assume data is 8 bit single channel grayscale
export default class Histogram {
  constructor(data) {
    // no more than 2^32 pixels of any one intensity in the data!?!?!
    this.bins = new Uint32Array(256);
    this.bins.fill(0);
    this.dataMin = 255;
    this.dataMax = 0;
    this.maxBin = 0;

    // build up the histogram
    for (var i = 0; i < data.length; ++i) {
      this.bins[data[i]]++;
    }
    // track the first and last nonzero bins with at least 1 sample
    for (var i = 1; i < this.bins.length; i++) {
      if (this.bins[i] > 0) {
        this.dataMin = i;
        break;
      }
    }
    for (var i = this.bins.length-1; i >= 1; i--) {
      if (this.bins[i] > 0) {
        this.dataMax = i;
        break;
      }
    }

    // total number of pixels minus the number of zero pixels
    this.nonzeroPixelCount = data.length - this.bins[0];

    // get the bin with the most frequently occurring NONZERO value
    this.maxBin = 1;
    let max = this.bins[1];
    for (var i = 1; i < this.bins.length; i++) {
      if (this.bins[i] > max) {
        this.maxBin = i;
        max = this.bins[i];
      }
    }
  }

  lutGenerator_windowLevel(wnd, lvl) {
    // simple linear mapping for actual range
    var range = wnd * 256;
    var b = lvl*256 - range*0.5;
    var e = lvl*256 + range*0.5;
    return this.lutGenerator_minMax(b, e);
  }

  //  |
  //  |
  // 1|               +---------+-----
  //  |              /
  //  |             /
  //  |            /
  //  |           /
  //  |          /
  // 0+=========+---------------+-----
  //  0         b    e          1
  lutGenerator_minMax(b, e) {
    var lut = new Uint8Array(256);
    let range = e - b;
    if (range < 1) {
      range = 256;
    }
    for (var x = 0; x < lut.length; ++x) {
      lut[x] = Math.clamp((x - b) * 256 / range, 0, 255);
    }
    return {
      lut: lut,
      controlPoints: [
        {x:0, opacity:0},
        {x:b, opacity:0},
        {x:e, opacity:1},
        {x:255, opacity:1}
      ]
    };
  }

  lutGenerator_fullRange() {
    // return a LUT with new values(?)
    // data type of lut values is out_phys_range (uint8)
    // length of lut is number of histogram bins (represents the input data range)
    var lut = new Uint8Array(256);

    // simple linear mapping for actual range
    for (var x = 0; x < lut.length; ++x) {
      lut[x] = x;
    }

    return {
      lut: lut,
      controlPoints: [
        {x:0, opacity:0},
        {x:255, opacity:1}
      ]
    };
  }

  lutGenerator_dataRange() {
    // simple linear mapping for actual range
    var b = this.dataMin;
    var e = this.dataMax;
    return this.lutGenerator_minMax(b, e);
  }

  lutGenerator_percentiles(pmin, pmax) {
    // e.g. 0.50, 0.983 starts from 50th percentile bucket and ends at 98.3 percentile bucket.

    const pixcount = this.nonzeroPixelCount + this.bins[0];
    //const pixcount = this.imgData.data.length;
    const lowlimit = pixcount*pmin;
    const hilimit = pixcount*pmax;

    var i = 0;
    var count = 0;
    for (i = 0; i < this.bins.length; ++i) {
      count += this.bins[i];
      if (count > lowlimit) {
        break;
      }
    }
    var hmin = i;

    count = 0;
    for (i = 0; i < this.bins.length; ++i) {
      count += this.bins[i];
      if (count > hilimit) {
        break;
      }
    }
    var hmax = i;

    return this.lutGenerator_minMax(hmin, hmax);
  }

  lutGenerator_bestFit() {
    const pixcount = this.nonzeroPixelCount;
    //const pixcount = this.imgData.data.length;
    const limit = pixcount/10;

    var i = 0;
    var count = 0;
    for (i = 1; i < this.bins.length; ++i) {
      count += this.bins[i];
      if (count > limit) {
        break;
      }
    }
    var hmin = i;

    count = 0;
    for (i = this.bins.length-1; i >= 1; --i) {
      count += this.bins[i];
      if (count > limit) {
        break;
      }
    }
    var hmax = i;

    return this.lutGenerator_minMax(hmin, hmax);
  }

  // attempt to redo imagej's Auto
  lutGenerator_auto2() {
    const AUTO_THRESHOLD = 5000;
    const pixcount = this.nonzeroPixelCount;
  //  const pixcount = this.imgData.data.length;
    const limit = pixcount/10;
    const threshold = pixcount/AUTO_THRESHOLD;

    // this will skip the "zero" bin which contains pixels of zero intensity.
    var hmin = this.bins.length-1;
    var hmax = 1;
    for (var i = 1; i < this.bins.length; ++i) {
      if (this.bins[i] > threshold && this.bins[i] <= limit) {
        hmin = i;
        break;
      }
    }
    for (var i = this.bins.length-1; i >= 1; --i) {
      if (this.bins[i] > threshold && this.bins[i] <= limit) {
        hmax = i;
        break;
      }
    }

    if (hmax < hmin) {
      // just reset to whole range in this case.
      return this.lutGenerator_fullRange();
    }
    else {
      return this.lutGenerator_minMax(hmin, hmax);
    }
  }

  lutGenerator_auto() {
    // simple linear mapping cutting elements with small appearence
    // get 10% threshold
    var PERCENTAGE = 0.1;
    var th = Math.floor(this.bins[this.maxBin] * PERCENTAGE);
    var b = 0;
    var e = this.bins.length - 1;
    for (var x = 1; x < this.bins.length; ++x) {
      if ( this.bins[x] > th ) {
        b = x;
        break;
      }
    }
    for (var x = this.bins.length - 1; x >= 1; --x) {
      if ( this.bins[x] > th ) {
        e = x;
        break;
      }
    }

    return this.lutGenerator_minMax(b, e);
  }

  lutGenerator_equalize() {
    var lut = new Uint8Array(256);

    var map = [];
    for (var i = 0; i < this.bins.length; ++i) { map[i] = 0; }

    // summed area table?
    map[0] = this.bins[0];
    for (var i = 1; i < this.bins.length; ++i) {
      map[i] = map[i - 1] + this.bins[i];
    }

    var div = map[map.length - 1] - map[0];
    if (div > 0) {
      // compute lut as if continuous
      for (var i = 0; i < lut.length; ++i) {
        lut[i] = Math.clamp((255)*((map[i]-map[0]) / div), 0, 255);
      }
      
      // compute control points piecewise linear.
      const lutControlPoints = [
        {x:0, opacity:0}
      ];
      // read up to the first nonzero.
      var i = 1;
      for (i = 1; i < map.length; ++i) {
        if (map[i] > 0) {
          lutControlPoints.push({x:i-1, opacity:0});
          break;
        }
      }

      var lastOpac = 0;
      var opac = 0;
      for (var j = i; j < map.length; ++j) {
        opac = ((map[j]-map[0]) / div);
        if (j % 8 === 0) {
          if (Math.floor(opac*255) !== Math.floor(lastOpac*255)) {
            lutControlPoints.push({x:j, opacity:opac});
          }
        }
        lastOpac = opac;
      }
      lutControlPoints.push({x:255, opacity:1});

      return {
        lut: lut,
        controlPoints: lutControlPoints
      };
    }
    else {
      // just reset to whole range in this case...?
      return this.lutGenerator_fullRange();
    }
  }

};


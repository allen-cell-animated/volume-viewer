(function() {if (!Math.clamp) { Math.clamp = function(val,cmin,cmax) {return Math.min(Math.max(cmin, val), cmax);};}})();

// assume data is 8 bit single channel grayscale
function Histogram(data) {
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

// Data and processing for a single channel
function AICSchannel(name) {
  this.loaded = false;
  this.imgData = null;
  this.name = name;
}

AICSchannel.prototype.getIntensity = function(x,y,z) {
  return this.volumeData[x + y*(this.dims[0]) + z*(this.dims[0]*this.dims[1])];
};

// how to index into tiled texture atlas
AICSchannel.prototype.getIntensityFromAtlas = function(x,y,z) {
  const num_xtiles = this.imgData.width / this.dims[0];
  const tilex = z % num_xtiles;
  const tiley = Math.floor(z / num_xtiles);
  const offset = tilex*this.dims[0] + x + (tiley*this.dims[1] + y)*this.imgData.width;
  return this.imgData.data[offset];
};

// give the channel fresh data and initialize from that data
// data is formatted as a texture atlas where each tile is a z slice of the volume
AICSchannel.prototype.setBits = function(bitsArray, w, h) {
  this.imgData = {data:bitsArray, width:w, height:h};
  this.loaded = true;
  this.histogram = new Histogram(bitsArray);

  this.lutGenerator_auto2();
  // this.lut = this.linear_data_range_generator();
  // this.lutControlPoints = [{x:0, opacity:0, color:"gray"}, {x:255, opacity:1.0, color:"gray"}];
};

// let's rearrange this.imgData.data into a 3d array.  
// it is assumed to be coming in as a flat Uint8Array of size x*y*z 
// with x*y*z layout (first row of first plane is the first data in the layout, 
// then second row of first plane, etc)
AICSchannel.prototype.unpackVolumeFromAtlas = function(x, y, z)
{
  var volimgdata = this.imgData.data;

  this.dims = [x, y, z];
  this.volumeData = new Uint8Array(x*y*z);

  var num_xtiles = this.imgData.width / x;
  var atlasrow = this.imgData.width;
  var tilex = 0, tiley = 0, tileoffset = 0, tilerowoffset = 0;
  for (var i = 0; i < z; ++i) {
    // tile offset
    tilex = i % num_xtiles;
    tiley = Math.floor(i / num_xtiles);
    tileoffset = tilex*x + (tiley*y)*atlasrow;
    for (var j = 0; j < y; ++j) {
      tilerowoffset = j * atlasrow;
      for (var k = 0; k < x; ++k) {
        // y-1-j instead of j to flip the y coordinates.
        this.volumeData[i*(x*y) + (y-1-j)*(x) + k] = volimgdata[tileoffset + tilerowoffset + k];
      }
    }
  }
};


// give the channel fresh volume data and initialize from that data
AICSchannel.prototype.setFromVolumeData = function(bitsArray, vx, vy, vz, ax, ay) {
  this.dims = [vx, vy, vz];
  this.volumeData = bitsArray;
  this.packToAtlas(vx, vy, vz, ax, ay);
  this.loaded = true;
  this.histogram = new Histogram(this.volumeData);

  this.lutGenerator_auto2();
  // this.lut = this.linear_data_range_generator();
  // this.lutControlPoints = [{x:0, opacity:0, color:"gray"}, {x:255, opacity:1.0, color:"gray"}];
};


// given this.volumeData, let's unpack it into a flat textureatlas and fill up this.imgData.
AICSchannel.prototype.packToAtlas = function(vx, vy, vz, ax, ay)
{
  // big assumptions:
  // atlassize is a perfect multiple of volumesize in both x and y
  // ax % vx == 0
  // ay % vy == 0
  // and num slices <= num possible slices in atlas.
  // (ax/vx) * (ay/vy) >= vz
  if ((ax % vx !== 0) ||
    (ay % vy !== 0) || 
    ((ax/vx) * (ay/vy) < vz) ) {
    console.log("ERROR - atlas and volume dims are inconsistent");
    console.log(ax, ay, vx, vy, vz);
  }

  this.imgData = {
    width: ax,
    height: ay,
    data: new Uint8Array(ax * ay)
  };
  this.imgData.data.fill(0);

  // deposit slices one by one into the imgData.data from volData.
  var volimgdata = this.imgData.data;

  var x = vx, y = vy, z = vz;

  var num_xtiles = this.imgData.width / x;
  var atlasrow = this.imgData.width;
  var tilex = 0, tiley = 0, tileoffset = 0, tilerowoffset = 0;
  for (var i = 0; i < z; ++i) {
    // tile offset
    tilex = i % num_xtiles;
    tiley = Math.floor(i / num_xtiles);
    tileoffset = tilex*x + (tiley*y)*atlasrow;
    for (var j = 0; j < y; ++j) {
      tilerowoffset = j * atlasrow;
      for (var k = 0; k < x; ++k) {
        // y-1-j instead of j to flip the y coordinates.
        volimgdata[tileoffset + tilerowoffset + k] = this.volumeData[i*(x*y) + (y-1-j)*(x) + k];
      }
    }
  }

  // this.debugDraw();

};

AICSchannel.prototype.setLut = function(lut, controlPoints) {
  if (!this.loaded) {
    return;
  }
  this.lut = lut;
  if (controlPoints) {
    this.lutControlPoints = controlPoints;
  }
};

AICSchannel.prototype.lutGenerator_windowLevel = function(wnd, lvl) {
  if (!this.loaded) {
    return;
  }

  // return a LUT with new values(?)
  // data type of lut values is out_phys_range (uint8)
  // length of lut is number of histogram bins (represents the input data range)
  var lut = new Uint8Array(256);

  // simple linear mapping for actual range
  var range = wnd * 256;
  var b = lvl*256 - range*0.5;
  var e = lvl*256 + range*0.5;
  if (range < 1) {
    range = 256;
  }
  for (var x = 0; x < lut.length; ++x) {
    lut[x] = Math.clamp((x - b) * 256 / range, 0, 255);
  }

  this.lut = lut;
  this.lutControlPoints = [
    {x:0, opacity:0, color:"gray"},
    {x:b, opacity:0, color:"gray"},
    {x:e, opacity:1, color:"gray"},
    {x:255, opacity:1, color:"gray"}
  ];
};

AICSchannel.prototype.lutGenerator_fullRange = function() {
  if (!this.loaded) {
    return;
  }

  // return a LUT with new values(?)
  // data type of lut values is out_phys_range (uint8)
  // length of lut is number of histogram bins (represents the input data range)
  var lut = new Uint8Array(256);

  // simple linear mapping for actual range
  for (var x = 0; x < lut.length; ++x) {
    lut[x] = x;
  }

  this.lut = lut;
  this.lutControlPoints = [
    {x:0, opacity:0, color:"gray"},
    {x:255, opacity:1, color:"gray"}
  ];
};

AICSchannel.prototype.lutGenerator_dataRange = function() {
  if (!this.loaded) {
    return;
  }

  // return a LUT with new values(?)
  // data type of lut values is out_phys_range (uint8)
  // length of lut is number of histogram bins (represents the input data range)
  var lut = new Uint8Array(256);

  // simple linear mapping for actual range
  var b = this.histogram.dataMin;
  var e = this.histogram.dataMax;
  var range = e - b;
  if (range < 1) {
    range = 256;
  }
  for (var x = 0; x < lut.length; ++x) {
    lut[x] = Math.clamp((x - b) * 256 / range, 0, 255);
  }

  this.lut = lut;
  this.lutControlPoints = [
    {x:0, opacity:0, color:"gray"},
    {x:b, opacity:0, color:"gray"},
    {x:e, opacity:1, color:"gray"},
    {x:255, opacity:1, color:"gray"}
  ];
};

AICSchannel.prototype.lutGenerator_bestFit = function() {
  if (!this.loaded) {
    return;
  }

  var h = this.histogram;
  // return a LUT with new values(?)
  // data type of lut values is out_phys_range (uint8)
  // length of lut is number of histogram bins (represents the input data range)
  var lut = new Uint8Array(256);

  const pixcount = h.nonzeroPixelCount;
  //const pixcount = this.imgData.data.length;
  const limit = pixcount/10;

  var i = 0;
  var count = 0;
  for (i = 1; i < h.bins.length; ++i) {
    count += h.bins[i];
    if (count > limit) {
      break;
    }
  }
  var hmin = i;

  count = 0;
  for (i = h.bins.length-1; i >= 1; --i) {
    count += h.bins[i];
    if (count > limit) {
      break;
    }
  }
  var hmax = i;

  var range = hmax - hmin;
  if (range < 1) {
    range = 256;
  }
  for (var x = 0; x < lut.length; ++x) {
    lut[x] = Math.clamp((x - hmin) * 256 / range, 0, 255);
  }

  this.lut = lut;
  this.lutControlPoints = [
    {x:0, opacity:0, color:"gray"},
    {x:hmin, opacity:0, color:"gray"},
    {x:hmax, opacity:1, color:"gray"},
    {x:255, opacity:1, color:"gray"}
  ];

};

// attempt to redo imagej's Auto
AICSchannel.prototype.lutGenerator_auto2 = function() {
  if (!this.loaded) {
    return;
  }

  var h = this.histogram;

  const AUTO_THRESHOLD = 5000;
  const pixcount = h.nonzeroPixelCount;
//  const pixcount = this.imgData.data.length;
  const limit = pixcount/10;
  const threshold = pixcount/AUTO_THRESHOLD;

  // this will skip the "zero" bin which contains pixels of zero intensity.
  var hmin = h.bins.length-1;
  var hmax = 1;
  for (var i = 1; i < h.bins.length; ++i) {
    if (h.bins[i] > threshold && h.bins[i] <= limit) {
      hmin = i;
      break;
    }
  }
  for (var i = h.bins.length-1; i >= 1; --i) {
    if (h.bins[i] > threshold && h.bins[i] <= limit) {
      hmax = i;
      break;
    }
  }

  if (hmax < hmin) {
    // just reset to whole range in this case.
    this.lutGenerator_fullRange();
  }
  else {
    var lut = new Uint8Array(256);
    for (var x = 0; x < lut.length; ++x) {
      lut[x] = Math.clamp((x - hmin) * 256 / (hmax-hmin), 0, 255);
    }

    this.lut = lut;
    this.lutControlPoints = [
      {x:0, opacity:0, color:"gray"},
      {x:hmin, opacity:0, color:"gray"},
      {x:hmax, opacity:1, color:"gray"},
      {x:255, opacity:1, color:"gray"}
    ];
  }


};

AICSchannel.prototype.lutGenerator_auto = function() {
  if (!this.loaded) {
    return;
  }

  var h = this.histogram;
  // return a LUT with new values(?)
  // data type of lut values is out_phys_range (uint8)
  // length of lut is number of histogram bins (represents the input data range)
  var lut = new Uint8Array(256);

  // simple linear mapping cutting elements with small appearence
  // get 10% threshold
  var PERCENTAGE = 0.1;
  var th = Math.floor(h.bins[h.maxBin] * PERCENTAGE);
  var b = 0;
  var e = h.bins.length - 1;
  for (var x = 1; x < h.bins.length; ++x) {
    if ( h.bins[x] > th ) {
      b = x;
      break;
    }
  }
  for (var x = h.bins.length - 1; x >= 1; --x) {
    if ( h.bins[x] > th ) {
      e = x;
      break;
    }
  }

  var range = e - b;
  if (range < 1) {
    range = 256;
  }
  for (var x = 0; x < lut.length; ++x) {
    lut[x] = Math.clamp((x - b) * 256 / range, 0, 255);
  }

  this.lut = lut;
  this.lutControlPoints = [
    {x:0, opacity:0, color:"gray"},
    {x:b, opacity:0, color:"gray"},
    {x:e, opacity:1, color:"gray"},
    {x:255, opacity:1, color:"gray"}
  ];
};

AICSchannel.prototype.lutGenerator_equalize = function() {
  if (!this.loaded) {
    return;
  }

  var h = this.histogram;

  // return a LUT with new values(?)
  // data type of lut values is out_phys_range (uint8)
  // length of lut is number of histogram bins (represents the input data range)
  var lut = new Uint8Array(256);

  var map = [];
  for (var i = 0; i < h.bins.length; ++i) { map[i] = 0; }

  // summed area table?
  map[0] = h.bins[0];
  for (var i = 1; i < h.bins.length; ++i) {
    map[i] = map[i - 1] + h.bins[i];
  }

  var div = map[map.length - 1] - map[0];
  if (div > 0) {
    // compute lut as if continuous
    for (var i = 0; i < lut.length; ++i) {
      lut[i] = Math.clamp((255)*((map[i]-map[0]) / div), 0, 255);
    }
    this.lut = lut;

    // compute control points piecewise linear.
    this.lutControlPoints = [
      {x:0, opacity:0, color:"gray"}
    ];
    // read up to the first nonzero.
    var i = 1;
    for (i = 1; i < map.length; ++i) {
      if (map[i] > 0) {
        this.lutControlPoints.push({x:i-1, opacity:0, color:"gray"});
        break;
      }
    }

    var lastOpac = 0;
    var opac = 0;
    for (var j = i; j < map.length; ++j) {
      opac = ((map[j]-map[0]) / div);
      if (j % 8 === 0) {
        if (Math.floor(opac*255) !== Math.floor(lastOpac*255)) {
          this.lutControlPoints.push({x:j, opacity:opac, color:"gray"});
        }
      }
      lastOpac = opac;
    }
    this.lutControlPoints.push({x:255, opacity:1, color:"gray"});

  }
};

export default AICSchannel;

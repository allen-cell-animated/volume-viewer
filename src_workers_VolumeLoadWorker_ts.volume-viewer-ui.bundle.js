/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/Channel.ts":
/*!************************!*\
  !*** ./src/Channel.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Channel)
/* harmony export */ });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var _Histogram_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Histogram.js */ "./src/Histogram.ts");
/* harmony import */ var _Lut_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Lut.js */ "./src/Lut.ts");
/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./types.js */ "./src/types.ts");




// Data and processing for a single channel
class Channel {
  constructor(name) {
    this.loaded = false;
    this.dtype = "uint8";
    this.imgData = {
      data: new Uint8Array(),
      width: 0,
      height: 0
    };
    this.rawMin = 0;
    this.rawMax = 255;

    // on gpu
    this.dataTexture = new three__WEBPACK_IMPORTED_MODULE_3__.DataTexture(new Uint8Array(), 0, 0);
    this.lutTexture = new three__WEBPACK_IMPORTED_MODULE_3__.DataTexture(new Uint8Array(_Lut_js__WEBPACK_IMPORTED_MODULE_1__.LUT_ARRAY_LENGTH), 256, 1, three__WEBPACK_IMPORTED_MODULE_3__.RGBAFormat, three__WEBPACK_IMPORTED_MODULE_3__.UnsignedByteType);
    this.lutTexture.minFilter = this.lutTexture.magFilter = three__WEBPACK_IMPORTED_MODULE_3__.LinearFilter;
    this.lutTexture.generateMipmaps = false;
    this.volumeData = new Uint8Array();
    this.name = name;
    this.histogram = new _Histogram_js__WEBPACK_IMPORTED_MODULE_0__["default"](new Uint8Array());
    this.dims = [0, 0, 0];

    // intensity remapping lookup table
    this.lut = new _Lut_js__WEBPACK_IMPORTED_MODULE_1__.Lut().createFromMinMax(0, 255);

    // per-intensity color labeling (disabled initially)
    this.colorPalette = new Uint8Array(_Lut_js__WEBPACK_IMPORTED_MODULE_1__.LUT_ARRAY_LENGTH).fill(0);
    // store in 0..1 range. 1 means fully colorPalette, 0 means fully lut.
    this.colorPaletteAlpha = 0.0;
  }

  // rgbColor is [0..255, 0..255, 0..255]
  combineLuts(rgbColor, out) {
    const ret = out ? out : new Uint8Array(_Lut_js__WEBPACK_IMPORTED_MODULE_1__.LUT_ARRAY_LENGTH);
    if (!rgbColor) {
      return ret;
    }
    const rgb = [rgbColor[0] / 255.0, rgbColor[1] / 255.0, rgbColor[2] / 255.0];
    // colorPalette*alpha + rgb*lut*(1-alpha)
    // a tiny bit faster for the edge cases
    if (this.colorPaletteAlpha === 1.0) {
      ret.set(this.colorPalette);
    } else if (this.colorPaletteAlpha === 0.0) {
      ret.set(this.lut.lut);
      for (let i = 0; i < _Lut_js__WEBPACK_IMPORTED_MODULE_1__.LUT_ARRAY_LENGTH / 4; ++i) {
        ret[i * 4 + 0] *= rgb[0];
        ret[i * 4 + 1] *= rgb[1];
        ret[i * 4 + 2] *= rgb[2];
      }
    } else {
      for (let i = 0; i < _Lut_js__WEBPACK_IMPORTED_MODULE_1__.LUT_ARRAY_LENGTH / 4; ++i) {
        ret[i * 4 + 0] = this.colorPalette[i * 4 + 0] * this.colorPaletteAlpha + this.lut.lut[i * 4 + 0] * (1.0 - this.colorPaletteAlpha) * rgb[0];
        ret[i * 4 + 1] = this.colorPalette[i * 4 + 1] * this.colorPaletteAlpha + this.lut.lut[i * 4 + 1] * (1.0 - this.colorPaletteAlpha) * rgb[1];
        ret[i * 4 + 2] = this.colorPalette[i * 4 + 2] * this.colorPaletteAlpha + this.lut.lut[i * 4 + 2] * (1.0 - this.colorPaletteAlpha) * rgb[2];
        ret[i * 4 + 3] = this.colorPalette[i * 4 + 3] * this.colorPaletteAlpha + this.lut.lut[i * 4 + 3] * (1.0 - this.colorPaletteAlpha);
      }
    }
    this.lutTexture.image.data.set(ret);
    this.lutTexture.needsUpdate = true;
    return ret;
  }
  setRawDataRange(min, max) {
    // remap the lut which was based on rawMin and rawMax to new min and max
    // If either of the min/max ranges are both zero, then we have undefined behavior and should
    // not remap the lut.  This situation can happen at first load, for example,
    // when one channel has arrived but others haven't.
    if (!(this.rawMin === 0 && this.rawMax === 0) && !(min === 0 && max === 0)) {
      this.lut.remapDomains(this.rawMin, this.rawMax, min, max);
      this.rawMin = min;
      this.rawMax = max;
    }
  }
  getHistogram() {
    return this.histogram;
  }
  getIntensity(x, y, z) {
    return this.volumeData[x + y * this.dims[0] + z * (this.dims[0] * this.dims[1])];
  }
  normalizeRaw(val) {
    return (val - this.rawMin) / (this.rawMax - this.rawMin);
  }

  // how to index into tiled texture atlas
  getIntensityFromAtlas(x, y, z) {
    const numXtiles = this.imgData.width / this.dims[0];
    const tilex = z % numXtiles;
    const tiley = Math.floor(z / numXtiles);
    const offset = tilex * this.dims[0] + x + (tiley * this.dims[1] + y) * this.imgData.width;
    return this.imgData.data[offset];
  }
  rebuildDataTexture(data, w, h) {
    if (this.dataTexture) {
      this.dataTexture.dispose();
    }
    let format = three__WEBPACK_IMPORTED_MODULE_3__.LuminanceFormat;
    let dataType = three__WEBPACK_IMPORTED_MODULE_3__.UnsignedByteType;
    let internalFormat = "LUMINANCE";
    switch (this.dtype) {
      case "uint8":
        dataType = three__WEBPACK_IMPORTED_MODULE_3__.UnsignedByteType;
        format = three__WEBPACK_IMPORTED_MODULE_3__.RedIntegerFormat;
        internalFormat = "R8UI";
        break;
      case "int8":
        dataType = three__WEBPACK_IMPORTED_MODULE_3__.ByteType;
        format = three__WEBPACK_IMPORTED_MODULE_3__.RedIntegerFormat;
        internalFormat = "R8I";
        break;
      case "uint16":
        dataType = three__WEBPACK_IMPORTED_MODULE_3__.UnsignedShortType;
        format = three__WEBPACK_IMPORTED_MODULE_3__.RedIntegerFormat;
        internalFormat = "R16UI";
        break;
      case "int16":
        dataType = three__WEBPACK_IMPORTED_MODULE_3__.ShortType;
        format = three__WEBPACK_IMPORTED_MODULE_3__.RedIntegerFormat;
        internalFormat = "R16I";
        break;
      case "uint32":
        dataType = three__WEBPACK_IMPORTED_MODULE_3__.UnsignedIntType;
        format = three__WEBPACK_IMPORTED_MODULE_3__.RedIntegerFormat;
        internalFormat = "R32UI";
        break;
      case "int32":
        dataType = three__WEBPACK_IMPORTED_MODULE_3__.IntType;
        format = three__WEBPACK_IMPORTED_MODULE_3__.RedIntegerFormat;
        internalFormat = "R32I";
        break;
      case "float32":
        dataType = three__WEBPACK_IMPORTED_MODULE_3__.FloatType;
        format = three__WEBPACK_IMPORTED_MODULE_3__.RedFormat;
        internalFormat = "R32F";
        break;
      default:
        console.warn("unsupported dtype for channel data", this.dtype);
        break;
    }
    this.dataTexture = new three__WEBPACK_IMPORTED_MODULE_3__.DataTexture(data, w, h, format, dataType, three__WEBPACK_IMPORTED_MODULE_3__.UVMapping, three__WEBPACK_IMPORTED_MODULE_3__.ClampToEdgeWrapping, three__WEBPACK_IMPORTED_MODULE_3__.ClampToEdgeWrapping, three__WEBPACK_IMPORTED_MODULE_3__.NearestFilter, three__WEBPACK_IMPORTED_MODULE_3__.NearestFilter);
    this.dataTexture.internalFormat = internalFormat;
    this.dataTexture.needsUpdate = true;
  }

  // give the channel fresh data and initialize from that data
  // data is formatted as a texture atlas where each tile is a z slice of the volume
  setFromAtlas(bitsArray, w, h, dtype, rawMin, rawMax, subregionSize) {
    this.dtype = dtype;
    this.imgData = {
      data: bitsArray,
      width: w,
      height: h
    };
    this.rebuildDataTexture(this.imgData.data, w, h);
    this.loaded = true;
    this.histogram = new _Histogram_js__WEBPACK_IMPORTED_MODULE_0__["default"](bitsArray);

    // reuse old lut but auto-remap it to new data range
    this.setRawDataRange(rawMin, rawMax);
    this.unpackFromAtlas(subregionSize.x, subregionSize.y, subregionSize.z);
  }

  // let's rearrange this.imgData.data into a 3d array.
  // it is assumed to be coming in as a flat Uint8Array of size x*y*z
  // with x*y*z layout (first row of first plane is the first data in the layout,
  // then second row of first plane, etc)
  unpackFromAtlas(x, y, z) {
    const volimgdata = this.imgData.data;
    this.dims = [x, y, z];
    const ctor = _types_js__WEBPACK_IMPORTED_MODULE_2__.ARRAY_CONSTRUCTORS[this.dtype];
    this.volumeData = new ctor(x * y * z);
    const numXtiles = this.imgData.width / x;
    const atlasrow = this.imgData.width;
    let tilex = 0,
      tiley = 0,
      tileoffset = 0,
      tilerowoffset = 0,
      destOffset = 0;
    for (let i = 0; i < z; ++i) {
      // tile offset
      tilex = i % numXtiles;
      tiley = Math.floor(i / numXtiles);
      tileoffset = tilex * x + tiley * y * atlasrow;
      for (let j = 0; j < y; ++j) {
        tilerowoffset = j * atlasrow;
        destOffset = i * (x * y) + j * x;
        this.volumeData.set(volimgdata.subarray(tileoffset + tilerowoffset, tileoffset + tilerowoffset + x), destOffset);
      }
    }
  }

  // give the channel fresh volume data and initialize from that data
  setFromVolumeData(bitsArray, vx, vy, vz, ax, ay, rawMin, rawMax, dtype) {
    this.dims = [vx, vy, vz];
    this.volumeData = bitsArray;
    this.dtype = dtype;
    // TODO FIXME performance hit for shuffling the data and storing 2 versions of it (could do this in worker at least?)
    this.packToAtlas(vx, vy, vz, ax, ay);
    this.loaded = true;
    // update from current histogram?
    this.setRawDataRange(rawMin, rawMax);
    this.histogram = new _Histogram_js__WEBPACK_IMPORTED_MODULE_0__["default"](this.volumeData);
  }

  // given this.volumeData, let's unpack it into a flat textureatlas and fill up this.imgData.
  packToAtlas(vx, vy, vz, ax, ay) {
    // big assumptions:
    // atlassize is a perfect multiple of volumesize in both x and y
    // ax % vx == 0
    // ay % vy == 0
    // and num slices <= num possible slices in atlas.
    // (ax/vx) * (ay/vy) >= vz
    if (ax % vx !== 0 || ay % vy !== 0 || ax / vx * (ay / vy) < vz) {
      console.log("ERROR - atlas and volume dims are inconsistent");
      console.log(ax, ay, vx, vy, vz);
    }
    const ctor = _types_js__WEBPACK_IMPORTED_MODULE_2__.ARRAY_CONSTRUCTORS[this.dtype];
    this.imgData = {
      width: ax,
      height: ay,
      data: new ctor(ax * ay)
    };
    this.imgData.data.fill(0);

    // deposit slices one by one into the imgData.data from volData.
    const volimgdata = this.imgData.data;
    const x = vx,
      y = vy,
      z = vz;
    const numXtiles = this.imgData.width / x;
    const atlasrow = this.imgData.width;
    let tilex = 0,
      tiley = 0,
      tileoffset = 0,
      tilerowoffset = 0,
      sourceOffset = 0;
    for (let i = 0; i < z; ++i) {
      // tile offset
      tilex = i % numXtiles;
      tiley = Math.floor(i / numXtiles);
      tileoffset = tilex * x + tiley * y * atlasrow;
      for (let j = 0; j < y; ++j) {
        tilerowoffset = j * atlasrow;
        sourceOffset = i * (x * y) + j * x;
        volimgdata.set(this.volumeData.subarray(sourceOffset, sourceOffset + x), tileoffset + tilerowoffset);
      }
    }
    this.rebuildDataTexture(this.imgData.data, ax, ay);
  }
  setLut(lut) {
    this.lut = lut;
  }

  // palette should be an uint8array of 256*4 elements (256 rgba8 values)
  setColorPalette(palette) {
    this.colorPalette = palette;
  }
  setColorPaletteAlpha(alpha) {
    this.colorPaletteAlpha = alpha;
  }
}

/***/ }),

/***/ "./src/Histogram.ts":
/*!**************************!*\
  !*** ./src/Histogram.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Histogram)
/* harmony export */ });
const NBINS = 256;
/**
 * Builds a histogram with 256 bins from a data array. Assume data is 8 bit single channel grayscale.
 * @class
 * @param {Array.<number>} data
 */
class Histogram {
  // no more than 2^32 pixels of any one intensity in the data!?!?!

  constructor(data) {
    this.dataMinBin = 0;
    this.dataMaxBin = 0;
    this.maxBin = 0;
    this.bins = new Uint32Array();
    this.min = 0;
    this.max = 0;
    this.binSize = 0;

    // build up the histogram
    const hinfo = Histogram.calculateHistogram(data, NBINS);
    this.bins = hinfo.bins;
    this.min = hinfo.min;
    this.max = hinfo.max;
    this.binSize = hinfo.binSize;

    // track the first and last nonzero bins with at least 1 sample
    for (let i = 1; i < this.bins.length; i++) {
      if (this.bins[i] > 0) {
        this.dataMinBin = i;
        break;
      }
    }
    for (let i = this.bins.length - 1; i >= 1; i--) {
      if (this.bins[i] > 0) {
        this.dataMaxBin = i;
        break;
      }
    }
    this.pixelCount = data.length;

    // get the bin with the most frequently occurring NONZERO value
    this.maxBin = 1;
    let max = this.bins[1];
    for (let i = 1; i < this.bins.length; i++) {
      if (this.bins[i] > max) {
        this.maxBin = i;
        max = this.bins[i];
      }
    }
  }

  // return the bin index of the given data value
  static findBin(dataValue, dataMin, binSize, numBins) {
    let binIndex = Math.floor((dataValue - dataMin) / binSize);
    // for values that lie exactly on last bin we need to subtract one
    if (binIndex === numBins) {
      binIndex--;
    }
    return binIndex;
  }

  // return the bin index of the given data value
  findBinOfValue(value) {
    return Histogram.findBin(value, this.min, this.binSize, NBINS);
  }
  getDataMin() {
    return this.min;
  }
  getDataMax() {
    return this.max;
  }

  /**
   * Return the min data value
   * @return {number}
   */
  getMin() {
    return this.dataMinBin;
  }

  /**
   * Return the max data value
   * @return {number}
   */
  getMax() {
    return this.dataMaxBin;
  }
  getNumBins() {
    return this.bins.length;
  }
  getBin(i) {
    return this.bins[i];
  }
  getBinRange(i) {
    return [this.min + i * this.binSize, this.min + (i + 1) * this.binSize];
  }

  /**
   * Find the bin that contains the percentage of pixels below it
   * @return {number}
   * @param {number} pct
   */
  findBinOfPercentile(pct) {
    const limit = this.pixelCount * pct;
    let i = 0;
    let count = 0;
    for (i = 0; i < this.bins.length; ++i) {
      count += this.bins[i];
      if (count > limit) {
        break;
      }
    }
    return i;
  }

  // Find bins at 10th / 90th percentile
  findBestFitBins() {
    const pixcount = this.pixelCount;
    //const pixcount = this.imgData.data.length;
    const limit = pixcount / 10;
    let i = 0;
    let count = 0;
    for (i = 1; i < this.bins.length; ++i) {
      count += this.bins[i];
      if (count > limit) {
        break;
      }
    }
    const hmin = i;
    count = 0;
    for (i = this.bins.length - 1; i >= 1; --i) {
      count += this.bins[i];
      if (count > limit) {
        break;
      }
    }
    const hmax = i;
    return [hmin, hmax];
  }

  // Find min and max bins attempting to replicate ImageJ's "Auto" button
  findAutoIJBins() {
    // note that consecutive applications of this should modify the auto threshold. see:
    // https://github.com/imagej/ImageJ/blob/7746fcb0f5744a7a7758244c5dcd2193459e6e0e/ij/plugin/frame/ContrastAdjuster.java#L816
    const AUTO_THRESHOLD = 5000;
    const pixcount = this.pixelCount;
    //  const pixcount = this.imgData.data.length;
    const limit = pixcount / 10;
    const threshold = pixcount / AUTO_THRESHOLD;

    // this will skip the "zero" bin which contains pixels of zero intensity.
    let hmin = this.bins.length - 1;
    let hmax = 1;
    for (let i = 1; i < this.bins.length; ++i) {
      if (this.bins[i] > threshold && this.bins[i] <= limit) {
        hmin = i;
        break;
      }
    }
    for (let i = this.bins.length - 1; i >= 1; --i) {
      if (this.bins[i] > threshold && this.bins[i] <= limit) {
        hmax = i;
        break;
      }
    }
    if (hmax < hmin) {
      hmin = 0;
      hmax = 255;
    }
    return [hmin, hmax];
  }

  // Find min and max bins using a percentile of the most commonly occurring value
  findAutoMinMax() {
    // simple linear mapping cutting elements with small appearence
    // get 10% threshold
    const PERCENTAGE = 0.1;
    const th = Math.floor(this.bins[this.maxBin] * PERCENTAGE);
    let b = 0;
    let e = this.bins.length - 1;
    for (let x = 1; x < this.bins.length; ++x) {
      if (this.bins[x] > th) {
        b = x;
        break;
      }
    }
    for (let x = this.bins.length - 1; x >= 1; --x) {
      if (this.bins[x] > th) {
        e = x;
        break;
      }
    }
    return [b, e];
  }
  static calculateHistogram(arr, numBins = 1) {
    if (numBins < 1) {
      numBins = 1;
    }

    // calculate min and max of arr
    // TODO See convertChannel, which will also compute min and max!
    // We could save a whole extra loop over the data, or have convertChannel compute the whole histogram.
    // need to be careful about computing over chunks or whole ready-to-display volume

    let min = arr[0];
    let max = arr[0];
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] < min) {
        min = arr[i];
      } else if (arr[i] > max) {
        max = arr[i];
      }
    }
    const bins = new Uint32Array(numBins).fill(0);
    const binSize = (max - min) / numBins === 0 ? 1 : (max - min) / numBins;
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i];
      const binIndex = Histogram.findBin(item, min, binSize, numBins);
      bins[binIndex]++;
    }
    return {
      bins,
      min,
      max,
      binSize
    };
  }
}

/***/ }),

/***/ "./src/Lut.ts":
/*!********************!*\
  !*** ./src/Lut.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LUT_ARRAY_LENGTH: () => (/* binding */ LUT_ARRAY_LENGTH),
/* harmony export */   LUT_ENTRIES: () => (/* binding */ LUT_ENTRIES),
/* harmony export */   Lut: () => (/* binding */ Lut),
/* harmony export */   remapControlPoints: () => (/* binding */ remapControlPoints),
/* harmony export */   remapLut: () => (/* binding */ remapLut)
/* harmony export */ });
/* harmony import */ var _constants_colors_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants/colors.js */ "./src/constants/colors.ts");

function clamp(val, cmin, cmax) {
  return Math.min(Math.max(cmin, val), cmax);
}
function lerp(xmin, xmax, a) {
  return a * (xmax - xmin) + xmin;
}

// We have an intensity value that is in the range of valueMin to valueMax.
// This domain is assumed to have been remapped from oldMin to oldMax.
// We now wish to find the intensity value that corresponds to the same relative position in the new domain of newMin to newMax.
// For our Luts valueMin will always be 0, and valueMax will always be 255.
// oldMin and oldMax will be the domain of the original raw data intensities.
// newMin and newMax will be the domain of the new raw data intensities.
function remapDomain(value, valueMin, valueMax, oldMin, oldMax, newMin, newMax) {
  const pctOfRange = (value - valueMin) / (valueMax - valueMin);
  const newValue = (newMax - newMin) * pctOfRange + newMin;
  // now locate this value as a relative index in the old range
  const pctOfOldRange = (newValue - oldMin) / (oldMax - oldMin);
  const remapped = valueMin + pctOfOldRange * (valueMax - valueMin);
  return remapped;
}

// We have an intensity value that is in the range of valueMin to valueMax.
// The input value range is assumed to represent absolute intensity range oldMin to oldMax.
// We now wish to find the new position of this intensity value
// when the valueMin-valueMax represents absolute range newMin to newMax
// After the remapping, the intensity value will be in the range of valueMin to valueMax.
// For our Luts valueMin will always be 0, and valueMax will always be 255.
// oldMin and oldMax will be the domain of the original raw data intensities.
// newMin and newMax will be the domain of the new raw data intensities.
function remapDomainForCP(value, valueMin, valueMax, oldMin, oldMax, newMin, newMax) {
  const pctOfRange = (value - valueMin) / (valueMax - valueMin);
  // find abs intensity from old range
  const iOld = (oldMax - oldMin) * pctOfRange + oldMin;
  // now locate this value as a relative index in the new range
  const pctOfNewRange = (iOld - newMin) / (newMax - newMin);
  const remapped = valueMin + pctOfNewRange * (valueMax - valueMin);
  return remapped;
}
const LUT_ENTRIES = 256;
const LUT_ARRAY_LENGTH = LUT_ENTRIES * 4;

// @param {ControlPoint[]} controlPoints - array of {x:number 0..255, opacity:number 0..1, color:array of 3 numbers 0..255}
// @return {Uint8Array} array of length len*4 representing the rgba values of the gradient
function arrayFromControlPoints(controlPoints) {
  // current assumption is that control point X values are in the range 0-255
  // and they will be used directly as indices into the LUT.
  // therefore the lut must have 256 entries.  Anything else and we have to remap the control points.
  // TODO allow luts that have more or less entries.
  const len = LUT_ENTRIES;
  const lut = new Uint8Array(len * 4).fill(0);
  if (controlPoints.length === 0) {
    return lut;
  }

  // ensure they are sorted in ascending order of x
  controlPoints.sort((a, b) => a.x - b.x);

  // special case only one control point.
  if (controlPoints.length === 1) {
    const rgba = controlPointToRGBA(controlPoints[0]);
    // lut was already filled with zeros
    // copy val from x to 255.
    const startx = clamp(controlPoints[0].x, 0, 255);
    for (let x = startx; x < len; ++x) {
      lut[x * 4 + 0] = rgba[0];
      lut[x * 4 + 1] = rgba[1];
      lut[x * 4 + 2] = rgba[2];
      lut[x * 4 + 3] = rgba[3];
    }
    return lut;
  }
  let c0 = controlPoints[0];
  let c1 = controlPoints[1];
  let color0 = controlPointToRGBA(c0);
  let color1 = controlPointToRGBA(c1);
  let lastIndex = 1;
  let a = 0;
  for (let i = 0; i < len; ++i) {
    // find the two control points that i is between
    while (i > c1.x) {
      // advance control points
      c0 = c1;
      color0 = color1;
      lastIndex++;
      if (lastIndex >= controlPoints.length) {
        // if the last control point is before 255, then we want to continue its value all the way to 255.
        c1 = {
          x: 255,
          color: c1.color,
          opacity: c1.opacity
        };
      } else {
        c1 = controlPoints[lastIndex];
      }
      color1 = controlPointToRGBA(c1);
    }
    // find the lerp amount between the two control points
    if (c1.x === c0.x) {
      // use c1
      a = 1.0;
    } else {
      a = (i - c0.x) / (c1.x - c0.x);
    }
    lut[i * 4 + 0] = clamp(lerp(color0[0], color1[0], a), 0, 255);
    lut[i * 4 + 1] = clamp(lerp(color0[1], color1[1], a), 0, 255);
    lut[i * 4 + 2] = clamp(lerp(color0[2], color1[2], a), 0, 255);
    lut[i * 4 + 3] = clamp(lerp(color0[3], color1[3], a), 0, 255);
  }
  return lut;
}

/**
 * @typedef {Object} ControlPoint Used for the TF (transfer function) editor GUI.
 * Need to be converted to LUT for rendering.
 * @property {number} x The X Coordinate: an intensity value, normalized to the 0-255 range
 * @property {number} opacity The Opacity, from 0 to 1
 * @property {Array.<number>} color The Color, 3 numbers from 0-255 for r,g,b
 */

function controlPointToRGBA(controlPoint) {
  return [controlPoint.color[0], controlPoint.color[1], controlPoint.color[2], Math.floor(controlPoint.opacity * 255)];
}

// the intensity range will be 0-255,
// which currently represents the range of the raw data. (not the dtype range)
const createFullRangeControlPoints = (opacityMin = 0, opacityMax = 1) => [{
  x: 0,
  opacity: opacityMin,
  color: [255, 255, 255]
}, {
  x: 255,
  opacity: opacityMax,
  color: [255, 255, 255]
}];

/**
 * @typedef {Object} Lut Used for rendering. The start and end of the Lut represent the min and max of the data.
 * @property {Array.<number>} lut LUT_ARRAY_LENGTH element lookup table as array
 * (maps scalar intensity to a rgb color plus alpha, with each value from 0-255)
 * @property {Array.<ControlPoint>} controlPoints
 */
class Lut {
  constructor() {
    this.lut = new Uint8Array(LUT_ARRAY_LENGTH);
    this.controlPoints = [];
    this.createFullRange();
  }

  /**
   * Generate a piecewise linear lookup table that ramps up from 0 to 1 over the b to e domain.
   * If e === b, then we use a step function with f(b) = 0 and f(b + 1) = 1
   *  |
   * 1|               +---------+-----
   *  |              /
   *  |             /
   *  |            /
   *  |           /
   *  |          /
   * 0+=========+---------------+-----
   *  0         b    e         255
   * @return {Lut}
   * @param {number} b
   * @param {number} e
   */
  createFromMinMax(b, e) {
    if (e < b) {
      // swap
      const tmp = e;
      e = b;
      b = tmp;
    }

    // Edge case: b and e are both out of bounds
    if (b < 0 && e < 0) {
      this.controlPoints = createFullRangeControlPoints(1, 1);
      return this.createFromControlPoints(this.controlPoints);
    }
    if (b >= 255 && e >= 255) {
      this.controlPoints = createFullRangeControlPoints(0, 0);
      return this.createFromControlPoints(this.controlPoints);
    }

    // Generate 2 to 4 control points for a minMax LUT, from left to right
    const controlPoints = [];

    // Add starting point at x = 0
    let startVal = 0;
    if (b < 0) {
      startVal = -b / (e - b);
    }
    controlPoints.push({
      x: 0,
      opacity: startVal,
      color: [255, 255, 255]
    });

    // If b > 0, add another point at (b, 0)
    if (b > 0) {
      controlPoints.push({
        x: b,
        opacity: 0,
        color: [255, 255, 255]
      });
    }

    // If e < 255, Add another point at (e, 1)
    if (e < 255) {
      if (e === b) {
        // Use b + 0.5 as x value instead of e to create a near-vertical ramp
        controlPoints.push({
          x: b + 0.5,
          opacity: 1,
          color: [255, 255, 255]
        });
      } else {
        controlPoints.push({
          x: e,
          opacity: 1,
          color: [255, 255, 255]
        });
      }
    }

    // Add ending point at x = 255
    let endVal = 1;
    if (e > 255) {
      endVal = (255 - b) / (e - b);
    }
    controlPoints.push({
      x: 255,
      opacity: endVal,
      color: [255, 255, 255]
    });
    return this.createFromControlPoints(controlPoints);
  }

  // basically, the identity LUT with respect to opacity
  createFullRange() {
    this.controlPoints = createFullRangeControlPoints();
    return this.createFromControlPoints(this.controlPoints);
  }

  /**
   * Generate a Window/level lookup table
   * @return {Lut}
   * @param {number} wnd in 0..1 range
   * @param {number} lvl in 0..1 range
   */
  createFromWindowLevel(wnd, lvl) {
    // simple linear mapping for actual range
    const b = lvl - wnd * 0.5;
    const e = lvl + wnd * 0.5;
    return this.createFromMinMax(b * 255, e * 255);
  }

  // @param {Object[]} controlPoints - array of {x:number 0..255, opacity:number 0..1, color:array of 3 numbers 0..255}
  // @return {Uint8Array} array of length 256*4 representing the rgba values of the gradient
  createFromControlPoints(controlPoints) {
    this.lut = arrayFromControlPoints(controlPoints);
    this.controlPoints = controlPoints;
    return this;
  }

  /**
   * Generate an "equalized" lookup table
   * @return {Lut}
   */
  createFromEqHistogram(histogram) {
    // TODO need to reconcile this if number of histogram bins is not equal to LUT_ENTRIES?

    const map = [];
    for (let i = 0; i < histogram.getNumBins(); ++i) {
      map[i] = 0;
    }

    // summed area table?
    map[0] = histogram.getBin(0);
    for (let i = 1; i < histogram.getNumBins(); ++i) {
      map[i] = map[i - 1] + histogram.getBin(i);
    }
    const div = map[map.length - 1] - map[0];
    if (div > 0) {
      // compute lut and track control points for the piecewise linear sections
      const lutControlPoints = [{
        x: 0,
        opacity: 0,
        color: [255, 255, 255]
      }];
      let slope = 0;
      let lastSlope = 0;
      let opacity = 0;
      let lastOpacity = 0;
      for (let i = 1; i < LUT_ENTRIES; ++i) {
        lastOpacity = opacity;
        opacity = clamp(Math.round(255 * (map[i] - map[0])), 0, 255);
        slope = opacity - lastOpacity;
        // if map[i]-map[i-1] is the same as map[i+1]-map[i] then we are in a linear segment and do not need a new control point
        if (slope != lastSlope) {
          lutControlPoints.push({
            x: i - 1,
            opacity: lastOpacity / 255.0,
            color: [255, 255, 255]
          });
          lastSlope = slope;
        }
      }
      lutControlPoints.push({
        x: 255,
        opacity: 1,
        color: [255, 255, 255]
      });
      return this.createFromControlPoints(lutControlPoints);
    } else {
      // just reset to whole range in this case...?
      return this.createFullRange();
    }
  }

  /**
   * Generate a lookup table with a different color per intensity value.
   * This translates to a unique color per histogram bin with more than zero pixels.
   * TODO THIS IS NOT THE EFFECT WE WANT.  Colorize should operate on actual data values, not histogram bins.
   * @return {Lut}
   */
  createLabelColors(histogram) {
    const lut = new Uint8Array(LUT_ARRAY_LENGTH).fill(0);
    const controlPoints = [];
    // assume zero is No Label
    controlPoints.push({
      x: 0,
      opacity: 0,
      color: [0, 0, 0]
    });
    let lastr = 0;
    let lastg = 0;
    let lastb = 0;
    let lasta = 0;
    let r = 0;
    let g = 0;
    let b = 0;
    let a = 0;

    // assumes exactly one color per bin
    for (let i = 1; i < LUT_ENTRIES; ++i) {
      const ibin = Math.floor(i / (LUT_ENTRIES - 1) * (histogram.getNumBins() - 1));
      if (histogram.getBin(ibin) > 0) {
        const rgb = (0,_constants_colors_js__WEBPACK_IMPORTED_MODULE_0__.getColorByChannelIndex)(ibin);
        lut[i * 4 + 0] = rgb[0];
        lut[i * 4 + 1] = rgb[1];
        lut[i * 4 + 2] = rgb[2];
        lut[i * 4 + 3] = 255;
        r = rgb[0];
        g = rgb[1];
        b = rgb[2];
        a = 1;
      } else {
        // add a zero control point?
        r = 0;
        g = 0;
        b = 0;
        a = 0;
        // lut was initialized to 0 so no need to set it here.
      }
      // if current control point is same as last one don't add it
      if (r !== lastr || g !== lastg || b !== lastb || a !== lasta) {
        if (lasta === 0) {
          controlPoints.push({
            x: i - 0.5,
            opacity: lasta,
            color: [lastr, lastg, lastb]
          });
        }
        controlPoints.push({
          x: i,
          opacity: a,
          color: [r, g, b]
        });
        lastr = r;
        lastg = g;
        lastb = b;
        lasta = a;
      }
    }
    this.lut = lut;
    this.controlPoints = controlPoints;
    return this;
  }

  // since this is not a "create" function, it doesn't need to return the object.
  remapDomains(oldMin, oldMax, newMin, newMax) {
    // no attempt is made here to ensure that lut and controlPoints are internally consistent.
    // if they start out consistent, they should end up consistent. And vice versa.
    this.lut = remapLut(this.lut, oldMin, oldMax, newMin, newMax);
    this.controlPoints = remapControlPoints(this.controlPoints, oldMin, oldMax, newMin, newMax);
  }
}

// If the new max is greater than the old max, then
// the lut's max end will move inward to the left.
// This is another way of saying that the new max's index is greater than 255 in the old lut
// If the new min is less than the old min, then
// the lut's min end will move inward to the right.
// This is another way of saying that the new min's index is less than 0 in the old lut
function remapLut(lut, oldMin, oldMax, newMin, newMax) {
  const newLut = new Uint8Array(LUT_ARRAY_LENGTH);

  // we will find what intensity is at each index in the new range,
  // and then try to sample the pre-existing lut as if it spans the old range.
  // Build new lut by sampling from old lut.
  for (let i = 0; i < LUT_ENTRIES; ++i) {
    let iOld = remapDomain(i, 0, LUT_ENTRIES - 1, oldMin, oldMax, newMin, newMax);
    if (iOld < 0) {
      iOld = 0;
    }
    if (iOld > LUT_ENTRIES - 1) {
      iOld = LUT_ENTRIES - 1;
    }
    // find the indices above and below for interpolation
    const i0 = Math.floor(iOld);
    const i1 = Math.ceil(iOld);
    const pct = iOld - i0;

    //console.log(`interpolating ${iOld}: ${lut[i0 * 4 + 3]}, ${lut[i1 * 4 + 3]}, ${pct}`);
    newLut[i * 4 + 0] = Math.round(lerp(lut[i0 * 4 + 0], lut[i1 * 4 + 0], pct));
    newLut[i * 4 + 1] = Math.round(lerp(lut[i0 * 4 + 1], lut[i1 * 4 + 1], pct));
    newLut[i * 4 + 2] = Math.round(lerp(lut[i0 * 4 + 2], lut[i1 * 4 + 2], pct));
    newLut[i * 4 + 3] = Math.round(lerp(lut[i0 * 4 + 3], lut[i1 * 4 + 3], pct));
  }
  return newLut;
}
function remapControlPoints(controlPoints, oldMin, oldMax, newMin, newMax, nudgeEndPoints = true) {
  if (controlPoints.length === 0) {
    return controlPoints;
  }
  const newControlPoints = [];

  // Save the current position of control points at the ends of the list
  const oldFirstX = controlPoints[0].x;
  const oldLastX = controlPoints[controlPoints.length - 1].x;

  // assume control point x domain 0-255 is mapped to oldMin-oldMax

  // remap all cp x values.
  // interpolate all new colors and opacities
  // Do not clip values outside of 0-255. This is important to
  // preserve information for remapping many consecutive times.
  for (let i = 0; i < controlPoints.length; ++i) {
    const cp = controlPoints[i];
    const iOld = remapDomainForCP(cp.x, 0, LUT_ENTRIES - 1, oldMin, oldMax, newMin, newMax);
    const newCP = {
      x: iOld,
      opacity: cp.opacity,
      color: [cp.color[0], cp.color[1], cp.color[2]]
    };
    newControlPoints.push(newCP);
  }
  return nudgeEndPoints ? nudgeRemappedEndControlPoints(newControlPoints, oldFirstX, oldLastX) : newControlPoints;
}

/**
 * Attempts to keep the first and last control points in a remapped list in a sensible place if they were previously on
 * or outside the edge of the range.
 *
 * Commonly (e.g. in the output of nearly all the factory methods in `Lut`), the very first and last control points
 * just define a line of constant opacity out to the upper/lower edge of the range. Remapping these points naively
 * means that the range of the transfer function no longer matches the actual range of intensities. This isn't a
 * problem for producing a lut, but it does make things look weird. If it is possible to do so without losing
 * information, we should try to keep these points in place.
 *
 * In addition to a list of control points, this function requires the x coordinate of the end points _before_
 * remapping, to determine whether the points used to be at or outside the edges of the range.
 */
function nudgeRemappedEndControlPoints(controlPoints, oldFirstX, oldLastX) {
  const EPSILON = 0.0001;
  const first = controlPoints[0];
  const second = controlPoints[1];
  const secondLast = controlPoints[controlPoints.length - 2];
  const last = controlPoints[controlPoints.length - 1];
  if (Math.abs(first.opacity - (second?.opacity ?? Infinity)) < EPSILON) {
    if (first.x < 0) {
      // control point is now out of bounds - clamp it to 0 (or as close as we can get without losing information)
      first.x = Math.min(0, second.x - 1);
    } else if (oldFirstX < EPSILON) {
      // control point was at or below 0 and has moved inward - snap it to 0 to cover the full range
      first.x = 0;
    }
  }
  if (Math.abs(last.opacity - (secondLast?.opacity ?? Infinity)) < EPSILON) {
    if (last.x > 255) {
      // control point is now out of bounds - clamp it to 255 (or as close as we can get without losing information)
      last.x = Math.max(255, secondLast.x + 1);
    } else if (oldLastX > 255 - EPSILON) {
      // control point was at or above 255 and has moved inward - snap it to 255 to cover the full range
      last.x = 255;
    }
  }
  return controlPoints;
}

/***/ }),

/***/ "./src/Volume.ts":
/*!***********************!*\
  !*** ./src/Volume.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Volume),
/* harmony export */   getDefaultImageInfo: () => (/* binding */ getDefaultImageInfo)
/* harmony export */ });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var _Channel_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Channel.js */ "./src/Channel.ts");
/* harmony import */ var _constants_colors_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constants/colors.js */ "./src/constants/colors.ts");
/* harmony import */ var _loaders_IVolumeLoader_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./loaders/IVolumeLoader.js */ "./src/loaders/IVolumeLoader.ts");
/* harmony import */ var _loaders_VolumeLoaderUtils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./loaders/VolumeLoaderUtils.js */ "./src/loaders/VolumeLoaderUtils.ts");





const getDefaultImageInfo = () => ({
  name: "",
  originalSize: new three__WEBPACK_IMPORTED_MODULE_4__.Vector3(1, 1, 1),
  atlasTileDims: new three__WEBPACK_IMPORTED_MODULE_4__.Vector2(1, 1),
  volumeSize: new three__WEBPACK_IMPORTED_MODULE_4__.Vector3(1, 1, 1),
  subregionSize: new three__WEBPACK_IMPORTED_MODULE_4__.Vector3(1, 1, 1),
  subregionOffset: new three__WEBPACK_IMPORTED_MODULE_4__.Vector3(0, 0, 0),
  physicalPixelSize: new three__WEBPACK_IMPORTED_MODULE_4__.Vector3(1, 1, 1),
  spatialUnit: "",
  numChannels: 0,
  channelNames: [],
  channelColors: [],
  times: 1,
  timeScale: 1,
  timeUnit: "",
  numMultiscaleLevels: 1,
  multiscaleLevel: 0,
  transform: {
    translation: new three__WEBPACK_IMPORTED_MODULE_4__.Vector3(0, 0, 0),
    rotation: new three__WEBPACK_IMPORTED_MODULE_4__.Vector3(0, 0, 0)
  }
});
/**
 * Provide dimensions of the volume data, including dimensions for texture atlas data in which the volume z slices
 * are tiled across a single large 2d image plane.
 * @typedef {Object} ImageInfo
 * @property {string} name Base name of image
 * @property {string} [version] Schema version preferably in semver format.
 * @property {Vector2} originalSize XY size of the *original* (not downsampled) volume, in pixels
 * @property {Vector2} atlasDims Number of rows and columns of z-slice tiles (not pixels) in the texture atlas
 * @property {Vector3} volumeSize Size of the volume, in pixels
 * @property {Vector3} regionSize Size of the currently loaded subregion, in pixels
 * @property {Vector3} regionOffset Offset of the loaded subregion into the total volume, in pixels
 * @property {Vector3} pixelSize Size of a single *original* (not downsampled) pixel, in spatial units
 * @property {string} spatialUnit Symbol of physical spatial unit used by `pixelSize`
 * @property {number} numChannels Number of channels
 * @property {Array.<string>} channelNames Names of each of the channels to be rendered, in order. Unique identifier expected
 * @property {Array.<Array.<number>>} [channelColors] Colors of each of the channels to be rendered, as an ordered list of [r, g, b] arrays
 * @property {number} times Number of times (default = 1)
 * @property {number} timeScale Size of each time step in `timeUnit` units
 * @property {number} timeUnit Unit symbol for `timeScale` (e.g. min)
 * @property {Object} transform translation and rotation as arrays of 3 numbers. Translation is in voxels (to be multiplied by pixel_size values). Rotation is Euler angles in radians, appled in XYZ order.
 * @property {Object} userData Arbitrary metadata not covered by above properties
 * @example const imgdata = {
  "name": "AICS-10_5_5",
  "version": "0.0.0",
  originalSize: new Vector2(306, 494),
  atlasDims: new Vector2(10, 7),
  volumeSize: new Vector3(204, 292, 65),
  regionSize: new Vector3(204, 292, 65),
  regionOffset: new Vector3(0, 0, 0),
  pixelSize: new Vector3(0.065, 0.065, 0.29),
  spatialUnit: "μm",
  "numChannels": 9,
  "channelNames": ["DRAQ5", "EGFP", "Hoechst 33258", "TL Brightfield", "SEG_STRUCT", "SEG_Memb", "SEG_DNA", "CON_Memb", "CON_DNA"],
  "times": 5,
  "timeScale": 1,
  "timeUnit": "hr",
  "transform": {
    "translation": new Vector3(5, 5, 1),
    "rotation": new Vector3(0, 3.14159, 1.57),
  },
  };
 */

/**
 * A renderable multichannel volume image with 8-bits per channel intensity values.
 * @class
 * @param {ImageInfo} imageInfo
 */
class Volume {
  // `LoadSpec` representing the minimum data required to display what's in the viewer (subregion, channels, etc.).
  // Used to intelligently issue load requests whenever required by a state change. Modify with `updateRequiredData`.

  constructor(imageInfo = getDefaultImageInfo(), loadSpec = new _loaders_IVolumeLoader_js__WEBPACK_IMPORTED_MODULE_2__.LoadSpec(), loader) {
    this.loaded = false;
    this.imageInfo = imageInfo;
    this.name = this.imageInfo.name;
    this.loadSpec = {
      // Fill in defaults for optional properties
      multiscaleLevel: 0,
      scaleLevelBias: 0,
      maxAtlasEdge: _loaders_VolumeLoaderUtils_js__WEBPACK_IMPORTED_MODULE_3__.MAX_ATLAS_EDGE,
      channels: Array.from({
        length: this.imageInfo.numChannels
      }, (_val, idx) => idx),
      ...loadSpec
    };
    this.loadSpecRequired = {
      ...this.loadSpec,
      channels: this.loadSpec.channels.slice(),
      subregion: this.loadSpec.subregion.clone()
    };
    this.loader = loader;
    // imageMetadata to be filled in by Volume Loaders
    this.imageMetadata = {};
    this.normRegionSize = new three__WEBPACK_IMPORTED_MODULE_4__.Vector3(1, 1, 1);
    this.normRegionOffset = new three__WEBPACK_IMPORTED_MODULE_4__.Vector3(0, 0, 0);
    this.physicalSize = new three__WEBPACK_IMPORTED_MODULE_4__.Vector3(1, 1, 1);
    this.physicalScale = 1;
    this.normPhysicalSize = new three__WEBPACK_IMPORTED_MODULE_4__.Vector3(1, 1, 1);
    this.physicalPixelSize = this.imageInfo.physicalPixelSize;
    this.tickMarkPhysicalLength = 1;
    this.setVoxelSize(this.physicalPixelSize);
    this.numChannels = this.imageInfo.numChannels;
    this.channelNames = this.imageInfo.channelNames.slice();
    this.channelColorsDefault = this.imageInfo.channelColors ? this.imageInfo.channelColors.slice() : this.channelNames.map((name, index) => (0,_constants_colors_js__WEBPACK_IMPORTED_MODULE_1__.getColorByChannelIndex)(index));
    // fill in gaps
    if (this.channelColorsDefault.length < this.imageInfo.numChannels) {
      for (let i = this.channelColorsDefault.length - 1; i < this.imageInfo.numChannels; ++i) {
        this.channelColorsDefault[i] = (0,_constants_colors_js__WEBPACK_IMPORTED_MODULE_1__.getColorByChannelIndex)(i);
      }
    }
    this.channels = [];
    for (let i = 0; i < this.imageInfo.numChannels; ++i) {
      const channel = new _Channel_js__WEBPACK_IMPORTED_MODULE_0__["default"](this.channelNames[i]);
      this.channels.push(channel);
      // TODO pass in channel constructor...
      channel.dims = this.imageInfo.subregionSize.toArray();
    }
    this.physicalUnitSymbol = this.imageInfo.spatialUnit;
    this.volumeDataObservers = [];
  }
  setUnloaded() {
    this.loaded = false;
    this.channels.forEach(channel => {
      channel.loaded = false;
    });
  }
  isLoaded() {
    return this.loaded;
  }
  updateDimensions() {
    const {
      volumeSize,
      subregionSize,
      subregionOffset
    } = this.imageInfo;
    this.setVoxelSize(this.physicalPixelSize);
    this.normRegionSize = subregionSize.clone().divide(volumeSize);
    this.normRegionOffset = subregionOffset.clone().divide(volumeSize);
  }

  /** Returns `true` iff differences between `loadSpec` and `loadSpecRequired` indicate new data *must* be loaded. */
  mustLoadNewData() {
    return this.loadSpec.time !== this.loadSpecRequired.time ||
    // time point changed
    !this.loadSpec.subregion.containsBox(this.loadSpecRequired.subregion) ||
    // new subregion not contained in old
    this.loadSpecRequired.channels.some(channel => !this.loadSpec.channels.includes(channel)) // new channel(s)
    ;
  }

  /**
   * Returns `true` iff differences between `loadSpec` and `loadSpecRequired` indicate a new load *may* get a
   * different scale level than is currently loaded.
   *
   * This checks for changes in properties that *can*, but do not *always*, change the scale level the loader picks.
   * For example, a smaller `subregion` *may* mean a higher scale level will fit within memory constraints, or it may
   * not. A higher `scaleLevelBias` *may* nudge the volume into a higher scale level, or we may already be at the max
   * imposed by `multiscaleLevel`.
   */
  mayLoadNewScaleLevel() {
    return !this.loadSpec.subregion.equals(this.loadSpecRequired.subregion) || this.loadSpecRequired.maxAtlasEdge !== this.loadSpec.maxAtlasEdge || this.loadSpecRequired.multiscaleLevel !== this.loadSpec.multiscaleLevel || this.loadSpecRequired.scaleLevelBias !== this.loadSpec.scaleLevelBias;
  }

  /** Call on any state update that may require new data to be loaded (subregion, enabled channels, time, etc.) */
  async updateRequiredData(required, onChannelLoaded) {
    this.loadSpecRequired = {
      ...this.loadSpecRequired,
      ...required
    };
    let shouldReload = this.mustLoadNewData();

    // If we're not reloading due to required data changes, check if we should load a new scale level
    if (!shouldReload && this.mayLoadNewScaleLevel()) {
      // Loaders should cache loaded dimensions so that this call blocks no more than once per valid `LoadSpec`.
      const dims = await this.loadScaleLevelDims();
      if (dims) {
        const dimsZYX = dims.map(({
          shape
        }) => [shape[2], shape[3], shape[4]]);
        // Determine which scale level *would* be loaded, and see if it's different than what we have
        const levelToLoad = (0,_loaders_VolumeLoaderUtils_js__WEBPACK_IMPORTED_MODULE_3__.pickLevelToLoadUnscaled)(this.loadSpecRequired, dimsZYX);
        shouldReload = this.imageInfo.multiscaleLevel !== levelToLoad;
      }
    }
    if (shouldReload) {
      this.loadNewData(onChannelLoaded);
    }
  }
  async loadScaleLevelDims() {
    try {
      return await this.loader?.loadDims(this.loadSpecRequired);
    } catch (e) {
      this.volumeDataObservers.forEach(observer => observer.onVolumeLoadError(this, e));
      return undefined;
    }
  }

  /**
   * Loads new data as specified in `this.loadSpecRequired`. Clones `loadSpecRequired` into `loadSpec` to indicate
   * that the data that *must* be loaded is now the data that *has* been loaded.
   */
  async loadNewData(onChannelLoaded) {
    this.setUnloaded();
    this.loadSpec = {
      ...this.loadSpecRequired,
      subregion: this.loadSpecRequired.subregion.clone()
    };
    try {
      await this.loader?.loadVolumeData(this, undefined, onChannelLoaded);
    } catch (e) {
      this.volumeDataObservers.forEach(observer => observer.onVolumeLoadError(this, e));
      throw e;
    }
  }

  // we calculate the physical size of the volume (voxels*pixel_size)
  // and then normalize to the max physical dimension
  setVoxelSize(size) {
    // only set the data if it is > 0.  zero is not an allowed value.
    size.x = size.x > 0 ? size.x : 1.0;
    size.y = size.y > 0 ? size.y : 1.0;
    size.z = size.z > 0 ? size.z : 1.0;
    this.physicalPixelSize = size;
    this.physicalSize = this.imageInfo.originalSize.clone().multiply(this.physicalPixelSize);
    // Volume is scaled such that its largest physical dimension is 1 world unit - save that dimension for conversions
    this.physicalScale = Math.max(this.physicalSize.x, this.physicalSize.y, this.physicalSize.z);
    // Compute the volume's max extent - scaled to max dimension.
    this.normPhysicalSize = this.physicalSize.clone().divideScalar(this.physicalScale);
    // While we're here, pick a power of 10 that divides into our max dimension a reasonable number of times
    // and save it to be the length of tick marks in 3d.
    this.tickMarkPhysicalLength = 10 ** Math.floor(Math.log10(this.physicalScale / 2));
  }
  setUnitSymbol(symbol) {
    this.physicalUnitSymbol = symbol;
  }

  /** Computes the center of the volume subset */
  getContentCenter() {
    // center point: (normRegionSize / 2 + normRegionOffset - 0.5) * normPhysicalSize;
    return this.normRegionSize.clone().divideScalar(2).add(this.normRegionOffset).subScalar(0.5).multiply(this.normPhysicalSize);
  }
  cleanup() {
    // no op
  }
  getChannel(channelIndex) {
    return this.channels[channelIndex];
  }
  onChannelLoaded(batch) {
    // check to see if all channels are now loaded, and fire an event(?)
    if (this.loadSpec.channels.every(channelIndex => this.channels[channelIndex].loaded)) {
      this.loaded = true;
    }
    batch.forEach(channelIndex => this.channelLoadCallback?.(this, channelIndex));
    this.volumeDataObservers.forEach(observer => observer.onVolumeData(this, batch));
  }

  /**
   * Assign volume data via a 2d array containing the z slices as tiles across it.  Assumes that the incoming data is consistent with the image's pre-existing imageInfo tile metadata.
   * @param {number} channelIndex
   * @param {Uint8Array} atlasdata
   * @param {number} atlaswidth
   * @param {number} atlasheight
   */
  setChannelDataFromAtlas(channelIndex, atlasdata, atlaswidth, atlasheight, range, dtype = "uint8") {
    this.channels[channelIndex].setFromAtlas(atlasdata, atlaswidth, atlasheight, dtype, range[0], range[1], this.imageInfo.subregionSize);
    this.onChannelLoaded([channelIndex]);
  }

  // ASSUMES that this.channelData.options is already set and incoming data is consistent with it
  /**
   * Assign volume data as a 3d array ordered x,y,z. The xy size must be equal to tilewidth*tileheight from the imageInfo used to construct this Volume.  Assumes that the incoming data is consistent with the image's pre-existing imageInfo tile metadata.
   * @param {number} channelIndex
   * @param {Uint8Array} volumeData
   */
  setChannelDataFromVolume(channelIndex, volumeData, range, dtype = "uint8") {
    const {
      subregionSize,
      atlasTileDims
    } = this.imageInfo;
    this.channels[channelIndex].setFromVolumeData(volumeData, subregionSize.x, subregionSize.y, subregionSize.z, atlasTileDims.x * subregionSize.x, atlasTileDims.y * subregionSize.y, range[0], range[1], dtype);
    this.onChannelLoaded([channelIndex]);
  }

  // TODO: decide if this should update imageInfo or not. For now, leave imageInfo alone as the "original" data
  /**
   * Add a new channel ready to receive data from one of the setChannelDataFrom* calls.
   * Name and color will be defaulted if not provided. For now, leave imageInfo alone as the "original" data
   * @param {string} name
   * @param {Array.<number>} color [r,g,b]
   */
  appendEmptyChannel(name, color) {
    const idx = this.imageInfo.numChannels;
    const chname = name || "channel_" + idx;
    const chcolor = color || (0,_constants_colors_js__WEBPACK_IMPORTED_MODULE_1__.getColorByChannelIndex)(idx);
    this.numChannels += 1;
    this.channelNames.push(chname);
    this.channelColorsDefault.push(chcolor);
    this.channels.push(new _Channel_js__WEBPACK_IMPORTED_MODULE_0__["default"](chname));
    for (let i = 0; i < this.volumeDataObservers.length; ++i) {
      this.volumeDataObservers[i].onVolumeChannelAdded(this, idx);
    }
    return idx;
  }

  /**
   * Get a value from the volume data
   * @return {number} the intensity value from the given channel at the given xyz location
   * @param {number} c The channel index
   * @param {number} x
   * @param {number} y
   * @param {number} z
   */
  getIntensity(c, x, y, z) {
    return this.channels[c].getIntensity(x, y, z);
  }

  /**
   * Get the 256-bin histogram for the given channel
   * @return {Histogram} the histogram
   * @param {number} c The channel index
   */
  getHistogram(c) {
    return this.channels[c].getHistogram();
  }

  /**
   * Set the lut for the given channel
   * @param {number} c The channel index
   * @param {Array.<number>} lut The lut as a 256 element array
   */
  setLut(c, lut) {
    this.channels[c].setLut(lut);
  }

  /**
   * Set the color palette for the given channel
   * @param {number} c The channel index
   * @param {Array.<number>} palette The colors as a 256 element array * RGBA
   */
  setColorPalette(c, palette) {
    this.channels[c].setColorPalette(palette);
  }

  /**
   * Set the color palette alpha multiplier for the given channel.
   * This will blend between the ordinary color lut and this colorPalette lut.
   * @param {number} c The channel index
   * @param {number} alpha The alpha value as a number from 0 to 1
   */
  setColorPaletteAlpha(c, alpha) {
    this.channels[c].setColorPaletteAlpha(alpha);
  }

  /**
   * Return the intrinsic rotation associated with this volume (radians)
   * @return {Array.<number>} the xyz Euler angles (radians)
   */
  getRotation() {
    // default axis order is XYZ
    return this.imageInfo.transform.rotation.toArray();
  }

  /**
   * Return the intrinsic translation (pivot center delta) associated with this volume, in normalized volume units
   * @return {Array.<number>} the xyz translation in normalized volume units
   */
  getTranslation() {
    return this.voxelsToWorldSpace(this.imageInfo.transform.translation.toArray());
  }

  /**
   * Return a translation in normalized volume units, given a translation in image voxels
   * @return {Array.<number>} the xyz translation in normalized volume units
   */
  voxelsToWorldSpace(xyz) {
    // ASSUME: translation is in original image voxels.
    // account for pixel_size and normalized scaling in the threejs volume representation we're using
    const m = 1.0 / Math.max(this.physicalSize.x, Math.max(this.physicalSize.y, this.physicalSize.z));
    return new three__WEBPACK_IMPORTED_MODULE_4__.Vector3().fromArray(xyz).multiply(this.physicalPixelSize).multiplyScalar(m).toArray();
  }
  addVolumeDataObserver(o) {
    this.volumeDataObservers.push(o);
  }
  removeVolumeDataObserver(o) {
    if (o) {
      const i = this.volumeDataObservers.indexOf(o);
      if (i !== -1) {
        this.volumeDataObservers.splice(i, 1);
      }
    }
  }
  removeAllVolumeDataObservers() {
    this.volumeDataObservers = [];
  }
}

/***/ }),

/***/ "./src/VolumeCache.ts":
/*!****************************!*\
  !*** ./src/VolumeCache.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ VolumeCache)
/* harmony export */ });
/** Default: 250MB. Should be large enough to be useful but safe for most any computer that can run the app */
const CACHE_MAX_SIZE_DEFAULT = 250_000_000;
class VolumeCache {
  // Ends of a linked list of entries, to track LRU and evict efficiently

  // TODO implement some way to manage used vs unused (prefetched) entries so
  // that prefetched entries which are never used don't get highest priority!

  constructor(maxSize = CACHE_MAX_SIZE_DEFAULT) {
    this.entries = new Map();
    this.maxSize = maxSize;
    this.currentSize = 0;
    this.first = null;
    this.last = null;
  }

  // Hide these behind getters so they're definitely never set from the outside
  /** The size of all data arrays currently stored in this cache, in bytes. */
  get size() {
    return this.currentSize;
  }

  /** The number of entries currently stored in this cache. */
  get numberOfEntries() {
    return this.entries.size;
  }

  /**
   * Removes an entry from a store but NOT the LRU list.
   * Only call from a method with the word "evict" in it!
   */
  removeEntryFromStore(entry) {
    this.entries.delete(entry.key);
    this.currentSize -= entry.data.byteLength;
  }

  /**
   * Removes an entry from the LRU list but NOT its store.
   * Entry must be replaced in list or removed from store, or it will never be evicted!
   */
  removeEntryFromList(entry) {
    const {
      prev,
      next
    } = entry;
    if (prev) {
      prev.next = next;
    } else {
      this.first = next;
    }
    if (next) {
      next.prev = prev;
    } else {
      this.last = prev;
    }
  }

  /** Adds an entry which is *not currently in the list* to the front of the list. */
  addEntryAsFirst(entry) {
    if (this.first) {
      this.first.prev = entry;
    } else {
      this.last = entry;
    }
    entry.next = this.first;
    entry.prev = null;
    this.first = entry;
  }

  /** Moves an entry which is *currently in the list* to the front of the list. */
  moveEntryToFirst(entry) {
    if (entry === this.first) return;
    this.removeEntryFromList(entry);
    this.addEntryAsFirst(entry);
  }

  /** Evicts the least recently used entry from the cache. */
  evictLast() {
    if (!this.last) {
      console.error("VolumeCache: attempt to evict last entry from cache when no last entry is set");
      return;
    }
    this.removeEntryFromStore(this.last);
    if (this.last.prev) {
      this.last.prev.next = null;
    }
    this.last = this.last.prev;
  }

  /** Evicts a specific entry from the cache. */
  evict(entry) {
    this.removeEntryFromStore(entry);
    this.removeEntryFromList(entry);
  }

  /**
   * Adds a new entry to the cache.
   * @returns {boolean} a boolean indicating whether the insertion succeeded.
   */
  insert(key, data) {
    if (data.byteLength > this.maxSize) {
      console.error("VolumeCache: attempt to insert a single entry larger than the cache");
      return false;
    }

    // Check if entry is already in cache
    // This will move the entry to the front of the LRU list, if present
    const getResult = this.getEntry(key);
    if (getResult !== undefined) {
      getResult.data = data;
      return true;
    }

    // Add new entry to cache
    const newEntry = {
      data,
      prev: null,
      next: null,
      key
    };
    this.addEntryAsFirst(newEntry);
    this.entries.set(key, newEntry);
    this.currentSize += data.byteLength;

    // Evict until size is within limit
    while (this.currentSize > this.maxSize) {
      this.evictLast();
    }
    return true;
  }

  /** Internal implementation of `get`. Returns all entry metadata, not just the raw data. */
  getEntry(key) {
    const result = this.entries.get(key);
    if (result) {
      this.moveEntryToFirst(result);
    }
    return result;
  }

  /** Attempts to get a single entry from the cache. */
  get(key) {
    return this.getEntry(key)?.data;
  }

  /** Clears all cache entries whose keys begin with the specified prefix. */
  clearWithPrefix(prefix) {
    for (const [key, entry] of this.entries.entries()) {
      if (key.startsWith(prefix)) {
        this.evict(entry);
      }
    }
  }

  /** Clears all data from the cache. */
  clear() {
    while (this.last) {
      this.evictLast();
    }
  }
}

/***/ }),

/***/ "./src/constants/colors.ts":
/*!*********************************!*\
  !*** ./src/constants/colors.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   defaultColors: () => (/* binding */ defaultColors),
/* harmony export */   getColorByChannelIndex: () => (/* binding */ getColorByChannelIndex)
/* harmony export */ });
const defaultColors = [[255, 0, 255], [255, 255, 255], [0, 255, 255]];
// 0 <= (h, s, v) <= 1
// returns 0 <= (r, g, b) <= 255 rounded to nearest integer
// you can also pass in just one arg as an object of {h, s, v} props.
function HSVtoRGB(h, s, v) {
  let r, g, b;
  let hh = 0;
  if (arguments.length === 1) {
    const hsv = h;
    s = hsv.s, v = hsv.v, hh = hsv.h;
  } else {
    hh = h;
  }
  const i = Math.floor(hh * 6);
  const f = hh * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0:
      r = v, g = t, b = p;
      break;
    case 1:
      r = q, g = v, b = p;
      break;
    case 2:
      r = p, g = v, b = t;
      break;
    case 3:
      r = p, g = q, b = v;
      break;
    case 4:
      r = t, g = p, b = v;
      break;
    case 5:
      r = v, g = p, b = q;
      break;
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// 1993 Park-Miller LCG
function LCG(s) {
  return function () {
    s = Math.imul(48271, s) | 0 % 2147483647;
    return (s & 2147483647) / 2147483648;
  };
}
// Use it like so:
const myrand = LCG(123);

// if index exceeds defaultColors start choosing random ones
// returns [r,g,b] 0-255 range
const getColorByChannelIndex = index => {
  if (!defaultColors[index]) {
    defaultColors[index] = HSVtoRGB(myrand(), myrand() * 0.5 + 0.5, myrand() * 0.5 + 0.5);
  }
  return defaultColors[index];
};

/***/ }),

/***/ "./src/loaders/IVolumeLoader.ts":
/*!**************************************!*\
  !*** ./src/loaders/IVolumeLoader.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LoadSpec: () => (/* binding */ LoadSpec),
/* harmony export */   ThreadableVolumeLoader: () => (/* binding */ ThreadableVolumeLoader),
/* harmony export */   VolumeDims: () => (/* binding */ VolumeDims),
/* harmony export */   loadSpecToString: () => (/* binding */ loadSpecToString)
/* harmony export */ });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var _Volume_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Volume.js */ "./src/Volume.ts");
/* harmony import */ var _VolumeLoaderUtils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./VolumeLoaderUtils.js */ "./src/loaders/VolumeLoaderUtils.ts");



class LoadSpec {
  time = 0;
  /** The max size of a volume atlas that may be produced by a load. Used to pick the appropriate multiscale level. */

  /** An optional bias added to the scale level index after the optimal level is picked based on `maxAtlasEdge`. */

  /**
   * The max scale level to load. Even when this is specified, the loader may pick a *lower* scale level based on
   * limits imposed by `scaleLevelBias` and `maxAtlasEdge` (or their defaults if unspecified).
   */

  /** Subregion of volume to load. If not specified, the entire volume is loaded. Specify as floats between 0-1. */
  subregion = new three__WEBPACK_IMPORTED_MODULE_2__.Box3(new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(0, 0, 0), new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(1, 1, 1));
}
function loadSpecToString(spec) {
  const {
    min,
    max
  } = spec.subregion;
  return `${spec.multiscaleLevel}:${spec.time}:x(${min.x},${max.x}):y(${min.y},${max.y}):z(${min.z},${max.z})`;
}
class VolumeDims {
  // shape: [t, c, z, y, x]
  shape = [0, 0, 0, 0, 0];
  // spacing: [t, c, z, y, x]; generally expect 1 for non-spatial dimensions
  spacing = [1, 1, 1, 1, 1];
  spaceUnit = "μm";
  timeUnit = "s";
  // TODO make this an enum?
  dataType = "uint8";
}

/**
 * @callback PerChannelCallback
 * @param {string} imageurl
 * @param {Volume} volume
 * @param {number} channelindex
 */

/**
 * @callback RawChannelDataCallback - allow lists of channel indices and data arrays to be passed to the callback
 * @param {number[]} channelIndex - The indices of the channels that were loaded
 * @param {NumberType[]} dtype - The data type of the data arrays
 * @param {TypedArray<NumberType>[]} data - The raw data for each channel
 * @param {[number, number][]} ranges - The min and max values for each channel in their original range
 * @param {[number, number]} atlasDims - The dimensions of the atlas, if the data is in an atlas format
 */

/**
 * Loads volume data from a source specified by a `LoadSpec`.
 *
 * Loaders may keep state for reuse between volume creation and volume loading, and should be kept alive until volume
 * loading is complete. (See `createVolume`)
 */

/** Abstract class which allows loaders to accept and return types that are easier to transfer to/from a worker. */
class ThreadableVolumeLoader {
  /** Unchanged from `IVolumeLoader`. See that interface for details. */

  /**
   * Creates an `ImageInfo` object from a `LoadSpec`, which may be passed to the `Volume` constructor to create an
   * empty volume that can accept data loaded with the given `LoadSpec`.
   *
   * Also returns a new `LoadSpec` that may have been modified from the input `LoadSpec` to reflect the constraints or
   * abilities of the loader. This new `LoadSpec` should be used when constructing the `Volume`, _not_ the original.
   */

  /**
   * Begins loading per-channel data for the volume specified by `imageInfo` and `loadSpec`.
   *
   * This function accepts two required callbacks. The first, `onUpdateVolumeMetadata`, should be called at most once
   * to modify the `Volume`'s `imageInfo` and/or `loadSpec` properties based on changes made by this load. Actual
   * loaded channel data is passed to `onData` as it is loaded.
   *
   * Depending on the loader, the array passed to `onData` may be in simple 3d dimension order or reflect a 2d atlas.
   * If the latter, the dimensions of the atlas are passed as the third argument to `onData`.
   *
   * The returned promise should resolve when all data has been loaded, or reject if any error occurs while loading.
   */

  setPrefetchPriority(_directions) {
    // no-op by default
  }
  syncMultichannelLoading(_sync) {
    // default behavior is async, to update channels as they arrive, depending on each
    // loader's implementation details.
  }
  async createVolume(loadSpec, onChannelLoaded) {
    const {
      imageInfo,
      loadSpec: adjustedLoadSpec
    } = await this.createImageInfo(loadSpec);
    const vol = new _Volume_js__WEBPACK_IMPORTED_MODULE_0__["default"](imageInfo, adjustedLoadSpec, this);
    vol.channelLoadCallback = onChannelLoaded;
    vol.imageMetadata = (0,_VolumeLoaderUtils_js__WEBPACK_IMPORTED_MODULE_1__.buildDefaultMetadata)(imageInfo);
    return vol;
  }
  async loadVolumeData(volume, loadSpecOverride, onChannelLoaded) {
    const onUpdateMetadata = (imageInfo, loadSpec) => {
      if (imageInfo) {
        volume.imageInfo = imageInfo;
        volume.updateDimensions();
      }
      volume.loadSpec = {
        ...loadSpec,
        ...spec
      };
    };
    const onChannelData = (channelIndices, dtypes, dataArrays, ranges, atlasDims) => {
      for (let i = 0; i < channelIndices.length; i++) {
        const channelIndex = channelIndices[i];
        const dtype = dtypes[i];
        const data = dataArrays[i];
        const range = ranges[i];
        if (atlasDims) {
          volume.setChannelDataFromAtlas(channelIndex, data, atlasDims[0], atlasDims[1], range, dtype);
        } else {
          volume.setChannelDataFromVolume(channelIndex, data, range, dtype);
        }
        onChannelLoaded?.(volume, channelIndex);
      }
    };
    const spec = {
      ...volume.loadSpec,
      ...loadSpecOverride
    };
    return this.loadRawChannelData(volume.imageInfo, spec, onUpdateMetadata, onChannelData);
  }
}

/***/ }),

/***/ "./src/loaders/JsonImageInfoLoader.ts":
/*!********************************************!*\
  !*** ./src/loaders/JsonImageInfoLoader.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   JsonImageInfoLoader: () => (/* binding */ JsonImageInfoLoader)
/* harmony export */ });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var _IVolumeLoader_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./IVolumeLoader.js */ "./src/loaders/IVolumeLoader.ts");
/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../types.js */ "./src/types.ts");




/* eslint-disable @typescript-eslint/naming-convention */

/* eslint-enable @typescript-eslint/naming-convention */

const convertImageInfo = json => ({
  name: json.name,
  originalSize: new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(json.width, json.height, json.tiles),
  atlasTileDims: new three__WEBPACK_IMPORTED_MODULE_2__.Vector2(json.cols, json.rows),
  volumeSize: new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(json.tile_width, json.tile_height, json.tiles),
  subregionSize: new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(json.tile_width, json.tile_height, json.tiles),
  subregionOffset: new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(0, 0, 0),
  physicalPixelSize: new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(json.pixel_size_x, json.pixel_size_y, json.pixel_size_z),
  spatialUnit: json.pixel_size_unit || "μm",
  numChannels: json.channels,
  channelNames: json.channel_names,
  channelColors: json.channel_colors,
  times: json.times || 1,
  timeScale: json.time_scale || 1,
  timeUnit: json.time_unit || "s",
  numMultiscaleLevels: 1,
  multiscaleLevel: 0,
  transform: {
    translation: json.transform?.translation ? new three__WEBPACK_IMPORTED_MODULE_2__.Vector3().fromArray(json.transform.translation) : new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(0, 0, 0),
    rotation: json.transform?.rotation ? new three__WEBPACK_IMPORTED_MODULE_2__.Vector3().fromArray(json.transform.rotation) : new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(0, 0, 0)
  },
  userData: json.userData
});
class JsonImageInfoLoader extends _IVolumeLoader_js__WEBPACK_IMPORTED_MODULE_0__.ThreadableVolumeLoader {
  constructor(urls, cache) {
    super();
    if (Array.isArray(urls)) {
      this.urls = urls;
    } else {
      this.urls = [urls];
    }
    this.jsonInfo = new Array(this.urls.length);
    this.cache = cache;
  }
  async getJsonImageInfo(time) {
    const cachedInfo = this.jsonInfo[time];
    if (cachedInfo) {
      return cachedInfo;
    }
    const response = await fetch(this.urls[time]);
    const imageInfo = await response.json();
    imageInfo.pixel_size_unit = imageInfo.pixel_size_unit || "μm";
    imageInfo.times = imageInfo.times || this.urls.length;
    this.jsonInfo[time] = imageInfo;
    return imageInfo;
  }
  async loadDims(loadSpec) {
    const jsonInfo = await this.getJsonImageInfo(loadSpec.time);
    const d = new _IVolumeLoader_js__WEBPACK_IMPORTED_MODULE_0__.VolumeDims();
    d.shape = [jsonInfo.times || 1, jsonInfo.channels, jsonInfo.tiles, jsonInfo.tile_height, jsonInfo.tile_width];
    d.spacing = [1, 1, jsonInfo.pixel_size_z, jsonInfo.pixel_size_y, jsonInfo.pixel_size_x];
    d.spaceUnit = jsonInfo.pixel_size_unit || "μm";
    d.dataType = "uint8";
    return [d];
  }
  async createImageInfo(loadSpec) {
    const jsonInfo = await this.getJsonImageInfo(loadSpec.time);
    return {
      imageInfo: convertImageInfo(jsonInfo),
      loadSpec
    };
  }
  async loadRawChannelData(imageInfo, loadSpec, onUpdateMetadata, onData) {
    // if you need to adjust image paths prior to download,
    // now is the time to do it.
    // Try to figure out the urlPrefix from the LoadSpec.
    // For this format we assume the image data is in the same directory as the json file.
    const jsonInfo = await this.getJsonImageInfo(loadSpec.time);
    let images = jsonInfo?.images;
    if (!images) {
      return;
    }
    const requestedChannels = loadSpec.channels;
    if (requestedChannels) {
      // If only some channels are requested, load only images which contain at least one requested channel
      images = images.filter(({
        channels
      }) => channels.some(ch => ch in requestedChannels));
    }

    // This regex removes everything after the last slash, so the url had better be simple.
    const urlPrefix = this.urls[loadSpec.time].replace(/[^/]*$/, "");
    images = images.map(element => ({
      ...element,
      name: urlPrefix + element.name
    }));

    // Update `image`'s `loadSpec` before loading
    const adjustedLoadSpec = {
      ...loadSpec,
      // `subregion` and `multiscaleLevel` are unused by this loader
      subregion: new three__WEBPACK_IMPORTED_MODULE_2__.Box3(new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(0, 0, 0), new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(1, 1, 1)),
      multiscaleLevel: 0,
      // include all channels in any loaded images
      channels: images.flatMap(({
        channels
      }) => channels)
    };
    onUpdateMetadata(undefined, adjustedLoadSpec);
    const w = imageInfo.atlasTileDims.x * imageInfo.volumeSize.x;
    const h = imageInfo.atlasTileDims.y * imageInfo.volumeSize.y;
    const wrappedOnData = (ch, dtype, data, ranges) => onData(ch, dtype, data, ranges, [w, h]);
    await JsonImageInfoLoader.loadVolumeAtlasData(images, wrappedOnData, this.cache);
  }

  /**
   * load per-channel volume data from a batch of image files containing the volume slices tiled across the images
   * @param {Array.<{name:string, channels:Array.<number>}>} imageArray
   * @param {RawChannelDataCallback} onData Per-channel callback. Called when each channel's atlased volume data is loaded
   * @param {VolumeCache} cache
   * @example loadVolumeAtlasData([{
   *     "name": "AICS-10_5_5.ome.tif_atlas_0.png",
   *     "channels": [0, 1, 2]
   * }, {
   *     "name": "AICS-10_5_5.ome.tif_atlas_1.png",
   *     "channels": [3, 4, 5]
   * }, {
   *     "name": "AICS-10_5_5.ome.tif_atlas_2.png",
   *     "channels": [6, 7, 8]
   * }], mycallback);
   */
  static async loadVolumeAtlasData(imageArray, onData, cache) {
    const imagePromises = imageArray.map(async image => {
      // Because the data is fetched such that one fetch returns a whole batch,
      // if any in batch is cached then they all should be. So if any in batch is NOT cached,
      // then we will have to do a batch request. This logic works both ways because it's all or nothing.
      let cacheHit = true;
      for (let j = 0; j < Math.min(image.channels.length, 4); ++j) {
        const chindex = image.channels[j];
        const cacheResult = cache?.get(`${image.name}/${chindex}`);
        if (cacheResult) {
          // all data coming from this loader is natively 8-bit
          onData([chindex], ["uint8"], [new Uint8Array(cacheResult)], [_types_js__WEBPACK_IMPORTED_MODULE_1__.DATARANGE_UINT8]);
        } else {
          cacheHit = false;
          // we can stop checking because we know we are going to have to fetch the whole batch
          break;
        }
      }

      // if all channels were in cache then we can move on to the next
      // image (batch) without requesting
      if (cacheHit) {
        return;
      }
      const response = await fetch(image.name, {
        mode: "cors"
      });
      const blob = await response.blob();
      const bitmap = await createImageBitmap(blob);
      const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        console.log("Error creating canvas 2d context for " + image.name);
        return;
      }
      ctx.globalCompositeOperation = "copy";
      ctx.globalAlpha = 1.0;
      ctx.drawImage(bitmap, 0, 0);
      const iData = ctx.getImageData(0, 0, bitmap.width, bitmap.height);
      const channelsBits = [];
      const length = bitmap.width * bitmap.height;

      // allocate channels in batch
      for (let ch = 0; ch < Math.min(image.channels.length, 4); ++ch) {
        channelsBits.push(new Uint8Array(length));
      }

      // extract the data
      for (let j = 0; j < Math.min(image.channels.length, 4); ++j) {
        for (let px = 0; px < length; px++) {
          channelsBits[j][px] = iData.data[px * 4 + j];
        }
      }

      // done with `iData` and `canvas` now.

      for (let ch = 0; ch < Math.min(image.channels.length, 4); ++ch) {
        const chindex = image.channels[ch];
        cache?.insert(`${image.name}/${chindex}`, channelsBits[ch]);
        // NOTE: the atlas dimensions passed in here are currently unused by `JSONImageInfoLoader`
        // all data coming from this loader is natively 8-bit
        onData([chindex], ["uint8"], [channelsBits[ch]], [_types_js__WEBPACK_IMPORTED_MODULE_1__.DATARANGE_UINT8], [bitmap.width, bitmap.height]);
      }
    });
    await Promise.all(imagePromises);
  }
}


/***/ }),

/***/ "./src/loaders/OmeZarrLoader.ts":
/*!**************************************!*\
  !*** ./src/loaders/OmeZarrLoader.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OMEZarrLoader: () => (/* binding */ OMEZarrLoader)
/* harmony export */ });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var _zarrita_core__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @zarrita/core */ "./node_modules/@zarrita/core/dist/src/hierarchy.js");
/* harmony import */ var _zarrita_core__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @zarrita/core */ "./node_modules/@zarrita/core/dist/src/open.js");
/* harmony import */ var _zarrita_indexing__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @zarrita/indexing */ "./node_modules/@zarrita/indexing/dist/src/util.js");
/* harmony import */ var _zarrita_indexing__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @zarrita/indexing */ "./node_modules/@zarrita/indexing/dist/src/ops.js");
/* harmony import */ var zarrita__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! zarrita */ "./node_modules/@zarrita/storage/dist/src/fetch.js");
/* harmony import */ var _utils_SubscribableRequestQueue_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/SubscribableRequestQueue.js */ "./src/utils/SubscribableRequestQueue.ts");
/* harmony import */ var _IVolumeLoader_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./IVolumeLoader.js */ "./src/loaders/IVolumeLoader.ts");
/* harmony import */ var _VolumeLoaderUtils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./VolumeLoaderUtils.js */ "./src/loaders/VolumeLoaderUtils.ts");
/* harmony import */ var _zarr_utils_ChunkPrefetchIterator_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./zarr_utils/ChunkPrefetchIterator.js */ "./src/loaders/zarr_utils/ChunkPrefetchIterator.ts");
/* harmony import */ var _zarr_utils_WrappedStore_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./zarr_utils/WrappedStore.js */ "./src/loaders/zarr_utils/WrappedStore.ts");
/* harmony import */ var _zarr_utils_utils_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./zarr_utils/utils.js */ "./src/loaders/zarr_utils/utils.ts");
/* harmony import */ var _VolumeLoadError_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./VolumeLoadError.js */ "./src/loaders/VolumeLoadError.ts");
/* harmony import */ var _zarr_utils_validation_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./zarr_utils/validation.js */ "./src/loaders/zarr_utils/validation.ts");



// Importing `FetchStore` from its home subpackage (@zarrita/storage) causes errors.
// Getting it from the top-level package means we don't get its type. This is also a bug, but it's more acceptable.









const CHUNK_REQUEST_CANCEL_REASON = "chunk request cancelled";

// returns the converted data and the original min and max values
function convertChannel(channelData, dtype) {
  // get min and max
  // TODO FIXME Histogram will also compute min and max!
  let min = channelData[0];
  let max = channelData[0];
  for (let i = 0; i < channelData.length; i++) {
    const val = channelData[i];
    if (val < min) {
      min = val;
    }
    if (val > max) {
      max = val;
    }
  }
  if (dtype === "float64") {
    // convert to float32
    const f32 = new Float32Array(channelData.length);
    for (let i = 0; i < channelData.length; i++) {
      f32[i] = channelData[i];
    }
    dtype = "float32";
    channelData = f32;
  }
  return {
    data: channelData,
    dtype,
    min,
    max
  };
}
const DEFAULT_FETCH_OPTIONS = {
  maxPrefetchDistance: [5, 5, 5, 5],
  maxPrefetchChunks: 30
};
class OMEZarrLoader extends _IVolumeLoader_js__WEBPACK_IMPORTED_MODULE_1__.ThreadableVolumeLoader {
  /** The ID of the subscriber responsible for "actual loads" (non-prefetch requests) */

  /** The ID of the subscriber responsible for prefetches, so that requests can be cancelled and reissued */

  // TODO: this property should definitely be owned by `Volume` if this loader is ever used by multiple volumes.
  //   This may cause errors or incorrect results otherwise!

  syncChannels = false;
  constructor(
  /**
   * Array of records, each containing the objects and metadata we need to load from one source of multiscale zarr
   * data. See documentation on `ZarrSource` for more.
   */
  sources, /** Handle to a `SubscribableRequestQueue` for smart concurrency management and request cancelling/reissuing. */
  requestQueue, /** Options to configure (pre)fetching behavior. */
  fetchOptions = DEFAULT_FETCH_OPTIONS, /** Direction(s) to prioritize when prefetching. Stored separate from `fetchOptions` since it may be mutated. */
  priorityDirections = []) {
    super();
    this.sources = sources;
    this.requestQueue = requestQueue;
    this.fetchOptions = fetchOptions;
    this.priorityDirections = priorityDirections;
  }

  /**
   * Creates a new `OMEZarrLoader`.
   *
   * @param urls The URL(s) of the OME-Zarr data to load. If `urls` is an array, the loader will attempt to find scale
   *  levels with exactly the same size in every source. If matching level(s) are available, the loader will produce a
   *  volume containing all channels from every provided zarr in the order they appear in `urls`. If no matching sets
   *  of scale levels are available, creation fails.
   * @param scenes The scene(s) to load from each URL. If `urls` is an array, `scenes` may either be an array of values
   *  corresponding to each URL, or a single value to apply to all URLs. Default 0.
   * @param cache A cache to use for storing fetched data. If not provided, a new cache will be created.
   * @param queue A queue to use for managing requests. If not provided, a new queue will be created.
   * @param fetchOptions Options to configure (pre)fetching behavior.
   */
  static async createLoader(urls, scenes = 0, cache, queue, fetchOptions) {
    // Setup queue and store, get basic metadata
    if (!queue) {
      queue = new _utils_SubscribableRequestQueue_js__WEBPACK_IMPORTED_MODULE_0__["default"](fetchOptions?.concurrencyLimit, fetchOptions?.prefetchConcurrencyLimit);
    }
    const urlsArr = Array.isArray(urls) ? urls : [urls];
    const scenesArr = Array.isArray(scenes) ? scenes : [scenes];

    // Create one `ZarrSource` per URL
    const sourceProms = urlsArr.map(async (url, i) => {
      const store = new _zarr_utils_WrappedStore_js__WEBPACK_IMPORTED_MODULE_4__["default"](new zarrita__WEBPACK_IMPORTED_MODULE_8__["default"](url), cache, queue);
      const root = _zarrita_core__WEBPACK_IMPORTED_MODULE_9__.root(store);
      const group = await _zarrita_core__WEBPACK_IMPORTED_MODULE_10__.open(root, {
        kind: "group"
      }).catch((0,_VolumeLoadError_js__WEBPACK_IMPORTED_MODULE_6__.wrapVolumeLoadError)(`Failed to open OME-Zarr data at ${url}`, _VolumeLoadError_js__WEBPACK_IMPORTED_MODULE_6__.VolumeLoadErrorType.NOT_FOUND));

      // Pick scene (multiscale)
      let scene = scenesArr[Math.min(i, scenesArr.length - 1)];
      if (scene > group.attrs.multiscales?.length) {
        console.warn(`WARNING: OMEZarrLoader: scene ${scene} is invalid. Using scene 0.`);
        scene = 0;
      }
      (0,_zarr_utils_validation_js__WEBPACK_IMPORTED_MODULE_7__.validateOMEZarrMetadata)(group.attrs, scene, urlsArr.length > 1 ? `Zarr source ${i}` : "Zarr");
      const {
        multiscales,
        omero
      } = group.attrs;
      const multiscaleMetadata = multiscales[scene];

      // Open all scale levels of multiscale
      const lvlProms = multiscaleMetadata.datasets.map(({
        path
      }) => _zarrita_core__WEBPACK_IMPORTED_MODULE_10__.open(root.resolve(path), {
        kind: "array"
      }).catch((0,_VolumeLoadError_js__WEBPACK_IMPORTED_MODULE_6__.wrapVolumeLoadError)(`Failed to open scale level ${path} of OME-Zarr data at ${url}`, _VolumeLoadError_js__WEBPACK_IMPORTED_MODULE_6__.VolumeLoadErrorType.NOT_FOUND)));
      const scaleLevels = await Promise.all(lvlProms);
      const axesTCZYX = (0,_zarr_utils_utils_js__WEBPACK_IMPORTED_MODULE_5__.remapAxesToTCZYX)(multiscaleMetadata.axes);
      return {
        scaleLevels,
        multiscaleMetadata,
        omeroMetadata: omero,
        axesTCZYX,
        channelOffset: 0
      };
    });
    const sources = await Promise.all(sourceProms);

    // Set `channelOffset`s so we can match channel indices to sources
    let channelCount = 0;
    for (const s of sources) {
      s.channelOffset = channelCount;
      channelCount += s.omeroMetadata?.channels.length ?? s.scaleLevels[0].shape[s.axesTCZYX[1]];
    }
    // Ensure the sizes of all sources' scale levels are matched up. See this function's docs for more.
    (0,_zarr_utils_utils_js__WEBPACK_IMPORTED_MODULE_5__.matchSourceScaleLevels)(sources);
    // TODO: if `matchSourceScaleLevels` returned successfully, every one of these sources' `multiscaleMetadata` is the
    // same in every field we care about, so we only ever use the first source's `multiscaleMetadata` after this point.
    // Should we only store one `OMEMultiscale` record total, rather than one per source?
    const priorityDirs = fetchOptions?.priorityDirections ? fetchOptions.priorityDirections.slice() : undefined;
    return new OMEZarrLoader(sources, queue, fetchOptions, priorityDirs);
  }
  getUnitSymbols() {
    const source = this.sources[0];
    // Assume all spatial axes in all sources have the same units - we have no means of storing per-axis unit symbols
    const xi = source.axesTCZYX[4];
    const spaceUnitName = source.multiscaleMetadata.axes[xi].unit;
    const spaceUnitSymbol = (0,_VolumeLoaderUtils_js__WEBPACK_IMPORTED_MODULE_2__.unitNameToSymbol)(spaceUnitName) || spaceUnitName || "";
    const ti = source.axesTCZYX[0];
    const timeUnitName = ti > -1 ? source.multiscaleMetadata.axes[ti].unit : undefined;
    const timeUnitSymbol = (0,_VolumeLoaderUtils_js__WEBPACK_IMPORTED_MODULE_2__.unitNameToSymbol)(timeUnitName) || timeUnitName || "";
    return [spaceUnitSymbol, timeUnitSymbol];
  }
  getLevelShapesZYX() {
    const source = this.sources[0];
    const [z, y, x] = source.axesTCZYX.slice(-3);
    return source.scaleLevels.map(({
      shape
    }) => [z === -1 ? 1 : shape[z], shape[y], shape[x]]);
  }
  getScale(level) {
    return (0,_zarr_utils_utils_js__WEBPACK_IMPORTED_MODULE_5__.getScale)(this.sources[0].multiscaleMetadata.datasets[level], this.sources[0].axesTCZYX);
  }
  orderByDimension(valsTCZYX, sourceIdx = 0) {
    return (0,_zarr_utils_utils_js__WEBPACK_IMPORTED_MODULE_5__.orderByDimension)(valsTCZYX, this.sources[sourceIdx].axesTCZYX);
  }
  orderByTCZYX(valsDimension, defaultValue, sourceIdx = 0) {
    return (0,_zarr_utils_utils_js__WEBPACK_IMPORTED_MODULE_5__.orderByTCZYX)(valsDimension, this.sources[sourceIdx].axesTCZYX, defaultValue);
  }

  /**
   * Converts a volume channel index to the index of its zarr source and its channel index within that zarr.
   * e.g., if the loader has 2 sources, the first with 3 channels and the second with 2, then `matchChannelToSource(4)`
   * returns `[1, 1]` (the second channel of the second source).
   */
  matchChannelToSource(absoluteChannelIndex) {
    const lastSrcIdx = this.sources.length - 1;
    const lastSrc = this.sources[lastSrcIdx];
    const lastSrcNumChannels = lastSrc.scaleLevels[0].shape[lastSrc.axesTCZYX[1]];
    const maxChannelIndex = lastSrc.channelOffset + lastSrcNumChannels;
    if (absoluteChannelIndex > maxChannelIndex) {
      throw new _VolumeLoadError_js__WEBPACK_IMPORTED_MODULE_6__.VolumeLoadError(`Volume channel index ${absoluteChannelIndex} out of range (${maxChannelIndex} channels available)`, {
        type: _VolumeLoadError_js__WEBPACK_IMPORTED_MODULE_6__.VolumeLoadErrorType.INVALID_METADATA
      });
    }
    const firstGreaterIdx = this.sources.findIndex(src => src.channelOffset > absoluteChannelIndex);
    const sourceIndex = firstGreaterIdx === -1 ? lastSrcIdx : firstGreaterIdx - 1;
    const channelIndexInSource = absoluteChannelIndex - this.sources[sourceIndex].channelOffset;
    return {
      sourceIndex,
      channelIndexInSource
    };
  }

  /**
   * Change which directions to prioritize when prefetching. All chunks will be prefetched in these directions before
   * any chunks are prefetched in any other directions.
   */
  setPrefetchPriority(directions) {
    this.priorityDirections = directions;
  }
  syncMultichannelLoading(sync) {
    this.syncChannels = sync;
  }
  loadDims(loadSpec) {
    const [spaceUnit, timeUnit] = this.getUnitSymbols();
    // Compute subregion size so we can factor that in
    const maxExtent = this.maxExtent ?? new three__WEBPACK_IMPORTED_MODULE_11__.Box3(new three__WEBPACK_IMPORTED_MODULE_11__.Vector3(0, 0, 0), new three__WEBPACK_IMPORTED_MODULE_11__.Vector3(1, 1, 1));
    const subregion = (0,_VolumeLoaderUtils_js__WEBPACK_IMPORTED_MODULE_2__.composeSubregion)(loadSpec.subregion, maxExtent);
    const regionSize = subregion.getSize(new three__WEBPACK_IMPORTED_MODULE_11__.Vector3());
    const regionArr = [1, 1, regionSize.z, regionSize.y, regionSize.x];
    const result = this.sources[0].scaleLevels.map((level, i) => {
      const scale = this.getScale(i);
      const dims = new _IVolumeLoader_js__WEBPACK_IMPORTED_MODULE_1__.VolumeDims();
      dims.spaceUnit = spaceUnit;
      dims.timeUnit = timeUnit;
      dims.shape = this.orderByTCZYX(level.shape, 1).map((val, idx) => Math.max(Math.ceil(val * regionArr[idx]), 1));
      dims.spacing = this.orderByTCZYX(scale, 1);
      return dims;
    });
    return Promise.resolve(result);
  }
  createImageInfo(loadSpec) {
    // We ensured most info (dims, chunks, etc.) matched between sources earlier, so we can just use the first source.
    const source0 = this.sources[0];
    const [t,, z, y, x] = source0.axesTCZYX;
    const hasT = t > -1;
    const hasZ = z > -1;
    const shape0 = source0.scaleLevels[0].shape;
    const levelToLoad = (0,_VolumeLoaderUtils_js__WEBPACK_IMPORTED_MODULE_2__.pickLevelToLoad)(loadSpec, this.getLevelShapesZYX());
    const shapeLv = source0.scaleLevels[levelToLoad].shape;
    const [spatialUnit, timeUnit] = this.getUnitSymbols();

    // Now we care about other sources: # of channels is the `channelOffset` of the last source plus its # of channels
    const sourceLast = this.sources[this.sources.length - 1];
    const cLast = sourceLast.axesTCZYX[1];
    const lastHasC = cLast > -1;
    const numChannels = sourceLast.channelOffset + (lastHasC ? sourceLast.scaleLevels[levelToLoad].shape[cLast] : 1);
    // we need to make sure that the corresponding matched shapes
    // use the min size of T
    let times = 1;
    if (hasT) {
      times = shapeLv[t];
      for (let i = 0; i < this.sources.length; i++) {
        const shape = this.sources[i].scaleLevels[levelToLoad].shape;
        const tindex = this.sources[i].axesTCZYX[0];
        if (shape[tindex] < times) {
          console.warn("The number of time points is not consistent across sources: ", shape[tindex], times);
          times = shape[tindex];
        }
      }
    }
    if (!this.maxExtent) {
      this.maxExtent = loadSpec.subregion.clone();
    }
    const pxDims0 = (0,_VolumeLoaderUtils_js__WEBPACK_IMPORTED_MODULE_2__.convertSubregionToPixels)(loadSpec.subregion, new three__WEBPACK_IMPORTED_MODULE_11__.Vector3(shape0[x], shape0[y], hasZ ? shape0[z] : 1));
    const pxSize0 = pxDims0.getSize(new three__WEBPACK_IMPORTED_MODULE_11__.Vector3());
    const pxDimsLv = (0,_VolumeLoaderUtils_js__WEBPACK_IMPORTED_MODULE_2__.convertSubregionToPixels)(loadSpec.subregion, new three__WEBPACK_IMPORTED_MODULE_11__.Vector3(shapeLv[x], shapeLv[y], hasZ ? shapeLv[z] : 1));
    const pxSizeLv = pxDimsLv.getSize(new three__WEBPACK_IMPORTED_MODULE_11__.Vector3());
    const atlasTileDims = (0,_VolumeLoaderUtils_js__WEBPACK_IMPORTED_MODULE_2__.computePackedAtlasDims)(pxSizeLv.z, pxSizeLv.x, pxSizeLv.y);

    // Channel names is the other place where we have to check every source
    // Track which channel names we've seen so far, so that we can rename them to avoid name collisions
    const channelNamesMap = new Map();
    const channelNames = this.sources.flatMap(src => {
      const sourceChannelNames = (0,_zarr_utils_utils_js__WEBPACK_IMPORTED_MODULE_5__.getSourceChannelNames)(src);

      // Resolve name collisions
      return sourceChannelNames.map(channelName => {
        const numMatchingChannels = channelNamesMap.get(channelName);
        if (numMatchingChannels !== undefined) {
          // If e.g. we've seen channel "Membrane" once before, rename this one to "Membrane (1)"
          channelNamesMap.set(channelName, numMatchingChannels + 1);
          return `${channelName} (${numMatchingChannels})`;
        } else {
          channelNamesMap.set(channelName, 1);
          return channelName;
        }
      });
    });

    // for physicalPixelSize, we use the scale of the first level
    const scale5d = this.getScale(0);
    // assume that ImageInfo wants the timeScale of level 0
    const timeScale = hasT ? scale5d[0] : 1;
    const imgdata = {
      name: source0.omeroMetadata?.name || "Volume",
      originalSize: pxSize0,
      atlasTileDims,
      volumeSize: pxSizeLv,
      subregionSize: pxSizeLv.clone(),
      subregionOffset: new three__WEBPACK_IMPORTED_MODULE_11__.Vector3(0, 0, 0),
      physicalPixelSize: new three__WEBPACK_IMPORTED_MODULE_11__.Vector3(scale5d[4], scale5d[3], hasZ ? scale5d[2] : Math.min(scale5d[4], scale5d[3])),
      spatialUnit,
      numChannels,
      channelNames,
      times,
      timeScale,
      timeUnit,
      numMultiscaleLevels: source0.scaleLevels.length,
      multiscaleLevel: levelToLoad,
      transform: {
        translation: new three__WEBPACK_IMPORTED_MODULE_11__.Vector3(0, 0, 0),
        rotation: new three__WEBPACK_IMPORTED_MODULE_11__.Vector3(0, 0, 0)
      }
    };

    // The `LoadSpec` passed in at this stage should represent the subset which this loader loads, not that
    // which the volume contains. The volume contains the full extent of the subset recognized by this loader.
    const fullExtentLoadSpec = {
      ...loadSpec,
      subregion: new three__WEBPACK_IMPORTED_MODULE_11__.Box3(new three__WEBPACK_IMPORTED_MODULE_11__.Vector3(0, 0, 0), new three__WEBPACK_IMPORTED_MODULE_11__.Vector3(1, 1, 1))
    };
    return Promise.resolve({
      imageInfo: imgdata,
      loadSpec: fullExtentLoadSpec
    });
  }
  async prefetchChunk(scaleLevel, coords, subscriber) {
    const {
      store,
      path
    } = scaleLevel;
    const separator = path.endsWith("/") ? "" : "/";
    const key = path + separator + this.orderByDimension(coords).join("/");
    // Calling `get` and doing nothing with the result still triggers a cache check, fetch, and insertion
    await store.get(key, {
      subscriber,
      isPrefetch: true
    }).catch((0,_VolumeLoadError_js__WEBPACK_IMPORTED_MODULE_6__.wrapVolumeLoadError)(`Unable to prefetch chunk with key ${key}`, _VolumeLoadError_js__WEBPACK_IMPORTED_MODULE_6__.VolumeLoadErrorType.LOAD_DATA_FAILED, CHUNK_REQUEST_CANCEL_REASON));
  }

  /** Reads a list of chunk keys requested by a `loadVolumeData` call and sets up appropriate prefetch requests. */
  beginPrefetch(keys, scaleLevel) {
    // Convert keys to arrays of coords
    const chunkCoords = keys.map(({
      sourceIdx,
      key
    }) => {
      const numDims = (0,_zarr_utils_utils_js__WEBPACK_IMPORTED_MODULE_5__.getDimensionCount)(this.sources[sourceIdx].axesTCZYX);
      const coordsInDimensionOrder = key.trim().split("/").slice(-numDims).filter(s => s !== "").map(s => parseInt(s, 10));
      const sourceCoords = this.orderByTCZYX(coordsInDimensionOrder, 0, sourceIdx);
      // Convert source channel index to absolute channel index for `ChunkPrefetchIterator`'s benefit
      // (we match chunk coordinates output from `ChunkPrefetchIterator` back to sources below)
      sourceCoords[1] += this.sources[sourceIdx].channelOffset;
      return sourceCoords;
    });

    // Get number of chunks per dimension in every source array
    const chunkDimsTCZYX = this.sources.map(src => {
      const level = src.scaleLevels[scaleLevel];
      const chunkDimsUnordered = level.shape.map((dim, idx) => Math.ceil(dim / level.chunks[idx]));
      return this.orderByTCZYX(chunkDimsUnordered, 1);
    });
    // `ChunkPrefetchIterator` yields chunk coordinates in order of roughly how likely they are to be loaded next
    const prefetchIterator = new _zarr_utils_ChunkPrefetchIterator_js__WEBPACK_IMPORTED_MODULE_3__["default"](chunkCoords, this.fetchOptions.maxPrefetchDistance, chunkDimsTCZYX, this.priorityDirections);
    const subscriber = this.requestQueue.addSubscriber();
    let prefetchCount = 0;
    for (const chunk of prefetchIterator) {
      if (prefetchCount >= this.fetchOptions.maxPrefetchChunks) {
        break;
      }
      // Match absolute channel coordinate back to source index and channel index
      const {
        sourceIndex,
        channelIndexInSource
      } = this.matchChannelToSource(chunk[1]);
      const sourceScaleLevel = this.sources[sourceIndex].scaleLevels[scaleLevel];
      chunk[1] = channelIndexInSource;
      this.prefetchChunk(sourceScaleLevel, chunk, subscriber);
      prefetchCount++;
    }

    // Clear out old prefetch requests (requests which also cover this new prefetch will be preserved)
    if (this.prefetchSubscriber !== undefined) {
      this.requestQueue.removeSubscriber(this.prefetchSubscriber, CHUNK_REQUEST_CANCEL_REASON);
    }
    this.prefetchSubscriber = subscriber;
  }
  updateImageInfoForLoad(imageInfo, loadSpec) {
    // Apply `this.maxExtent` to subregion, if it exists
    const maxExtent = this.maxExtent ?? new three__WEBPACK_IMPORTED_MODULE_11__.Box3(new three__WEBPACK_IMPORTED_MODULE_11__.Vector3(0, 0, 0), new three__WEBPACK_IMPORTED_MODULE_11__.Vector3(1, 1, 1));
    const subregion = (0,_VolumeLoaderUtils_js__WEBPACK_IMPORTED_MODULE_2__.composeSubregion)(loadSpec.subregion, maxExtent);

    // Pick the level to load based on the subregion size
    const multiscaleLevel = (0,_VolumeLoaderUtils_js__WEBPACK_IMPORTED_MODULE_2__.pickLevelToLoad)({
      ...loadSpec,
      subregion
    }, this.getLevelShapesZYX());
    const array0Shape = this.sources[0].scaleLevels[multiscaleLevel].shape;

    // Convert subregion to volume voxels
    const [z, y, x] = this.sources[0].axesTCZYX.slice(2);
    const regionPx = (0,_VolumeLoaderUtils_js__WEBPACK_IMPORTED_MODULE_2__.convertSubregionToPixels)(subregion, new three__WEBPACK_IMPORTED_MODULE_11__.Vector3(array0Shape[x], array0Shape[y], z === -1 ? 1 : array0Shape[z]));

    // Derive other image info properties from subregion and level to load
    const subregionSize = regionPx.getSize(new three__WEBPACK_IMPORTED_MODULE_11__.Vector3());
    const atlasTileDims = (0,_VolumeLoaderUtils_js__WEBPACK_IMPORTED_MODULE_2__.computePackedAtlasDims)(subregionSize.z, subregionSize.x, subregionSize.y);
    const volumeExtent = (0,_VolumeLoaderUtils_js__WEBPACK_IMPORTED_MODULE_2__.convertSubregionToPixels)(maxExtent, new three__WEBPACK_IMPORTED_MODULE_11__.Vector3(array0Shape[x], array0Shape[y], z === -1 ? 1 : array0Shape[z]));
    const volumeSize = volumeExtent.getSize(new three__WEBPACK_IMPORTED_MODULE_11__.Vector3());
    return {
      ...imageInfo,
      atlasTileDims,
      volumeSize,
      subregionSize,
      subregionOffset: regionPx.min,
      multiscaleLevel
    };
  }
  async loadRawChannelData(imageInfo, loadSpec, onUpdateMetadata, onData) {
    // This seemingly useless line keeps a stable local copy of `syncChannels` which the async closures below capture
    // so that changes to `this.syncChannels` don't affect the behavior of loads in progress.
    const syncChannels = this.syncChannels;
    const updatedImageInfo = this.updateImageInfoForLoad(imageInfo, loadSpec);
    onUpdateMetadata(updatedImageInfo);
    const {
      numChannels,
      multiscaleLevel
    } = updatedImageInfo;
    const channelIndexes = loadSpec.channels ?? Array.from({
      length: numChannels
    }, (_, i) => i);
    const subscriber = this.requestQueue.addSubscriber();

    // Prefetch housekeeping: we want to save keys involved in this load to prefetch later
    const keys = [];
    const reportKeyBase = (sourceIdx, key, sub) => {
      if (sub === subscriber) {
        keys.push({
          sourceIdx,
          key
        });
      }
    };
    const resultChannelIndices = [];
    const resultChannelData = [];
    const resultChannelDtype = [];
    const resultChannelRanges = [];
    const channelPromises = channelIndexes.map(async ch => {
      // Build slice spec
      const min = updatedImageInfo.subregionOffset;
      const max = min.clone().add(updatedImageInfo.subregionSize);
      const {
        sourceIndex: sourceIdx,
        channelIndexInSource: sourceCh
      } = this.matchChannelToSource(ch);
      const unorderedSpec = [loadSpec.time, sourceCh, (0,_zarrita_indexing__WEBPACK_IMPORTED_MODULE_12__.slice)(min.z, max.z), (0,_zarrita_indexing__WEBPACK_IMPORTED_MODULE_12__.slice)(min.y, max.y), (0,_zarrita_indexing__WEBPACK_IMPORTED_MODULE_12__.slice)(min.x, max.x)];
      const level = this.sources[sourceIdx].scaleLevels[multiscaleLevel];
      const sliceSpec = this.orderByDimension(unorderedSpec, sourceIdx);
      const reportKey = (key, sub) => reportKeyBase(sourceIdx, key, sub);
      const result = await (0,_zarrita_indexing__WEBPACK_IMPORTED_MODULE_13__.get)(level, sliceSpec, {
        opts: {
          subscriber,
          reportKey
        }
      }).catch((0,_VolumeLoadError_js__WEBPACK_IMPORTED_MODULE_6__.wrapVolumeLoadError)("Could not load OME-Zarr volume data", _VolumeLoadError_js__WEBPACK_IMPORTED_MODULE_6__.VolumeLoadErrorType.LOAD_DATA_FAILED, CHUNK_REQUEST_CANCEL_REASON));
      if (result?.data === undefined) {
        return;
      }
      const converted = convertChannel(result.data, level.dtype);
      if (syncChannels) {
        resultChannelDtype.push(converted.dtype);
        resultChannelData.push(converted.data);
        resultChannelIndices.push(ch);
        resultChannelRanges.push([converted.min, converted.max]);
      } else {
        onData([ch], [converted.dtype], [converted.data], [[converted.min, converted.max]]);
      }
    });

    // Cancel any in-flight requests from previous loads that aren't useful to this one
    if (this.loadSubscriber !== undefined) {
      this.requestQueue.removeSubscriber(this.loadSubscriber, CHUNK_REQUEST_CANCEL_REASON);
    }
    this.loadSubscriber = subscriber;
    this.beginPrefetch(keys, multiscaleLevel);
    await Promise.all(channelPromises);
    if (syncChannels) {
      onData(resultChannelIndices, resultChannelDtype, resultChannelData, resultChannelRanges);
    }
    this.requestQueue.removeSubscriber(subscriber, CHUNK_REQUEST_CANCEL_REASON);
  }
}


/***/ }),

/***/ "./src/loaders/RawArrayLoader.ts":
/*!***************************************!*\
  !*** ./src/loaders/RawArrayLoader.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RawArrayLoader: () => (/* binding */ RawArrayLoader)
/* harmony export */ });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var _IVolumeLoader_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./IVolumeLoader.js */ "./src/loaders/IVolumeLoader.ts");
/* harmony import */ var _VolumeLoaderUtils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./VolumeLoaderUtils.js */ "./src/loaders/VolumeLoaderUtils.ts");
/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../types.js */ "./src/types.ts");





// this is the form in which a 4D numpy array arrives as converted
// by jupyterlab into a js object.
// This loader does not yet support multiple time samples.

// minimal metadata for visualization

const convertImageInfo = json => ({
  name: json.name,
  // assumption: the data is already sized to fit in our viewer's preferred
  // memory footprint (a tiled atlas texture as of this writing)
  originalSize: new three__WEBPACK_IMPORTED_MODULE_3__.Vector3(json.sizeX, json.sizeY, json.sizeZ),
  atlasTileDims: (0,_VolumeLoaderUtils_js__WEBPACK_IMPORTED_MODULE_1__.computePackedAtlasDims)(json.sizeZ, json.sizeX, json.sizeY),
  volumeSize: new three__WEBPACK_IMPORTED_MODULE_3__.Vector3(json.sizeX, json.sizeY, json.sizeZ),
  subregionSize: new three__WEBPACK_IMPORTED_MODULE_3__.Vector3(json.sizeX, json.sizeY, json.sizeZ),
  subregionOffset: new three__WEBPACK_IMPORTED_MODULE_3__.Vector3(0, 0, 0),
  physicalPixelSize: new three__WEBPACK_IMPORTED_MODULE_3__.Vector3(json.physicalPixelSize[0], json.physicalPixelSize[1], json.physicalPixelSize[2]),
  spatialUnit: json.spatialUnit || "μm",
  numChannels: json.sizeC,
  channelNames: json.channelNames,
  channelColors: undefined,
  //json.channelColors,

  times: 1,
  timeScale: 1,
  timeUnit: "s",
  numMultiscaleLevels: 1,
  multiscaleLevel: 0,
  transform: {
    translation: new three__WEBPACK_IMPORTED_MODULE_3__.Vector3(0, 0, 0),
    rotation: new three__WEBPACK_IMPORTED_MODULE_3__.Vector3(0, 0, 0)
  },
  userData: json.userData
});
class RawArrayLoader extends _IVolumeLoader_js__WEBPACK_IMPORTED_MODULE_0__.ThreadableVolumeLoader {
  constructor(rawData, rawDataInfo) {
    super();
    this.jsonInfo = rawDataInfo;
    this.data = rawData;
    // check consistent dims
    if (this.data.shape[0] !== this.jsonInfo.sizeC || this.data.shape[1] !== this.jsonInfo.sizeZ || this.data.shape[2] !== this.jsonInfo.sizeY || this.data.shape[3] !== this.jsonInfo.sizeX) {
      throw new Error("RawArrayLoader: data shape does not match metadata");
    }
  }
  async loadDims(_loadSpec) {
    const jsonInfo = this.jsonInfo;
    const d = new _IVolumeLoader_js__WEBPACK_IMPORTED_MODULE_0__.VolumeDims();
    d.shape = [1, jsonInfo.sizeC, jsonInfo.sizeZ, jsonInfo.sizeY, jsonInfo.sizeX];
    d.spacing = [1, 1, jsonInfo.physicalPixelSize[2], jsonInfo.physicalPixelSize[1], jsonInfo.physicalPixelSize[0]];
    d.spaceUnit = jsonInfo.spatialUnit || "μm";
    d.dataType = "uint8";
    return [d];
  }
  async createImageInfo(loadSpec) {
    return {
      imageInfo: convertImageInfo(this.jsonInfo),
      loadSpec
    };
  }
  loadRawChannelData(imageInfo, loadSpec, onUpdateMetadata, onData) {
    const requestedChannels = loadSpec.channels;
    const adjustedLoadSpec = {
      ...loadSpec,
      // `subregion` and `multiscaleLevel` are unused by this loader
      subregion: new three__WEBPACK_IMPORTED_MODULE_3__.Box3(new three__WEBPACK_IMPORTED_MODULE_3__.Vector3(0, 0, 0), new three__WEBPACK_IMPORTED_MODULE_3__.Vector3(1, 1, 1)),
      multiscaleLevel: 0
    };
    onUpdateMetadata(undefined, adjustedLoadSpec);
    for (let chindex = 0; chindex < imageInfo.numChannels; ++chindex) {
      if (requestedChannels && requestedChannels.length > 0 && !requestedChannels.includes(chindex)) {
        continue;
      }
      const volSizeBytes = this.data.shape[3] * this.data.shape[2] * this.data.shape[1]; // x*y*z pixels * 1 byte/pixel
      const channelData = new Uint8Array(this.data.buffer.buffer, chindex * volSizeBytes, volSizeBytes);
      // all data coming from this loader is natively 8-bit
      onData([chindex], ["uint8"], [channelData], [_types_js__WEBPACK_IMPORTED_MODULE_2__.DATARANGE_UINT8]);
    }
    return Promise.resolve();
  }
}


/***/ }),

/***/ "./src/loaders/TiffLoader.ts":
/*!***********************************!*\
  !*** ./src/loaders/TiffLoader.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TiffLoader: () => (/* binding */ TiffLoader)
/* harmony export */ });
/* harmony import */ var geotiff__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! geotiff */ "./node_modules/geotiff/dist-module/geotiff.js");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var serialize_error__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! serialize-error */ "./node_modules/serialize-error/index.js");
/* harmony import */ var _IVolumeLoader_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./IVolumeLoader.js */ "./src/loaders/IVolumeLoader.ts");
/* harmony import */ var _VolumeLoaderUtils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./VolumeLoaderUtils.js */ "./src/loaders/VolumeLoaderUtils.ts");
/* harmony import */ var _VolumeLoadError_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./VolumeLoadError.js */ "./src/loaders/VolumeLoadError.ts");






function prepareXML(xml) {
  // trim trailing unicode zeros?
  // eslint-disable-next-line no-control-regex
  const expr = /[\u0000]$/g;
  return xml.trim().replace(expr, "").trim();
}
function getOME(xml) {
  const parser = new DOMParser();
  try {
    const xmlDoc = parser.parseFromString(xml, "text/xml");
    return xmlDoc.getElementsByTagName("OME")[0];
  } catch (e) {
    throw new _VolumeLoadError_js__WEBPACK_IMPORTED_MODULE_2__.VolumeLoadError("Could not find OME metadata in TIFF file", {
      type: _VolumeLoadError_js__WEBPACK_IMPORTED_MODULE_2__.VolumeLoadErrorType.INVALID_METADATA,
      cause: e
    });
  }
}
class OMEDims {
  sizex = 0;
  sizey = 0;
  sizez = 1;
  sizec = 1;
  sizet = 1;
  unit = "";
  pixeltype = "";
  dimensionorder = "";
  pixelsizex = 1;
  pixelsizey = 1;
  pixelsizez = 1;
  channelnames = [];
}
function getAttributeOrError(el, attr) {
  const val = el.getAttribute(attr);
  if (val === null) {
    throw new _VolumeLoadError_js__WEBPACK_IMPORTED_MODULE_2__.VolumeLoadError(`Missing attribute ${attr} in OME-TIFF metadata`, {
      type: _VolumeLoadError_js__WEBPACK_IMPORTED_MODULE_2__.VolumeLoadErrorType.INVALID_METADATA
    });
  }
  return val;
}
function getOMEDims(imageEl) {
  const dims = new OMEDims();
  const pixelsEl = imageEl.getElementsByTagName("Pixels")[0];
  dims.sizex = Number(getAttributeOrError(pixelsEl, "SizeX"));
  dims.sizey = Number(getAttributeOrError(pixelsEl, "SizeY"));
  dims.sizez = Number(pixelsEl.getAttribute("SizeZ"));
  dims.sizec = Number(pixelsEl.getAttribute("SizeC"));
  dims.sizet = Number(pixelsEl.getAttribute("SizeT"));
  dims.unit = pixelsEl.getAttribute("PhysicalSizeXUnit") || "";
  dims.pixeltype = pixelsEl.getAttribute("Type") || "";
  dims.dimensionorder = pixelsEl.getAttribute("DimensionOrder") || "XYZCT";
  dims.pixelsizex = Number(pixelsEl.getAttribute("PhysicalSizeX"));
  dims.pixelsizey = Number(pixelsEl.getAttribute("PhysicalSizeY"));
  dims.pixelsizez = Number(pixelsEl.getAttribute("PhysicalSizeZ"));
  const channelsEls = pixelsEl.getElementsByTagName("Channel");
  for (let i = 0; i < channelsEls.length; ++i) {
    const name = channelsEls[i].getAttribute("Name");
    const id = channelsEls[i].getAttribute("ID");
    dims.channelnames.push(name ? name : id ? id : "Channel" + i);
  }
  return dims;
}
const getBytesPerSample = type => type === "uint8" ? 1 : type === "uint16" ? 2 : 4;

// Despite the class `TiffLoader` extends, this loader is not threadable, since geotiff internally uses features that
// aren't available on workers. It uses its own specialized workers anyways.
class TiffLoader extends _IVolumeLoader_js__WEBPACK_IMPORTED_MODULE_0__.ThreadableVolumeLoader {
  constructor(url) {
    super();
    this.url = url;
  }
  async loadOmeDims() {
    if (!this.dims) {
      const tiff = await (0,geotiff__WEBPACK_IMPORTED_MODULE_3__.fromUrl)(this.url, {
        allowFullFile: true
      }).catch((0,_VolumeLoadError_js__WEBPACK_IMPORTED_MODULE_2__.wrapVolumeLoadError)(`Could not open TIFF file at ${this.url}`, _VolumeLoadError_js__WEBPACK_IMPORTED_MODULE_2__.VolumeLoadErrorType.NOT_FOUND));
      // DO NOT DO THIS, ITS SLOW
      // const imagecount = await tiff.getImageCount();
      // read the FIRST image
      const image = await tiff.getImage().catch((0,_VolumeLoadError_js__WEBPACK_IMPORTED_MODULE_2__.wrapVolumeLoadError)("Failed to open TIFF image", _VolumeLoadError_js__WEBPACK_IMPORTED_MODULE_2__.VolumeLoadErrorType.NOT_FOUND));
      const tiffimgdesc = prepareXML(image.getFileDirectory().ImageDescription);
      const omeEl = getOME(tiffimgdesc);
      const image0El = omeEl.getElementsByTagName("Image")[0];
      this.dims = getOMEDims(image0El);
    }
    return this.dims;
  }
  async loadDims(_loadSpec) {
    const dims = await this.loadOmeDims();
    const d = new _IVolumeLoader_js__WEBPACK_IMPORTED_MODULE_0__.VolumeDims();
    d.shape = [dims.sizet, dims.sizec, dims.sizez, dims.sizey, dims.sizex];
    d.spacing = [1, 1, dims.pixelsizez, dims.pixelsizey, dims.pixelsizex];
    d.spaceUnit = dims.unit ? dims.unit : "micron";
    d.dataType = dims.pixeltype ? dims.pixeltype : "uint8";
    return [d];
  }
  async createImageInfo(_loadSpec) {
    const dims = await this.loadOmeDims();
    // compare with sizex, sizey
    //const width = image.getWidth();
    //const height = image.getHeight();

    // TODO allow user setting of this downsampling info?
    // TODO allow ROI selection: range of x,y,z,c for a given t
    const atlasDims = (0,_VolumeLoaderUtils_js__WEBPACK_IMPORTED_MODULE_1__.computePackedAtlasDims)(dims.sizez, dims.sizex, dims.sizey);
    // fit tiles to max of 2048x2048?
    const targetSize = 2048;
    const tilesizex = Math.floor(targetSize / atlasDims.x);
    const tilesizey = Math.floor(targetSize / atlasDims.y);

    // load tiff and check metadata

    const imgdata = {
      name: "TEST",
      originalSize: new three__WEBPACK_IMPORTED_MODULE_4__.Vector3(dims.sizex, dims.sizey, dims.sizez),
      atlasTileDims: atlasDims,
      volumeSize: new three__WEBPACK_IMPORTED_MODULE_4__.Vector3(tilesizex, tilesizey, dims.sizez),
      subregionSize: new three__WEBPACK_IMPORTED_MODULE_4__.Vector3(tilesizex, tilesizey, dims.sizez),
      subregionOffset: new three__WEBPACK_IMPORTED_MODULE_4__.Vector3(0, 0, 0),
      physicalPixelSize: new three__WEBPACK_IMPORTED_MODULE_4__.Vector3(dims.pixelsizex, dims.pixelsizey, dims.pixelsizez),
      spatialUnit: dims.unit || "",
      numChannels: dims.sizec,
      channelNames: dims.channelnames,
      times: dims.sizet,
      timeScale: 1,
      timeUnit: "",
      numMultiscaleLevels: 1,
      multiscaleLevel: 0,
      transform: {
        translation: new three__WEBPACK_IMPORTED_MODULE_4__.Vector3(0, 0, 0),
        rotation: new three__WEBPACK_IMPORTED_MODULE_4__.Vector3(0, 0, 0)
      }
    };

    // This loader uses no fields from `LoadSpec`. Initialize volume with defaults.
    return {
      imageInfo: imgdata,
      loadSpec: new _IVolumeLoader_js__WEBPACK_IMPORTED_MODULE_0__.LoadSpec()
    };
  }
  async loadRawChannelData(imageInfo, _loadSpec, _onUpdateMetadata, onData) {
    const dims = await this.loadOmeDims();
    const channelProms = [];
    // do each channel on a worker?
    for (let channel = 0; channel < imageInfo.numChannels; ++channel) {
      const thisChannelProm = new Promise((resolve, reject) => {
        const params = {
          channel: channel,
          // these are target xy sizes for the in-memory volume data
          // they may or may not be the same size as original xy sizes
          tilesizex: imageInfo.volumeSize.x,
          tilesizey: imageInfo.volumeSize.y,
          sizec: imageInfo.numChannels,
          sizez: imageInfo.volumeSize.z,
          dimensionOrder: dims.dimensionorder,
          bytesPerSample: getBytesPerSample(dims.pixeltype),
          url: this.url
        };
        const worker = new Worker(new URL(/* worker import */ __webpack_require__.p + __webpack_require__.u("src_workers_FetchTiffWorker_ts"), __webpack_require__.b));
        worker.onmessage = e => {
          if (e.data.isError) {
            reject((0,serialize_error__WEBPACK_IMPORTED_MODULE_5__.deserializeError)(e.data.error));
            return;
          }
          const {
            data,
            dtype,
            channel,
            range
          } = e.data;
          onData([channel], [dtype], [data], [range]);
          worker.terminate();
          resolve();
        };
        worker.postMessage(params);
      });
      channelProms.push(thisChannelProm);
    }

    // waiting for all channels to load allows errors to propagate to the caller via this promise
    await Promise.all(channelProms);
  }
}


/***/ }),

/***/ "./src/loaders/VolumeLoadError.ts":
/*!****************************************!*\
  !*** ./src/loaders/VolumeLoadError.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   VolumeLoadError: () => (/* binding */ VolumeLoadError),
/* harmony export */   VolumeLoadErrorType: () => (/* binding */ VolumeLoadErrorType),
/* harmony export */   wrapVolumeLoadError: () => (/* binding */ wrapVolumeLoadError)
/* harmony export */ });
/* harmony import */ var serialize_error__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! serialize-error */ "./node_modules/serialize-error/error-constructors.js");
/* harmony import */ var _zarrita_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @zarrita/core */ "./node_modules/@zarrita/core/dist/src/errors.js");


// geotiff doesn't export its error types...

/** Groups possible load errors into a few broad categories which we can give similar guidance to the user about. */
let VolumeLoadErrorType = /*#__PURE__*/function (VolumeLoadErrorType) {
  VolumeLoadErrorType["UNKNOWN"] = "unknown";
  VolumeLoadErrorType["NOT_FOUND"] = "not_found";
  VolumeLoadErrorType["TOO_LARGE"] = "too_large";
  VolumeLoadErrorType["LOAD_DATA_FAILED"] = "load_data_failed";
  VolumeLoadErrorType["INVALID_METADATA"] = "invalid_metadata";
  VolumeLoadErrorType["INVALID_MULTI_SOURCE_ZARR"] = "invalid_multi_source_zarr";
  return VolumeLoadErrorType;
}({});
class VolumeLoadError extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = "VolumeLoadError";
    this.type = options?.type ?? VolumeLoadErrorType.UNKNOWN;
  }
}

// serialize-error only ever calls an error constructor with zero arguments. The required `ErrorConstructor`
// type is a bit too restrictive - as long as the constructor can be called with no arguments it's fine.
serialize_error__WEBPACK_IMPORTED_MODULE_0__["default"].set("NodeNotFoundError", _zarrita_core__WEBPACK_IMPORTED_MODULE_1__.NodeNotFoundError);
serialize_error__WEBPACK_IMPORTED_MODULE_0__["default"].set("KeyError", _zarrita_core__WEBPACK_IMPORTED_MODULE_1__.KeyError);
serialize_error__WEBPACK_IMPORTED_MODULE_0__["default"].set("VolumeLoadError", VolumeLoadError);

/** Curried function to re-throw an error wrapped in a `VolumeLoadError` with the given `message` and `type`. */
function wrapVolumeLoadError(message = "Unknown error occurred while loading volume data", type = VolumeLoadErrorType.UNKNOWN, ignore) {
  return e => {
    if (ignore !== undefined && e === ignore) {
      return e;
    }
    if (e instanceof VolumeLoadError) {
      throw e;
    }
    console.log(`Error loading volume data: ${e}`);
    throw new VolumeLoadError(message, {
      type,
      cause: e
    });
  };
}

/***/ }),

/***/ "./src/loaders/VolumeLoaderUtils.ts":
/*!******************************************!*\
  !*** ./src/loaders/VolumeLoaderUtils.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MAX_ATLAS_EDGE: () => (/* binding */ MAX_ATLAS_EDGE),
/* harmony export */   buildDefaultMetadata: () => (/* binding */ buildDefaultMetadata),
/* harmony export */   composeSubregion: () => (/* binding */ composeSubregion),
/* harmony export */   computePackedAtlasDims: () => (/* binding */ computePackedAtlasDims),
/* harmony export */   convertSubregionToPixels: () => (/* binding */ convertSubregionToPixels),
/* harmony export */   estimateLevelForAtlas: () => (/* binding */ estimateLevelForAtlas),
/* harmony export */   pickLevelToLoad: () => (/* binding */ pickLevelToLoad),
/* harmony export */   pickLevelToLoadUnscaled: () => (/* binding */ pickLevelToLoadUnscaled),
/* harmony export */   scaleDimsToSubregion: () => (/* binding */ scaleDimsToSubregion),
/* harmony export */   scaleMultipleDimsToSubregion: () => (/* binding */ scaleMultipleDimsToSubregion),
/* harmony export */   unitNameToSymbol: () => (/* binding */ unitNameToSymbol)
/* harmony export */ });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var _VolumeLoadError_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./VolumeLoadError.js */ "./src/loaders/VolumeLoadError.ts");


const MAX_ATLAS_EDGE = 4096;

// Map from units to their symbols
const UNIT_SYMBOLS = {
  angstrom: "Å",
  day: "d",
  foot: "ft",
  hour: "h",
  inch: "in",
  meter: "m",
  micron: "μm",
  mile: "mi",
  minute: "min",
  parsec: "pc",
  second: "s",
  yard: "yd"
};

// Units which may take SI prefixes (e.g. micro-, tera-)
const SI_UNITS = ["meter", "second"];

// SI prefixes which abbreviate in nonstandard ways
const SI_PREFIX_ABBVS = {
  micro: "μ",
  deca: "da"
};

/** Converts a full spatial or temporal unit name supported by OME-Zarr to its unit symbol */
// (see https://ngff.openmicroscopy.org/latest/#axes-md)
function unitNameToSymbol(unitName) {
  if (unitName === undefined) {
    return null;
  }
  if (UNIT_SYMBOLS[unitName]) {
    return UNIT_SYMBOLS[unitName];
  }
  const prefixedSIUnit = SI_UNITS.find(siUnit => unitName.endsWith(siUnit));
  if (prefixedSIUnit) {
    const prefix = unitName.substring(0, unitName.length - prefixedSIUnit.length);
    if (SI_PREFIX_ABBVS[prefix]) {
      // "special" SI prefix
      return SI_PREFIX_ABBVS[prefix] + UNIT_SYMBOLS[prefixedSIUnit];
    }

    // almost all SI prefixes are abbreviated by first letter, capitalized if prefix ends with "a"
    const capitalize = prefix.endsWith("a");
    const prefixAbbr = capitalize ? prefix[0].toUpperCase() : prefix[0];
    return prefixAbbr + UNIT_SYMBOLS[prefixedSIUnit];
  }
  return null;
}

// We want to find the most "square" packing of z tw by th tiles.
// Compute number of rows and columns.
function computePackedAtlasDims(z, tw, th) {
  let nextrows = 1;
  let nextcols = z;
  let ratio = nextcols * tw / (nextrows * th);
  let nrows = nextrows;
  let ncols = nextcols;
  while (ratio > 1) {
    nrows = nextrows;
    ncols = nextcols;
    nextcols -= 1;
    nextrows = Math.ceil(z / nextcols);
    ratio = nextcols * tw / (nextrows * th);
  }
  return new three__WEBPACK_IMPORTED_MODULE_1__.Vector2(nrows, ncols);
}
function doesSpatialDimensionFitInAtlas(spatialDimZYX, maxAtlasEdge = MAX_ATLAS_EDGE) {
  // Estimate atlas size
  const x = spatialDimZYX[2];
  const y = spatialDimZYX[1];
  const z = spatialDimZYX[0];
  const xtiles = Math.floor(maxAtlasEdge / x);
  const ytiles = Math.floor(maxAtlasEdge / y);
  return xtiles * ytiles >= z;
}

/** Picks the largest scale level that can fit into a texture atlas with edges no longer than `maxAtlasEdge`. */
function estimateLevelForAtlas(spatialDimsZYX, maxAtlasEdge = MAX_ATLAS_EDGE) {
  if (spatialDimsZYX.length <= 1) {
    return 0;
  }
  for (let i = 0; i < spatialDimsZYX.length; ++i) {
    // estimate atlas size:
    if (doesSpatialDimensionFitInAtlas(spatialDimsZYX[i], maxAtlasEdge)) {
      return i;
    }
  }
  return undefined;
}
const maxCeil = val => Math.max(Math.ceil(val), 1);
const scaleDims = (size, [z, y, x]) => [maxCeil(z * size.z), maxCeil(y * size.y), maxCeil(x * size.x)];
function scaleDimsToSubregion(subregion, dims) {
  const size = subregion.getSize(new three__WEBPACK_IMPORTED_MODULE_1__.Vector3());
  return scaleDims(size, dims);
}
function scaleMultipleDimsToSubregion(subregion, dims) {
  const size = subregion.getSize(new three__WEBPACK_IMPORTED_MODULE_1__.Vector3());
  return dims.map(dim => scaleDims(size, dim));
}

/**
 * Picks the best scale level to load based on scale level dimensions and a `LoadSpec`. This calls
 * `estimateLevelForAtlas`, then accounts for `LoadSpec`'s scale level picking properties:
 * - `multiscaleLevel` imposes a minimum scale level (or *maximum* resolution level) to load
 * - `maxAtlasEdge` sets the maximum size of the texture atlas that may be produced by a load
 * - `scaleLevelBias` offsets the scale level index after the optimal level is picked based on `maxAtlasEdge`
 *
 *  This function assumes that `spatialDimsZYX` has already been appropriately scaled to match `loadSpec`'s `subregion`.
 */
function pickLevelToLoadUnscaled(loadSpec, spatialDimsZYX) {
  let levelToLoad = estimateLevelForAtlas(spatialDimsZYX, loadSpec.maxAtlasEdge);
  // Check here for whether levelToLoad is within max atlas size?
  if (levelToLoad !== undefined) {
    levelToLoad = Math.max(levelToLoad + (loadSpec.scaleLevelBias ?? 0), loadSpec.multiscaleLevel ?? 0);
    levelToLoad = Math.max(0, Math.min(spatialDimsZYX.length - 1, levelToLoad));
    if (doesSpatialDimensionFitInAtlas(spatialDimsZYX[levelToLoad], loadSpec.maxAtlasEdge)) {
      return levelToLoad;
    }
  }

  // Level to load could not be loaded due to atlas size constraints.
  if (levelToLoad === undefined) {
    // No optimal level exists so choose the smallest level to report out
    levelToLoad = spatialDimsZYX.length - 1;
  }
  const smallestDims = spatialDimsZYX[levelToLoad];
  console.error(`Volume is too large; no multiscale level found that fits in preferred memory footprint. Selected level ${levelToLoad}  has dimensions `, smallestDims, `. Max atlas edge allowed is ${loadSpec.maxAtlasEdge}.`);
  console.log("All available levels: ", spatialDimsZYX);
  throw new _VolumeLoadError_js__WEBPACK_IMPORTED_MODULE_0__.VolumeLoadError(`Volume is too large; multiscale level does not fit in preferred memory footprint.`, {
    type: _VolumeLoadError_js__WEBPACK_IMPORTED_MODULE_0__.VolumeLoadErrorType.TOO_LARGE
  });
}

/**
 * Picks the best scale level to load based on scale level dimensions and a `LoadSpec`. This calls
 * `estimateLevelForAtlas` and accounts for all properties of `LoadSpec` considered by
 * `pickLevelToLoadUnscaled`, and additionally scales the dimensions of the scale levels to account for the
 * `LoadSpec`'s `subregion` property.
 */
function pickLevelToLoad(loadSpec, spatialDimsZYX) {
  const scaledDims = scaleMultipleDimsToSubregion(loadSpec.subregion, spatialDimsZYX);
  return pickLevelToLoadUnscaled(loadSpec, scaledDims);
}

/** Given the size of a volume in pixels, convert a `Box3` in the 0-1 range to pixels */
function convertSubregionToPixels(region, size) {
  const min = region.min.clone().multiply(size).floor();
  const max = region.max.clone().multiply(size).ceil();

  // ensure it's always valid to specify the same number at both ends and get a single slice
  if (min.x === max.x && min.x < size.x) {
    max.x += 1;
  }
  if (min.y === max.y && min.y < size.y) {
    max.y += 1;
  }
  if (min.z === max.z && min.z < size.z) {
    max.z += 1;
  }
  return new three__WEBPACK_IMPORTED_MODULE_1__.Box3(min, max);
}

/**
 * Return the subset of `container` specified by `region`, assuming that `region` contains fractional values (between 0
 * and 1). i.e. if `container`'s range on the X axis is 0-4 and `region`'s is 0.25-0.5, the result will have range 1-2.
 */
function composeSubregion(region, container) {
  const size = container.getSize(new three__WEBPACK_IMPORTED_MODULE_1__.Vector3());
  const min = region.min.clone().multiply(size).add(container.min);
  const max = region.max.clone().multiply(size).add(container.min);
  return new three__WEBPACK_IMPORTED_MODULE_1__.Box3(min, max);
}
function isEmpty(obj) {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return false;
    }
  }
  return true;
}

// currently everything needed can come from the imageInfo
// but in the future each IVolumeLoader could have a completely separate implementation.
function buildDefaultMetadata(imageInfo) {
  const physicalSize = imageInfo.volumeSize.clone().multiply(imageInfo.physicalPixelSize);
  const metadata = {};
  metadata["Dimensions"] = {
    ...imageInfo.subregionSize
  };
  metadata["Original dimensions"] = {
    ...imageInfo.originalSize
  };
  metadata["Physical size"] = {
    x: physicalSize.x + imageInfo.spatialUnit,
    y: physicalSize.y + imageInfo.spatialUnit,
    z: physicalSize.z + imageInfo.spatialUnit
  };
  metadata["Physical size per pixel"] = {
    x: imageInfo.physicalPixelSize.x + imageInfo.spatialUnit,
    y: imageInfo.physicalPixelSize.y + imageInfo.spatialUnit,
    z: imageInfo.physicalPixelSize.z + imageInfo.spatialUnit
  };
  metadata["Channels"] = imageInfo.numChannels;
  metadata["Time series frames"] = imageInfo.times || 1;
  // don't add User data if it's empty
  if (imageInfo.userData && !isEmpty(imageInfo.userData)) {
    metadata["User data"] = imageInfo.userData;
  }
  return metadata;
}

/***/ }),

/***/ "./src/loaders/index.ts":
/*!******************************!*\
  !*** ./src/loaders/index.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PrefetchDirection: () => (/* reexport safe */ _zarr_utils_types_js__WEBPACK_IMPORTED_MODULE_4__.PrefetchDirection),
/* harmony export */   VolumeFileFormat: () => (/* binding */ VolumeFileFormat),
/* harmony export */   createVolumeLoader: () => (/* binding */ createVolumeLoader),
/* harmony export */   pathToFileType: () => (/* binding */ pathToFileType)
/* harmony export */ });
/* harmony import */ var _OmeZarrLoader_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./OmeZarrLoader.js */ "./src/loaders/OmeZarrLoader.ts");
/* harmony import */ var _JsonImageInfoLoader_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./JsonImageInfoLoader.js */ "./src/loaders/JsonImageInfoLoader.ts");
/* harmony import */ var _RawArrayLoader_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./RawArrayLoader.js */ "./src/loaders/RawArrayLoader.ts");
/* harmony import */ var _TiffLoader_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./TiffLoader.js */ "./src/loaders/TiffLoader.ts");
/* harmony import */ var _zarr_utils_types_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./zarr_utils/types.js */ "./src/loaders/zarr_utils/types.ts");





let VolumeFileFormat = /*#__PURE__*/function (VolumeFileFormat) {
  VolumeFileFormat["ZARR"] = "zarr";
  VolumeFileFormat["JSON"] = "json";
  VolumeFileFormat["TIFF"] = "tiff";
  VolumeFileFormat["DATA"] = "data";
  return VolumeFileFormat;
}({});

// superset of all necessary loader options

function pathToFileType(path) {
  if (path.endsWith(".json")) {
    return VolumeFileFormat.JSON;
  } else if (path.endsWith(".tif") || path.endsWith(".tiff")) {
    return VolumeFileFormat.TIFF;
  }
  return VolumeFileFormat.ZARR;
}
async function createVolumeLoader(path, options) {
  const pathString = Array.isArray(path) ? path[0] : path;
  const fileType = options?.fileType || pathToFileType(pathString);
  switch (fileType) {
    case VolumeFileFormat.ZARR:
      return await _OmeZarrLoader_js__WEBPACK_IMPORTED_MODULE_0__.OMEZarrLoader.createLoader(path, options?.scene, options?.cache, options?.queue, options?.fetchOptions);
    case VolumeFileFormat.JSON:
      return new _JsonImageInfoLoader_js__WEBPACK_IMPORTED_MODULE_1__.JsonImageInfoLoader(path, options?.cache);
    case VolumeFileFormat.TIFF:
      return new _TiffLoader_js__WEBPACK_IMPORTED_MODULE_3__.TiffLoader(pathString);
    case VolumeFileFormat.DATA:
      if (!options?.rawArrayOptions) {
        throw new Error("Must provide RawArrayOptions for RawArrayLoader");
      }
      return new _RawArrayLoader_js__WEBPACK_IMPORTED_MODULE_2__.RawArrayLoader(options?.rawArrayOptions.data, options?.rawArrayOptions.metadata);
  }
}

/***/ }),

/***/ "./src/loaders/zarr_utils/ChunkPrefetchIterator.ts":
/*!*********************************************************!*\
  !*** ./src/loaders/zarr_utils/ChunkPrefetchIterator.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ChunkPrefetchIterator)
/* harmony export */ });
const allEqual = arr => arr.every(v => v === arr[0]);
const pushN = (arr, val, n) => {
  for (let i = 0; i < n; i++) {
    arr.push(val);
  }
};
const directionToIndex = dir => {
  const absDir = dir >> 1; // shave off sign bit to get index in TZYX
  return absDir + Number(absDir !== 0); // convert TZYX -> TCZYX by skipping c (index 1)
};
function updateMinMax(val, minmax) {
  if (val < minmax[0]) {
    minmax[0] = val;
  }
  if (val > minmax[1]) {
    minmax[1] = val;
  }
}

/**
 * Since the user is most likely to want nearby data (in space or time) first, we should prefetch those chunks first.
 *
 * Given a list of just-loaded chunks and some bounds, `ChunkPrefetchIterator` iterates evenly outwards in T/Z/Y/X.
 */
// NOTE: Assumes `chunks` form a rectangular prism! Will create gaps otherwise! (in practice they always should)
class ChunkPrefetchIterator {
  constructor(chunks, tzyxMaxPrefetchOffset, tczyxChunksPerSource, priorityDirections) {
    // Get min and max chunk coordinates for T/Z/Y/X
    const extrema = [[Infinity, -Infinity], [Infinity, -Infinity], [Infinity, -Infinity], [Infinity, -Infinity]];
    for (const chunk of chunks) {
      updateMinMax(chunk[0], extrema[0]);
      updateMinMax(chunk[2], extrema[1]);
      updateMinMax(chunk[3], extrema[2]);
      updateMinMax(chunk[4], extrema[3]);
    }

    // Create `PrefetchDirectionState`s for each direction
    this.directionStates = [];
    this.priorityDirectionStates = [];
    for (const [direction, start] of extrema.flat().entries()) {
      const dimension = direction >> 1; // shave off sign bit to get index in TZYX
      const tczyxIndex = dimension + Number(dimension !== 0); // convert TZYX -> TCZYX by skipping c (index 1)
      let end;
      if (direction & 1) {
        // Positive direction - end is either the max coordinate in the fetched set plus the max offset in this
        // dimension, or the max chunk coordinate in this dimension, whichever comes first
        const endsPerSource = tczyxChunksPerSource.map(chunkDims => {
          return Math.min(start + tzyxMaxPrefetchOffset[dimension], chunkDims[tczyxIndex] - 1);
        });

        // Save some time: if all sources have the same end, we can just store that
        if (allEqual(endsPerSource)) {
          end = endsPerSource[0];
        } else {
          // Otherwise, expand our ends per source array to ends per channel
          end = [];
          for (const [i, sourceEnd] of endsPerSource.entries()) {
            pushN(end, sourceEnd, tczyxChunksPerSource[i][1]);
          }
        }
        // end = Math.min(start + tzyxMaxPrefetchOffset[dimension], tczyxChunksPerDimension[dimension] - 1);
      } else {
        // Negative direction - end is either the min coordinate in the fetched set minus the max offset in this
        // dimension, or 0, whichever comes first
        end = Math.max(start - tzyxMaxPrefetchOffset[dimension], 0);
      }
      const directionState = {
        direction,
        start,
        end,
        chunks: []
      };
      if (priorityDirections && priorityDirections.includes(direction)) {
        this.priorityDirectionStates.push(directionState);
      } else {
        this.directionStates.push(directionState);
      }
    }

    // Fill each `PrefetchDirectionState` with chunks at the border of the fetched set
    for (const chunk of chunks) {
      for (const dir of this.directionStates) {
        if (chunk[directionToIndex(dir.direction)] === dir.start) {
          dir.chunks.push(chunk);
        }
      }
      for (const dir of this.priorityDirectionStates) {
        if (chunk[directionToIndex(dir.direction)] === dir.start) {
          dir.chunks.push(chunk);
        }
      }
    }
  }
  static *iterateDirections(directions) {
    let offset = 1;
    while (directions.length > 0) {
      // Remove directions in which we have reached the end (or, if per-channel ends, the end for all channels)
      directions = directions.filter(dir => {
        const end = Array.isArray(dir.end) ? Math.max(...dir.end) : dir.end;
        if (dir.direction & 1) {
          return dir.start + offset <= end;
        } else {
          return dir.start - offset >= end;
        }
      });

      // Yield chunks one chunk farther out in every remaining direction
      for (const dir of directions) {
        const offsetDir = offset * (dir.direction & 1 ? 1 : -1);
        for (const chunk of dir.chunks) {
          // Skip this chunk if this channel has a specific per-channel end and we've reached it
          if (Array.isArray(dir.end) && chunk[directionToIndex(dir.direction)] + offsetDir > dir.end[chunk[1]]) {
            continue;
          }
          const newChunk = chunk.slice();
          newChunk[directionToIndex(dir.direction)] += offsetDir;
          yield newChunk;
        }
      }
      offset += 1;
    }
  }
  *[Symbol.iterator]() {
    // Yield all chunks in priority direction(s) first, if any
    if (this.priorityDirectionStates.length > 0) {
      for (const chunk of ChunkPrefetchIterator.iterateDirections(this.priorityDirectionStates)) {
        yield chunk;
      }
    }

    // Then yield all chunks in other directions
    for (const chunk of ChunkPrefetchIterator.iterateDirections(this.directionStates)) {
      yield chunk;
    }
  }
}

/***/ }),

/***/ "./src/loaders/zarr_utils/WrappedStore.ts":
/*!************************************************!*\
  !*** ./src/loaders/zarr_utils/WrappedStore.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * `Readable` is zarrita's minimal abstraction for any source of data.
 * `WrappedStore` wraps another `Readable` and adds (optional) connections to `VolumeCache` and `RequestQueue`.
 */
class WrappedStore {
  constructor(baseStore, cache, queue) {
    this.baseStore = baseStore;
    this.cache = cache;
    this.queue = queue;
  }
  // Dummy implementation to make this class easier to use in tests
  set(_key, _value) {
    return Promise.resolve();
  }
  async getAndCache(key, cacheKey, opts) {
    const result = await this.baseStore.get(key, opts);
    if (this.cache && result) {
      this.cache.insert(cacheKey, result);
    }
    return result;
  }
  async get(key, opts) {
    const ZARR_EXTS = [".zarray", ".zgroup", ".zattrs", "zarr.json"];
    if (!this.cache || ZARR_EXTS.some(s => key.endsWith(s))) {
      return this.baseStore.get(key, opts?.options);
    }
    if (opts?.reportKey) {
      opts.reportKey(key, opts.subscriber);
    }
    let keyPrefix = this.baseStore.url ?? "";
    if (keyPrefix !== "" && !(keyPrefix instanceof URL) && !keyPrefix.endsWith("/")) {
      keyPrefix += "/";
    }
    const fullKey = keyPrefix + key.slice(1);

    // Check the cache
    const cacheResult = this.cache.get(fullKey);
    if (cacheResult) {
      return new Uint8Array(cacheResult);
    }

    // Not in cache; load the chunk and cache it
    if (this.queue && opts) {
      return this.queue.addRequest(fullKey, opts.subscriber, () => this.getAndCache(key, fullKey, opts?.options), opts.isPrefetch);
    } else {
      // Should we ever hit this code?  We should always have a request queue.
      return this.getAndCache(key, fullKey, opts?.options);
    }
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (WrappedStore);

/***/ }),

/***/ "./src/loaders/zarr_utils/types.ts":
/*!*****************************************!*\
  !*** ./src/loaders/zarr_utils/types.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PrefetchDirection: () => (/* binding */ PrefetchDirection)
/* harmony export */ });
/**
 * Directions in which to move outward from the loaded set of chunks while prefetching.
 *
 * Ordered in pairs of opposite directions both because that's a sensible order in which to prefetch for our purposes,
 * and because it lets us treat the least significant bit as the sign. So `direction >> 1` gives the index of the
 * direction in TZYX-ordered arrays, and `direction & 1` gives the sign of the direction (e.g. positive vs negative Z).
 */
let PrefetchDirection = /*#__PURE__*/function (PrefetchDirection) {
  PrefetchDirection[PrefetchDirection["T_MINUS"] = 0] = "T_MINUS";
  PrefetchDirection[PrefetchDirection["T_PLUS"] = 1] = "T_PLUS";
  PrefetchDirection[PrefetchDirection["Z_MINUS"] = 2] = "Z_MINUS";
  PrefetchDirection[PrefetchDirection["Z_PLUS"] = 3] = "Z_PLUS";
  PrefetchDirection[PrefetchDirection["Y_MINUS"] = 4] = "Y_MINUS";
  PrefetchDirection[PrefetchDirection["Y_PLUS"] = 5] = "Y_PLUS";
  PrefetchDirection[PrefetchDirection["X_MINUS"] = 6] = "X_MINUS";
  PrefetchDirection[PrefetchDirection["X_PLUS"] = 7] = "X_PLUS";
  return PrefetchDirection;
}({});

/** https://ngff.openmicroscopy.org/latest/#multiscale-md */

/** https://ngff.openmicroscopy.org/latest/#omero-md */

/** A record with everything we need to access and use a single remote source of multiscale OME-Zarr data. */

/***/ }),

/***/ "./src/loaders/zarr_utils/utils.ts":
/*!*****************************************!*\
  !*** ./src/loaders/zarr_utils/utils.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getDimensionCount: () => (/* binding */ getDimensionCount),
/* harmony export */   getScale: () => (/* binding */ getScale),
/* harmony export */   getSourceChannelNames: () => (/* binding */ getSourceChannelNames),
/* harmony export */   matchSourceScaleLevels: () => (/* binding */ matchSourceScaleLevels),
/* harmony export */   orderByDimension: () => (/* binding */ orderByDimension),
/* harmony export */   orderByTCZYX: () => (/* binding */ orderByTCZYX),
/* harmony export */   remapAxesToTCZYX: () => (/* binding */ remapAxesToTCZYX)
/* harmony export */ });
/* harmony import */ var _VolumeLoadError_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../VolumeLoadError.js */ "./src/loaders/VolumeLoadError.ts");

/** Extracts channel names from a `ZarrSource`. Handles missing `omeroMetadata`. Does *not* resolve name collisions. */
function getSourceChannelNames(src) {
  if (src.omeroMetadata?.channels) {
    return src.omeroMetadata.channels.map(({
      label
    }, idx) => label ?? `Channel ${idx + src.channelOffset}`);
  }
  const length = src.scaleLevels[0].shape[src.axesTCZYX[1]];
  return Array.from({
    length
  }, (_, idx) => `Channel ${idx + src.channelOffset}`);
}

/** Turns `axesTCZYX` into the number of dimensions in the array */
const getDimensionCount = ([t, c, z]) => 2 + Number(t > -1) + Number(c > -1) + Number(z > -1);
function remapAxesToTCZYX(axes) {
  const axesTCZYX = [-1, -1, -1, -1, -1];
  const axisNames = ["t", "c", "z", "y", "x"];
  axes.forEach((axis, idx) => {
    const axisIdx = axisNames.indexOf(axis.name);
    if (axisIdx > -1) {
      axesTCZYX[axisIdx] = idx;
    } else {
      throw new _VolumeLoadError_js__WEBPACK_IMPORTED_MODULE_0__.VolumeLoadError(`Unrecognized axis in zarr: ${axis.name}`, {
        type: _VolumeLoadError_js__WEBPACK_IMPORTED_MODULE_0__.VolumeLoadErrorType.INVALID_METADATA
      });
    }
  });

  // it is possible that Z might not exist but we require X and Y at least.
  const noXAxis = axesTCZYX[4] === -1;
  if (noXAxis || axesTCZYX[3] === -1) {
    throw new _VolumeLoadError_js__WEBPACK_IMPORTED_MODULE_0__.VolumeLoadError(`Did not find ${noXAxis ? "an X" : "a Y"} axis in zarr`, {
      type: _VolumeLoadError_js__WEBPACK_IMPORTED_MODULE_0__.VolumeLoadErrorType.INVALID_METADATA
    });
  }
  return axesTCZYX;
}

/** Reorder an array of values [T, C, Z, Y, X] to the given dimension order */
function orderByDimension(valsTCZYX, orderTCZYX) {
  const specLen = getDimensionCount(orderTCZYX);
  const result = Array(specLen);
  orderTCZYX.forEach((val, idx) => {
    if (val >= 0) {
      if (val >= specLen) {
        throw new _VolumeLoadError_js__WEBPACK_IMPORTED_MODULE_0__.VolumeLoadError(`Unexpected axis index in zarr: ${val}`, {
          type: _VolumeLoadError_js__WEBPACK_IMPORTED_MODULE_0__.VolumeLoadErrorType.INVALID_METADATA
        });
      }
      result[val] = valsTCZYX[idx];
    }
  });
  return result;
}

/** Reorder an array of values in the given dimension order to [T, C, Z, Y, X] */
function orderByTCZYX(valsDimension, orderTCZYX, defaultValue) {
  const result = [defaultValue, defaultValue, defaultValue, defaultValue, defaultValue];
  orderTCZYX.forEach((val, idx) => {
    if (val >= 0) {
      if (val >= valsDimension.length) {
        throw new _VolumeLoadError_js__WEBPACK_IMPORTED_MODULE_0__.VolumeLoadError(`Unexpected axis index in zarr: ${val}`, {
          type: _VolumeLoadError_js__WEBPACK_IMPORTED_MODULE_0__.VolumeLoadErrorType.INVALID_METADATA
        });
      }
      result[idx] = valsDimension[val];
    }
  });
  return result;
}

/** Select the scale transform from an OME metadata object with coordinate transforms, and return it in TCZYX order */
function getScale(dataset, orderTCZYX) {
  const transforms = dataset.coordinateTransformations;
  if (transforms === undefined) {
    console.warn("WARNING: OMEZarrLoader: no coordinate transformations for scale level.");
    return [1, 1, 1, 1, 1];
  }

  // this assumes we'll never encounter the "path" variant
  const isScaleTransform = t => t.type === "scale";

  // there can be any number of coordinateTransformations
  // but there must be only one of type "scale".
  const scaleTransform = transforms.find(isScaleTransform);
  if (!scaleTransform) {
    console.warn(`WARNING: OMEZarrLoader: no coordinate transformation of type "scale" for scale level.`);
    return [1, 1, 1, 1, 1];
  }
  const scale = scaleTransform.scale.slice();
  return orderByTCZYX(scale, orderTCZYX, 1);
}

/**
 * Defines a partial order of zarr arrays based on their size. Specifically:
 * - If array size x, y, z are all equal, the arrays are equal
 * - otherwise, if all xyz of `a` are less than or equal to those of `b`, `a` is less than `b` (and vice versa)
 * - if some xyz is less and some is greater, the arrays are uncomparable
 */
function compareZarrArraySize(aArr, aTCZYX, bArr, bTCZYX) {
  const aZ = aTCZYX[2] > -1 ? aArr.shape[aTCZYX[2]] : 1;
  const bZ = bTCZYX[2] > -1 ? bArr.shape[bTCZYX[2]] : 1;
  const diffZ = aZ - bZ;
  const diffY = aArr.shape[aTCZYX[3]] - bArr.shape[bTCZYX[3]];
  const diffX = aArr.shape[aTCZYX[4]] - bArr.shape[bTCZYX[4]];
  if (diffZ === 0 && diffY === 0 && diffX === 0) {
    return 0;
  } else if (diffZ <= 0 && diffY <= 0 && diffX <= 0) {
    return -1;
  } else if (diffZ >= 0 && diffY >= 0 && diffX >= 0) {
    return 1;
  } else {
    return undefined;
  }
}
const EPSILON = 0.00001;
const aboutEquals = (a, b) => Math.abs(a - b) < EPSILON;
function scaleTransformsAreEqual(aSrc, aLevel, bSrc, bLevel) {
  const aScale = getScale(aSrc.multiscaleMetadata.datasets[aLevel], aSrc.axesTCZYX);
  const bScale = getScale(bSrc.multiscaleMetadata.datasets[bLevel], bSrc.axesTCZYX);
  return aboutEquals(aScale[2], bScale[2]) && aboutEquals(aScale[3], bScale[3]) && aboutEquals(aScale[4], bScale[4]);
}

/**
 * Ensures that all scale levels in `sources` are matched up by size. More precisely: enforces that, for any scale
 * level `i`, the size of zarr array `s[i]` is equal for every source `s`. We accomplish this by removing any arrays
 * (and their associated OME dataset metadata) which don't match up in all sources.
 *
 * Note that this function modifies the input `sources` array rather than returning a new value.
 *
 * Assumes all sources have scale levels ordered by size from largest to smallest. (This should always be true for
 * compliant OME-Zarr data.)
 */
function matchSourceScaleLevels(sources) {
  if (sources.length < 2) {
    return;
  }

  // Save matching scale levels and metadata here
  const matchedLevels = Array.from({
    length: sources.length
  }, () => []);
  const matchedMetas = Array.from({
    length: sources.length
  }, () => []);

  // Start as many index counters as we have sources
  const scaleIndexes = new Array(sources.length).fill(0);
  while (scaleIndexes.every((val, idx) => val < sources[idx].scaleLevels.length)) {
    // First pass: find the smallest source / determine if all sources are equal
    let allEqual = true;
    let smallestIdx = 0;
    let smallestSrc = sources[0];
    let smallestArr = smallestSrc.scaleLevels[scaleIndexes[0]];
    for (let currentIdx = 1; currentIdx < sources.length; currentIdx++) {
      const currentSrc = sources[currentIdx];
      const currentArr = currentSrc.scaleLevels[scaleIndexes[currentIdx]];
      const ordering = compareZarrArraySize(smallestArr, smallestSrc.axesTCZYX, currentArr, currentSrc.axesTCZYX);
      if (!ordering) {
        // Arrays are equal, or they are uncomparable
        if (ordering === undefined) {
          throw new _VolumeLoadError_js__WEBPACK_IMPORTED_MODULE_0__.VolumeLoadError("Incompatible zarr arrays: pixel dimensions are mismatched", {
            type: _VolumeLoadError_js__WEBPACK_IMPORTED_MODULE_0__.VolumeLoadErrorType.INVALID_MULTI_SOURCE_ZARR
          });
        }

        // Now we know the arrays are equal, but they may still be invalid to match up because...
        // ...they have different scale transformations
        if (!scaleTransformsAreEqual(smallestSrc, scaleIndexes[smallestIdx], currentSrc, scaleIndexes[currentIdx])) {
          // today we are going to treat this as a warning.
          // For our implementation it is enough that the xyz pixel ranges are the same.
          // Ideally scale*arraysize=physical size is really the quantity that should be equal, for combining two volume data sets as channels.
          console.warn("Incompatible zarr arrays: scale levels of equal size have different scale transformations");
        }

        // ...they have different numbers of timesteps
        const largestT = smallestSrc.axesTCZYX[0] > -1 ? smallestArr.shape[smallestSrc.axesTCZYX[0]] : 1;
        const currentT = currentSrc.axesTCZYX[0] > -1 ? currentArr.shape[currentSrc.axesTCZYX[0]] : 1;
        if (largestT !== currentT) {
          // we also treat this as a warning.
          // In OmeZarrLoader we will take the minimum T size of all sources
          console.warn(`Incompatible zarr arrays: different numbers of timesteps: ${largestT} vs ${currentT}`);
        }
      } else {
        allEqual = false;
        if (ordering > 0) {
          smallestIdx = currentIdx;
          smallestSrc = currentSrc;
          smallestArr = currentArr;
        }
      }
    }
    if (allEqual) {
      // We've found a matching set of scale levels! Save it and increment all indexes
      for (let i = 0; i < scaleIndexes.length; i++) {
        const currentSrc = sources[i];
        const matchedScaleLevel = scaleIndexes[i];
        matchedLevels[i].push(currentSrc.scaleLevels[matchedScaleLevel]);
        matchedMetas[i].push(currentSrc.multiscaleMetadata.datasets[matchedScaleLevel]);
        scaleIndexes[i] += 1;
      }
    } else {
      // Increment the indexes of the sources which are larger than the smallest
      for (const [idx, srcIdx] of scaleIndexes.entries()) {
        const currentSrc = sources[idx];
        const currentArr = currentSrc.scaleLevels[srcIdx];
        const ordering = compareZarrArraySize(smallestArr, smallestSrc.axesTCZYX, currentArr, currentSrc.axesTCZYX);
        if (ordering !== 0) {
          scaleIndexes[idx] += 1;
        }
      }
    }
  }
  if (sources[0].scaleLevels.length === 0) {
    throw new _VolumeLoadError_js__WEBPACK_IMPORTED_MODULE_0__.VolumeLoadError("Incompatible zarr arrays: no sets of scale levels found that matched in all sources", {
      type: _VolumeLoadError_js__WEBPACK_IMPORTED_MODULE_0__.VolumeLoadErrorType.INVALID_MULTI_SOURCE_ZARR
    });
  }
  for (let i = 0; i < sources.length; i++) {
    sources[i].scaleLevels = matchedLevels[i];
    sources[i].multiscaleMetadata.datasets = matchedMetas[i];
  }
}

/***/ }),

/***/ "./src/loaders/zarr_utils/validation.ts":
/*!**********************************************!*\
  !*** ./src/loaders/zarr_utils/validation.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   validateOMEZarrMetadata: () => (/* binding */ validateOMEZarrMetadata)
/* harmony export */ });
/* harmony import */ var _VolumeLoadError_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../VolumeLoadError.js */ "./src/loaders/VolumeLoadError.ts");

function isObjectWithProp(obj, prop) {
  return typeof obj === "object" && obj !== null && prop in obj;
}
function assertMetadataHasProp(obj, prop, name = "zarr") {
  if (!isObjectWithProp(obj, prop)) {
    throw new _VolumeLoadError_js__WEBPACK_IMPORTED_MODULE_0__.VolumeLoadError(`${name} metadata is missing required entry "${prop}"`, {
      type: _VolumeLoadError_js__WEBPACK_IMPORTED_MODULE_0__.VolumeLoadErrorType.INVALID_METADATA
    });
  }
}
function assertPropIsArray(obj, prop, name = "zarr") {
  if (!Array.isArray(obj[prop])) {
    throw new _VolumeLoadError_js__WEBPACK_IMPORTED_MODULE_0__.VolumeLoadError(`${name} metadata entry "${prop}" is not an array`, {
      type: _VolumeLoadError_js__WEBPACK_IMPORTED_MODULE_0__.VolumeLoadErrorType.INVALID_METADATA
    });
  }
}

/**
 * Validates that the `OMEZarrMetadata` record `data` has the minimal amount of data required to open a volume. Since
 * we only ever open one multiscale, we only validate the multiscale metadata record at index `multiscaleIdx` here.
 * `name` is used in error messages to identify the source of the metadata.
 */
function validateOMEZarrMetadata(data, multiscaleIdx = 0, name = "zarr") {
  // data is an object with a key "multiscales", which is an array
  assertMetadataHasProp(data, "multiscales", name);
  assertPropIsArray(data, "multiscales", name);

  // check that a multiscale metadata entry exists at `multiscaleIdx`
  const multiscaleMeta = data.multiscales[multiscaleIdx];
  if (!multiscaleMeta) {
    throw new _VolumeLoadError_js__WEBPACK_IMPORTED_MODULE_0__.VolumeLoadError(`${name} metadata does not have requested multiscale level ${multiscaleIdx}`, {
      type: _VolumeLoadError_js__WEBPACK_IMPORTED_MODULE_0__.VolumeLoadErrorType.INVALID_METADATA
    });
  }
  const multiscaleMetaName = isObjectWithProp(multiscaleMeta, "name") ? ` ("${multiscaleMeta.name})` : "";
  const multiscaleName = `${name} multiscale ${multiscaleIdx}${multiscaleMetaName}`;

  // multiscale has a key "axes", which is an array. Each axis has a "name".
  assertMetadataHasProp(multiscaleMeta, "axes", multiscaleName);
  assertPropIsArray(multiscaleMeta, "axes", multiscaleName);
  multiscaleMeta.axes.forEach((axis, i) => assertMetadataHasProp(axis, "name", `${multiscaleName} axis ${i}`));

  // multiscale has a key "datasets", which is an array. Each dataset has a "path".
  assertMetadataHasProp(multiscaleMeta, "datasets", name);
  assertPropIsArray(multiscaleMeta, "datasets", name);
  multiscaleMeta.datasets.forEach((data, i) => assertMetadataHasProp(data, "path", `${multiscaleName} dataset ${i}`));
}

/***/ }),

/***/ "./src/types.ts":
/*!**********************!*\
  !*** ./src/types.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ARRAY_CONSTRUCTORS: () => (/* binding */ ARRAY_CONSTRUCTORS),
/* harmony export */   DATARANGE_UINT8: () => (/* binding */ DATARANGE_UINT8),
/* harmony export */   FUSE_DISABLED_RGB_COLOR: () => (/* binding */ FUSE_DISABLED_RGB_COLOR),
/* harmony export */   RenderMode: () => (/* binding */ RenderMode),
/* harmony export */   ViewportCorner: () => (/* binding */ ViewportCorner),
/* harmony export */   isOrthographicCamera: () => (/* binding */ isOrthographicCamera),
/* harmony export */   isPerspectiveCamera: () => (/* binding */ isPerspectiveCamera),
/* harmony export */   isRight: () => (/* binding */ isRight),
/* harmony export */   isTop: () => (/* binding */ isTop)
/* harmony export */ });
// numeric types compatible with zarrita.js.
// see https://github.com/manzt/zarrita.js/blob/main/packages/core/src/metadata.ts

const ARRAY_CONSTRUCTORS = {
  int8: Int8Array,
  int16: Int16Array,
  int32: Int32Array,
  int64: globalThis.BigInt64Array,
  uint8: Uint8Array,
  uint16: Uint16Array,
  uint32: Uint32Array,
  uint64: globalThis.BigUint64Array,
  float32: Float32Array,
  float64: Float64Array
};
/** If `FuseChannel.rgbColor` is this value, it is disabled from fusion. */
const FUSE_DISABLED_RGB_COLOR = 0;

/**
 * Provide options to control the visual appearance of a Volume
 * @typedef {Object} VolumeChannelDisplayOptions
 * @property {boolean} enabled array of boolean per channel
 * @property {Array.<number>} color array of rgb per channel
 * @property {Array.<number>} specularColor array of rgb per channel
 * @property {Array.<number>} emissiveColor array of rgb per channel
 * @property {number} glossiness array of float per channel
 * @property {boolean} isosurfaceEnabled array of boolean per channel
 * @property {number} isovalue array of number per channel
 * @property {number} isosurfaceOpacity array of number per channel
 * @example let options = {
   };
 */

let RenderMode = /*#__PURE__*/function (RenderMode) {
  RenderMode[RenderMode["RAYMARCH"] = 0] = "RAYMARCH";
  RenderMode[RenderMode["PATHTRACE"] = 1] = "PATHTRACE";
  RenderMode[RenderMode["SLICE"] = 2] = "SLICE";
  return RenderMode;
}({});

/**
 * Provide options to control the visual appearance of a Volume
 * @typedef {Object} VolumeDisplayOptions
 * @property {Array.<VolumeChannelDisplayOptions>} channels array of channel display options
 * @property {number} density
 * @property {Array.<number>} translation xyz
 * @property {Array.<number>} rotation xyz angles in radians
 * @property {number} maskChannelIndex
 * @property {number} maskAlpha
 * @property {Array.<number>} clipBounds [xmin, xmax, ymin, ymax, zmin, zmax] all range from 0 to 1 as a percentage of the volume on that axis
 * @property {Array.<number>} scale xyz voxel size scaling
 * @property {boolean} maxProjection true or false (ray marching)
 * @property {number} renderMode 0 for raymarch, 1 for pathtrace
 * @property {number} shadingMethod 0 for phase, 1 for brdf, 2 for hybrid (path tracer)
 * @property {Array.<number>} gamma [min, max, scale]
 * @property {number} primaryRayStepSize in voxels
 * @property {number} secondaryRayStepSize in voxels
 * @property {boolean} showBoundingBox true or false
 * @property {Array.<number>} boundingBoxColor r,g,b for bounding box lines
 * @example let options = {
   };
 */

const isOrthographicCamera = def => def && def.isOrthographicCamera;
const isPerspectiveCamera = def => def && def.isPerspectiveCamera;
let ViewportCorner = /*#__PURE__*/function (ViewportCorner) {
  ViewportCorner["TOP_LEFT"] = "top_left";
  ViewportCorner["TOP_RIGHT"] = "top_right";
  ViewportCorner["BOTTOM_LEFT"] = "bottom_left";
  ViewportCorner["BOTTOM_RIGHT"] = "bottom_right";
  return ViewportCorner;
}({});
const isTop = corner => corner === ViewportCorner.TOP_LEFT || corner === ViewportCorner.TOP_RIGHT;
const isRight = corner => corner === ViewportCorner.TOP_RIGHT || corner === ViewportCorner.BOTTOM_RIGHT;
const DATARANGE_UINT8 = [0, 255];

/***/ }),

/***/ "./src/utils/RequestQueue.ts":
/*!***********************************!*\
  !*** ./src/utils/RequestQueue.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DEFAULT_REQUEST_CANCEL_REASON: () => (/* binding */ DEFAULT_REQUEST_CANCEL_REASON),
/* harmony export */   "default": () => (/* binding */ RequestQueue)
/* harmony export */ });
/** Object format used when passing multiple requests to RequestQueue at once. */

const DEFAULT_REQUEST_CANCEL_REASON = "request cancelled";

/**
 * Internal object interface used by RequestQueue to store request metadata and callbacks.
 */

/**
 * Manages a queue of asynchronous requests with unique string keys, which can be added to or cancelled.
 * If redundant requests with the same key are issued, the request action will only be run once per key
 * while the original request is still in the queue.
 */
class RequestQueue {
  /**
   * The maximum number of requests that can be handled concurrently.
   * Once reached, additional requests will be queued up to run once a running request completes.
   */

  /**
   * The maximum number of requests that can be handled concurrently if only low-priority requests are waiting. Set
   * lower than `concurrencyLimit` to always leave space for high-priority requests. Cannot be set higher than
   * `concurrencyLimit`.
   */

  /** A queue of requests that are ready to be executed, in order of request time. */

  /** A queue of low-priority tasks that are ready to be executed. `queue` must be empty before any of these tasks run. */

  /** Stores all requests, even those that are currently active. */

  /** Stores requests whose actions are currently being run. */

  /**
   * Creates a new RequestQueue.
   * @param maxActiveRequests The maximum number of requests that will be handled concurrently. This is 10 by default.
   * @param maxLowPriorityRequests The maximum number of low-priority requests that will be handled concurrently. Equal
   *    to `maxActiveRequests` by default, but may be set lower to always leave space for new high-priority requests.
   */
  constructor(maxActiveRequests = 10, maxLowPriorityRequests = 5) {
    this.allRequests = new Map();
    this.activeRequests = new Set();
    this.queue = [];
    this.queueLowPriority = [];
    this.maxActiveRequests = maxActiveRequests;
    this.maxLowPriorityRequests = Math.min(maxActiveRequests, maxLowPriorityRequests);
  }

  /**
   * Stores request metadata to the internal map of all pending requests.
   * @param key string identifier of the request.
   * @param requestAction callable function action of the request.
   * @returns a reference to the new, registered RequestItem.
   */
  registerRequest(key, requestAction) {
    // Create a new promise and store the resolve and reject callbacks for later.
    // This lets us perform the actual action at a later point, when the request is at the
    // front of the processing queue.
    let promiseResolve, promiseReject;
    const promise = new Promise((resolve, reject) => {
      promiseResolve = resolve;
      promiseReject = reject;
    });
    // Store the request data.
    const requestItem = {
      key: key,
      action: requestAction,
      resolve: promiseResolve,
      reject: promiseReject,
      promise
    };
    this.allRequests.set(key, requestItem);
    return requestItem;
  }

  /**
   * Moves a registered request into the processing queue, clearing any timeouts on the request.
   * @param key string identifier of the request.
   * @param lowPriority Whether this request should be added with low priority. False by default.
   */
  addRequestToQueue(key, lowPriority) {
    // Check that this request is not cancelled.
    if (this.allRequests.has(key)) {
      // Clear the request timeout, if it has one, since it is being added to the queue.
      const requestItem = this.allRequests.get(key);
      if (requestItem && requestItem.timeoutId) {
        clearTimeout(requestItem.timeoutId);
        requestItem.timeoutId = undefined;
      }
      if (!this.queue.includes(key) && !this.queueLowPriority.includes(key)) {
        // Add to queue and check if the request can be processed right away.
        if (lowPriority) {
          this.queueLowPriority.push(key);
        } else {
          this.queue.push(key);
        }
        this.dequeue();
      }
    }
  }

  /**
   * Adds a request with a unique key to the queue, if it doesn't already exist.
   * @param key The key used to track the request.
   * @param requestAction Function that will be called to complete the request. The function
   *  will be run only once per unique key while the request exists, and may be deferred by the
   *  queue at any time.
   * @param lowPriority Whether this request should be added with low priority. False by default.
   * @param delayMs Minimum delay, in milliseconds, before this request should be executed.
   *
   * NOTE: Cancelling a request while the action is running WILL NOT stop the action. If this behavior is desired,
   * actions must be responsible for checking the RequestQueue, determining if the request is still valid (e.g.
   * using `.hasRequest()`), and stopping or returning early.
   *
   * @returns A promise that will resolve on completion of the request, or reject if the request is cancelled.
   *  If multiple requests are issued with the same key, a promise for the first request will be returned
   *  until the request is resolved or cancelled.
   *  Note that the return type of the promise will match that of the first request's instance.
   */
  addRequest(key, requestAction, lowPriority = false, delayMs = 0) {
    if (!this.allRequests.has(key)) {
      // New request!
      const requestItem = this.registerRequest(key, requestAction);
      // If a delay is set, wait to add this to the queue.
      if (delayMs > 0) {
        const timeoutId = setTimeout(() => this.addRequestToQueue(key, lowPriority), delayMs);
        // Save timeout information to request metadata
        requestItem.timeoutId = timeoutId;
      } else {
        // No delay, add immediately
        this.addRequestToQueue(key, lowPriority);
      }
    } else {
      const lowPriorityIndex = this.queueLowPriority.indexOf(key);
      if (lowPriorityIndex > -1 && !lowPriority) {
        // This request is registered and queued, but is now being requested with high priority.
        // Promote it to high priority.
        this.queueLowPriority.splice(lowPriorityIndex, 1);
        this.addRequestToQueue(key);
      } else if (delayMs <= 0) {
        // This request is registered, but is now being requested without a delay.
        // Move into queue immediately if it's not already added, and clear any timeouts it may have.
        this.addRequestToQueue(key, lowPriority);
      }
    }
    const promise = this.allRequests.get(key)?.promise;
    if (!promise) {
      throw new Error("Found no promise to return when getting stored request data.");
    }
    return promise;
  }

  /**
   * Adds multiple requests to the queue, with an optional delay between each.
   * @param requests An array of RequestItems, which include a key and a request action.
   * @param lowPriority Whether these requests should be added with low priority. False by default.
   * @param delayMs An optional minimum delay in milliseconds to be added between each request.
   *  For example, a delay of 10 ms will cause the second request to be added to the processing queue
   *  after 10 ms, the third to added after 20 ms, and so on. Set to 10 ms by default.
   * @returns An array of promises corresponding to the provided requests. (i.e., the `i`th value
   * of the returned array will be a Promise for the resolution of `requests[i]`). If a request
   *  with a matching key is already pending, returns the promise for the initial request.
   */
  addRequests(requests, lowPriority = false, delayMs = 10) {
    const promises = [];
    for (let i = 0; i < requests.length; i++) {
      const item = requests[i];
      const promise = this.addRequest(item.key, item.requestAction, lowPriority, delayMs * i);
      promises.push(promise);
    }
    return promises;
  }

  /**
   * Attempts to remove and run the next queued request item, if resources are available.
   * @returns true if a request was started, or false if there are too many
   * requests already active.
   */
  async dequeue() {
    const numRequests = this.activeRequests.size;
    if (numRequests >= this.maxActiveRequests || this.queue.length === 0 && (numRequests >= this.maxLowPriorityRequests || this.queueLowPriority.length === 0)) {
      return;
    }
    const requestKey = this.queue.shift() ?? this.queueLowPriority.shift();
    if (!requestKey) {
      return;
    }
    if (this.activeRequests.has(requestKey)) {
      // This request is already active, try the next one instead. (this shouldn't happen)
      this.dequeue();
      return;
    }
    const requestItem = this.allRequests.get(requestKey);
    if (!requestItem) {
      return;
    }
    const key = requestItem.key;
    // Mark that this request is active
    this.activeRequests.add(key);
    await requestItem.action().then(requestItem.resolve, requestItem.reject);
    this.activeRequests.delete(key);
    this.allRequests.delete(key);
    this.dequeue();
  }

  /**
   * Removes any request matching the provided key from the queue and rejects its promise.
   * @param key The key that should be matched against.
   * @param cancelReason A message or object that will be used as the promise rejection.
   */
  cancelRequest(key, cancelReason = DEFAULT_REQUEST_CANCEL_REASON) {
    if (!this.allRequests.has(key)) {
      return;
    }
    const requestItem = this.allRequests.get(key);
    if (requestItem) {
      if (requestItem.timeoutId) {
        // Cancel requests that have not been queued yet.
        clearTimeout(requestItem.timeoutId);
      }
      // Reject the request, then clear from the queue and known requests.
      requestItem.reject(cancelReason);
    }
    const queueIndex = this.queue.indexOf(key);
    if (queueIndex > -1) {
      this.queue.splice(queueIndex, 1);
    } else {
      const lowPriorityIndex = this.queueLowPriority.indexOf(key);
      if (lowPriorityIndex > -1) {
        this.queueLowPriority.splice(lowPriorityIndex, 1);
      }
    }
    this.allRequests.delete(key);
    this.activeRequests.delete(key);
  }

  /**
   * Rejects all request promises and clears the queue.
   * @param cancelReason A message or object that will be used as the promise rejection.
   */
  cancelAllRequests(cancelReason = DEFAULT_REQUEST_CANCEL_REASON) {
    // Clear the queue so we don't do extra work while filtering it
    this.queue = [];
    this.queueLowPriority = [];
    for (const key of this.allRequests.keys()) {
      this.cancelRequest(key, cancelReason);
    }
  }

  /**
   * Returns whether a request with the given key exists in the RequestQueue and is not cancelled.
   * @param key the key to search for.
   * @returns true if the request is in the RequestQueue.
   */
  hasRequest(key) {
    return this.allRequests.has(key);
  }

  /**
   * Returns whether the request with the given key is currently running (not waiting in the queue).
   * @param key the key to search for.
   * @returns true if the request is actively running.
   */
  requestRunning(key) {
    return this.activeRequests.has(key);
  }
}

/***/ }),

/***/ "./src/utils/SubscribableRequestQueue.ts":
/*!***********************************************!*\
  !*** ./src/utils/SubscribableRequestQueue.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SubscribableRequestQueue)
/* harmony export */ });
/* harmony import */ var _RequestQueue_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./RequestQueue.js */ "./src/utils/RequestQueue.ts");


// eslint-disable-next-line @typescript-eslint/no-explicit-any

/**
 * An extension of `RequestQueue` that adds a concept of "subscribers," which may share references to a single request
 * or cancel their subscription without disrupting the request for other subscribers.
 */
class SubscribableRequestQueue {
  /** The next unused subscriber ID. Increments whenever a subscriber is added. */

  /**
   * Map of subscribers keyed by ID. Subscribers store a map to all their subscriptions by request key.
   * Subscribers are only useful as handles to cancel subscriptions early, so we only need to store rejecters here.
   */

  /** Map from "inner" request (managed by `queue`) to "outer" promises generated per-subscriber. */

  /**
   * Since `SubscribableRequestQueue` wraps `RequestQueue`, its constructor may either take the same arguments as the
   * `RequestQueue` constructor and create a new `RequestQueue`, or it may take an existing `RequestQueue` to wrap.
   */

  constructor(maxActiveRequests, maxLowPriorityRequests) {
    if (typeof maxActiveRequests === "number" || maxActiveRequests === undefined) {
      this.queue = new _RequestQueue_js__WEBPACK_IMPORTED_MODULE_0__["default"](maxActiveRequests, maxLowPriorityRequests);
    } else {
      this.queue = maxActiveRequests;
    }
    this.nextSubscriberId = 0;
    this.subscribers = new Map();
    this.requests = new Map();
  }

  /** Resolves all subscriptions to request `key` with `value` */
  resolveAll(key, value) {
    const requests = this.requests.get(key);
    if (requests) {
      for (const {
        resolve,
        subscriberId
      } of requests) {
        resolve(value);
        this.subscribers.get(subscriberId)?.delete(key);
      }
      this.requests.delete(key);
    }
  }

  /** Rejects all subscriptions to request `key` with `reason` */
  rejectAll(key, reason) {
    const requests = this.requests.get(key);
    if (requests) {
      for (const {
        reject,
        subscriberId
      } of requests) {
        reject(reason);
        this.subscribers.get(subscriberId)?.delete(key);
      }
      this.requests.delete(key);
    }
  }

  /** Adds a new request subscriber. Returns a unique ID to identify this subscriber. */
  addSubscriber() {
    const subscriberId = this.nextSubscriberId;
    this.nextSubscriberId++;
    this.subscribers.set(subscriberId, new Map());
    return subscriberId;
  }

  /**
   * Queues a new request, or adds a subscription if the request is already queued/running.
   *
   * If `subscriberId` is already subscribed to the request, this rejects the existing promise and returns a new one.
   */
  addRequest(key, subscriberId, requestAction, lowPriority, delayMs) {
    // Create single underlying request if it does not yet exist
    this.queue.addRequest(key, requestAction, lowPriority, delayMs).then(value => this.resolveAll(key, value)).catch(reason => this.rejectAll(key, reason));
    if (!this.requests.has(key)) {
      this.requests.set(key, []);
    }

    // Validate subscriber
    if (subscriberId >= this.nextSubscriberId || subscriberId < 0) {
      throw new Error(`SubscribableRequestQueue: subscriber id ${subscriberId} has not been registered`);
    }
    const subscriber = this.subscribers.get(subscriberId);
    if (!subscriber) {
      throw new Error(`SubscribableRequestQueue: subscriber id ${subscriberId} has been removed`);
    }

    // Create promise and add to list of requests
    return new Promise((resolve, reject) => {
      this.requests.get(key)?.push({
        resolve,
        reject,
        subscriberId
      });
      const subscriber = this.subscribers.get(subscriberId);
      const existingRequest = subscriber?.get(key);
      if (existingRequest) {
        existingRequest.push(reject);
      } else {
        subscriber?.set(key, [reject]);
      }
    });
  }

  /**
   * Rejects a subscription and removes it from the list of subscriptions for a request, then cancels the underlying
   * request if it is no longer subscribed and is not running already.
   */
  rejectSubscription(key, reject, cancelReason) {
    // Reject the outer "subscription" promise
    reject(cancelReason);

    // Get the list of subscriptions for this request
    const subscriptions = this.requests.get(key);
    if (!subscriptions) {
      // This should never happen
      return;
    }
    // Remove this request subscription by ref equality to `reject`
    const idx = subscriptions.findIndex(sub => sub.reject === reject);
    if (idx >= 0) {
      subscriptions.splice(idx, 1);
    }

    // Remove the underlying request if there are no more subscribers and the request is not already running
    if (subscriptions.length < 1 && !this.queue.requestRunning(key)) {
      this.queue.cancelRequest(key, cancelReason);
      this.requests.delete(key);
    }
  }

  /** Cancels a request subscription, and cancels the underlying request if it is no longer subscribed or running. */
  cancelRequest(key, subscriberId, cancelReason) {
    const subscriber = this.subscribers.get(subscriberId);
    if (!subscriber) {
      return false;
    }
    const rejecters = subscriber.get(key);
    if (!rejecters || !rejecters.length) {
      return false;
    }
    for (const reject of rejecters) {
      this.rejectSubscription(key, reject, cancelReason);
    }
    subscriber.delete(key);
    return true;
  }

  /** Removes a subscriber and cancels its remaining subscriptions. */
  removeSubscriber(subscriberId, cancelReason) {
    const subscriptions = this.subscribers.get(subscriberId);
    if (subscriptions) {
      for (const [key, rejecters] of subscriptions.entries()) {
        for (const reject of rejecters) {
          this.rejectSubscription(key, reject, cancelReason);
        }
      }
      this.subscribers.delete(subscriberId);
    }
  }

  /** Returns whether a request with the given `key` is running or waiting in the queue */
  hasRequest(key) {
    return this.queue.hasRequest(key);
  }

  /** Returns whether a request with the given `key` is running */
  requestRunning(key) {
    return this.queue.requestRunning(key);
  }

  /** Returns whether a subscriber with the given `subscriberId` exists */
  hasSubscriber(subscriberId) {
    return this.subscribers.has(subscriberId);
  }

  /** Returns whether a subscriber with the given `subscriberId` is subscribed to the request with the given `key` */
  isSubscribed(subscriberId, key) {
    return this.subscribers.get(subscriberId)?.has(key) ?? false;
  }
}

/***/ }),

/***/ "./src/workers/VolumeLoadWorker.ts":
/*!*****************************************!*\
  !*** ./src/workers/VolumeLoadWorker.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var serialize_error__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! serialize-error */ "./node_modules/serialize-error/index.js");
/* harmony import */ var _VolumeCache_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../VolumeCache.js */ "./src/VolumeCache.ts");
/* harmony import */ var _loaders_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../loaders/index.js */ "./src/loaders/index.ts");
/* harmony import */ var _loaders_VolumeLoadError_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../loaders/VolumeLoadError.js */ "./src/loaders/VolumeLoadError.ts");
/* harmony import */ var _utils_RequestQueue_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/RequestQueue.js */ "./src/utils/RequestQueue.ts");
/* harmony import */ var _utils_SubscribableRequestQueue_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/SubscribableRequestQueue.js */ "./src/utils/SubscribableRequestQueue.ts");
/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./types.js */ "./src/workers/types.ts");
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./util.js */ "./src/workers/util.ts");








let cache = undefined;
let queue = undefined;
let subscribableQueue = undefined;
let loader = undefined;
let initialized = false;
let copyOnLoad = false;
const messageHandlers = {
  [_types_js__WEBPACK_IMPORTED_MODULE_5__.WorkerMsgType.INIT]: ({
    maxCacheSize,
    maxActiveRequests,
    maxLowPriorityRequests
  }) => {
    if (!initialized) {
      cache = new _VolumeCache_js__WEBPACK_IMPORTED_MODULE_0__["default"](maxCacheSize);
      queue = new _utils_RequestQueue_js__WEBPACK_IMPORTED_MODULE_3__["default"](maxActiveRequests, maxLowPriorityRequests);
      subscribableQueue = new _utils_SubscribableRequestQueue_js__WEBPACK_IMPORTED_MODULE_4__["default"](queue);
      initialized = true;
    }
    return Promise.resolve();
  },
  [_types_js__WEBPACK_IMPORTED_MODULE_5__.WorkerMsgType.CREATE_LOADER]: async ({
    path,
    options
  }) => {
    const pathString = Array.isArray(path) ? path[0] : path;
    const fileType = options?.fileType || (0,_loaders_index_js__WEBPACK_IMPORTED_MODULE_1__.pathToFileType)(pathString);
    copyOnLoad = fileType === _loaders_index_js__WEBPACK_IMPORTED_MODULE_1__.VolumeFileFormat.JSON;
    loader = await (0,_loaders_index_js__WEBPACK_IMPORTED_MODULE_1__.createVolumeLoader)(path, {
      ...options,
      cache,
      queue: subscribableQueue
    });
    return loader !== undefined;
  },
  [_types_js__WEBPACK_IMPORTED_MODULE_5__.WorkerMsgType.CREATE_VOLUME]: async loadSpec => {
    if (loader === undefined) {
      throw new _loaders_VolumeLoadError_js__WEBPACK_IMPORTED_MODULE_2__.VolumeLoadError("No loader created");
    }
    return await loader.createImageInfo((0,_util_js__WEBPACK_IMPORTED_MODULE_6__.rebuildLoadSpec)(loadSpec));
  },
  [_types_js__WEBPACK_IMPORTED_MODULE_5__.WorkerMsgType.LOAD_DIMS]: async loadSpec => {
    if (loader === undefined) {
      throw new _loaders_VolumeLoadError_js__WEBPACK_IMPORTED_MODULE_2__.VolumeLoadError("No loader created");
    }
    return await loader.loadDims((0,_util_js__WEBPACK_IMPORTED_MODULE_6__.rebuildLoadSpec)(loadSpec));
  },
  [_types_js__WEBPACK_IMPORTED_MODULE_5__.WorkerMsgType.LOAD_VOLUME_DATA]: ({
    imageInfo,
    loadSpec,
    loaderId,
    loadId
  }) => {
    if (loader === undefined) {
      throw new _loaders_VolumeLoadError_js__WEBPACK_IMPORTED_MODULE_2__.VolumeLoadError("No loader created");
    }
    return loader.loadRawChannelData((0,_util_js__WEBPACK_IMPORTED_MODULE_6__.rebuildImageInfo)(imageInfo), (0,_util_js__WEBPACK_IMPORTED_MODULE_6__.rebuildLoadSpec)(loadSpec), (imageInfo, loadSpec) => {
      const message = {
        responseResult: _types_js__WEBPACK_IMPORTED_MODULE_5__.WorkerResponseResult.EVENT,
        eventType: _types_js__WEBPACK_IMPORTED_MODULE_5__.WorkerEventType.METADATA_UPDATE,
        loaderId,
        loadId,
        imageInfo,
        loadSpec
      };
      self.postMessage(message);
    }, (channelIndex, dtype, data, ranges, atlasDims) => {
      const message = {
        responseResult: _types_js__WEBPACK_IMPORTED_MODULE_5__.WorkerResponseResult.EVENT,
        eventType: _types_js__WEBPACK_IMPORTED_MODULE_5__.WorkerEventType.CHANNEL_LOAD,
        loaderId,
        loadId,
        channelIndex,
        dtype,
        data,
        ranges,
        atlasDims
      };
      self.postMessage(message, copyOnLoad ? [] : data.map(d => d.buffer));
    });
  },
  [_types_js__WEBPACK_IMPORTED_MODULE_5__.WorkerMsgType.SET_PREFETCH_PRIORITY_DIRECTIONS]: directions => {
    // Silently does nothing if the loader isn't an `OMEZarrLoader`
    loader?.setPrefetchPriority(directions);
    return Promise.resolve();
  },
  [_types_js__WEBPACK_IMPORTED_MODULE_5__.WorkerMsgType.SYNCHRONIZE_MULTICHANNEL_LOADING]: syncChannels => {
    loader?.syncMultichannelLoading(syncChannels);
    return Promise.resolve();
  }
};
self.onmessage = async ({
  data
}) => {
  const {
    msgId,
    type,
    payload
  } = data;
  let message;
  try {
    const response = await messageHandlers[type](payload);
    message = {
      responseResult: _types_js__WEBPACK_IMPORTED_MODULE_5__.WorkerResponseResult.SUCCESS,
      msgId,
      type,
      payload: response
    };
  } catch (e) {
    message = {
      responseResult: _types_js__WEBPACK_IMPORTED_MODULE_5__.WorkerResponseResult.ERROR,
      msgId,
      type,
      payload: (0,serialize_error__WEBPACK_IMPORTED_MODULE_7__.serializeError)(e)
    };
  }
  self.postMessage(message);
};

/***/ }),

/***/ "./src/workers/types.ts":
/*!******************************!*\
  !*** ./src/workers/types.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   WorkerEventType: () => (/* binding */ WorkerEventType),
/* harmony export */   WorkerMsgType: () => (/* binding */ WorkerMsgType),
/* harmony export */   WorkerResponseResult: () => (/* binding */ WorkerResponseResult)
/* harmony export */ });
/** The types of requests that can be made to the worker. Mostly corresponds to methods on `IVolumeLoader`. */
let WorkerMsgType = /*#__PURE__*/function (WorkerMsgType) {
  WorkerMsgType[WorkerMsgType["INIT"] = 0] = "INIT";
  WorkerMsgType[WorkerMsgType["CREATE_LOADER"] = 1] = "CREATE_LOADER";
  WorkerMsgType[WorkerMsgType["CREATE_VOLUME"] = 2] = "CREATE_VOLUME";
  WorkerMsgType[WorkerMsgType["LOAD_DIMS"] = 3] = "LOAD_DIMS";
  WorkerMsgType[WorkerMsgType["LOAD_VOLUME_DATA"] = 4] = "LOAD_VOLUME_DATA";
  WorkerMsgType[WorkerMsgType["SET_PREFETCH_PRIORITY_DIRECTIONS"] = 5] = "SET_PREFETCH_PRIORITY_DIRECTIONS";
  WorkerMsgType[WorkerMsgType["SYNCHRONIZE_MULTICHANNEL_LOADING"] = 6] = "SYNCHRONIZE_MULTICHANNEL_LOADING";
  return WorkerMsgType;
}({});

/** The kind of response a worker can return - `SUCCESS`, `ERROR`, or `EVENT`. */
let WorkerResponseResult = /*#__PURE__*/function (WorkerResponseResult) {
  WorkerResponseResult[WorkerResponseResult["SUCCESS"] = 0] = "SUCCESS";
  WorkerResponseResult[WorkerResponseResult["ERROR"] = 1] = "ERROR";
  WorkerResponseResult[WorkerResponseResult["EVENT"] = 2] = "EVENT";
  return WorkerResponseResult;
}({});

/** The kind of events that can occur when loading */
let WorkerEventType = /*#__PURE__*/function (WorkerEventType) {
  WorkerEventType[WorkerEventType["METADATA_UPDATE"] = 0] = "METADATA_UPDATE";
  WorkerEventType[WorkerEventType["CHANNEL_LOAD"] = 1] = "CHANNEL_LOAD";
  return WorkerEventType;
}({});

/** All messages to/from a worker carry a `msgId`, a `type`, and a `payload` (whose type is determined by `type`). */

/** Maps each `WorkerMsgType` to the type of the payload of requests of that type. */

/** Maps each `WorkerMsgType` to the type of the payload of responses of that type. */

/** Event for when a batch of channel data loads. */

/** Event for when metadata updates. */

/** All valid types of worker requests, with some `WorkerMsgType` and a matching payload type. */

/** All valid types of worker responses: `SUCCESS` with a matching payload, `ERROR` with a message, or an `EVENT`. */

/***/ }),

/***/ "./src/workers/util.ts":
/*!*****************************!*\
  !*** ./src/workers/util.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   rebuildImageInfo: () => (/* binding */ rebuildImageInfo),
/* harmony export */   rebuildLoadSpec: () => (/* binding */ rebuildLoadSpec)
/* harmony export */ });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");

/** Recreates a `LoadSpec` that has just been sent to/from a worker to restore three.js object prototypes */
function rebuildLoadSpec(spec) {
  return {
    ...spec,
    subregion: new three__WEBPACK_IMPORTED_MODULE_0__.Box3(new three__WEBPACK_IMPORTED_MODULE_0__.Vector3().copy(spec.subregion.min), new three__WEBPACK_IMPORTED_MODULE_0__.Vector3().copy(spec.subregion.max))
  };
}

/** Recreates an `ImageInfo` that has just been sent to/from a worker to restore three.js object prototypes */
function rebuildImageInfo(imageInfo) {
  return {
    ...imageInfo,
    originalSize: new three__WEBPACK_IMPORTED_MODULE_0__.Vector3().copy(imageInfo.originalSize),
    atlasTileDims: new three__WEBPACK_IMPORTED_MODULE_0__.Vector2().copy(imageInfo.atlasTileDims),
    volumeSize: new three__WEBPACK_IMPORTED_MODULE_0__.Vector3().copy(imageInfo.volumeSize),
    subregionSize: new three__WEBPACK_IMPORTED_MODULE_0__.Vector3().copy(imageInfo.subregionSize),
    subregionOffset: new three__WEBPACK_IMPORTED_MODULE_0__.Vector3().copy(imageInfo.subregionOffset),
    physicalPixelSize: new three__WEBPACK_IMPORTED_MODULE_0__.Vector3().copy(imageInfo.physicalPixelSize),
    transform: {
      translation: new three__WEBPACK_IMPORTED_MODULE_0__.Vector3().copy(imageInfo.transform.translation),
      rotation: new three__WEBPACK_IMPORTED_MODULE_0__.Vector3().copy(imageInfo.transform.rotation)
    }
  };
}

/***/ }),

/***/ "?cdec":
/*!**********************!*\
  !*** http (ignored) ***!
  \**********************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "?753a":
/*!***********************!*\
  !*** https (ignored) ***!
  \***********************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "?4e4d":
/*!*********************!*\
  !*** url (ignored) ***!
  \*********************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "?662e":
/*!********************!*\
  !*** fs (ignored) ***!
  \********************/
/***/ (() => {

/* (ignored) */

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// the startup function
/******/ 	__webpack_require__.x = () => {
/******/ 		// Load entry module and return exports
/******/ 		// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 		var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_zarrita_core_dist_src_errors_js-node_modules_geotiff_dist-module_geotiff-5b1ba2","vendors-node_modules_zarrita_core_dist_src_open_js-node_modules_zarrita_indexing_dist_src_ops-e78182"], () => (__webpack_require__("./src/workers/VolumeLoadWorker.ts")))
/******/ 		__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 		return __webpack_exports__;
/******/ 	};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks and sibling chunks for the entrypoint
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".volume-viewer-ui.bundle.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript && document.currentScript.tagName.toUpperCase() === 'SCRIPT')
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && (!scriptUrl || !/^http(s?):/.test(scriptUrl))) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/importScripts chunk loading */
/******/ 	(() => {
/******/ 		__webpack_require__.b = self.location + "";
/******/ 		
/******/ 		// object to store loaded chunks
/******/ 		// "1" means "already loaded"
/******/ 		var installedChunks = {
/******/ 			"src_workers_VolumeLoadWorker_ts": 1
/******/ 		};
/******/ 		
/******/ 		// importScripts chunk loading
/******/ 		var installChunk = (data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			for(var moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 				}
/******/ 			}
/******/ 			if(runtime) runtime(__webpack_require__);
/******/ 			while(chunkIds.length)
/******/ 				installedChunks[chunkIds.pop()] = 1;
/******/ 			parentChunkLoadingFunction(data);
/******/ 		};
/******/ 		__webpack_require__.f.i = (chunkId, promises) => {
/******/ 			// "1" is the signal for "already loaded"
/******/ 			if(!installedChunks[chunkId]) {
/******/ 				if(true) { // all chunks have JS
/******/ 					importScripts(__webpack_require__.p + __webpack_require__.u(chunkId));
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunk_aics_volume_viewer"] = self["webpackChunk_aics_volume_viewer"] || [];
/******/ 		var parentChunkLoadingFunction = chunkLoadingGlobal.push.bind(chunkLoadingGlobal);
/******/ 		chunkLoadingGlobal.push = installChunk;
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/startup chunk dependencies */
/******/ 	(() => {
/******/ 		var next = __webpack_require__.x;
/******/ 		__webpack_require__.x = () => {
/******/ 			return Promise.all([
/******/ 				__webpack_require__.e("vendors-node_modules_zarrita_core_dist_src_errors_js-node_modules_geotiff_dist-module_geotiff-5b1ba2"),
/******/ 				__webpack_require__.e("vendors-node_modules_zarrita_core_dist_src_open_js-node_modules_zarrita_indexing_dist_src_ops-e78182")
/******/ 			]).then(next);
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// run startup
/******/ 	var __webpack_exports__ = __webpack_require__.x();
/******/ 	
/******/ })()
;
//# sourceMappingURL=src_workers_VolumeLoadWorker_ts.volume-viewer-ui.bundle.js.map
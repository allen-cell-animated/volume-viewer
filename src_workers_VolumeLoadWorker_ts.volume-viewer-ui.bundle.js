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
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var _Histogram__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Histogram */ "./src/Histogram.ts");





// Data and processing for a single channel
var Channel = /*#__PURE__*/function () {
  function Channel(name) {
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, Channel);
    this.loaded = false;
    this.imgData = {
      data: new Uint8ClampedArray(),
      width: 0,
      height: 0
    };

    // on gpu
    this.dataTexture = new three__WEBPACK_IMPORTED_MODULE_3__.DataTexture(new Uint8Array(), 0, 0);
    this.lutTexture = new three__WEBPACK_IMPORTED_MODULE_3__.DataTexture(new Uint8Array(_Histogram__WEBPACK_IMPORTED_MODULE_2__.LUT_ARRAY_LENGTH), 256, 1, three__WEBPACK_IMPORTED_MODULE_3__.RGBAFormat, three__WEBPACK_IMPORTED_MODULE_3__.UnsignedByteType);
    this.lutTexture.minFilter = this.lutTexture.magFilter = three__WEBPACK_IMPORTED_MODULE_3__.LinearFilter;
    this.lutTexture.generateMipmaps = false;
    this.volumeData = new Uint8Array();
    this.name = name;
    this.histogram = new _Histogram__WEBPACK_IMPORTED_MODULE_2__["default"](new Uint8Array());
    this.dims = [0, 0, 0];

    // intensity remapping lookup table
    this.lut = new Uint8Array(_Histogram__WEBPACK_IMPORTED_MODULE_2__.LUT_ARRAY_LENGTH).fill(0);
    // per-intensity color labeling (disabled initially)
    this.colorPalette = new Uint8Array(_Histogram__WEBPACK_IMPORTED_MODULE_2__.LUT_ARRAY_LENGTH).fill(0);
    // store in 0..1 range. 1 means fully colorPalette, 0 means fully lut.
    this.colorPaletteAlpha = 0.0;
  }

  // rgbColor is [0..255, 0..255, 0..255]
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(Channel, [{
    key: "combineLuts",
    value: function combineLuts(rgbColor, out) {
      var ret = out ? out : new Uint8Array(_Histogram__WEBPACK_IMPORTED_MODULE_2__.LUT_ARRAY_LENGTH);
      if (!rgbColor) {
        return ret;
      }
      var rgb = [rgbColor[0] / 255.0, rgbColor[1] / 255.0, rgbColor[2] / 255.0];
      // colorPalette*alpha + rgb*lut*(1-alpha)
      // a tiny bit faster for the edge cases
      if (this.colorPaletteAlpha === 1.0) {
        ret.set(this.colorPalette);
      } else if (this.colorPaletteAlpha === 0.0) {
        ret.set(this.lut);
        for (var i = 0; i < _Histogram__WEBPACK_IMPORTED_MODULE_2__.LUT_ARRAY_LENGTH / 4; ++i) {
          ret[i * 4 + 0] *= rgb[0];
          ret[i * 4 + 1] *= rgb[1];
          ret[i * 4 + 2] *= rgb[2];
        }
      } else {
        for (var _i = 0; _i < _Histogram__WEBPACK_IMPORTED_MODULE_2__.LUT_ARRAY_LENGTH / 4; ++_i) {
          ret[_i * 4 + 0] = this.colorPalette[_i * 4 + 0] * this.colorPaletteAlpha + this.lut[_i * 4 + 0] * (1.0 - this.colorPaletteAlpha) * rgb[0];
          ret[_i * 4 + 1] = this.colorPalette[_i * 4 + 1] * this.colorPaletteAlpha + this.lut[_i * 4 + 1] * (1.0 - this.colorPaletteAlpha) * rgb[1];
          ret[_i * 4 + 2] = this.colorPalette[_i * 4 + 2] * this.colorPaletteAlpha + this.lut[_i * 4 + 2] * (1.0 - this.colorPaletteAlpha) * rgb[2];
          ret[_i * 4 + 3] = this.colorPalette[_i * 4 + 3] * this.colorPaletteAlpha + this.lut[_i * 4 + 3] * (1.0 - this.colorPaletteAlpha);
        }
      }
      this.lutTexture.image.data.set(ret);
      this.lutTexture.needsUpdate = true;
      return ret;
    }
  }, {
    key: "getHistogram",
    value: function getHistogram() {
      return this.histogram;
    }
  }, {
    key: "getIntensity",
    value: function getIntensity(x, y, z) {
      return this.volumeData[x + y * this.dims[0] + z * (this.dims[0] * this.dims[1])];
    }

    // how to index into tiled texture atlas
  }, {
    key: "getIntensityFromAtlas",
    value: function getIntensityFromAtlas(x, y, z) {
      var numXtiles = this.imgData.width / this.dims[0];
      var tilex = z % numXtiles;
      var tiley = Math.floor(z / numXtiles);
      var offset = tilex * this.dims[0] + x + (tiley * this.dims[1] + y) * this.imgData.width;
      return this.imgData.data[offset];
    }
  }, {
    key: "rebuildDataTexture",
    value: function rebuildDataTexture(data, w, h) {
      if (this.dataTexture) {
        this.dataTexture.dispose();
      }
      this.dataTexture = new three__WEBPACK_IMPORTED_MODULE_3__.DataTexture(data, w, h);
      this.dataTexture.format = three__WEBPACK_IMPORTED_MODULE_3__.RedFormat;
      this.dataTexture.type = three__WEBPACK_IMPORTED_MODULE_3__.UnsignedByteType;
      this.dataTexture.magFilter = three__WEBPACK_IMPORTED_MODULE_3__.NearestFilter;
      this.dataTexture.minFilter = three__WEBPACK_IMPORTED_MODULE_3__.NearestFilter;
      this.dataTexture.generateMipmaps = false;
      this.dataTexture.needsUpdate = true;
    }

    // give the channel fresh data and initialize from that data
    // data is formatted as a texture atlas where each tile is a z slice of the volume
  }, {
    key: "setBits",
    value: function setBits(bitsArray, w, h) {
      this.imgData = {
        data: new Uint8ClampedArray(bitsArray.buffer),
        width: w,
        height: h
      };
      this.rebuildDataTexture(this.imgData.data, w, h);
      this.loaded = true;
      this.histogram = new _Histogram__WEBPACK_IMPORTED_MODULE_2__["default"](bitsArray);
      this.lutGenerator_auto2();
    }

    // let's rearrange this.imgData.data into a 3d array.
    // it is assumed to be coming in as a flat Uint8Array of size x*y*z
    // with x*y*z layout (first row of first plane is the first data in the layout,
    // then second row of first plane, etc)
  }, {
    key: "unpackVolumeFromAtlas",
    value: function unpackVolumeFromAtlas(x, y, z) {
      var volimgdata = this.imgData.data;
      this.dims = [x, y, z];
      this.volumeData = new Uint8Array(x * y * z);
      var numXtiles = this.imgData.width / x;
      var atlasrow = this.imgData.width;
      var tilex = 0,
        tiley = 0,
        tileoffset = 0,
        tilerowoffset = 0;
      for (var i = 0; i < z; ++i) {
        // tile offset
        tilex = i % numXtiles;
        tiley = Math.floor(i / numXtiles);
        tileoffset = tilex * x + tiley * y * atlasrow;
        for (var j = 0; j < y; ++j) {
          tilerowoffset = j * atlasrow;
          for (var k = 0; k < x; ++k) {
            this.volumeData[i * (x * y) + j * x + k] = volimgdata[tileoffset + tilerowoffset + k];
          }
        }
      }
    }

    // give the channel fresh volume data and initialize from that data
  }, {
    key: "setFromVolumeData",
    value: function setFromVolumeData(bitsArray, vx, vy, vz, ax, ay) {
      this.dims = [vx, vy, vz];
      this.volumeData = bitsArray;
      // TODO FIXME performance hit for shuffling the data and storing 2 versions of it (could do this in worker at least?)
      this.packToAtlas(vx, vy, vz, ax, ay);
      this.loaded = true;
      this.histogram = new _Histogram__WEBPACK_IMPORTED_MODULE_2__["default"](this.volumeData);
      this.lutGenerator_auto2();
    }

    // given this.volumeData, let's unpack it into a flat textureatlas and fill up this.imgData.
  }, {
    key: "packToAtlas",
    value: function packToAtlas(vx, vy, vz, ax, ay) {
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
      this.imgData = {
        width: ax,
        height: ay,
        data: new Uint8ClampedArray(ax * ay)
      };
      this.imgData.data.fill(0);

      // deposit slices one by one into the imgData.data from volData.
      var volimgdata = this.imgData.data;
      var x = vx,
        y = vy,
        z = vz;
      var numXtiles = this.imgData.width / x;
      var atlasrow = this.imgData.width;
      var tilex = 0,
        tiley = 0,
        tileoffset = 0,
        tilerowoffset = 0;
      for (var i = 0; i < z; ++i) {
        // tile offset
        tilex = i % numXtiles;
        tiley = Math.floor(i / numXtiles);
        tileoffset = tilex * x + tiley * y * atlasrow;
        for (var j = 0; j < y; ++j) {
          tilerowoffset = j * atlasrow;
          for (var k = 0; k < x; ++k) {
            volimgdata[tileoffset + tilerowoffset + k] = this.volumeData[i * (x * y) + j * x + k];
          }
        }
      }
      this.rebuildDataTexture(this.imgData.data, ax, ay);
    }

    // lut should be an uint8array of 256*4 elements (256 rgba8 values)
  }, {
    key: "setLut",
    value: function setLut(lut) {
      this.lut = lut;
    }

    // palette should be an uint8array of 256*4 elements (256 rgba8 values)
  }, {
    key: "setColorPalette",
    value: function setColorPalette(palette) {
      this.colorPalette = palette;
    }
  }, {
    key: "setColorPaletteAlpha",
    value: function setColorPaletteAlpha(alpha) {
      this.colorPaletteAlpha = alpha;
    }

    /* eslint-disable @typescript-eslint/naming-convention */
  }, {
    key: "lutGenerator_windowLevel",
    value: function lutGenerator_windowLevel(wnd, lvl) {
      if (!this.loaded) {
        return;
      }
      var lut = this.histogram.lutGenerator_windowLevel(wnd, lvl);
      this.setLut(lut.lut);
    }
  }, {
    key: "lutGenerator_fullRange",
    value: function lutGenerator_fullRange() {
      if (!this.loaded) {
        return;
      }
      var lut = this.histogram.lutGenerator_fullRange();
      this.setLut(lut.lut);
    }
  }, {
    key: "lutGenerator_dataRange",
    value: function lutGenerator_dataRange() {
      if (!this.loaded) {
        return;
      }
      var lut = this.histogram.lutGenerator_dataRange();
      this.setLut(lut.lut);
    }
  }, {
    key: "lutGenerator_bestFit",
    value: function lutGenerator_bestFit() {
      if (!this.loaded) {
        return;
      }
      var lut = this.histogram.lutGenerator_bestFit();
      this.setLut(lut.lut);
    }

    // attempt to redo imagej's Auto
  }, {
    key: "lutGenerator_auto2",
    value: function lutGenerator_auto2() {
      if (!this.loaded) {
        return;
      }
      var lut = this.histogram.lutGenerator_auto2();
      this.setLut(lut.lut);
    }
  }, {
    key: "lutGenerator_auto",
    value: function lutGenerator_auto() {
      if (!this.loaded) {
        return;
      }
      var lut = this.histogram.lutGenerator_auto();
      this.setLut(lut.lut);
    }
  }, {
    key: "lutGenerator_equalize",
    value: function lutGenerator_equalize() {
      if (!this.loaded) {
        return;
      }
      var lut = this.histogram.lutGenerator_equalize();
      this.setLut(lut.lut);
    }
  }, {
    key: "lutGenerator_percentiles",
    value: function lutGenerator_percentiles(lo, hi) {
      if (!this.loaded) {
        return;
      }
      var lut = this.histogram.lutGenerator_percentiles(lo, hi);
      this.setLut(lut.lut);
    }
    /* eslint-enable @typescript-eslint/naming-convention */
  }]);
  return Channel;
}();


/***/ }),

/***/ "./src/Histogram.ts":
/*!**************************!*\
  !*** ./src/Histogram.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LUT_ARRAY_LENGTH: () => (/* binding */ LUT_ARRAY_LENGTH),
/* harmony export */   "default": () => (/* binding */ Histogram)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _constants_colors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants/colors */ "./src/constants/colors.ts");



function clamp(val, cmin, cmax) {
  return Math.min(Math.max(cmin, val), cmax);
}
function controlPointToRGBA(controlPoint) {
  return [controlPoint.color[0], controlPoint.color[1], controlPoint.color[2], Math.floor(controlPoint.opacity * 255)];
}
function lerp(xmin, xmax, a) {
  return a * (xmax - xmin) + xmin;
}
var LUT_ENTRIES = 256;
var LUT_ARRAY_LENGTH = LUT_ENTRIES * 4;

/**
 * @typedef {Object} ControlPoint Used for the TF (transfer function) editor GUI.
 * Need to be converted to LUT for rendering.
 * @property {number} x The X Coordinate
 * @property {number} opacity The Opacity, from 0 to 1
 * @property {Array.<number>} color The Color, 3 numbers from 0-255 for r,g,b
 */

/**
 * @typedef {Object} Lut Used for rendering.
 * @property {Array.<number>} lut LUT_ARRAY_LENGTH element lookup table as array
 * (maps scalar intensity to a rgb color plus alpha, with each value from 0-255)
 * @property {Array.<ControlPoint>} controlPoints
 */
/**
 * Builds a histogram with 256 bins from a data array. Assume data is 8 bit single channel grayscale.
 * @class
 * @param {Array.<number>} data
 */
var Histogram = /*#__PURE__*/function () {
  function Histogram(data) {
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, Histogram);
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
    for (var _i = 1; _i < this.bins.length; _i++) {
      if (this.bins[_i] > 0) {
        this.dataMin = _i;
        break;
      }
    }
    for (var _i2 = this.bins.length - 1; _i2 >= 1; _i2--) {
      if (this.bins[_i2] > 0) {
        this.dataMax = _i2;
        break;
      }
    }

    // total number of pixels minus the number of zero pixels
    this.nonzeroPixelCount = data.length - this.bins[0];

    // get the bin with the most frequently occurring NONZERO value
    this.maxBin = 1;
    var max = this.bins[1];
    for (var _i3 = 1; _i3 < this.bins.length; _i3++) {
      if (this.bins[_i3] > max) {
        this.maxBin = _i3;
        max = this.bins[_i3];
      }
    }
  }

  /**
   * Return the min data value
   * @return {number}
   */
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(Histogram, [{
    key: "getMin",
    value: function getMin() {
      return this.dataMin;
    }

    /**
     * Return the max data value
     * @return {number}
     */
  }, {
    key: "getMax",
    value: function getMax() {
      return this.dataMax;
    }

    /* eslint-disable @typescript-eslint/naming-convention */

    /**
     * Generate a Window/level lookup table
     * @return {Lut}
     * @param {number} wnd in 0..1 range
     * @param {number} lvl in 0..1 range
     */
  }, {
    key: "lutGenerator_windowLevel",
    value: function lutGenerator_windowLevel(wnd, lvl) {
      // simple linear mapping for actual range
      var b = lvl - wnd * 0.5;
      var e = lvl + wnd * 0.5;
      return this.lutGenerator_minMax(b * 255, e * 255);
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
  }, {
    key: "lutGenerator_minMax",
    value: function lutGenerator_minMax(b, e) {
      if (e < b) {
        // swap
        var tmp = e;
        e = b;
        b = tmp;
      }
      var lut = new Uint8Array(LUT_ARRAY_LENGTH);
      for (var x = 0; x < lut.length / 4; ++x) {
        lut[x * 4 + 0] = 255;
        lut[x * 4 + 1] = 255;
        lut[x * 4 + 2] = 255;
        if (x > e) {
          lut[x * 4 + 3] = 255;
        } else if (x <= b) {
          lut[x * 4 + 3] = 0;
        } else {
          if (e === b) {
            lut[x * 4 + 3] = 255;
          } else {
            var a = (x - b) / (e - b);
            lut[x * 4 + 3] = lerp(0, 255, a);
          }
        }
      }

      // Edge case: b and e are both out of bounds
      if (b < 0 && e < 0) {
        return {
          lut: lut,
          controlPoints: [{
            x: 0,
            opacity: 1,
            color: [255, 255, 255]
          }, {
            x: 255,
            opacity: 1,
            color: [255, 255, 255]
          }]
        };
      }
      if (b >= 255 && e >= 255) {
        return {
          lut: lut,
          controlPoints: [{
            x: 0,
            opacity: 0,
            color: [255, 255, 255]
          }, {
            x: 255,
            opacity: 0,
            color: [255, 255, 255]
          }]
        };
      }

      // Generate 2 to 4 control points for a minMax LUT, from left to right
      var controlPoints = [];

      // Add starting point at x = 0
      var startVal = 0;
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
      var endVal = 1;
      if (e > 255) {
        endVal = (255 - b) / (e - b);
      }
      controlPoints.push({
        x: 255,
        opacity: endVal,
        color: [255, 255, 255]
      });
      return {
        lut: lut,
        controlPoints: controlPoints
      };
    }

    /**
     * Generate a straight 0-1 linear identity lookup table
     * @return {Lut}
     */
  }, {
    key: "lutGenerator_fullRange",
    value: function lutGenerator_fullRange() {
      var lut = new Uint8Array(LUT_ARRAY_LENGTH);

      // simple linear mapping for actual range
      for (var x = 0; x < lut.length / 4; ++x) {
        lut[x * 4 + 0] = 255;
        lut[x * 4 + 1] = 255;
        lut[x * 4 + 2] = 255;
        lut[x * 4 + 3] = x;
      }
      return {
        lut: lut,
        controlPoints: [{
          x: 0,
          opacity: 0,
          color: [255, 255, 255]
        }, {
          x: 255,
          opacity: 1,
          color: [255, 255, 255]
        }]
      };
    }

    /**
     * Generate a lookup table over the min to max range of the data values
     * @return {Lut}
     */
  }, {
    key: "lutGenerator_dataRange",
    value: function lutGenerator_dataRange() {
      // simple linear mapping for actual range
      var b = this.dataMin;
      var e = this.dataMax;
      return this.lutGenerator_minMax(b, e);
    }

    /**
     * Generate a lookup table with a different color per intensity value
     * @return {Lut}
     */
  }, {
    key: "lutGenerator_labelColors",
    value: function lutGenerator_labelColors() {
      var lut = new Uint8Array(LUT_ARRAY_LENGTH).fill(0);
      // TODO specify type for control point
      var controlPoints = [];
      controlPoints.push({
        x: 0,
        opacity: 0,
        color: [0, 0, 0]
      });
      var lastr = 0;
      var lastg = 0;
      var lastb = 0;
      var lasta = 0;
      var r = 0;
      var g = 0;
      var b = 0;
      var a = 0;

      // assumes exactly one bin per intensity value?
      // skip zero!!!
      for (var i = 1; i < this.bins.length; ++i) {
        if (this.bins[i] > 0) {
          var rgb = (0,_constants_colors__WEBPACK_IMPORTED_MODULE_2__.getColorByChannelIndex)(i);
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
      return {
        lut: lut,
        controlPoints: controlPoints
      };
    }

    /**
     * Find the bin that contains the percentage of pixels below it
     * @return {number}
     * @param {number} pct
     */
  }, {
    key: "findBinOfPercentile",
    value: function findBinOfPercentile(pct) {
      var pixcount = this.nonzeroPixelCount + this.bins[0];
      var limit = pixcount * pct;
      var i = 0;
      var count = 0;
      for (i = 0; i < this.bins.length; ++i) {
        count += this.bins[i];
        if (count > limit) {
          break;
        }
      }
      return i;
    }

    /**
     * Generate a lookup table based on histogram percentiles
     * @return {Lut}
     * @param {number} pmin
     * @param {number} pmax
     */
  }, {
    key: "lutGenerator_percentiles",
    value: function lutGenerator_percentiles(pmin, pmax) {
      // e.g. 0.50, 0.983 starts from 50th percentile bucket and ends at 98.3 percentile bucket.
      var hmin = this.findBinOfPercentile(pmin);
      var hmax = this.findBinOfPercentile(pmax);
      return this.lutGenerator_minMax(hmin, hmax);
    }

    /**
     * Generate a 10% / 90% lookup table
     * @return {Lut}
     */
  }, {
    key: "lutGenerator_bestFit",
    value: function lutGenerator_bestFit() {
      var pixcount = this.nonzeroPixelCount;
      //const pixcount = this.imgData.data.length;
      var limit = pixcount / 10;
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
      for (i = this.bins.length - 1; i >= 1; --i) {
        count += this.bins[i];
        if (count > limit) {
          break;
        }
      }
      var hmax = i;
      return this.lutGenerator_minMax(hmin, hmax);
    }

    /**
     * Generate a lookup table attempting to replicate ImageJ's "Auto" button
     * @return {Lut}
     */
  }, {
    key: "lutGenerator_auto2",
    value: function lutGenerator_auto2() {
      var AUTO_THRESHOLD = 5000;
      var pixcount = this.nonzeroPixelCount;
      //  const pixcount = this.imgData.data.length;
      var limit = pixcount / 10;
      var threshold = pixcount / AUTO_THRESHOLD;

      // this will skip the "zero" bin which contains pixels of zero intensity.
      var hmin = this.bins.length - 1;
      var hmax = 1;
      for (var i = 1; i < this.bins.length; ++i) {
        if (this.bins[i] > threshold && this.bins[i] <= limit) {
          hmin = i;
          break;
        }
      }
      for (var _i4 = this.bins.length - 1; _i4 >= 1; --_i4) {
        if (this.bins[_i4] > threshold && this.bins[_i4] <= limit) {
          hmax = _i4;
          break;
        }
      }
      if (hmax < hmin) {
        // just reset to whole range in this case.
        return this.lutGenerator_fullRange();
      } else {
        return this.lutGenerator_minMax(hmin, hmax);
      }
    }

    /**
     * Generate a lookup table using a percentile of the most commonly occurring value
     * @return {Lut}
     */
  }, {
    key: "lutGenerator_auto",
    value: function lutGenerator_auto() {
      // simple linear mapping cutting elements with small appearence
      // get 10% threshold
      var PERCENTAGE = 0.1;
      var th = Math.floor(this.bins[this.maxBin] * PERCENTAGE);
      var b = 0;
      var e = this.bins.length - 1;
      for (var x = 1; x < this.bins.length; ++x) {
        if (this.bins[x] > th) {
          b = x;
          break;
        }
      }
      for (var _x = this.bins.length - 1; _x >= 1; --_x) {
        if (this.bins[_x] > th) {
          e = _x;
          break;
        }
      }
      return this.lutGenerator_minMax(b, e);
    }

    /**
     * Generate an "equalized" lookup table
     * @return {Lut}
     */
  }, {
    key: "lutGenerator_equalize",
    value: function lutGenerator_equalize() {
      var map = [];
      for (var i = 0; i < this.bins.length; ++i) {
        map[i] = 0;
      }

      // summed area table?
      map[0] = this.bins[0];
      for (var _i5 = 1; _i5 < this.bins.length; ++_i5) {
        map[_i5] = map[_i5 - 1] + this.bins[_i5];
      }
      var div = map[map.length - 1] - map[0];
      if (div > 0) {
        var lut = new Uint8Array(LUT_ARRAY_LENGTH);

        // compute lut and track control points for the piecewise linear sections
        var lutControlPoints = [{
          x: 0,
          opacity: 0,
          color: [255, 255, 255]
        }];
        lut[0] = 255;
        lut[1] = 255;
        lut[2] = 255;
        lut[3] = 0;
        var slope = 0;
        var lastSlope = 0;
        var opacity = 0;
        var lastOpacity = 0;
        for (var _i6 = 1; _i6 < lut.length / 4; ++_i6) {
          lut[_i6 * 4 + 0] = 255;
          lut[_i6 * 4 + 1] = 255;
          lut[_i6 * 4 + 2] = 255;
          lastOpacity = opacity;
          opacity = clamp(Math.round(255 * (map[_i6] - map[0])), 0, 255);
          lut[_i6 * 4 + 3] = opacity;
          slope = opacity - lastOpacity;
          // if map[i]-map[i-1] is the same as map[i+1]-map[i] then we are in a linear segment and do not need a new control point
          if (slope != lastSlope) {
            lutControlPoints.push({
              x: _i6 - 1,
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
        return {
          lut: lut,
          controlPoints: lutControlPoints
        };
      } else {
        // just reset to whole range in this case...?
        return this.lutGenerator_fullRange();
      }
    }

    // @param {Object[]} controlPoints - array of {x:number 0..255, opacity:number 0..1, color:array of 3 numbers 0..255}
    // @return {Uint8Array} array of length 256*4 representing the rgba values of the gradient
  }, {
    key: "lutGenerator_fromControlPoints",
    value: function lutGenerator_fromControlPoints(controlPoints) {
      var lut = new Uint8Array(LUT_ARRAY_LENGTH).fill(0);
      if (controlPoints.length === 0) {
        return {
          lut: lut,
          controlPoints: controlPoints
        };
      }

      // ensure they are sorted in ascending order of x
      controlPoints.sort(function (a, b) {
        return a.x - b.x;
      });

      // special case only one control point.
      if (controlPoints.length === 1) {
        var rgba = controlPointToRGBA(controlPoints[0]);
        // copy val from x to 255.
        for (var x = controlPoints[0].x; x < 256; ++x) {
          lut[x * 4 + 0] = rgba[0];
          lut[x * 4 + 1] = rgba[1];
          lut[x * 4 + 2] = rgba[2];
          lut[x * 4 + 3] = rgba[3];
        }
        return {
          lut: lut,
          controlPoints: controlPoints
        };
      }
      var c0 = controlPoints[0];
      var c1 = controlPoints[1];
      var color0 = controlPointToRGBA(c0);
      var color1 = controlPointToRGBA(c1);
      var lastIndex = 1;
      var a = 0;
      // if the first control point is after 0, act like there are 0s going all the way up to it.
      // or lerp up to the first point?
      for (var _x2 = c0.x; _x2 < 256; ++_x2) {
        while (_x2 > c1.x) {
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
        if (c1.x === c0.x) {
          // use c1
          a = 1.0;
        } else {
          a = (_x2 - c0.x) / (c1.x - c0.x);
        }
        // lerp the colors
        lut[_x2 * 4 + 0] = lerp(color0[0], color1[0], a);
        lut[_x2 * 4 + 1] = lerp(color0[1], color1[1], a);
        lut[_x2 * 4 + 2] = lerp(color0[2], color1[2], a);
        lut[_x2 * 4 + 3] = lerp(color0[3], color1[3], a);
      }
      return {
        lut: lut,
        controlPoints: controlPoints
      };
    }
    /* eslint-enable @typescript-eslint/naming-convention */
  }]);
  return Histogram;
}();



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
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var _Channel__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Channel */ "./src/Channel.ts");
/* harmony import */ var _constants_colors__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./constants/colors */ "./src/constants/colors.ts");
/* harmony import */ var _loaders_IVolumeLoader__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./loaders/IVolumeLoader */ "./src/loaders/IVolumeLoader.ts");
/* harmony import */ var _loaders_VolumeLoaderUtils__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./loaders/VolumeLoaderUtils */ "./src/loaders/VolumeLoaderUtils.ts");





function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1__["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }





var getDefaultImageInfo = function getDefaultImageInfo() {
  return {
    name: "",
    originalSize: new three__WEBPACK_IMPORTED_MODULE_9__.Vector3(1, 1, 1),
    atlasTileDims: new three__WEBPACK_IMPORTED_MODULE_9__.Vector2(1, 1),
    volumeSize: new three__WEBPACK_IMPORTED_MODULE_9__.Vector3(1, 1, 1),
    subregionSize: new three__WEBPACK_IMPORTED_MODULE_9__.Vector3(1, 1, 1),
    subregionOffset: new three__WEBPACK_IMPORTED_MODULE_9__.Vector3(0, 0, 0),
    physicalPixelSize: new three__WEBPACK_IMPORTED_MODULE_9__.Vector3(1, 1, 1),
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
      translation: new three__WEBPACK_IMPORTED_MODULE_9__.Vector3(0, 0, 0),
      rotation: new three__WEBPACK_IMPORTED_MODULE_9__.Vector3(0, 0, 0)
    }
  };
};
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
var Volume = /*#__PURE__*/function () {
  // `LoadSpec` representing the minimum data required to display what's in the viewer (subregion, channels, etc.).
  // Used to intelligently issue load requests whenever required by a state change. Modify with `updateRequiredData`.

  function Volume() {
    var imageInfo = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getDefaultImageInfo();
    var loadSpec = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new _loaders_IVolumeLoader__WEBPACK_IMPORTED_MODULE_7__.LoadSpec();
    var loader = arguments.length > 2 ? arguments[2] : undefined;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__["default"])(this, Volume);
    this.loaded = false;
    this.imageInfo = imageInfo;
    this.name = this.imageInfo.name;
    this.loadSpec = _objectSpread({
      // Fill in defaults for optional properties
      multiscaleLevel: 0,
      channels: Array.from({
        length: this.imageInfo.numChannels
      }, function (_val, idx) {
        return idx;
      })
    }, loadSpec);
    this.loadSpecRequired = _objectSpread(_objectSpread({}, this.loadSpec), {}, {
      channels: this.loadSpec.channels.slice(),
      subregion: this.loadSpec.subregion.clone()
    });
    this.loader = loader;
    // imageMetadata to be filled in by Volume Loaders
    this.imageMetadata = {};
    this.normRegionSize = new three__WEBPACK_IMPORTED_MODULE_9__.Vector3(1, 1, 1);
    this.normRegionOffset = new three__WEBPACK_IMPORTED_MODULE_9__.Vector3(0, 0, 0);
    this.physicalSize = new three__WEBPACK_IMPORTED_MODULE_9__.Vector3(1, 1, 1);
    this.physicalScale = 1;
    this.normPhysicalSize = new three__WEBPACK_IMPORTED_MODULE_9__.Vector3(1, 1, 1);
    this.physicalPixelSize = this.imageInfo.physicalPixelSize;
    this.tickMarkPhysicalLength = 1;
    this.setVoxelSize(this.physicalPixelSize);
    this.numChannels = this.imageInfo.numChannels;
    this.channelNames = this.imageInfo.channelNames.slice();
    this.channelColorsDefault = this.imageInfo.channelColors ? this.imageInfo.channelColors.slice() : this.channelNames.map(function (name, index) {
      return (0,_constants_colors__WEBPACK_IMPORTED_MODULE_6__.getColorByChannelIndex)(index);
    });
    // fill in gaps
    if (this.channelColorsDefault.length < this.imageInfo.numChannels) {
      for (var i = this.channelColorsDefault.length - 1; i < this.imageInfo.numChannels; ++i) {
        this.channelColorsDefault[i] = (0,_constants_colors__WEBPACK_IMPORTED_MODULE_6__.getColorByChannelIndex)(i);
      }
    }
    this.channels = [];
    for (var _i = 0; _i < this.imageInfo.numChannels; ++_i) {
      var channel = new _Channel__WEBPACK_IMPORTED_MODULE_5__["default"](this.channelNames[_i]);
      this.channels.push(channel);
      // TODO pass in channel constructor...
      channel.dims = this.imageInfo.subregionSize.toArray();
    }
    this.physicalUnitSymbol = this.imageInfo.spatialUnit;
    this.volumeDataObservers = [];
  }
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__["default"])(Volume, [{
    key: "setUnloaded",
    value: function setUnloaded() {
      this.loaded = false;
      // TODO this will cause problems once it is possible to skip loading some channels. Come back to this then.
      this.channels.forEach(function (channel) {
        channel.loaded = false;
      });
    }
  }, {
    key: "isLoaded",
    value: function isLoaded() {
      return this.loaded;
    }
  }, {
    key: "updateDimensions",
    value: function updateDimensions() {
      var _this$imageInfo = this.imageInfo,
        volumeSize = _this$imageInfo.volumeSize,
        subregionSize = _this$imageInfo.subregionSize,
        subregionOffset = _this$imageInfo.subregionOffset;
      this.setVoxelSize(this.physicalPixelSize);
      this.normRegionSize = subregionSize.clone().divide(volumeSize);
      this.normRegionOffset = subregionOffset.clone().divide(volumeSize);
    }

    /** Call on any state update that may require new data to be loaded (subregion, enabled channels, time, etc.) */
  }, {
    key: "updateRequiredData",
    value: function () {
      var _updateRequiredData = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4___default().mark(function _callee(required, onChannelLoaded) {
        var _this = this;
        var noReload, _this$loadSpec$multis, _this$loader, currentScale, minLevel, dims, loadableLevel, _this$loader2;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4___default().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              this.loadSpecRequired = _objectSpread(_objectSpread({}, this.loadSpecRequired), required);
              noReload = this.loadSpec.time === this.loadSpecRequired.time && this.loadSpec.subregion.containsBox(this.loadSpecRequired.subregion) && this.loadSpecRequired.channels.every(function (channel) {
                return _this.loadSpec.channels.includes(channel);
              }); // An update to `subregion` should trigger a reload when the new subregion is not contained in the old one
              // OR when the new subregion is smaller than the old one by enough that we can load a higher scale level.
              if (!(noReload && !this.loadSpec.subregion.equals(this.loadSpecRequired.subregion))) {
                _context.next = 9;
                break;
              }
              currentScale = this.imageInfo.multiscaleLevel; // `LoadSpec.multiscaleLevel`, if specified, forces a cap on the scale level we can load.
              minLevel = (_this$loadSpec$multis = this.loadSpec.multiscaleLevel) !== null && _this$loadSpec$multis !== void 0 ? _this$loadSpec$multis : 0; // Loaders should cache loaded dimensions so that this call blocks no more than once per valid `LoadSpec`.
              _context.next = 7;
              return (_this$loader = this.loader) === null || _this$loader === void 0 ? void 0 : _this$loader.loadDims(this.loadSpecRequired);
            case 7:
              dims = _context.sent;
              if (dims) {
                loadableLevel = (0,_loaders_VolumeLoaderUtils__WEBPACK_IMPORTED_MODULE_8__.estimateLevelForAtlas)(dims.map(function (_ref) {
                  var shape = _ref.shape;
                  return [shape[2], shape[3], shape[4]];
                }));
                noReload = currentScale <= Math.max(loadableLevel, minLevel);
              }
            case 9:
              // if newly required data is not currently contained in this volume...
              if (!noReload) {
                // ...clone `loadSpecRequired` into `loadSpec` and load
                this.setUnloaded();
                this.loadSpec = _objectSpread(_objectSpread({}, this.loadSpecRequired), {}, {
                  subregion: this.loadSpecRequired.subregion.clone(),
                  // preserve multiscale option from original `LoadSpec`, if any
                  multiscaleLevel: this.loadSpec.multiscaleLevel
                });
                (_this$loader2 = this.loader) === null || _this$loader2 === void 0 ? void 0 : _this$loader2.loadVolumeData(this, undefined, onChannelLoaded);
              }
            case 10:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function updateRequiredData(_x, _x2) {
        return _updateRequiredData.apply(this, arguments);
      }
      return updateRequiredData;
    }() // we calculate the physical size of the volume (voxels*pixel_size)
    // and then normalize to the max physical dimension
  }, {
    key: "setVoxelSize",
    value: function setVoxelSize(size) {
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
      this.tickMarkPhysicalLength = Math.pow(10, Math.floor(Math.log10(this.physicalScale / 2)));
    }
  }, {
    key: "setUnitSymbol",
    value: function setUnitSymbol(symbol) {
      this.physicalUnitSymbol = symbol;
    }

    /** Computes the center of the volume subset */
  }, {
    key: "getContentCenter",
    value: function getContentCenter() {
      // center point: (normRegionSize / 2 + normRegionOffset - 0.5) * normPhysicalSize;
      return this.normRegionSize.clone().divideScalar(2).add(this.normRegionOffset).subScalar(0.5).multiply(this.normPhysicalSize);
    }
  }, {
    key: "cleanup",
    value: function cleanup() {
      // no op
    }
  }, {
    key: "getChannel",
    value: function getChannel(channelIndex) {
      return this.channels[channelIndex];
    }
  }, {
    key: "onChannelLoaded",
    value: function onChannelLoaded(batch) {
      var _this2 = this;
      // check to see if all channels are now loaded, and fire an event(?)
      if (this.channels.every(function (element) {
        return element.loaded;
      })) {
        this.loaded = true;
      }
      batch.forEach(function (channelIndex) {
        var _this2$channelLoadCal;
        return (_this2$channelLoadCal = _this2.channelLoadCallback) === null || _this2$channelLoadCal === void 0 ? void 0 : _this2$channelLoadCal.call(_this2, _this2, channelIndex);
      });
      this.volumeDataObservers.forEach(function (observer) {
        return observer.onVolumeData(_this2, batch);
      });
    }

    /**
     * Assign volume data via a 2d array containing the z slices as tiles across it.  Assumes that the incoming data is consistent with the image's pre-existing imageInfo tile metadata.
     * @param {number} channelIndex
     * @param {Uint8Array} atlasdata
     * @param {number} atlaswidth
     * @param {number} atlasheight
     */
  }, {
    key: "setChannelDataFromAtlas",
    value: function setChannelDataFromAtlas(channelIndex, atlasdata, atlaswidth, atlasheight) {
      this.channels[channelIndex].setBits(atlasdata, atlaswidth, atlasheight);
      var _this$imageInfo$subre = this.imageInfo.subregionSize,
        x = _this$imageInfo$subre.x,
        y = _this$imageInfo$subre.y,
        z = _this$imageInfo$subre.z;
      this.channels[channelIndex].unpackVolumeFromAtlas(x, y, z);
      this.onChannelLoaded([channelIndex]);
    }

    // ASSUMES that this.channelData.options is already set and incoming data is consistent with it
    /**
     * Assign volume data as a 3d array ordered x,y,z. The xy size must be equal to tilewidth*tileheight from the imageInfo used to construct this Volume.  Assumes that the incoming data is consistent with the image's pre-existing imageInfo tile metadata.
     * @param {number} channelIndex
     * @param {Uint8Array} volumeData
     */
  }, {
    key: "setChannelDataFromVolume",
    value: function setChannelDataFromVolume(channelIndex, volumeData) {
      var _this$imageInfo2 = this.imageInfo,
        subregionSize = _this$imageInfo2.subregionSize,
        atlasTileDims = _this$imageInfo2.atlasTileDims;
      this.channels[channelIndex].setFromVolumeData(volumeData, subregionSize.x, subregionSize.y, subregionSize.z, atlasTileDims.x * subregionSize.x, atlasTileDims.y * subregionSize.y);
      this.onChannelLoaded([channelIndex]);
    }

    // TODO: decide if this should update imageInfo or not. For now, leave imageInfo alone as the "original" data
    /**
     * Add a new channel ready to receive data from one of the setChannelDataFrom* calls.
     * Name and color will be defaulted if not provided. For now, leave imageInfo alone as the "original" data
     * @param {string} name
     * @param {Array.<number>} color [r,g,b]
     */
  }, {
    key: "appendEmptyChannel",
    value: function appendEmptyChannel(name, color) {
      var idx = this.imageInfo.numChannels;
      var chname = name || "channel_" + idx;
      var chcolor = color || (0,_constants_colors__WEBPACK_IMPORTED_MODULE_6__.getColorByChannelIndex)(idx);
      this.numChannels += 1;
      this.channelNames.push(chname);
      this.channelColorsDefault.push(chcolor);
      this.channels.push(new _Channel__WEBPACK_IMPORTED_MODULE_5__["default"](chname));
      for (var i = 0; i < this.volumeDataObservers.length; ++i) {
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
  }, {
    key: "getIntensity",
    value: function getIntensity(c, x, y, z) {
      return this.channels[c].getIntensity(x, y, z);
    }

    /**
     * Get the 256-bin histogram for the given channel
     * @return {Histogram} the histogram
     * @param {number} c The channel index
     */
  }, {
    key: "getHistogram",
    value: function getHistogram(c) {
      return this.channels[c].getHistogram();
    }

    /**
     * Set the lut for the given channel
     * @param {number} c The channel index
     * @param {Array.<number>} lut The lut as a 256 element array
     */
  }, {
    key: "setLut",
    value: function setLut(c, lut) {
      this.channels[c].setLut(lut);
    }

    /**
     * Set the color palette for the given channel
     * @param {number} c The channel index
     * @param {Array.<number>} palette The colors as a 256 element array * RGBA
     */
  }, {
    key: "setColorPalette",
    value: function setColorPalette(c, palette) {
      this.channels[c].setColorPalette(palette);
    }

    /**
     * Set the color palette alpha multiplier for the given channel.
     * This will blend between the ordinary color lut and this colorPalette lut.
     * @param {number} c The channel index
     * @param {number} alpha The alpha value as a number from 0 to 1
     */
  }, {
    key: "setColorPaletteAlpha",
    value: function setColorPaletteAlpha(c, alpha) {
      this.channels[c].setColorPaletteAlpha(alpha);
    }

    /**
     * Return the intrinsic rotation associated with this volume (radians)
     * @return {Array.<number>} the xyz Euler angles (radians)
     */
  }, {
    key: "getRotation",
    value: function getRotation() {
      // default axis order is XYZ
      return this.imageInfo.transform.rotation.toArray();
    }

    /**
     * Return the intrinsic translation (pivot center delta) associated with this volume, in normalized volume units
     * @return {Array.<number>} the xyz translation in normalized volume units
     */
  }, {
    key: "getTranslation",
    value: function getTranslation() {
      return this.voxelsToWorldSpace(this.imageInfo.transform.translation.toArray());
    }

    /**
     * Return a translation in normalized volume units, given a translation in image voxels
     * @return {Array.<number>} the xyz translation in normalized volume units
     */
  }, {
    key: "voxelsToWorldSpace",
    value: function voxelsToWorldSpace(xyz) {
      // ASSUME: translation is in original image voxels.
      // account for pixel_size and normalized scaling in the threejs volume representation we're using
      var m = 1.0 / Math.max(this.physicalSize.x, Math.max(this.physicalSize.y, this.physicalSize.z));
      return new three__WEBPACK_IMPORTED_MODULE_9__.Vector3().fromArray(xyz).multiply(this.physicalPixelSize).multiplyScalar(m).toArray();
    }
  }, {
    key: "addVolumeDataObserver",
    value: function addVolumeDataObserver(o) {
      this.volumeDataObservers.push(o);
    }
  }, {
    key: "removeVolumeDataObserver",
    value: function removeVolumeDataObserver(o) {
      if (o) {
        var i = this.volumeDataObservers.indexOf(o);
        if (i !== -1) {
          this.volumeDataObservers.splice(i, 1);
        }
      }
    }
  }, {
    key: "removeAllVolumeDataObservers",
    value: function removeAllVolumeDataObservers() {
      this.volumeDataObservers = [];
    }
  }]);
  return Volume;
}();


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
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");



function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
/** Default: 250MB. Should be large enough to be useful but safe for most any computer that can run the app */
var CACHE_MAX_SIZE_DEFAULT = 250000000;
var VolumeCache = /*#__PURE__*/function () {
  // Ends of a linked list of entries, to track LRU and evict efficiently

  // TODO implement some way to manage used vs unused (prefetched) entries so
  // that prefetched entries which are never used don't get highest priority!

  function VolumeCache() {
    var maxSize = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : CACHE_MAX_SIZE_DEFAULT;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__["default"])(this, VolumeCache);
    this.entries = new Map();
    this.maxSize = maxSize;
    this.currentSize = 0;
    this.first = null;
    this.last = null;
  }

  // Hide these behind getters so they're definitely never set from the outside
  /** The size of all data arrays currently stored in this cache, in bytes. */
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__["default"])(VolumeCache, [{
    key: "size",
    get: function get() {
      return this.currentSize;
    }

    /** The number of entries currently stored in this cache. */
  }, {
    key: "numberOfEntries",
    get: function get() {
      return this.entries.size;
    }

    /**
     * Removes an entry from a store but NOT the LRU list.
     * Only call from a method with the word "evict" in it!
     */
  }, {
    key: "removeEntryFromStore",
    value: function removeEntryFromStore(entry) {
      this.entries["delete"](entry.key);
      this.currentSize -= entry.data.byteLength;
    }

    /**
     * Removes an entry from the LRU list but NOT its store.
     * Entry must be replaced in list or removed from store, or it will never be evicted!
     */
  }, {
    key: "removeEntryFromList",
    value: function removeEntryFromList(entry) {
      var prev = entry.prev,
        next = entry.next;
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
  }, {
    key: "addEntryAsFirst",
    value: function addEntryAsFirst(entry) {
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
  }, {
    key: "moveEntryToFirst",
    value: function moveEntryToFirst(entry) {
      if (entry === this.first) return;
      this.removeEntryFromList(entry);
      this.addEntryAsFirst(entry);
    }

    /** Evicts the least recently used entry from the cache. */
  }, {
    key: "evictLast",
    value: function evictLast() {
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
  }, {
    key: "evict",
    value: function evict(entry) {
      this.removeEntryFromStore(entry);
      this.removeEntryFromList(entry);
    }

    /**
     * Adds a new entry to the cache.
     * @returns {boolean} a boolean indicating whether the insertion succeeded.
     */
  }, {
    key: "insert",
    value: function insert(key, data) {
      if (data.byteLength > this.maxSize) {
        console.error("VolumeCache: attempt to insert a single entry larger than the cache");
        return false;
      }

      // Check if entry is already in cache
      // This will move the entry to the front of the LRU list, if present
      var getResult = this.getEntry(key);
      if (getResult !== undefined) {
        getResult.data = data;
        return true;
      }

      // Add new entry to cache
      var newEntry = {
        data: data,
        prev: null,
        next: null,
        key: key
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
  }, {
    key: "getEntry",
    value: function getEntry(key) {
      var result = this.entries.get(key);
      if (result) {
        this.moveEntryToFirst(result);
      }
      return result;
    }

    /** Attempts to get a single entry from the cache. */
  }, {
    key: "get",
    value: function get(key) {
      var _this$getEntry;
      return (_this$getEntry = this.getEntry(key)) === null || _this$getEntry === void 0 ? void 0 : _this$getEntry.data;
    }

    /** Clears all cache entries whose keys begin with the specified prefix. */
  }, {
    key: "clearWithPrefix",
    value: function clearWithPrefix(prefix) {
      var _iterator = _createForOfIteratorHelper(this.entries.entries()),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _step$value = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_step.value, 2),
            key = _step$value[0],
            entry = _step$value[1];
          if (key.startsWith(prefix)) {
            this.evict(entry);
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }

    /** Clears all data from the cache. */
  }, {
    key: "clear",
    value: function clear() {
      while (this.last) {
        this.evictLast();
      }
    }
  }]);
  return VolumeCache;
}();


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
var defaultColors = [[255, 0, 255], [255, 255, 255], [0, 255, 255]];
// 0 <= (h, s, v) <= 1
// returns 0 <= (r, g, b) <= 255 rounded to nearest integer
// you can also pass in just one arg as an object of {h, s, v} props.
function HSVtoRGB(h, s, v) {
  var r, g, b;
  var hh = 0;
  if (arguments.length === 1) {
    var hsv = h;
    s = hsv.s, v = hsv.v, hh = hsv.h;
  } else {
    hh = h;
  }
  var i = Math.floor(hh * 6);
  var f = hh * 6 - i;
  var p = v * (1 - s);
  var q = v * (1 - f * s);
  var t = v * (1 - (1 - f) * s);
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
var myrand = LCG(123);

// if index exceeds defaultColors start choosing random ones
// returns [r,g,b] 0-255 range
var getColorByChannelIndex = function getColorByChannelIndex(index) {
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
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var _Volume__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../Volume */ "./src/Volume.ts");
/* harmony import */ var _VolumeLoaderUtils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./VolumeLoaderUtils */ "./src/loaders/VolumeLoaderUtils.ts");




function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3__["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }




var LoadSpec = /*#__PURE__*/(0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(function LoadSpec() {
  (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__["default"])(this, LoadSpec);
  (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3__["default"])(this, "time", 0);
  /** Subregion of volume to load. If not specified, the entire volume is loaded. Specify as floats between 0-1. */
  (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3__["default"])(this, "subregion", new three__WEBPACK_IMPORTED_MODULE_7__.Box3(new three__WEBPACK_IMPORTED_MODULE_7__.Vector3(0, 0, 0), new three__WEBPACK_IMPORTED_MODULE_7__.Vector3(1, 1, 1)));
});
function loadSpecToString(spec) {
  var _spec$subregion = spec.subregion,
    min = _spec$subregion.min,
    max = _spec$subregion.max;
  return "".concat(spec.multiscaleLevel, ":").concat(spec.time, ":x(").concat(min.x, ",").concat(max.x, "):y(").concat(min.y, ",").concat(max.y, "):z(").concat(min.z, ",").concat(max.z, ")");
}
var VolumeDims = /*#__PURE__*/(0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(function VolumeDims() {
  (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__["default"])(this, VolumeDims);
  // shape: [t, c, z, y, x]
  (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3__["default"])(this, "shape", [0, 0, 0, 0, 0]);
  // spacing: [t, c, z, y, x]; generally expect 1 for non-spatial dimensions
  (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3__["default"])(this, "spacing", [1, 1, 1, 1, 1]);
  (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3__["default"])(this, "spaceUnit", "μm");
  (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3__["default"])(this, "timeUnit", "s");
  // TODO make this an enum?
  (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3__["default"])(this, "dataType", "uint8");
});

/**
 * @callback PerChannelCallback
 * @param {string} imageurl
 * @param {Volume} volume
 * @param {number} channelindex
 */

/**
 * Loads volume data from a source specified by a `LoadSpec`.
 *
 * Loaders may keep state for reuse between volume creation and volume loading, and should be kept alive until volume
 * loading is complete. (See `createVolume`)
 */

/** Abstract class which allows loaders to accept and return types that are easier to transfer to/from a worker. */
var ThreadableVolumeLoader = /*#__PURE__*/function () {
  function ThreadableVolumeLoader() {
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__["default"])(this, ThreadableVolumeLoader);
  }
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(ThreadableVolumeLoader, [{
    key: "createVolume",
    value: function () {
      var _createVolume = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4___default().mark(function _callee(loadSpec, onChannelLoaded) {
        var _yield$this$createIma, imageInfo, adjustedLoadSpec, vol;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4___default().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return this.createImageInfo(loadSpec);
            case 2:
              _yield$this$createIma = _context.sent;
              imageInfo = _yield$this$createIma.imageInfo;
              adjustedLoadSpec = _yield$this$createIma.loadSpec;
              vol = new _Volume__WEBPACK_IMPORTED_MODULE_5__["default"](imageInfo, adjustedLoadSpec, this);
              vol.channelLoadCallback = onChannelLoaded;
              vol.imageMetadata = (0,_VolumeLoaderUtils__WEBPACK_IMPORTED_MODULE_6__.buildDefaultMetadata)(imageInfo);
              return _context.abrupt("return", vol);
            case 9:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function createVolume(_x, _x2) {
        return _createVolume.apply(this, arguments);
      }
      return createVolume;
    }()
  }, {
    key: "loadVolumeData",
    value: function () {
      var _loadVolumeData = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4___default().mark(function _callee2(volume, loadSpecOverride, onChannelLoaded) {
        var onChannelData, spec, _yield$this$loadRawCh, imageInfo, loadSpec;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4___default().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              onChannelData = function onChannelData(channelIndex, data, atlasDims) {
                if (atlasDims) {
                  volume.setChannelDataFromAtlas(channelIndex, data, atlasDims[0], atlasDims[1]);
                } else {
                  volume.setChannelDataFromVolume(channelIndex, data);
                }
                onChannelLoaded === null || onChannelLoaded === void 0 ? void 0 : onChannelLoaded(volume, channelIndex);
              };
              spec = _objectSpread(_objectSpread({}, loadSpecOverride), volume.loadSpec);
              _context2.next = 4;
              return this.loadRawChannelData(volume.imageInfo, spec, onChannelData);
            case 4:
              _yield$this$loadRawCh = _context2.sent;
              imageInfo = _yield$this$loadRawCh.imageInfo;
              loadSpec = _yield$this$loadRawCh.loadSpec;
              if (imageInfo) {
                volume.imageInfo = imageInfo;
                volume.updateDimensions();
              }
              volume.loadSpec = _objectSpread(_objectSpread({}, loadSpec), spec);
            case 9:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function loadVolumeData(_x3, _x4, _x5) {
        return _loadVolumeData.apply(this, arguments);
      }
      return loadVolumeData;
    }()
  }]);
  return ThreadableVolumeLoader;
}();

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
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var _IVolumeLoader__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./IVolumeLoader */ "./src/loaders/IVolumeLoader.ts");







function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6__["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6__["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0,_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_5__["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }



/* eslint-disable @typescript-eslint/naming-convention */

/* eslint-enable @typescript-eslint/naming-convention */

var convertImageInfo = function convertImageInfo(json) {
  var _json$transform, _json$transform2;
  return {
    name: json.name,
    originalSize: new three__WEBPACK_IMPORTED_MODULE_9__.Vector3(json.width, json.height, json.tiles),
    atlasTileDims: new three__WEBPACK_IMPORTED_MODULE_9__.Vector2(json.cols, json.rows),
    volumeSize: new three__WEBPACK_IMPORTED_MODULE_9__.Vector3(json.tile_width, json.tile_height, json.tiles),
    subregionSize: new three__WEBPACK_IMPORTED_MODULE_9__.Vector3(json.tile_width, json.tile_height, json.tiles),
    subregionOffset: new three__WEBPACK_IMPORTED_MODULE_9__.Vector3(0, 0, 0),
    physicalPixelSize: new three__WEBPACK_IMPORTED_MODULE_9__.Vector3(json.pixel_size_x, json.pixel_size_y, json.pixel_size_z),
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
      translation: (_json$transform = json.transform) !== null && _json$transform !== void 0 && _json$transform.translation ? new three__WEBPACK_IMPORTED_MODULE_9__.Vector3().fromArray(json.transform.translation) : new three__WEBPACK_IMPORTED_MODULE_9__.Vector3(0, 0, 0),
      rotation: (_json$transform2 = json.transform) !== null && _json$transform2 !== void 0 && _json$transform2.rotation ? new three__WEBPACK_IMPORTED_MODULE_9__.Vector3().fromArray(json.transform.rotation) : new three__WEBPACK_IMPORTED_MODULE_9__.Vector3(0, 0, 0)
    },
    userData: json.userData
  };
};
var JsonImageInfoLoader = /*#__PURE__*/function (_ThreadableVolumeLoad) {
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__["default"])(JsonImageInfoLoader, _ThreadableVolumeLoad);
  var _super = _createSuper(JsonImageInfoLoader);
  function JsonImageInfoLoader(urls, cache) {
    var _this;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__["default"])(this, JsonImageInfoLoader);
    _this = _super.call(this);
    if (Array.isArray(urls)) {
      _this.urls = urls;
    } else {
      _this.urls = [urls];
    }
    _this.jsonInfo = new Array(_this.urls.length);
    _this.cache = cache;
    return _this;
  }
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__["default"])(JsonImageInfoLoader, [{
    key: "getJsonImageInfo",
    value: function () {
      var _getJsonImageInfo = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_7___default().mark(function _callee(time) {
        var cachedInfo, response, imageInfo;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_7___default().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              cachedInfo = this.jsonInfo[time];
              if (!cachedInfo) {
                _context.next = 3;
                break;
              }
              return _context.abrupt("return", cachedInfo);
            case 3:
              _context.next = 5;
              return fetch(this.urls[time]);
            case 5:
              response = _context.sent;
              _context.next = 8;
              return response.json();
            case 8:
              imageInfo = _context.sent;
              imageInfo.pixel_size_unit = imageInfo.pixel_size_unit || "μm";
              imageInfo.times = imageInfo.times || this.urls.length;
              this.jsonInfo[time] = imageInfo;
              return _context.abrupt("return", imageInfo);
            case 13:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function getJsonImageInfo(_x) {
        return _getJsonImageInfo.apply(this, arguments);
      }
      return getJsonImageInfo;
    }()
  }, {
    key: "loadDims",
    value: function () {
      var _loadDims = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_7___default().mark(function _callee2(loadSpec) {
        var jsonInfo, d;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_7___default().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return this.getJsonImageInfo(loadSpec.time);
            case 2:
              jsonInfo = _context2.sent;
              d = new _IVolumeLoader__WEBPACK_IMPORTED_MODULE_8__.VolumeDims();
              d.shape = [jsonInfo.times || 1, jsonInfo.channels, jsonInfo.tiles, jsonInfo.tile_height, jsonInfo.tile_width];
              d.spacing = [1, 1, jsonInfo.pixel_size_z, jsonInfo.pixel_size_y, jsonInfo.pixel_size_x];
              d.spaceUnit = jsonInfo.pixel_size_unit || "μm";
              d.dataType = "uint8";
              return _context2.abrupt("return", [d]);
            case 9:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function loadDims(_x2) {
        return _loadDims.apply(this, arguments);
      }
      return loadDims;
    }()
  }, {
    key: "createImageInfo",
    value: function () {
      var _createImageInfo = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_7___default().mark(function _callee3(loadSpec) {
        var jsonInfo;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_7___default().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return this.getJsonImageInfo(loadSpec.time);
            case 2:
              jsonInfo = _context3.sent;
              return _context3.abrupt("return", {
                imageInfo: convertImageInfo(jsonInfo),
                loadSpec: loadSpec
              });
            case 4:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this);
      }));
      function createImageInfo(_x3) {
        return _createImageInfo.apply(this, arguments);
      }
      return createImageInfo;
    }()
  }, {
    key: "loadRawChannelData",
    value: function () {
      var _loadRawChannelData = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_7___default().mark(function _callee4(imageInfo, loadSpec, onData) {
        var jsonInfo, images, requestedChannels, urlPrefix, w, h, wrappedOnData, adjustedLoadSpec;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_7___default().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return this.getJsonImageInfo(loadSpec.time);
            case 2:
              jsonInfo = _context4.sent;
              images = jsonInfo === null || jsonInfo === void 0 ? void 0 : jsonInfo.images;
              if (images) {
                _context4.next = 6;
                break;
              }
              return _context4.abrupt("return", {});
            case 6:
              requestedChannels = loadSpec.channels;
              if (requestedChannels) {
                // If only some channels are requested, load only images which contain at least one requested channel
                images = images.filter(function (_ref) {
                  var channels = _ref.channels;
                  return channels.some(function (ch) {
                    return ch in requestedChannels;
                  });
                });
              }

              // This regex removes everything after the last slash, so the url had better be simple.
              urlPrefix = this.urls[loadSpec.time].replace(/[^/]*$/, "");
              images = images.map(function (element) {
                return _objectSpread(_objectSpread({}, element), {}, {
                  name: urlPrefix + element.name
                });
              });
              w = imageInfo.atlasTileDims.x * imageInfo.volumeSize.x;
              h = imageInfo.atlasTileDims.y * imageInfo.volumeSize.y;
              wrappedOnData = function wrappedOnData(ch, data) {
                return onData(ch, data, [w, h]);
              };
              JsonImageInfoLoader.loadVolumeAtlasData(images, wrappedOnData, this.cache);
              adjustedLoadSpec = _objectSpread(_objectSpread({}, loadSpec), {}, {
                // `subregion` and `multiscaleLevel` are unused by this loader
                subregion: new three__WEBPACK_IMPORTED_MODULE_9__.Box3(new three__WEBPACK_IMPORTED_MODULE_9__.Vector3(0, 0, 0), new three__WEBPACK_IMPORTED_MODULE_9__.Vector3(1, 1, 1)),
                multiscaleLevel: 0,
                // include all channels in any loaded images
                channels: images.flatMap(function (_ref2) {
                  var channels = _ref2.channels;
                  return channels;
                })
              });
              return _context4.abrupt("return", {
                loadSpec: adjustedLoadSpec
              });
            case 16:
            case "end":
              return _context4.stop();
          }
        }, _callee4, this);
      }));
      function loadRawChannelData(_x4, _x5, _x6) {
        return _loadRawChannelData.apply(this, arguments);
      }
      return loadRawChannelData;
    }()
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
  }], [{
    key: "loadVolumeAtlasData",
    value: function loadVolumeAtlasData(imageArray, onData, cache) {
      imageArray.forEach( /*#__PURE__*/function () {
        var _ref3 = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_7___default().mark(function _callee5(image) {
          var cacheHit, j, chindex, cacheResult, response, blob, bitmap, canvas, ctx, iData, channelsBits, length, ch, _j, px, _ch, _chindex;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_7___default().wrap(function _callee5$(_context5) {
            while (1) switch (_context5.prev = _context5.next) {
              case 0:
                // Because the data is fetched such that one fetch returns a whole batch,
                // if any in batch is cached then they all should be. So if any in batch is NOT cached,
                // then we will have to do a batch request. This logic works both ways because it's all or nothing.
                cacheHit = true;
                j = 0;
              case 2:
                if (!(j < Math.min(image.channels.length, 4))) {
                  _context5.next = 14;
                  break;
                }
                chindex = image.channels[j];
                cacheResult = cache === null || cache === void 0 ? void 0 : cache.get("".concat(image.name, "/").concat(chindex));
                if (!cacheResult) {
                  _context5.next = 9;
                  break;
                }
                onData(chindex, new Uint8Array(cacheResult));
                _context5.next = 11;
                break;
              case 9:
                cacheHit = false;
                // we can stop checking because we know we are going to have to fetch the whole batch
                return _context5.abrupt("break", 14);
              case 11:
                ++j;
                _context5.next = 2;
                break;
              case 14:
                if (!cacheHit) {
                  _context5.next = 16;
                  break;
                }
                return _context5.abrupt("return");
              case 16:
                _context5.next = 18;
                return fetch(image.name, {
                  mode: "cors"
                });
              case 18:
                response = _context5.sent;
                _context5.next = 21;
                return response.blob();
              case 21:
                blob = _context5.sent;
                _context5.next = 24;
                return createImageBitmap(blob);
              case 24:
                bitmap = _context5.sent;
                canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
                ctx = canvas.getContext("2d");
                if (ctx) {
                  _context5.next = 30;
                  break;
                }
                console.log("Error creating canvas 2d context for " + image.name);
                return _context5.abrupt("return");
              case 30:
                ctx.globalCompositeOperation = "copy";
                ctx.globalAlpha = 1.0;
                ctx.drawImage(bitmap, 0, 0);
                iData = ctx.getImageData(0, 0, bitmap.width, bitmap.height);
                channelsBits = [];
                length = bitmap.width * bitmap.height; // allocate channels in batch
                for (ch = 0; ch < Math.min(image.channels.length, 4); ++ch) {
                  channelsBits.push(new Uint8Array(length));
                }

                // extract the data
                for (_j = 0; _j < Math.min(image.channels.length, 4); ++_j) {
                  for (px = 0; px < length; px++) {
                    channelsBits[_j][px] = iData.data[px * 4 + _j];
                  }
                }

                // done with `iData` and `canvas` now.

                for (_ch = 0; _ch < Math.min(image.channels.length, 4); ++_ch) {
                  _chindex = image.channels[_ch];
                  cache === null || cache === void 0 ? void 0 : cache.insert("".concat(image.name, "/").concat(_chindex), channelsBits[_ch]);
                  // NOTE: the atlas dimensions passed in here are currently unused by `JSONImageInfoLoader`
                  onData(_chindex, channelsBits[_ch], [bitmap.width, bitmap.height]);
                }
              case 39:
              case "end":
                return _context5.stop();
            }
          }, _callee5);
        }));
        return function (_x7) {
          return _ref3.apply(this, arguments);
        };
      }());
    }
  }]);
  return JsonImageInfoLoader;
}(_IVolumeLoader__WEBPACK_IMPORTED_MODULE_8__.ThreadableVolumeLoader);


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
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js");
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var _zarrita_core__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @zarrita/core */ "./node_modules/@zarrita/core/dist/src/hierarchy.js");
/* harmony import */ var _zarrita_core__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @zarrita/core */ "./node_modules/@zarrita/core/dist/src/open.js");
/* harmony import */ var _zarrita_indexing__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @zarrita/indexing */ "./node_modules/@zarrita/indexing/dist/src/util.js");
/* harmony import */ var _zarrita_indexing__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @zarrita/indexing */ "./node_modules/@zarrita/indexing/dist/src/ops.js");
/* harmony import */ var zarrita__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! zarrita */ "./node_modules/@zarrita/storage/dist/src/fetch.js");
/* harmony import */ var _utils_SubscribableRequestQueue__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../utils/SubscribableRequestQueue */ "./src/utils/SubscribableRequestQueue.ts");
/* harmony import */ var _IVolumeLoader__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./IVolumeLoader */ "./src/loaders/IVolumeLoader.ts");
/* harmony import */ var _VolumeLoaderUtils__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./VolumeLoaderUtils */ "./src/loaders/VolumeLoaderUtils.ts");
/* harmony import */ var _zarr_utils_ChunkPrefetchIterator__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./zarr_utils/ChunkPrefetchIterator */ "./src/loaders/zarr_utils/ChunkPrefetchIterator.ts");
/* harmony import */ var _zarr_utils_WrappedStore__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./zarr_utils/WrappedStore */ "./src/loaders/zarr_utils/WrappedStore.ts");








function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1__["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6__["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6__["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0,_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_5__["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }



// Importing `FetchStore` from its home subpackage (@zarrita/storage) causes errors.
// Getting it from the top-level package means we don't get its type. This is also a bug, but it's more acceptable.






var CHUNK_REQUEST_CANCEL_REASON = "chunk request cancelled";

/** Turns `axisTCZYX` into the number of dimensions in the array */
var getDimensionCount = function getDimensionCount(_ref) {
  var _ref2 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_7__["default"])(_ref, 3),
    t = _ref2[0],
    c = _ref2[1],
    z = _ref2[2];
  return 2 + Number(t > -1) + Number(c > -1) + Number(z > -1);
};
function remapAxesToTCZYX(axes) {
  var axisTCZYX = [-1, -1, -1, -1, -1];
  var axisNames = ["t", "c", "z", "y", "x"];
  axes.forEach(function (axis, idx) {
    var axisIdx = axisNames.indexOf(axis.name);
    if (axisIdx > -1) {
      axisTCZYX[axisIdx] = idx;
    } else {
      console.error("ERROR: UNRECOGNIZED AXIS in zarr: " + axis.name);
    }
  });

  // it is possible that Z might not exist but we require X and Y at least.
  if (axisTCZYX[3] === -1 || axisTCZYX[4] === -1) {
    console.error("ERROR: zarr loader expects a y and an x axis.");
  }
  return axisTCZYX;
}

/**
 * Picks the best scale level to load based on scale level dimensions, a max atlas size, and a `LoadSpec`.
 * This works like `estimateLevelForAtlas` but factors in `LoadSpec`'s `subregion` property (shrinks the size of the
 * data, maybe enough to allow loading a higher level) and its `multiscaleLevel` property (sets a max scale level).
 */
function pickLevelToLoad(loadSpec, spatialDimsZYX) {
  var _loadSpec$multiscaleL;
  var size = loadSpec.subregion.getSize(new three__WEBPACK_IMPORTED_MODULE_14__.Vector3());
  var dims = spatialDimsZYX.map(function (_ref3) {
    var _ref4 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_7__["default"])(_ref3, 3),
      z = _ref4[0],
      y = _ref4[1],
      x = _ref4[2];
    return [Math.max(z * size.z, 1), Math.max(y * size.y, 1), Math.max(x * size.x, 1)];
  });
  var optimalLevel = (0,_VolumeLoaderUtils__WEBPACK_IMPORTED_MODULE_11__.estimateLevelForAtlas)(dims);
  return Math.max(optimalLevel, (_loadSpec$multiscaleL = loadSpec.multiscaleLevel) !== null && _loadSpec$multiscaleL !== void 0 ? _loadSpec$multiscaleL : 0);
}
function convertChannel(channelData) {
  if (channelData instanceof Uint8Array) {
    return channelData;
  }
  var u8 = new Uint8Array(channelData.length);

  // get min and max
  var min = channelData[0];
  var max = channelData[0];
  for (var i = 0; i < channelData.length; i++) {
    var val = channelData[i];
    if (val < min) {
      min = val;
    }
    if (val > max) {
      max = val;
    }
  }

  // normalize and convert to u8
  var range = max - min;
  for (var _i = 0; _i < channelData.length; _i++) {
    u8[_i] = (channelData[_i] - min) / range * 255;
  }
  return u8;
}
var DEFAULT_FETCH_OPTIONS = {
  maxPrefetchDistance: [5, 5, 5, 5],
  maxPrefetchChunks: 30
};
var OMEZarrLoader = /*#__PURE__*/function (_ThreadableVolumeLoad) {
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__["default"])(OMEZarrLoader, _ThreadableVolumeLoad);
  var _super = _createSuper(OMEZarrLoader);
  /** The ID of the subscriber responsible for "actual loads" (non-prefetch requests) */

  /** The ID of the subscriber responsible for prefetches, so that requests can be cancelled and reissued */

  // TODO: this property should definitely be owned by `Volume` if this loader is ever used by multiple volumes.
  //   This may cause errors or incorrect results otherwise!

  function OMEZarrLoader(store, scaleLevels, multiscaleMetadata, omeroMetadata, axesTCZYX, requestQueue) {
    var _this;
    var fetchOptions = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : DEFAULT_FETCH_OPTIONS;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__["default"])(this, OMEZarrLoader);
    _this = _super.call(this);
    _this.store = store;
    _this.scaleLevels = scaleLevels;
    _this.multiscaleMetadata = multiscaleMetadata;
    _this.omeroMetadata = omeroMetadata;
    _this.axesTCZYX = axesTCZYX;
    _this.requestQueue = requestQueue;
    _this.fetchOptions = fetchOptions;
    return _this;
  }
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__["default"])(OMEZarrLoader, [{
    key: "getUnitSymbols",
    value: function getUnitSymbols() {
      // Assume all spatial axes have the same units - we have no means of storing per-axis unit symbols
      var xi = this.axesTCZYX[4];
      var spaceUnitName = this.multiscaleMetadata.axes[xi].unit;
      var spaceUnitSymbol = (0,_VolumeLoaderUtils__WEBPACK_IMPORTED_MODULE_11__.unitNameToSymbol)(spaceUnitName) || spaceUnitName || "";
      var ti = this.axesTCZYX[0];
      var timeUnitName = ti > -1 ? this.multiscaleMetadata.axes[ti].unit : undefined;
      var timeUnitSymbol = (0,_VolumeLoaderUtils__WEBPACK_IMPORTED_MODULE_11__.unitNameToSymbol)(timeUnitName) || timeUnitName || "";
      return [spaceUnitSymbol, timeUnitSymbol];
    }
  }, {
    key: "getScale",
    value: function getScale() {
      var _meta$datasets$level$;
      var level = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var meta = this.multiscaleMetadata;
      var transforms = (_meta$datasets$level$ = meta.datasets[level].coordinateTransformations) !== null && _meta$datasets$level$ !== void 0 ? _meta$datasets$level$ : meta.coordinateTransformations;
      if (transforms === undefined) {
        console.error("ERROR: no coordinate transformations for scale level");
        return [1, 1, 1, 1, 1];
      }

      // this assumes we'll never encounter the "path" variant
      var isScaleTransform = function isScaleTransform(t) {
        return t.type === "scale";
      };

      // there can be any number of coordinateTransformations
      // but there must be only one of type "scale".
      var scaleTransform = transforms.find(isScaleTransform);
      if (!scaleTransform) {
        console.error("ERROR: no coordinate transformation of type \"scale\" for scale level");
        return [1, 1, 1, 1, 1];
      }
      var scale = scaleTransform.scale.slice();
      while (scale.length < 5) {
        scale.unshift(1);
      }
      return scale;
    }
  }, {
    key: "getLevelShapesZYX",
    value: function getLevelShapesZYX() {
      var _this$axesTCZYX$slice = this.axesTCZYX.slice(-3),
        _this$axesTCZYX$slice2 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_7__["default"])(_this$axesTCZYX$slice, 3),
        z = _this$axesTCZYX$slice2[0],
        y = _this$axesTCZYX$slice2[1],
        x = _this$axesTCZYX$slice2[2];
      return this.scaleLevels.map(function (_ref5) {
        var shape = _ref5.shape;
        return [z === -1 ? 1 : shape[z], shape[y], shape[x]];
      });
    }

    /** Reorder an array of values [T, C, Z, Y, X] to the actual order of those dimensions in the zarr */
  }, {
    key: "orderByDimension",
    value: function orderByDimension(valsTCZYX) {
      var specLen = getDimensionCount(this.axesTCZYX);
      var result = Array(specLen);
      this.axesTCZYX.forEach(function (val, idx) {
        if (val > -1) {
          if (val > specLen) {
            throw new Error("Unexpected axis index");
          }
          result[val] = valsTCZYX[idx];
        }
      });
      return result;
    }

    /** Reorder an array of values in this zarr's dimension order to [T, C, Z, Y, X] */
  }, {
    key: "orderByTCZYX",
    value: function orderByTCZYX(valsDimension, defaultValue) {
      var result = [defaultValue, defaultValue, defaultValue, defaultValue, defaultValue];
      this.axesTCZYX.forEach(function (val, idx) {
        if (val > -1) {
          if (val > valsDimension.length) {
            throw new Error("Unexpected axis index");
          }
          result[idx] = valsDimension[val];
        }
      });
      return result;
    }
  }, {
    key: "loadDims",
    value: function loadDims(loadSpec) {
      var _this$maxExtent,
        _this2 = this;
      var _this$getUnitSymbols = this.getUnitSymbols(),
        _this$getUnitSymbols2 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_7__["default"])(_this$getUnitSymbols, 2),
        spaceUnit = _this$getUnitSymbols2[0],
        timeUnit = _this$getUnitSymbols2[1];
      // Compute subregion size so we can factor that in
      var maxExtent = (_this$maxExtent = this.maxExtent) !== null && _this$maxExtent !== void 0 ? _this$maxExtent : new three__WEBPACK_IMPORTED_MODULE_14__.Box3(new three__WEBPACK_IMPORTED_MODULE_14__.Vector3(0, 0, 0), new three__WEBPACK_IMPORTED_MODULE_14__.Vector3(1, 1, 1));
      var subregion = (0,_VolumeLoaderUtils__WEBPACK_IMPORTED_MODULE_11__.composeSubregion)(loadSpec.subregion, maxExtent);
      var regionSize = subregion.getSize(new three__WEBPACK_IMPORTED_MODULE_14__.Vector3());
      var regionArr = [1, 1, regionSize.z, regionSize.y, regionSize.x];
      var result = this.scaleLevels.map(function (level, i) {
        var scale = _this2.getScale(i);
        var dims = new _IVolumeLoader__WEBPACK_IMPORTED_MODULE_10__.VolumeDims();
        dims.spaceUnit = spaceUnit;
        dims.timeUnit = timeUnit;
        dims.shape = _this2.orderByTCZYX(level.shape, 1).map(function (val, idx) {
          return Math.ceil(val * regionArr[idx]);
        });
        dims.spacing = _this2.orderByTCZYX(scale, 1);
        return dims;
      });
      return Promise.resolve(result);
    }
  }, {
    key: "createImageInfo",
    value: function createImageInfo(loadSpec) {
      var _this$axesTCZYX = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_7__["default"])(this.axesTCZYX, 5),
        t = _this$axesTCZYX[0],
        c = _this$axesTCZYX[1],
        z = _this$axesTCZYX[2],
        y = _this$axesTCZYX[3],
        x = _this$axesTCZYX[4];
      var hasT = t > -1;
      var hasC = c > -1;
      var hasZ = z > -1;
      var shape0 = this.scaleLevels[0].shape;
      var levelToLoad = pickLevelToLoad(loadSpec, this.getLevelShapesZYX());
      var shapeLv = this.scaleLevels[levelToLoad].shape;
      var _this$getUnitSymbols3 = this.getUnitSymbols(),
        _this$getUnitSymbols4 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_7__["default"])(_this$getUnitSymbols3, 2),
        spatialUnit = _this$getUnitSymbols4[0],
        timeUnit = _this$getUnitSymbols4[1];
      var numChannels = hasC ? shapeLv[c] : 1;
      var times = hasT ? shapeLv[t] : 1;
      if (!this.maxExtent) {
        this.maxExtent = loadSpec.subregion.clone();
      }
      var pxDims0 = (0,_VolumeLoaderUtils__WEBPACK_IMPORTED_MODULE_11__.convertSubregionToPixels)(loadSpec.subregion, new three__WEBPACK_IMPORTED_MODULE_14__.Vector3(shape0[x], shape0[y], hasZ ? shape0[z] : 1));
      var pxSize0 = pxDims0.getSize(new three__WEBPACK_IMPORTED_MODULE_14__.Vector3());
      var pxDimsLv = (0,_VolumeLoaderUtils__WEBPACK_IMPORTED_MODULE_11__.convertSubregionToPixels)(loadSpec.subregion, new three__WEBPACK_IMPORTED_MODULE_14__.Vector3(shapeLv[x], shapeLv[y], hasZ ? shapeLv[z] : 1));
      var pxSizeLv = pxDimsLv.getSize(new three__WEBPACK_IMPORTED_MODULE_14__.Vector3());
      var atlasTileDims = (0,_VolumeLoaderUtils__WEBPACK_IMPORTED_MODULE_11__.computePackedAtlasDims)(pxSizeLv.z, pxSizeLv.x, pxSizeLv.y);
      var channelNames = this.omeroMetadata.channels.map(function (ch) {
        return ch.label;
      });
      var scale5d = this.getScale();
      var timeScale = hasT ? scale5d[t] : 1;
      var imgdata = {
        name: this.omeroMetadata.name,
        originalSize: pxSize0,
        atlasTileDims: atlasTileDims,
        volumeSize: pxSizeLv,
        subregionSize: pxSizeLv.clone(),
        subregionOffset: new three__WEBPACK_IMPORTED_MODULE_14__.Vector3(0, 0, 0),
        physicalPixelSize: new three__WEBPACK_IMPORTED_MODULE_14__.Vector3(scale5d[x], scale5d[y], hasZ ? scale5d[z] : Math.min(scale5d[x], scale5d[y])),
        spatialUnit: spatialUnit,
        numChannels: numChannels,
        channelNames: channelNames,
        times: times,
        timeScale: timeScale,
        timeUnit: timeUnit,
        numMultiscaleLevels: this.scaleLevels.length,
        multiscaleLevel: levelToLoad,
        transform: {
          translation: new three__WEBPACK_IMPORTED_MODULE_14__.Vector3(0, 0, 0),
          rotation: new three__WEBPACK_IMPORTED_MODULE_14__.Vector3(0, 0, 0)
        }
      };

      // The `LoadSpec` passed in at this stage should represent the subset which this loader loads, not that
      // which the volume contains. The volume contains the full extent of the subset recognized by this loader.
      var fullExtentLoadSpec = _objectSpread(_objectSpread({}, loadSpec), {}, {
        subregion: new three__WEBPACK_IMPORTED_MODULE_14__.Box3(new three__WEBPACK_IMPORTED_MODULE_14__.Vector3(0, 0, 0), new three__WEBPACK_IMPORTED_MODULE_14__.Vector3(1, 1, 1))
      });
      return Promise.resolve({
        imageInfo: imgdata,
        loadSpec: fullExtentLoadSpec
      });
    }
  }, {
    key: "prefetchChunk",
    value: function () {
      var _prefetchChunk = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_8___default().mark(function _callee(basePath, coords, subscriber) {
        var separator, key;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_8___default().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              separator = basePath.endsWith("/") ? "" : "/";
              key = basePath + separator + this.orderByDimension(coords).join("/");
              _context.prev = 2;
              _context.next = 5;
              return this.store.get(key, {
                subscriber: subscriber,
                isPrefetch: true
              });
            case 5:
              _context.next = 11;
              break;
            case 7:
              _context.prev = 7;
              _context.t0 = _context["catch"](2);
              if (!(_context.t0 !== CHUNK_REQUEST_CANCEL_REASON)) {
                _context.next = 11;
                break;
              }
              throw _context.t0;
            case 11:
            case "end":
              return _context.stop();
          }
        }, _callee, this, [[2, 7]]);
      }));
      function prefetchChunk(_x, _x2, _x3) {
        return _prefetchChunk.apply(this, arguments);
      }
      return prefetchChunk;
    }() /** Reads a list of chunk keys requested by a `loadVolumeData` call and sets up appropriate prefetch requests. */
  }, {
    key: "beginPrefetch",
    value: function beginPrefetch(keys, scaleLevel) {
      var _this3 = this;
      var numDims = getDimensionCount(this.axesTCZYX);

      // Convert keys to arrays of coords
      var chunkCoords = keys.map(function (key) {
        var coordsInDimensionOrder = key.trim().split("/").slice(-numDims).filter(function (s) {
          return s !== "";
        }).map(function (s) {
          return parseInt(s, 10);
        });
        return _this3.orderByTCZYX(coordsInDimensionOrder, 0);
      });

      // Get number of chunks per dimension in `scaleLevel`
      var chunkDimsUnordered = scaleLevel.shape.map(function (dim, idx) {
        return Math.ceil(dim / scaleLevel.chunks[idx]);
      });
      var chunkDims = this.orderByTCZYX(chunkDimsUnordered, 1);
      var subscriber = this.requestQueue.addSubscriber();
      // `ChunkPrefetchIterator` yields chunk coordinates in order of roughly how likely they are to be loaded next
      var chunkDimsTZYX = [chunkDims[0], chunkDims[2], chunkDims[3], chunkDims[4]];
      var prefetchIterator = new _zarr_utils_ChunkPrefetchIterator__WEBPACK_IMPORTED_MODULE_12__["default"](chunkCoords, this.fetchOptions.maxPrefetchDistance, chunkDimsTZYX);
      var prefetchCount = 0;
      var _iterator = _createForOfIteratorHelper(prefetchIterator),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var chunk = _step.value;
          if (prefetchCount >= this.fetchOptions.maxPrefetchChunks) {
            break;
          }
          this.prefetchChunk(scaleLevel.path, chunk, subscriber);
          prefetchCount++;
        }

        // Clear out old prefetch requests (requests which also cover this new prefetch will be preserved)
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      if (this.prefetchSubscriber !== undefined) {
        this.requestQueue.removeSubscriber(this.prefetchSubscriber, CHUNK_REQUEST_CANCEL_REASON);
      }
      this.prefetchSubscriber = subscriber;
    }
  }, {
    key: "loadRawChannelData",
    value: function loadRawChannelData(imageInfo, loadSpec, onData) {
      var _this$maxExtent2,
        _loadSpec$channels,
        _this4 = this;
      var maxExtent = (_this$maxExtent2 = this.maxExtent) !== null && _this$maxExtent2 !== void 0 ? _this$maxExtent2 : new three__WEBPACK_IMPORTED_MODULE_14__.Box3(new three__WEBPACK_IMPORTED_MODULE_14__.Vector3(0, 0, 0), new three__WEBPACK_IMPORTED_MODULE_14__.Vector3(1, 1, 1));
      var _this$axesTCZYX$slice3 = this.axesTCZYX.slice(2),
        _this$axesTCZYX$slice4 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_7__["default"])(_this$axesTCZYX$slice3, 3),
        z = _this$axesTCZYX$slice4[0],
        y = _this$axesTCZYX$slice4[1],
        x = _this$axesTCZYX$slice4[2];
      var subregion = (0,_VolumeLoaderUtils__WEBPACK_IMPORTED_MODULE_11__.composeSubregion)(loadSpec.subregion, maxExtent);
      var levelIdx = pickLevelToLoad(_objectSpread(_objectSpread({}, loadSpec), {}, {
        subregion: subregion
      }), this.getLevelShapesZYX());
      var level = this.scaleLevels[levelIdx];
      var levelShape = level.shape;
      var regionPx = (0,_VolumeLoaderUtils__WEBPACK_IMPORTED_MODULE_11__.convertSubregionToPixels)(subregion, new three__WEBPACK_IMPORTED_MODULE_14__.Vector3(levelShape[x], levelShape[y], z === -1 ? 1 : levelShape[z]));
      // Update volume `imageInfo` to reflect potentially new dimensions
      var regionSizePx = regionPx.getSize(new three__WEBPACK_IMPORTED_MODULE_14__.Vector3());
      var atlasTileDims = (0,_VolumeLoaderUtils__WEBPACK_IMPORTED_MODULE_11__.computePackedAtlasDims)(regionSizePx.z, regionSizePx.x, regionSizePx.y);
      var volExtentPx = (0,_VolumeLoaderUtils__WEBPACK_IMPORTED_MODULE_11__.convertSubregionToPixels)(maxExtent, new three__WEBPACK_IMPORTED_MODULE_14__.Vector3(levelShape[x], levelShape[y], z === -1 ? 1 : levelShape[z]));
      var volSizePx = volExtentPx.getSize(new three__WEBPACK_IMPORTED_MODULE_14__.Vector3());
      var updatedImageInfo = _objectSpread(_objectSpread({}, imageInfo), {}, {
        atlasTileDims: atlasTileDims,
        volumeSize: volSizePx,
        subregionSize: regionSizePx,
        subregionOffset: regionPx.min,
        multiscaleLevel: levelIdx
      });
      var numChannels = updatedImageInfo.numChannels;
      var channelIndexes = (_loadSpec$channels = loadSpec.channels) !== null && _loadSpec$channels !== void 0 ? _loadSpec$channels : Array.from({
        length: numChannels
      }, function (_, i) {
        return i;
      });
      var subscriber = this.requestQueue.addSubscriber();

      // Prefetch housekeeping: we want to save keys involved in this load to prefetch later
      var keys = [];
      var reportKey = function reportKey(key, sub) {
        if (sub === subscriber) {
          keys.push(key);
        }
      };
      var channelPromises = channelIndexes.map( /*#__PURE__*/function () {
        var _ref6 = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_8___default().mark(function _callee2(ch) {
          var min, max, unorderedSpec, sliceSpec, result, u8;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_8___default().wrap(function _callee2$(_context2) {
            while (1) switch (_context2.prev = _context2.next) {
              case 0:
                // Build slice spec
                min = regionPx.min, max = regionPx.max;
                unorderedSpec = [loadSpec.time, ch, (0,_zarrita_indexing__WEBPACK_IMPORTED_MODULE_15__.slice)(min.z, max.z), (0,_zarrita_indexing__WEBPACK_IMPORTED_MODULE_15__.slice)(min.y, max.y), (0,_zarrita_indexing__WEBPACK_IMPORTED_MODULE_15__.slice)(min.x, max.x)];
                sliceSpec = _this4.orderByDimension(unorderedSpec);
                _context2.prev = 3;
                _context2.next = 6;
                return (0,_zarrita_indexing__WEBPACK_IMPORTED_MODULE_16__.get)(level, sliceSpec, {
                  opts: {
                    subscriber: subscriber,
                    reportKey: reportKey
                  }
                });
              case 6:
                result = _context2.sent;
                u8 = convertChannel(result.data);
                onData(ch, u8);
                _context2.next = 16;
                break;
              case 11:
                _context2.prev = 11;
                _context2.t0 = _context2["catch"](3);
                if (!(_context2.t0 !== CHUNK_REQUEST_CANCEL_REASON)) {
                  _context2.next = 16;
                  break;
                }
                console.log(_context2.t0);
                throw _context2.t0;
              case 16:
              case "end":
                return _context2.stop();
            }
          }, _callee2, null, [[3, 11]]);
        }));
        return function (_x4) {
          return _ref6.apply(this, arguments);
        };
      }());

      // Cancel any in-flight requests from previous loads that aren't useful to this one
      if (this.loadSubscriber !== undefined) {
        this.requestQueue.removeSubscriber(this.loadSubscriber, CHUNK_REQUEST_CANCEL_REASON);
      }
      this.loadSubscriber = subscriber;
      this.beginPrefetch(keys, level);
      Promise.all(channelPromises).then(function () {
        _this4.requestQueue.removeSubscriber(subscriber, CHUNK_REQUEST_CANCEL_REASON);
        setTimeout(function () {
          return _this4.beginPrefetch(keys, level);
        }, 1000);
      });
      return Promise.resolve({
        imageInfo: updatedImageInfo
      });
    }
  }], [{
    key: "createLoader",
    value: function () {
      var _createLoader = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_8___default().mark(function _callee3(url) {
        var scene,
          cache,
          queue,
          fetchOptions,
          store,
          root,
          group,
          metadata,
          multiscale,
          scaleLevelPromises,
          scaleLevels,
          axisTCZYX,
          _args3 = arguments;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_8___default().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              scene = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : 0;
              cache = _args3.length > 2 ? _args3[2] : undefined;
              queue = _args3.length > 3 ? _args3[3] : undefined;
              fetchOptions = _args3.length > 4 ? _args3[4] : undefined;
              // Setup queue and store, get basic metadata
              if (!queue) {
                queue = new _utils_SubscribableRequestQueue__WEBPACK_IMPORTED_MODULE_9__["default"](fetchOptions === null || fetchOptions === void 0 ? void 0 : fetchOptions.concurrencyLimit, fetchOptions === null || fetchOptions === void 0 ? void 0 : fetchOptions.prefetchConcurrencyLimit);
              }
              store = new _zarr_utils_WrappedStore__WEBPACK_IMPORTED_MODULE_13__["default"](new zarrita__WEBPACK_IMPORTED_MODULE_17__["default"](url), cache, queue);
              root = _zarrita_core__WEBPACK_IMPORTED_MODULE_18__.root(store);
              _context3.next = 9;
              return _zarrita_core__WEBPACK_IMPORTED_MODULE_19__.open(root, {
                kind: "group"
              });
            case 9:
              group = _context3.sent;
              metadata = group.attrs; // Pick scene (multiscale)
              if (scene > metadata.multiscales.length) {
                console.warn("WARNING: OMEZarrLoader: scene ".concat(scene, " is invalid. Using scene 0."));
                scene = 0;
              }
              multiscale = metadata.multiscales[scene]; // Open all scale levels of multiscale
              scaleLevelPromises = multiscale.datasets.map(function (_ref7) {
                var path = _ref7.path;
                return _zarrita_core__WEBPACK_IMPORTED_MODULE_19__.open(root.resolve(path), {
                  kind: "array"
                });
              });
              _context3.next = 16;
              return Promise.all(scaleLevelPromises);
            case 16:
              scaleLevels = _context3.sent;
              axisTCZYX = remapAxesToTCZYX(multiscale.axes);
              return _context3.abrupt("return", new OMEZarrLoader(store, scaleLevels, multiscale, metadata.omero, axisTCZYX, queue, fetchOptions));
            case 19:
            case "end":
              return _context3.stop();
          }
        }, _callee3);
      }));
      function createLoader(_x5) {
        return _createLoader.apply(this, arguments);
      }
      return createLoader;
    }()
  }]);
  return OMEZarrLoader;
}(_IVolumeLoader__WEBPACK_IMPORTED_MODULE_10__.ThreadableVolumeLoader);


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
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var geotiff__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! geotiff */ "./node_modules/geotiff/dist-module/geotiff.js");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var _IVolumeLoader__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./IVolumeLoader */ "./src/loaders/IVolumeLoader.ts");
/* harmony import */ var _VolumeLoaderUtils__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./VolumeLoaderUtils */ "./src/loaders/VolumeLoaderUtils.ts");








function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0,_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }




function prepareXML(xml) {
  // trim trailing unicode zeros?
  // eslint-disable-next-line no-control-regex
  var expr = /[\u0000]$/g;
  return xml.trim().replace(expr, "").trim();
}
function getOME(xml) {
  var parser = new DOMParser();
  var xmlDoc = parser.parseFromString(xml, "text/xml");
  var omeEl = xmlDoc.getElementsByTagName("OME")[0];
  return omeEl;
}
var OMEDims = /*#__PURE__*/(0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4__["default"])(function OMEDims() {
  (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_5__["default"])(this, OMEDims);
  (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6__["default"])(this, "sizex", 0);
  (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6__["default"])(this, "sizey", 0);
  (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6__["default"])(this, "sizez", 0);
  (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6__["default"])(this, "sizec", 0);
  (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6__["default"])(this, "sizet", 0);
  (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6__["default"])(this, "unit", "");
  (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6__["default"])(this, "pixeltype", "");
  (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6__["default"])(this, "dimensionorder", "");
  (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6__["default"])(this, "pixelsizex", 0);
  (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6__["default"])(this, "pixelsizey", 0);
  (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6__["default"])(this, "pixelsizez", 0);
  (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6__["default"])(this, "channelnames", []);
});
function getOMEDims(imageEl) {
  var dims = new OMEDims();
  var pixelsEl = imageEl.getElementsByTagName("Pixels")[0];
  dims.sizex = Number(pixelsEl.getAttribute("SizeX"));
  dims.sizey = Number(pixelsEl.getAttribute("SizeY"));
  dims.sizez = Number(pixelsEl.getAttribute("SizeZ"));
  dims.sizec = Number(pixelsEl.getAttribute("SizeC"));
  dims.sizet = Number(pixelsEl.getAttribute("SizeT"));
  dims.unit = pixelsEl.getAttribute("PhysicalSizeXUnit") || "";
  dims.pixeltype = pixelsEl.getAttribute("Type") || "";
  dims.dimensionorder = pixelsEl.getAttribute("DimensionOrder") || "XYZCT";
  dims.pixelsizex = Number(pixelsEl.getAttribute("PhysicalSizeX"));
  dims.pixelsizey = Number(pixelsEl.getAttribute("PhysicalSizeY"));
  dims.pixelsizez = Number(pixelsEl.getAttribute("PhysicalSizeZ"));
  var channelsEls = pixelsEl.getElementsByTagName("Channel");
  for (var i = 0; i < channelsEls.length; ++i) {
    var name = channelsEls[i].getAttribute("Name");
    var id = channelsEls[i].getAttribute("ID");
    dims.channelnames.push(name ? name : id ? id : "Channel" + i);
  }
  return dims;
}
var getBytesPerSample = function getBytesPerSample(type) {
  return type === "uint8" ? 1 : type === "uint16" ? 2 : 4;
};

// Despite the class `TiffLoader` extends, this loader is not threadable, since geotiff internally uses features that
// aren't available on workers. It uses its own specialized workers anyways.
var TiffLoader = /*#__PURE__*/function (_ThreadableVolumeLoad) {
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_1__["default"])(TiffLoader, _ThreadableVolumeLoad);
  var _super = _createSuper(TiffLoader);
  function TiffLoader(url) {
    var _this;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_5__["default"])(this, TiffLoader);
    _this = _super.call(this);
    _this.url = url;
    return _this;
  }
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4__["default"])(TiffLoader, [{
    key: "loadOmeDims",
    value: function () {
      var _loadOmeDims = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_7___default().mark(function _callee() {
        var tiff, image, tiffimgdesc, omeEl, image0El;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_7___default().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              if (this.dims) {
                _context.next = 11;
                break;
              }
              _context.next = 3;
              return (0,geotiff__WEBPACK_IMPORTED_MODULE_10__.fromUrl)(this.url, {
                allowFullFile: true
              });
            case 3:
              tiff = _context.sent;
              _context.next = 6;
              return tiff.getImage();
            case 6:
              image = _context.sent;
              tiffimgdesc = prepareXML(image.getFileDirectory().ImageDescription);
              omeEl = getOME(tiffimgdesc);
              image0El = omeEl.getElementsByTagName("Image")[0];
              this.dims = getOMEDims(image0El);
            case 11:
              return _context.abrupt("return", this.dims);
            case 12:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function loadOmeDims() {
        return _loadOmeDims.apply(this, arguments);
      }
      return loadOmeDims;
    }()
  }, {
    key: "loadDims",
    value: function () {
      var _loadDims = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_7___default().mark(function _callee2(_loadSpec) {
        var dims, d;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_7___default().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return this.loadOmeDims();
            case 2:
              dims = _context2.sent;
              d = new _IVolumeLoader__WEBPACK_IMPORTED_MODULE_8__.VolumeDims();
              d.shape = [dims.sizet, dims.sizec, dims.sizez, dims.sizey, dims.sizex];
              d.spacing = [1, 1, dims.pixelsizez, dims.pixelsizey, dims.pixelsizex];
              d.spaceUnit = dims.unit ? dims.unit : "micron";
              d.dataType = dims.pixeltype ? dims.pixeltype : "uint8";
              return _context2.abrupt("return", [d]);
            case 9:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function loadDims(_x) {
        return _loadDims.apply(this, arguments);
      }
      return loadDims;
    }()
  }, {
    key: "createImageInfo",
    value: function () {
      var _createImageInfo = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_7___default().mark(function _callee3(_loadSpec) {
        var dims, atlasDims, targetSize, tilesizex, tilesizey, imgdata;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_7___default().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return this.loadOmeDims();
            case 2:
              dims = _context3.sent;
              // compare with sizex, sizey
              //const width = image.getWidth();
              //const height = image.getHeight();
              // TODO allow user setting of this downsampling info?
              // TODO allow ROI selection: range of x,y,z,c for a given t
              atlasDims = (0,_VolumeLoaderUtils__WEBPACK_IMPORTED_MODULE_9__.computePackedAtlasDims)(dims.sizez, dims.sizex, dims.sizey); // fit tiles to max of 2048x2048?
              targetSize = 2048;
              tilesizex = Math.floor(targetSize / atlasDims.x);
              tilesizey = Math.floor(targetSize / atlasDims.y); // load tiff and check metadata
              imgdata = {
                name: "TEST",
                originalSize: new three__WEBPACK_IMPORTED_MODULE_11__.Vector3(dims.sizex, dims.sizey, dims.sizez),
                atlasTileDims: atlasDims,
                volumeSize: new three__WEBPACK_IMPORTED_MODULE_11__.Vector3(tilesizex, tilesizey, dims.sizez),
                subregionSize: new three__WEBPACK_IMPORTED_MODULE_11__.Vector3(tilesizex, tilesizey, dims.sizez),
                subregionOffset: new three__WEBPACK_IMPORTED_MODULE_11__.Vector3(0, 0, 0),
                physicalPixelSize: new three__WEBPACK_IMPORTED_MODULE_11__.Vector3(dims.pixelsizex, dims.pixelsizey, dims.pixelsizez),
                spatialUnit: dims.unit || "",
                numChannels: dims.sizec,
                channelNames: dims.channelnames,
                times: dims.sizet,
                timeScale: 1,
                timeUnit: "",
                numMultiscaleLevels: 1,
                multiscaleLevel: 0,
                transform: {
                  translation: new three__WEBPACK_IMPORTED_MODULE_11__.Vector3(0, 0, 0),
                  rotation: new three__WEBPACK_IMPORTED_MODULE_11__.Vector3(0, 0, 0)
                }
              }; // This loader uses no fields from `LoadSpec`. Initialize volume with defaults.
              return _context3.abrupt("return", {
                imageInfo: imgdata,
                loadSpec: new _IVolumeLoader__WEBPACK_IMPORTED_MODULE_8__.LoadSpec()
              });
            case 9:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this);
      }));
      function createImageInfo(_x2) {
        return _createImageInfo.apply(this, arguments);
      }
      return createImageInfo;
    }()
  }, {
    key: "loadRawChannelData",
    value: function () {
      var _loadRawChannelData = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_7___default().mark(function _callee4(imageInfo, _loadSpec, onData) {
        var _this2 = this;
        var dims, _loop, channel;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_7___default().wrap(function _callee4$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return this.loadOmeDims();
            case 2:
              dims = _context5.sent;
              _loop = /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_7___default().mark(function _loop() {
                var params, worker;
                return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_7___default().wrap(function _loop$(_context4) {
                  while (1) switch (_context4.prev = _context4.next) {
                    case 0:
                      params = {
                        channel: channel,
                        // these are target xy sizes for the in-memory volume data
                        // they may or may not be the same size as original xy sizes
                        tilesizex: imageInfo.volumeSize.x,
                        tilesizey: imageInfo.volumeSize.y,
                        sizec: imageInfo.numChannels,
                        sizez: imageInfo.volumeSize.z,
                        dimensionOrder: dims.dimensionorder,
                        bytesPerSample: getBytesPerSample(dims.pixeltype),
                        url: _this2.url
                      };
                      worker = new Worker(new URL(/* worker import */ __webpack_require__.p + __webpack_require__.u("src_workers_FetchTiffWorker_ts"), __webpack_require__.b));
                      worker.onmessage = function (e) {
                        var u8 = e.data.data;
                        var channel = e.data.channel;
                        onData(channel, u8);
                        worker.terminate();
                      };
                      worker.onerror = function (e) {
                        alert("Error: Line " + e.lineno + " in " + e.filename + ": " + e.message);
                      };
                      worker.postMessage(params);
                    case 5:
                    case "end":
                      return _context4.stop();
                  }
                }, _loop);
              });
              channel = 0;
            case 5:
              if (!(channel < imageInfo.numChannels)) {
                _context5.next = 10;
                break;
              }
              return _context5.delegateYield(_loop(), "t0", 7);
            case 7:
              ++channel;
              _context5.next = 5;
              break;
            case 10:
              return _context5.abrupt("return", {});
            case 11:
            case "end":
              return _context5.stop();
          }
        }, _callee4, this);
      }));
      function loadRawChannelData(_x3, _x4, _x5) {
        return _loadRawChannelData.apply(this, arguments);
      }
      return loadRawChannelData;
    }()
  }]);
  return TiffLoader;
}(_IVolumeLoader__WEBPACK_IMPORTED_MODULE_8__.ThreadableVolumeLoader);


/***/ }),

/***/ "./src/loaders/VolumeLoaderUtils.ts":
/*!******************************************!*\
  !*** ./src/loaders/VolumeLoaderUtils.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   buildDefaultMetadata: () => (/* binding */ buildDefaultMetadata),
/* harmony export */   composeSubregion: () => (/* binding */ composeSubregion),
/* harmony export */   computePackedAtlasDims: () => (/* binding */ computePackedAtlasDims),
/* harmony export */   convertSubregionToPixels: () => (/* binding */ convertSubregionToPixels),
/* harmony export */   estimateLevelForAtlas: () => (/* binding */ estimateLevelForAtlas),
/* harmony export */   unitNameToSymbol: () => (/* binding */ unitNameToSymbol)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! regenerator-runtime/runtime */ "./node_modules/regenerator-runtime/runtime.js");
/* harmony import */ var regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }


var MAX_ATLAS_EDGE = 2048;

// Map from units to their symbols
var UNIT_SYMBOLS = {
  angstrom: "Å",
  day: "d",
  foot: "ft",
  hour: "h",
  inch: "in",
  meter: "m",
  mile: "mi",
  minute: "min",
  parsec: "pc",
  second: "s",
  yard: "yd"
};

// Units which may take SI prefixes (e.g. micro-, tera-)
var SI_UNITS = ["meter", "second"];

// SI prefixes which abbreviate in nonstandard ways
var SI_PREFIX_ABBVS = {
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
  var prefixedSIUnit = SI_UNITS.find(function (siUnit) {
    return unitName.endsWith(siUnit);
  });
  if (prefixedSIUnit) {
    var prefix = unitName.substring(0, unitName.length - prefixedSIUnit.length);
    if (SI_PREFIX_ABBVS[prefix]) {
      // "special" SI prefix
      return SI_PREFIX_ABBVS[prefix] + UNIT_SYMBOLS[prefixedSIUnit];
    }

    // almost all SI prefixes are abbreviated by first letter, capitalized if prefix ends with "a"
    var capitalize = prefix.endsWith("a");
    var prefixAbbr = capitalize ? prefix[0].toUpperCase() : prefix[0];
    return prefixAbbr + UNIT_SYMBOLS[prefixedSIUnit];
  }
  return null;
}

// We want to find the most "square" packing of z tw by th tiles.
// Compute number of rows and columns.
function computePackedAtlasDims(z, tw, th) {
  var nextrows = 1;
  var nextcols = z;
  var ratio = nextcols * tw / (nextrows * th);
  var nrows = nextrows;
  var ncols = nextcols;
  while (ratio > 1) {
    nrows = nextrows;
    ncols = nextcols;
    nextcols -= 1;
    nextrows = Math.ceil(z / nextcols);
    ratio = nextcols * tw / (nextrows * th);
  }
  return new three__WEBPACK_IMPORTED_MODULE_2__.Vector2(nrows, ncols);
}

/** Picks the largest scale level that can fit into a texture atlas */
function estimateLevelForAtlas(spatialDimsZYX) {
  var maxAtlasEdge = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : MAX_ATLAS_EDGE;
  if (spatialDimsZYX.length <= 1) {
    return 0;
  }

  // update levelToLoad after we get size info about multiscales
  var levelToLoad = spatialDimsZYX.length - 1;
  for (var i = 0; i < spatialDimsZYX.length; ++i) {
    // estimate atlas size:
    var x = spatialDimsZYX[i][2];
    var y = spatialDimsZYX[i][1];
    var z = spatialDimsZYX[i][0];
    var xtiles = Math.floor(maxAtlasEdge / x);
    var ytiles = Math.floor(maxAtlasEdge / y);
    if (xtiles * ytiles >= z) {
      levelToLoad = i;
      break;
    }
  }
  return levelToLoad;
}

/** Given the size of a volume in pixels, convert a `Box3` in the 0-1 range to pixels */
function convertSubregionToPixels(region, size) {
  var min = region.min.clone().multiply(size).floor();
  var max = region.max.clone().multiply(size).ceil();

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
  return new three__WEBPACK_IMPORTED_MODULE_2__.Box3(min, max);
}

/**
 * Return the subset of `container` specified by `region`, assuming that `region` contains fractional values (between 0
 * and 1). i.e. if `container`'s range on the X axis is 0-4 and `region`'s is 0.25-0.5, the result will have range 1-2.
 */
function composeSubregion(region, container) {
  var size = container.getSize(new three__WEBPACK_IMPORTED_MODULE_2__.Vector3());
  var min = region.min.clone().multiply(size).add(container.min);
  var max = region.max.clone().multiply(size).add(container.min);
  return new three__WEBPACK_IMPORTED_MODULE_2__.Box3(min, max);
}
function isEmpty(obj) {
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return false;
    }
  }
  return true;
}

// currently everything needed can come from the imageInfo
// but in the future each IVolumeLoader could have a completely separate implementation.
function buildDefaultMetadata(imageInfo) {
  var physicalSize = imageInfo.volumeSize.clone().multiply(imageInfo.physicalPixelSize);
  var metadata = {};
  metadata["Dimensions"] = _objectSpread({}, imageInfo.subregionSize);
  metadata["Original dimensions"] = _objectSpread({}, imageInfo.originalSize);
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
/* harmony export */   VolumeFileFormat: () => (/* binding */ VolumeFileFormat),
/* harmony export */   createVolumeLoader: () => (/* binding */ createVolumeLoader),
/* harmony export */   pathToFileType: () => (/* binding */ pathToFileType)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _OmeZarrLoader__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./OmeZarrLoader */ "./src/loaders/OmeZarrLoader.ts");
/* harmony import */ var _JsonImageInfoLoader__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./JsonImageInfoLoader */ "./src/loaders/JsonImageInfoLoader.ts");
/* harmony import */ var _TiffLoader__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./TiffLoader */ "./src/loaders/TiffLoader.ts");





var VolumeFileFormat = /*#__PURE__*/function (VolumeFileFormat) {
  VolumeFileFormat["ZARR"] = "zarr";
  VolumeFileFormat["JSON"] = "json";
  VolumeFileFormat["TIFF"] = "tiff";
  return VolumeFileFormat;
}({});
function pathToFileType(path) {
  if (path.endsWith(".json")) {
    return VolumeFileFormat.JSON;
  } else if (path.endsWith(".tif") || path.endsWith(".tiff")) {
    return VolumeFileFormat.TIFF;
  }
  return VolumeFileFormat.ZARR;
}
function createVolumeLoader(_x, _x2) {
  return _createVolumeLoader.apply(this, arguments);
}
function _createVolumeLoader() {
  _createVolumeLoader = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default().mark(function _callee(path, options) {
    var pathString, fileType;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          pathString = Array.isArray(path) ? path[0] : path;
          fileType = (options === null || options === void 0 ? void 0 : options.fileType) || pathToFileType(pathString);
          _context.t0 = fileType;
          _context.next = _context.t0 === VolumeFileFormat.ZARR ? 5 : _context.t0 === VolumeFileFormat.JSON ? 8 : _context.t0 === VolumeFileFormat.TIFF ? 9 : 10;
          break;
        case 5:
          _context.next = 7;
          return _OmeZarrLoader__WEBPACK_IMPORTED_MODULE_2__.OMEZarrLoader.createLoader(pathString, options === null || options === void 0 ? void 0 : options.scene, options === null || options === void 0 ? void 0 : options.cache, options === null || options === void 0 ? void 0 : options.queue, options === null || options === void 0 ? void 0 : options.fetchOptions);
        case 7:
          return _context.abrupt("return", _context.sent);
        case 8:
          return _context.abrupt("return", new _JsonImageInfoLoader__WEBPACK_IMPORTED_MODULE_3__.JsonImageInfoLoader(path, options === null || options === void 0 ? void 0 : options.cache));
        case 9:
          return _context.abrupt("return", new _TiffLoader__WEBPACK_IMPORTED_MODULE_4__.TiffLoader(pathString));
        case 10:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _createVolumeLoader.apply(this, arguments);
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
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__);



function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
/**
 * Directions in which to move outward from the loaded set of chunks while prefetching.
 *
 * Ordered in pairs of opposite directions both because that's a sensible order in which to prefetch for our purposes,
 * and because it lets us treat the least significant bit as the sign. So `direction >> 1` gives the index of the
 * direction in TZYX-ordered arrays, and `direction & 1` gives the sign of the direction (e.g. positive vs negative Z).
 *
 * Note that this enum is mostly for documentation, and its variants are never explicitly used.
 */
var PrefetchDirection = /*#__PURE__*/function (PrefetchDirection) {
  PrefetchDirection[PrefetchDirection["T_MINUS"] = 0] = "T_MINUS";
  PrefetchDirection[PrefetchDirection["T_PLUS"] = 1] = "T_PLUS";
  PrefetchDirection[PrefetchDirection["Z_MINUS"] = 2] = "Z_MINUS";
  PrefetchDirection[PrefetchDirection["Z_PLUS"] = 3] = "Z_PLUS";
  PrefetchDirection[PrefetchDirection["Y_MINUS"] = 4] = "Y_MINUS";
  PrefetchDirection[PrefetchDirection["Y_PLUS"] = 5] = "Y_PLUS";
  PrefetchDirection[PrefetchDirection["X_MINUS"] = 6] = "X_MINUS";
  PrefetchDirection[PrefetchDirection["X_PLUS"] = 7] = "X_PLUS";
  return PrefetchDirection;
}(PrefetchDirection || {});
var directionToIndex = function directionToIndex(dir) {
  var absDir = dir >> 1; // shave off sign bit to get index in TZYX
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
var ChunkPrefetchIterator = /*#__PURE__*/function (_Symbol$iterator) {
  function ChunkPrefetchIterator(chunks, tzyxMaxPrefetchOffset, tzyxNumChunks) {
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, ChunkPrefetchIterator);
    // Get min and max chunk coordinates for T/Z/Y/X
    var extrema = [[Infinity, -Infinity], [Infinity, -Infinity], [Infinity, -Infinity], [Infinity, -Infinity]];
    var _iterator = _createForOfIteratorHelper(chunks),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var chunk = _step.value;
        updateMinMax(chunk[0], extrema[0]);
        updateMinMax(chunk[2], extrema[1]);
        updateMinMax(chunk[3], extrema[2]);
        updateMinMax(chunk[4], extrema[3]);
      }

      // Create `PrefetchDirectionState`s for each direction
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    var directions = extrema.flat().map(function (start, direction) {
      var dimension = direction >> 1;
      if (direction & 1) {
        // Positive direction - end is either the max coordinate in the fetched set plus the max offset in this
        // dimension, or the max chunk coordinate in this dimension, whichever comes first
        var end = Math.min(start + tzyxMaxPrefetchOffset[dimension], tzyxNumChunks[dimension] - 1);
        return {
          direction: direction,
          start: start,
          end: end,
          chunks: []
        };
      } else {
        // Negative direction - end is either the min coordinate in the fetched set minus the max offset in this
        // dimension, or 0, whichever comes first
        var _end = Math.max(start - tzyxMaxPrefetchOffset[dimension], 0);
        return {
          direction: direction,
          start: start,
          end: _end,
          chunks: []
        };
      }
    });

    // Fill each `PrefetchDirectionState` with chunks at the border of the fetched set
    var _iterator2 = _createForOfIteratorHelper(chunks),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var _chunk = _step2.value;
        var _iterator3 = _createForOfIteratorHelper(directions),
          _step3;
        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var dir = _step3.value;
            if (_chunk[directionToIndex(dir.direction)] === dir.start) {
              dir.chunks.push(_chunk);
            }
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
    this.directions = directions;
  }
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(ChunkPrefetchIterator, [{
    key: _Symbol$iterator,
    value: /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().mark(function value() {
      var offset, _iterator4, _step4, dir, _iterator5, _step5, chunk, newChunk;
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().wrap(function value$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            offset = 1;
          case 1:
            if (!(this.directions.length > 0)) {
              _context.next = 40;
              break;
            }
            // Remove directions in which we have hit a boundary
            this.directions = this.directions.filter(function (dir) {
              if (dir.direction & 1) {
                return dir.start + offset <= dir.end;
              } else {
                return dir.start - offset >= dir.end;
              }
            });

            // Yield chunks one chunk farther out in every remaining direction
            _iterator4 = _createForOfIteratorHelper(this.directions);
            _context.prev = 4;
            _iterator4.s();
          case 6:
            if ((_step4 = _iterator4.n()).done) {
              _context.next = 29;
              break;
            }
            dir = _step4.value;
            _iterator5 = _createForOfIteratorHelper(dir.chunks);
            _context.prev = 9;
            _iterator5.s();
          case 11:
            if ((_step5 = _iterator5.n()).done) {
              _context.next = 19;
              break;
            }
            chunk = _step5.value;
            newChunk = chunk.slice();
            newChunk[directionToIndex(dir.direction)] += offset * (dir.direction & 1 ? 1 : -1);
            _context.next = 17;
            return newChunk;
          case 17:
            _context.next = 11;
            break;
          case 19:
            _context.next = 24;
            break;
          case 21:
            _context.prev = 21;
            _context.t0 = _context["catch"](9);
            _iterator5.e(_context.t0);
          case 24:
            _context.prev = 24;
            _iterator5.f();
            return _context.finish(24);
          case 27:
            _context.next = 6;
            break;
          case 29:
            _context.next = 34;
            break;
          case 31:
            _context.prev = 31;
            _context.t1 = _context["catch"](4);
            _iterator4.e(_context.t1);
          case 34:
            _context.prev = 34;
            _iterator4.f();
            return _context.finish(34);
          case 37:
            offset += 1;
            _context.next = 1;
            break;
          case 40:
          case "end":
            return _context.stop();
        }
      }, value, this, [[4, 31, 34, 37], [9, 21, 24, 27]]);
    })
  }]);
  return ChunkPrefetchIterator;
}(Symbol.iterator);


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
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3__);




/**
 * `Readable` is zarrita's minimal abstraction for any source of data.
 * `WrappedStore` wraps another `Readable` and adds (optional) connections to `VolumeCache` and `RequestQueue`.
 */
var WrappedStore = /*#__PURE__*/function () {
  function WrappedStore(baseStore, cache, queue) {
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__["default"])(this, WrappedStore);
    this.baseStore = baseStore;
    this.cache = cache;
    this.queue = queue;
  }
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__["default"])(WrappedStore, [{
    key: "getAndCache",
    value: function () {
      var _getAndCache = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3___default().mark(function _callee(key, cacheKey, opts) {
        var result;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3___default().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return this.baseStore.get(key, opts);
            case 2:
              result = _context.sent;
              if (this.cache && result) {
                this.cache.insert(cacheKey, result);
              }
              return _context.abrupt("return", result);
            case 5:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function getAndCache(_x, _x2, _x3) {
        return _getAndCache.apply(this, arguments);
      }
      return getAndCache;
    }()
  }, {
    key: "get",
    value: function () {
      var _get = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3___default().mark(function _callee2(key, opts) {
        var _url,
          _this = this;
        var ZARR_EXTS, keyPrefix, fullKey, cacheResult;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3___default().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              ZARR_EXTS = [".zarray", ".zgroup", ".zattrs", "zarr.json"];
              if (!(!this.cache || ZARR_EXTS.some(function (s) {
                return key.endsWith(s);
              }))) {
                _context2.next = 3;
                break;
              }
              return _context2.abrupt("return", this.baseStore.get(key, opts === null || opts === void 0 ? void 0 : opts.options));
            case 3:
              if (opts !== null && opts !== void 0 && opts.reportKey) {
                opts.reportKey(key, opts.subscriber);
              }
              keyPrefix = (_url = this.baseStore.url) !== null && _url !== void 0 ? _url : "";
              if (keyPrefix !== "" && !(keyPrefix instanceof URL) && !keyPrefix.endsWith("/")) {
                keyPrefix += "/";
              }
              fullKey = keyPrefix + key.slice(1); // Check the cache
              cacheResult = this.cache.get(fullKey);
              if (!cacheResult) {
                _context2.next = 10;
                break;
              }
              return _context2.abrupt("return", new Uint8Array(cacheResult));
            case 10:
              if (!(this.queue && opts)) {
                _context2.next = 14;
                break;
              }
              return _context2.abrupt("return", this.queue.addRequest(fullKey, opts.subscriber, function () {
                return _this.getAndCache(key, fullKey, opts === null || opts === void 0 ? void 0 : opts.options);
              }, opts.isPrefetch));
            case 14:
              return _context2.abrupt("return", this.getAndCache(key, fullKey, opts === null || opts === void 0 ? void 0 : opts.options));
            case 15:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function get(_x4, _x5) {
        return _get.apply(this, arguments);
      }
      return get;
    }()
  }]);
  return WrappedStore;
}();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (WrappedStore);

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
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3__);



function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }

/** Object format used when passing multiple requests to RequestQueue at once. */

var DEFAULT_REQUEST_CANCEL_REASON = "request cancelled";

/**
 * Internal object interface used by RequestQueue to store request metadata and callbacks.
 */
/**
 * Manages a queue of asynchronous requests with unique string keys, which can be added to or cancelled.
 * If redundant requests with the same key are issued, the request action will only be run once per key
 * while the original request is still in the queue.
 */
var RequestQueue = /*#__PURE__*/function () {
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
  function RequestQueue() {
    var maxActiveRequests = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
    var maxLowPriorityRequests = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__["default"])(this, RequestQueue);
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
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__["default"])(RequestQueue, [{
    key: "registerRequest",
    value: function registerRequest(key, requestAction) {
      // Create a new promise and store the resolve and reject callbacks for later.
      // This lets us perform the actual action at a later point, when the request is at the
      // front of the processing queue.
      var promiseResolve, promiseReject;
      var promise = new Promise(function (resolve, reject) {
        promiseResolve = resolve;
        promiseReject = reject;
      });
      // Store the request data.
      var requestItem = {
        key: key,
        action: requestAction,
        resolve: promiseResolve,
        reject: promiseReject,
        promise: promise
      };
      this.allRequests.set(key, requestItem);
      return requestItem;
    }

    /**
     * Moves a registered request into the processing queue, clearing any timeouts on the request.
     * @param key string identifier of the request.
     * @param lowPriority Whether this request should be added with low priority. False by default.
     */
  }, {
    key: "addRequestToQueue",
    value: function addRequestToQueue(key, lowPriority) {
      // Check that this request is not cancelled.
      if (this.allRequests.has(key)) {
        // Clear the request timeout, if it has one, since it is being added to the queue.
        var requestItem = this.allRequests.get(key);
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
  }, {
    key: "addRequest",
    value: function addRequest(key, requestAction) {
      var _this = this,
        _this$allRequests$get;
      var lowPriority = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var delayMs = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
      if (!this.allRequests.has(key)) {
        // New request!
        var requestItem = this.registerRequest(key, requestAction);
        // If a delay is set, wait to add this to the queue.
        if (delayMs > 0) {
          var timeoutId = setTimeout(function () {
            return _this.addRequestToQueue(key, lowPriority);
          }, delayMs);
          // Save timeout information to request metadata
          requestItem.timeoutId = timeoutId;
        } else {
          // No delay, add immediately
          this.addRequestToQueue(key, lowPriority);
        }
      } else {
        var lowPriorityIndex = this.queueLowPriority.indexOf(key);
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
      var promise = (_this$allRequests$get = this.allRequests.get(key)) === null || _this$allRequests$get === void 0 ? void 0 : _this$allRequests$get.promise;
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
  }, {
    key: "addRequests",
    value: function addRequests(requests) {
      var lowPriority = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var delayMs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;
      var promises = [];
      for (var i = 0; i < requests.length; i++) {
        var item = requests[i];
        var promise = this.addRequest(item.key, item.requestAction, lowPriority, delayMs * i);
        promises.push(promise);
      }
      return promises;
    }

    /**
     * Attempts to remove and run the next queued request item, if resources are available.
     * @returns true if a request was started, or false if there are too many
     * requests already active.
     */
  }, {
    key: "dequeue",
    value: function () {
      var _dequeue = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3___default().mark(function _callee() {
        var _this$queue$shift;
        var numRequests, requestKey, requestItem, key;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3___default().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              numRequests = this.activeRequests.size;
              if (!(numRequests >= this.maxActiveRequests || this.queue.length === 0 && (numRequests >= this.maxLowPriorityRequests || this.queueLowPriority.length === 0))) {
                _context.next = 3;
                break;
              }
              return _context.abrupt("return");
            case 3:
              requestKey = (_this$queue$shift = this.queue.shift()) !== null && _this$queue$shift !== void 0 ? _this$queue$shift : this.queueLowPriority.shift();
              if (requestKey) {
                _context.next = 6;
                break;
              }
              return _context.abrupt("return");
            case 6:
              if (!this.activeRequests.has(requestKey)) {
                _context.next = 9;
                break;
              }
              // This request is already active, try the next one instead. (this shouldn't happen)
              this.dequeue();
              return _context.abrupt("return");
            case 9:
              requestItem = this.allRequests.get(requestKey);
              if (requestItem) {
                _context.next = 12;
                break;
              }
              return _context.abrupt("return");
            case 12:
              key = requestItem.key; // Mark that this request is active
              this.activeRequests.add(key);
              _context.next = 16;
              return requestItem.action().then(requestItem.resolve, requestItem.reject);
            case 16:
              this.activeRequests["delete"](key);
              this.allRequests["delete"](key);
              this.dequeue();
            case 19:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function dequeue() {
        return _dequeue.apply(this, arguments);
      }
      return dequeue;
    }()
    /**
     * Removes any request matching the provided key from the queue and rejects its promise.
     * @param key The key that should be matched against.
     * @param cancelReason A message or object that will be used as the promise rejection.
     */
  }, {
    key: "cancelRequest",
    value: function cancelRequest(key) {
      var cancelReason = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_REQUEST_CANCEL_REASON;
      if (!this.allRequests.has(key)) {
        return;
      }
      var requestItem = this.allRequests.get(key);
      if (requestItem) {
        if (requestItem.timeoutId) {
          // Cancel requests that have not been queued yet.
          clearTimeout(requestItem.timeoutId);
        }
        // Reject the request, then clear from the queue and known requests.
        requestItem.reject(cancelReason);
      }
      var queueIndex = this.queue.indexOf(key);
      if (queueIndex > -1) {
        this.queue.splice(queueIndex, 1);
      } else {
        var lowPriorityIndex = this.queueLowPriority.indexOf(key);
        if (lowPriorityIndex > -1) {
          this.queueLowPriority.splice(lowPriorityIndex, 1);
        }
      }
      this.allRequests["delete"](key);
      this.activeRequests["delete"](key);
    }

    /**
     * Rejects all request promises and clears the queue.
     * @param cancelReason A message or object that will be used as the promise rejection.
     */
  }, {
    key: "cancelAllRequests",
    value: function cancelAllRequests() {
      var cancelReason = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_REQUEST_CANCEL_REASON;
      // Clear the queue so we don't do extra work while filtering it
      this.queue = [];
      this.queueLowPriority = [];
      var _iterator = _createForOfIteratorHelper(this.allRequests.keys()),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var key = _step.value;
          this.cancelRequest(key, cancelReason);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }

    /**
     * Returns whether a request with the given key exists in the RequestQueue and is not cancelled.
     * @param key the key to search for.
     * @returns true if the request is in the RequestQueue.
     */
  }, {
    key: "hasRequest",
    value: function hasRequest(key) {
      return this.allRequests.has(key);
    }

    /**
     * Returns whether the request with the given key is currently running (not waiting in the queue).
     * @param key the key to search for.
     * @returns true if the request is actively running.
     */
  }, {
    key: "requestRunning",
    value: function requestRunning(key) {
      return this.activeRequests.has(key);
    }
  }]);
  return RequestQueue;
}();


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
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _RequestQueue__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./RequestQueue */ "./src/utils/RequestQueue.ts");



function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }


// eslint-disable-next-line @typescript-eslint/no-explicit-any
/**
 * An extension of `RequestQueue` that adds a concept of "subscribers," which may share references to a single request
 * or cancel their subscription without disrupting the request for other subscribers.
 */
var SubscribableRequestQueue = /*#__PURE__*/function () {
  function SubscribableRequestQueue(maxActiveRequests, maxLowPriorityRequests) {
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__["default"])(this, SubscribableRequestQueue);
    if (typeof maxActiveRequests === "number" || maxActiveRequests === undefined) {
      this.queue = new _RequestQueue__WEBPACK_IMPORTED_MODULE_3__["default"](maxActiveRequests, maxLowPriorityRequests);
    } else {
      this.queue = maxActiveRequests;
    }
    this.nextSubscriberId = 0;
    this.subscribers = new Map();
    this.requests = new Map();
  }

  /** Resolves all subscriptions to request `key` with `value` */
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__["default"])(SubscribableRequestQueue, [{
    key: "resolveAll",
    value: function resolveAll(key, value) {
      var requests = this.requests.get(key);
      if (requests) {
        var _iterator = _createForOfIteratorHelper(requests),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var _this$subscribers$get;
            var _step$value = _step.value,
              resolve = _step$value.resolve,
              subscriberId = _step$value.subscriberId;
            resolve(value);
            (_this$subscribers$get = this.subscribers.get(subscriberId)) === null || _this$subscribers$get === void 0 ? void 0 : _this$subscribers$get["delete"](key);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
        this.requests["delete"](key);
      }
    }

    /** Rejects all subscriptions to request `key` with `reason` */
  }, {
    key: "rejectAll",
    value: function rejectAll(key, reason) {
      var requests = this.requests.get(key);
      if (requests) {
        var _iterator2 = _createForOfIteratorHelper(requests),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var _this$subscribers$get2;
            var _step2$value = _step2.value,
              reject = _step2$value.reject,
              subscriberId = _step2$value.subscriberId;
            reject(reason);
            (_this$subscribers$get2 = this.subscribers.get(subscriberId)) === null || _this$subscribers$get2 === void 0 ? void 0 : _this$subscribers$get2["delete"](key);
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
        this.requests["delete"](key);
      }
    }

    /** Adds a new request subscriber. Returns a unique ID to identify this subscriber. */
  }, {
    key: "addSubscriber",
    value: function addSubscriber() {
      var subscriberId = this.nextSubscriberId;
      this.nextSubscriberId++;
      this.subscribers.set(subscriberId, new Map());
      return subscriberId;
    }

    /**
     * Queues a new request, or adds a subscription if the request is already queued/running.
     *
     * If `subscriberId` is already subscribed to the request, this rejects the existing promise and returns a new one.
     */
  }, {
    key: "addRequest",
    value: function addRequest(key, subscriberId, requestAction, lowPriority, delayMs) {
      var _this = this;
      // Create single underlying request if it does not yet exist
      this.queue.addRequest(key, requestAction, lowPriority, delayMs).then(function (value) {
        return _this.resolveAll(key, value);
      })["catch"](function (reason) {
        return _this.rejectAll(key, reason);
      });
      if (!this.requests.has(key)) {
        this.requests.set(key, []);
      }

      // Validate subscriber
      if (subscriberId >= this.nextSubscriberId || subscriberId < 0) {
        throw new Error("SubscribableRequestQueue: subscriber id ".concat(subscriberId, " has not been registered"));
      }
      var subscriber = this.subscribers.get(subscriberId);
      if (!subscriber) {
        throw new Error("SubscribableRequestQueue: subscriber id ".concat(subscriberId, " has been removed"));
      }
      var existingRequest = subscriber.get(key);
      if (existingRequest) {
        this.rejectSubscription(key, existingRequest, "SubscribableRequestQueue: request re-queued while running");
      }

      // Create promise and add to list of requests
      return new Promise(function (resolve, reject) {
        var _this$requests$get, _this$subscribers$get3;
        (_this$requests$get = _this.requests.get(key)) === null || _this$requests$get === void 0 ? void 0 : _this$requests$get.push({
          resolve: resolve,
          reject: reject,
          subscriberId: subscriberId
        });
        (_this$subscribers$get3 = _this.subscribers.get(subscriberId)) === null || _this$subscribers$get3 === void 0 ? void 0 : _this$subscribers$get3.set(key, reject);
      });
    }

    /**
     * Rejects a subscription and removes it from the list of subscriptions for a request, then cancels the underlying
     * request if it is no longer subscribed and is not running already.
     */
  }, {
    key: "rejectSubscription",
    value: function rejectSubscription(key, reject, cancelReason) {
      // Reject the outer "subscription" promise
      reject(cancelReason);

      // Get the list of subscriptions for this request
      var subscriptions = this.requests.get(key);
      if (!subscriptions) {
        // This should never happen
        return;
      }
      // Remove this request subscription by ref equality to `reject`
      var idx = subscriptions.findIndex(function (sub) {
        return sub.reject === reject;
      });
      if (idx >= 0) {
        subscriptions.splice(idx, 1);
      }

      // Remove the underlying request if there are no more subscribers and the request is not already running
      if (subscriptions.length < 1 && !this.queue.requestRunning(key)) {
        this.queue.cancelRequest(key, cancelReason);
        this.requests["delete"](key);
      }
    }

    /** Cancels a request subscription, and cancels the underlying request if it is no longer subscribed or running. */
  }, {
    key: "cancelRequest",
    value: function cancelRequest(key, subscriberId, cancelReason) {
      var subscriber = this.subscribers.get(subscriberId);
      if (!subscriber) {
        return false;
      }
      var reject = subscriber.get(key);
      if (!reject) {
        return false;
      }
      this.rejectSubscription(key, reject, cancelReason);
      subscriber["delete"](key);
      return true;
    }

    /** Removes a subscriber and cancels its remaining subscriptions. */
  }, {
    key: "removeSubscriber",
    value: function removeSubscriber(subscriberId, cancelReason) {
      var subscriptions = this.subscribers.get(subscriberId);
      if (subscriptions) {
        var _iterator3 = _createForOfIteratorHelper(subscriptions.entries()),
          _step3;
        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var _step3$value = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_step3.value, 2),
              key = _step3$value[0],
              reject = _step3$value[1];
            this.rejectSubscription(key, reject, cancelReason);
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
        this.subscribers["delete"](subscriberId);
      }
    }

    /** Returns whether a request with the given `key` is running or waiting in the queue */
  }, {
    key: "hasRequest",
    value: function hasRequest(key) {
      return this.queue.hasRequest(key);
    }

    /** Returns whether a request with the given `key` is running */
  }, {
    key: "requestRunning",
    value: function requestRunning(key) {
      return this.queue.requestRunning(key);
    }

    /** Returns whether a subscriber with the given `subscriberId` exists */
  }, {
    key: "hasSubscriber",
    value: function hasSubscriber(subscriberId) {
      return this.subscribers.has(subscriberId);
    }

    /** Returns whether a subscriber with the given `subscriberId` is subscribed to the request with the given `key` */
  }, {
    key: "isSubscribed",
    value: function isSubscribed(subscriberId, key) {
      var _this$subscribers$get4, _this$subscribers$get5;
      return (_this$subscribers$get4 = (_this$subscribers$get5 = this.subscribers.get(subscriberId)) === null || _this$subscribers$get5 === void 0 ? void 0 : _this$subscribers$get5.has(key)) !== null && _this$subscribers$get4 !== void 0 ? _this$subscribers$get4 : false;
    }
  }]);
  return SubscribableRequestQueue;
}();


/***/ }),

/***/ "./src/workers/VolumeLoadWorker.ts":
/*!*****************************************!*\
  !*** ./src/workers/VolumeLoadWorker.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _VolumeCache__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../VolumeCache */ "./src/VolumeCache.ts");
/* harmony import */ var _loaders__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../loaders */ "./src/loaders/index.ts");
/* harmony import */ var _utils_RequestQueue__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/RequestQueue */ "./src/utils/RequestQueue.ts");
/* harmony import */ var _utils_SubscribableRequestQueue__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/SubscribableRequestQueue */ "./src/utils/SubscribableRequestQueue.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./types */ "./src/workers/types.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./util */ "./src/workers/util.ts");


var _messageHandlers;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }






var cache = undefined;
var queue = undefined;
var subscribableQueue = undefined;
var loader = undefined;
var initialized = false;
var copyOnLoad = false;
var messageHandlers = (_messageHandlers = {}, (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(_messageHandlers, _types__WEBPACK_IMPORTED_MODULE_7__.WorkerMsgType.INIT, function (_ref) {
  var maxCacheSize = _ref.maxCacheSize,
    maxActiveRequests = _ref.maxActiveRequests,
    maxLowPriorityRequests = _ref.maxLowPriorityRequests;
  if (!initialized) {
    cache = new _VolumeCache__WEBPACK_IMPORTED_MODULE_3__["default"](maxCacheSize);
    queue = new _utils_RequestQueue__WEBPACK_IMPORTED_MODULE_5__["default"](maxActiveRequests, maxLowPriorityRequests);
    subscribableQueue = new _utils_SubscribableRequestQueue__WEBPACK_IMPORTED_MODULE_6__["default"](queue);
    initialized = true;
  }
  return Promise.resolve();
}), (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(_messageHandlers, _types__WEBPACK_IMPORTED_MODULE_7__.WorkerMsgType.CREATE_LOADER, function () {
  var _ref3 = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().mark(function _callee(_ref2) {
    var path, options, pathString, fileType;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          path = _ref2.path, options = _ref2.options;
          pathString = Array.isArray(path) ? path[0] : path;
          fileType = (options === null || options === void 0 ? void 0 : options.fileType) || (0,_loaders__WEBPACK_IMPORTED_MODULE_4__.pathToFileType)(pathString);
          copyOnLoad = fileType === _loaders__WEBPACK_IMPORTED_MODULE_4__.VolumeFileFormat.JSON;
          _context.next = 6;
          return (0,_loaders__WEBPACK_IMPORTED_MODULE_4__.createVolumeLoader)(path, _objectSpread(_objectSpread({}, options), {}, {
            cache: cache,
            queue: subscribableQueue
          }));
        case 6:
          loader = _context.sent;
          return _context.abrupt("return", loader !== undefined);
        case 8:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function (_x) {
    return _ref3.apply(this, arguments);
  };
}()), (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(_messageHandlers, _types__WEBPACK_IMPORTED_MODULE_7__.WorkerMsgType.CREATE_VOLUME, function () {
  var _ref4 = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().mark(function _callee2(loadSpec) {
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          if (!(loader === undefined)) {
            _context2.next = 2;
            break;
          }
          throw new Error("No loader created");
        case 2:
          _context2.next = 4;
          return loader.createImageInfo((0,_util__WEBPACK_IMPORTED_MODULE_8__.rebuildLoadSpec)(loadSpec));
        case 4:
          return _context2.abrupt("return", _context2.sent);
        case 5:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function (_x2) {
    return _ref4.apply(this, arguments);
  };
}()), (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(_messageHandlers, _types__WEBPACK_IMPORTED_MODULE_7__.WorkerMsgType.LOAD_DIMS, function () {
  var _ref5 = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().mark(function _callee3(loadSpec) {
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          if (!(loader === undefined)) {
            _context3.next = 2;
            break;
          }
          throw new Error("No loader created");
        case 2:
          _context3.next = 4;
          return loader.loadDims((0,_util__WEBPACK_IMPORTED_MODULE_8__.rebuildLoadSpec)(loadSpec));
        case 4:
          return _context3.abrupt("return", _context3.sent);
        case 5:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function (_x3) {
    return _ref5.apply(this, arguments);
  };
}()), (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(_messageHandlers, _types__WEBPACK_IMPORTED_MODULE_7__.WorkerMsgType.LOAD_VOLUME_DATA, function () {
  var _ref7 = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().mark(function _callee4(_ref6) {
    var imageInfo, loadSpec, loaderId, loadId;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          imageInfo = _ref6.imageInfo, loadSpec = _ref6.loadSpec, loaderId = _ref6.loaderId, loadId = _ref6.loadId;
          if (!(loader === undefined)) {
            _context4.next = 3;
            break;
          }
          throw new Error("No loader created");
        case 3:
          _context4.next = 5;
          return loader.loadRawChannelData((0,_util__WEBPACK_IMPORTED_MODULE_8__.rebuildImageInfo)(imageInfo), (0,_util__WEBPACK_IMPORTED_MODULE_8__.rebuildLoadSpec)(loadSpec), function (channelIndex, data, atlasDims) {
            var message = {
              responseResult: _types__WEBPACK_IMPORTED_MODULE_7__.WorkerResponseResult.EVENT,
              loaderId: loaderId,
              loadId: loadId,
              channelIndex: channelIndex,
              data: data,
              atlasDims: atlasDims
            };
            self.postMessage(message, copyOnLoad ? [] : [data.buffer]);
          });
        case 5:
          return _context4.abrupt("return", _context4.sent);
        case 6:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return function (_x4) {
    return _ref7.apply(this, arguments);
  };
}()), _messageHandlers);
self.onmessage = /*#__PURE__*/function () {
  var _ref9 = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().mark(function _callee5(_ref8) {
    var data, msgId, type, payload, message, response;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          data = _ref8.data;
          msgId = data.msgId, type = data.type, payload = data.payload;
          _context5.prev = 2;
          _context5.next = 5;
          return messageHandlers[type](payload);
        case 5:
          response = _context5.sent;
          message = {
            responseResult: _types__WEBPACK_IMPORTED_MODULE_7__.WorkerResponseResult.SUCCESS,
            msgId: msgId,
            type: type,
            payload: response
          };
          _context5.next = 12;
          break;
        case 9:
          _context5.prev = 9;
          _context5.t0 = _context5["catch"](2);
          message = {
            responseResult: _types__WEBPACK_IMPORTED_MODULE_7__.WorkerResponseResult.ERROR,
            msgId: msgId,
            type: type,
            payload: _context5.t0.message
          };
        case 12:
          self.postMessage(message);
        case 13:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[2, 9]]);
  }));
  return function (_x5) {
    return _ref9.apply(this, arguments);
  };
}();

/***/ }),

/***/ "./src/workers/types.ts":
/*!******************************!*\
  !*** ./src/workers/types.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   WorkerMsgType: () => (/* binding */ WorkerMsgType),
/* harmony export */   WorkerResponseResult: () => (/* binding */ WorkerResponseResult)
/* harmony export */ });
/** The types of requests that can be made to the worker. Mostly corresponds to methods on `IVolumeLoader`. */
var WorkerMsgType = /*#__PURE__*/function (WorkerMsgType) {
  WorkerMsgType[WorkerMsgType["INIT"] = 0] = "INIT";
  WorkerMsgType[WorkerMsgType["CREATE_LOADER"] = 1] = "CREATE_LOADER";
  WorkerMsgType[WorkerMsgType["CREATE_VOLUME"] = 2] = "CREATE_VOLUME";
  WorkerMsgType[WorkerMsgType["LOAD_DIMS"] = 3] = "LOAD_DIMS";
  WorkerMsgType[WorkerMsgType["LOAD_VOLUME_DATA"] = 4] = "LOAD_VOLUME_DATA";
  return WorkerMsgType;
}({});

/** The kind of response a worker can return - `SUCCESS`, `ERROR`, or `EVENT`. */
var WorkerResponseResult = /*#__PURE__*/function (WorkerResponseResult) {
  WorkerResponseResult[WorkerResponseResult["SUCCESS"] = 0] = "SUCCESS";
  WorkerResponseResult[WorkerResponseResult["ERROR"] = 1] = "ERROR";
  WorkerResponseResult[WorkerResponseResult["EVENT"] = 2] = "EVENT";
  return WorkerResponseResult;
}({});

/** All messages to/from a worker carry a `msgId`, a `type`, and a `payload` (whose type is determined by `type`). */

/** Maps each `WorkerMsgType` to the type of the payload of requests of that type. */

/** Maps each `WorkerMsgType` to the type of the payload of responses of that type. */

/** Currently the only event a loader can produce is a `ChannelLoadEvent` when a single channel loads. */

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
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

/** Recreates a `LoadSpec` that has just been sent to/from a worker to restore three.js object prototypes */
function rebuildLoadSpec(spec) {
  return _objectSpread(_objectSpread({}, spec), {}, {
    subregion: new three__WEBPACK_IMPORTED_MODULE_1__.Box3(new three__WEBPACK_IMPORTED_MODULE_1__.Vector3().copy(spec.subregion.min), new three__WEBPACK_IMPORTED_MODULE_1__.Vector3().copy(spec.subregion.max))
  });
}

/** Recreates an `ImageInfo` that has just been sent to/from a worker to restore three.js object prototypes */
function rebuildImageInfo(imageInfo) {
  return _objectSpread(_objectSpread({}, imageInfo), {}, {
    originalSize: new three__WEBPACK_IMPORTED_MODULE_1__.Vector3().copy(imageInfo.originalSize),
    atlasTileDims: new three__WEBPACK_IMPORTED_MODULE_1__.Vector2().copy(imageInfo.atlasTileDims),
    volumeSize: new three__WEBPACK_IMPORTED_MODULE_1__.Vector3().copy(imageInfo.volumeSize),
    subregionSize: new three__WEBPACK_IMPORTED_MODULE_1__.Vector3().copy(imageInfo.subregionSize),
    subregionOffset: new three__WEBPACK_IMPORTED_MODULE_1__.Vector3().copy(imageInfo.subregionOffset),
    physicalPixelSize: new three__WEBPACK_IMPORTED_MODULE_1__.Vector3().copy(imageInfo.physicalPixelSize),
    transform: {
      translation: new three__WEBPACK_IMPORTED_MODULE_1__.Vector3().copy(imageInfo.transform.translation),
      rotation: new three__WEBPACK_IMPORTED_MODULE_1__.Vector3().copy(imageInfo.transform.rotation)
    }
  });
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
/******/ 		var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_babel_runtime_regenerator_index_js-node_modules_babel_runtime_helpers_es-31f4f7","vendors-node_modules_regenerator-runtime_runtime_js-node_modules_babel_runtime_helpers_esm_cl-5381a7"], () => (__webpack_require__("./src/workers/VolumeLoadWorker.ts")))
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
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
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
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && !scriptUrl) scriptUrl = scripts[i--].src;
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
/******/ 				__webpack_require__.e("vendors-node_modules_babel_runtime_regenerator_index_js-node_modules_babel_runtime_helpers_es-31f4f7"),
/******/ 				__webpack_require__.e("vendors-node_modules_regenerator-runtime_runtime_js-node_modules_babel_runtime_helpers_esm_cl-5381a7")
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
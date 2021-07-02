import { getColorByChannelIndex } from "./constants/colors.js";

(function() {
  if (!Math.clamp) {
    Math.clamp = function(val, cmin, cmax) {
      return Math.min(Math.max(cmin, val), cmax);
    };
  }
})();

function controlPointToRGBA(controlPoint) {
  return [controlPoint.color[0], controlPoint.color[1], controlPoint.color[2], Math.floor(controlPoint.opacity * 255)];
}

function lerp(xmin, xmax, a) {
  return a * (xmax - xmin) + xmin;
}

const LUT_ENTRIES = 256;
const LUT_ARRAY_LENGTH = LUT_ENTRIES * 4;

/**
 * @typedef {Object} ControlPoint
 * @property {number} x The X Coordinate
 * @property {number} opacity The Opacity
 * @property {string} color The Color
 */

/**
 * @typedef {Object} Lut
 * @property {Array.<number>} lut LUT_ARRAY_LENGTH element lookup table as array (maps scalar intensity to a rgb color plus alpha)
 * @property {Array.<ControlPoint>} controlPoints
 */

/**
 * Builds a histogram with 256 bins from a data array. Assume data is 8 bit single channel grayscale.
 * @class
 * @param {Array.<number>} data
 */
export default class Histogram {
  constructor(data) {
    // no more than 2^32 pixels of any one intensity in the data!?!?!
    this.bins = new Uint32Array(256);
    this.bins.fill(0);
    this.dataMin = 255;
    this.dataMax = 0;
    this.maxBin = 0;

    // build up the histogram
    for (let i = 0; i < data.length; ++i) {
      this.bins[data[i]]++;
    }
    // track the first and last nonzero bins with at least 1 sample
    for (let i = 1; i < this.bins.length; i++) {
      if (this.bins[i] > 0) {
        this.dataMin = i;
        break;
      }
    }
    for (let i = this.bins.length - 1; i >= 1; i--) {
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
    for (let i = 1; i < this.bins.length; i++) {
      if (this.bins[i] > max) {
        this.maxBin = i;
        max = this.bins[i];
      }
    }
  }

  /**
   * Generate a Window/level lookup table
   * @return {Lut}
   * @param {number} wnd in 0..1 range
   * @param {number} lvl in 0..1 range
   */
  lutGenerator_windowLevel(wnd, lvl) {
    // simple linear mapping for actual range
    var b = lvl - wnd * 0.5;
    var e = lvl + wnd * 0.5;
    return this.lutGenerator_minMax(b * 255, e * 255);
  }

  /**
   * Generate a piecewise linear lookup table that ramps up from 0 to 1 over the b to e domain
   *  |
   * 1|               +---------+-----
   *  |              /
   *  |             /
   *  |            /
   *  |           /
   *  |          /
   * 0+=========+---------------+-----
   *  0         b    e          1
   * @return {Lut}
   * @param {number} b
   * @param {number} e
   */
  lutGenerator_minMax(b, e) {
    var lut = new Uint8Array(LUT_ARRAY_LENGTH);
    let range = e - b;
    if (range < 1) {
      range = 255;
    }
    for (var x = 0; x < lut.length / 4; ++x) {
      lut[x * 4 + 0] = 255;
      lut[x * 4 + 1] = 255;
      lut[x * 4 + 2] = 255;
      lut[x * 4 + 3] = Math.clamp(((x - b) * 255) / range, 0, 255);
    }
    return {
      lut: lut,
      controlPoints: [
        { x: 0, opacity: 0, color: [255, 255, 255] },
        { x: b, opacity: 0, color: [255, 255, 255] },
        { x: e, opacity: 1, color: [255, 255, 255] },
        { x: 255, opacity: 1, color: [255, 255, 255] },
      ],
    };
  }

  /**
   * Generate a straight 0-1 linear identity lookup table
   * @return {Lut}
   */
  lutGenerator_fullRange() {
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
      controlPoints: [
        { x: 0, opacity: 0, color: [255, 255, 255] },
        { x: 255, opacity: 1, color: [255, 255, 255] },
      ],
    };
  }

  /**
   * Generate a lookup table over the min to max range of the data values
   * @return {Lut}
   */
  lutGenerator_dataRange() {
    // simple linear mapping for actual range
    var b = this.dataMin;
    var e = this.dataMax;
    return this.lutGenerator_minMax(b, e);
  }

  /**
   * Generate a lookup table with a different color per intensity value
   * @return {Lut}
   */
  lutGenerator_labelColors() {
    const lut = new Uint8Array(LUT_ARRAY_LENGTH).fill(0);
    const controlPoints = [];
    controlPoints.push({ x: 0, opacity: 0, color: [0, 0, 0] });
    let lastr = 0;
    let lastg = 0;
    let lastb = 0;
    let lasta = 0;
    let r = 0;
    let g = 0;
    let b = 0;
    let a = 0;

    // assumes exactly one bin per intensity value?
    // skip zero!!!
    for (let i = 1; i < this.bins.length; ++i) {
      if (this.bins[i] > 0) {
        const rgb = getColorByChannelIndex(i);

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
          controlPoints.push({ x: i - 0.5, opacity: lasta, color: [lastr, lastg, lastb] });
        }
        controlPoints.push({ x: i, opacity: a, color: [r, g, b] });
        lastr = r;
        lastg = g;
        lastb = b;
        lasta = a;
      }
    }

    return {
      lut: lut,
      controlPoints: controlPoints,
    };
  }

  /**
   * Generate a lookup table based on histogram percentiles
   * @return {Lut}
   * @param {number} pmin
   * @param {number} pmax
   */
  lutGenerator_percentiles(pmin, pmax) {
    // e.g. 0.50, 0.983 starts from 50th percentile bucket and ends at 98.3 percentile bucket.

    const pixcount = this.nonzeroPixelCount + this.bins[0];
    //const pixcount = this.imgData.data.length;
    const lowlimit = pixcount * pmin;
    const hilimit = pixcount * pmax;

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

  /**
   * Generate a 10% / 90% lookup table
   * @return {Lut}
   */
  lutGenerator_bestFit() {
    const pixcount = this.nonzeroPixelCount;
    //const pixcount = this.imgData.data.length;
    const limit = pixcount / 10;

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
  lutGenerator_auto2() {
    const AUTO_THRESHOLD = 5000;
    const pixcount = this.nonzeroPixelCount;
    //  const pixcount = this.imgData.data.length;
    const limit = pixcount / 10;
    const threshold = pixcount / AUTO_THRESHOLD;

    // this will skip the "zero" bin which contains pixels of zero intensity.
    var hmin = this.bins.length - 1;
    var hmax = 1;
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
  lutGenerator_auto() {
    // simple linear mapping cutting elements with small appearence
    // get 10% threshold
    var PERCENTAGE = 0.1;
    var th = Math.floor(this.bins[this.maxBin] * PERCENTAGE);
    var b = 0;
    var e = this.bins.length - 1;
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

    return this.lutGenerator_minMax(b, e);
  }

  /**
   * Generate an "equalized" lookup table
   * @return {Lut}
   */
  lutGenerator_equalize() {
    var map = [];
    for (let i = 0; i < this.bins.length; ++i) {
      map[i] = 0;
    }

    // summed area table?
    map[0] = this.bins[0];
    for (let i = 1; i < this.bins.length; ++i) {
      map[i] = map[i - 1] + this.bins[i];
    }

    var div = map[map.length - 1] - map[0];
    if (div > 0) {
      var lut = new Uint8Array(LUT_ARRAY_LENGTH);

      // compute lut and track control points for the piecewise linear sections
      const lutControlPoints = [{ x: 0, opacity: 0, color: [255, 255, 255] }];
      lut[0] = 255;
      lut[1] = 255;
      lut[2] = 255;
      lut[3] = 0;
      let slope = 0;
      let lastSlope = 0;
      let opacity = 0;
      let lastOpacity = 0;
      for (let i = 1; i < lut.length / 4; ++i) {
        lut[i * 4 + 0] = 255;
        lut[i * 4 + 1] = 255;
        lut[i * 4 + 2] = 255;
        lastOpacity = opacity;
        opacity = Math.clamp(Math.round(255 * (map[i] - map[0])), 0, 255);
        lut[i * 4 + 3] = opacity;

        slope = opacity - lastOpacity;
        // if map[i]-map[i-1] is the same as map[i+1]-map[i] then we are in a linear segment and do not need a new control point
        if (slope != lastSlope) {
          lutControlPoints.push({ x: i - 1, opacity: lastOpacity / 255.0, color: [255, 255, 255] });
          lastSlope = slope;
        }
      }

      lutControlPoints.push({ x: 255, opacity: 1, color: [255, 255, 255] });

      return {
        lut: lut,
        controlPoints: lutControlPoints,
      };
    } else {
      // just reset to whole range in this case...?
      return this.lutGenerator_fullRange();
    }
  }

  // @param {Object[]} controlPoints - array of {x:number 0..255, opacity:number 0..1, color:array of 3 numbers 0..255}
  // @return {Uint8Array} array of length 256*4 representing the rgba values of the gradient
  lutGenerator_fromControlPoints(controlPoints) {
    const lut = new Uint8Array(LUT_ARRAY_LENGTH).fill(0);

    if (controlPoints.length === 0) {
      return { lut: lut, controlPoints: controlPoints };
    }

    // ensure they are sorted in ascending order of x
    controlPoints.sort((a, b) => (a.x > b.x ? 1 : -1));

    // special case only one control point.
    if (controlPoints.length === 1) {
      const rgba = controlPointToRGBA(controlPoints[0]);
      // copy val from x to 255.
      for (let x = controlPoints[0].x; x < 256; ++x) {
        lut[x * 4 + 0] = rgba[0];
        lut[x * 4 + 1] = rgba[1];
        lut[x * 4 + 2] = rgba[2];
        lut[x * 4 + 3] = rgba[3];
      }
      return { lut: lut, controlPoints: controlPoints };
    }

    let c0 = controlPoints[0];
    let c1 = controlPoints[1];
    let color0 = controlPointToRGBA(c0);
    let color1 = controlPointToRGBA(c1);
    let lastIndex = 1;
    let a = 0;
    // if the first control point is after 0, act like there are 0s going all the way up to it.
    // or lerp up to the first point?
    for (let x = c0.x; x < 256; ++x) {
      while (x > c1.x) {
        // advance control points
        c0 = c1;
        color0 = color1;
        lastIndex++;
        if (lastIndex >= controlPoints.length) {
          // if the last control point is before 255, then we want to continue its value all the way to 255.
          c1 = { x: 255, color: c1.color, opacity: c1.opacity };
        } else {
          c1 = controlPoints[lastIndex];
        }
        color1 = controlPointToRGBA(c1);
      }
      if (c1.x === c0.x) {
        // use c1
        a = 1.0;
      } else {
        a = (x - c0.x) / (c1.x - c0.x);
      }
      // lerp the colors
      lut[x * 4 + 0] = lerp(color0[0], color1[0], a);
      lut[x * 4 + 1] = lerp(color0[1], color1[1], a);
      lut[x * 4 + 2] = lerp(color0[2], color1[2], a);
      lut[x * 4 + 3] = lerp(color0[3], color1[3], a);
    }
    return { lut: lut, controlPoints: controlPoints };
  }
}

export { LUT_ARRAY_LENGTH };

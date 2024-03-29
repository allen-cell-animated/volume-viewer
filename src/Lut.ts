import { getColorByChannelIndex } from "./constants/colors.js";
import Histogram from "./Histogram.js";

function clamp(val: number, cmin: number, cmax: number): number {
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
function remapDomain(
  value: number,
  valueMin: number,
  valueMax: number,
  oldMin: number,
  oldMax: number,
  newMin: number,
  newMax: number
): number {
  const pctOfRange = (value - valueMin) / (valueMax - valueMin);
  const newValue = (newMax - newMin) * pctOfRange + newMin;
  // now locate this value as a relative index in the old range
  const pctOfOldRange = (newValue - oldMin) / (oldMax - oldMin);
  const remapped = valueMin + pctOfOldRange * (valueMax - valueMin);
  return remapped;
}

function remapDomainForCP(
  value: number,
  valueMin: number,
  valueMax: number,
  oldMin: number,
  oldMax: number,
  newMin: number,
  newMax: number
): number {
  const pctOfRange = (value - valueMin) / (valueMax - valueMin);
  // find abs intensity from old range
  const iOld = (oldMax - oldMin) * pctOfRange + oldMin;
  // now locate this value as a relative index in the new range
  const pctOfNewRange = (iOld - newMin) / (newMax - newMin);
  const remapped = valueMin + pctOfNewRange * (valueMax - valueMin);
  return remapped;
}

export const LUT_ENTRIES = 256;
export const LUT_ARRAY_LENGTH = LUT_ENTRIES * 4;

/**
 * @typedef {Object} ControlPoint Used for the TF (transfer function) editor GUI.
 * Need to be converted to LUT for rendering.
 * @property {number} x The X Coordinate
 * @property {number} opacity The Opacity, from 0 to 1
 * @property {Array.<number>} color The Color, 3 numbers from 0-255 for r,g,b
 */
export type ControlPoint = {
  x: number;
  opacity: number;
  color: [number, number, number];
};

function controlPointToRGBA(controlPoint) {
  return [controlPoint.color[0], controlPoint.color[1], controlPoint.color[2], Math.floor(controlPoint.opacity * 255)];
}

/**
 * @typedef {Object} Lut Used for rendering.
 * @property {Array.<number>} lut LUT_ARRAY_LENGTH element lookup table as array
 * (maps scalar intensity to a rgb color plus alpha, with each value from 0-255)
 * @property {Array.<ControlPoint>} controlPoints
 */
export class Lut {
  public lut: Uint8Array;
  public controlPoints: ControlPoint[];

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
  createFromMinMax(b: number, e: number): Lut {
    if (e < b) {
      // swap
      const tmp = e;
      e = b;
      b = tmp;
    }
    const lut = new Uint8Array(LUT_ARRAY_LENGTH);
    for (let x = 0; x < lut.length / 4; ++x) {
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
          const a = (x - b) / (e - b);
          lut[x * 4 + 3] = lerp(0, 255, a);
        }
      }
    }

    // Edge case: b and e are both out of bounds
    if (b < 0 && e < 0) {
      this.lut = lut;
      this.controlPoints = [
        { x: 0, opacity: 1, color: [255, 255, 255] },
        { x: 255, opacity: 1, color: [255, 255, 255] },
      ];
      return this;
    }
    if (b >= 255 && e >= 255) {
      this.lut = lut;
      this.controlPoints = [
        { x: 0, opacity: 0, color: [255, 255, 255] },
        { x: 255, opacity: 0, color: [255, 255, 255] },
      ];
      return this;
    }

    // Generate 2 to 4 control points for a minMax LUT, from left to right
    const controlPoints: ControlPoint[] = [];

    // Add starting point at x = 0
    let startVal = 0;
    if (b < 0) {
      startVal = -b / (e - b);
    }
    controlPoints.push({ x: 0, opacity: startVal, color: [255, 255, 255] });

    // If b > 0, add another point at (b, 0)
    if (b > 0) {
      controlPoints.push({ x: b, opacity: 0, color: [255, 255, 255] });
    }

    // If e < 255, Add another point at (e, 1)
    if (e < 255) {
      if (e === b) {
        // Use b + 0.5 as x value instead of e to create a near-vertical ramp
        controlPoints.push({ x: b + 0.5, opacity: 1, color: [255, 255, 255] });
      } else {
        controlPoints.push({ x: e, opacity: 1, color: [255, 255, 255] });
      }
    }

    // Add ending point at x = 255
    let endVal = 1;
    if (e > 255) {
      endVal = (255 - b) / (e - b);
    }
    controlPoints.push({ x: 255, opacity: endVal, color: [255, 255, 255] });

    this.lut = lut;
    this.controlPoints = controlPoints;
    return this;
  }

  // basically, the identity LUT with respect to opacity
  createFullRange(): Lut {
    const lut = new Uint8Array(LUT_ARRAY_LENGTH);

    // simple linear mapping for actual range
    for (let x = 0; x < lut.length / 4; ++x) {
      lut[x * 4 + 0] = 255;
      lut[x * 4 + 1] = 255;
      lut[x * 4 + 2] = 255;
      lut[x * 4 + 3] = x;
    }

    this.lut = lut;
    this.controlPoints = [
      { x: 0, opacity: 0, color: [255, 255, 255] },
      { x: 255, opacity: 1, color: [255, 255, 255] },
    ];
    return this;
  }

  /**
   * Generate a Window/level lookup table
   * @return {Lut}
   * @param {number} wnd in 0..1 range
   * @param {number} lvl in 0..1 range
   */
  createFromWindowLevel(wnd: number, lvl: number): Lut {
    // simple linear mapping for actual range
    const b = lvl - wnd * 0.5;
    const e = lvl + wnd * 0.5;
    return this.createFromMinMax(b * 255, e * 255);
  }

  // @param {Object[]} controlPoints - array of {x:number 0..255, opacity:number 0..1, color:array of 3 numbers 0..255}
  // @return {Uint8Array} array of length 256*4 representing the rgba values of the gradient
  createFromControlPoints(controlPoints: ControlPoint[]): Lut {
    const lut = new Uint8Array(LUT_ARRAY_LENGTH).fill(0);

    if (controlPoints.length === 0) {
      this.lut = lut;
      this.controlPoints = controlPoints;
      return this;
    }

    // ensure they are sorted in ascending order of x
    controlPoints.sort((a, b) => a.x - b.x);

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
      this.lut = lut;
      this.controlPoints = controlPoints;
      return this;
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
    this.lut = lut;
    this.controlPoints = controlPoints;
    return this;
  }

  /**
   * Generate an "equalized" lookup table
   * @return {Lut}
   */
  createFromEqHistogram(histogram: Histogram): Lut {
    const map: number[] = [];
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
      const lut = new Uint8Array(LUT_ARRAY_LENGTH);

      // compute lut and track control points for the piecewise linear sections
      const lutControlPoints: ControlPoint[] = [{ x: 0, opacity: 0, color: [255, 255, 255] }];
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
        opacity = clamp(Math.round(255 * (map[i] - map[0])), 0, 255);
        lut[i * 4 + 3] = opacity;

        slope = opacity - lastOpacity;
        // if map[i]-map[i-1] is the same as map[i+1]-map[i] then we are in a linear segment and do not need a new control point
        if (slope != lastSlope) {
          lutControlPoints.push({ x: i - 1, opacity: lastOpacity / 255.0, color: [255, 255, 255] });
          lastSlope = slope;
        }
      }

      lutControlPoints.push({ x: 255, opacity: 1, color: [255, 255, 255] });

      this.lut = lut;
      this.controlPoints = lutControlPoints;
      return this;
    } else {
      // just reset to whole range in this case...?
      return this.createFullRange();
    }
  }

  /**
   * Generate a lookup table with a different color per intensity value.
   * This translates to a unique color per histogram bin with more than zero pixels.
   * @return {Lut}
   */
  createLabelColors(histogram: Histogram): Lut {
    const lut = new Uint8Array(LUT_ARRAY_LENGTH).fill(0);
    const controlPoints: ControlPoint[] = [];
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
    for (let i = 1; i < histogram.getNumBins(); ++i) {
      if (histogram.getBin(i) > 0) {
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

    this.lut = lut;
    this.controlPoints = controlPoints;
    return this;
  }

  // since this is not a "create" function, it doesn't need to return the object.
  remapDomains(oldMin: number, oldMax: number, newMin: number, newMax: number) {
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
export function remapLut(lut: Uint8Array, oldMin: number, oldMax: number, newMin: number, newMax: number): Uint8Array {
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

export function remapControlPoints(
  controlPoints: ControlPoint[],
  oldMin: number,
  oldMax: number,
  newMin: number,
  newMax: number
): ControlPoint[] {
  const newControlPoints: ControlPoint[] = [];

  // assume control point x domain 0-255 is mapped to oldMin-oldMax

  // remap all cp x values.
  // interpolate all new colors and opacities
  // then see if we need to clip?
  for (let i = 0; i < controlPoints.length; ++i) {
    const cp = controlPoints[i];
    const iOld = remapDomainForCP(cp.x, 0, LUT_ENTRIES - 1, oldMin, oldMax, newMin, newMax);
    const newCP: ControlPoint = {
      x: iOld,
      opacity: cp.opacity,
      color: [cp.color[0], cp.color[1], cp.color[2]],
    };
    newControlPoints.push(newCP);
  }
  // now fix up any control points that are out of bounds?
  // For a CP less than 0, shift it to 0 and interpolate the values according to the slope
  // For a CP greater than 255, shift it to 255 and interpolate the values according to the slope
  // All others out of this range can then be dropped.
  // We will look above and below each cp to see if it's on a boundary.
  const resultControlPoints: ControlPoint[] = [];

  for (let i = 0; i < newControlPoints.length; ++i) {
    const cp = newControlPoints[i];
    const cpPrev = i > 0 ? newControlPoints[i - 1] : cp;
    const cpNext = i < newControlPoints.length - 1 ? newControlPoints[i + 1] : cp;

    if (cp.x < 0 && cpNext.x > 0) {
      // interpolate
      const pct = (0 - cp.x) / (cpNext.x - cp.x);
      cp.opacity = lerp(cp.opacity, cpNext.opacity, pct);
      cp.color[0] = lerp(cp.color[0], cpNext.color[0], pct);
      cp.color[1] = lerp(cp.color[1], cpNext.color[1], pct);
      cp.color[2] = lerp(cp.color[2], cpNext.color[2], pct);
      // shift cp to 0
      cp.x = 0;
    } else if (cp.x > 255 && cpPrev.x < 255) {
      // interpolate
      const pct = (cp.x - 255) / (cp.x - cpPrev.x);
      cp.opacity = lerp(cpPrev.opacity, cp.opacity, pct);
      cp.color[0] = lerp(cpPrev.color[0], cp.color[0], pct);
      cp.color[1] = lerp(cpPrev.color[1], cp.color[1], pct);
      cp.color[2] = lerp(cpPrev.color[2], cp.color[2], pct);
      // shift cp to 255
      cp.x = 255;
    }
    if (cp.x >= 0 && cp.x <= 255) {
      resultControlPoints.push(cp);
    }
  }

  // lastly, add a point for start and end if needed.
  if (resultControlPoints[0].x !== 0) {
    // if the first 2 points have same opacity and color, then just shift first pt to 0.
    if (
      resultControlPoints.length > 1 &&
      resultControlPoints[0].opacity === resultControlPoints[1].opacity &&
      resultControlPoints[0].color[0] === resultControlPoints[1].color[0] &&
      resultControlPoints[0].color[1] === resultControlPoints[1].color[1] &&
      resultControlPoints[0].color[2] === resultControlPoints[1].color[2]
    ) {
      resultControlPoints[0].x = 0;
    } else {
      // otherwise, add a point at 0.
      resultControlPoints.unshift({
        x: 0,
        opacity: resultControlPoints[0].opacity,
        color: resultControlPoints[0].color,
      });
    }
  }
  if (resultControlPoints[resultControlPoints.length - 1].x !== 255) {
    // if the last 2 points have same opacity and color, then just shift last pt to 255.
    if (
      resultControlPoints.length > 1 &&
      resultControlPoints[resultControlPoints.length - 1].opacity ===
        resultControlPoints[resultControlPoints.length - 2].opacity &&
      resultControlPoints[resultControlPoints.length - 1].color[0] ===
        resultControlPoints[resultControlPoints.length - 2].color[0] &&
      resultControlPoints[resultControlPoints.length - 1].color[1] ===
        resultControlPoints[resultControlPoints.length - 2].color[1] &&
      resultControlPoints[resultControlPoints.length - 1].color[2] ===
        resultControlPoints[resultControlPoints.length - 2].color[2]
    ) {
      resultControlPoints[resultControlPoints.length - 1].x = 255;
    } else {
      // otherwise, add a point at 255.
      resultControlPoints.push({
        x: 255,
        opacity: resultControlPoints[resultControlPoints.length - 1].opacity,
        color: resultControlPoints[resultControlPoints.length - 1].color,
      });
    }
  }
  return resultControlPoints;
}

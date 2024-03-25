import type { TypedArray, NumberType } from "./types.js";

const NBINS = 256;

function calculateHistogramSimplified(arr, numBins = 0): Uint32Array {
  // calculate min and max of arr
  let min = arr[0];
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < min) {
      min = arr[i];
    } else if (arr[i] > max) {
      max = arr[i];
    }
  }
  const dataCopy = arr;

  const bins = new Uint32Array(numBins ? numBins : 0).fill(0);

  const binSize = (max - min) / numBins === 0 ? 1 : (max - min) / numBins;
  for (let i = 0; i < dataCopy.length; i++) {
    const item = dataCopy[i];
    let binIndex = Math.floor((item - min) / binSize);
    // for values that lie exactly on last bin we need to subtract one
    if (binIndex === numBins) {
      binIndex--;
    }
    bins[binIndex]++;
  }

  return bins;
}

/**
 * Builds a histogram with 256 bins from a data array. Assume data is 8 bit single channel grayscale.
 * @class
 * @param {Array.<number>} data
 */
export default class Histogram {
  // no more than 2^32 pixels of any one intensity in the data!?!?!
  private bins: Uint32Array;
  private dataMinBin: number;
  private dataMaxBin: number;
  private pixelCount: number;
  public maxBin: number;

  constructor(data: TypedArray<NumberType>) {
    this.dataMinBin = 0;
    this.dataMaxBin = 0;
    this.maxBin = 0;

    // build up the histogram
    this.bins = calculateHistogramSimplified(data, NBINS);
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

  /**
   * Return the min data value
   * @return {number}
   */
  getMin(): number {
    return this.dataMinBin;
  }

  /**
   * Return the max data value
   * @return {number}
   */
  getMax(): number {
    return this.dataMaxBin;
  }

  getNumBins(): number {
    return this.bins.length;
  }
  getBin(i: number): number {
    return this.bins[i];
  }

  /**
   * Find the bin that contains the percentage of pixels below it
   * @return {number}
   * @param {number} pct
   */
  findBinOfPercentile(pct: number): number {
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

  // Generate a 10% / 90% lookup table
  findBestFitBins(): [number, number] {
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

  // Generate a lookup table attempting to replicate ImageJ's "Auto" button
  findAutoIJBins(): [number, number] {
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

  // Generate a lookup table using a percentile of the most commonly occurring value
  findAutoMinMax(): [number, number] {
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
}

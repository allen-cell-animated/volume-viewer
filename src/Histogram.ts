import type { TypedArray, NumberType } from "./types.js";

const NBINS = 256;

type HistogramData = {
  bins: Uint32Array;
  min: number;
  max: number;
  binSize: number;
};

/**
 * Builds a histogram with 256 bins from a data array. Assume data is 8 bit single channel grayscale.
 * @class
 * @param {Array.<number>} data
 */
export default class Histogram {
  // no more than 2^32 pixels of any one intensity in the data!?!?!
  private bins: Uint32Array;
  private min: number;
  private max: number;
  private binSize: number;
  private dataMinBin: number;
  private dataMaxBin: number;
  private pixelCount: number;
  public maxBin: number;

  constructor(data: TypedArray<NumberType>) {
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
  public static findBin(dataValue: number, dataMin: number, binSize: number, numBins: number): number {
    let binIndex = Math.floor((dataValue - dataMin) / binSize);
    // for values that lie exactly on last bin we need to subtract one
    if (binIndex === numBins) {
      binIndex--;
    }
    return binIndex;
  }

  // return the bin index of the given data value
  public findBinOfValue(value: number): number {
    return Histogram.findBin(value, this.min, this.binSize, NBINS);
  }

  getDataMin(): number {
    return this.min;
  }

  getDataMax(): number {
    return this.max;
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

  getBinRange(i: number): [number, number] {
    return [this.min + i * this.binSize, this.min + (i + 1) * this.binSize];
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

  // Find bins at 10th / 90th percentile
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

  // Find min and max bins attempting to replicate ImageJ's "Auto" button
  findAutoIJBins(): [number, number] {
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

  private static calculateHistogram(arr: TypedArray<NumberType>, numBins = 1): HistogramData {
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

    return { bins, min, max, binSize };
  }
}

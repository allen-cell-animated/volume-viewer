import Histogram from "./Histogram";
import { LUT_ARRAY_LENGTH } from "./Histogram";

// Data and processing for a single channel
export default class Channel {
  constructor(name) {
    this.loaded = false;
    this.imgData = null;
    this.name = name;
    this.histogram = new Histogram([]);
    // intensity remapping lookup table
    this.lut = new Uint8Array(LUT_ARRAY_LENGTH).fill(0);
    // per-intensity color labeling (disabled initially)
    this.colorPalette = new Uint8Array(LUT_ARRAY_LENGTH).fill(0);
    // store in 0..1 range. 1 means fully colorPalette, 0 means fully lut.
    this.colorPaletteAlpha = 0.0;
  }

  combineLuts() {
    const ret = new Uint8Array(LUT_ARRAY_LENGTH);
    for (let i = 0; i < LUT_ARRAY_LENGTH / 4; ++i) {
      ret[i * 4 + 0] =
        this.colorPalette[i * 4 + 0] * this.colorPaletteAlpha + this.lut[i * 4 + 0] * (1.0 - this.colorPaletteAlpha);
      ret[i * 4 + 1] =
        this.colorPalette[i * 4 + 1] * this.colorPaletteAlpha + this.lut[i * 4 + 1] * (1.0 - this.colorPaletteAlpha);
      ret[i * 4 + 2] =
        this.colorPalette[i * 4 + 2] * this.colorPaletteAlpha + this.lut[i * 4 + 2] * (1.0 - this.colorPaletteAlpha);
      ret[i * 4 + 3] =
        this.colorPalette[i * 4 + 3] * this.colorPaletteAlpha + this.lut[i * 4 + 3] * (1.0 - this.colorPaletteAlpha);
    }
    return ret;
  }
  getHistogram() {
    return this.histogram;
  }

  getIntensity(x, y, z) {
    return this.volumeData[x + y * this.dims[0] + z * (this.dims[0] * this.dims[1])];
  }

  // how to index into tiled texture atlas
  getIntensityFromAtlas(x, y, z) {
    const num_xtiles = this.imgData.width / this.dims[0];
    const tilex = z % num_xtiles;
    const tiley = Math.floor(z / num_xtiles);
    const offset = tilex * this.dims[0] + x + (tiley * this.dims[1] + y) * this.imgData.width;
    return this.imgData.data[offset];
  }

  // give the channel fresh data and initialize from that data
  // data is formatted as a texture atlas where each tile is a z slice of the volume
  setBits(bitsArray, w, h) {
    this.imgData = { data: bitsArray, width: w, height: h };
    this.loaded = true;
    this.histogram = new Histogram(bitsArray);

    this.lutGenerator_auto2();
  }

  // let's rearrange this.imgData.data into a 3d array.
  // it is assumed to be coming in as a flat Uint8Array of size x*y*z
  // with x*y*z layout (first row of first plane is the first data in the layout,
  // then second row of first plane, etc)
  unpackVolumeFromAtlas(x, y, z) {
    var volimgdata = this.imgData.data;

    this.dims = [x, y, z];
    this.volumeData = new Uint8Array(x * y * z);

    var num_xtiles = this.imgData.width / x;
    var atlasrow = this.imgData.width;
    var tilex = 0,
      tiley = 0,
      tileoffset = 0,
      tilerowoffset = 0;
    for (var i = 0; i < z; ++i) {
      // tile offset
      tilex = i % num_xtiles;
      tiley = Math.floor(i / num_xtiles);
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
  setFromVolumeData(bitsArray, vx, vy, vz, ax, ay) {
    this.dims = [vx, vy, vz];
    this.volumeData = bitsArray;
    this.packToAtlas(vx, vy, vz, ax, ay);
    this.loaded = true;
    this.histogram = new Histogram(this.volumeData);

    this.lutGenerator_auto2();
  }

  // given this.volumeData, let's unpack it into a flat textureatlas and fill up this.imgData.
  packToAtlas(vx, vy, vz, ax, ay) {
    // big assumptions:
    // atlassize is a perfect multiple of volumesize in both x and y
    // ax % vx == 0
    // ay % vy == 0
    // and num slices <= num possible slices in atlas.
    // (ax/vx) * (ay/vy) >= vz
    if (ax % vx !== 0 || ay % vy !== 0 || (ax / vx) * (ay / vy) < vz) {
      console.log("ERROR - atlas and volume dims are inconsistent");
      console.log(ax, ay, vx, vy, vz);
    }

    this.imgData = {
      width: ax,
      height: ay,
      data: new Uint8Array(ax * ay),
    };
    this.imgData.data.fill(0);

    // deposit slices one by one into the imgData.data from volData.
    var volimgdata = this.imgData.data;

    var x = vx,
      y = vy,
      z = vz;

    var num_xtiles = this.imgData.width / x;
    var atlasrow = this.imgData.width;
    var tilex = 0,
      tiley = 0,
      tileoffset = 0,
      tilerowoffset = 0;
    for (var i = 0; i < z; ++i) {
      // tile offset
      tilex = i % num_xtiles;
      tiley = Math.floor(i / num_xtiles);
      tileoffset = tilex * x + tiley * y * atlasrow;
      for (var j = 0; j < y; ++j) {
        tilerowoffset = j * atlasrow;
        for (var k = 0; k < x; ++k) {
          volimgdata[tileoffset + tilerowoffset + k] = this.volumeData[i * (x * y) + j * x + k];
        }
      }
    }
  }

  // lut should be an uint8array of 256*4 elements (256 rgba8 values)
  setLut(lut) {
    this.lut = lut;
  }

  lutGenerator_windowLevel(wnd, lvl) {
    if (!this.loaded) {
      return;
    }
    const lut = this.histogram.lutGenerator_windowLevel(wnd, lvl);
    this.setLut(lut.lut);
  }

  lutGenerator_fullRange() {
    if (!this.loaded) {
      return;
    }
    const lut = this.histogram.lutGenerator_fullRange();
    this.setLut(lut.lut);
  }

  lutGenerator_dataRange() {
    if (!this.loaded) {
      return;
    }
    const lut = this.histogram.lutGenerator_dataRange();
    this.setLut(lut.lut);
  }

  lutGenerator_bestFit() {
    if (!this.loaded) {
      return;
    }
    const lut = this.histogram.lutGenerator_bestFit();
    this.setLut(lut.lut);
  }

  // attempt to redo imagej's Auto
  lutGenerator_auto2() {
    if (!this.loaded) {
      return;
    }
    const lut = this.histogram.lutGenerator_auto2();
    this.setLut(lut.lut);
  }

  lutGenerator_auto() {
    if (!this.loaded) {
      return;
    }
    const lut = this.histogram.lutGenerator_auto();
    this.setLut(lut.lut);
  }

  lutGenerator_equalize() {
    if (!this.loaded) {
      return;
    }
    const lut = this.histogram.lutGenerator_equalize();
    this.setLut(lut.lut);
  }

  lutGenerator_percentiles(lo, hi) {
    if (!this.loaded) {
      return;
    }
    const lut = this.histogram.lutGenerator_percentiles(lo, hi);
    this.setLut(lut.lut);
  }
}

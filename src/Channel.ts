import { DataTexture, RedFormat, UnsignedByteType, RGBAFormat, LinearFilter, NearestFilter } from "three";
import Histogram from "./Histogram.js";
import { Lut, LUT_ARRAY_LENGTH } from "./Lut.js";

interface ChannelImageData {
  /** Returns the one-dimensional array containing the data in RGBA order, as integers in the range 0 to 255. */
  readonly data: Uint8ClampedArray;
  /** Returns the actual dimensions of the data in the ImageData object, in pixels. */
  readonly height: number;
  /** Returns the actual dimensions of the data in the ImageData object, in pixels. */
  readonly width: number;
}

// Data and processing for a single channel
export default class Channel {
  public loaded: boolean;
  public imgData: ChannelImageData;
  public volumeData: Uint8Array;
  public name: string;
  public histogram: Histogram;
  public lut: Lut;
  public colorPalette: Uint8Array;
  public colorPaletteAlpha: number;
  public dims: [number, number, number];
  public dataTexture: DataTexture;
  public lutTexture: DataTexture;
  public rawMin: number;
  public rawMax: number;

  constructor(name: string) {
    this.loaded = false;
    this.imgData = { data: new Uint8ClampedArray(), width: 0, height: 0 };
    this.rawMin = 0;
    this.rawMax = 0;

    // on gpu
    this.dataTexture = new DataTexture(new Uint8Array(), 0, 0);
    this.lutTexture = new DataTexture(new Uint8Array(LUT_ARRAY_LENGTH), 256, 1, RGBAFormat, UnsignedByteType);
    this.lutTexture.minFilter = this.lutTexture.magFilter = LinearFilter;
    this.lutTexture.generateMipmaps = false;

    this.volumeData = new Uint8Array();
    this.name = name;
    this.histogram = new Histogram(new Uint8Array());
    this.dims = [0, 0, 0];

    // intensity remapping lookup table
    this.lut = new Lut().createFromMinMax(0, 255);

    // per-intensity color labeling (disabled initially)
    this.colorPalette = new Uint8Array(LUT_ARRAY_LENGTH).fill(0);
    // store in 0..1 range. 1 means fully colorPalette, 0 means fully lut.
    this.colorPaletteAlpha = 0.0;
  }

  // rgbColor is [0..255, 0..255, 0..255]
  public combineLuts(rgbColor: [number, number, number] | number, out?: Uint8Array): Uint8Array {
    const ret = out ? out : new Uint8Array(LUT_ARRAY_LENGTH);
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
      for (let i = 0; i < LUT_ARRAY_LENGTH / 4; ++i) {
        ret[i * 4 + 0] *= rgb[0];
        ret[i * 4 + 1] *= rgb[1];
        ret[i * 4 + 2] *= rgb[2];
      }
    } else {
      for (let i = 0; i < LUT_ARRAY_LENGTH / 4; ++i) {
        ret[i * 4 + 0] =
          this.colorPalette[i * 4 + 0] * this.colorPaletteAlpha +
          this.lut.lut[i * 4 + 0] * (1.0 - this.colorPaletteAlpha) * rgb[0];
        ret[i * 4 + 1] =
          this.colorPalette[i * 4 + 1] * this.colorPaletteAlpha +
          this.lut.lut[i * 4 + 1] * (1.0 - this.colorPaletteAlpha) * rgb[1];
        ret[i * 4 + 2] =
          this.colorPalette[i * 4 + 2] * this.colorPaletteAlpha +
          this.lut.lut[i * 4 + 2] * (1.0 - this.colorPaletteAlpha) * rgb[2];
        ret[i * 4 + 3] =
          this.colorPalette[i * 4 + 3] * this.colorPaletteAlpha +
          this.lut.lut[i * 4 + 3] * (1.0 - this.colorPaletteAlpha);
      }
    }

    this.lutTexture.image.data.set(ret);
    this.lutTexture.needsUpdate = true;

    return ret;
  }

  public setRawDataRange(min: number, max: number): void {
    // remap the lut which was based on rawMin and rawMax to new min and max
    // If either of the min/max ranges are both zero, then we have undefined behavior and should
    // not remap the lut.  This situation can happen at first load, for example,
    // when one channel has arrived but others haven't.
    if (!(this.rawMin === 0 && this.rawMax === 0) && !(min === 0 && max === 0)) {
      this.lut.remapDomains(this.rawMin, this.rawMax, min, max);
    }
    this.rawMin = min;
    this.rawMax = max;
  }

  public getHistogram(): Histogram {
    return this.histogram;
  }

  public getIntensity(x: number, y: number, z: number): number {
    return this.volumeData[x + y * this.dims[0] + z * (this.dims[0] * this.dims[1])];
  }

  // how to index into tiled texture atlas
  public getIntensityFromAtlas(x: number, y: number, z: number): number {
    const numXtiles = this.imgData.width / this.dims[0];
    const tilex = z % numXtiles;
    const tiley = Math.floor(z / numXtiles);
    const offset = tilex * this.dims[0] + x + (tiley * this.dims[1] + y) * this.imgData.width;
    return this.imgData.data[offset];
  }

  private rebuildDataTexture(data: Uint8ClampedArray, w: number, h: number): void {
    if (this.dataTexture) {
      this.dataTexture.dispose();
    }
    this.dataTexture = new DataTexture(data, w, h);
    this.dataTexture.format = RedFormat;
    this.dataTexture.type = UnsignedByteType;
    this.dataTexture.magFilter = NearestFilter;
    this.dataTexture.minFilter = NearestFilter;
    this.dataTexture.generateMipmaps = false;
    this.dataTexture.needsUpdate = true;
  }

  // give the channel fresh data and initialize from that data
  // data is formatted as a texture atlas where each tile is a z slice of the volume
  public setBits(bitsArray: Uint8Array, w: number, h: number): void {
    this.imgData = { data: new Uint8ClampedArray(bitsArray.buffer), width: w, height: h };

    this.rebuildDataTexture(this.imgData.data, w, h);

    this.loaded = true;
    this.histogram = new Histogram(bitsArray);

    const [hmin, hmax] = this.histogram.findAutoIJBins();
    const lut = new Lut().createFromMinMax(hmin, hmax);
    this.setLut(lut);
  }

  // let's rearrange this.imgData.data into a 3d array.
  // it is assumed to be coming in as a flat Uint8Array of size x*y*z
  // with x*y*z layout (first row of first plane is the first data in the layout,
  // then second row of first plane, etc)
  public unpackVolumeFromAtlas(x: number, y: number, z: number): void {
    const volimgdata = this.imgData.data;

    this.dims = [x, y, z];
    this.volumeData = new Uint8Array(x * y * z);

    const numXtiles = this.imgData.width / x;
    const atlasrow = this.imgData.width;
    let tilex = 0,
      tiley = 0,
      tileoffset = 0,
      tilerowoffset = 0;
    for (let i = 0; i < z; ++i) {
      // tile offset
      tilex = i % numXtiles;
      tiley = Math.floor(i / numXtiles);
      tileoffset = tilex * x + tiley * y * atlasrow;
      for (let j = 0; j < y; ++j) {
        tilerowoffset = j * atlasrow;
        for (let k = 0; k < x; ++k) {
          this.volumeData[i * (x * y) + j * x + k] = volimgdata[tileoffset + tilerowoffset + k];
        }
      }
    }
  }

  // give the channel fresh volume data and initialize from that data
  public setFromVolumeData(
    bitsArray: Uint8Array,
    vx: number,
    vy: number,
    vz: number,
    ax: number,
    ay: number,
    rawMin = 0,
    rawMax = 255
  ): void {
    this.dims = [vx, vy, vz];
    this.volumeData = bitsArray;
    // TODO FIXME performance hit for shuffling the data and storing 2 versions of it (could do this in worker at least?)
    this.packToAtlas(vx, vy, vz, ax, ay);
    this.loaded = true;
    // update from current histogram?
    this.setRawDataRange(rawMin, rawMax);
    this.histogram = new Histogram(this.volumeData);
  }

  // given this.volumeData, let's unpack it into a flat textureatlas and fill up this.imgData.
  private packToAtlas(vx: number, vy: number, vz: number, ax: number, ay: number): void {
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
      data: new Uint8ClampedArray(ax * ay),
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
      tilerowoffset = 0;
    for (let i = 0; i < z; ++i) {
      // tile offset
      tilex = i % numXtiles;
      tiley = Math.floor(i / numXtiles);
      tileoffset = tilex * x + tiley * y * atlasrow;
      for (let j = 0; j < y; ++j) {
        tilerowoffset = j * atlasrow;
        for (let k = 0; k < x; ++k) {
          volimgdata[tileoffset + tilerowoffset + k] = this.volumeData[i * (x * y) + j * x + k];
        }
      }
    }

    this.rebuildDataTexture(this.imgData.data, ax, ay);
  }

  public setLut(lut: Lut): void {
    this.lut = lut;
  }

  // palette should be an uint8array of 256*4 elements (256 rgba8 values)
  public setColorPalette(palette: Uint8Array): void {
    this.colorPalette = palette;
  }

  public setColorPaletteAlpha(alpha: number): void {
    this.colorPaletteAlpha = alpha;
  }
}

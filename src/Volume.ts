import { Vector2, Vector3 } from "three";

import Channel from "./Channel.js";
import Histogram from "./Histogram.js";
import { Lut } from "./Lut.js";
import { getColorByChannelIndex } from "./constants/colors.js";
import { type IVolumeLoader, LoadSpec, type PerChannelCallback, VolumeDims } from "./loaders/IVolumeLoader.js";
import { MAX_ATLAS_EDGE, pickLevelToLoadUnscaled } from "./loaders/VolumeLoaderUtils.js";
import type { NumberType, TypedArray } from "./types.js";

export type ImageInfo = Readonly<{
  name: string;

  /** XYZ size of the *original* (not downsampled) volume, in pixels */
  originalSize: Vector3;
  /**
   * XY dimensions of the texture atlas used by `RayMarchedAtlasVolume` and `Atlas2DSlice`, in number of z-slice
   * tiles (not pixels). Chosen by the loader to lay out the 3D volume in the squarest possible 2D texture atlas.
   */
  atlasTileDims: Vector2;
  /** Size of the volume, in pixels */
  volumeSize: Vector3;
  /** Size of the currently loaded subregion, in pixels */
  subregionSize: Vector3;
  /** Offset of the loaded subregion into the total volume, in pixels */
  subregionOffset: Vector3;
  /** Size of a single *original* (not downsampled) pixel, in spatial units */
  physicalPixelSize: Vector3;
  /** Symbol of physical spatial unit used by `pixelSize` */
  spatialUnit: string;

  /** Number of channels in the image */
  numChannels: number;
  /** The names of each channel */
  channelNames: string[];
  /** Optional overrides to default channel colors, in 0-255 range */
  channelColors?: [number, number, number][];

  /** Number of timesteps in the time series, or 1 if the image is not a time series */
  times: number;
  /** Size of each timestep in temporal units */
  timeScale: number;
  /**
   * Symbol of temporal unit used by `timeScale`, e.g. "hr".
   *
   * If units match one of the following, the viewer will automatically format
   * timestamps to a d:hh:mm:ss.sss format, truncated as an integer of the unit specified.
   * See https://ngff.openmicroscopy.org/latest/index.html#axes-md for a list of valid time units.
   * - "ms", "millisecond" for milliseconds: `d:hh:mm:ss.sss`
   * - "s", "sec", "second", or "seconds" for seconds: `d:hh:mm:ss`
   * - "m", "min", "minute", or "minutes" for minutes: `d:hh:mm`
   * - "h", "hr", "hour", or "hours" for hours: `d:hh`
   * - "d", "day", or "days" for days: `d`
   *
   * The maximum timestamp value is used to determine the maximum unit shown.
   * For example, if the time unit is in seconds, and the maximum time is 90 seconds, the timestamp
   * will be formatted as "{m:ss} (m:s)", and the day and hour segments will be omitted.
   */
  timeUnit: string;

  /** Number of scale levels available for this volume */
  numMultiscaleLevels: number;
  /** Dimensions of each scale level, at original size, from the first data source */
  // TODO THIS DATA IS SOMEWHAT REDUNDANT WITH SOME OF THE OTHER FIELDS IN HERE
  multiscaleLevelDims: VolumeDims[];
  /** The scale level from which this image was loaded, between `0` and `numMultiscaleLevels-1` */
  multiscaleLevel: number;

  transform: {
    /** Translation of the volume from the center of space, in volume voxels */
    translation: Vector3;
    /** Rotation of the volume in Euler angles, applied in XYZ order */
    rotation: Vector3;
  };

  /** Arbitrary additional metadata not captured by other `ImageInfo` properties */
  userData?: Record<string, unknown>;
}>;

export const getDefaultImageInfo = (): ImageInfo => ({
  name: "",
  originalSize: new Vector3(1, 1, 1),
  atlasTileDims: new Vector2(1, 1),
  volumeSize: new Vector3(1, 1, 1),
  subregionSize: new Vector3(1, 1, 1),
  subregionOffset: new Vector3(0, 0, 0),
  physicalPixelSize: new Vector3(1, 1, 1),
  spatialUnit: "",
  numChannels: 0,
  channelNames: [],
  channelColors: [],
  times: 1,
  timeScale: 1,
  timeUnit: "",
  numMultiscaleLevels: 1,
  multiscaleLevel: 0,
  multiscaleLevelDims: [
    {
      shape: [1, 1, 1, 1, 1],
      spacing: [1, 1, 1, 1, 1],
      spaceUnit: "",
      timeUnit: "",
      dataType: "uint8",
    },
  ],
  transform: {
    translation: new Vector3(0, 0, 0),
    rotation: new Vector3(0, 0, 0),
  },
});

interface VolumeDataObserver {
  onVolumeData: (vol: Volume, batch: number[]) => void;
  onVolumeChannelAdded: (vol: Volume, idx: number) => void;
  onVolumeLoadError: (vol: Volume, error: unknown) => void;
}

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
export default class Volume {
  public imageInfo: ImageInfo;
  public loadSpec: Required<LoadSpec>;
  public loader?: IVolumeLoader;
  // `LoadSpec` representing the minimum data required to display what's in the viewer (subregion, channels, etc.).
  // Used to intelligently issue load requests whenever required by a state change. Modify with `updateRequiredData`.
  public loadSpecRequired: Required<LoadSpec>;
  public channelLoadCallback?: PerChannelCallback;
  public imageMetadata: Record<string, unknown>;
  public name: string;

  public channels: Channel[];
  public numChannels: number;
  public channelNames: string[];
  public channelColorsDefault: [number, number, number][];

  public physicalScale: number;
  public physicalPixelSize: Vector3;
  public physicalSize: Vector3;
  public normPhysicalSize: Vector3;
  public normRegionSize: Vector3;
  public normRegionOffset: Vector3;
  public physicalUnitSymbol: string;
  public tickMarkPhysicalLength: number;

  private volumeDataObservers: VolumeDataObserver[];
  private loaded: boolean;

  constructor(
    imageInfo: ImageInfo = getDefaultImageInfo(),
    loadSpec: LoadSpec = new LoadSpec(),
    loader?: IVolumeLoader
  ) {
    this.loaded = false;
    this.imageInfo = imageInfo;
    this.name = this.imageInfo.name;
    this.loadSpec = {
      // Fill in defaults for optional properties
      multiscaleLevel: 0,
      scaleLevelBias: 0,
      maxAtlasEdge: MAX_ATLAS_EDGE,
      channels: Array.from({ length: this.imageInfo.numChannels }, (_val, idx) => idx),
      ...loadSpec,
    };
    this.loadSpecRequired = {
      ...this.loadSpec,
      channels: this.loadSpec.channels.slice(),
      subregion: this.loadSpec.subregion.clone(),
    };
    this.loader = loader;
    // imageMetadata to be filled in by Volume Loaders
    this.imageMetadata = {};

    this.normRegionSize = new Vector3(1, 1, 1);
    this.normRegionOffset = new Vector3(0, 0, 0);
    this.physicalSize = new Vector3(1, 1, 1);
    this.physicalScale = 1;
    this.normPhysicalSize = new Vector3(1, 1, 1);
    this.physicalPixelSize = this.imageInfo.physicalPixelSize;
    this.tickMarkPhysicalLength = 1;
    this.setVoxelSize(this.physicalPixelSize);

    this.numChannels = this.imageInfo.numChannels;
    this.channelNames = this.imageInfo.channelNames.slice();
    this.channelColorsDefault = this.imageInfo.channelColors
      ? this.imageInfo.channelColors.slice()
      : this.channelNames.map((name, index) => getColorByChannelIndex(index));
    // fill in gaps
    if (this.channelColorsDefault.length < this.imageInfo.numChannels) {
      for (let i = this.channelColorsDefault.length - 1; i < this.imageInfo.numChannels; ++i) {
        this.channelColorsDefault[i] = getColorByChannelIndex(i);
      }
    }

    this.channels = [];
    for (let i = 0; i < this.imageInfo.numChannels; ++i) {
      const channel = new Channel(this.channelNames[i]);
      this.channels.push(channel);
      // TODO pass in channel constructor...
      channel.dims = this.imageInfo.subregionSize.toArray();
    }

    this.physicalUnitSymbol = this.imageInfo.spatialUnit;

    this.volumeDataObservers = [];
  }

  private setUnloaded() {
    this.loaded = false;
    this.channels.forEach((channel) => {
      channel.loaded = false;
    });
  }

  isLoaded(): boolean {
    return this.loaded;
  }

  updateDimensions() {
    const { volumeSize, subregionSize, subregionOffset } = this.imageInfo;

    this.setVoxelSize(this.physicalPixelSize);

    this.normRegionSize = subregionSize.clone().divide(volumeSize);
    this.normRegionOffset = subregionOffset.clone().divide(volumeSize);
  }

  /** Returns `true` iff differences between `loadSpec` and `loadSpecRequired` indicate new data *must* be loaded. */
  private mustLoadNewData(): boolean {
    return (
      this.loadSpec.useExplicitLevel !== this.loadSpecRequired.useExplicitLevel || // explicit vs automatic level changed
      this.loadSpec.time !== this.loadSpecRequired.time || // time point changed
      !this.loadSpec.subregion.containsBox(this.loadSpecRequired.subregion) || // new subregion not contained in old
      this.loadSpecRequired.channels.some((channel) => !this.loadSpec.channels.includes(channel)) // new channel(s)
    );
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
  private mayLoadNewScaleLevel(): boolean {
    return (
      !this.loadSpec.subregion.equals(this.loadSpecRequired.subregion) ||
      this.loadSpecRequired.maxAtlasEdge !== this.loadSpec.maxAtlasEdge ||
      this.loadSpecRequired.multiscaleLevel !== this.loadSpec.multiscaleLevel ||
      this.loadSpecRequired.scaleLevelBias !== this.loadSpec.scaleLevelBias
    );
  }

  /** Call on any state update that may require new data to be loaded (subregion, enabled channels, time, etc.) */
  async updateRequiredData(required: Partial<LoadSpec>, onChannelLoaded?: PerChannelCallback): Promise<void> {
    this.loadSpecRequired = { ...this.loadSpecRequired, ...required };
    let shouldReload = this.mustLoadNewData();

    // If we're not reloading due to required data changes, check if we should load a new scale level
    if (!shouldReload && this.mayLoadNewScaleLevel()) {
      // Loaders should cache loaded dimensions so that this call blocks no more than once per valid `LoadSpec`.
      const dims = await this.loadScaleLevelDims();
      if (dims) {
        const dimsZYX = dims.map(({ shape }): [number, number, number] => [shape[2], shape[3], shape[4]]);
        // Determine which scale level *would* be loaded, and see if it's different than what we have
        const levelToLoad = pickLevelToLoadUnscaled(this.loadSpecRequired, dimsZYX);
        shouldReload = this.imageInfo.multiscaleLevel !== levelToLoad;
      }
    }

    if (shouldReload) {
      this.loadNewData(onChannelLoaded);
    }
  }

  private async loadScaleLevelDims(): Promise<VolumeDims[] | undefined> {
    try {
      return await this.loader?.loadDims(this.loadSpecRequired);
    } catch (e) {
      this.volumeDataObservers.forEach((observer) => observer.onVolumeLoadError(this, e));
      return undefined;
    }
  }

  /**
   * Loads new data as specified in `this.loadSpecRequired`. Clones `loadSpecRequired` into `loadSpec` to indicate
   * that the data that *must* be loaded is now the data that *has* been loaded.
   */
  private async loadNewData(onChannelLoaded?: PerChannelCallback): Promise<void> {
    this.setUnloaded();
    this.loadSpec = {
      ...this.loadSpecRequired,
      subregion: this.loadSpecRequired.subregion.clone(),
    };

    try {
      await this.loader?.loadVolumeData(this, undefined, onChannelLoaded);
    } catch (e) {
      this.volumeDataObservers.forEach((observer) => observer.onVolumeLoadError(this, e));
      throw e;
    }
  }

  // we calculate the physical size of the volume (voxels*pixel_size)
  // and then normalize to the max physical dimension
  setVoxelSize(size: Vector3): void {
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

  setUnitSymbol(symbol: string): void {
    this.physicalUnitSymbol = symbol;
  }

  /** Computes the center of the volume subset */
  getContentCenter(): Vector3 {
    // center point: (normRegionSize / 2 + normRegionOffset - 0.5) * normPhysicalSize;
    return this.normRegionSize
      .clone()
      .divideScalar(2)
      .add(this.normRegionOffset)
      .subScalar(0.5)
      .multiply(this.normPhysicalSize);
  }

  cleanup(): void {
    // no op
  }

  getChannel(channelIndex: number): Channel {
    return this.channels[channelIndex];
  }

  onChannelLoaded(batch: number[]): void {
    // check to see if all channels are now loaded, and fire an event(?)
    if (this.loadSpec.channels.every((channelIndex) => this.channels[channelIndex].loaded)) {
      this.loaded = true;
    }
    batch.forEach((channelIndex) => this.channelLoadCallback?.(this, channelIndex));
    this.volumeDataObservers.forEach((observer) => observer.onVolumeData(this, batch));
  }

  /**
   * Assign volume data via a 2d array containing the z slices as tiles across it.  Assumes that the incoming data is consistent with the image's pre-existing imageInfo tile metadata.
   * @param {number} channelIndex
   * @param {Uint8Array} atlasdata
   * @param {number} atlaswidth
   * @param {number} atlasheight
   */
  setChannelDataFromAtlas(
    channelIndex: number,
    atlasdata: TypedArray<NumberType>,
    atlaswidth: number,
    atlasheight: number,
    range: [number, number],
    dtype: NumberType = "uint8"
  ): void {
    this.channels[channelIndex].setFromAtlas(
      atlasdata,
      atlaswidth,
      atlasheight,
      dtype,
      range[0],
      range[1],
      this.imageInfo.subregionSize
    );
    this.onChannelLoaded([channelIndex]);
  }

  // ASSUMES that this.channelData.options is already set and incoming data is consistent with it
  /**
   * Assign volume data as a 3d array ordered x,y,z. The xy size must be equal to tilewidth*tileheight from the imageInfo used to construct this Volume.  Assumes that the incoming data is consistent with the image's pre-existing imageInfo tile metadata.
   * @param {number} channelIndex
   * @param {Uint8Array} volumeData
   */
  setChannelDataFromVolume(
    channelIndex: number,
    volumeData: TypedArray<NumberType>,
    range: [number, number],
    dtype: NumberType = "uint8"
  ): void {
    const { subregionSize, atlasTileDims } = this.imageInfo;
    this.channels[channelIndex].setFromVolumeData(
      volumeData,
      subregionSize.x,
      subregionSize.y,
      subregionSize.z,
      atlasTileDims.x * subregionSize.x,
      atlasTileDims.y * subregionSize.y,
      range[0],
      range[1],
      dtype
    );
    this.onChannelLoaded([channelIndex]);
  }

  // TODO: decide if this should update imageInfo or not. For now, leave imageInfo alone as the "original" data
  /**
   * Add a new channel ready to receive data from one of the setChannelDataFrom* calls.
   * Name and color will be defaulted if not provided. For now, leave imageInfo alone as the "original" data
   * @param {string} name
   * @param {Array.<number>} color [r,g,b]
   */
  appendEmptyChannel(name: string, color?: [number, number, number]): number {
    const idx = this.imageInfo.numChannels;
    const chname = name || "channel_" + idx;
    const chcolor = color || getColorByChannelIndex(idx);
    this.numChannels += 1;
    this.channelNames.push(chname);
    this.channelColorsDefault.push(chcolor);

    this.channels.push(new Channel(chname));

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
  getIntensity(c: number, x: number, y: number, z: number): number {
    return this.channels[c].getIntensity(x, y, z);
  }

  /**
   * Get the 256-bin histogram for the given channel
   * @return {Histogram} the histogram
   * @param {number} c The channel index
   */
  getHistogram(c: number): Histogram {
    return this.channels[c].getHistogram();
  }

  /**
   * Set the lut for the given channel
   * @param {number} c The channel index
   * @param {Array.<number>} lut The lut as a 256 element array
   */
  setLut(c: number, lut: Lut): void {
    this.channels[c].setLut(lut);
  }

  /**
   * Set the color palette for the given channel
   * @param {number} c The channel index
   * @param {Array.<number>} palette The colors as a 256 element array * RGBA
   */
  setColorPalette(c: number, palette: Uint8Array): void {
    this.channels[c].setColorPalette(palette);
  }

  /**
   * Set the color palette alpha multiplier for the given channel.
   * This will blend between the ordinary color lut and this colorPalette lut.
   * @param {number} c The channel index
   * @param {number} alpha The alpha value as a number from 0 to 1
   */
  setColorPaletteAlpha(c: number, alpha: number): void {
    this.channels[c].setColorPaletteAlpha(alpha);
  }

  /**
   * Return the intrinsic rotation associated with this volume (radians)
   * @return {Array.<number>} the xyz Euler angles (radians)
   */
  getRotation(): [number, number, number] {
    // default axis order is XYZ
    return this.imageInfo.transform.rotation.toArray();
  }

  /**
   * Return the intrinsic translation (pivot center delta) associated with this volume, in normalized volume units
   * @return {Array.<number>} the xyz translation in normalized volume units
   */
  getTranslation(): [number, number, number] {
    return this.voxelsToWorldSpace(this.imageInfo.transform.translation.toArray());
  }

  /**
   * Return a translation in normalized volume units, given a translation in image voxels
   * @return {Array.<number>} the xyz translation in normalized volume units
   */
  voxelsToWorldSpace(xyz: [number, number, number]): [number, number, number] {
    // ASSUME: translation is in original image voxels.
    // account for pixel_size and normalized scaling in the threejs volume representation we're using
    const m = 1.0 / Math.max(this.physicalSize.x, Math.max(this.physicalSize.y, this.physicalSize.z));
    return new Vector3().fromArray(xyz).multiply(this.physicalPixelSize).multiplyScalar(m).toArray();
  }

  addVolumeDataObserver(o: VolumeDataObserver): void {
    this.volumeDataObservers.push(o);
  }

  removeVolumeDataObserver(o: VolumeDataObserver): void {
    if (o) {
      const i = this.volumeDataObservers.indexOf(o);
      if (i !== -1) {
        this.volumeDataObservers.splice(i, 1);
      }
    }
  }

  removeAllVolumeDataObservers(): void {
    this.volumeDataObservers = [];
  }
}

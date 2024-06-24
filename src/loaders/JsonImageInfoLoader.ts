import { Box3, Vector2, Vector3 } from "three";

import {
  ThreadableVolumeLoader,
  type LoadSpec,
  type RawChannelDataCallback,
  VolumeDims,
  type LoadedVolumeInfo,
} from "./IVolumeLoader.js";
import type { ImageInfo } from "../Volume.js";
import VolumeCache from "../VolumeCache.js";
import type { TypedArray, NumberType } from "../types.js";
import { DATARANGE_UINT8 } from "../types.js";

interface PackedChannelsImage {
  name: string;
  channels: number[];
}

/* eslint-disable @typescript-eslint/naming-convention */
type JsonImageInfo = {
  name: string;
  version?: string;
  images: PackedChannelsImage[];

  /** X size of the *original* (not downsampled) volume, in pixels */
  width: number;
  /** Y size of the *original* (not downsampled) volume, in pixels */
  height: number;
  /** Number of rows of z-slice tiles (not pixels) in the texture atlas */
  rows: number;
  /** Number of columns of z-slice tiles (not pixels) in the texture atlas */
  cols: number;
  /** Width of a single atlas tile in pixels */
  tile_width: number;
  /** Height of a single atlas tile in pixels */
  tile_height: number;
  /** Width of the texture atlas in pixels; equivalent to `tile_width * cols` */
  atlas_width: number;
  /** Height of the texture atlas in pixels; equivalent to `tile_height * rows` */
  atlas_height: number;
  /** Number of tiles in the texture atlas (or number of z-slices in the volume segment) */
  tiles: number;
  /** Physical x size of a single *original* (not downsampled) pixel */
  pixel_size_x: number;
  /** Physical y size of a single *original* (not downsampled) pixel */
  pixel_size_y: number;
  /** Physical z size of a single pixel */
  pixel_size_z: number;
  /** Symbol of physical unit used by `pixel_size_(x|y|z)` fields */
  pixel_size_unit?: string;

  channels: number;
  channel_names: string[];
  channel_colors?: [number, number, number][];

  times?: number;
  time_scale?: number;
  time_unit?: string;

  // TODO should be optional?
  transform: {
    translation: [number, number, number];
    rotation: [number, number, number];
  };
  userData?: Record<string, unknown>;
};
/* eslint-enable @typescript-eslint/naming-convention */

const convertImageInfo = (json: JsonImageInfo): ImageInfo => ({
  name: json.name,

  originalSize: new Vector3(json.width, json.height, json.tiles),
  atlasTileDims: new Vector2(json.cols, json.rows),
  volumeSize: new Vector3(json.tile_width, json.tile_height, json.tiles),
  subregionSize: new Vector3(json.tile_width, json.tile_height, json.tiles),
  subregionOffset: new Vector3(0, 0, 0),
  physicalPixelSize: new Vector3(json.pixel_size_x, json.pixel_size_y, json.pixel_size_z),
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
    translation: json.transform?.translation
      ? new Vector3().fromArray(json.transform.translation)
      : new Vector3(0, 0, 0),
    rotation: json.transform?.rotation ? new Vector3().fromArray(json.transform.rotation) : new Vector3(0, 0, 0),
  },

  userData: json.userData,
});

class JsonImageInfoLoader extends ThreadableVolumeLoader {
  urls: string[];
  jsonInfo: (JsonImageInfo | undefined)[];

  cache?: VolumeCache;

  constructor(urls: string | string[], cache?: VolumeCache) {
    super();

    if (Array.isArray(urls)) {
      this.urls = urls;
    } else {
      this.urls = [urls];
    }

    this.jsonInfo = new Array(this.urls.length);
    this.cache = cache;
  }

  private async getJsonImageInfo(time: number): Promise<JsonImageInfo> {
    const cachedInfo = this.jsonInfo[time];
    if (cachedInfo) {
      return cachedInfo;
    }

    const response = await fetch(this.urls[time]);
    const imageInfo = (await response.json()) as JsonImageInfo;

    imageInfo.pixel_size_unit = imageInfo.pixel_size_unit || "μm";
    imageInfo.times = imageInfo.times || this.urls.length;
    this.jsonInfo[time] = imageInfo;
    return imageInfo;
  }

  async loadDims(loadSpec: LoadSpec): Promise<VolumeDims[]> {
    const jsonInfo = await this.getJsonImageInfo(loadSpec.time);

    const d = new VolumeDims();
    d.shape = [jsonInfo.times || 1, jsonInfo.channels, jsonInfo.tiles, jsonInfo.tile_height, jsonInfo.tile_width];
    d.spacing = [1, 1, jsonInfo.pixel_size_z, jsonInfo.pixel_size_y, jsonInfo.pixel_size_x];
    d.spaceUnit = jsonInfo.pixel_size_unit || "μm";
    d.dataType = "uint8";
    return [d];
  }

  async createImageInfo(loadSpec: LoadSpec): Promise<LoadedVolumeInfo> {
    const jsonInfo = await this.getJsonImageInfo(loadSpec.time);
    return { imageInfo: convertImageInfo(jsonInfo), loadSpec };
  }

  async loadRawChannelData(
    imageInfo: ImageInfo,
    loadSpec: LoadSpec,
    onUpdateMetadata: (imageInfo: undefined, loadSpec?: LoadSpec) => void,
    onData: RawChannelDataCallback
  ): Promise<void> {
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
      images = images.filter(({ channels }) => channels.some((ch) => ch in requestedChannels));
    }

    // This regex removes everything after the last slash, so the url had better be simple.
    const urlPrefix = this.urls[loadSpec.time].replace(/[^/]*$/, "");
    images = images.map((element) => ({ ...element, name: urlPrefix + element.name }));

    // Update `image`'s `loadSpec` before loading
    const adjustedLoadSpec = {
      ...loadSpec,
      // `subregion` and `multiscaleLevel` are unused by this loader
      subregion: new Box3(new Vector3(0, 0, 0), new Vector3(1, 1, 1)),
      multiscaleLevel: 0,
      // include all channels in any loaded images
      channels: images.flatMap(({ channels }) => channels),
    };
    onUpdateMetadata(undefined, adjustedLoadSpec);

    const w = imageInfo.atlasTileDims.x * imageInfo.volumeSize.x;
    const h = imageInfo.atlasTileDims.y * imageInfo.volumeSize.y;
    const wrappedOnData = (
      ch: number[],
      dtype: NumberType[],
      data: TypedArray<NumberType>[],
      ranges: [number, number][]
    ) => onData(ch, dtype, data, ranges, [w, h]);
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
  static async loadVolumeAtlasData(
    imageArray: PackedChannelsImage[],
    onData: RawChannelDataCallback,
    cache?: VolumeCache
  ): Promise<void> {
    const imagePromises = imageArray.map(async (image) => {
      // Because the data is fetched such that one fetch returns a whole batch,
      // if any in batch is cached then they all should be. So if any in batch is NOT cached,
      // then we will have to do a batch request. This logic works both ways because it's all or nothing.
      let cacheHit = true;
      for (let j = 0; j < Math.min(image.channels.length, 4); ++j) {
        const chindex = image.channels[j];
        const cacheResult = cache?.get(`${image.name}/${chindex}`);
        if (cacheResult) {
          // all data coming from this loader is natively 8-bit
          onData([chindex], ["uint8"], [new Uint8Array(cacheResult)], [DATARANGE_UINT8]);
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

      const response = await fetch(image.name, { mode: "cors" });
      const blob = await response.blob();
      const bitmap = await createImageBitmap(blob);

      const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
      const ctx = canvas.getContext("2d") as OffscreenCanvasRenderingContext2D | null;
      if (!ctx) {
        console.log("Error creating canvas 2d context for " + image.name);
        return;
      }
      ctx.globalCompositeOperation = "copy";
      ctx.globalAlpha = 1.0;
      ctx.drawImage(bitmap, 0, 0);
      const iData = ctx.getImageData(0, 0, bitmap.width, bitmap.height);

      const channelsBits: Uint8Array[] = [];
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
        onData([chindex], ["uint8"], [channelsBits[ch]], [DATARANGE_UINT8], [bitmap.width, bitmap.height]);
      }
    });

    await Promise.all(imagePromises);
  }
}

export { JsonImageInfoLoader };

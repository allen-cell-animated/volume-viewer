import { Vector2, Vector3 } from "three";

import { IVolumeLoader, LoadSpec, PerChannelCallback, VolumeDims } from "./IVolumeLoader";
import { buildDefaultMetadata } from "./VolumeLoaderUtils";
import Volume, { ImageInfo } from "../Volume";

interface PackedChannelsImage {
  name: string;
  channels: number[];
}
type PackedChannelsImageRequests = Record<string, HTMLImageElement>;

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

  originalSize: new Vector2(json.width, json.height),
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

  transform: {
    translation: json.transform?.translation
      ? new Vector3().fromArray(json.transform.translation)
      : new Vector3(0, 0, 0),
    rotation: json.transform?.rotation ? new Vector3().fromArray(json.transform.rotation) : new Vector3(0, 0, 0),
  },

  userData: json.userData,
});

class JsonImageInfoLoader implements IVolumeLoader {
  imageInfo: JsonImageInfo | null = null;
  imageArray: PackedChannelsImage[] = [];

  async getImageInfo(loadSpec: LoadSpec): Promise<JsonImageInfo> {
    if (!this.imageInfo) {
      const response = await fetch(loadSpec.url);
      const imageInfo = (await response.json()) as JsonImageInfo;

      imageInfo.pixel_size_unit = imageInfo.pixel_size_unit || "μm";
      this.imageInfo = imageInfo;

      this.imageArray = imageInfo.images;
    }
    return this.imageInfo;
  }

  async loadDims(loadSpec: LoadSpec): Promise<VolumeDims[]> {
    const jsonInfo = await this.getImageInfo(loadSpec);

    const d = new VolumeDims();
    d.subpath = "";
    d.shape = [jsonInfo.times || 1, jsonInfo.channels, jsonInfo.tiles, jsonInfo.tile_height, jsonInfo.tile_width];
    d.spacing = [1, 1, jsonInfo.pixel_size_z, jsonInfo.pixel_size_y, jsonInfo.pixel_size_x];
    d.spaceUnit = jsonInfo.pixel_size_unit || "μm";
    d.dataType = "uint8";
    return [d];
  }

  async createVolume(loadSpec: LoadSpec): Promise<Volume> {
    const jsonInfo = await this.getImageInfo(loadSpec);
    const imageInfo = convertImageInfo(jsonInfo);

    const vol = new Volume(imageInfo, loadSpec);
    vol.imageMetadata = buildDefaultMetadata(imageInfo);
    return vol;
  }

  async loadVolumeData(vol: Volume, onChannelLoaded: PerChannelCallback, explicitLoadSpec?: LoadSpec): Promise<void> {
    const loadSpec = explicitLoadSpec || vol.loadSpec;
    // if you need to adjust image paths prior to download,
    // now is the time to do it.
    // Try to figure out the urlPrefix from the LoadSpec.
    // For this format we assume the image data is in the same directory as the json file.
    // This regex removes everything after the last slash, so the url had better be simple.
    const urlPrefix = loadSpec.url.replace(/[^/]*$/, "");
    this.imageArray.forEach((element) => {
      element.name = urlPrefix + element.name;
    });
    JsonImageInfoLoader.loadVolumeAtlasData(vol, this.imageArray, onChannelLoaded);
  }

  /**
   * load per-channel volume data from a batch of image files containing the volume slices tiled across the images
   * @param {Volume} volume
   * @param {Array.<{name:string, channels:Array.<number>}>} imageArray
   * @param {PerChannelCallback} onChannelLoaded Per-channel callback.  Called when each channel's atlased volume data is loaded
   * @returns {Object.<string, Image>} a map(imageurl : Image object) that should be used to cancel the download requests,
   * for example if you need to destroy the image before all data has arrived.
   * as requests arrive, the callback will be called per image, not per channel
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
  static loadVolumeAtlasData(
    volume: Volume,
    imageArray: PackedChannelsImage[],
    onChannelLoaded: PerChannelCallback
  ): PackedChannelsImageRequests {
    const numImages = imageArray.length;

    const requests = {};
    //console.log("BEGIN DOWNLOAD DATA");
    for (let i = 0; i < numImages; ++i) {
      const url = imageArray[i].name;
      const batch = imageArray[i].channels;

      // using Image is just a trick to download the bits as a png.
      // the Image will never be used again.
      const img: HTMLImageElement = new Image();
      img.onerror = function () {
        console.log("ERROR LOADING " + url);
      };
      img.onload = (function (thisbatch) {
        return function (event: Event) {
          //console.log("GOT ch " + me.src);
          // extract pixels by drawing to canvas
          const canvas = document.createElement("canvas");
          // nice thing about this is i could downsample here
          const w = Math.floor((event?.target as HTMLImageElement).naturalWidth);
          const h = Math.floor((event?.target as HTMLImageElement).naturalHeight);
          canvas.setAttribute("width", "" + w);
          canvas.setAttribute("height", "" + h);
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            console.log("Error creating canvas 2d context for " + url);
            return;
          }
          ctx.globalCompositeOperation = "copy";
          ctx.globalAlpha = 1.0;
          ctx.drawImage(event?.target as CanvasImageSource, 0, 0, w, h);
          // getImageData returns rgba.
          // optimize: collapse rgba to single channel arrays
          const iData = ctx.getImageData(0, 0, w, h);

          const channelsBits: Uint8Array[] = [];
          // allocate channels in batch
          for (let ch = 0; ch < Math.min(thisbatch.length, 4); ++ch) {
            channelsBits.push(new Uint8Array(w * h));
          }
          // extract the data
          for (let j = 0; j < Math.min(thisbatch.length, 4); ++j) {
            for (let px = 0; px < w * h; px++) {
              channelsBits[j][px] = iData.data[px * 4 + j];
            }
          }

          // done with img, iData, and canvas now.

          for (let ch = 0; ch < Math.min(thisbatch.length, 4); ++ch) {
            volume.setChannelDataFromAtlas(thisbatch[ch], channelsBits[ch], w, h);
            onChannelLoaded(url, volume, thisbatch[ch]);
          }
        };
      })(batch);
      img.crossOrigin = "Anonymous";
      img.src = url;
      requests[url] = img;
    }

    return requests;
  }
}

export { JsonImageInfoLoader };

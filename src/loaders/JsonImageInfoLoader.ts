import { IVolumeLoader, LoadSpec, PerChannelCallback, VolumeDims } from "./IVolumeLoader";
import { buildDefaultMetadata } from "./VolumeLoaderUtils";
import { ImageInfo } from "../Volume";
import Volume from "../Volume";

interface PackedChannelsImage {
  name: string;
  channels: number[];
}
type PackedChannelsImageRequests = Record<string, HTMLImageElement>;

class JsonImageInfoLoader implements IVolumeLoader {
  imageInfo: ImageInfo | null = null;
  imageArray: PackedChannelsImage[] = [];

  async getImageInfo(loadSpec: LoadSpec): Promise<ImageInfo> {
    if (!this.imageInfo) {
      const response = await fetch(loadSpec.url);
      const myJson = await response.json();

      const imageInfo = myJson as ImageInfo;
      imageInfo.pixel_size_unit = imageInfo.pixel_size_unit || "μm";
      this.imageInfo = imageInfo;

      this.imageArray = myJson.images;
    }
    return this.imageInfo;
  }

  async loadDims(loadSpec: LoadSpec): Promise<VolumeDims[]> {
    const imageInfo = await this.getImageInfo(loadSpec);

    const d = new VolumeDims();
    d.subpath = "";
    d.shape = [imageInfo.times, imageInfo.channels, imageInfo.tiles, imageInfo.tile_height, imageInfo.tile_width];
    d.spacing = [1, 1, imageInfo.pixel_size_z, imageInfo.pixel_size_y, imageInfo.pixel_size_x];
    d.spatialUnit = imageInfo.pixel_size_unit;
    d.dataType = "uint8";
    return [d];
  }

  async createVolume(loadSpec: LoadSpec): Promise<Volume> {
    const imageInfo = await this.getImageInfo(loadSpec);

    const vol = new Volume(imageInfo, loadSpec);
    vol.imageMetadata = buildDefaultMetadata(imageInfo);
    return vol;
  }

  async loadVolumeData(vol: Volume, onChannelLoaded: PerChannelCallback): Promise<void> {
    // if you need to adjust image paths prior to download,
    // now is the time to do it.
    // Try to figure out the urlPrefix from the LoadSpec.
    // For this format we assume the image data is in the same directory as the json file.
    // This regex removes everything after the last slash, so the url had better be simple.
    const urlPrefix = vol.loadSpec.url.replace(/[^/]*$/, "");
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

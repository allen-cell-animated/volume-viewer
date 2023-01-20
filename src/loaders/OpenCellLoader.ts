import { IVolumeLoader, LoadSpec, PerChannelCallback, VolumeDims } from "./IVolumeLoader";
import { ImageInfo } from "../Volume";
import Volume from "../Volume";

interface PackedChannelsImage {
  name: string;
  channels: number[];
}
type PackedChannelsImageRequests = Record<string, HTMLImageElement>;

class OpenCellLoader implements IVolumeLoader {
  async loadDims(_: LoadSpec): Promise<VolumeDims[]> {
    const d = new VolumeDims();
    d.subpath = "";
    d.shape = [1, 2, 27, 600, 600];
    d.spacing = [1, 1, 2, 1, 1];
    d.spatialUnit = ""; // unknown unit.
    d.dataType = "uint8";
    return [d];
  }

  async createVolume(loadSpec: LoadSpec, onChannelLoaded: PerChannelCallback): Promise<Volume> {
    const numChannels = 2;

    // HQTILE or LQTILE
    // make a json metadata dict for the two channels:
    const urls = [
      {
        name: "https://opencell.czbiohub.org/data/opencell-microscopy/roi/czML0383-P0007/czML0383-P0007-A02-PML0308-S13_ROI-0424-0025-0600-0600-LQTILE-CH405.jpg",
        channels: [0],
      },
      {
        name: "https://opencell.czbiohub.org/data/opencell-microscopy/roi/czML0383-P0007/czML0383-P0007-A02-PML0308-S13_ROI-0424-0025-0600-0600-LQTILE-CH488.jpg",
        channels: [1],
      },
    ];
    // we know these are standardized to 600x600, two channels, one channel per jpg.
    const chnames: string[] = ["DNA", "Structure"];

    /* eslint-disable @typescript-eslint/naming-convention */
    const imgdata: ImageInfo = {
      width: 600,
      height: 600,
      channels: numChannels,
      channel_names: chnames,
      rows: 27,
      cols: 1,
      tiles: 27,
      tile_width: 600,
      tile_height: 600,
      // for webgl reasons, it is best for atlas_width and atlas_height to be <= 2048
      // and ideally a power of 2.  This generally implies downsampling the original volume data for display in this viewer.
      atlas_width: 600,
      atlas_height: 16200,
      pixel_size_x: 1,
      pixel_size_y: 1,
      pixel_size_z: 2,
      name: "TEST",
      version: "1.0",
      pixel_size_unit: "µm",
      transform: {
        translation: [0, 0, 0],
        rotation: [0, 0, 0],
      },
      times: 1,
    };
    /* eslint-enable @typescript-eslint/naming-convention */

    // got some data, now let's construct the volume.
    const vol = new Volume(imgdata);
    OpenCellLoader.loadVolumeAtlasData(vol, urls, onChannelLoaded);
    return vol;
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

export { OpenCellLoader };

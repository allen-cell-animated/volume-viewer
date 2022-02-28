import "regenerator-runtime/runtime";
import Volume, { ImageInfo } from "./Volume";
import { slice, openArray, openGroup, HTTPStore, NestedArray, TypedArray } from "zarr";

/**
 * @callback PerChannelCallback
 * @param {string} imageurl
 * @param {number} channelindex
 */
type PerChannelCallback = (imageurl: string, channelIndex: number) => void;

interface PackedChannelsImage {
  name: string;
  channels: number[];
}
type PackedChannelsImageRequests = Record<string, HTMLImageElement>;

/**
 * @class
 */
export default class VolumeLoader {
  /**
   * load per-channel volume data from a batch of image files containing the volume slices tiled across the images
   * @param {Volume} volume
   * @param {Array.<{name:string, channels:Array.<number>}>} imageArray
   * @param {PerChannelCallback} callback Per-channel callback.  Called when each channel's atlased volume data is loaded
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
    callback: PerChannelCallback
  ): PackedChannelsImageRequests {
    const numImages = imageArray.length;

    const requests = {};
    //console.log("BEGIN DOWNLOAD DATA");
    for (let i = 0; i < numImages; ++i) {
      const url = imageArray[i].name;
      const batch = imageArray[i].channels;

      // using Image is just a trick to download the bits as a png.
      // the Image will never be used again.
      const img = new Image();
      img.onerror = function () {
        console.log("ERROR LOADING " + url);
      };
      img.onload = (function (thisbatch) {
        return function (event) {
          //console.log("GOT ch " + me.src);
          // extract pixels by drawing to canvas
          const canvas = document.createElement("canvas");
          // nice thing about this is i could downsample here
          const w = Math.floor(event.target.naturalWidth);
          const h = Math.floor(event.target.naturalHeight);
          canvas.setAttribute("width", "" + w);
          canvas.setAttribute("height", "" + h);
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            console.log("Error creating canvas 2d context for " + url);
            return;
          }
          ctx.globalCompositeOperation = "copy";
          ctx.globalAlpha = 1.0;
          ctx.drawImage(event.target, 0, 0, w, h);
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
            callback(url, thisbatch[ch]);
          }
        };
      })(batch);
      img.crossOrigin = "Anonymous";
      img.src = url;
      requests[url] = img;
    }

    return requests;
  }

  // loadVolumeAICS(url:string, callback:PerChannelCallback) : Promise<Volume> {
  //   // note that volume is returned before channel data is ready.
  //   return fetch(url)
  //     .then(function(response) {
  //       return response.json();
  //     })
  //     .then(function(myJson) {
  //       // if you need to adjust image paths prior to download,
  //       // now is the time to do it:
  //       // myJson.images.forEach(function(element) {
  //       //     element.name = myURLprefix + element.name;
  //       // });
  //       const vol = new Volume(myJson);

  //       volumeLoader.loadVolumeAtlasData(
  //         vol, myJson.images, callback);
  //       return vol;
  //     });
  // },

  /**
   * load 5d ome-zarr into Volume object
   * @param {string} url
   * @param {PerChannelCallback} callback Per-channel callback.  Called when each channel's atlased volume data is loaded
   * @returns {Promise<Volume>}
   */
  static async loadZarr(url: string, callback: PerChannelCallback): Promise<Volume> {
    const store = new HTTPStore("http://localhost:9020/example-data/AICS-12_143.zarr");

    const imagegroup = "AICS-12_143"; // "image_reduced", 0
    const levelToLoad = 2;

    const data = await openGroup(store, imagegroup, "r");
    const allmetadata = await data.attrs.asObject();
    const numlevels = allmetadata.multiscales[0].datasets.length;

    // get raw scaling for level 0
    const scale5d = allmetadata.multiscales[0].datasets[0].coordinateTransformations[0].scale;

    // TODO get metadata sizes for each level?  how inefficient is that?
    // update levelToLoad after we get size info about multiscales?

    const metadata = allmetadata.omero;

    const level0 = await openArray({ store: store, path: imagegroup + "/" + "0", mode: "r" });
    // full res info
    const w = level0.meta.shape[4];
    const h = level0.meta.shape[3];
    const z = level0.meta.shape[2];
    const c = level0.meta.shape[1];
    const t = level0.meta.shape[0];

    const level = await openArray({ store: store, path: imagegroup + "/" + levelToLoad, mode: "r" });
    // reduced level info
    const tw = level.meta.shape[4];
    const th = level.meta.shape[3];

    // compute rows and cols and atlas width and ht, given tw and th
    let nextrows = 1;
    let nextcols = z;
    let ratio = (nextcols * tw) / (nextrows * th);
    let nrows = nextrows;
    let ncols = nextcols;
    while (ratio > 1) {
      nrows = nextrows;
      ncols = nextcols;
      nextcols -= 1;
      nextrows = Math.ceil(z / nextcols);
      ratio = (nextcols * tw) / (nextrows * th);
    }
    const atlaswidth = ncols * tw;
    const atlasheight = nrows * th;
    console.log(atlaswidth, atlasheight);

    const chnames: string[] = [];
    for (let i = 0; i < metadata.channels.length; ++i) {
      chnames.push(metadata.channels[i].label);
    }
    const imgdata: ImageInfo = {
      width: w,
      height: h,
      channels: c,
      channel_names: chnames,
      rows: nrows,
      cols: ncols,
      tiles: z,
      tile_width: tw,
      tile_height: th,
      // for webgl reasons, it is best for atlas_width and atlas_height to be <= 2048
      // and ideally a power of 2.  This generally implies downsampling the original volume data for display in this viewer.
      atlas_width: atlaswidth,
      atlas_height: atlasheight,
      pixel_size_x: scale5d[4],
      pixel_size_y: scale5d[3],
      pixel_size_z: scale5d[2],
      name: metadata.name,
      version: metadata.version,
      transform: {
        translation: [0, 0, 0],
        rotation: [0, 0, 0],
      },
    };

    // got some data, now let's construct the volume.
    const vol = new Volume(imgdata);

    level.get([0, null, null, null, null]).then((channel) => {
      channel = channel as NestedArray<TypedArray>;
      const nc = channel.shape[0];
      const nz = channel.shape[1];
      const ny = channel.shape[2];
      const nx = channel.shape[3];
      for (let i = 0; i < nc; ++i) {
        const npixels = nx * ny * nz;
        const u8 = new Uint8Array(npixels);
        const xy = nx * ny;

        if (channel.dtype === "|u1") {
          // flatten the 3d array and convert to uint8
          // todo test perf with a loop over x,y,z instead
          for (let j = 0; j < npixels; ++j) {
            const slice = Math.floor(j / xy);
            const yrow = Math.floor(j / nx) - slice * ny;
            const xcol = j % nx;
            u8[j] = channel.data[i][slice][yrow][xcol];
          }
        } else {
          const chmin = metadata.channels[i].window.min;
          const chmax = metadata.channels[i].window.max;
          // flatten the 3d array and convert to uint8
          for (let j = 0; j < npixels; ++j) {
            const slice = Math.floor(j / xy);
            const yrow = Math.floor(j / nx) - slice * ny;
            const xcol = j % nx;
            u8[j] = ((channel.data[i][slice][yrow][xcol] - chmin) / (chmax - chmin)) * 255;
          }
        }
        vol.setChannelDataFromVolume(i, u8);
        if (callback) {
          callback(url, i);
        }
      }
    });

    //   // now we get the chunks:
    // for (let i = 0; i < c; ++i) {
    //   level.get([0, i, null, null, null]).then((channel) => {
    //     channel = channel as NestedArray<TypedArray>;
    //     const npixels = channel.shape[0] * channel.shape[1] * channel.shape[2];
    //     const u8 = new Uint8Array(npixels);
    //     const xy = channel.shape[1] * channel.shape[2];

    //     if (channel.dtype === "|u1") {
    //       // flatten the 3d array and convert to uint8
    //       for (let j = 0; j < npixels; ++j) {
    //         const slice = Math.floor(j / xy);
    //         const yrow = Math.floor(j / channel.shape[2]) - slice * channel.shape[1];
    //         const xcol = j % channel.shape[2];
    //         u8[j] = channel.data[slice][yrow][xcol];
    //       }
    //     } else {
    //       const chmin = metadata.channels[i].window.min;
    //       const chmax = metadata.channels[i].window.max;
    //       // flatten the 3d array and convert to uint8
    //       for (let j = 0; j < npixels; ++j) {
    //         const slice = Math.floor(j / xy);
    //         const yrow = Math.floor(j / channel.shape[2]) - slice * channel.shape[1];
    //         const xcol = j % channel.shape[2];
    //         u8[j] = ((channel.data[slice][yrow][xcol] - chmin) / (chmax - chmin)) * 255;
    //       }
    //     }
    //     vol.setChannelDataFromVolume(i, u8);
    //     if (callback) {
    //       callback(url, i);
    //     }
    //   });
    // }
    return vol;
  }

  static async loadOpenCell(callback: PerChannelCallback): Promise<Volume> {
    const numChannels = 2;

    // HQTILE or LQTILE
    // make a json metadata dict for the two channels:
    const urls = [
      {
        name: "czML0383-P0002-G11-PML0146-S04_ROI-0000-0000-0600-0600-LQTILE-CH405.jpeg",
        channels: [0],
      },
      {
        name: "czML0383-P0002-G11-PML0146-S04_ROI-0000-0000-0600-0600-LQTILE-CH488.jpeg",
        channels: [1],
      },
    ];
    // we know these are standardized to 600x600, two channels, one channel per jpg.
    const chnames: string[] = ["DNA", "Structure"];

    const imgdata: ImageInfo = {
      width: 600,
      height: 600,
      channels: 2,
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
      transform: {
        translation: [0, 0, 0],
        rotation: [0, 0, 0],
      },
    };

    // got some data, now let's construct the volume.
    const vol = new Volume(imgdata);
    this.loadVolumeAtlasData(vol, urls, callback);
    return vol;
  }
}

import "regenerator-runtime/runtime";

import Volume, { ImageInfo } from "./Volume";
import { openArray, openGroup, HTTPStore } from "zarr";
import { fromUrl } from "geotiff";

export type TypedArray =
  | Uint8Array
  | Int8Array
  | Uint16Array
  | Int16Array
  | Uint32Array
  | Int32Array
  | Float32Array
  | Float64Array;

/**
 * @callback PerChannelCallback
 * @param {string} imageurl
 * @param {Volume} volume
 * @param {number} channelindex
 */
type PerChannelCallback = (imageurl: string, volume: Volume, channelIndex: number) => void;

interface PackedChannelsImage {
  name: string;
  channels: number[];
}
type PackedChannelsImageRequests = Record<string, HTMLImageElement>;

// Preferred spatial units in OME-Zarr are specified as full names. We want just the symbol.
// See https://ngff.openmicroscopy.org/latest/#axes-md
function spatialUnitNameToSymbol(unitName: string): string | null {
  const unitSymbols = {
    "angstrom":   "Å",
    "decameter":  "dam",
    "foot":       "ft",
    "inch":       "in",
    "meter":      "m",
    "micrometer": "μm",
    "mile":       "mi",
    "parsec":     "pc",
    "yard":       "yd",
  };
  if (unitSymbols[unitName]) {
    return unitSymbols[unitName];
  }

  // SI prefixes not in unitSymbols are abbreviated by first letter, capitalized if prefix ends with "a"
  if (unitName.endsWith("meter")) {
    const capitalize = unitName[unitName.length - 6] === "a";
    const prefix = capitalize ? unitName[0].toUpperCase() : unitName[0];
    return prefix + "m";
  }

  return null;
}

// We want to find the most "square" packing of z tw by th tiles.
// Compute number of rows and columns.
function computePackedAtlasDims(z, tw, th): { nrows: number; ncols: number } {
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
  // const atlaswidth = ncols * tw;
  // const atlasheight = nrows * th;
  // console.log(atlaswidth, atlasheight);
  return { nrows, ncols };
}

/**
 * @class
 */
export default class VolumeLoader {
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

  /**
   * load 4d volume stored in json plus tiled png texture atlases
   * @param {string} url
   * @param {string} urlPrefix The part of the url to prepend for all the images specified in the json.
   * @param {PerChannelCallback} onChannelLoaded Per-channel callback.  Called when each channel's atlased volume data is loaded
   * @returns {Promise<Volume>}
   */
  static async loadJson(url: string, urlPrefix: string, onChannelLoaded: PerChannelCallback): Promise<Volume> {
    const response = await fetch(url);
    const myJson = await response.json();
    const vol = new Volume(myJson);

    // if you need to adjust image paths prior to download,
    // now is the time to do it:
    myJson.images.forEach((element) => {
      element.name = urlPrefix + element.name;
    });
    myJson.unit_symbol = myJson.unit_symbol || "μm";
    VolumeLoader.loadVolumeAtlasData(vol, myJson.images, onChannelLoaded);
    return vol;
  }

  /**
   * load 5d ome-zarr into Volume object
   * @param {string} url
   * @param {PerChannelCallback} onChannelLoaded Per-channel callback.  Called when each channel's atlased volume data is loaded
   * @returns {Promise<Volume>}
   */
  static async loadZarr(
    urlStore: string,
    imageName: string,
    t: number,
    onChannelLoaded: PerChannelCallback
  ): Promise<Volume> {
    const store = new HTTPStore(urlStore);

    const imagegroup = imageName;

    const data = await openGroup(store, imagegroup, "r");

    // get top-level metadata for this zarr image
    const allmetadata = await data.attrs.asObject();
    // each entry of multiscales is a multiscale image.
    // take the first multiscales entry
    const imageIndex = 0;
    const multiscales = allmetadata.multiscales[imageIndex].datasets;
    const axes = allmetadata.multiscales[imageIndex].axes;

    let hasT = false;
    let hasC = false;
    const axisTCZYX = [-1, -1, -1, -1, -1];
    for (let i = 0; i < axes.length; ++i) {
      const axis = axes[i];
      if (axis.name === "t") {
        hasT = true;
        axisTCZYX[0] = i;
      } else if (axis.name === "c") {
        hasC = true;
        axisTCZYX[1] = i;
      } else if (axis.name === "z") {
        axisTCZYX[2] = i;
      } else if (axis.name === "y") {
        axisTCZYX[3] = i;
      } else if (axis.name === "x") {
        axisTCZYX[4] = i;
      } else {
        console.log("ERROR: UNRECOGNIZED AXIS in zarr: " + axis.name);
      }
    }
    // ZYX
    const spatialAxes: number[] = [];
    if (axisTCZYX[2] > -1) {
      spatialAxes.push(axisTCZYX[2]);
    }
    if (axisTCZYX[3] > -1) {
      spatialAxes.push(axisTCZYX[3]);
    }
    if (axisTCZYX[4] > -1) {
      spatialAxes.push(axisTCZYX[4]);
    }
    if (spatialAxes.length != 3) {
      console.log("ERROR: zarr loader expects a z, y, and x axis.");
    }

    const numlevels = multiscales.length;
    // Assume all axes have the same units - we have no means of storing per-axis unit symbols
    const unitName = axes[spatialAxes[2]].unit;
    const unitSymbol = spatialUnitNameToSymbol(unitName) || unitName || "";

    // get all shapes
    for (const i in multiscales) {
      const level = await openArray({ store: store, path: imagegroup + "/" + multiscales[i].path, mode: "r" });
      // just stick it in multiscales for now.
      multiscales[i].shape = level.meta.shape;
      if (multiscales[i].shape.length != axes.length) {
        console.log(
          "ERROR: shape length " + multiscales[i].shape.length + " does not match axes length " + axes.length
        );
      }
    }

    const downsampleZ = 2; // z/downsampleZ is number of z slices in reduced volume

    // update levelToLoad after we get size info about multiscales.
    // decide to max out at a 4k x 4k texture.
    const maxAtlasEdge = 4096;
    // default to lowest level unless we find a better one
    let levelToLoad = numlevels - 1;
    for (let i = 0; i < multiscales.length; ++i) {
      // estimate atlas size:
      const s =
        (multiscales[i].shape[spatialAxes[0]] / downsampleZ) *
        multiscales[i].shape[spatialAxes[1]] *
        multiscales[i].shape[spatialAxes[2]];
      if (s / maxAtlasEdge <= maxAtlasEdge) {
        console.log("Will load level " + i);
        levelToLoad = i;
        break;
      }
    }

    const dataset = multiscales[levelToLoad];
    const c = hasC ? dataset.shape[axisTCZYX[1]] : 1;
    const sizeT = hasT ? dataset.shape[axisTCZYX[0]] : 1;

    // technically there can be any number of coordinateTransformations
    // but there must be only one of type "scale".
    // Here I assume that is the only one.
    const scale5d = dataset.coordinateTransformations[0].scale;
    const tw = dataset.shape[spatialAxes[2]];
    const th = dataset.shape[spatialAxes[1]];
    const tz = dataset.shape[spatialAxes[0]];

    // compute rows and cols and atlas width and ht, given tw and th
    const loadedZ = Math.ceil(tz / downsampleZ);
    const { nrows, ncols } = computePackedAtlasDims(loadedZ, tw, th);
    const atlaswidth = ncols * tw;
    const atlasheight = nrows * th;
    console.log("atlas width and height: " + atlaswidth + " " + atlasheight);

    const displayMetadata = allmetadata.omero;
    const chnames: string[] = [];
    for (let i = 0; i < displayMetadata.channels.length; ++i) {
      chnames.push(displayMetadata.channels[i].label);
    }
    /* eslint-disable @typescript-eslint/naming-convention */
    const imgdata: ImageInfo = {
      width: tw, // TODO where should we capture the original w?
      height: th, // TODO original h?
      channels: c,
      channel_names: chnames,
      rows: nrows,
      cols: ncols,
      tiles: loadedZ, // TODO original z????
      tile_width: tw,
      tile_height: th,
      // for webgl reasons, it is best for atlas_width and atlas_height to be <= 2048
      // and ideally a power of 2.  This generally implies downsampling the original volume data for display in this viewer.
      atlas_width: atlaswidth,
      atlas_height: atlasheight,
      pixel_size_x: scale5d[spatialAxes[2]],
      pixel_size_y: scale5d[spatialAxes[1]],
      pixel_size_z: scale5d[spatialAxes[0]] * downsampleZ,
      unit_symbol: unitSymbol,
      name: displayMetadata.name,
      version: displayMetadata.version,
      transform: {
        translation: [0, 0, 0],
        rotation: [0, 0, 0],
      },
      times: sizeT,
    };
    /* eslint-enable @typescript-eslint/naming-convention */

    // got some data, now let's construct the volume.
    const vol = new Volume(imgdata);

    const storepath = imagegroup + "/" + dataset.path;
    // do each channel on a worker
    for (let i = 0; i < c; ++i) {
      const worker = new Worker(new URL("./workers/FetchZarrWorker", import.meta.url));
      worker.onmessage = function (e) {
        const u8 = e.data.data;
        const channel = e.data.channel;
        vol.setChannelDataFromVolume(channel, u8);
        if (onChannelLoaded) {
          // make up a unique name? or have caller pass this in?
          onChannelLoaded(urlStore + "/" + imageName, vol, channel);
        }
        worker.terminate();
      };
      worker.onerror = function (e) {
        alert("Error: Line " + e.lineno + " in " + e.filename + ": " + e.message);
      };
      worker.postMessage({
        urlStore: urlStore,
        time: hasT ? Math.min(t, sizeT) : -1,
        channel: hasC ? i : -1,
        downsampleZ: downsampleZ,
        path: storepath,
      });
    }

    return vol;
  }

  static async loadOpenCell(onChannelLoaded: PerChannelCallback): Promise<Volume> {
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
      unit_symbol: "µm",
      transform: {
        translation: [0, 0, 0],
        rotation: [0, 0, 0],
      },
      times: 1,
    };
    /* eslint-enable @typescript-eslint/naming-convention */

    // got some data, now let's construct the volume.
    const vol = new Volume(imgdata);
    this.loadVolumeAtlasData(vol, urls, onChannelLoaded);
    return vol;
  }

  static async loadTiff(url: string, onChannelLoaded: PerChannelCallback): Promise<Volume> {
    const tiff = await fromUrl(url);
    // DO NOT DO THIS, ITS SLOW
    // const imagecount = await tiff.getImageCount();
    // read the FIRST image
    const image = await tiff.getImage();

    const tiffimgdesc = image.getFileDirectory().ImageDescription;
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(tiffimgdesc, "text/xml");
    const omeEl = xmlDoc.getElementsByTagName("OME")[0];
    const image0El = omeEl.getElementsByTagName("Image")[0];
    const pixelsEl = image0El.getElementsByTagName("Pixels")[0];
    const sizex = Number(pixelsEl.getAttribute("SizeX"));
    const sizey = Number(pixelsEl.getAttribute("SizeY"));
    const sizez = Number(pixelsEl.getAttribute("SizeZ"));
    const sizec = Number(pixelsEl.getAttribute("SizeC"));
    const sizet = Number(pixelsEl.getAttribute("SizeT"));
    const unit = pixelsEl.getAttribute("PhysicalSizeXUnit");
    const pixeltype = pixelsEl.getAttribute("Type");
    const dimensionorder: string = pixelsEl.getAttribute("DimensionOrder") || "XYZCT";

    // ignoring units for now
    const pixelsizex = Number(pixelsEl.getAttribute("PhysicalSizeX"));
    const pixelsizey = Number(pixelsEl.getAttribute("PhysicalSizeY"));
    const pixelsizez = Number(pixelsEl.getAttribute("PhysicalSizeZ"));
    const channelnames: string[] = [];
    const channelsEls = pixelsEl.getElementsByTagName("Channel");
    for (let i = 0; i < channelsEls.length; ++i) {
      const name = channelsEls[i].getAttribute("Name");
      const id = channelsEls[i].getAttribute("ID");
      channelnames.push(name ? name : id ? id : "Channel" + i);
    }

    // compare with sizex, sizey
    //const width = image.getWidth();
    //const height = image.getHeight();

    // TODO allow user setting of this downsampling info?
    // TODO allow ROI selection: range of x,y,z,c for a given t
    const { nrows, ncols } = computePackedAtlasDims(sizez, sizex, sizey);
    // fit tiles to max of 2048x2048?
    const targetSize = 2048;
    const tilesizex = Math.floor(targetSize / ncols);
    const tilesizey = Math.floor(targetSize / nrows);

    // load tiff and check metadata

    /* eslint-disable @typescript-eslint/naming-convention */
    const imgdata: ImageInfo = {
      width: sizex,
      height: sizey,
      channels: sizec,
      channel_names: channelnames,
      rows: nrows,
      cols: ncols,
      tiles: sizez,
      tile_width: tilesizex,
      tile_height: tilesizey,
      // for webgl reasons, it is best for atlas_width and atlas_height to be <= 2048
      // and ideally a power of 2.  This generally implies downsampling the original volume data for display in this viewer.
      atlas_width: tilesizex * ncols,
      atlas_height: tilesizey * nrows,
      pixel_size_x: pixelsizex,
      pixel_size_y: pixelsizey,
      pixel_size_z: pixelsizez,
      name: "TEST",
      version: "1.0",
      unit_symbol: unit || "",
      transform: {
        translation: [0, 0, 0],
        rotation: [0, 0, 0],
      },
      times: sizet,
    };
    /* eslint-enable @typescript-eslint/naming-convention */

    const vol = new Volume(imgdata);
    // do each channel on a worker?
    for (let channel = 0; channel < sizec; ++channel) {
      const params = {
        channel: channel,
        // these are target xy sizes for the in-memory volume data
        // they may or may not be the same size as original xy sizes
        tilesizex: tilesizex,
        tilesizey: tilesizey,
        sizec: sizec,
        sizez: sizez,
        dimensionOrder: dimensionorder,
        bytesPerSample: pixeltype === "uint8" ? 1 : pixeltype === "uint16" ? 2 : 4,
        url: url,
      };
      const worker = new Worker(new URL("./workers/FetchTiffWorker", import.meta.url));
      worker.onmessage = function (e) {
        const u8 = e.data.data;
        const channel = e.data.channel;
        vol.setChannelDataFromVolume(channel, u8);
        if (onChannelLoaded) {
          // make up a unique name? or have caller pass this in?
          onChannelLoaded(url, vol, channel);
        }
        worker.terminate();
      };
      worker.onerror = function (e) {
        alert("Error: Line " + e.lineno + " in " + e.filename + ": " + e.message);
      };
      worker.postMessage(params);
    }
    return vol;
  }
}

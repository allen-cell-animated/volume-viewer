import { fromUrl } from "geotiff";
import { Vector2, Vector3 } from "three";

import { IVolumeLoader, LoadSpec, PerChannelCallback, VolumeDims } from "./IVolumeLoader";
import { buildDefaultMetadata, computePackedAtlasDims } from "./VolumeLoaderUtils";
import { ImageInfo } from "../Volume";
import Volume from "../Volume";

function prepareXML(xml: string): string {
  // trim trailing unicode zeros?
  // eslint-disable-next-line no-control-regex
  const expr = /[\u0000]$/g;
  return xml.trim().replace(expr, "").trim();
}

function getOME(xml: string): Element {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xml, "text/xml");
  const omeEl = xmlDoc.getElementsByTagName("OME")[0];
  return omeEl;
}

class OMEDims {
  sizex = 0;
  sizey = 0;
  sizez = 0;
  sizec = 0;
  sizet = 0;
  unit = "";
  pixeltype = "";
  dimensionorder = "";
  pixelsizex = 0;
  pixelsizey = 0;
  pixelsizez = 0;
  channelnames: string[] = [];
}

function getOMEDims(imageEl: Element): OMEDims {
  const dims = new OMEDims();

  const pixelsEl = imageEl.getElementsByTagName("Pixels")[0];
  dims.sizex = Number(pixelsEl.getAttribute("SizeX"));
  dims.sizey = Number(pixelsEl.getAttribute("SizeY"));
  dims.sizez = Number(pixelsEl.getAttribute("SizeZ"));
  dims.sizec = Number(pixelsEl.getAttribute("SizeC"));
  dims.sizet = Number(pixelsEl.getAttribute("SizeT"));
  dims.unit = pixelsEl.getAttribute("PhysicalSizeXUnit") || "";
  dims.pixeltype = pixelsEl.getAttribute("Type") || "";
  dims.dimensionorder = pixelsEl.getAttribute("DimensionOrder") || "XYZCT";
  dims.pixelsizex = Number(pixelsEl.getAttribute("PhysicalSizeX"));
  dims.pixelsizey = Number(pixelsEl.getAttribute("PhysicalSizeY"));
  dims.pixelsizez = Number(pixelsEl.getAttribute("PhysicalSizeZ"));
  const channelsEls = pixelsEl.getElementsByTagName("Channel");
  for (let i = 0; i < channelsEls.length; ++i) {
    const name = channelsEls[i].getAttribute("Name");
    const id = channelsEls[i].getAttribute("ID");
    dims.channelnames.push(name ? name : id ? id : "Channel" + i);
  }

  return dims;
}

async function getDimsFromUrl(url: string): Promise<OMEDims> {
  const tiff = await fromUrl(url);
  // DO NOT DO THIS, ITS SLOW
  // const imagecount = await tiff.getImageCount();
  // read the FIRST image
  const image = await tiff.getImage();

  const tiffimgdesc = prepareXML(image.getFileDirectory().ImageDescription);
  const omeEl = getOME(tiffimgdesc);

  const image0El = omeEl.getElementsByTagName("Image")[0];
  return getOMEDims(image0El);
}

const getBytesPerSample = (type: string): number => (type === "uint8" ? 1 : type === "uint16" ? 2 : 4);

class TiffLoader implements IVolumeLoader {
  url: string;
  dimensionOrder?: string;
  bytesPerSample?: number;

  constructor(url: string) {
    this.url = url;
  }

  async loadDims(_loadSpec: LoadSpec): Promise<VolumeDims[]> {
    const tiff = await fromUrl(this.url);
    // DO NOT DO THIS, ITS SLOW
    // const imagecount = await tiff.getImageCount();
    // read the FIRST image
    const image = await tiff.getImage();

    const tiffimgdesc = prepareXML(image.getFileDirectory().ImageDescription);
    const omeEl = getOME(tiffimgdesc);

    const image0El = omeEl.getElementsByTagName("Image")[0];
    const dims = getOMEDims(image0El);

    const d = new VolumeDims();
    d.subpath = "";
    d.shape = [dims.sizet, dims.sizec, dims.sizez, dims.sizey, dims.sizex];
    d.spacing = [1, 1, dims.pixelsizez, dims.pixelsizey, dims.pixelsizex];
    d.spaceUnit = dims.unit ? dims.unit : "micron";
    d.dataType = dims.pixeltype ? dims.pixeltype : "uint8";
    return [d];
  }

  async createVolume(loadSpec: LoadSpec, onChannelLoaded?: PerChannelCallback): Promise<Volume> {
    const dims = await getDimsFromUrl(this.url);
    // compare with sizex, sizey
    //const width = image.getWidth();
    //const height = image.getHeight();

    // TODO allow user setting of this downsampling info?
    // TODO allow ROI selection: range of x,y,z,c for a given t
    const { nrows, ncols } = computePackedAtlasDims(dims.sizez, dims.sizex, dims.sizey);
    // fit tiles to max of 2048x2048?
    const targetSize = 2048;
    const tilesizex = Math.floor(targetSize / ncols);
    const tilesizey = Math.floor(targetSize / nrows);

    // load tiff and check metadata

    const imgdata: ImageInfo = {
      name: "TEST",

      originalSize: new Vector3(dims.sizex, dims.sizey, dims.sizez),
      atlasTileDims: new Vector2(nrows, ncols),
      volumeSize: new Vector3(tilesizex, tilesizey, dims.sizez),
      subregionSize: new Vector3(tilesizex, tilesizey, dims.sizez),
      subregionOffset: new Vector3(0, 0, 0),
      physicalPixelSize: new Vector3(dims.pixelsizex, dims.pixelsizey, dims.pixelsizez),
      spatialUnit: dims.unit || "",

      numChannels: dims.sizec,
      channelNames: dims.channelnames,

      times: dims.sizet,
      timeScale: 1,
      timeUnit: "",

      transform: {
        translation: new Vector3(0, 0, 0),
        rotation: new Vector3(0, 0, 0),
      },
    };

    const vol = new Volume(imgdata, loadSpec, this);
    vol.channelLoadCallback = onChannelLoaded;
    vol.imageMetadata = buildDefaultMetadata(imgdata);

    this.dimensionOrder = dims.dimensionorder;
    this.bytesPerSample = getBytesPerSample(dims.pixeltype);

    return vol;
  }

  async loadVolumeData(vol: Volume, _explicitLoadSpec?: LoadSpec, onChannelLoaded?: PerChannelCallback): Promise<void> {
    vol.channelLoadCallback = onChannelLoaded;
    //
    if (this.bytesPerSample === undefined || this.dimensionOrder === undefined) {
      const dims = await getDimsFromUrl(this.url);

      this.dimensionOrder = dims.dimensionorder;
      this.bytesPerSample = getBytesPerSample(dims.pixeltype);
    }

    const imageInfo = vol.imageInfo;

    // do each channel on a worker?
    for (let channel = 0; channel < imageInfo.numChannels; ++channel) {
      const params = {
        channel: channel,
        // these are target xy sizes for the in-memory volume data
        // they may or may not be the same size as original xy sizes
        tilesizex: imageInfo.volumeSize.x,
        tilesizey: imageInfo.volumeSize.y,
        sizec: imageInfo.numChannels,
        sizez: imageInfo.volumeSize.z,
        dimensionOrder: this.dimensionOrder,
        bytesPerSample: this.bytesPerSample,
        url: this.url,
      };
      const worker = new Worker(new URL("../workers/FetchTiffWorker", import.meta.url));
      worker.onmessage = (e) => {
        const u8 = e.data.data;
        const channel = e.data.channel;
        vol.setChannelDataFromVolume(channel, u8);
        // make up a unique name? or have caller pass this in?
        onChannelLoaded?.(vol, channel);
        worker.terminate();
      };
      worker.onerror = function (e) {
        alert("Error: Line " + e.lineno + " in " + e.filename + ": " + e.message);
      };
      worker.postMessage(params);
    }

    this.dimensionOrder = undefined;
    this.bytesPerSample = undefined;
  }
}

export { TiffLoader };

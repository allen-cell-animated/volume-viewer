import { fromUrl } from "geotiff";
import { Vector3 } from "three";

import {
  ThreadableVolumeLoader,
  LoadSpec,
  type RawChannelDataCallback,
  VolumeDims,
  type LoadedVolumeInfo,
} from "./IVolumeLoader.js";
import { computePackedAtlasDims } from "./VolumeLoaderUtils.js";
import type { ImageInfo } from "../Volume.js";

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

const getBytesPerSample = (type: string): number => (type === "uint8" ? 1 : type === "uint16" ? 2 : 4);

// Despite the class `TiffLoader` extends, this loader is not threadable, since geotiff internally uses features that
// aren't available on workers. It uses its own specialized workers anyways.
class TiffLoader extends ThreadableVolumeLoader {
  url: string;
  dims?: OMEDims;

  constructor(url: string) {
    super();
    this.url = url;
  }

  private async loadOmeDims(): Promise<OMEDims> {
    if (!this.dims) {
      const tiff = await fromUrl(this.url, { allowFullFile: true });
      // DO NOT DO THIS, ITS SLOW
      // const imagecount = await tiff.getImageCount();
      // read the FIRST image
      const image = await tiff.getImage();

      const tiffimgdesc = prepareXML(image.getFileDirectory().ImageDescription);
      const omeEl = getOME(tiffimgdesc);

      const image0El = omeEl.getElementsByTagName("Image")[0];
      this.dims = getOMEDims(image0El);
    }
    return this.dims;
  }

  async loadDims(_loadSpec: LoadSpec): Promise<VolumeDims[]> {
    const dims = await this.loadOmeDims();

    const d = new VolumeDims();
    d.shape = [dims.sizet, dims.sizec, dims.sizez, dims.sizey, dims.sizex];
    d.spacing = [1, 1, dims.pixelsizez, dims.pixelsizey, dims.pixelsizex];
    d.spaceUnit = dims.unit ? dims.unit : "micron";
    d.dataType = dims.pixeltype ? dims.pixeltype : "uint8";
    return [d];
  }

  async createImageInfo(_loadSpec: LoadSpec): Promise<LoadedVolumeInfo> {
    const dims = await this.loadOmeDims();
    // compare with sizex, sizey
    //const width = image.getWidth();
    //const height = image.getHeight();

    // TODO allow user setting of this downsampling info?
    // TODO allow ROI selection: range of x,y,z,c for a given t
    const atlasDims = computePackedAtlasDims(dims.sizez, dims.sizex, dims.sizey);
    // fit tiles to max of 2048x2048?
    const targetSize = 2048;
    const tilesizex = Math.floor(targetSize / atlasDims.x);
    const tilesizey = Math.floor(targetSize / atlasDims.y);

    // load tiff and check metadata

    const imgdata: ImageInfo = {
      name: "TEST",

      originalSize: new Vector3(dims.sizex, dims.sizey, dims.sizez),
      atlasTileDims: atlasDims,
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

      numMultiscaleLevels: 1,
      multiscaleLevel: 0,

      transform: {
        translation: new Vector3(0, 0, 0),
        rotation: new Vector3(0, 0, 0),
      },
    };

    // This loader uses no fields from `LoadSpec`. Initialize volume with defaults.
    return { imageInfo: imgdata, loadSpec: new LoadSpec() };
  }

  async loadRawChannelData(
    imageInfo: ImageInfo,
    _loadSpec: LoadSpec,
    onData: RawChannelDataCallback
  ): Promise<Record<string, never>> {
    const dims = await this.loadOmeDims();

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
        dimensionOrder: dims.dimensionorder,
        bytesPerSample: getBytesPerSample(dims.pixeltype),
        url: this.url,
      };
      const worker = new Worker(new URL("../workers/FetchTiffWorker", import.meta.url));
      worker.onmessage = (e) => {
        const dataArray = e.data.data;
        const channelIndex = e.data.channel;
        const range = e.data.range;
        const dtype = e.data.dtype;
        console.log("got data for channel: min max", channelIndex, range[0], range[1]);
        onData([channelIndex], [dtype], [dataArray], [range]);
        worker.terminate();
      };
      worker.onerror = (e) => {
        alert("Error: Line " + e.lineno + " in " + e.filename + ": " + e.message);
      };
      worker.postMessage(params);
    }

    return {};
  }
}

export { TiffLoader };

import { fromUrl } from "geotiff";
import { Vector3 } from "three";
import { ErrorObject, deserializeError } from "serialize-error";

import {
  ThreadableVolumeLoader,
  LoadSpec,
  type RawChannelDataCallback,
  VolumeDims,
  type LoadedVolumeInfo,
} from "./IVolumeLoader.js";
import { computePackedAtlasDims } from "./VolumeLoaderUtils.js";
import { VolumeLoadError, VolumeLoadErrorType, wrapVolumeLoadError } from "./VolumeLoadError.js";
import type { ImageInfo } from "../Volume.js";

function prepareXML(xml: string): string {
  // trim trailing unicode zeros?
  // eslint-disable-next-line no-control-regex
  const expr = /[\u0000]$/g;
  return xml.trim().replace(expr, "").trim();
}

function getOME(xml: string): Element {
  const parser = new DOMParser();
  try {
    const xmlDoc = parser.parseFromString(xml, "text/xml");
    return xmlDoc.getElementsByTagName("OME")[0];
  } catch (e) {
    throw new VolumeLoadError("Could not find OME metadata in TIFF file", {
      type: VolumeLoadErrorType.INVALID_METADATA,
      cause: e,
    });
  }
}

class OMEDims {
  sizex = 0;
  sizey = 0;
  sizez = 1;
  sizec = 1;
  sizet = 1;
  unit = "";
  pixeltype = "";
  dimensionorder = "";
  pixelsizex = 1;
  pixelsizey = 1;
  pixelsizez = 1;
  channelnames: string[] = [];
}

export type TiffWorkerParams = {
  channel: number;
  tilesizex: number;
  tilesizey: number;
  sizec: number;
  sizez: number;
  dimensionOrder: string;
  bytesPerSample: number;
  url: string;
};

export type TiffLoadResult = {
  isError: false;
  data: Uint8Array;
  channel: number;
  range: [number, number];
};

function getAttributeOrError(el: Element, attr: string): string {
  const val = el.getAttribute(attr);
  if (val === null) {
    throw new VolumeLoadError(`Missing attribute ${attr} in OME-TIFF metadata`, {
      type: VolumeLoadErrorType.INVALID_METADATA,
    });
  }
  return val;
}

function getOMEDims(imageEl: Element): OMEDims {
  const dims = new OMEDims();

  const pixelsEl = imageEl.getElementsByTagName("Pixels")[0];
  dims.sizex = Number(getAttributeOrError(pixelsEl, "SizeX"));
  dims.sizey = Number(getAttributeOrError(pixelsEl, "SizeY"));
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
      const tiff = await fromUrl(this.url, { allowFullFile: true }).catch(
        wrapVolumeLoadError(`Could not open TIFF file at ${this.url}`, VolumeLoadErrorType.NOT_FOUND)
      );
      // DO NOT DO THIS, ITS SLOW
      // const imagecount = await tiff.getImageCount();
      // read the FIRST image
      const image = await tiff
        .getImage()
        .catch(wrapVolumeLoadError("Failed to open TIFF image", VolumeLoadErrorType.NOT_FOUND));

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
    _onUpdateMetadata: () => void,
    onData: RawChannelDataCallback
  ): Promise<void> {
    const dims = await this.loadOmeDims();

    const channelProms: Promise<void>[] = [];
    // do each channel on a worker?
    for (let channel = 0; channel < imageInfo.numChannels; ++channel) {
      const thisChannelProm = new Promise<void>((resolve, reject) => {
        const params: TiffWorkerParams = {
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
        worker.onmessage = (e: MessageEvent<TiffLoadResult | { isError: true; error: ErrorObject }>) => {
          if (e.data.isError) {
            reject(deserializeError(e.data.error));
            return;
          }
          const { data, channel, range } = e.data;
          onData([channel], [data], [range]);
          worker.terminate();
          resolve();
        };

        worker.postMessage(params);
      });

      channelProms.push(thisChannelProm);
    }

    // waiting for all channels to load allows errors to propagate to the caller via this promise
    await Promise.all(channelProms);
  }
}

export { TiffLoader };

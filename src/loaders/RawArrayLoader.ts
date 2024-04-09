import { Box3, Vector3 } from "three";

import {
  ThreadableVolumeLoader,
  type LoadSpec,
  type RawChannelDataCallback,
  VolumeDims,
  type LoadedVolumeInfo,
} from "./IVolumeLoader.js";
import { computePackedAtlasDims } from "./VolumeLoaderUtils";
import { ImageInfo } from "../Volume";
import { DATARANGE_UINT8 } from "../types.js";

// this is the form in which a 4D numpy array arrives as converted
// by jupyterlab into a js object.
// This loader does not yet support multiple time samples.
export type RawArrayData = {
  // expected to be "uint8" always
  dtype: "uint8";
  // [c,z,y,x]
  shape: [number, number, number, number];
  // the bits (assumed uint8!!)
  buffer: DataView;
};

// minimal metadata for visualization
export type RawArrayInfo = {
  name: string;
  sizeX: number;
  sizeY: number;
  sizeZ: number;
  sizeC: number;
  physicalPixelSize: [number, number, number];
  spatialUnit: string;
  channelNames: string[];
  userData?: Record<string, unknown>;
};

export interface RawArrayLoaderOptions {
  data: RawArrayData;
  metadata: RawArrayInfo;
}

const convertImageInfo = (json: RawArrayInfo): ImageInfo => ({
  name: json.name,

  // assumption: the data is already sized to fit in our viewer's preferred
  // memory footprint (a tiled atlas texture as of this writing)
  originalSize: new Vector3(json.sizeX, json.sizeY, json.sizeZ),
  atlasTileDims: computePackedAtlasDims(json.sizeZ, json.sizeX, json.sizeY),
  volumeSize: new Vector3(json.sizeX, json.sizeY, json.sizeZ),
  subregionSize: new Vector3(json.sizeX, json.sizeY, json.sizeZ),
  subregionOffset: new Vector3(0, 0, 0),
  physicalPixelSize: new Vector3(json.physicalPixelSize[0], json.physicalPixelSize[1], json.physicalPixelSize[2]),
  spatialUnit: json.spatialUnit || "μm",

  numChannels: json.sizeC,
  channelNames: json.channelNames,
  channelColors: undefined, //json.channelColors,

  times: 1,
  timeScale: 1,
  timeUnit: "s",

  numMultiscaleLevels: 1,
  multiscaleLevel: 0,

  transform: {
    translation: new Vector3(0, 0, 0),
    rotation: new Vector3(0, 0, 0),
  },

  userData: json.userData,
});

class RawArrayLoader extends ThreadableVolumeLoader {
  // one array per channel
  data: RawArrayData;
  jsonInfo: RawArrayInfo;

  constructor(rawData: RawArrayData, rawDataInfo: RawArrayInfo) {
    super();
    this.jsonInfo = rawDataInfo;
    this.data = rawData;
    // check consistent dims
    if (
      this.data.shape[0] !== this.jsonInfo.sizeC ||
      this.data.shape[1] !== this.jsonInfo.sizeZ ||
      this.data.shape[2] !== this.jsonInfo.sizeY ||
      this.data.shape[3] !== this.jsonInfo.sizeX
    ) {
      throw new Error("RawArrayLoader: data shape does not match metadata");
    }
  }

  async loadDims(_loadSpec: LoadSpec): Promise<VolumeDims[]> {
    const jsonInfo = this.jsonInfo;

    const d = new VolumeDims();
    d.shape = [1, jsonInfo.sizeC, jsonInfo.sizeZ, jsonInfo.sizeY, jsonInfo.sizeX];
    d.spacing = [1, 1, jsonInfo.physicalPixelSize[2], jsonInfo.physicalPixelSize[1], jsonInfo.physicalPixelSize[0]];
    d.spaceUnit = jsonInfo.spatialUnit || "μm";
    d.dataType = "uint8";
    return [d];
  }

  async createImageInfo(loadSpec: LoadSpec): Promise<LoadedVolumeInfo> {
    return { imageInfo: convertImageInfo(this.jsonInfo), loadSpec };
  }

  async loadRawChannelData(
    imageInfo: ImageInfo,
    loadSpec: LoadSpec,
    onData: RawChannelDataCallback
  ): Promise<{ loadSpec?: LoadSpec }> {
    const requestedChannels = loadSpec.channels;

    for (let chindex = 0; chindex < imageInfo.numChannels; ++chindex) {
      if (requestedChannels && requestedChannels.length > 0 && !requestedChannels.includes(chindex)) {
        continue;
      }
      const volsize = this.data.shape[3] * this.data.shape[2] * this.data.shape[1]; // x*y*z pixels * 1 byte/pixel
      const channelData = new Uint8Array(this.data.buffer.buffer, chindex * volsize, volsize);
      // all data coming from this loader is natively 8-bit
      onData([chindex], [channelData], [DATARANGE_UINT8]);
    }

    const adjustedLoadSpec = {
      ...loadSpec,
      // `subregion` and `multiscaleLevel` are unused by this loader
      subregion: new Box3(new Vector3(0, 0, 0), new Vector3(1, 1, 1)),
      multiscaleLevel: 0,
    };
    return { loadSpec: adjustedLoadSpec };
  }
}

export { RawArrayLoader };

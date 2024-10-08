import { Box3, Vector3 } from "three";

import {
  ThreadableVolumeLoader,
  type LoadSpec,
  type RawChannelDataCallback,
  type LoadedVolumeInfo,
} from "./IVolumeLoader.js";
import { computePackedAtlasDims } from "./VolumeLoaderUtils.js";
import { ImageInfo } from "../ImageInfo.js";
import { VolumeDims } from "../VolumeDims.js";
import { DATARANGE_UINT8, Uint8 } from "../types.js";

// this is the form in which a 4D numpy array arrives as converted
// by jupyterlab into a js object.
// This loader does not yet support multiple time samples.
export type RawArrayData = {
  // expected to be "uint8" always
  dtype: Uint8;
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

const convertImageInfo = (json: RawArrayInfo): ImageInfo => {
  const atlasTileDims = computePackedAtlasDims(json.sizeZ, json.sizeX, json.sizeY);
  return {
    name: json.name,

    // assumption: the data is already sized to fit in our viewer's preferred
    // memory footprint (a tiled atlas texture as of this writing)
    //originalSize: new Vector3(json.sizeX, json.sizeY, json.sizeZ),
    atlasTileDims: [atlasTileDims.x, atlasTileDims.y],
    //volumeSize: new Vector3(json.sizeX, json.sizeY, json.sizeZ),
    subregionSize: [json.sizeX, json.sizeY, json.sizeZ],
    subregionOffset: [0, 0, 0],
    //physicalPixelSize: new Vector3(json.physicalPixelSize[0], json.physicalPixelSize[1], json.physicalPixelSize[2]),
    //spatialUnit: json.spatialUnit || "μm",

    combinedNumChannels: json.sizeC,
    channelNames: json.channelNames,
    channelColors: undefined, //json.channelColors,

    //times: 1,
    //timeScale: 1,
    //timeUnit: "s",

    //numMultiscaleLevels: 1,
    multiscaleLevel: 0,
    multiscaleLevelDims: [
      {
        shape: [1, json.sizeC, json.sizeZ, json.sizeY, json.sizeX],
        spacing: [1, 1, json.physicalPixelSize[2], json.physicalPixelSize[1], json.physicalPixelSize[0]],
        spaceUnit: json.spatialUnit || "μm",
        timeUnit: "s",
        dataType: "uint8",
      },
    ],

    transform: {
      translation: [0, 0, 0],
      rotation: [0, 0, 0],
    },

    userData: json.userData,
  };
};

class RawArrayLoader extends ThreadableVolumeLoader {
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

    const d: VolumeDims = {
      shape: [1, jsonInfo.sizeC, jsonInfo.sizeZ, jsonInfo.sizeY, jsonInfo.sizeX],
      spacing: [1, 1, jsonInfo.physicalPixelSize[2], jsonInfo.physicalPixelSize[1], jsonInfo.physicalPixelSize[0]],
      spaceUnit: jsonInfo.spatialUnit || "μm",
      dataType: "uint8",
      timeUnit: "s", // time unit not specified
    };
    return [d];
  }

  async createImageInfo(loadSpec: LoadSpec): Promise<LoadedVolumeInfo> {
    return { imageInfo: convertImageInfo(this.jsonInfo), loadSpec };
  }

  loadRawChannelData(
    imageInfo: ImageInfo,
    loadSpec: LoadSpec,
    onUpdateMetadata: (imageInfo: undefined, loadSpec: LoadSpec) => void,
    onData: RawChannelDataCallback
  ): Promise<void> {
    const requestedChannels = loadSpec.channels;

    const adjustedLoadSpec = {
      ...loadSpec,
      // `subregion` and `multiscaleLevel` are unused by this loader
      subregion: new Box3(new Vector3(0, 0, 0), new Vector3(1, 1, 1)),
      multiscaleLevel: 0,
    };
    onUpdateMetadata(undefined, adjustedLoadSpec);

    for (let chindex = 0; chindex < imageInfo.combinedNumChannels; ++chindex) {
      if (requestedChannels && requestedChannels.length > 0 && !requestedChannels.includes(chindex)) {
        continue;
      }
      const volSizeBytes = this.data.shape[3] * this.data.shape[2] * this.data.shape[1]; // x*y*z pixels * 1 byte/pixel
      const channelData = new Uint8Array(this.data.buffer.buffer, chindex * volSizeBytes, volSizeBytes);
      // all data coming from this loader is natively 8-bit
      onData([chindex], ["uint8"], [channelData], [DATARANGE_UINT8]);
    }

    return Promise.resolve();
  }
}

export { RawArrayLoader };

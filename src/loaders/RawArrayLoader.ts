import { Box3, Vector2, Vector3 } from "three";

import { IVolumeLoader, LoadSpec, PerChannelCallback, VolumeDims } from "./IVolumeLoader";
import { buildDefaultMetadata, computePackedAtlasDims } from "./VolumeLoaderUtils";
import Volume, { ImageInfo } from "../Volume";
import VolumeCache from "../VolumeCache";

export type RawArrayData = {
  // expected to be "uint8" always
  dtype: "uint8";
  // [c,z,y,x]
  shape: [number, number, number, number];
  // the bits (assumed uint8!!)
  buffer: DataView;
};

export type RawArrayInfo = {
  name: string;
  sizeX: number;
  sizeY: number;
  sizeZ: number;
  sizeC: number;
  // originalSize: new Vector3(sizeX, sizeY, sizeZ),
  // atlasTileDims: new Vector2(8, 8),
  // volumeSize: new Vector3(sizeX, sizeY, sizeZ),
  // subregionSize: new Vector3(sizeX, sizeY, sizeZ),
  // subregionOffset: new Vector3(0, 0, 0),
  physicalPixelSize: [number, number, number];
  spatialUnit: string;

  //numChannels: 3,
  channelNames: string[];

  // times: 1,
  // timeScale: 1,
  // timeUnit: "",

  // numMultiscaleLevels: 1,
  // multiscaleLevel: 0,

  // transform: { translation: new Vector3(0, 0, 0), rotation: new Vector3(0, 0, 0) },
  userData?: Record<string, unknown>;
};

const convertImageInfo = (json: RawArrayInfo): ImageInfo => ({
  name: json.name,

  originalSize: new Vector3(json.sizeX, json.sizeY, json.sizeZ),
  atlasTileDims: computePackedAtlasDims(json.sizeZ, json.sizeX, json.sizeY),
  volumeSize: new Vector3(json.sizeX, json.sizeY, json.sizeZ),
  subregionSize: new Vector3(json.sizeX, json.sizeY, json.sizeZ),
  subregionOffset: new Vector3(0, 0, 0),
  physicalPixelSize: new Vector3(json.physicalPixelSize[0], json.physicalPixelSize[1], json.physicalPixelSize[2]),
  spatialUnit: json.spatialUnit || "μm",

  numChannels: json.sizeC,
  channelNames: json.channelNames,
  channelColors: undefined,//json.channelColors,

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

class RawArrayLoader implements IVolumeLoader {
  // one array per channel
  data: RawArrayData;
  jsonInfo: RawArrayInfo;

  cache?: VolumeCache;

  constructor(rawData: RawArrayData, rawDataInfo: RawArrayInfo, cache?: VolumeCache) {
    this.jsonInfo = rawDataInfo;
    this.data = rawData || { dtype: "uint8", shape: [0, 0, 0, 0], buffer: new DataView(new ArrayBuffer(0)) };
    this.cache = cache;
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

  async createVolume(loadSpec: LoadSpec, onChannelLoaded?: PerChannelCallback): Promise<Volume> {
    const jsonInfo = this.jsonInfo;
    const imageInfo = convertImageInfo(jsonInfo);

    const vol = new Volume(imageInfo, loadSpec, this);
    vol.channelLoadCallback = onChannelLoaded;
    vol.imageMetadata = buildDefaultMetadata(imageInfo);
    return vol;
  }

  async loadVolumeData(vol: Volume, explicitLoadSpec?: LoadSpec, onChannelLoaded?: PerChannelCallback): Promise<void> {
    // if you need to adjust image paths prior to download,
    // now is the time to do it.
    // Try to figure out the urlPrefix from the LoadSpec.
    // For this format we assume the image data is in the same directory as the json file.
    const loadSpec = explicitLoadSpec || vol.loadSpec;

    const requestedChannels = loadSpec.channels;

    vol.loadSpec = {
      ...loadSpec,
      // `subregion` and `multiscaleLevel` are unused by this loader
      subregion: new Box3(new Vector3(0, 0, 0), new Vector3(1, 1, 1)),
      multiscaleLevel: 0,
      // TODO force include ALL channels always?
      //channels: requestedChannels,
    };

    const imageInfo = vol.imageInfo;
    const cache = this.cache;
    for (let chindex = 0; chindex < imageInfo.numChannels; ++chindex) {
      if (requestedChannels && requestedChannels.length > 0 && !requestedChannels.includes(chindex)) {
        continue;
      }
      const cacheResult = cache?.get(`${imageInfo.name}/${chindex}`);
      if (cacheResult) {
        vol.setChannelDataFromVolume(chindex, new Uint8Array(cacheResult));
        onChannelLoaded?.(vol, chindex);
      } else {
        const volsize = this.data.shape[3] * this.data.shape[2] * this.data.shape[1]; // x*y*z pixels * 1 byte/pixel
        vol.setChannelDataFromVolume(chindex, new Uint8Array(this.data.buffer.buffer, chindex * volsize, volsize));
        cache?.insert(`${imageInfo.name}/${chindex}`, vol.channels[chindex].volumeData.buffer);
        onChannelLoaded?.(vol, chindex);
      }
    }
  }
}

export { RawArrayLoader };

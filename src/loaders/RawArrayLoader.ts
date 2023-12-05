import { Box3, Vector3 } from "three";

import { IVolumeLoader, LoadSpec, PerChannelCallback, VolumeDims } from "./IVolumeLoader";
import { buildDefaultMetadata, computePackedAtlasDims } from "./VolumeLoaderUtils";
import Volume, { ImageInfo } from "../Volume";
import VolumeCache from "../VolumeCache";

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

class RawArrayLoader implements IVolumeLoader {
  // one array per channel
  data: RawArrayData;
  jsonInfo: RawArrayInfo;

  cache?: VolumeCache;

  constructor(rawData: RawArrayData, rawDataInfo: RawArrayInfo, cache?: VolumeCache) {
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
      // TODO this loader is its own cache and need not even use the cache?
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

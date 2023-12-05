import { Box3, Vector2, Vector3 } from "three";

import { IVolumeLoader, LoadSpec, PerChannelCallback, VolumeDims } from "./IVolumeLoader";
import { buildDefaultMetadata } from "./VolumeLoaderUtils";
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
  version?: string;

  /** X size of the *original* (not downsampled) volume, in pixels */
  width: number;
  /** Y size of the *original* (not downsampled) volume, in pixels */
  height: number;
  /** Number of rows of z-slice tiles (not pixels) in the texture atlas */
  rows: number;
  /** Number of columns of z-slice tiles (not pixels) in the texture atlas */
  cols: number;
  /** Width of a single atlas tile in pixels */
  tileWidth: number;
  /** Height of a single atlas tile in pixels */
  tileHeight: number;
  /** Width of the texture atlas in pixels; equivalent to `tile_width * cols` */
  atlasWidth: number;
  /** Height of the texture atlas in pixels; equivalent to `tile_height * rows` */
  atlasHeight: number;
  /** Number of tiles in the texture atlas (or number of z-slices in the volume segment) */
  tiles: number;
  /** Physical x size of a single *original* (not downsampled) pixel */
  pixelSizeX: number;
  /** Physical y size of a single *original* (not downsampled) pixel */
  pixelSizeY: number;
  /** Physical z size of a single pixel */
  pixelSizeZ: number;
  /** Symbol of physical unit used by `pixel_size_(x|y|z)` fields */
  pixelSizeUnit?: string;

  channels: number;
  channelNames: string[];
  channelColors?: [number, number, number][];

  times?: number;
  timeScale?: number;
  timeUnit?: string;

  // TODO should be optional?
  transform: {
    translation: [number, number, number];
    rotation: [number, number, number];
  };
  userData?: Record<string, unknown>;
};

const convertImageInfo = (json: RawArrayInfo): ImageInfo => ({
  name: json.name,

  originalSize: new Vector3(json.width, json.height, json.tiles),
  atlasTileDims: new Vector2(json.cols, json.rows),
  volumeSize: new Vector3(json.tileWidth, json.tileHeight, json.tiles),
  subregionSize: new Vector3(json.tileWidth, json.tileHeight, json.tiles),
  subregionOffset: new Vector3(0, 0, 0),
  physicalPixelSize: new Vector3(json.pixelSizeX, json.pixelSizeY, json.pixelSizeZ),
  spatialUnit: json.pixelSizeUnit || "μm",

  numChannels: json.channels,
  channelNames: json.channelNames,
  channelColors: json.channelColors,

  times: json.times || 1,
  timeScale: json.timeScale || 1,
  timeUnit: json.timeUnit || "s",

  numMultiscaleLevels: 1,
  multiscaleLevel: 0,

  transform: {
    translation: json.transform?.translation
      ? new Vector3().fromArray(json.transform.translation)
      : new Vector3(0, 0, 0),
    rotation: json.transform?.rotation ? new Vector3().fromArray(json.transform.rotation) : new Vector3(0, 0, 0),
  },

  userData: json.userData,
});

class RawArrayLoader implements IVolumeLoader {
  // one array per channel
  data: RawArrayData;
  jsonInfo: RawArrayInfo;

  cache?: VolumeCache;

  constructor(rawData?: RawArrayData, rawDataInfo?: RawArrayInfo, cache?: VolumeCache) {
    this.jsonInfo = rawDataInfo || {
      name: "rawarray",
      width: 0,
      height: 0,
      rows: 0,
      cols: 0,
      tileWidth: 0,
      tileHeight: 0,
      atlasWidth: 0,
      atlasHeight: 0,
      tiles: 0,
      pixelSizeX: 0,
      pixelSizeY: 0,
      pixelSizeZ: 0,
      channels: 0,
      channelNames: [],
      transform: { translation: [0, 0, 0], rotation: [0, 0, 0] },
    };
    this.data = rawData || { dtype: "uint8", shape: [0, 0, 0, 0], buffer: new DataView(new ArrayBuffer(0)) };
    this.cache = cache;
  }

  async loadDims(_loadSpec: LoadSpec): Promise<VolumeDims[]> {
    const jsonInfo = this.jsonInfo;

    const d = new VolumeDims();
    d.shape = [jsonInfo.times || 1, jsonInfo.channels, jsonInfo.tiles, jsonInfo.tileHeight, jsonInfo.tileWidth];
    d.spacing = [1, 1, jsonInfo.pixelSizeZ, jsonInfo.pixelSizeY, jsonInfo.pixelSizeX];
    d.spaceUnit = jsonInfo.pixelSizeUnit || "μm";
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

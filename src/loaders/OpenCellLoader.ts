import { Vector2, Vector3 } from "three";

import {
  ThreadableVolumeLoader,
  LoadSpec,
  RawChannelDataCallback,
  VolumeDims,
  LoadedVolumeInfo,
} from "./IVolumeLoader.js";
import { ImageInfo } from "../Volume.js";
import { JsonImageInfoLoader } from "./JsonImageInfoLoader.js";

class OpenCellLoader extends ThreadableVolumeLoader {
  async loadDims(_: LoadSpec): Promise<VolumeDims[]> {
    const d = new VolumeDims();
    d.shape = [1, 2, 27, 600, 600];
    d.spacing = [1, 1, 2, 1, 1];
    d.spaceUnit = ""; // unknown unit.
    d.dataType = "uint8";
    return [d];
  }

  async createImageInfo(_loadSpec: LoadSpec): Promise<LoadedVolumeInfo> {
    const numChannels = 2;

    // we know these are standardized to 600x600, two channels, one channel per jpg.
    const chnames: string[] = ["DNA", "Structure"];

    const imgdata: ImageInfo = {
      name: "TEST",

      originalSize: new Vector3(600, 600, 27),
      atlasTileDims: new Vector2(27, 1),
      volumeSize: new Vector3(600, 600, 27),
      subregionSize: new Vector3(600, 600, 27),
      subregionOffset: new Vector3(0, 0, 0),
      physicalPixelSize: new Vector3(1, 1, 2),
      spatialUnit: "µm",

      numChannels: numChannels,
      channelNames: chnames,

      times: 1,
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

  loadRawChannelData(
    imageInfo: ImageInfo,
    _loadSpec: LoadSpec,
    onData: RawChannelDataCallback
  ): Promise<Record<string, never>> {
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

    const w = imageInfo.atlasTileDims.x * imageInfo.volumeSize.x;
    const h = imageInfo.atlasTileDims.y * imageInfo.volumeSize.y;
    JsonImageInfoLoader.loadVolumeAtlasData(urls, (ch, data) => onData(ch, data, [[0, 255]], [w, h]));
    return Promise.resolve({});
  }
}

export { OpenCellLoader };

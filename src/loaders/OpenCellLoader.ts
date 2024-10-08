import { ThreadableVolumeLoader, LoadSpec, RawChannelDataCallback, LoadedVolumeInfo } from "./IVolumeLoader.js";
import { computeAtlasSize, ImageInfo } from "../ImageInfo.js";
import { VolumeDims } from "../VolumeDims.js";
import { JsonImageInfoLoader } from "./JsonImageInfoLoader.js";
import { DATARANGE_UINT8 } from "../types.js";

class OpenCellLoader extends ThreadableVolumeLoader {
  async loadDims(_: LoadSpec): Promise<VolumeDims[]> {
    const d: VolumeDims = {
      shape: [1, 2, 27, 600, 600],
      spacing: [1, 1, 2, 1, 1],
      spaceUnit: "", // unknown unit.
      dataType: "uint8",
      timeUnit: "",
    };
    return [d];
  }

  async createImageInfo(_loadSpec: LoadSpec): Promise<LoadedVolumeInfo> {
    const numChannels = 2;

    // we know these are standardized to 600x600, two channels, one channel per jpg.
    const chnames: string[] = ["DNA", "Structure"];

    const imgdata: ImageInfo = {
      name: "TEST",

      //originalSize: new Vector3(600, 600, 27),
      atlasTileDims: [27, 1],
      //volumeSize: new Vector3(600, 600, 27),
      subregionSize: [600, 600, 27],
      subregionOffset: [0, 0, 0],
      //physicalPixelSize: new Vector3(1, 1, 2),
      //spatialUnit: "µm",

      combinedNumChannels: numChannels,
      channelNames: chnames,

      //times: 1,
      //timeScale: 1,
      //timeUnit: "",

      //numMultiscaleLevels: 1,
      multiscaleLevel: 0,
      multiscaleLevelDims: [
        {
          shape: [1, numChannels, 27, 600, 600],
          spacing: [1, 1, 2, 1, 1],
          spaceUnit: "µm",
          timeUnit: "",
          dataType: "uint8",
        },
      ],

      transform: {
        translation: [0, 0, 0],
        rotation: [0, 0, 0],
      },
    };

    // This loader uses no fields from `LoadSpec`. Initialize volume with defaults.
    return { imageInfo: imgdata, loadSpec: new LoadSpec() };
  }

  loadRawChannelData(
    imageInfo: ImageInfo,
    _loadSpec: LoadSpec,
    _onUpdateMetadata: () => void,
    onData: RawChannelDataCallback
  ): Promise<void> {
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

    //const w = imageInfo.atlasTileDims[0] * imageInfo.volumeSize.x;
    //const h = imageInfo.atlasTileDims[1] * imageInfo.volumeSize.y;
    const [w, h] = computeAtlasSize(imageInfo);
    // all data coming from this loader is natively 8-bit
    return JsonImageInfoLoader.loadVolumeAtlasData(urls, (ch, dtype, data) =>
      onData(ch, dtype, data, [DATARANGE_UINT8], [w, h])
    );
  }
}

export { OpenCellLoader };

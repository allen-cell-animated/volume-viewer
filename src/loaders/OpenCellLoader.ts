import { Vector2, Vector3 } from "three";

import { IVolumeLoader, LoadSpec, PerChannelCallback, VolumeDims } from "./IVolumeLoader";
import { buildDefaultMetadata } from "./VolumeLoaderUtils";
import { ImageInfo } from "../Volume";
import Volume from "../Volume";
import { JsonImageInfoLoader } from "./JsonImageInfoLoader";

class OpenCellLoader implements IVolumeLoader {
  async loadDims(_: LoadSpec): Promise<VolumeDims[]> {
    const d = new VolumeDims();
    d.subpath = "";
    d.shape = [1, 2, 27, 600, 600];
    d.spacing = [1, 1, 2, 1, 1];
    d.spaceUnit = ""; // unknown unit.
    d.dataType = "uint8";
    return [d];
  }

  async createVolume(_: LoadSpec): Promise<Volume> {
    const numChannels = 2;

    // we know these are standardized to 600x600, two channels, one channel per jpg.
    const chnames: string[] = ["DNA", "Structure"];

    const imgdata: ImageInfo = {
      name: "TEST",
      version: "1.0",

      originalSize: new Vector2(600, 600),
      atlasTileDims: new Vector2(27, 1),
      volumeSize: new Vector3(600, 600, 27),
      regionSize: new Vector3(600, 600, 27),
      regionOffset: new Vector3(0, 0, 0),
      physicalPixelSize: new Vector3(1, 1, 2),
      spatialUnit: "µm",

      numChannels: numChannels,
      channelNames: chnames,

      times: 1,
      timeScale: 1,
      timeUnit: "",

      transform: {
        translation: new Vector3(0, 0, 0),
        rotation: new Vector3(0, 0, 0),
      },
    };

    // got some data, now let's construct the volume.
    const vol = new Volume(imgdata);
    vol.imageMetadata = buildDefaultMetadata(imgdata);
    return vol;
  }

  loadVolumeData(vol: Volume, onChannelLoaded: PerChannelCallback): void {
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

    JsonImageInfoLoader.loadVolumeAtlasData(vol, urls, onChannelLoaded);
  }
}

export { OpenCellLoader };

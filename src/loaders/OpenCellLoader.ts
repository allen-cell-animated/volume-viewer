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
    d.spatialUnit = ""; // unknown unit.
    d.dataType = "uint8";
    return [d];
  }

  async createVolume(_: LoadSpec): Promise<Volume> {
    const numChannels = 2;

    // we know these are standardized to 600x600, two channels, one channel per jpg.
    const chnames: string[] = ["DNA", "Structure"];

    /* eslint-disable @typescript-eslint/naming-convention */
    const imgdata: ImageInfo = {
      width: 600,
      height: 600,
      channels: numChannels,
      channel_names: chnames,
      rows: 27,
      cols: 1,
      tiles: 27,
      tile_width: 600,
      tile_height: 600,
      // for webgl reasons, it is best for atlas_width and atlas_height to be <= 2048
      // and ideally a power of 2.  This generally implies downsampling the original volume data for display in this viewer.
      atlas_width: 600,
      atlas_height: 16200,
      pixel_size_x: 1,
      pixel_size_y: 1,
      pixel_size_z: 2,
      name: "TEST",
      version: "1.0",
      pixel_size_unit: "µm",
      transform: {
        translation: [0, 0, 0],
        rotation: [0, 0, 0],
      },
      times: 1,
    };
    /* eslint-enable @typescript-eslint/naming-convention */

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

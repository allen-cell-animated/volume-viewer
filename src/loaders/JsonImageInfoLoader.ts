import { IVolumeLoader, LoadSpec, VolumeDims } from "./IVolumeLoader";
import { ImageInfo } from "../Volume";

class JsonImageInfoLoader implements IVolumeLoader {
  async loadDims(loadSpec: LoadSpec): Promise<VolumeDims[]> {
    const response = await fetch(loadSpec.url);
    const myJson = await response.json();
    const imageInfo = myJson as ImageInfo;
    imageInfo.pixel_size_unit = imageInfo.pixel_size_unit || "μm";

    const d = new VolumeDims();
    d.subpath = "";
    d.shape = [imageInfo.times, imageInfo.channels, imageInfo.tiles, imageInfo.tile_height, imageInfo.tile_width];
    d.spacing = [1, 1, imageInfo.pixel_size_z, imageInfo.pixel_size_y, imageInfo.pixel_size_x];
    d.spatialUnit = imageInfo.pixel_size_unit;
    d.dataType = "uint8";
    return [d];
  }
}

export { JsonImageInfoLoader };

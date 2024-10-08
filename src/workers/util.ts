import { Box3, Vector3 } from "three";
import { LoadSpec } from "../loaders/IVolumeLoader";
import { ImageInfo2 } from "../ImageInfo";

/** Recreates a `LoadSpec` that has just been sent to/from a worker to restore three.js object prototypes */
export function rebuildLoadSpec(spec: LoadSpec): LoadSpec {
  return {
    ...spec,
    subregion: new Box3(new Vector3().copy(spec.subregion.min), new Vector3().copy(spec.subregion.max)),
  };
}

/** Recreates an `ImageInfo` that has just been sent to/from a worker to restore three.js object prototypes */
export function rebuildImageInfo(imageInfo: ImageInfo2): ImageInfo2 {
  return {
    ...imageInfo,
    //originalSize: new Vector3().copy(imageInfo.originalSize),
    //atlasTileDims: new Vector2().copy(imageInfo.atlasTileDims),
    //volumeSize: new Vector3().copy(imageInfo.volumeSize),
    //subregionSize: new Vector3().copy(imageInfo.subregionSize),
    //subregionOffset: new Vector3().copy(imageInfo.subregionOffset),
    //physicalPixelSize: new Vector3().copy(imageInfo.physicalPixelSize),
    //transform: {
    //  translation: new Vector3().copy(imageInfo.transform.translation),
    //  rotation: new Vector3().copy(imageInfo.transform.rotation),
    //},
  };
}

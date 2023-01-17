import { IVolumeLoader, LoadSpec, VolumeDims } from "./IVolumeLoader";
import { fromUrl } from "geotiff";

class TiffLoader implements IVolumeLoader {
  async loadDims(loadSpec: LoadSpec): Promise<VolumeDims[]> {
    const tiff = await fromUrl(loadSpec.url);
    // DO NOT DO THIS, ITS SLOW
    // const imagecount = await tiff.getImageCount();
    // read the FIRST image
    const image = await tiff.getImage();

    const tiffimgdesc = image.getFileDirectory().ImageDescription;
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(tiffimgdesc, "text/xml");
    const omeEl = xmlDoc.getElementsByTagName("OME")[0];
    const image0El = omeEl.getElementsByTagName("Image")[0];
    const pixelsEl = image0El.getElementsByTagName("Pixels")[0];
    const sizex = Number(pixelsEl.getAttribute("SizeX"));
    const sizey = Number(pixelsEl.getAttribute("SizeY"));
    const sizez = Number(pixelsEl.getAttribute("SizeZ"));
    const sizec = Number(pixelsEl.getAttribute("SizeC"));
    const sizet = Number(pixelsEl.getAttribute("SizeT"));
    const unit = pixelsEl.getAttribute("PhysicalSizeXUnit");
    const pixeltype = pixelsEl.getAttribute("Type");
    //const dimensionorder: string = pixelsEl.getAttribute("DimensionOrder") || "XYZCT";

    // ignoring units for now
    const pixelsizex = Number(pixelsEl.getAttribute("PhysicalSizeX"));
    const pixelsizey = Number(pixelsEl.getAttribute("PhysicalSizeY"));
    const pixelsizez = Number(pixelsEl.getAttribute("PhysicalSizeZ"));

    const d = new VolumeDims();
    d.subpath = "";
    d.shape = [sizet, sizec, sizez, sizey, sizex];
    d.spacing = [1, 1, pixelsizez, pixelsizey, pixelsizex];
    d.spatialUnit = unit ? unit : "micron";
    d.dataType = pixeltype ? pixeltype : "uint8";
    return [d];
  }
}

export { TiffLoader };

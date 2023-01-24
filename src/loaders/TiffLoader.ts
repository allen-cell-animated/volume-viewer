import { IVolumeLoader, LoadSpec, PerChannelCallback, VolumeDims } from "./IVolumeLoader";
import { computePackedAtlasDims } from "./VolumeLoaderUtils";
import { ImageInfo } from "../Volume";
import Volume from "../Volume";

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

  async createVolume(loadSpec: LoadSpec, onChannelLoaded: PerChannelCallback): Promise<Volume> {
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
    const dimensionorder: string = pixelsEl.getAttribute("DimensionOrder") || "XYZCT";

    // ignoring units for now
    const pixelsizex = Number(pixelsEl.getAttribute("PhysicalSizeX"));
    const pixelsizey = Number(pixelsEl.getAttribute("PhysicalSizeY"));
    const pixelsizez = Number(pixelsEl.getAttribute("PhysicalSizeZ"));
    const channelnames: string[] = [];
    const channelsEls = pixelsEl.getElementsByTagName("Channel");
    for (let i = 0; i < channelsEls.length; ++i) {
      const name = channelsEls[i].getAttribute("Name");
      const id = channelsEls[i].getAttribute("ID");
      channelnames.push(name ? name : id ? id : "Channel" + i);
    }

    // compare with sizex, sizey
    //const width = image.getWidth();
    //const height = image.getHeight();

    // TODO allow user setting of this downsampling info?
    // TODO allow ROI selection: range of x,y,z,c for a given t
    const { nrows, ncols } = computePackedAtlasDims(sizez, sizex, sizey);
    // fit tiles to max of 2048x2048?
    const targetSize = 2048;
    const tilesizex = Math.floor(targetSize / ncols);
    const tilesizey = Math.floor(targetSize / nrows);

    // load tiff and check metadata

    /* eslint-disable @typescript-eslint/naming-convention */
    const imgdata: ImageInfo = {
      width: sizex,
      height: sizey,
      channels: sizec,
      channel_names: channelnames,
      rows: nrows,
      cols: ncols,
      tiles: sizez,
      tile_width: tilesizex,
      tile_height: tilesizey,
      // for webgl reasons, it is best for atlas_width and atlas_height to be <= 2048
      // and ideally a power of 2.  This generally implies downsampling the original volume data for display in this viewer.
      atlas_width: tilesizex * ncols,
      atlas_height: tilesizey * nrows,
      pixel_size_x: pixelsizex,
      pixel_size_y: pixelsizey,
      pixel_size_z: pixelsizez,
      name: "TEST",
      version: "1.0",
      pixel_size_unit: unit || "",
      transform: {
        translation: [0, 0, 0],
        rotation: [0, 0, 0],
      },
      times: sizet,
    };
    /* eslint-enable @typescript-eslint/naming-convention */

    const vol = new Volume(imgdata);
    // do each channel on a worker?
    for (let channel = 0; channel < sizec; ++channel) {
      const params = {
        channel: channel,
        // these are target xy sizes for the in-memory volume data
        // they may or may not be the same size as original xy sizes
        tilesizex: tilesizex,
        tilesizey: tilesizey,
        sizec: sizec,
        sizez: sizez,
        dimensionOrder: dimensionorder,
        bytesPerSample: pixeltype === "uint8" ? 1 : pixeltype === "uint16" ? 2 : 4,
        url: loadSpec.url,
      };
      const worker = new Worker(new URL("../workers/FetchTiffWorker", import.meta.url));
      worker.onmessage = function (e) {
        const u8 = e.data.data;
        const channel = e.data.channel;
        vol.setChannelDataFromVolume(channel, u8);
        if (onChannelLoaded) {
          // make up a unique name? or have caller pass this in?
          onChannelLoaded(loadSpec.url, vol, channel);
        }
        worker.terminate();
      };
      worker.onerror = function (e) {
        alert("Error: Line " + e.lineno + " in " + e.filename + ": " + e.message);
      };
      worker.postMessage(params);
    }
    return vol;
  }
}

export { TiffLoader };

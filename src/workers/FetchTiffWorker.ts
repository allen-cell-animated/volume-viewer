import "regenerator-runtime";

import { fromUrl } from "geotiff";

type TypedArray =
  | Uint8Array
  | Int8Array
  | Uint16Array
  | Int16Array
  | Uint32Array
  | Int32Array
  | Float32Array
  | Float64Array;

self.onmessage = async function (e) {
  // TODO index images by time
  const time = e.data.time;

  const channelIndex = e.data.channel;
  const tilesizex = e.data.tilesizex;
  const tilesizey = e.data.tilesizey;
  const sizez = e.data.sizez;
  const sizec = e.data.sizec;
  const dimensionOrder = e.data.dimensionOrder;
  const bytesPerSample = e.data.bytesPerSample;
  console.log("Begin fetching channel ", channelIndex);

  const tiff = await fromUrl(e.data.url);

  const u16 = new Uint16Array(tilesizex * tilesizey * sizez);
  const u8 = new Uint8Array(tilesizex * tilesizey * sizez);
  // load the images of this channel from the tiff
  // today assume TCZYX so the slices are already in order.
  let startindex = 0;
  let incrementz = 1;
  if (dimensionOrder === "XYZCT") {
    // we have XYZCT which is the "good" case
    // TCZYX
    startindex = sizez * channelIndex;
    incrementz = 1;
  } else if (dimensionOrder === "XYCZT") {
    // we have to loop differently to increment channels
    // TZCYX
    startindex = channelIndex;
    incrementz = sizec;
  }
  for (let imageIndex = startindex, zslice = 0; zslice < sizez; imageIndex += incrementz, ++zslice) {
    const image = await tiff.getImage(imageIndex);
    // download and downsample on client
    const result = await image.readRasters({ width: tilesizex, height: tilesizey });
    const arrayresult: TypedArray = Array.isArray(result) ? result[0] : result;
    // deposit in full channel array in the right place
    const offset = zslice * tilesizex * tilesizey;
    if (arrayresult.BYTES_PER_ELEMENT === 2) {
      u16.set(arrayresult, offset);
    } else if (arrayresult.BYTES_PER_ELEMENT === 1) {
      u8.set(arrayresult, offset);
    } else {
      console.log("byte size not supported yet");
    }
  }
  // all slices collected, now resample 16-to-8 bits
  if (bytesPerSample === 2) {
    let chmin = 65535; //metadata.channels[i].window.min;
    let chmax = 0; //metadata.channels[i].window.max;
    // find min and max (only of data we are sampling?)
    for (let j = 0; j < u16.length; ++j) {
      const val = u16[j];
      if (val < chmin) {
        chmin = val;
      }
      if (val > chmax) {
        chmax = val;
      }
    }
    for (let j = 0; j < u16.length; ++j) {
      u8[j] = ((u16[j] - chmin) / (chmax - chmin)) * 255;
    }
  } else if (bytesPerSample === 1) {
    // no op; keep u8
  } else {
    console.log("byte size not supported yet");
  }
  const results = { data: u8, channel: channelIndex };
  postMessage(results, [results.data.buffer]);
};

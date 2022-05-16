import { HTTPStore, openArray, NestedArray, TypedArray } from "zarr";

function convertChannel(channelData: TypedArray[][], nx: number, ny: number, nz: number, dtype: string): Uint8Array {
  console.log("begin convert channel");
  const npixels = nx * ny * nz;
  const u8 = new Uint8Array(npixels);
  const xy = nx * ny;

  if (dtype === "|u1") {
    // flatten the 3d array and convert to uint8
    // todo test perf with a loop over x,y,z instead
    for (let j = 0; j < npixels; ++j) {
      const slice = Math.floor(j / xy);
      const yrow = Math.floor(j / nx) - slice * ny;
      const xcol = j % nx;
      u8[j] = channelData[slice][yrow][xcol];
    }
  } else {
    let chmin = 65535; //metadata.channels[i].window.min;
    let chmax = 0; //metadata.channels[i].window.max;
    // find min and max
    for (let j = 0; j < npixels; ++j) {
      const slice = Math.floor(j / xy);
      const yrow = Math.floor(j / nx) - slice * ny;
      const xcol = j % nx;
      const val = channelData[slice][yrow][xcol];
      if (val < chmin) {
        chmin = val;
      }
      if (val > chmax) {
        chmax = val;
      }
    }
    // flatten the 3d array and convert to uint8
    for (let j = 0; j < npixels; ++j) {
      const slice = Math.floor(j / xy);
      const yrow = Math.floor(j / nx) - slice * ny;
      const xcol = j % nx;
      u8[j] = ((channelData[slice][yrow][xcol] - chmin) / (chmax - chmin)) * 255;
    }
  }
  console.log("end convert channel");

  return u8;
}

self.onmessage = function (e) {
  const time = e.data.time;
  const channelIndex = e.data.channel;
  const store = new HTTPStore(e.data.urlStore);
  openArray({ store: store, path: e.data.path, mode: "r" })
    .then((level) => {
      return level.get([time, channelIndex, null, null, null]);
    })
    .then((channel) => {
      channel = channel as NestedArray<TypedArray>;
      const nz = channel.shape[0];
      const ny = channel.shape[1];
      const nx = channel.shape[2];
      // TODO put this in a webworker??
      const u8: Uint8Array = convertChannel(channel.data as TypedArray[][], nx, ny, nz, channel.dtype);
      const results = { data: u8, channel: channelIndex };
      postMessage(results, [results.data.buffer]);

      // TODO excute on postMessage
      // console.log("begin setchannel and callback");
      // vol.setChannelDataFromVolume(i, u8);
      // if (callback) {
      //   // make up a unique name? or have caller pass this in?
      //   callback(urlStore + "/" + imageName, i);
      // }
      // console.log("end setchannel and callback");
    });
};

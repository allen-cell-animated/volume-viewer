import { HTTPStore, openArray, NestedArray, TypedArray } from "zarr";

function convertChannel(
  channelData: TypedArray[][],
  nx: number,
  ny: number,
  nz: number,
  dtype: string,
  downsampleZ: number
): Uint8Array {
  const nresultpixels = nx * ny * Math.ceil(nz / downsampleZ);
  const u8 = new Uint8Array(nresultpixels);
  const xy = nx * ny;

  if (dtype === "|u1") {
    // flatten the 3d array and convert to uint8
    // todo test perf with a loop over x,y,z instead
    for (let z = 0, slice = 0; z < nz; z += downsampleZ, ++slice) {
      for (let j = 0; j < xy; ++j) {
        const yrow = Math.floor(j / nx);
        const xcol = j % nx;
        u8[j + slice * xy] = channelData[z][yrow][xcol];
      }
    }
  } else {
    let chmin = 65535; //metadata.channels[i].window.min;
    let chmax = 0; //metadata.channels[i].window.max;
    // find min and max (only of data we are sampling?)
    for (let z = 0; z < nz; z += downsampleZ) {
      for (let j = 0; j < xy; ++j) {
        const yrow = Math.floor(j / nx);
        const xcol = j % nx;
        const val = channelData[z][yrow][xcol];
        if (val < chmin) {
          chmin = val;
        }
        if (val > chmax) {
          chmax = val;
        }
      }
    }
    // flatten the 3d array and convert to uint8
    for (let z = 0, slice = 0; z < nz; z += downsampleZ, ++slice) {
      for (let j = 0; j < xy; ++j) {
        const yrow = Math.floor(j / nx);
        const xcol = j % nx;
        u8[j + slice * xy] = ((channelData[z][yrow][xcol] - chmin) / (chmax - chmin)) * 255;
      }
    }
  }

  return u8;
}

self.onmessage = function (e) {
  const time = e.data.time;
  const channelIndex = e.data.channel;
  const downsampleZ = e.data.downsampleZ;
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

      const u8: Uint8Array = convertChannel(channel.data as TypedArray[][], nx, ny, nz, channel.dtype, downsampleZ);
      const results = { data: u8, channel: channelIndex };
      postMessage(results, [results.data.buffer]);
    });
};

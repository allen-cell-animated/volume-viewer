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
    let chmin = channelData[0][0][0];
    let chmax = channelData[0][0][0];
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

self.onmessage = async (e) => {
  const time = e.data.time;
  const channelIndex = e.data.channel;
  const downsampleZ = e.data.downsampleZ;
  const store = new HTTPStore(e.data.urlStore);
  const level = await openArray({ store: store, path: e.data.path, mode: "r" });

  // build slice spec
  // assuming ZYX are the last three dimensions:
  const sliceSpec = [null, null, null];
  if (channelIndex > -1) {
    sliceSpec.unshift(channelIndex);
  }
  if (time > -1) {
    sliceSpec.unshift(time);
  }
  const channel = (await level.get(sliceSpec)) as NestedArray<TypedArray>;

  const nz = channel.shape[0];
  const ny = channel.shape[1];
  const nx = channel.shape[2];

  const u8: Uint8Array = convertChannel(channel.data as TypedArray[][], nx, ny, nz, channel.dtype, downsampleZ);
  const results = { data: u8, channel: channelIndex === -1 ? 0 : channelIndex };
  postMessage(results, [results.data.buffer]);
};

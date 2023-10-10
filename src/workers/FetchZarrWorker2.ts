import { TypedArray } from "zarr";
import { Box3 } from "three";

export type CombineZarrMessage = {
  chunks: Uint8Array[][][];
  chunkSize: [number, number, number];
  normResultSize: Box3;
};

function convertChannel(channelData: TypedArray, dtype: string): Uint8Array {
  if (dtype === "|u1") {
    return channelData as Uint8Array;
  }

  const u8 = new Uint8Array(channelData.length);

  // get min and max
  let min = channelData[0];
  let max = channelData[0];
  channelData.forEach((val: number) => {
    min = Math.min(min, val);
    max = Math.max(max, val);
  });

  // normalize and convert to u8
  const range = max - min;
  channelData.forEach((val: number, idx: number) => {
    u8[idx] = ((val - min) / range) * 255;
  });

  return u8;
}

self.onmessage = (e: MessageEvent<CombineZarrMessage>) => {
  const { chunks, chunkSize, normResultSize } = e.data;
  const { min, max } = normResultSize;
  const resultSize = (max.x - min.x) * (max.y - min.y) * (max.z - min.z);
  const result = new Uint8Array(resultSize);

  const [chunkSizeZ, chunkSizeY, chunkSizeX] = chunkSize;

  let i = 0;
  for (let z = min.z; z < max.z; z++) {
    const chunkZ = Math.floor(z / chunkSizeZ);
    const offsetZ = z - chunkZ * chunkSizeZ;

    for (let y = min.y; y < max.y; y++) {
      const chunkY = Math.floor(y / chunkSizeY);
      const offsetY = y - chunkY * chunkSizeY;

      for (let x = min.x; x < max.x; x++) {
        const chunkX = Math.floor(x / chunkSizeX);
        const offsetX = x - chunkX * chunkSizeX;

        const chunk = chunks[chunkZ][chunkY][chunkX];
        const chunkIndex = offsetZ * chunkSizeY * chunkSizeX + offsetY * chunkSizeX + offsetX;
        result[i] = chunk[chunkIndex];
        i++;
      }
    }
  }

  const u8 = convertChannel(result, "float32");

  self.postMessage(u8, [u8.buffer]);
};

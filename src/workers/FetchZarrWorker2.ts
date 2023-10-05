import { Box3 } from "three";

export type CombineZarrMessage = {
  chunks: Uint8Array[][][];
  chunkSize: [number, number, number];
  normResultSize: Box3;
};

self.onmessage = (e: MessageEvent<CombineZarrMessage>) => {
  const { chunks, chunkSize, normResultSize } = e.data;
  const { min, max } = normResultSize;
  console.log(min);
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

  self.postMessage(result, [result.buffer]);
};

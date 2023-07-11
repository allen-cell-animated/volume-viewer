import { HTTPStore, openArray, slice, TypedArray } from "zarr";
import { RawArray } from "zarr/types/rawArray";
import { Slice } from "zarr/types/core/types";
import { LoadSpec } from "../loaders/IVolumeLoader";

export type FetchZarrMessage = {
  spec: LoadSpec;
  channel: number;
  path: string;
};

function convertChannelRaw(channelData: TypedArray, dtype: string): Uint8Array {
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

self.onmessage = async (e: MessageEvent<FetchZarrMessage>) => {
  const time = e.data.spec.time;
  const channelIndex = e.data.channel;
  const store = new HTTPStore(e.data.spec.url);
  const level = await openArray({ store: store, path: e.data.path, mode: "r" });

  // build slice spec
  // assuming ZYX are the last three dimensions:
  const { minx, maxx, miny, maxy, minz, maxz } = e.data.spec;
  const sliceSpec: (Slice | number)[] = [
    slice(minz || null, maxz),
    slice(miny || null, maxy),
    slice(minx || null, maxx),
  ];
  if (channelIndex > -1) {
    sliceSpec.unshift(channelIndex);
  }
  if (time > -1) {
    sliceSpec.unshift(time);
  }
  const channel = (await level.getRaw(sliceSpec)) as RawArray;

  const u8: Uint8Array = convertChannelRaw(channel.data, channel.dtype);
  const results = { data: u8, channel: channelIndex === -1 ? 0 : channelIndex };
  postMessage(results, [results.data.buffer]);
};

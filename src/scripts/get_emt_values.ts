import fs from "fs";
import { OMEZarrLoader } from "../loaders/OmeZarrLoader";
import { LoadSpec } from "../loaders/IVolumeLoader";

console.log("hello world");

async function loadZarrDataFromURL(
  url: string,
  channel: number,
  time: number
): Promise<[Uint8Array, [number, number]]> {
  const loader = await OMEZarrLoader.createLoader(url);

  const loadSpec = new LoadSpec();
  loadSpec.time = time;
  loadSpec.scaleLevelBias = 2;
  loadSpec.channels = [channel];

  const { imageInfo } = await loader.createImageInfo(loadSpec);
  console.log("Loading....");
  return await new Promise((resolve, reject) => {
    loader
      .loadRawChannelData(
        imageInfo,
        loadSpec,
        () => {},
        (channelArray, data, range) => {
          if (channelArray[0] !== channel) {
            reject("Something unexpected has happened! Yuh oh!");
          }
          resolve([data[0], range[0]]);
        }
      )
      .catch(reject);
  });
}

const TEST_URL =
  "https://dev-aics-dtp-001.int.allencell.org//assay-dev/computational/data/release/emt-data/colony_extra_22/main/3500006350_20X_P53_D10/raw.ome.zarr";
loadZarrDataFromURL(TEST_URL, 0, 0).then(([data, range]) => console.log(data[0], range));

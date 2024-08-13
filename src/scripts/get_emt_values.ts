import fs from "fs";
import Papa, { UnparseObject } from "papaparse";
import { OMEZarrLoader } from "../loaders/OmeZarrLoader";
import { LoadSpec } from "../loaders/IVolumeLoader";

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

// const EVIL_URL =
// "https://dev-aics-dtp-001.int.allencell.org//assay-dev/computational/data/release/emt-data/colony_extra_22/main/3500006350_20X_P53_D10/raw.ome.zarr/4/0/0/0/0/0";
// console.log(fetch(EVIL_URL).then(async (response) => console.log(await response.text())));

const TEST_URL =
  "https://dev-aics-dtp-001.int.allencell.org//assay-dev/computational/data/release/emt-data/colony_extra_22/main/3500006350_20X_P53_D10/raw.ome.zarr";
loadZarrDataFromURL(TEST_URL, 0, 0).then(([data, range]) => console.log(data[0], range));

async function getChannelMinMax(
  row: { [key: string]: string },
  rowIndex: number,
  channelIndex: number,
  channelTime: number
): Promise<{ min: number; max: number }> {
  // Maybe replace this with Cameron's Zarr loader
  return { min: 0, max: 0 };
}

async function addChannelMinMaxToCsv(csvPath: string, outPath: string): Promise<void> {
  const csvContent = fs.readFileSync(csvPath, "utf8");
  const parsedCsv = Papa.parse(csvContent, { header: true });

  const channel0MinMax: number[][] = [];
  const channel0Timestamp = 0;
  const channel1MinMax: number[][] = [];
  const channel1Timestamp = 120;

  const promises: Promise<void>[] = [];
  for (let i = 0; i < parsedCsv.data.length; i++) {
    const row = parsedCsv.data[i] as { [key: string]: string };

    if (row["ome_zarr_raw_file_path_extra"] === undefined) {
      console.log("No OME Zarr path in row " + i + ", skipping");
      channel0MinMax[i] = [0, 0];
      channel1MinMax[i] = [0, 0];
      continue;
    }

    // Update zarr path to go through dev server so this can be tested without Isilon/Vast access
    const zarrPath = row["ome_zarr_raw_file_path_extra"];
    const zarrUrlPath = zarrPath.replace("/allen/aics/", "https://dev-aics-dtp-001.int.allencell.org/");

    promises.push(
      getChannelMinMax(row, i, 0, channel0Timestamp).then((minMax) => {
        channel0MinMax[i] = [minMax.min, minMax.max];
      })
    );
    promises.push(
      getChannelMinMax(row, i, 1, channel1Timestamp).then((minMax) => {
        channel1MinMax[i] = [minMax.min, minMax.max];
      })
    );
  }

  await Promise.all(promises);

  // Update all rows with the new min and max
  for (let i = 0; i < parsedCsv.data.length; i++) {
    const row = parsedCsv.data[i] as { [key: string]: string };
    row["channel_0_min"] = channel0MinMax[i][0].toString();
    row["channel_0_max"] = channel0MinMax[i][1].toString();
    row["channel_1_min"] = channel1MinMax[i][0].toString();
    row["channel_1_max"] = channel1MinMax[i][1].toString();
    parsedCsv.data[i] = row;
  }

  // TODO: make new URL

  parsedCsv.meta.fields?.push("channel_0_min", "channel_0_max", "channel_1_min", "channel_1_max");

  const newCsv = Papa.unparse(parsedCsv as unknown as UnparseObject<unknown>);
  fs.writeFileSync(outPath, newCsv);
}

const CSV_PATH = "./data.csv";
addChannelMinMaxToCsv(CSV_PATH, "./out.csv").then(() => console.log("Done!"));

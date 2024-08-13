import fs from "fs";
import Papa, { UnparseObject } from "papaparse";
import { OMEZarrLoader } from "../loaders/OmeZarrLoader";
import { LoadSpec } from "../loaders/IVolumeLoader";
import Histogram from "../Histogram";
import { ControlPoint, remapControlPoints } from "../Lut";

async function loadZarrChannelAtTime(
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

async function getAutoIJLevelsForChannelsAtTime(
  url: string,
  channels: { index: number; time: number }[],
  displayTime: number
): Promise<[number, number][]> {
  const channelData = await Promise.all(channels.map(({ index, time }) => loadZarrChannelAtTime(url, index, time)));
  const channelRangesAtDisplayTime = await Promise.all(
    channels.map(async ({ index, time }, indexInArray) => {
      if (time === displayTime) {
        return channelData[indexInArray][1];
      }
      return (await loadZarrChannelAtTime(url, index, displayTime))[1];
    })
  );

  const channelBins = channelData.map(([data]) => new Histogram(data).findAutoIJBins());
  console.log("bins at loaded time:", channelBins);
  const channelBinsAtDisplayTime = channelBins.map(([min, max], index): [number, number] => {
    const [sourceMin, sourceMax] = channelData[index][1];
    const [displayMin, displayMax] = channelRangesAtDisplayTime[index];
    const controlPoints: [ControlPoint, ControlPoint] = [
      { x: min, opacity: 0, color: [255, 255, 255] },
      { x: max, opacity: 255, color: [255, 255, 255] },
    ];
    const remappedPoints = remapControlPoints(controlPoints, sourceMin, sourceMax, displayMin, displayMax, false);
    return [remappedPoints[0].x, remappedPoints[1].x];
  });

  return channelBinsAtDisplayTime;
}

const TEST_URL =
  "https://dev-aics-dtp-001.int.allencell.org//assay-dev/computational/data/release/emt-data/colony_extra_22/main/3500006350_20X_P53_D10/raw.ome.zarr";

// getAutoIJLevelsForChannelsAtTime(
//   TEST_URL,
//   [
//     { index: 0, time: 0 },
//     { index: 1, time: 120 },
//   ],
//   24
// ).then(console.log);

async function addChannelMinMaxToCsv(csvPath: string, outPath: string): Promise<void> {
  const csvContent = fs.readFileSync(csvPath, "utf8");
  const parsedCsv = Papa.parse(csvContent, { header: true });

  // TODO: Declare array at length :) sorry Cameron
  const channelMinMax: [number, number][][] = [];

  const promises: Promise<void>[] = [];
  for (let i = 0; i < parsedCsv.data.length; i++) {
    const row = parsedCsv.data[i] as { [key: string]: string };

    if (row["ome_zarr_raw_file_path_extra"] === undefined) {
      console.log("No OME Zarr path in row " + i + ", skipping");
      channelMinMax[i] = [
        [0, 0],
        [0, 0],
      ];
      continue;
    }

    // Update zarr path to go through dev server so this can be tested without Isilon/Vast access
    const zarrPath = row["ome_zarr_raw_file_path_extra"];
    const zarrUrlPath =
      zarrPath.replace("/allen/aics/", "https://dev-aics-dtp-001.int.allencell.org/") + "/raw.ome.zarr";

    promises.push(
      getAutoIJLevelsForChannelsAtTime(
        zarrUrlPath,
        [
          { index: 0, time: 0 },
          { index: 1, time: 120 },
        ],
        24
      ).then((result: [number, number][]) => {
        channelMinMax[i] = result;
        console.log("Got min max for row " + i, result);
      })
    );
  }

  await Promise.all(promises);

  // Update all rows with the new min and max
  for (let i = 0; i < parsedCsv.data.length; i++) {
    const row = parsedCsv.data[i] as { [key: string]: string };
    row["channel_0_min"] = channelMinMax[i][0][0].toString();
    row["channel_0_max"] = channelMinMax[i][0][1].toString();
    row["channel_1_min"] = channelMinMax[i][1][0].toString();
    row["channel_1_max"] = channelMinMax[i][1][1].toString();
    parsedCsv.data[i] = row;
  }

  // TODO: make new URL

  parsedCsv.meta.fields?.push("channel_0_min", "channel_0_max", "channel_1_min", "channel_1_max");

  const newCsv = Papa.unparse(parsedCsv as unknown as UnparseObject<unknown>);
  fs.writeFileSync(outPath, newCsv);
}

const CSV_PATH = "./data.csv";
addChannelMinMaxToCsv(CSV_PATH, "./out.csv").then(() => console.log("Done!"));

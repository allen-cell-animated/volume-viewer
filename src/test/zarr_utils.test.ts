import { expect } from "chai";

import { AbsolutePath, SyncReadable } from "@zarrita/storage";
import * as zarr from "@zarrita/core";

import {
  NumericZarrArray,
  OMEDataset,
  OMEMultiscale,
  OmeroTransitionalMetadata,
  TCZYX,
  ZarrSourceMeta,
} from "../loaders/zarr_utils/types";
import WrappedStore from "../loaders/zarr_utils/WrappedStore";
import {
  getDimensionCount,
  getScale,
  matchSourceScaleLevels,
  orderByDimension,
  orderByTCZYX,
  remapAxesToTCZYX,
} from "../loaders/zarr_utils/utils";

const createMockOmeroMetadata = (numChannels: number): OmeroTransitionalMetadata => ({
  id: 0,
  name: "0",
  version: "0.0",
  channels: Array.from({ length: numChannels }, (_, i) => ({
    active: true,
    coefficient: 1,
    color: "ffffffff",
    family: "linear",
    inverted: false,
    label: `channel ${i}`,
    window: { end: 1, max: 1, min: 0, start: 0 },
  })),
});

const createMockMultiscaleMetadata = (scales: number[][]): OMEMultiscale => ({
  name: "0",
  version: "0.0",
  axes: [{ name: "t" }, { name: "c" }, { name: "z" }, { name: "y" }, { name: "x" }],
  datasets: scales.map((scale, idx) => ({
    path: `${idx}`,
    coordinateTransformations: [{ type: "scale", scale }],
  })),
});

class MockStore implements SyncReadable {
  get(_key: AbsolutePath, _opts?: unknown): Uint8Array | undefined {
    return undefined;
  }
}
const MOCK_STORE = new WrappedStore(new MockStore());

const createMockArrays = (shapes: number[][]): Promise<NumericZarrArray[]> => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const promises = shapes.map((shape) => zarr.create(MOCK_STORE, { shape, chunk_shape: shape, data_type: "uint8" }));
  return Promise.all(promises);
};

const createOneMockSource = async (
  shapes: TCZYX<number>[],
  scales: TCZYX<number>[],
  channelOffset: number
): Promise<ZarrSourceMeta> => ({
  scaleLevels: await createMockArrays(scales),
  multiscaleMetadata: createMockMultiscaleMetadata(scales),
  omeroMetadata: createMockOmeroMetadata(shapes[0][1]),
  axesTCZYX: [0, 1, 2, 3, 4],
  channelOffset,
});

type ZarrSourceMockSpec = { shapes: TCZYX<number>[]; scales: TCZYX<number>[] };

const createMockSources = (specs: ZarrSourceMockSpec[]): Promise<ZarrSourceMeta[]> => {
  let channelOffset = 0;
  const sourcePromises = specs.map(({ shapes, scales }) => {
    const result = createOneMockSource(shapes, scales, channelOffset);
    channelOffset += shapes[0][1];
    return result;
  });
  return Promise.all(sourcePromises);
};

const createTwoMockSourceArrs = (specs: ZarrSourceMockSpec[]): Promise<[ZarrSourceMeta[], ZarrSourceMeta[]]> => {
  return Promise.all([createMockSources(specs), createMockSources(specs)]);
};

describe("zarr_utils", () => {
  describe("getDimensionCount", () => {
    it("returns 5 when all 5 dimension indices are positive", () => {
      expect(getDimensionCount([1, 1, 1, 1, 1])).to.equal(5);
    });

    it("recognizes when T, C, or Z is missing", () => {
      for (let dim = 0; dim < 3; dim++) {
        const tczyx: TCZYX<number> = [1, 1, 1, 1, 1];
        tczyx[dim] = -1;
        expect(getDimensionCount(tczyx)).to.equal(4);
      }
    });

    it("returns 2 when all of T, C, and Z are missing", () => {
      expect(getDimensionCount([-1, -1, -1, 1, 1])).to.equal(2);
    });
  });

  describe("remapAxesToTCZYX", () => {
    it("produces an array of indices in T, C, Z, Y, X order", () => {
      const axes = [{ name: "t" }, { name: "c" }, { name: "x" }, { name: "y" }, { name: "z" }];
      expect(remapAxesToTCZYX(axes)).to.deep.equal([0, 1, 4, 3, 2]);
    });

    it("defaults to -1 for missing T, C, or Z axes", () => {
      const axes = [{ name: "x" }, { name: "y" }];
      expect(remapAxesToTCZYX(axes)).to.deep.equal([-1, -1, -1, 1, 0]);
    });
  });
  // TODO: `pickLevelToLoad`

  const VALS_TCZYX: TCZYX<number> = [1, 2, 3, 4, 5];
  describe("orderByDimension", () => {
    it("orders an array in dimension order based on the given indices", () => {
      const order: TCZYX<number> = [3, 1, 4, 0, 2];
      expect(orderByDimension(VALS_TCZYX, order)).to.deep.equal([4, 2, 5, 1, 3]);
    });

    it("excludes the T, C, or Z dimension if its index is negative", () => {
      expect(orderByDimension(VALS_TCZYX, [-1, 0, 1, 3, 2])).to.deep.equal([2, 3, 5, 4]);
      expect(orderByDimension(VALS_TCZYX, [0, -1, 1, 3, 2])).to.deep.equal([1, 3, 5, 4]);
      expect(orderByDimension(VALS_TCZYX, [0, 1, -1, 3, 2])).to.deep.equal([1, 2, 5, 4]);
    });

    it("throws an error if an axis index is out of bounds", () => {
      // Out of bounds for full-size array
      expect(() => orderByDimension(VALS_TCZYX, [0, 1, 2, 3, 5])).to.throw("Unexpected axis index");
      // Out of bounds for smaller array
      expect(() => orderByDimension(VALS_TCZYX, [-1, -1, 0, 3, 1])).to.throw("Unexpected axis index");
    });
  });

  const VALS_DIM: TCZYX<number> = [16, 8, 4, 2, 1];
  describe("orderByTCZYX", () => {
    it("orders an array TCZYX based on the given indices", () => {
      const order: TCZYX<number> = [3, 1, 4, 0, 2];
      expect(orderByTCZYX(VALS_DIM, order, 0)).to.deep.equal([2, 8, 1, 16, 4]);
    });

    it("fills in missing dimensions with a default value", () => {
      const order: TCZYX<number> = [3, 1, 4, -1, 2];
      expect(orderByTCZYX(VALS_DIM, order, 3)).to.deep.equal([2, 8, 1, 3, 4]);
    });

    it("throws an error if an axis index is out of bounds", () => {
      // Out of bounds for full-size array
      expect(() => orderByTCZYX(VALS_DIM, [0, 1, 2, 5, 3], 0)).to.throw("Unexpected axis index");
      // Out of bounds for smaller array
      expect(() => orderByTCZYX(VALS_DIM.slice(2), [-1, 0, 1, 3, 2], 0)).to.throw("Unexpected axis index");
    });
  });

  const MOCK_DATASET: Required<OMEDataset> = {
    path: "0",
    coordinateTransformations: [
      { type: "translation", translation: [0, 0, 0, 0, 0] },
      { type: "scale", scale: [1, 2, 3, 4, 5] },
      { type: "identity" },
    ],
  };
  describe("getScale", () => {
    it("returns the scale transformation for a given dataset", () => {
      expect(getScale(MOCK_DATASET, [0, 1, 2, 3, 4])).to.deep.equal([1, 2, 3, 4, 5]);
    });

    it("orders the scale transformation in TCZYX order", () => {
      expect(getScale(MOCK_DATASET, [3, 1, 4, 0, 2])).to.deep.equal([4, 2, 5, 1, 3]);
    });

    it('defaults to `[1, 1, 1, 1, 1]` if no coordinate transformation of type "scale" is found', () => {
      const dataset = {
        ...MOCK_DATASET,
        coordinateTransformations: MOCK_DATASET.coordinateTransformations.slice(0, 1),
      };
      expect(getScale(dataset, [0, 1, 2, 3, 4])).to.deep.equal([1, 1, 1, 1, 1]);
    });

    it("defaults to `[1, 1, 1, 1, 1]` if no coordinate transformations are present at all", () => {
      expect(getScale({ path: "0" }, [0, 1, 2, 3, 4])).to.deep.equal([1, 1, 1, 1, 1]);
    });
  });

  describe("matchSourceScaleLevels", () => {
    it("does nothing if passed only one source scale level", async () => {
      const [testSource, refSource] = await createTwoMockSourceArrs([
        { shapes: [[5, 5, 5, 5, 5]], scales: [[1, 1, 1, 1, 1]] },
      ]);
      matchSourceScaleLevels(testSource);
      expect(testSource).to.deep.equal(refSource);
    });

    it("does nothing if all source scale levels are the same", async () => {
      const spec: ZarrSourceMockSpec = {
        shapes: [
          [1, 1, 5, 5, 5],
          [1, 1, 10, 10, 10],
        ],
        scales: [
          [1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1],
        ],
      };
      const [testSource, refSource] = await createTwoMockSourceArrs([spec, spec]);
      matchSourceScaleLevels(testSource);
      expect(testSource).to.deep.equal(refSource);
    });

    // it("");
  });
});

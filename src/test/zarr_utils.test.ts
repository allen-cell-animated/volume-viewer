import { expect } from "chai";

import { OMEDataset, TCZYX } from "../loaders/zarr_utils/types";
import {
  getDimensionCount,
  getScale,
  orderByDimension,
  orderByTCZYX,
  remapAxesToTCZYX,
} from "../loaders/zarr_utils/utils";

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
});

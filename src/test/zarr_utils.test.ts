import { expect } from "chai";

import { TCZYX } from "../loaders/zarr_utils/types";
import { getDimensionCount, remapAxesToTCZYX } from "../loaders/zarr_utils/utils";

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
});

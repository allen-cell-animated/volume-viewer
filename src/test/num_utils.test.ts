import { expect } from "chai";

import { formatNumber } from "../utils/num_utils";

describe("num_utils", () => {
  describe("formatNumber", () => {
    it("stringifies integers with 4 or fewer digits", () => {
      expect(formatNumber(4)).to.equal("4");
      expect(formatNumber(-876)).to.equal("-876");
      expect(formatNumber(1234)).to.equal("1234");
      expect(formatNumber(9999)).to.equal("9999");
      expect(formatNumber(-9999)).to.equal("-9999");
    });

    it("rounds decimals to 5 significant figures", () => {
      expect(formatNumber(123.4567)).to.equal("123.46");
      expect(formatNumber(-0.123456)).to.equal("-0.12346");
    });

    it("formats integers with 5 or more digits in scientific notation", () => {
      expect(formatNumber(10000)).to.equal("1.00×10⁴");
      expect(formatNumber(12345)).to.equal("1.23×10⁴");
      expect(formatNumber(99999)).to.equal("1.00×10⁵");
      expect(formatNumber(-12345)).to.equal("-1.23×10⁴");
      expect(formatNumber(123456789012345)).to.equal("1.23×10¹⁴");
    });

    it("formats decimals below hundredths in scientific notation", () => {
      expect(formatNumber(0.01)).to.equal("0.01");
      expect(formatNumber(0.001)).to.equal("1.00×10⁻³");
      expect(formatNumber(0.0009876)).to.equal("9.88×10⁻⁴");
      expect(formatNumber(0.00000000000000123456789012345)).to.equal("1.23×10⁻¹⁵");
    });

    it("does not format zero in scientific notation", () => {
      expect(formatNumber(0)).to.equal("0");
    });

    it("formats numbers which would round to 10000 in scientific notation", () => {
      expect(formatNumber(9999.9)).to.equal("9999.9");
      expect(formatNumber(9999.99)).to.equal("1.00×10⁴");
    });

    it("does not account for numbers which round up to 0.01 in scientific notation", () => {
      expect(formatNumber(0.00999)).to.equal("9.99×10⁻³");
      expect(formatNumber(0.009999)).to.equal("1.00×10⁻²"); // aw shucks
    });

    it("rounds off decimals to the specified number of significant figures", () => {
      expect(formatNumber(123.4567, 3)).to.equal("123");
      expect(formatNumber(123.4567, 4)).to.equal("123.5");
      expect(formatNumber(123.4567, 6)).to.equal("123.457");
      expect(formatNumber(123.4567, 2)).to.equal("123"); // oh well
    });

    it("rounds numbers in scientific notation to the specified number of significant figures", () => {
      expect(formatNumber(12345, 3, 3)).to.equal("1.23×10⁴");
      expect(formatNumber(12345, 4, 4)).to.equal("1.235×10⁴");
      expect(formatNumber(12345, 6, 6)).to.equal("1.23450×10⁴");
    });

    it("rounds numbers in scientific notation to two fewer significant figures than decimals if unspecified", () => {
      expect(formatNumber(12345, 5)).to.equal("1.23×10⁴");
      expect(formatNumber(12345, 6)).to.equal("1.235×10⁴");
      expect(formatNumber(12345, 8)).to.equal("1.23450×10⁴");
    });
  });
});

import { expect } from "chai";

import Histogram from "../Histogram.js";
import VolumeMaker from "../VolumeMaker.js";

describe("test histogram", () => {
  const conedata = VolumeMaker.createCone(128, 128, 128, 24, 128);
  const histogram = new Histogram(conedata);

  describe("binary volume data", () => {
    it("has a min of 255", () => {
      // histogram dataMin is the min nonzero value
      expect(histogram.dataMin).to.equal(255);
    });
    it("has a max of 255", () => {
      expect(histogram.dataMax).to.equal(255);
    });
    it("is created", () => {
      expect(histogram.maxBin).to.equal(255);
      expect(histogram.bins[255]).to.be.greaterThan(0);
      expect(histogram.bins[128]).to.equal(0);
      expect(histogram.bins[0]).to.be.greaterThan(0);
    });
  });

  describe("generated lut from control points", () => {
    const controlPoints = [
      { x: 0, color: [255, 255, 255], opacity: 0 },
      { x: 126, color: [255, 255, 255], opacity: 0 },
      { x: 128, color: [255, 255, 255], opacity: 1.0 },
      { x: 255, color: [255, 255, 255], opacity: 1.0 },
    ];
    const lut = histogram.lutGenerator_fromControlPoints(controlPoints);
    it("has interpolated opacity correctly", () => {
      expect(lut.lut[126 * 4 + 3]).to.equal(0);
      expect(lut.lut[127 * 4 + 3]).to.equal(127);
      expect(lut.lut[128 * 4 + 3]).to.equal(255);
    });
    it("has interpolated color correctly", () => {
      expect(lut.lut[126 * 4]).to.equal(255);
      expect(lut.lut[127 * 4]).to.equal(255);
      expect(lut.lut[128 * 4]).to.equal(255);
    });
  });

  describe("generated lut single control point", () => {
    const controlPoints = [{ x: 127, color: [255, 255, 255], opacity: 1.0 }];
    const lut = histogram.lutGenerator_fromControlPoints(controlPoints);
    it("has interpolated opacity correctly", () => {
      expect(lut.lut[0 * 4 + 3]).to.equal(0);
      expect(lut.lut[126 * 4 + 3]).to.equal(0);
      expect(lut.lut[128 * 4 + 3]).to.equal(255);
      expect(lut.lut[255 * 4 + 3]).to.equal(255);
    });
    it("has interpolated color correctly", () => {
      expect(lut.lut[0 * 4]).to.equal(0);
      expect(lut.lut[126 * 4]).to.equal(0);
      expect(lut.lut[128 * 4]).to.equal(255);
      expect(lut.lut[255 * 4]).to.equal(255);
    });
  });
});

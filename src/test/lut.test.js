import { expect } from "chai";

import Histogram from "../Histogram";
import VolumeMaker from "../VolumeMaker.js";

function clamp(val, cmin, cmax) {
  return Math.min(Math.max(cmin, val), cmax);
}

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

  describe("interpolates opacity across consecutive control points", () => {
    it("has interpolated opacity correctly", () => {
      const controlPoints = [
        { x: 0, color: [255, 255, 255], opacity: 0 },
        { x: 1, color: [255, 255, 255], opacity: 1.0 },
        { x: 255, color: [255, 255, 255], opacity: 1.0 },
      ];
      const lut = histogram.lutGenerator_fromControlPoints(controlPoints);
      expect(lut.lut[0 * 4 + 3]).to.equal(0);
      expect(lut.lut[1 * 4 + 3]).to.equal(255);
      expect(lut.lut[2 * 4 + 3]).to.equal(255);
    });
    it("has interpolated opacity correctly with fractional control point positions", () => {
      const controlPoints = [
        { x: 0, color: [255, 255, 255], opacity: 0 },
        { x: 0.1, color: [255, 255, 255], opacity: 0 },
        { x: 0.9, color: [255, 255, 255], opacity: 1.0 },
        { x: 1, color: [255, 255, 255], opacity: 1.0 },
        { x: 255, color: [255, 255, 255], opacity: 1.0 },
      ];
      const lut = histogram.lutGenerator_fromControlPoints(controlPoints);
      expect(lut.lut[0 * 4 + 3]).to.equal(0);
      expect(lut.lut[1 * 4 + 3]).to.equal(255);
      expect(lut.lut[2 * 4 + 3]).to.equal(255);
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

  describe("generate lut for segmentation data labels", () => {
    // make some data with 3 label values
    const labeldata = new Uint8Array([1, 1, 1, 2, 2, 2, 4, 4, 4, 12, 12, 12]);
    const labelHistogram = new Histogram(labeldata);

    const lutObj = labelHistogram.lutGenerator_labelColors();
    it("has nonzero opacity values where expected", () => {
      expect(lutObj.lut[0 * 4 + 3]).to.equal(0);
      expect(lutObj.lut[1 * 4 + 3]).to.equal(255);
      expect(lutObj.lut[2 * 4 + 3]).to.equal(255);
      expect(lutObj.lut[3 * 4 + 3]).to.equal(0);
      expect(lutObj.lut[4 * 4 + 3]).to.equal(255);
      expect(lutObj.lut[5 * 4 + 3]).to.equal(0);
      expect(lutObj.lut[11 * 4 + 3]).to.equal(0);
      expect(lutObj.lut[12 * 4 + 3]).to.equal(255);
      expect(lutObj.lut[13 * 4 + 3]).to.equal(0);
    });

    // reconcile lut with control points
    const secondlut = histogram.lutGenerator_fromControlPoints(lutObj.controlPoints);
    it("generates consistent lut from control points", () => {
      expect(secondlut.lut).to.eql(lutObj.lut);
    });
  });

  describe("validate auto generators control points against their Lut", () => {
    // create a random dataset
    const data = new Uint8Array(1024);
    for (let i = 0; i < 1024; ++i) {
      data[i] = clamp(Math.floor(Math.random() * 256), 0, 255);
    }
    const histogram = new Histogram(data);

    it("is consistent for minMax", () => {
      const lut = histogram.lutGenerator_minMax(64, 192);
      const secondlut = histogram.lutGenerator_fromControlPoints(lut.controlPoints);
      expect(lut.lut).to.eql(secondlut.lut);
    });
    it("is consistent for minMax full range", () => {
      const lut = histogram.lutGenerator_minMax(0, 255);
      const secondlut = histogram.lutGenerator_fromControlPoints(lut.controlPoints);
      expect(lut.lut).to.eql(secondlut.lut);
    });
    it("is consistent for minMax edge case 0,0", () => {
      const lut = histogram.lutGenerator_minMax(0, 0);
      const secondlut = histogram.lutGenerator_fromControlPoints(lut.controlPoints);
      expect(lut.lut).to.eql(secondlut.lut);
      expect(lut.lut[3]).to.eql(0);
      expect(secondlut.lut[3]).to.eql(0);
      expect(lut.lut[1 * 4 + 3]).to.eql(255);
      expect(secondlut.lut[1 * 4 + 3]).to.eql(255);
      expect(lut.lut[255 * 4 + 3]).to.eql(255);
      expect(secondlut.lut[255 * 4 + 3]).to.eql(255);
    });
    it("is consistent for minMax edge case 0,1", () => {
      const lut = histogram.lutGenerator_minMax(0, 1);
      const secondlut = histogram.lutGenerator_fromControlPoints(lut.controlPoints);
      expect(lut.lut).to.eql(secondlut.lut);
      expect(lut.lut[3]).to.eql(0);
      expect(secondlut.lut[3]).to.eql(0);
      expect(lut.lut[1 * 4 + 3]).to.eql(255);
      expect(secondlut.lut[1 * 4 + 3]).to.eql(255);
      expect(lut.lut[255 * 4 + 3]).to.eql(255);
      expect(secondlut.lut[255 * 4 + 3]).to.eql(255);
    });
    it("is consistent for minMax edge case 254,255", () => {
      const lut = histogram.lutGenerator_minMax(254, 255);
      const secondlut = histogram.lutGenerator_fromControlPoints(lut.controlPoints);
      expect(lut.lut).to.eql(secondlut.lut);
      expect(lut.lut[3]).to.eql(0);
      expect(secondlut.lut[3]).to.eql(0);
      expect(lut.lut[254 * 4 + 3]).to.eql(0);
      expect(secondlut.lut[254 * 4 + 3]).to.eql(0);
      expect(lut.lut[255 * 4 + 3]).to.eql(255);
      expect(secondlut.lut[255 * 4 + 3]).to.eql(255);
    });
    it("is consistent for minMax edge case 255,255", () => {
      const lut = histogram.lutGenerator_minMax(255, 255);
      const secondlut = histogram.lutGenerator_fromControlPoints(lut.controlPoints);
      expect(lut.lut).to.eql(secondlut.lut);
      expect(lut.lut[3]).to.eql(0);
      expect(secondlut.lut[3]).to.eql(0);
      expect(lut.lut[255 * 4 + 3]).to.eql(0);
      expect(secondlut.lut[255 * 4 + 3]).to.eql(0);
    });

    it("is consistent for windowLevel", () => {
      const lut = histogram.lutGenerator_windowLevel(0.25, 0.333);
      const secondlut = histogram.lutGenerator_fromControlPoints(lut.controlPoints);
      expect(lut.lut).to.eql(secondlut.lut);
    });
    it("is consistent for windowLevel extending below bounds", () => {
      const lut = histogram.lutGenerator_windowLevel(0.5, 0.25);
      const secondlut = histogram.lutGenerator_fromControlPoints(lut.controlPoints);
      expect(lut.lut).to.eql(secondlut.lut);
    });
    it("is consistent for windowLevel extending above bounds", () => {
      const lut = histogram.lutGenerator_windowLevel(0.5, 0.75);
      const secondlut = histogram.lutGenerator_fromControlPoints(lut.controlPoints);
      expect(lut.lut).to.eql(secondlut.lut);
    });
    // TODO this test almost works but there are some very slight rounding errors
    // keeping things from being perfectly equal. Need to work out the precision issue.
    // it("is consistent for windowLevel extending beyond bounds", () => {
    //   const lut = histogram.lutGenerator_windowLevel(1.5, 0.5);
    //   const secondlut = histogram.lutGenerator_fromControlPoints(lut.controlPoints);
    //   expect(lut.lut).to.eql(secondlut.lut);
    // });
    it("is consistent for fullRange", () => {
      const lut = histogram.lutGenerator_fullRange();
      const secondlut = histogram.lutGenerator_fromControlPoints(lut.controlPoints);
      expect(lut.lut).to.eql(secondlut.lut);
    });
    it("is consistent for dataRange", () => {
      const lut = histogram.lutGenerator_dataRange();
      const secondlut = histogram.lutGenerator_fromControlPoints(lut.controlPoints);
      expect(lut.lut).to.eql(secondlut.lut);
    });
    it("is consistent for percentiles", () => {
      const lut = histogram.lutGenerator_percentiles(0.5, 0.983);
      const secondlut = histogram.lutGenerator_fromControlPoints(lut.controlPoints);
      expect(lut.lut).to.eql(secondlut.lut);
    });
    it("is consistent for bestFit", () => {
      const lut = histogram.lutGenerator_bestFit();
      const secondlut = histogram.lutGenerator_fromControlPoints(lut.controlPoints);
      expect(lut.lut).to.eql(secondlut.lut);
    });
    it("is consistent for auto2", () => {
      const lut = histogram.lutGenerator_auto2();
      const secondlut = histogram.lutGenerator_fromControlPoints(lut.controlPoints);
      expect(lut.lut).to.eql(secondlut.lut);
    });
    it("is consistent for auto", () => {
      const lut = histogram.lutGenerator_auto();
      const secondlut = histogram.lutGenerator_fromControlPoints(lut.controlPoints);
      expect(lut.lut).to.eql(secondlut.lut);
    });
    it("is consistent for equalize", () => {
      const lut = histogram.lutGenerator_equalize();
      const secondlut = histogram.lutGenerator_fromControlPoints(lut.controlPoints);
      expect(lut.lut).to.eql(secondlut.lut);
    });
    it("is consistent for a degenerate set of white,0 control points", () => {
      const lutArr = new Uint8Array(1024);
      for (let i = 0; i < 1024 / 4; ++i) {
        lutArr[i * 4 + 0] = 255;
        lutArr[i * 4 + 1] = 255;
        lutArr[i * 4 + 2] = 255;
        lutArr[i * 4 + 3] = 0;
      }
      const lut = {
        lut: lutArr,
        controlPoints: [
          { x: 0, color: [255, 255, 255], opacity: 0 },
          { x: 0, color: [255, 255, 255], opacity: 0 },
          { x: 4, color: [255, 255, 255], opacity: 0 },
          { x: 8, color: [255, 255, 255], opacity: 0 },
          { x: 255, color: [255, 255, 255], opacity: 0 },
        ],
      };
      const secondlut = histogram.lutGenerator_fromControlPoints(lut.controlPoints);
      expect(lut.lut).to.eql(secondlut.lut);
    });
  });
});

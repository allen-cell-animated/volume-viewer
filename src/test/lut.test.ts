import { expect } from "chai";

import type { ControlPoint, Lut } from "../Histogram";
import Histogram from "../Histogram";
import { remapLut, remapControlPoints } from "../Histogram";
import VolumeMaker from "../VolumeMaker";

function clamp(val, cmin, cmax) {
  return Math.min(Math.max(cmin, val), cmax);
}

describe("test histogram", () => {
  const conedata = VolumeMaker.createCone(128, 128, 128, 24, 128);
  const histogram = new Histogram(conedata);

  describe("binary volume data", () => {
    it("has a min of 255", () => {
      // histogram dataMin is the min nonzero value
      expect(histogram.getMin()).to.equal(255);
    });
    it("has a max of 255", () => {
      expect(histogram.getMax()).to.equal(255);
    });
    it("is created", () => {
      expect(histogram.maxBin).to.equal(255);
      expect(histogram["bins"][255]).to.be.greaterThan(0);
      expect(histogram["bins"][128]).to.equal(0);
      expect(histogram["bins"][0]).to.be.greaterThan(0);
    });
  });

  describe("generated lut from control points", () => {
    const controlPoints: ControlPoint[] = [
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
      const controlPoints: ControlPoint[] = [
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
      const controlPoints: ControlPoint[] = [
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
    const controlPoints: ControlPoint[] = [{ x: 127, color: [255, 255, 255], opacity: 1.0 }];
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
    describe("lutGenerator_minMax", () => {
      it("is consistent for minMax (typical case)", () => {
        const lut = histogram.lutGenerator_minMax(64, 192);
        const secondlut = histogram.lutGenerator_fromControlPoints(lut.controlPoints);
        expect(lut.lut).to.eql(secondlut.lut);
      });
      it("is consistent for minMax full range", () => {
        const lut = histogram.lutGenerator_minMax(0, 255);
        const secondlut = histogram.lutGenerator_fromControlPoints(lut.controlPoints);
        expect(lut.lut).to.eql(secondlut.lut);
      });
      it("is consistent when min and max are both 0", () => {
        const lut = histogram.lutGenerator_minMax(0, 0);
        const secondlut = histogram.lutGenerator_fromControlPoints(lut.controlPoints);
        expect(lut.lut).to.eql(secondlut.lut);
        expect(lut.lut[3]).to.eql(0);
        expect(secondlut.lut[3]).to.eql(0);
        expect(lut.lut[1 * 4 + 3]).to.eql(255);
        expect(secondlut.lut[1 * 4 + 3]).to.eql(255);
        expect(lut.lut[255 * 4 + 3]).to.eql(255);
        expect(secondlut.lut[255 * 4 + 3]).to.eql(255);
        // Make sure no NaN values
        lut.controlPoints.forEach((controlPoint) => {
          expect(controlPoint.opacity).to.be.finite;
        });
      });
      it("is consistent when min and max are the same positive number less than 255", () => {
        const lut = histogram.lutGenerator_minMax(120, 120);
        const secondlut = histogram.lutGenerator_fromControlPoints(lut.controlPoints);
        expect(lut.lut).to.eql(secondlut.lut);
        expect(lut.lut[3]).to.eql(0);
        expect(secondlut.lut[3]).to.eql(0);
        expect(lut.lut[120 * 4 + 3]).to.eql(0);
        expect(secondlut.lut[120 * 4 + 3]).to.eql(0);
        expect(lut.lut[121 * 4 + 3]).to.eql(255);
        expect(secondlut.lut[121 * 4 + 3]).to.eql(255);
        expect(lut.lut[255 * 4 + 3]).to.eql(255);
        expect(secondlut.lut[255 * 4 + 3]).to.eql(255);
        // Make sure no NaN values
        lut.controlPoints.forEach((controlPoint) => {
          expect(controlPoint.opacity).to.be.finite;
        });
      });
      it("is consistent when min and max are both negative", () => {
        const lut = histogram.lutGenerator_minMax(-10, -5);
        const secondlut = histogram.lutGenerator_fromControlPoints(lut.controlPoints);
        expect(lut.lut).to.eql(secondlut.lut);
        // Spot check but all opacity values should be 255
        expect(lut.lut[3]).to.eql(255);
        expect(secondlut.lut[3]).to.eql(255);
        expect(lut.lut[120 * 4 + 3]).to.eql(255);
        expect(secondlut.lut[120 * 4 + 3]).to.eql(255);
        expect(lut.lut[255 * 4 + 3]).to.eql(255);
        expect(secondlut.lut[255 * 4 + 3]).to.eql(255);
        lut.controlPoints.forEach((controlPoint) => {
          expect(controlPoint.opacity).to.eql(1);
        });
      });
      it("is consistent when min is 0 and max is 1", () => {
        const lut = histogram.lutGenerator_minMax(0, 1);
        const secondlut = histogram.lutGenerator_fromControlPoints(lut.controlPoints);
        expect(lut.lut).to.eql(secondlut.lut);
        expect(lut.lut[3]).to.eql(0);
        expect(secondlut.lut[3]).to.eql(0);
        expect(lut.lut[1 * 4 + 3]).to.eql(255);
        expect(secondlut.lut[1 * 4 + 3]).to.eql(255);
        expect(lut.lut[255 * 4 + 3]).to.eql(255);
        expect(secondlut.lut[255 * 4 + 3]).to.eql(255);
        // Make sure no NaN values
        lut.controlPoints.forEach((controlPoint) => {
          expect(controlPoint.opacity).to.be.finite;
        });
      });
      it("is consistent when min is 244 and max is 255", () => {
        const lut = histogram.lutGenerator_minMax(254, 255);
        const secondlut = histogram.lutGenerator_fromControlPoints(lut.controlPoints);
        expect(lut.lut).to.eql(secondlut.lut);
        expect(lut.lut[3]).to.eql(0);
        expect(secondlut.lut[3]).to.eql(0);
        expect(lut.lut[254 * 4 + 3]).to.eql(0);
        expect(secondlut.lut[254 * 4 + 3]).to.eql(0);
        expect(lut.lut[255 * 4 + 3]).to.eql(255);
        expect(secondlut.lut[255 * 4 + 3]).to.eql(255);
        // Make sure no NaN values
        lut.controlPoints.forEach((controlPoint) => {
          expect(controlPoint.opacity).to.be.finite;
        });
      });
      it("is consistent when min and max are both 255", () => {
        const lut = histogram.lutGenerator_minMax(255, 255);
        const secondlut = histogram.lutGenerator_fromControlPoints(lut.controlPoints);
        expect(lut.lut).to.eql(secondlut.lut);
        expect(lut.lut[3]).to.eql(0);
        expect(secondlut.lut[3]).to.eql(0);
        expect(lut.lut[255 * 4 + 3]).to.eql(0);
        expect(secondlut.lut[255 * 4 + 3]).to.eql(0);
        lut.controlPoints.forEach((controlPoint) => {
          expect(controlPoint.opacity).to.eql(0);
        });
      });
      it("is consistent when min and max are both greater than 255", () => {
        const lut = histogram.lutGenerator_minMax(300, 400);
        const secondlut = histogram.lutGenerator_fromControlPoints(lut.controlPoints);
        expect(lut.lut).to.eql(secondlut.lut);
        // Spot check but all opacity values should be 0
        expect(lut.lut[3]).to.eql(0);
        expect(secondlut.lut[3]).to.eql(0);
        expect(lut.lut[120 * 4 + 3]).to.eql(0);
        expect(secondlut.lut[120 * 4 + 3]).to.eql(0);
        expect(lut.lut[255 * 4 + 3]).to.eql(0);
        expect(secondlut.lut[255 * 4 + 3]).to.eql(0);
        lut.controlPoints.forEach((controlPoint) => {
          expect(controlPoint.opacity).to.eql(0);
        });
      });
    });

    describe("lutGenerator_windowLevel", () => {
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
    });

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
      const lut: Lut = {
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

describe("test remapping lut when raw data range is updated", () => {
  it("remaps the lut when the new data range is completely contained", () => {
    // histogram values itself doesn't matter.
    const histogram = new Histogram(new Uint8Array(100));
    // the full 0-255 domain of this lut is representing the raw intensity range 50-100
    // we will choose a min/max range within the 0-255 domain of the lut.
    const lut = histogram.lutGenerator_minMax(64, 192);
    // this lut now has a ramp from 64 to 192 in the 0-255 domain
    // (which correspond exactly to the newMin-newMax range in the raw intensities)
    expect(lut.lut[63 * 4 + 3]).to.equal(0);
    expect(lut.lut[64 * 4 + 3]).to.equal(0);
    expect(lut.lut[65 * 4 + 3]).to.be.greaterThan(0);
    expect(lut.lut[191 * 4 + 3]).to.be.lessThan(255);
    expect(lut.lut[192 * 4 + 3]).to.equal(255);
    expect(lut.lut[193 * 4 + 3]).to.equal(255);

    // artificial data min and max:
    const oldMin = 50;
    const oldMax = 100;

    // to test this, I will find the values that should exactly fit this ramp in the new range.
    const newMin = oldMin + (oldMax - oldMin) * (64 / 255);
    const newMax = oldMin + (oldMax - oldMin) * (192 / 255);

    // now, remap for a new raw intensity range of newMin to newMax.
    // because the actual slope started at newMin, and ended at newMax,
    // we expect this new lut to ramp up linearly from 0 to 255.
    const secondLut = remapLut(lut.lut, oldMin, oldMax, newMin, newMax);
    // the new lut must represent the range 25-75, and the old lut represented 50-100
    // so the min/max slope of our lut should be reduced, or stretched horizontally
    // the new lut should slope up linearly from 0 to 255.
    expect(secondLut[0 * 4 + 3]).to.equal(0);
    expect(secondLut[1 * 4 + 3]).to.be.closeTo(1, 1);
    expect(secondLut[2 * 4 + 3]).to.be.closeTo(2, 1);
    expect(secondLut[3 * 4 + 3]).to.be.closeTo(3, 1);
    expect(secondLut[63 * 4 + 3]).to.be.closeTo(63, 1);
    expect(secondLut[64 * 4 + 3]).to.be.closeTo(64, 1);
    expect(secondLut[65 * 4 + 3]).to.be.closeTo(65, 1);
    expect(secondLut[126 * 4 + 3]).to.be.closeTo(126, 1);
    expect(secondLut[127 * 4 + 3]).to.be.closeTo(127, 1);
    expect(secondLut[128 * 4 + 3]).to.be.closeTo(128, 1);
    expect(secondLut[191 * 4 + 3]).to.be.closeTo(191, 1);
    expect(secondLut[192 * 4 + 3]).to.be.closeTo(192, 1);
    expect(secondLut[193 * 4 + 3]).to.be.closeTo(193, 1);
    expect(secondLut[253 * 4 + 3]).to.be.closeTo(253, 1);
    expect(secondLut[254 * 4 + 3]).to.be.closeTo(254, 1);
    expect(secondLut[255 * 4 + 3]).to.be.closeTo(255, 1);

    const compareLut = histogram.lutGenerator_minMax(0, 255);
    for (let i = 0; i < 256 * 4; ++i) {
      expect(secondLut[i]).to.be.closeTo(compareLut.lut[i], 1);
    }

    // for good measure, just test the reverse mapping too.
    const thirdLut = remapLut(secondLut, newMin, newMax, oldMin, oldMax);
    for (let i = 0; i < 256 * 4; ++i) {
      expect(thirdLut[i]).to.be.closeTo(lut.lut[i], 1);
    }
  });
  it("remaps the lut when the new data range is identical to previous", () => {
    // histogram values itself doesn't matter.
    const histogram = new Histogram(new Uint8Array(100));
    const lut = histogram.lutGenerator_minMax(0, 255);

    // artificial min and max:
    const oldMin = 50;
    const oldMax = 100;
    const newMin = oldMin;
    const newMax = oldMax;
    const secondLut = remapLut(lut.lut, oldMin, oldMax, newMin, newMax);
    for (let i = 0; i < 256 * 4; ++i) {
      expect(secondLut[i]).to.eql(lut.lut[i]);
    }
  });

  it("remaps the lut when the new data range is completely overlapped", () => {
    // histogram values itself doesn't matter.
    const histogram = new Histogram(new Uint8Array(100));

    // artificial data min and max absolute intensities:
    const oldMin = 50;
    const oldMax = 100;
    // the full 0-255 domain of this lut is representing the above raw intensity domain 50-100.
    // For test, we will choose a min/max within the 0-255 domain of the lut.
    const lut = histogram.lutGenerator_minMax(64, 192);
    // this lut now has a ramp from 64 to 192 in the 0-255 range
    // (which correspond exactly to the newMin-newMax range in the raw intensities)
    expect(lut.lut[63 * 4 + 3]).to.equal(0);
    expect(lut.lut[64 * 4 + 3]).to.equal(0);
    expect(lut.lut[65 * 4 + 3]).to.be.greaterThan(0);
    expect(lut.lut[191 * 4 + 3]).to.be.lessThan(255);
    expect(lut.lut[192 * 4 + 3]).to.equal(255);
    expect(lut.lut[193 * 4 + 3]).to.equal(255);

    // lets remap so that the new lut has a minmax of 96-160
    // we will carefully pick these values so that it's easy to check the result.

    // Because we chose (64, 192) in the lut above, the min and max inflection points are at:
    const mini = oldMin + (64 / 255) * (oldMax - oldMin);
    const maxi = oldMin + (192 / 255) * (oldMax - oldMin);
    //console.log((mini + maxi) / 2);

    // what do the data min and max have to be for mini and maxi to map to 96 and 160?
    // should now span 1/4 of the range, still centered.
    const totalrange = (maxi - mini) / ((160 - 96) / (255 - 0));
    // symmetrical spread about the center
    const newMin = (oldMin + oldMax) / 2 - totalrange / 2;
    const newMax = (oldMin + oldMax) / 2 + totalrange / 2;

    // now, remap for a new raw intensity range of newMin to newMax.
    const secondLut = remapLut(lut.lut, oldMin, oldMax, newMin, newMax);
    expect(secondLut[0 * 4 + 3]).to.equal(0);
    expect(secondLut[1 * 4 + 3]).to.equal(0);
    expect(secondLut[2 * 4 + 3]).to.equal(0);
    expect(secondLut[3 * 4 + 3]).to.equal(0);
    expect(secondLut[63 * 4 + 3]).to.equal(0);
    expect(secondLut[64 * 4 + 3]).to.equal(0);
    expect(secondLut[65 * 4 + 3]).to.equal(0);
    expect(secondLut[128 * 4 + 3]).to.be.closeTo(128, 1);
    expect(secondLut[191 * 4 + 3]).to.equal(255);
    expect(secondLut[192 * 4 + 3]).to.equal(255);
    expect(secondLut[193 * 4 + 3]).to.equal(255);
    expect(secondLut[253 * 4 + 3]).to.equal(255);
    expect(secondLut[254 * 4 + 3]).to.equal(255);
    expect(secondLut[255 * 4 + 3]).to.equal(255);

    // 96, 160 were chosen above
    const compareLut = histogram.lutGenerator_minMax(96, 160);
    for (let i = 0; i < 256 * 4; ++i) {
      expect(secondLut[i]).to.be.closeTo(compareLut.lut[i], 1);
    }

    // for good measure, just test the reverse mapping too.
    const thirdLut = remapLut(secondLut, newMin, newMax, oldMin, oldMax);
    for (let i = 0; i < 256 * 4; ++i) {
      expect(thirdLut[i]).to.be.closeTo(lut.lut[i], 1);
    }
  });
});

describe("test remapping control points when raw data range is updated", () => {
  it("remaps the control points correctly when new intensity range contracted", () => {
    const cp: ControlPoint[] = [
      { x: 0, color: [255, 255, 255], opacity: 0 },
      { x: 64, color: [255, 255, 255], opacity: 0 },
      { x: 192, color: [255, 255, 255], opacity: 1.0 },
      { x: 255, color: [255, 255, 255], opacity: 1.0 },
    ];
    const cp2 = remapControlPoints(cp, 0, 255, 64, 192);
    const positions = cp2.map((cp) => Math.round(cp.x));
    console.log(positions);
    expect(positions).to.include.members([0, 64, 96, 160, 192, 255]);
  });
  it("remaps the control points correctly when new intensity range expanded", () => {
    const cp: ControlPoint[] = [
      { x: 0, color: [255, 255, 255], opacity: 0 },
      { x: 64, color: [255, 255, 255], opacity: 0 },
      { x: 192, color: [255, 255, 255], opacity: 1.0 },
      { x: 255, color: [255, 255, 255], opacity: 1.0 },
    ];
    const cp2 = remapControlPoints(cp, 0, 255, -64, 320);
    const positions = cp2.map((cp) => Math.round(cp.x));
    expect(positions).to.include.members([0, 32, 225, 255]);
  });
});
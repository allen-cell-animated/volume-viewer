import { expect } from "chai";
import { Vector2, Vector3 } from "three";

import Volume, { ImageInfo } from "../Volume";
import VolumeMaker from "../VolumeMaker";
import { LUT_ARRAY_LENGTH } from "../Lut";
import Channel from "../Channel";

// PREPARE SOME TEST DATA TO TRY TO DISPLAY A VOLUME.
const testimgdata: ImageInfo = {
  name: "AICS-10_5_5",

  originalSize: new Vector3(306, 494, 65),
  atlasTileDims: new Vector2(7, 10),
  volumeSize: new Vector3(204, 292, 65),
  subregionSize: new Vector3(204, 292, 65),
  subregionOffset: new Vector3(0, 0, 0),
  physicalPixelSize: new Vector3(0.065, 0.065, 0.29),
  spatialUnit: "",

  numChannels: 9,
  channelNames: [
    "DRAQ5",
    "EGFP",
    "Hoechst 33258",
    "TL Brightfield",
    "SEG_STRUCT",
    "SEG_Memb",
    "SEG_DNA",
    "CON_Memb",
    "CON_DNA",
  ],

  times: 1,
  timeScale: 1,
  timeUnit: "",

  numMultiscaleLevels: 1,
  multiscaleLevel: 0,

  transform: {
    translation: new Vector3(0, 0, 0),
    rotation: new Vector3(0, 0, 0),
  },
};

function checkVolumeConstruction(v: Volume, imgdata: ImageInfo) {
  expect(v).to.be.a("Object");
  expect(v.isLoaded()).to.not.be.ok;

  const { originalSize, physicalPixelSize } = imgdata;
  const physicalSize = originalSize.clone().multiply(physicalPixelSize);
  expect(v.physicalSize.x).to.equal(physicalSize.x);
  expect(v.physicalSize.y).to.equal(physicalSize.y);
  expect(v.physicalSize.z).to.equal(physicalSize.z);
  expect(v.channelNames.length).to.equal(imgdata.numChannels);
  expect(v.channels.length).to.equal(imgdata.numChannels);

  const mx = Math.max(Math.max(v.normPhysicalSize.x, v.normPhysicalSize.y), v.normPhysicalSize.z);
  expect(mx).to.equal(1.0);
}

function checkChannelDataConstruction(c: Channel, index: number, imgdata: ImageInfo) {
  expect(c.loaded).to.be.true;
  expect(c.name).to.equal(imgdata.channelNames[index]);
  const atlasWidth = imgdata.atlasTileDims.x * imgdata.subregionSize.x;
  const atlasHeight = imgdata.atlasTileDims.y * imgdata.subregionSize.y;
  expect(c.imgData.width).to.equal(atlasWidth);
  expect(c.imgData.height).to.equal(atlasHeight);
  expect(c.imgData.data).to.be.a("Uint8ClampedArray");
  expect(c.imgData.data.length).to.equal(atlasWidth * atlasHeight);
  expect(c.lut).to.be.a("Uint8Array");
  expect(c.lut.length).to.equal(LUT_ARRAY_LENGTH);
}

describe("test volume", () => {
  describe("creation", () => {
    const v = new Volume(testimgdata);

    it("is created", () => {
      checkVolumeConstruction(v, testimgdata);
    });

    it("loaded channel data", () => {
      const size = v.imageInfo.subregionSize;

      const conedata = VolumeMaker.createCone(size.x, size.y, size.z, size.x / 8, size.z);

      v.setChannelDataFromVolume(0, conedata);

      const c0 = v.getChannel(0);
      checkChannelDataConstruction(c0, 0, testimgdata);

      const spheredata = VolumeMaker.createSphere(size.x, size.y, size.z, size.z / 4);

      v.setChannelDataFromVolume(1, spheredata);

      const c1 = v.getChannel(1);
      checkChannelDataConstruction(c1, 1, testimgdata);

      expect(v.getIntensity(1, Math.floor(size.x / 2), Math.floor(size.y / 2), Math.floor(size.z / 2))).to.equal(255);
      expect(v.getIntensity(1, 0, 0, 0)).to.equal(0);
    });
  });

  describe("property validation", () => {
    it("has a correct value for normalizedPhysicalSize", () => {
      // `Volume` formerly derived a `scale` property by a different means than `normPhysicalSize`, but depended
      // on `scale` and `normPhysicalSize` being equal. With `scale` gone, this test ensures the equality stays.
      const v = new Volume(testimgdata);
      const { originalSize, physicalPixelSize } = v.imageInfo;
      const sizemax = Math.max(originalSize.x, originalSize.y, originalSize.z);

      const pxmin = Math.min(physicalPixelSize.x, physicalPixelSize.y, physicalPixelSize.z);

      const sx = ((physicalPixelSize.x / pxmin) * originalSize.x) / sizemax;
      const sy = ((physicalPixelSize.y / pxmin) * originalSize.y) / sizemax;
      const sz = ((physicalPixelSize.z / pxmin) * originalSize.z) / sizemax;

      const EPSILON = 0.000000001;
      expect(v.normPhysicalSize.x).to.be.closeTo(sx, EPSILON);
      expect(v.normPhysicalSize.y).to.be.closeTo(sy, EPSILON);
      expect(v.normPhysicalSize.z).to.be.closeTo(sz, EPSILON);
    });
  });
});

import { expect } from "chai";
import { VolumeRenderSettingUtils, defaultVolumeRenderSettings } from "../VolumeRenderSettings";
import { Vector3 } from "three";

describe("VolumeRenderSettingUtils", () => {
    it("deeply-copies bounds", () => {
        const s1 = defaultVolumeRenderSettings();
        const s1BMax = new Vector3(9.0, 9.0, 9.0);
        s1.bounds.bmax = s1BMax;

        const s2 = VolumeRenderSettingUtils.clone(s1);
        
        // Values should be the same
        expect(s1.bounds.bmax.equals(s1BMax)).to.be.true;
        expect(s2.bounds.bmax.equals(s1BMax)).to.be.true;
        expect(VolumeRenderSettingUtils.isEqual(s1, s2)).to.be.true;

        const s2BMax = new Vector3(1.0, 2.0, 3.0);
        s2.bounds.bmax = s2BMax;
        expect(s2.bounds.bmax.equals(s2BMax)).to.be.true;
        expect(s1.bounds.bmax.equals(s2BMax)).to.be.false;
    });

    it("deeply-copies arrays", () => {
        const s1 = defaultVolumeRenderSettings();
        const glossiness = [4.0, 3.0, 1.0];
        s1.glossiness = glossiness;
        const s2 = VolumeRenderSettingUtils.clone(s1);

        expect(s1.glossiness).to.deep.equal(glossiness);
        expect(s2.glossiness).to.deep.equal(glossiness);
        
        s2.glossiness[1] = 17.0;
        
        // s1 should not change.
        expect(s1.glossiness).to.deep.equal(glossiness);
        expect(s2.glossiness).to.deep.equal([4.0, 17.0, 1.0]);
        expect(s1.glossiness).to.not.deep.equal(s2.glossiness);
    });

    it("can compare settings objects", () => {
        const s1 = defaultVolumeRenderSettings();
        const s2 = defaultVolumeRenderSettings();

        expect(VolumeRenderSettingUtils.isEqual(s1, s2)).to.be.true;
        
        // Change boolean field
        s2.isOrtho = !s2.isOrtho;
        expect(VolumeRenderSettingUtils.isEqual(s1, s2)).to.be.false;

        // Change array property
        const s3 = defaultVolumeRenderSettings();
        s3.specular[0][1] = 15;
        expect(VolumeRenderSettingUtils.isEqual(s1, s3)).to.be.false;
        
        // Change bounds
        const s4 = defaultVolumeRenderSettings();
        s4.bounds.bmax = new Vector3(-1, -2, -3);
        expect(VolumeRenderSettingUtils.isEqual(s1, s4)).to.be.false;
        s4.bounds.bmax = s1.bounds.bmax;
        expect(VolumeRenderSettingUtils.isEqual(s4, s1)).to.be.true;
    });

    it("flags string changes", () => {
        const s1 = defaultVolumeRenderSettings();
        const s2 = defaultVolumeRenderSettings();

        s1.viewAxis = "3D";
        s2.viewAxis = "x";
        expect(VolumeRenderSettingUtils.isEqual(s1, s2)).to.be.false;
    });
});

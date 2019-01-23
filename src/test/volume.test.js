import { expect } from "chai";

import AICSvolume from '../AICSvolume.js';
import AICSmakeVolumes from '../AICSmakeVolumes.js';

// PREPARE SOME TEST DATA TO TRY TO DISPLAY A VOLUME.
const testimgdata = {
    "width": 306,
    "height": 494,
    "channels": 9,
    "channel_names": ["DRAQ5", "EGFP", "Hoechst 33258", "TL Brightfield", "SEG_STRUCT", "SEG_Memb", "SEG_DNA", "CON_Memb", "CON_DNA"],
    "rows": 7,
    "cols": 10,
    "tiles": 65,
    "tile_width": 204,
    "tile_height": 292,
    "atlas_width": 2040,
    "atlas_height": 2044,

    "pixel_size_x": 0.065,
    "pixel_size_y": 0.065,
    "pixel_size_z": 0.29,

    "images": [{
        "name": "AICS-10_5_5.ome.tif_atlas_0.png",
        "channels": [0, 1, 2]
    }, {
        "name": "AICS-10_5_5.ome.tif_atlas_1.png",
        "channels": [3, 4, 5]
    }, {
        "name": "AICS-10_5_5.ome.tif_atlas_2.png",
        "channels": [6, 7, 8]
    }],
    "name": "AICS-10_5_5",
    "status": "OK",
    "version": "0.0.0",
    "aicsImageVersion": "0.3.0"
};

function checkVolumeConstruction(v, imgdata) {
    expect(v).to.be.a("Object");
    expect(v.loaded).to.not.be.ok;
    expect(v.physicalSize.x).to.equal(imgdata.pixel_size_x * imgdata.width);
    expect(v.physicalSize.y).to.equal(imgdata.pixel_size_y * imgdata.height);
    expect(v.physicalSize.z).to.equal(imgdata.pixel_size_z * imgdata.tiles);
    expect(v.channelNames().length).to.equal(imgdata.channels);
    expect(v.num_channels).to.equal(imgdata.channels);
    expect(v.channels.length).to.equal(imgdata.channels);

    const mx = Math.max(Math.max(v.normalizedPhysicalSize.x, v.normalizedPhysicalSize.y), v.normalizedPhysicalSize.z);
    expect(mx).to.equal(1.0);

    const epsilon = 0.0000001;
    expect(v.scale.x).to.be.closeTo(v.normalizedPhysicalSize.x, epsilon);
    expect(v.scale.y).to.be.closeTo(v.normalizedPhysicalSize.y, epsilon);
    expect(v.scale.z).to.be.closeTo(v.normalizedPhysicalSize.z, epsilon);

    expect(v.x).to.equal(imgdata.tile_width);
    expect(v.y).to.equal(imgdata.tile_height);
    expect(v.z).to.equal(imgdata.tiles);
}

function checkChannelDataConstruction(c, index, imgdata) {
    expect(c.loaded).to.be.true;
    expect(c.name).to.equal(imgdata.channel_names[index]);
    expect(c.imgData.width).to.equal(imgdata.atlas_width);
    expect(c.imgData.height).to.equal(imgdata.atlas_height);
    expect(c.imgData.data).to.be.a("Uint8Array");
    expect(c.imgData.data.length).to.equal(imgdata.atlas_width*imgdata.atlas_height);
    expect(c.lut).to.be.a("Uint8Array");
    expect(c.lut.length).to.equal(256);
}

describe("test volume", () => {
    describe("creation", () => {

        const v = new AICSvolume(testimgdata);

        it("is created", () => {
            checkVolumeConstruction(v, testimgdata);
        });

        it("loaded channel data", () => {
            const conedata = AICSmakeVolumes.createCone(v.x, v.y, v.z, v.x/8, v.z);

            v.setChannelDataFromVolume(0, conedata);
            
            const c0 = v.getChannel(0);
            checkChannelDataConstruction(c0, 0, testimgdata);

            const spheredata = AICSmakeVolumes.createSphere(v.x, v.y, v.z, v.z/4);

            v.setChannelDataFromVolume(1, spheredata);
            
            const c1 = v.getChannel(1);
            checkChannelDataConstruction(c1, 1, testimgdata);

            expect(v.getIntensity(1, Math.floor(v.x/2), Math.floor(v.y/2), Math.floor(v.z/2))).to.equal(255);
            expect(v.getIntensity(1, 0, 0, 0)).to.equal(0);
        });

    });
});

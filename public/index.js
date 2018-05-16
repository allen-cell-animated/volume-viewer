import {
    AICSview3d,
    AICSvolumeDrawable,
    AICSmakeVolumes
} from '../src';

let el = document.getElementById("volume-viewer");
let view3D = new AICSview3d(el);

function onChannelDataReady() {
    console.log("Got channel data");
}

// PREPARE SOME TEST DATA TO TRY TO DISPLAY A VOLUME.
let imgdata = {
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

var channelVolumes = [];
for (var i = 0; i < imgdata.channels; ++i) {
  //var sv = AICSchannel.createTorus(this.imageInfo.tile_width, this.imageInfo.tile_height, this.z, 12, 6);
  //var sv = AICSchannel.createCylinder(this.imageInfo.tile_width, this.imageInfo.tile_height, this.z, 16, 16);
  if (i % 2 === 0) {

    var sv = AICSmakeVolumes.createSphere(imgdata.tile_width, imgdata.tile_height, imgdata.tiles, 16);
    channelVolumes.push(sv);
  }
  else{
    var sv = AICSmakeVolumes.createTorus(imgdata.tile_width, imgdata.tile_height, imgdata.tiles, 16, 6);
    channelVolumes.push(sv);

  }
}

function loadImageData(jsondata, volumedata) {
    view3D.resize();
    jsondata.volumedata = volumedata;
    const aimg = new AICSvolumeDrawable(jsondata, "test");
    view3D.setCameraMode('3D');
    view3D.setImage(aimg, onChannelDataReady);
    aimg.setUniform(
        "DENSITY", 0.1, true, true);
    aimg.setUniform(
        "BRIGHTNESS", 1.0, true, true);
    }
loadImageData(imgdata, channelVolumes);
import {
    AICSview3d,
    AICSvolumeDrawable
} from '../src/aics-image-viewer/viewer3d';

let el = document.getElementById("volume-viewer");
let view3D = new AICSview3d(el);

function onChannelDataReady() {
    console.log("Got channel data");
}
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
}

function loadImageData(jsondata, volumedata) {
    view3D.resize();
    const aimg = new AICSvolumeDrawable(jsondata, "test");
    view3D.setImage(aimg, onChannelDataReady);
}
loadImageData(imgdata);
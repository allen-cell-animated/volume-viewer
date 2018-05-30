import {
    AICSview3d,
    AICSvolumeDrawable,
    AICSmakeVolumes,
    AICSvolumeLoader
} from '../src';

let el = document.getElementById("volume-viewer");
let view3D = new AICSview3d(el);

function onChannelDataReady() {
    console.log("Got channel data");
}

// PREPARE SOME TEST DATA TO TRY TO DISPLAY A VOLUME.
let imgdata = {
    // width := original full size image width
    "width": 306,
    // height := original full size image height
    "height": 494,
    "channels": 9,
    "channel_names": ["DRAQ5", "EGFP", "Hoechst 33258", "TL Brightfield", "SEG_STRUCT", "SEG_Memb", "SEG_DNA", "CON_Memb", "CON_DNA"],
    "rows": 7,
    "cols": 10,
    // tiles <= rows*cols, tiles is number of z slices
    "tiles": 65,
    "tile_width": 204,
    "tile_height": 292,

    // for webgl reasons, it is best for atlas_width and atlas_height to be <= 2048 
    // and ideally a power of 2.

    // atlas_width === cols*tile_width
    "atlas_width": 2040,
    // atlas_height === rows*tile_height
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
  if (i % 2 === 0) {
    var sv = AICSmakeVolumes.createSphere(imgdata.tile_width, imgdata.tile_height, imgdata.tiles, 16);
    channelVolumes.push(sv);
  }
  else{
    var sv = AICSmakeVolumes.createTorus(imgdata.tile_width, imgdata.tile_height, imgdata.tiles, 32, 8);
    channelVolumes.push(sv);

  }
}

function loadImageData(jsondata, volumedata) {
    view3D.resize();
    
    const aimg = new AICSvolumeDrawable(jsondata, "test");

    // if we have some url to prepend to the atlas file names, do it now.
    var locationHeader = jsondata.locationHeader || '';
    for (var i = 0; i < jsondata.images.length; ++i) {
      jsondata.images[i].name = locationHeader + jsondata.images[i].name;
    }
    
    // get data into the image
    if (volumedata) {
        for (var i = 0; i < volumedata.length; ++i) {
            // where each volumedata element is a flat Uint8Array of xyz data
            // according to jsondata.tile_width*jsondata.tile_height*jsondata.tiles
            // (first row of first plane is the first data in 
            // the layout, then second row of first plane, etc)
            aimg.setChannelDataFromVolume(i, volumedata[i]);
        }
    }
    else {
        AICSvolumeLoader.loadVolumeAtlasData(jsondata.images, (url, channelIndex, atlasdata, atlaswidth, atlasheight) => {
            aimg.setChannelDataFromAtlas(channelIndex, atlasdata, atlaswidth, atlasheight);
        });
    }

    // tell the viewer about the image
    view3D.setImage(aimg);
    view3D.setCameraMode('3D');
    aimg.setDensity(0.1);
    aimg.setBrightness(1.0);

    view3D.resize(null, 300, 300);
}

// switch the uncommented line to test with volume data or atlas data
loadImageData(imgdata);
//loadImageData(imgdata, channelVolumes);

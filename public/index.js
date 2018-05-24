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
    // "images" is now optional and could be replaced with "volumedata"
    // where volumedata is an array of channels, where each channel is a flat Uint8Array of xyz data
    // according to tile_width*tile_height*tiles (first row of first plane is the first data in 
    // the layout, then second row of first plane, etc)
    // atlas_width === cols*tile_width
    // atlas_height === rows*tile_height
    // for webgl reasons, it is best for atlas_width and atlas_height to be <= 2048 
    // and ideally a power of 2.
    // tiles <= rows*cols, tiles is number of z slices
    // width := original full size image width
    // height := original full size image height

    // (an alternate volumedata input format could be "atlasdata" where the data is laid out as
    // a pre-tiled atlas image ready for upload. Arguably this data layout is an implementation-
    // specific detail / optimization that clients don't need to know about)
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
    
    // tell the viewer about the image
    view3D.setImage(aimg, onChannelDataReady);

    // get data into the image
    if (volumedata) {
        for (var i = 0; i < volumedata.length; ++i) {
            aimg.setChannelDataFromVolume(i, volumedata[i]);
        }
    }
    else {
        AICSvolumeLoader.loadVolumeAtlasData(jsondata.images, (url, channelIndex, atlasdata, atlaswidth, atlasheight) => {
            //console.log("Got atlas data " + channelIndex);
            aimg.setChannelDataFromAtlas(channelIndex, atlasdata, atlaswidth, atlasheight);
        });
    }

    view3D.setCameraMode('3D');
    aimg.setDensity(0.1);
    aimg.setBrightness(1.0);

    view3D.resize(null, 300, 300);
}

loadImageData(imgdata);
//loadImageData(imgdata, channelVolumes);

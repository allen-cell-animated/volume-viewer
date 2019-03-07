/**
 * @class
 */
const VolumeLoader = {};

/**
 * @callback PerChannelCallback
 * @param {string} imageurl
 * @param {number} channelindex
 */

/**
 * load per-channel volume data from a batch of image files containing the volume slices tiled across the images
 * @param {Volume} volume
 * @param {Array.<{name:string, channels:Array.<number>}>} imageArray 
 * @param {PerChannelCallback} callback Per-channel callback.  Called when each channel's atlased volume data is loaded
 * @returns {Object.<string, Image>} a map(imageurl : Image object) that should be used to cancel the download requests,
 * for example if you need to destroy the image before all data has arrived.
 * as requests arrive, the callback will be called per image, not per channel
 * @example loadVolumeAtlasData([{
 *     "name": "AICS-10_5_5.ome.tif_atlas_0.png",
 *     "channels": [0, 1, 2]
 * }, {
 *     "name": "AICS-10_5_5.ome.tif_atlas_1.png",
 *     "channels": [3, 4, 5]
 * }, {
 *     "name": "AICS-10_5_5.ome.tif_atlas_2.png",
 *     "channels": [6, 7, 8]
 * }], mycallback);
 */
VolumeLoader.loadVolumeAtlasData = function (volume, imageArray, callback) {
    var numImages = imageArray.length;

    var requests = {};
    //console.log("BEGIN DOWNLOAD DATA");
    for (var i = 0; i < numImages; ++i) {
        var url = imageArray[i].name;
        var batch = imageArray[i].channels;

        // using Image is just a trick to download the bits as a png.
        // the Image will never be used again.
        var img = new Image;
        img.onerror = function() {
            console.log("ERROR LOADING " + url);
        };
        img.onload = function(thisbatch) { 
            return function(event) {
                //console.log("GOT ch " + me.src);
                // extract pixels by drawing to canvas
                var canvas = document.createElement('canvas');
                // nice thing about this is i could downsample here
                var w = Math.floor(event.target.naturalWidth);
                var h = Math.floor(event.target.naturalHeight);
                canvas.setAttribute('width', w);
                canvas.setAttribute('height', h);
                var ctx = canvas.getContext("2d");
                ctx.globalCompositeOperation = "copy";
                ctx.globalAlpha = 1.0;
                ctx.drawImage(event.target, 0, 0, w, h);
                // getImageData returns rgba.
                // optimize: collapse rgba to single channel arrays
                var iData = ctx.getImageData(0, 0, w, h);

                var channelsBits = [];
                // allocate channels in batch
                for (var i = 0; i < Math.min(thisbatch.length, 4); ++i) {
                    channelsBits.push(new Uint8Array(w*h));
                }
                // extract the data
                for (var i = 0; i < w*h; i++) {
                    for (var j = 0; j < Math.min(thisbatch.length, 4); ++j) {
                        channelsBits[j][i] = iData.data[i*4+j];
                    }
                }

                // done with img, iData, and canvas now.

                for (var i = 0; i < Math.min(thisbatch.length, 4); ++i) {
                    volume.setChannelDataFromAtlas(thisbatch[i], channelsBits[i], w, h);
                    callback(url, thisbatch[i]);
                }
            };
        } (batch);
        img.crossOrigin = 'Anonymous';
        img.src = url;
        requests[url] = img;
    }

    return requests;
};

export default VolumeLoader;

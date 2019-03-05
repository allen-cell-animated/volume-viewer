const THREE = require("three");

import Channel from './Channel.js';

import { getColorByChannelIndex } from './constants/colors.js';

/**
 * Provide dimensions of the volume data, including dimensions for texture atlas data in which the volume z slices
 * are tiled across a single large 2d image plane.
 * @typedef {Object} imageInfo
 * @property {string} name Base name of image
 * @property {string} version schema version preferably in semver format.
 * @property {number} width Width of original volumetric data prior to downsampling
 * @property {number} height Height of original volumetric data prior to downsampling
 * @property {number} channels Number of channels
 * @property {number} tiles Number of tiles, which must be equal to the number of z-slices in original volumetric data
 * @property {number} pixel_size_x Size of pixel in volumetric data to be rendered, in x-dimension, unitless
 * @property {number} pixel_size_y Size of pixel in volumetric data to be rendered, in y-dimension, unitless
 * @property {number} pixel_size_z Size of pixel in volumetric data to be rendered, in z-dimension, unitless
 * @property {Array.<string>} channel_names Names of each of the channels to be rendered, in order. Unique identifier expected
 * @property {number} rows Number of rows in tile array in each image.  Note tiles <= rows*cols
 * @property {number} cols Number of columns in tile array in each image.  Note tiles <= rows*cols
 * @property {number} tile_width Width of each tile in volumetric dataset to be rendered, in pixels
 * @property {number} tile_height Height of each tile in volumetric dataset to be rendered, in pixels
 * @property {number} atlas_width Total width of image containing all the tiles, in pixels.  Note atlas_width === cols*tile_width
 * @property {number} atlas_height Total height of image containing all the tiles, in pixels. Note atlas_height === rows*tile_height
 * @property {Object} transform translation and rotation as arrays of 3 numbers. Translation is in voxels (to be multiplied by pixel_size values). Rotation is Euler angles in radians, appled in XYZ order.
 * @example let imgdata = {
  "width": 306,
  "height": 494,
  "channels": 9,
  "channel_names": ["DRAQ5", "EGFP", "Hoechst 33258", "TL Brightfield", "SEG_STRUCT", "SEG_Memb", "SEG_DNA", "CON_Memb", "CON_DNA"],
  "rows": 7,
  "cols": 10,
  "tiles": 65,
  "tile_width": 204,
  "tile_height": 292,
  // for webgl reasons, it is best for atlas_width and atlas_height to be <= 2048 
  // and ideally a power of 2.  This generally implies downsampling the original volume data for display in this viewer.
  "atlas_width": 2040,
  "atlas_height": 2044,
  "pixel_size_x": 0.065,
  "pixel_size_y": 0.065,
  "pixel_size_z": 0.29,
  "name": "AICS-10_5_5",
  "status": "OK",
  "version": "0.0.0",
  "aicsImageVersion": "0.3.0",
  "transform": {
    "translation": [5, 5, 1],
    "rotation": [0, 3.14159, 1.57]
  }
  };
 */

/**
 * A renderable multichannel volume image with 8-bits per channel intensity values.
 * @class
 * @param {imageInfo} imageInfo 
 */
export default class Volume {
  constructor(imageInfo) {
    this.imageInfo = imageInfo;
    this.name = imageInfo.name;

    // clean up some possibly bad data.
    this.imageInfo.pixel_size_x = imageInfo.pixel_size_x || 1.0;
    this.imageInfo.pixel_size_y = imageInfo.pixel_size_y || 1.0;
    this.imageInfo.pixel_size_z = imageInfo.pixel_size_z || 1.0;

    this.pixel_size = [
      this.imageInfo.pixel_size_x,
      this.imageInfo.pixel_size_y,
      this.imageInfo.pixel_size_z
    ];
    this.x = imageInfo.tile_width;
    this.y = imageInfo.tile_height;
    this.z = imageInfo.tiles;
    this.t = 1;

    this.num_channels = imageInfo.channels;
    
    this.channel_names = this.imageInfo.channel_names.slice();
    this.channel_colors_default = imageInfo.channel_colors ? imageInfo.channel_colors.slice() : this.channel_names.map((name, index) => getColorByChannelIndex(index));
    // fill in gaps
    if (this.channel_colors_default.length < this.num_channels) {
      for(let i = this.channel_colors_default.length-1; i < this.num_channels; ++i) {
        this.channel_colors_default[i] = getColorByChannelIndex(i);
      }
    }

    this.atlasSize = [this.imageInfo.atlas_width, this.imageInfo.atlas_height];
    this.volumeSize = [this.x, this.y, this.z];

    this.channels = [];
    for (var i = 0; i < this.num_channels; ++i) {
      this.channels.push(new Channel(this.channel_names[i]));
    }

    this.setVoxelSize(this.pixel_size);

    // make sure a transform is specified
    if (!this.imageInfo.transform) {
      this.imageInfo.transform = {
        translation: [0,0,0],
        rotation: [0,0,0]
      }
    }
    if (!this.imageInfo.transform.translation) {
      this.imageInfo.transform.translation = [0,0,0];
    }
    if (!this.imageInfo.transform.rotation) {
      this.imageInfo.transform.rotation = [0,0,0];
    }

    this.volumeDataObservers = [];
  }

  setScale(scale) {
    this.scale = scale;
    this.currentScale = scale.clone();
  }

  // we calculate the physical size of the volume (voxels*pixel_size)
  // and then normalize to the max physical dimension
  setVoxelSize(values) {
    // basic error check.  bail out if we get something bad.
    if (!values.length || values.length < 3) {
      return;
    }

    // only set the data if it is > 0.  zero is not an allowed value.
    if (values[0] > 0) {
      this.pixel_size[0] = values[0];
    }
    if (values[1] > 0) {
      this.pixel_size[1] = values[1];
    }
    if (values[2] > 0) {
      this.pixel_size[2] = values[2];
    }

    var physSizeMin = Math.min(this.pixel_size[0], Math.min(this.pixel_size[1], this.pixel_size[2]));
    var pixelsMax = Math.max(this.imageInfo.width, Math.max(this.imageInfo.height,this.z));
    var sx = this.pixel_size[0]/physSizeMin * this.imageInfo.width/pixelsMax;
    var sy = this.pixel_size[1]/physSizeMin * this.imageInfo.height/pixelsMax;
    var sz = this.pixel_size[2]/physSizeMin * this.z/pixelsMax;

    // this works because image was scaled down in x and y but not z.
    // so use original x and y dimensions from imageInfo.
    this.physicalSize = new THREE.Vector3(
      this.imageInfo.width * this.pixel_size[0],
      this.imageInfo.height * this.pixel_size[1],
      this.z * this.pixel_size[2]
    );
    const m = Math.max(this.physicalSize.x, Math.max(this.physicalSize.y, this.physicalSize.z));
    // Compute the volume's max extent - scaled to max dimension.
    this.normalizedPhysicalSize = new THREE.Vector3().copy(this.physicalSize).multiplyScalar(1.0/m);

    // sx, sy, sz should be same as normalizedPhysicalSize
    this.setScale(new THREE.Vector3(sx,sy,sz));
  }

  cleanup() {
  }

  /**
   * @return a reference to the list of channel names
   */
  channelNames() {
    return this.channel_names;
  }

  getChannel(channelIndex) {
    return this.channels[channelIndex];
  }

  onChannelLoaded(batch) {
    // check to see if all channels are now loaded, and fire an event(?)
    if (this.channels.every(function(element,index,array) {return element.loaded;})) {
      this.loaded = true;
    }
    for (let i = 0; i < this.volumeDataObservers.length; ++i) {
      this.volumeDataObservers[i].onVolumeData(this, batch);
    }
  }

  /**
   * Assign volume data via a 2d array containing the z slices as tiles across it.  Assumes that the incoming data is consistent with the image's pre-existing imageInfo tile metadata.
   * @param {number} channelIndex 
   * @param {Uint8Array} atlasdata 
   * @param {number} atlaswidth 
   * @param {number} atlasheight 
   */
  setChannelDataFromAtlas(channelIndex, atlasdata, atlaswidth, atlasheight) {
    this.channels[channelIndex].setBits(atlasdata, atlaswidth, atlasheight);
    this.channels[channelIndex].unpackVolumeFromAtlas(this.x, this.y, this.z);  
    this.onChannelLoaded([channelIndex]);
  }

  // ASSUMES that this.channelData.options is already set and incoming data is consistent with it
  /**
   * Assign volume data as a 3d array ordered x,y,z. The xy size must be equal to tilewidth*tileheight from the imageInfo used to construct this Volume.  Assumes that the incoming data is consistent with the image's pre-existing imageInfo tile metadata.
   * @param {number} channelIndex 
   * @param {Uint8Array} volumeData 
   */
  setChannelDataFromVolume(channelIndex, volumeData) {
    this.channels[channelIndex].setFromVolumeData(volumeData, this.x, this.y, this.z, this.atlasSize[0], this.atlasSize[1]);
    this.onChannelLoaded([channelIndex]);
  }

  // TODO: decide if this should update imageInfo or not. For now, leave imageInfo alone as the "original" data
  /**
   * Add a new channel ready to receive data from one of the setChannelDataFrom* calls.
   * Name and color will be defaulted if not provided. For now, leave imageInfo alone as the "original" data
   * @param {string} name 
   * @param {Array.<number>} color [r,g,b]
   */
  appendEmptyChannel(name, color) {
    let idx = this.num_channels;
    let chname = name  || "channel_"+idx;
    let chcolor = color || getColorByChannelIndex(idx);
    this.num_channels += 1;
    this.channel_names.push(chname);
    this.channel_colors_default.push(chcolor);

    this.channels.push(new Channel(chname));

    for (let i = 0; i < this.volumeDataObservers.length; ++i) {
      this.volumeDataObservers[i].onVolumeChannelAdded(this, idx);
    }

    return idx;
  }

  /**
   * Get a value from the volume data
   * @return {number} the intensity value from the given channel at the given xyz location
   * @param {number} c The channel index
   * @param {number} x 
   * @param {number} y 
   * @param {number} z 
   */
  getIntensity(c, x, y, z) {
      return this.channels[c].getIntensity(x, y, z);
  }

  /**
   * Get the 256-bin histogram for the given channel
   * @return {Histogram} the histogram
   * @param {number} c The channel index
   */
  getHistogram(c) {
    return this.channels[c].getHistogram();
  }

  /**
   * Set the lut for the given channel
   * @param {number} c The channel index
   * @param {Array.<number>} lut The lut as a 256 element array
   */
  setLut(c, lut) {
    this.channels[c].setLut(lut);
  }

  /**
   * Return the intrinsic rotation associated with this volume (radians)
   * @return {Array.<number>} the xyz Euler angles (radians)
   */
  getRotation() {
    // default axis order is XYZ
    return this.imageInfo.transform.rotation;
  }

  /**
   * Return the intrinsic translation (pivot center delta) associated with this volume, in normalized volume units
   * @return {Array.<number>} the xyz translation in normalized volume units
   */
  getTranslation() {
    return this.voxelsToWorldSpace(this.imageInfo.transform.translation);
  }

  /**
   * Return a translation in normalized volume units, given a translation in image voxels
   * @return {Array.<number>} the xyz translation in normalized volume units
   */
  voxelsToWorldSpace(xyz) {
    // ASSUME: translation is in original image voxels.
    // account for pixel_size and normalized scaling in the threejs volume representation we're using
    const m = 1.0 / Math.max(this.physicalSize.x, Math.max(this.physicalSize.y, this.physicalSize.z));
    const pixelSizeVec = new THREE.Vector3().fromArray(this.pixel_size);
    return new THREE.Vector3().fromArray(xyz).multiply(pixelSizeVec).multiplyScalar(m).toArray();
  }

  addVolumeDataObserver(o) {
    this.volumeDataObservers.push(o);
  }

  removeVolumeDataObserver(o) {
    if (o) {
      let i = this.volumeDataObservers.indexOf(o);
      if (i !== -1) {
        this.volumeDataObservers.splice(i, 1);
      }
    }
  }

  removeAllVolumeDataObservers() {
    this.volumeDataObservers = [];
  }

};

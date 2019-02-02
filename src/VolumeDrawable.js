import AICSvolume from './AICSvolume.js';
import { getColorByChannelIndex } from './constants/colors.js';
import MeshVolume from './meshVolume.js';
import RayMarchedAtlasVolume from './rayMarchedAtlasVolume.js';
import PathTracedVolume from './pathTracedVolume.js';

/**
 * A renderable multichannel volume image with 8-bits per channel intensity values.
 * @class
 * @param {imageInfo} imageInfo 
 */
function VolumeDrawable(imageInfo, requestPathTrace) {
  this.PT = !!requestPathTrace;

  // THE VOLUME DATA
  this.volume = new AICSvolume(imageInfo);

  this.onChannelDataReadyCallback = null;

  this.maskChannelIndex = -1;
  this.maskAlpha = 1.0;

  this.channel_colors = this.volume.channel_colors_default.slice();

  this.fusion = this.channel_colors.map((col, index) => {
    let rgbColor;
    // take copy of original channel color
    if (col[0] === 0 && col[1] === 0 && col[2] === 0) {
      rgbColor = 0;
    } else {
      rgbColor = [col[0], col[1], col[2]];
    }
    return {
      chIndex: index,
      lut:[],
      rgbColor: rgbColor
    };
  });

  this.specular = new Array(this.volume.num_channels).fill([0,0,0]);
  this.emissive = new Array(this.volume.num_channels).fill([0,0,0]);
  this.roughness = new Array(this.volume.num_channels).fill(0);

  this.sceneRoot = new THREE.Object3D();//create an empty container

  this.meshVolume = new MeshVolume(this.volume);

  if (this.PT) {
    this.volumeRendering = new PathTracedVolume(this.volume);
    this.pathTracedVolume = this.volumeRendering;
  }
  else {
    this.volumeRendering = new RayMarchedAtlasVolume(this.volume);
    this.rayMarchedAtlasVolume = this.volumeRendering;
  }

  // draw meshes first, and volume last, for blending and depth test reasons with raymarch
  !this.PT && this.sceneRoot.add(this.meshVolume.get3dObject());
  this.sceneRoot.add(this.volumeRendering.get3dObject());
  // draw meshes last (as overlay) for pathtrace? (or not at all?)
  //this.PT && this.sceneRoot.add(this.meshVolume.get3dObject());

  this.bounds = {
    bmin: new THREE.Vector3(-0.5, -0.5, -0.5),
    bmax: new THREE.Vector3(0.5, 0.5, 0.5)
  };

  var cx = 0.0;
  var cz = 0.0;
  var cy = 0.0;
  this.sceneRoot.position.set(cx,cy,cz);
  this.maxSteps = 256;

  this.setScale(this.volume.scale);
}

/**
 * Assign volume data via a 2d array containing the z slices as tiles across it.  Assumes that the incoming data is consistent with the image's pre-existing imageInfo tile metadata.
 * @param {number} channelIndex 
 * @param {Uint8Array} atlasdata 
 * @param {number} atlaswidth 
 * @param {number} atlasheight 
 */
VolumeDrawable.prototype.setChannelDataFromAtlas = function(channelIndex, atlasdata, atlaswidth, atlasheight) {
  this.volume.setChannelDataFromAtlas(channelIndex, atlasdata, atlaswidth, atlasheight);
  this.onChannelLoaded([channelIndex]);
};

/**
 * Assign volume data as a 3d array ordered x,y,z. The xy size must be equal to tilewidth*tileheight from the imageInfo used to construct this AICSvolume.  Assumes that the incoming data is consistent with the image's pre-existing imageInfo tile metadata.
 * @param {number} channelIndex 
 * @param {Uint8Array} volumeData 
 */
VolumeDrawable.prototype.setChannelDataFromVolume = function(channelIndex, volumeData) {
  this.volume.setChannelDataFromVolume(channelIndex, volumeData);
  this.onChannelLoaded([channelIndex]);
};

VolumeDrawable.prototype.resetSampleRate = function() {
  this.steps = this.maxSteps / 2;
};

VolumeDrawable.prototype.setMaxSampleRate = function(qual) {
  this.maxSteps = qual;
  this.setUniform('maxSteps', qual);
};

VolumeDrawable.prototype.setScale = function(scale) {

  this.scale = scale;

  this.currentScale = scale.clone();

  this.meshVolume.setScale(scale);
  this.volumeRendering.setScale(scale);
};

VolumeDrawable.prototype.setOrthoScale = function(value) {
  this.volumeRendering.setOrthoScale(value);
};

VolumeDrawable.prototype.setResolution = function(viewObj) {
  const x = viewObj.getWidth();
  const y = viewObj.getHeight();
  this.volumeRendering.setResolution(x, y);
  this.meshVolume.setResolution(x, y);
};

/**
 * Set clipping range (between 0 and 1) for a given axis. 
 * Calling this allows the rendering to compensate for changes in thickness in orthographic views that affect how bright the volume is.
 * @param {number} axis 0, 1, or 2 for x, y, or z axis
 * @param {number} minval 0..1, should be less than maxval
 * @param {number} maxval 0..1, should be greater than minval 
 * @param {boolean} isOrthoAxis is this an orthographic projection or just a clipping of the range for perspective view
 */
VolumeDrawable.prototype.setAxisClip = function(axis, minval, maxval, isOrthoAxis) {
  this.bounds.bmax[axis] = maxval;
  this.bounds.bmin[axis] = minval;
 
  !this.PT && this.meshVolume.setAxisClip(axis, minval, maxval, isOrthoAxis);
  this.volumeRendering.setAxisClip(axis, minval, maxval, isOrthoAxis);
};

/**
 * Tell this image that it needs to be drawn in an orthographic mode
 * @param {boolean} isOrtho is this an orthographic projection or a perspective view
 */
VolumeDrawable.prototype.setIsOrtho = function(isOrtho) {
  !this.PT && this.rayMarchedAtlasVolume.setIsOrtho(isOrtho);
};

VolumeDrawable.prototype.setOrthoThickness = function(value) {
  !this.PT && this.meshVolume.setOrthoThickness(value);
  this.volumeRendering.setOrthoThickness(value);
};

/**
 * Set parameters for gamma curve for volume rendering.
 * @param {number} gmin 0..1
 * @param {number} glevel 0..1, should be <= gmax and >= gmin
 * @param {number} gmax 0..1, should be > gmin and >= glevel
 */
VolumeDrawable.prototype.setGamma = function(gmin, glevel, gmax) {
  !this.PT && this.rayMarchedAtlasVolume.setGamma(gmin, glevel, gmax);
};

VolumeDrawable.prototype.setMaxProjectMode = function(isMaxProject) {
  !this.PT && this.rayMarchedAtlasVolume.setMaxProjectMode(isMaxProject);
};

VolumeDrawable.prototype.onAnimate = function(canvas) {
  // TODO: this is inefficient, as this work is duplicated by threejs.
  // we need camera matrix up to date before giving the 3d objects a chance to use it.
  canvas.camera.updateMatrixWorld(true);
  canvas.camera.matrixWorldInverse.getInverse( canvas.camera.matrixWorld );

  const isVR = canvas.isVR();
  if (isVR) {
    // raise volume drawable to about 1 meter.
    this.sceneRoot.position.y = 1.0;
  }
  else {
    this.sceneRoot.position.y = 0.0;
  }

  // TODO confirm sequence
  this.volumeRendering.doRender(canvas);
  !this.PT && this.meshVolume.doRender(canvas);
};

/**
 * If an isosurface exists, update its isovalue and regenerate the surface. Otherwise do nothing.
 * @param {number} channel 
 * @param {number} value 
 */
VolumeDrawable.prototype.updateIsovalue = function(channel, value) {
  this.meshVolume.updateIsovalue(channel, value);
};

/**
 * 
 * @param {number} channel 
 * @return {number} the isovalue for this channel or undefined if this channel does not have an isosurface created
 */
VolumeDrawable.prototype.getIsovalue = function(channel) {
  return this.meshVolume.getIsovalue(channel);
};

/**
 * Set opacity for isosurface
 * @param {number} channel 
 * @param {number} value Opacity
 */
VolumeDrawable.prototype.updateOpacity = function(channel, value) {
  this.meshVolume.updateOpacity(channel, value);
};

/**
 * 
 * @param {number} channel 
 * @return true if there is currently a mesh isosurface for this channel
 */
VolumeDrawable.prototype.hasIsosurface = function(channel) {
  return this.meshVolume.hasIsosurface(channel);
};

/**
 * If an isosurface is not already created, then create one.  Otherwise do nothing.
 * @param {number} channel 
 * @param {number} value isovalue
 * @param {number=} alpha Opacity
 * @param {boolean=} transp render surface as transparent object
 */
VolumeDrawable.prototype.createIsosurface = function(channel, value, alpha, transp) {
  this.meshVolume.createIsosurface(channel, this.channel_colors[channel], value, alpha, transp);
};

/**
 * If an isosurface exists for this channel, destroy it now. Don't just hide it - assume we can free up some resources.
 * @param {number} channel 
 */
VolumeDrawable.prototype.destroyIsosurface = function(channel) {
  this.meshVolume.destroyIsosurface(channel);
};

VolumeDrawable.prototype.fuse = function() {
  if (!this.volume) {
    return;
  }

  if (this.PT) {
    this.pathTracedVolume.updateActiveChannels(this);
  }
  else {
    this.rayMarchedAtlasVolume.fuse(this.fusion, this.volume.channels);
  }

};

VolumeDrawable.prototype.updateMaterial = function() {
  this.PT && this.pathTracedVolume.updateMaterial(this);
};

VolumeDrawable.prototype.updateLuts = function() {
  this.PT && this.pathTracedVolume.updateLuts(this);
  !this.PT && this.rayMarchedAtlasVolume.fuse(this.fusion, this.volume.channels);
};

VolumeDrawable.prototype.setVoxelSize = function(values) {
  this.volume.setVoxelSize(values);
  this.setScale(this.volume.scale);
};

VolumeDrawable.prototype.cleanup = function() {
  this.meshVolume.cleanup();
  this.volumeRendering.cleanup();
};

/**
 * @return a reference to the list of channel names
 */
VolumeDrawable.prototype.channelNames = function() {
  return this.channel_names;
};

VolumeDrawable.prototype.getChannel = function(channelIndex) {
  return this.volume.getChannel(channelIndex);
};

VolumeDrawable.prototype.onChannelLoaded = function(batch) {
  this.volumeRendering.onChannelData(batch);
  this.meshVolume.onChannelData(batch);

  // let the outside world have a chance
  if (this.onChannelDataReadyCallback) {
    this.onChannelDataReadyCallback();
  }
};

/**
 * Save a channel's isosurface as a triangle mesh to either STL or GLTF2 format.  File will be named automatically, using image name and channel name.
 * @param {number} channelIndex 
 * @param {string} type Either 'GLTF' or 'STL'
 */
VolumeDrawable.prototype.saveChannelIsosurface = function(channelIndex, type) {
  this.meshVolume.saveChannelIsosurface(channelIndex, type, this.name);
};

/**
 * Hide or display volume data for a channel
 * @param {number} channelIndex 
 * @param {boolean} enabled 
 */
VolumeDrawable.prototype.setVolumeChannelEnabled = function(channelIndex, enabled) {
  // flip the color to the "null" value
  this.fusion[channelIndex].rgbColor = enabled ? this.channel_colors[channelIndex] : 0;
  // if all are nulled out, then hide the volume element from the scene.
  if (this.fusion.every((elem)=>(elem.rgbColor === 0))) {
    this.volumeRendering.setVisible(false);
  }
  else {
    this.volumeRendering.setVisible(true);
  }
};

/**
 * Is volume data showing for this channel?
 * @return {boolean} Is volume data visible for this channel?
 * @param {number} channelIndex 
 */
VolumeDrawable.prototype.isVolumeChannelEnabled = function(channelIndex) {
  // the zero value for the fusion rgbColor is the indicator that a channel is hidden.
  return this.fusion[channelIndex].rgbColor !== 0;
};

/**
 * Set the color for a channel
 * @param {number} channelIndex 
 * @param {Array.<number>} colorrgb [r,g,b]
 */
VolumeDrawable.prototype.updateChannelColor = function(channelIndex, colorrgb) {
  if (!this.channel_colors[channelIndex]) {
    return;
  }
  this.channel_colors[channelIndex] = colorrgb;
  // if volume channel is zero'ed out, then don't update it until it is switched on again.
  if (this.fusion[channelIndex].rgbColor !== 0) {
    this.fusion[channelIndex].rgbColor = colorrgb;
    this.fuse();
  }
  this.meshVolume.updateMeshColors(this.channel_colors);
};

// TODO remove this from public interface?
VolumeDrawable.prototype.updateMeshColors = function() {
  this.meshVolume.updateMeshColors(this.channel_colors);
};

/**
 * Get the color for a channel
 * @return {Array.<number>} The color as array of [r,g,b]
 * @param {number} channelIndex 
 */
VolumeDrawable.prototype.getChannelColor = function(channelIndex) {
  return this.channel_colors[channelIndex];
};

/**
 * Set the material for a channel
 * @param {number} channelIndex 
 * @param {Array.<number>} colorrgb [r,g,b]
 * @param {Array.<number>} specularrgb [r,g,b]
 * @param {Array.<number>} emissivergb [r,g,b]
 * @param {number} roughness
 */
VolumeDrawable.prototype.updateChannelMaterial = function(channelIndex, colorrgb, specularrgb, emissivergb, roughness) {
  if (!this.channel_colors[channelIndex]) {
    return;
  }
  this.updateChannelColor(channelIndex, colorrgb);
  this.specular[channelIndex] = specularrgb;
  this.emissive[channelIndex] = emissivergb;
  this.roughness[channelIndex] = roughness;
};

/**
 * Set the global density of the volume data
 * @param {number} density Roughly equivalent to opacity, or how translucent or opaque the volume is
 * @param {boolean=} no_redraw Set to true to delay re-rendering. Otherwise ignore.
 */
VolumeDrawable.prototype.setDensity = function(density) {
  this.density = density;
  this.volumeRendering.setDensity(density);
};

/**
 * Get the global density of the volume data
 */
VolumeDrawable.prototype.getDensity = function() {
  return this.density;
};

/**
 * Set the global brightness of the volume data
 * @param {number} brightness Roughly speaking, an intensity multiplier on the whole volume
 * @param {boolean=} no_redraw Set to true to delay re-rendering. Otherwise ignore.
 */
VolumeDrawable.prototype.setBrightness = function(brightness) {
  this.brightness = brightness;
  this.volumeRendering.setBrightness(brightness);
};

/**
 * Get the global brightness of the volume data
 */
VolumeDrawable.prototype.getBrightness = function() {
  return this.brightness;
};

/**
 * Add a new channel ready to receive data from one of the setChannelDataFrom* calls.
 * Name and color will be defaulted if not provided. For now, leave imageInfo alone as the "original" data
 * @param {string} name 
 * @param {Array.<number>} color [r,g,b]
 */
VolumeDrawable.prototype.appendEmptyChannel = function(name, color) {
  let idx = this.num_channels;
  let chcolor = color || getColorByChannelIndex(idx);
  this.channel_colors.push(chcolor);
  this.fusion.push({
    chIndex: idx,
    lut:[],
    rgbColor: chcolor
  });

  this.meshVolume.appendEmptyChannel(chname);
  this.volumeRendering.appendEmptyChannel(chname);

  return idx;
};

/**
 * Assign a channel index as a mask channel (will multiply its color against the entire visible volume)
 * @param {number} channelIndex 
 */
VolumeDrawable.prototype.setChannelAsMask = function(channelIndex) {
  if (!this.volume.channels[channelIndex] || !this.volume.channels[channelIndex].loaded) {
    return false;
  }
  this.maskChannelIndex = channelIndex;
  return this.volumeRendering.setChannelAsMask(channelIndex);
};

/**
 * Set a multiplier for how much of the mask channel to mask out the background
 * @param {number} maskAlpha 
 */
VolumeDrawable.prototype.setMaskAlpha = function(maskAlpha) {
  this.maskAlpha = maskAlpha;
  this.volumeRendering.setMaskAlpha(maskAlpha);
};

/**
 * Get a value from the volume data
 * @return {number} the intensity value from the given channel at the given xyz location
 * @param {number} c The channel index
 * @param {number} x 
 * @param {number} y 
 * @param {number} z 
 */
VolumeDrawable.prototype.getIntensity = function(c, x, y, z) {
  return this.volume.getIntensity(c, x, y, z);
};

VolumeDrawable.prototype.onStartControls = function() {
  this.PT && this.pathTracedVolume.onStartControls();
};

VolumeDrawable.prototype.onChangeControls = function() {
  this.PT && this.pathTracedVolume.onChangeControls();
};

VolumeDrawable.prototype.onEndControls = function() {
  this.PT && this.pathTracedVolume.onEndControls();
};

VolumeDrawable.prototype.onCameraChanged = function(fov, focalDistance, apertureSize) {
  this.PT && this.pathTracedVolume.updateCamera(fov, focalDistance, apertureSize);
};

/**
 * Set clipping range (between 0 and 1) for the entire volume.
 * @param {number} xmin 0..1, should be less than xmax
 * @param {number} xmax 0..1, should be greater than xmin 
 * @param {number} ymin 0..1, should be less than ymax
 * @param {number} ymax 0..1, should be greater than ymin 
 * @param {number} zmin 0..1, should be less than zmax
 * @param {number} zmax 0..1, should be greater than zmin 
 */
VolumeDrawable.prototype.updateClipRegion = function(xmin, xmax, ymin, ymax, zmin, zmax) {
  this.volumeRendering.updateClipRegion(xmin, xmax, ymin, ymax, zmin, zmax);
};

VolumeDrawable.prototype.updateLights = function(state) {
  this.PT && this.pathTracedVolume.updateLights(state);
};

VolumeDrawable.prototype.setPixelSamplingRate = function(value) {
  this.volumeRendering.setPixelSamplingRate(value);
};


VolumeDrawable.prototype.setVolumeRendering = function(is_pathtrace) {
  if (is_pathtrace === this.PT) {
    return;
  }

  // remove old 3d object from scene
  is_pathtrace && this.sceneRoot.remove(this.meshVolume.get3dObject());
  this.sceneRoot.remove(this.volumeRendering.get3dObject());

  // destroy old resources.
  this.volumeRendering.cleanup();

  // create new
  if (is_pathtrace) {
    this.volumeRendering = new PathTracedVolume(this.volume);
    this.pathTracedVolume = this.volumeRendering;
  }
  else {
    this.volumeRendering = new RayMarchedAtlasVolume(this.volume);
    this.rayMarchedAtlasVolume = this.volumeRendering;

    for (var i = 0; i < this.volume.num_channels; ++i) {
      this.rayMarchedAtlasVolume.onChannelData([i]);
    }
  }

  this.PT = is_pathtrace;

  this.setChannelAsMask(this.maskChannelIndex);
  this.setMaskAlpha(this.maskAlpha);
  this.setScale(this.volume.scale);
  this.setBrightness(this.getBrightness());
  this.setDensity(this.getDensity());

  // add new 3d object to scene
  !this.PT && this.sceneRoot.add(this.meshVolume.get3dObject());
  this.sceneRoot.add(this.volumeRendering.get3dObject());

  this.fuse();
};


export default VolumeDrawable;

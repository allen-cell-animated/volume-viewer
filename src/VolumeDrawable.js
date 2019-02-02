import Volume from './Volume.js';
import { getColorByChannelIndex } from './constants/colors.js';
import MeshVolume from './meshVolume.js';
import RayMarchedAtlasVolume from './rayMarchedAtlasVolume.js';
import PathTracedVolume from './pathTracedVolume.js';

/**
 * A renderable multichannel volume image with 8-bits per channel intensity values.
 * @class
 * @param {imageInfo} imageInfo 
 */
export default class VolumeDrawable {

  constructor(imageInfo, requestPathTrace) {
    this.PT = !!requestPathTrace;

    // THE VOLUME DATA
    this.volume = new Volume(imageInfo);

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
  setChannelDataFromAtlas(channelIndex, atlasdata, atlaswidth, atlasheight) {
    this.volume.setChannelDataFromAtlas(channelIndex, atlasdata, atlaswidth, atlasheight);
    this.onChannelLoaded([channelIndex]);
  }

  /**
   * Assign volume data as a 3d array ordered x,y,z. The xy size must be equal to tilewidth*tileheight from the imageInfo used to construct this Volume.  Assumes that the incoming data is consistent with the image's pre-existing imageInfo tile metadata.
   * @param {number} channelIndex 
   * @param {Uint8Array} volumeData 
   */
  setChannelDataFromVolume(channelIndex, volumeData) {
    this.volume.setChannelDataFromVolume(channelIndex, volumeData);
    this.onChannelLoaded([channelIndex]);
  }

  resetSampleRate() {
    this.steps = this.maxSteps / 2;
  }

  setMaxSampleRate(qual) {
    this.maxSteps = qual;
    this.setUniform('maxSteps', qual);
  }

  setScale(scale) {

    this.scale = scale;

    this.currentScale = scale.clone();

    this.meshVolume.setScale(scale);
    this.volumeRendering.setScale(scale);
  }

  setOrthoScale(value) {
    this.volumeRendering.setOrthoScale(value);
  }

  setResolution(viewObj) {
    const x = viewObj.getWidth();
    const y = viewObj.getHeight();
    this.volumeRendering.setResolution(x, y);
    this.meshVolume.setResolution(x, y);
  }

  /**
   * Set clipping range (between 0 and 1) for a given axis. 
   * Calling this allows the rendering to compensate for changes in thickness in orthographic views that affect how bright the volume is.
   * @param {number} axis 0, 1, or 2 for x, y, or z axis
   * @param {number} minval 0..1, should be less than maxval
   * @param {number} maxval 0..1, should be greater than minval 
   * @param {boolean} isOrthoAxis is this an orthographic projection or just a clipping of the range for perspective view
   */
  setAxisClip(axis, minval, maxval, isOrthoAxis) {
    this.bounds.bmax[axis] = maxval;
    this.bounds.bmin[axis] = minval;
  
    !this.PT && this.meshVolume.setAxisClip(axis, minval, maxval, isOrthoAxis);
    this.volumeRendering.setAxisClip(axis, minval, maxval, isOrthoAxis);
  }

  /**
   * Tell this image that it needs to be drawn in an orthographic mode
   * @param {boolean} isOrtho is this an orthographic projection or a perspective view
   */
  setIsOrtho(isOrtho) {
    !this.PT && this.rayMarchedAtlasVolume.setIsOrtho(isOrtho);
  }

  setOrthoThickness(value) {
    !this.PT && this.meshVolume.setOrthoThickness(value);
    this.volumeRendering.setOrthoThickness(value);
  }

  /**
   * Set parameters for gamma curve for volume rendering.
   * @param {number} gmin 0..1
   * @param {number} glevel 0..1, should be <= gmax and >= gmin
   * @param {number} gmax 0..1, should be > gmin and >= glevel
   */
  setGamma(gmin, glevel, gmax) {
    !this.PT && this.rayMarchedAtlasVolume.setGamma(gmin, glevel, gmax);
  }

  setMaxProjectMode(isMaxProject) {
    !this.PT && this.rayMarchedAtlasVolume.setMaxProjectMode(isMaxProject);
  }

  onAnimate(canvas) {
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
  }

  /**
   * If an isosurface exists, update its isovalue and regenerate the surface. Otherwise do nothing.
   * @param {number} channel 
   * @param {number} value 
   */
  updateIsovalue(channel, value) {
    this.meshVolume.updateIsovalue(channel, value);
  }

  /**
   * 
   * @param {number} channel 
   * @return {number} the isovalue for this channel or undefined if this channel does not have an isosurface created
   */
  getIsovalue(channel) {
    return this.meshVolume.getIsovalue(channel);
  }

  /**
   * Set opacity for isosurface
   * @param {number} channel 
   * @param {number} value Opacity
   */
  updateOpacity(channel, value) {
    this.meshVolume.updateOpacity(channel, value);
  }

  /**
   * 
   * @param {number} channel 
   * @return true if there is currently a mesh isosurface for this channel
   */
  hasIsosurface(channel) {
    return this.meshVolume.hasIsosurface(channel);
  }

  /**
   * If an isosurface is not already created, then create one.  Otherwise do nothing.
   * @param {number} channel 
   * @param {number} value isovalue
   * @param {number=} alpha Opacity
   * @param {boolean=} transp render surface as transparent object
   */
  createIsosurface(channel, value, alpha, transp) {
    this.meshVolume.createIsosurface(channel, this.channel_colors[channel], value, alpha, transp);
  }

  /**
   * If an isosurface exists for this channel, destroy it now. Don't just hide it - assume we can free up some resources.
   * @param {number} channel 
   */
  destroyIsosurface(channel) {
    this.meshVolume.destroyIsosurface(channel);
  }

  fuse() {
    if (!this.volume) {
      return;
    }

    if (this.PT) {
      this.pathTracedVolume.updateActiveChannels(this);
    }
    else {
      this.rayMarchedAtlasVolume.fuse(this.fusion, this.volume.channels);
    }

  }

  updateMaterial() {
    this.PT && this.pathTracedVolume.updateMaterial(this);
  }

  updateLuts() {
    this.PT && this.pathTracedVolume.updateLuts(this);
    !this.PT && this.rayMarchedAtlasVolume.fuse(this.fusion, this.volume.channels);
  }

  setVoxelSize(values) {
    this.volume.setVoxelSize(values);
    this.setScale(this.volume.scale);
  }

  cleanup() {
    this.meshVolume.cleanup();
    this.volumeRendering.cleanup();
  }

  /**
   * @return a reference to the list of channel names
   */
  channelNames() {
    return this.channel_names;
  }

  getChannel(channelIndex) {
    return this.volume.getChannel(channelIndex);
  }

  onChannelLoaded(batch) {
    this.volumeRendering.onChannelData(batch);
    this.meshVolume.onChannelData(batch);

    // let the outside world have a chance
    if (this.onChannelDataReadyCallback) {
      this.onChannelDataReadyCallback();
    }
  }

  /**
   * Save a channel's isosurface as a triangle mesh to either STL or GLTF2 format.  File will be named automatically, using image name and channel name.
   * @param {number} channelIndex 
   * @param {string} type Either 'GLTF' or 'STL'
   */
  saveChannelIsosurface(channelIndex, type) {
    this.meshVolume.saveChannelIsosurface(channelIndex, type, this.name);
  }

  /**
   * Hide or display volume data for a channel
   * @param {number} channelIndex 
   * @param {boolean} enabled 
   */
  setVolumeChannelEnabled(channelIndex, enabled) {
    // flip the color to the "null" value
    this.fusion[channelIndex].rgbColor = enabled ? this.channel_colors[channelIndex] : 0;
    // if all are nulled out, then hide the volume element from the scene.
    if (this.fusion.every((elem)=>(elem.rgbColor === 0))) {
      this.volumeRendering.setVisible(false);
    }
    else {
      this.volumeRendering.setVisible(true);
    }
  }

  /**
   * Is volume data showing for this channel?
   * @return {boolean} Is volume data visible for this channel?
   * @param {number} channelIndex 
   */
  isVolumeChannelEnabled(channelIndex) {
    // the zero value for the fusion rgbColor is the indicator that a channel is hidden.
    return this.fusion[channelIndex].rgbColor !== 0;
  }

  /**
   * Set the color for a channel
   * @param {number} channelIndex 
   * @param {Array.<number>} colorrgb [r,g,b]
   */
  updateChannelColor(channelIndex, colorrgb) {
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
  }

  // TODO remove this from public interface?
  updateMeshColors() {
    this.meshVolume.updateMeshColors(this.channel_colors);
  }

  /**
   * Get the color for a channel
   * @return {Array.<number>} The color as array of [r,g,b]
   * @param {number} channelIndex 
   */
  getChannelColor(channelIndex) {
    return this.channel_colors[channelIndex];
  }

  /**
   * Set the material for a channel
   * @param {number} channelIndex 
   * @param {Array.<number>} colorrgb [r,g,b]
   * @param {Array.<number>} specularrgb [r,g,b]
   * @param {Array.<number>} emissivergb [r,g,b]
   * @param {number} roughness
   */
  updateChannelMaterial(channelIndex, colorrgb, specularrgb, emissivergb, roughness) {
    if (!this.channel_colors[channelIndex]) {
      return;
    }
    this.updateChannelColor(channelIndex, colorrgb);
    this.specular[channelIndex] = specularrgb;
    this.emissive[channelIndex] = emissivergb;
    this.roughness[channelIndex] = roughness;
  }

  /**
   * Set the global density of the volume data
   * @param {number} density Roughly equivalent to opacity, or how translucent or opaque the volume is
   * @param {boolean=} no_redraw Set to true to delay re-rendering. Otherwise ignore.
   */
  setDensity(density) {
    this.density = density;
    this.volumeRendering.setDensity(density);
  }

  /**
   * Get the global density of the volume data
   */
  getDensity() {
    return this.density;
  }

  /**
   * Set the global brightness of the volume data
   * @param {number} brightness Roughly speaking, an intensity multiplier on the whole volume
   * @param {boolean=} no_redraw Set to true to delay re-rendering. Otherwise ignore.
   */
  setBrightness(brightness) {
    this.brightness = brightness;
    this.volumeRendering.setBrightness(brightness);
  }

  /**
   * Get the global brightness of the volume data
   */
  getBrightness() {
    return this.brightness;
  }

  /**
   * Add a new channel ready to receive data from one of the setChannelDataFrom* calls.
   * Name and color will be defaulted if not provided. For now, leave imageInfo alone as the "original" data
   * @param {string} name 
   * @param {Array.<number>} color [r,g,b]
   */
  appendEmptyChannel(name, color) {
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
  }

  /**
   * Assign a channel index as a mask channel (will multiply its color against the entire visible volume)
   * @param {number} channelIndex 
   */
  setChannelAsMask(channelIndex) {
    if (!this.volume.channels[channelIndex] || !this.volume.channels[channelIndex].loaded) {
      return false;
    }
    this.maskChannelIndex = channelIndex;
    return this.volumeRendering.setChannelAsMask(channelIndex);
  }

  /**
   * Set a multiplier for how much of the mask channel to mask out the background
   * @param {number} maskAlpha 
   */
  setMaskAlpha(maskAlpha) {
    this.maskAlpha = maskAlpha;
    this.volumeRendering.setMaskAlpha(maskAlpha);
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
    return this.volume.getIntensity(c, x, y, z);
  }

  onStartControls() {
    this.PT && this.pathTracedVolume.onStartControls();
  }

  onChangeControls() {
    this.PT && this.pathTracedVolume.onChangeControls();
  }

  onEndControls() {
    this.PT && this.pathTracedVolume.onEndControls();
  }

  onCameraChanged(fov, focalDistance, apertureSize) {
    this.PT && this.pathTracedVolume.updateCamera(fov, focalDistance, apertureSize);
  }

  /**
   * Set clipping range (between 0 and 1) for the entire volume.
   * @param {number} xmin 0..1, should be less than xmax
   * @param {number} xmax 0..1, should be greater than xmin 
   * @param {number} ymin 0..1, should be less than ymax
   * @param {number} ymax 0..1, should be greater than ymin 
   * @param {number} zmin 0..1, should be less than zmax
   * @param {number} zmax 0..1, should be greater than zmin 
   */
  updateClipRegion(xmin, xmax, ymin, ymax, zmin, zmax) {
    this.volumeRendering.updateClipRegion(xmin, xmax, ymin, ymax, zmin, zmax);
  }

  updateLights(state) {
    this.PT && this.pathTracedVolume.updateLights(state);
  }

  setPixelSamplingRate(value) {
    this.volumeRendering.setPixelSamplingRate(value);
  }


  setVolumeRendering(is_pathtrace) {
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
  }

};


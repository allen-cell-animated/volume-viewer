import {ThreeJsPanel} from './ThreeJsPanel.js';
import lightSettings from './constants/lights.js';
import VolumeDrawable from './VolumeDrawable.js';
import {Light, AREA_LIGHT, SKY_LIGHT} from './Light.js';

/**
 * @class
 */
export class View3d {
  /**
   * @param {HTMLElement} parentElement the 3d display will try to fill the parent element.
   * @param {Object} options This is an optional param. The only option is currently boolean {useWebGL2:true} which defaults to true.
   */
  constructor(parentElement, options) {
    options = options || { useWebGL2: true };
    if (options.useWebGL2 === undefined) { options.useWebGL2 = true; }

    this.canvas3d = new ThreeJsPanel(parentElement, options.useWebGL2);
    this.redraw = this.redraw.bind(this);
    this.scene = null;
    this.backgroundColor = 0x000000;

    this.loaded = false;
    let that = this;
    this.parentEl = parentElement;
    window.addEventListener('resize', () => that.resize(null, that.parentEl.offsetWidth, that.parentEl.offsetHeight));

    this.buildScene();
  }

  // prerender should be called on every redraw and should be the first thing done.
  preRender() {
    if (this.scene.getObjectByName('lightContainer')) {
      this.scene.getObjectByName('lightContainer').rotation.setFromRotationMatrix(this.canvas3d.camera.matrixWorld);
    }
    // keep the ortho scale up to date.
    if (this.image && this.canvas3d.camera.isOrthographicCamera) {
      this.image.setOrthoScale(this.canvas3d.controls.scale);
    }
  };

  /**
   * Force a redraw.  This is generally not needed because of constant redraws in the main animation loop.
   */
  redraw() {
    this.canvas3d.rerender();
  };

  unsetImage() {
    if (this.image) {
      this.canvas3d.removeControlHandlers();
      if (this.canvas3d.isVR()) {
        this.canvas3d.onLeaveVR();
      }
      this.canvas3d.onEnterVRCallback = null;
      this.canvas3d.onLeaveVRCallback = null;
      this.canvas3d.animate_funcs = [];
      this.scene.remove(this.image.sceneRoot);
    }
    return this.image;
  }

  /**
   * Add a new volume image to the viewer.  (The viewer currently only supports a single image at a time - adding repeatedly, without removing in between, is a potential resource leak)
   * @param {Volume} volume 
   */
  addVolume(volume) {
    volume.addVolumeDataObserver(this);
    this.setImage(new VolumeDrawable(volume, this.volumeRenderMode === 1));
  }

  /**
   * Remove a volume image from the viewer.  This will clean up the View3D's resources for the current volume
   * @param {Volume} volume 
   */
  removeVolume(volume) {
    const oldImage = this.unsetImage();
    if (oldImage) {
      oldImage.cleanup();
    }
    if (volume) {
      // assert oldImage.volume === volume!
      volume.removeVolumeDataObserver(this);
    }
  }

  /**
   * Remove all volume images from the viewer.
   */
  removeAllVolumes() {
    if (this.image) {
      this.removeVolume(this.image.volume);
    }
  }

  // channels is an array of channel indices for which new data just arrived.
  onVolumeData(volume, channels) {
    // todo get image for volume (this.volumes.indexof?)
    this.image.onChannelLoaded(channels);
  }

  /**
   * Assign a channel index as a mask channel (will multiply its color against the entire visible volume)
   * @param {Object} volume 
   * @param {number} mask_channel_index 
   */
  setVolumeChannelAsMask(volume, mask_channel_index) {
    this.image.setChannelAsMask(mask_channel_index);
  }

  /**
   * Set voxel dimensions - controls volume scaling. For example, the physical measurements of the voxels from a biological data set
   * @param {Object} volume 
   * @param {number} values Array of x,y,z floating point values for the physical voxel size scaling
   */
  setVoxelSize(volume, values) {
    if (this.image) {
      this.image.setVoxelSize(values);
    }
  }

  /**
   * If an isosurface is not already created, then create one.  Otherwise do nothing.
   * @param {Object} volume 
   * @param {number} channel 
   * @param {number} isovalue isovalue
   * @param {number=} alpha Opacity
   */
  createIsosurface(volume, channel, isovalue, alpha) {
    if (!this.image) {
      return;
    }
    if (this.image.hasIsosurface(channel)) {
      this.image.updateIsovalue(channel, isovalue);
    }
    else {
      this.image.createIsosurface(channel, isovalue, alpha, alpha < 0.95);
    }
  }

  /**
   * Is an isosurface already created for this channel?
   * @param {Object} volume 
   * @param {number} channel 
   * @return true if there is currently a mesh isosurface for this channel
   */
  hasIsosurface(volume, channel) {
    return this.image.hasIsosurface(channel);
  }

  /**
   * If an isosurface exists, update its isovalue and regenerate the surface. Otherwise do nothing.
   * @param {Object} volume 
   * @param {number} channel 
   * @param {number} isovalue
   */
  updateIsosurface(volume, channel, isovalue) {
    if (!this.image || !this.image.hasIsosurface(channel)) {
      return;
    }
    this.image.updateIsovalue(channel, isovalue);
  }

  /**
   * Set opacity for isosurface
   * @param {Object} volume 
   * @param {number} channel 
   * @param {number} opacity Opacity
   */
  updateOpacity(volume, channel, opacity) {
    if (!this.image) {
      return;
    }
    this.image.updateOpacity(channel, opacity);
  }
  
  /**
   * If an isosurface exists for this channel, hide it now
   * @param {Object} volume 
   * @param {number} channel 
   */
  clearIsosurface(volume, channel) {
    this.image.destroyIsosurface(channel);
  }

  /**
   * Save a channel's isosurface as a triangle mesh to either STL or GLTF2 format.  File will be named automatically, using image name and channel name.
   * @param {Object} volume 
   * @param {number} channelIndex 
   * @param {string} type Either 'GLTF' or 'STL'
   */
  saveChannelIsosurface(volume, channelIndex, type) {
    this.image.saveChannelIsosurface(channelIndex, type);
  }

  // Add a new volume image to the viewer.  The viewer currently only supports a single image at a time, and will return any prior existing image.
  setImage(img) {
    const oldImage = this.unsetImage();

    this.image = img;

    this.scene.add(img.sceneRoot);

    this.image.setResolution(this.canvas3d);

    var that = this;
    this.image.onChannelDataReadyCallback = function() {
        // ARTIFICIALLY ENABLE ONLY THE FIRST 3 CHANNELS
        for (let i = 0; i < that.image.num_channels; ++i) {
          that.image.setVolumeChannelEnabled(i, (i<3));
        }
    };

    this.canvas3d.setControlHandlers(this.image);

    this.canvas3d.animate_funcs.push(this.preRender.bind(this));
    this.canvas3d.animate_funcs.push(img.onAnimate.bind(img));
    this.canvas3d.onEnterVRCallback = () => {
      if (this.canvas3d.vrControls) {
        this.canvas3d.vrControls.pushObjectState(this.image);
      }
    };
    this.canvas3d.onLeaveVRCallback = () => {
      if (this.canvas3d.vrControls) {
        this.canvas3d.vrControls.popObjectState(this.image);
      }
    };

    // start draw loop
    this.canvas3d.rerender();

    return oldImage;
  };

  buildScene() {
    this.scene = this.canvas3d.scene;

    this.oldScale = new THREE.Vector3(0.5, 0.5, 0.5);
    this.currentScale = new THREE.Vector3(0.5, 0.5, 0.5);

    // background color
    this.canvas3d.renderer.setClearColor(this.backgroundColor, 1.000);

    this.lights = [new Light(SKY_LIGHT), new Light(AREA_LIGHT)];

    this.lightContainer = new THREE.Object3D();
    this.lightContainer.name = 'lightContainer';

    this.ambientLight = new THREE.AmbientLight(lightSettings.ambientLightSettings.color, lightSettings.ambientLightSettings.intensity);
    this.lightContainer.add(this.ambientLight);

    // key light
    this.spotLight = new THREE.SpotLight(lightSettings.spotlightSettings.color, lightSettings.spotlightSettings.intensity);
    this.spotLight.position.set(
        lightSettings.spotlightSettings.position.x,
        lightSettings.spotlightSettings.position.y,
        lightSettings.spotlightSettings.position.z
    );
    this.spotLight.target = new THREE.Object3D();  // this.substrate;
    this.spotLight.angle = lightSettings.spotlightSettings.angle;


    this.lightContainer.add(this.spotLight);

    // reflect light
    this.reflectedLight = new THREE.DirectionalLight(lightSettings.reflectedLightSettings.color);
    this.reflectedLight.position.set(
        lightSettings.reflectedLightSettings.position.x,
        lightSettings.reflectedLightSettings.position.y,
        lightSettings.reflectedLightSettings.position.z
    );
    this.reflectedLight.castShadow = lightSettings.reflectedLightSettings.castShadow;
    this.reflectedLight.intensity = lightSettings.reflectedLightSettings.intensity;
    this.lightContainer.add(this.reflectedLight);

    // fill light
    this.fillLight = new THREE.DirectionalLight(lightSettings.fillLightSettings.color);
    this.fillLight.position.set(
        lightSettings.fillLightSettings.position.x,
        lightSettings.fillLightSettings.position.y,
        lightSettings.fillLightSettings.position.z
    );
    this.fillLight.castShadow = lightSettings.fillLightSettings.castShadow;
    this.fillLight.intensity = lightSettings.fillLightSettings.intensity;
    this.lightContainer.add(this.fillLight);

    this.scene.add(this.lightContainer);
  };

  /**
   * Change the camera projection to look along an axis, or to view in a 3d perspective camera.
   * @param {string} mode Mode can be "3D", or "XY" or "Z", or "YZ" or "X", or "XZ" or "Y".  3D is a perspective view, and all the others are orthographic projections
   */
  setCameraMode(mode) {
    this.canvas3d.switchViewMode(mode);
    if (this.image) {
      this.image.setIsOrtho(mode !== '3D');
    }
  };

  /**
   * Enable or disable 3d axis display at lower left.
   * @param {boolean} autorotate 
   */
  setShowAxis(showAxis) {
    this.canvas3d.showAxis = showAxis;
  };

  /**
   * Enable or disable a turntable rotation mode. The display will continuously spin about the vertical screen axis.
   * @param {boolean} autorotate 
   */
  setAutoRotate(autorotate) {
    this.canvas3d.setAutoRotate(autorotate);

    if (autorotate) {
      this.image.onStartControls();
    }
    else {
      this.image.onEndControls();
    }  
  };

  /**
   * Notify the view that it has been resized.  This will automatically be connected to the window when the View3d is created.
   * @param {HTMLElement=} comp Ignored.
   * @param {number=} w Width, or parent element's offsetWidth if not specified. 
   * @param {number=} h Height, or parent element's offsetHeight if not specified.
   * @param {number=} ow Ignored.
   * @param {number=} oh Ignored.
   * @param {Object=} eOpts Ignored.
   */
  resize(comp, w, h, ow, oh, eOpts) {
    w = w || this.parentEl.offsetWidth;
    h = h || this.parentEl.offsetHeight;
    this.canvas3d.resize(comp, w, h, ow, oh, eOpts);

    if (this.image) {
      this.image.setResolution(this.canvas3d);
    }
  };

  /**
   * Set the volume scattering density
   * @param {Object} volume 
   * @param {number} density 0..100 UI slider value
   */
  updateDensity(volume, density) {
    if (this.image) {
      this.image.setDensity(density/100.0);
    }
  };

  /**
   * Set the shading method - applies to pathtraced render mode only
   * @param {Object} volume 
   * @param {number} isbrdf true for brdf model, false for isotropic phase function model
   */
  updateShadingMethod(volume, isbrdf) {
    if (this.image) {
      this.image.updateShadingMethod(isbrdf);
    }
  };

  /**
   * Set gamma levels: this affects the transparency and brightness of the single pass ray march volume render
   * @param {Object} volume 
   * @param {number} gmin 
   * @param {number} glevel 
   * @param {number} gmax 
   */
  setGamma(volume, gmin, glevel, gmax) {
    if (this.image) {
      this.image.setGamma(gmin, glevel, gmax);
    }
  }

  /**
   * Set max projection on or off - applies to single pass raymarch render mode only
   * @param {Object} volume 
   * @param {boolean} isMaxProject true for max project, false for regular volume ray march integration 
   */
  setMaxProjectMode(volume, isMaxProject) {
    if (this.image) {
      this.image.setMaxProjectMode(isMaxProject);
    }
  }

  /**
   * Notify the view that the set of active volume channels has been modified.
   * @param {Object} volume
   */
  updateActiveChannels(volume) {
    if (this.image) {
      this.image.fuse();
    }
  }

  /**
   * Notify the view that transfer function lookup table data has been modified.
   * @param {Object} volume
   */
  updateLuts(volume) {
    if (this.image) {
      this.image.updateLuts();
    }
  }

  /**
   * Notify the view that color and appearance settings have been modified.
   * @param {Object} volume
   */
  updateMaterial(volume) {
    if (this.image) {
      this.image.updateMaterial();
    }
  }
  
  /**
   * Increase or decrease the overall brightness of the rendered image
   * @param {number} e 0..1
   */
  updateExposure(e) {
    if (this.image) {
      this.image.setBrightness(e);
    }
  }

  /**
   * Set camera focus properties.
   * @param {number} fov Vertical field of view in degrees 
   * @param {number} focalDistance view-space units for center of focus 
   * @param {number} apertureSize view-space units for radius of camera aperture
   */
  updateCamera(fov, focalDistance, apertureSize) {
    const cam = this.canvas3d.perspectiveCamera;
    cam.fov = fov;
    this.canvas3d.fov = fov;
    cam.updateProjectionMatrix();

    if (this.image) {
      this.image.onCameraChanged(fov, focalDistance, apertureSize);
    }
  }

  /**
   * Set clipping range (between 0 and 1, relative to bounds) for the current volume.
   * @param {Object} volume
   * @param {number} xmin 0..1, should be less than xmax
   * @param {number} xmax 0..1, should be greater than xmin 
   * @param {number} ymin 0..1, should be less than ymax
   * @param {number} ymax 0..1, should be greater than ymin 
   * @param {number} zmin 0..1, should be less than zmax
   * @param {number} zmax 0..1, should be greater than zmin 
   */
  updateClipRegion(volume, xmin, xmax, ymin, ymax, zmin, zmax) {
    if (this.image) {
      this.image.updateClipRegion(xmin, xmax, ymin, ymax, zmin, zmax);
    }
  }

  /**
   * Set clipping range (between 0 and 1) for a given axis. 
   * Calling this allows the rendering to compensate for changes in thickness in orthographic views that affect how bright the volume is.
   * @param {Object} volume
   * @param {number} axis 0, 1, or 2 for x, y, or z axis
   * @param {number} minval 0..1, should be less than maxval
   * @param {number} maxval 0..1, should be greater than minval 
   * @param {boolean} isOrthoAxis is this an orthographic projection or just a clipping of the range for perspective view
   */
  setAxisClip(volume, axis, minval, maxval, isOrthoAxis) {
    if (this.image) {
      this.image.setAxisClip(axis, minval, maxval, isOrthoAxis);
    }
  }

  /**
   * Update lights
   * @param {Array} state array of Lights
   */
  updateLights(state) {
    // TODO flesh this out
    this.lights = state;

    if (this.image) {
      this.image.updateLights(state);
    }
  }

  /**
   * Set a sampling rate to trade performance for quality.
   * @param {number} value (+epsilon..1) 1 is max quality, ~0.1 for lowest quality and highest speed
   */
  updatePixelSamplingRate(value) {
    if (this.image) {
      this.image.setPixelSamplingRate(value);
    }
  }

  /**
   * Set the opacity of the mask channel
   * @param {Object} volume
   * @param {number} value (0..1) 0 for full transparent, 1 for fully opaque
   */
  updateMaskAlpha(volume, value) {
    if (this.image) {
      this.image.setMaskAlpha(value);
    }
  }
  
  /**
   * Show / hide volume channels
   * @param {Object} volume
   * @param {number} channel
   * @param {boolean} enabled
   */
  setVolumeChannelEnabled(volume, channel, enabled) {
    if (this.image) {
      this.image.setVolumeChannelEnabled(channel, enabled);
    }
  }

  /**
   * Set the material for a channel
   * @param {Object} volume
   * @param {number} channelIndex 
   * @param {Array.<number>} colorrgb [r,g,b]
   * @param {Array.<number>} specularrgb [r,g,b]
   * @param {Array.<number>} emissivergb [r,g,b]
   * @param {number} roughness
   */
  updateChannelMaterial(volume, channelIndex, colorrgb, specularrgb, emissivergb, roughness) {
    if (this.image) {
      this.image.updateChannelMaterial(channelIndex, colorrgb, specularrgb, emissivergb, roughness);
    }
  }

  /**
   * Set the color for a channel
   * @param {Object} volume
   * @param {number} channelIndex 
   * @param {Array.<number>} colorrgb [r,g,b]
   */
  updateChannelColor(volume, channelIndex, colorrgb) {
    if (this.image) {
      this.image.updateChannelColor(channelIndex, colorrgb);
    }
  }

  /**
   * Switch between single pass ray-marched volume rendering and progressive path traced rendering.
   * @param {number} mode 0 for single pass ray march, 1 for progressive path trace
   */
  setVolumeRenderMode(mode) {
    this.volumeRenderMode = mode;
    if (this.image) {
      if (mode === 1 && this.canvas3d.hasWebGL2 && !this.canvas3d.isVR()) {
        this.image.setVolumeRendering(true);
        this.image.updateLights(this.lights);
      }
      else {
        this.image.setVolumeRendering(false);
      }
      this.image.setResolution(this.canvas3d);  
      this.setAutoRotate(this.canvas3d.controls.autoRotate);
    }
  }
};


import {AICSthreeJsPanel} from './AICSthreeJsPanel.js';
import lightSettings from './constants/lights.js';

/**
 * @class
 */
export class AICSview3d {
  /**
   * @param {HTMLElement} parentElement the 3d display will try to fill the parent element.
   */
  constructor(parentElement) {
    this.canvas3d = new AICSthreeJsPanel(parentElement, true);
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
   * Add a new volume image to the viewer.  The viewer currently only supports a single image at a time, and will return any prior existing image.
   * @param {AICSvolumeDrawable} img 
   */
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
   * Notify the view that it has been resized.  This will automatically be connected to the window when the AICSview3d is created.
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
   * @param {number} density 0..100 UI slider value
   */
  updateDensity(density) {
    if (this.image) {
      this.image.setDensity(density/100.0);
    }
  };

  updateShadingMethod(isbrdf) {
    if (this.image) {
      this.image.updateShadingMethod(isbrdf);
    }
  };

  updateShowLights(showlights) {

  }

  /**
   * Notify the view that the set of active volume channels has been modified.
   */
  updateActiveChannels() {
    if (this.image) {
      this.image.fuse();
    }
  }

  /**
   * Notify the view that transfer function lookup table data has been modified.
   */
  updateLuts() {
    if (this.image) {
      this.image.updateLuts();
    }
  }

  /**
   * Notify the view that color and appearance settings have been modified.
   */
  updateMaterial() {
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
   * Set clipping range (between 0 and 1) for the current volume.
   * @param {number} xmin 0..1, should be less than xmax
   * @param {number} xmax 0..1, should be greater than xmin 
   * @param {number} ymin 0..1, should be less than ymax
   * @param {number} ymax 0..1, should be greater than ymin 
   * @param {number} zmin 0..1, should be less than zmax
   * @param {number} zmax 0..1, should be greater than zmin 
   */
  updateClipRegion(xmin, xmax, ymin, ymax, zmin, zmax) {
    if (this.image) {
      this.image.updateClipRegion(xmin, xmax, ymin, ymax, zmin, zmax);
    }
  }

  /**
   * Update lights
   * @param {Array} state array of Lights
   */
  updateLights(state) {
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
   * Switch between single pass ray-marched volume rendering and progressive path traced rendering.
   * @param {boolean} isPT true for progressive path trace, false for single pass ray march
   */
  setPathTrace(isPT) {
    if (this.image) {
      if (isPT && this.canvas3d.hasWebGL2 && !this.canvas3d.isVR()) {
        this.image.setVolumeRendering(isPT);
      }
      else {
        this.image.setVolumeRendering(false);
      }
      this.image.setResolution(this.canvas3d);  
      this.setAutoRotate(this.canvas3d.controls.autoRotate);
    }
  }
};


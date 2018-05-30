import {AICSthreeJsPanel} from './AICSthreeJsPanel.js';
import lightSettings from './constants/lights.js';

export class AICSview3d {
  constructor(parentElement) {
    this.canvas3d = new AICSthreeJsPanel(parentElement);
    this.redraw = this.redraw.bind(this);
    this.scene = null;
    this.backgroundColor = 0x000000;

    // a light source...
    //this.light = null;

    this.loaded = false;
    let that = this;
    this.parentEl = parentElement;
    window.addEventListener('resize', () => that.resize(null, that.parentEl.offsetWidth, that.parentEl.offsetHeight));

    this.buildScene();
  }

  preRender() {
    if (this.scene.getObjectByName('lightContainer')) {
      this.scene.getObjectByName('lightContainer').rotation.setFromRotationMatrix(this.canvas3d.camera.matrixWorld);
    }
  };

  redraw() {
    this.canvas3d.rerender();
  };

  destroyImage() {
    if (this.image) {
      this.canvas3d.animate_funcs = [];
      this.scene.remove(this.image.sceneRoot);
      this.image.cleanup();
      this.image = null;
    }
  }

  setImage(img) {
    this.destroyImage();

    this.image = img;
    this.image.redraw = this.redraw.bind(this);

    this.scene.add(img.sceneRoot);

    this.image.setResolution(this.canvas3d);

    this.canvas3d.animate_funcs.push(this.preRender.bind(this));
    this.canvas3d.animate_funcs.push(img.onAnimate.bind(img));
  };

  buildScene() {
    this.scene = new THREE.Scene();
    this.canvas3d.scene = this.scene;

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

  setCameraMode(mode) {
    this.canvas3d.switchViewMode(mode);
    if (this.image && mode === '3D') {
      // reset ortho thickness when mode changes to 3D.
      this.image.setOrthoThickness(1.0);
    }
  };

  setAutoRotate(autorotate) {
    this.canvas3d.setAutoRotate(autorotate);
  };

  resize(comp, w, h, ow, oh, eOpts) {
    w = w || this.parentEl.offsetWidth;
    h = h || this.parentEl.offsetHeight;
    this.canvas3d.resize(comp, w, h, ow, oh, eOpts);

    if (this.image) {
      this.image.setResolution(this.canvas3d);
    }
  };

}

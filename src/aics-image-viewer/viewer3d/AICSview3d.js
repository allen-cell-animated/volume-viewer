import {AICSthreeJsPanel} from './AICSthreeJsPanel.js';
export class AICSview3d {
  constructor(parentElement) {
    this.canvas3d = new AICSthreeJsPanel(parentElement);
    this.redraw = this.redraw.bind(this);
    this.scene = null;

    // a light source...
    //this.light = null;

    this.loaded = false;
    let that = this;
    this.parentEl = parentElement;
    window.addEventListener('resize', () => that.resize(null, that.parentEl.offsetWidth, that.parentEl.offsetHeight));

    this.buildScene();
  }

  preRender() {
    const HEADLIGHT_OFFSET_FACTOR_X = 0.6;
    const HEADLIGHT_OFFSET_FACTOR_Y = 0.9;
    // distance from camera to origin
    const len = this.canvas3d.camera.position.length();
    let updelta = new THREE.Vector3().copy(this.canvas3d.camera.up).multiplyScalar(len * HEADLIGHT_OFFSET_FACTOR_Y);
    let leftdelta = new THREE.Vector3().crossVectors(this.canvas3d.camera.up, this.canvas3d.camera.getWorldDirection(new THREE.Vector3())).multiplyScalar(len * HEADLIGHT_OFFSET_FACTOR_X);
    let p = new THREE.Vector3().add(this.canvas3d.camera.position).add(updelta).add(leftdelta);
    this.headLight.position.set( p.x, p.y, p.z );
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

  setImage(img, onChannelDataReadyCallback) {
    this.destroyImage();

    this.image = img;
    this.image.redraw = this.redraw;

    this.scene.add(img.sceneRoot);

    this.image.setResolution(this.canvas3d);

    this.onChannelDataReadyCallback = onChannelDataReadyCallback;
    this.image.loadChannels(this.onAllChannelsLoaded.bind(this), this.onChannelLoaded.bind(this));

    this.canvas3d.animate_funcs.push(this.preRender.bind(this));
    this.canvas3d.animate_funcs.push(img.onAnimate.bind(img));
  };

  buildScene() {
    this.scene = new THREE.Scene();

    //this.light = new THREE.PointLight(0xFFFFFF, 1, 100);
    //this.scene.add(this.light);
    this.canvas3d.scene = this.scene;
    this.oldScale = new THREE.Vector3(0.5, 0.5, 0.5);
    this.currentScale = new THREE.Vector3(0.5, 0.5, 0.5);
    this.canvas3d.renderer.setClearColor(0x000000, 1.000);

    this.headLight = new THREE.DirectionalLight( 0xffffff );
    this.headLight.position.set( 0.0, 0.0, 1 );
    this.scene.add( this.headLight );

    let ambientLight = new THREE.AmbientLight( 0x080808 );
    this.scene.add( ambientLight );

    ///////////////////////////////
    // Proof of concept of rendering a mesh model
    // TODO needs lighting/material

    // if (!me.segmentationMesh) {
    //   var onProgress = function(xhr) {
    //       if (xhr.lengthComputable) {
    //           var percentComplete = xhr.loaded / xhr.total * 100;
    //           console.log(Math.round(percentComplete, 2) + '% downloaded');
    //       }
    //   };
    //
    //   var onError = function(xhr) {};
    //
    //   var loader = new THREE.OBJLoader(/*manager*/);
    //   loader.load('/src/shaders/Cell4mito_Collada_lowRes_1.obj', function(object) {
    //
    // 		var bbox = new THREE.Box3().setFromObject(object);
    // 		var s = bbox.size();
    //
    //
    //       object.traverse(function(child) {
    //           if (child instanceof THREE.Mesh) {
    // 						// for consistency need to set vertex colors to this color too,
    // 						// because of polyShaderMaterial expects vertex color attrib.
    // 						child.material = new THREE.MeshBasicMaterial({
    // 								color : 0xffff00
    // 						});
    //             //child.material = me.volumeObject.polyShaderMaterial;
    // 						// scale down and center on 0,0,0
    // 						child.position.set(-1, -1, 1);
    //
    // 						child.scale.set(1.0/s.x, 1.0/s.y, 1.0/s.z);
    // 						me.segmentationMesh = me.volumeObject.addMeshObject(child, true);
    // 						me.scene.add(child);
    //           }
    //       });
    // 			//object.material = me.volumeObject.polyShaderMaterial;
    //
    //
    //
    //   }, onProgress, onError);
    // }
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

  onAllChannelsLoaded() {
  };

  onChannelLoaded(batch) {
    // any channels not yet loaded must just be set to 0 color for this fuse.
    this.image.fuse();

    for (var j = 0; j < batch.length; ++j) {
      var idx = batch[j];
      if (this.onChannelDataReadyCallback) {
        this.onChannelDataReadyCallback(idx);
      }
    }

  };

}

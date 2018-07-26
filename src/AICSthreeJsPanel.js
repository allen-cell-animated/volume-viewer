import AICStrackballControls from './AICStrackballControls.js';

export class AICSthreeJsPanel {
  constructor(parentElement) {
    this.canvas = document.createElement('canvas');
    this.canvas.setAttribute('id', 'cellViewCanvas');
    this.canvas.height=parentElement.offsetHeight;
    this.canvas.width=parentElement.offsetWidth;
    parentElement.appendChild(this.canvas);


    this.zooming = false;
    this.animate_funcs = [];
    this.mousedown = false;
    this.needs_render = true;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      preserveDrawingBuffer : true,
      alpha: true,
      premultipliedAlpha: false,
      sortObjects: true
    });
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.state.setBlending(THREE.NormalBlending);

    this.clock = new THREE.Clock();

    var scale = 0.5;
    this.orthoScale = scale;
    var cellPos = new THREE.Vector3(0,0,0);
    var aspect = this.getWidth() / this.getHeight();

    this.fov = 20;

    this.perspectiveCamera = new THREE.PerspectiveCamera(this.fov, aspect, 0.001, 20);
    this.perspectiveCamera.position.z = 5.0;
    this.perspectiveCamera.up.x = 0.0;
    this.perspectiveCamera.up.y = 1.0;
    this.perspectiveCamera.up.z = 0.0;
    this.perspectiveControls = new AICStrackballControls(this.perspectiveCamera, this.canvas);
    this.perspectiveControls.rotateSpeed = 4.0/window.devicePixelRatio;
    this.perspectiveControls.autoRotate = false;
    this.perspectiveControls.staticMoving = true;
    this.perspectiveControls.length = 10;
    this.perspectiveControls.enabled = true; //turn off mouse moments by setting to false

    this.orthographicCameraX = new THREE.OrthographicCamera( -scale*aspect, scale*aspect, scale, -scale, 0.001, 20 );
    this.orthographicCameraX.position.x = 1.0;
    this.orthographicCameraX.up.x = 0.0;
    this.orthographicCameraX.up.y = 0.0;
    this.orthographicCameraX.up.z = 1.0;
    this.orthographicCameraX.lookAt( cellPos );
    this.orthoControlsX = new AICStrackballControls(this.orthographicCameraX, this.canvas);
    this.orthoControlsX.noRotate = true;
    this.orthoControlsX.scale = scale;
    this.orthoControlsX.scale0 = scale;
    this.orthoControlsX.aspect = aspect;
    this.orthoControlsX.staticMoving = true;
    this.orthoControlsX.enabled = false;

    this.orthographicCameraY = new THREE.OrthographicCamera( -scale*aspect, scale*aspect, scale, -scale, 0.001, 20 );
    this.orthographicCameraY.position.y = 1.0;
    this.orthographicCameraY.up.x = 0.0;
    this.orthographicCameraY.up.y = 0.0;
    this.orthographicCameraY.up.z = 1.0;
    this.orthographicCameraY.lookAt( cellPos );
    this.orthoControlsY = new AICStrackballControls(this.orthographicCameraY, this.canvas);
    this.orthoControlsY.noRotate = true;
    this.orthoControlsY.scale = scale;
    this.orthoControlsY.scale0 = scale;
    this.orthoControlsY.aspect = aspect;
    this.orthoControlsY.staticMoving = true;
    this.orthoControlsY.enabled = false;


    this.orthographicCameraZ = new THREE.OrthographicCamera( -scale*aspect, scale*aspect, scale, -scale, 0.001, 20 );
    this.orthographicCameraZ.position.z = 1.0;
    this.orthographicCameraZ.up.x = 0.0;
    this.orthographicCameraZ.up.y = 1.0;
    this.orthographicCameraZ.up.z = 0.0;
    this.orthographicCameraZ.lookAt( cellPos );
    this.orthoControlsZ = new AICStrackballControls(this.orthographicCameraZ, this.canvas);
    this.orthoControlsZ.noRotate = true;
    this.orthoControlsZ.scale = scale;
    this.orthoControlsZ.scale0 = scale;
    this.orthoControlsZ.aspect = aspect;
    this.orthoControlsZ.staticMoving = true;
    this.orthoControlsZ.enabled = false;


    this.camera = this.perspectiveCamera;
    this.controls = this.perspectiveControls;

    this.effect = this.renderer;
  }

  setAutoRotate(rotate) {
    this.controls.autoRotate = rotate;
  }

  getAutoRotate() {
    return this.controls.autoRotate;
  }

  replaceCamera(newCam) {
    this.camera = newCam;
  }

  replaceControls(newControls) {
    if (this.controls === newControls) {
      return;
    }
    // disable the old, install the new.
    this.controls.enabled = false;
    this.controls = newControls;
    this.controls.enabled = true;
    this.controls.update();
  }

  switchViewMode (mode) {
    mode = mode.toUpperCase();
    switch (mode) {
      case ('YZ'):
      case ('X'):
        this.replaceCamera(this.orthographicCameraX);
        this.replaceControls(this.orthoControlsX);
        break;
      case('XZ'):
      case('Y'):
        this.replaceCamera(this.orthographicCameraY);
        this.replaceControls(this.orthoControlsY);
        break;
      case('XY'):
      case('Z'):
        this.replaceCamera(this.orthographicCameraZ);
        this.replaceControls(this.orthoControlsZ);
        break;
      default:
        this.replaceCamera(this.perspectiveCamera);
        this.replaceControls(this.perspectiveControls);
        break;
    }
  }

  getCanvas() {
    return this.canvas;
  }

  resize(comp, w, h, ow, oh, eOpts) {
    var aspect = w / h;

    this.perspectiveControls.aspect = aspect;
    this.orthoControlsZ.aspect = aspect;
    this.orthoControlsY.aspect = aspect;
    this.orthoControlsX.aspect = aspect;
    if (this.camera.isOrthographicCamera) {
      this.camera.left = -this.orthoScale * aspect;
      this.camera.right = this.orthoScale * aspect;
    }
    else {
      this.camera.aspect = aspect;
    }

    this.camera.updateProjectionMatrix();

    this.effect.setSize( w,h );

    this.perspectiveControls.handleResize();
    this.orthoControlsZ.handleResize();
    this.orthoControlsY.handleResize();
    this.orthoControlsX.handleResize();

    this.mousedown = false;
  }

  setClearColor(color, alpha) {
    this.renderer.setClearColor(color, alpha);
  }

  getWidth() {
    return this.renderer.context.canvas.width;
  }

  getHeight() {
    return this.renderer.context.canvas.height;
  }

  render() {
    this.effect.render(this.scene, this.camera);
  }

  doAnimate() {
    var me = this;
    var delta = this.clock.getDelta();
    //console.log("DT="+delta);
    this.controls.update(delta);
    if(this.onAnimate) {
      this.onAnimate();
    }
    for(var i = 0; i < this.animate_funcs.length; i++) {
      if(this.animate_funcs[i]) {
        this.animate_funcs[i](this);
      }
    }
    this.render();
    //this.anaglyph.render(this.scene, this.camera);
    //this.controls.update();
    if (this.effect.requestAnimationFrame) {
      this.animationID = this.effect.requestAnimationFrame(function() {
        me.doAnimate();
      });
    }
    else {
      this.animationID = requestAnimationFrame(function() {
        me.doAnimate();
      });
    }
  }

  rerender() {
    this.needs_render = true;
    if(!this.animationID) {
      this.doAnimate();
    }
  }

  stoprender() {
    //this.needs_render = false;
  }
}

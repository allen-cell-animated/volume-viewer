import AICStrackballControls from './AICStrackballControls.js';

import "./vr/ViveController.js";
import WEBVR from "./vr/WebVR.js";
import vrObjectControls from './vr/vrObjectControls.js';
import "./threejsObjLoader.js";

export class AICSthreeJsPanel {
  constructor(parentElement) {
    this.containerdiv = document.createElement('div');
    this.containerdiv.setAttribute('id', 'cellViewContainerDiv');
    this.containerdiv.style.position = 'relative';

    this.canvas = document.createElement('canvas');
    this.canvas.setAttribute('id', 'cellViewCanvas');
    this.canvas.height=parentElement.offsetHeight;
    this.canvas.width=parentElement.offsetWidth;

    this.containerdiv.appendChild(this.canvas);
    parentElement.appendChild(this.containerdiv);

    this.scene = new THREE.Scene();

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

    // VR controllers
    // TODO FIXME This code is HTC Vive-specific.  Find a generic controller model to use instead!
    this.controller1 = new THREE.ViveController( 0 );
    this.controller1.standingMatrix = this.renderer.vr.getStandingMatrix();

    //this.scene.add( this.controller1 );
    this.controller2 = new THREE.ViveController( 1 );
    this.controller2.standingMatrix = this.renderer.vr.getStandingMatrix();

    this.vrRotateControls0 = new vrObjectControls(this.controller1, this.controller2, null);

    //this.scene.add( this.controller2 );
    // load the VR controller geometry
    var that = this;
    var loader = new THREE.OBJLoader();
    loader.setPath( 'assets/' );
    loader.load( 'vr_controller_vive_1_5.obj', function ( object ) {
      var loader = new THREE.TextureLoader();
      loader.setPath( 'assets/' );
      var controller = object.children[ 0 ];
      controller.material.map = loader.load( 'onepointfive_texture.png' );
      controller.material.specularMap = loader.load( 'onepointfive_spec.png' );
      that.controller1.add( object.clone() );
      that.controller2.add( object.clone() );
    } );

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

    //this.renderer.vr.enabled = true;
    window.addEventListener( 'vrdisplaypointerrestricted', ()=>{
      var pointerLockElement = that.renderer.domElement;
      if ( pointerLockElement && typeof(pointerLockElement.requestPointerLock) === 'function' ) {
        pointerLockElement.requestPointerLock();
      }
    }, false );
		window.addEventListener( 'vrdisplaypointerunrestricted', ()=>{
      var currentPointerLockElement = document.pointerLockElement;
      var expectedPointerLockElement = that.renderer.domElement;
      if ( currentPointerLockElement && currentPointerLockElement === expectedPointerLockElement && typeof(document.exitPointerLock) === 'function' ) {
        document.exitPointerLock();
      }
    }, false );
    this.vrButton = WEBVR.createButton( this.renderer );
    if (this.vrButton) {
      this.vrButton.style.left = 'auto';
      this.vrButton.style.right = '0px';
      this.containerdiv.appendChild(this.vrButton);
    }

    window.addEventListener( 'vrdisplaypresentchange', () =>  {
      if (that.isVR()) {
        console.log("ENTERED VR");
        that.scene.add(that.controller1);
        that.scene.add(that.controller2);
        that.renderer.vr.enabled = true;
        that.controls.enabled = false;
      }
      else {
        console.log("LEFT VR");
        that.vrRotateControls0.resetObject();
        that.scene.remove(that.controller1);
        that.scene.remove(that.controller2);
        that.renderer.vr.enabled = false;
        that.resetPerspectiveCamera();
      }    
    } );

    this.setupAxisHelper();
  }

  setVRObject(obj) {
    this.vrRotateControls0.object = obj;
  }

  isVR() {
    const vrdevice = this.renderer.vr.getDevice();
    return (vrdevice && vrdevice.isPresenting);
  }

  resetPerspectiveCamera() {
    var aspect = this.getWidth() / this.getHeight();

    this.perspectiveCamera = new THREE.PerspectiveCamera(this.fov, aspect, 0.001, 20);
    this.perspectiveCamera.position.x = 0.0;
    this.perspectiveCamera.position.y = 0.0;
    this.perspectiveCamera.position.z = 5.0;
    this.perspectiveCamera.up.x = 0.0;
    this.perspectiveCamera.up.y = 1.0;
    this.perspectiveCamera.up.z = 0.0;
    this.switchViewMode('3D');
    this.controls.object = this.perspectiveCamera;
    this.controls.enabled = true;
    this.controls.reset();
  }

  setupAxisHelper() {
    // set up axis widget.

    this.showAxis = false;

    // size of axes in px.
    this.axisScale = 50.0;
    // offset from bottom left corner in px.
    this.axisOffset = [66.0, 66.0];
    
    this.axisHelperScene = new THREE.Scene();

    this.axisHelperObject = new THREE.Object3D();
    this.axisHelperObject.name = 'axisHelperParentObject';

    var axisCubeMaterial = new THREE.MeshBasicMaterial({
      color : 0xAEACAD
    });

    var axisCube = new THREE.BoxGeometry(this.axisScale/5, this.axisScale/5, this.axisScale/5);
    var axisCubeMesh = new THREE.Mesh(axisCube, axisCubeMaterial);
    this.axisHelperObject.add(axisCubeMesh);

    var axisHelper = new THREE.AxesHelper( this.axisScale );
    this.axisHelperObject.add( axisHelper );

    this.axisHelperScene.add(this.axisHelperObject);

    this.axisCamera = new THREE.OrthographicCamera( 0, this.getWidth(), this.getHeight(), 0, 0.001, this.axisScale * 4.0 );
    this.axisCamera.position.z = 1.0;
    this.axisCamera.up.x = 0.0;
    this.axisCamera.up.y = 1.0;
    this.axisCamera.up.z = 0.0;
    this.axisCamera.lookAt( new THREE.Vector3(0,0,0) );
    this.axisCamera.position.set(-this.axisOffset[0], -this.axisOffset[1], this.axisScale*2.0);
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
        this.axisHelperObject.rotation.set(0, Math.PI*0.5, 0);
        break;
      case('XZ'):
      case('Y'):
        this.replaceCamera(this.orthographicCameraY);
        this.replaceControls(this.orthoControlsY);
        this.axisHelperObject.rotation.set(Math.PI*0.5, 0, 0);
        break;
      case('XY'):
      case('Z'):
        this.replaceCamera(this.orthographicCameraZ);
        this.replaceControls(this.orthoControlsZ);
        this.axisHelperObject.rotation.set(0, 0, 0);
        break;
      default:
        this.replaceCamera(this.perspectiveCamera);
        this.replaceControls(this.perspectiveControls);
        this.axisHelperObject.rotation.setFromRotationMatrix(this.camera.matrixWorldInverse);
        break;
    }
  }

  getCanvas() {
    return this.canvas;
  }

  resize(comp, w, h, ow, oh, eOpts) {
    this.containerdiv.style.width = '' + w + 'px';
    this.containerdiv.style.height = '' + h + 'px';

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

    this.axisCamera.left = 0;
    this.axisCamera.right = w;
    this.axisCamera.top = h;
    this.axisCamera.bottom = 0;
    this.axisCamera.updateProjectionMatrix();

    this.renderer.setSize( w,h );

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
    this.renderer.render(this.scene, this.camera);
    if (this.showAxis) {
      this.renderer.autoClear = false;
      this.renderer.render(this.axisHelperScene, this.axisCamera);
      this.renderer.autoClear = true;
    }
  }

  handleController(controller, index, delta) {
    controller.update();
    // check state and do the stuff.

    // controller 1 trigger drag to rotate
    if (index === 0) {
      this.vrRotateControls0.update();
    }
  }

  doAnimate() {
    //var me = this;
    var delta = this.clock.getDelta();
    //console.log("DT="+delta);

    if (this.isVR()) {
      this.handleController(this.controller1, 0, delta);
      this.handleController(this.controller2, 1, delta);
    }
    else {
      this.controls.update(delta);
    }

    if(this.onAnimate) {
      this.onAnimate();
    }
    for(var i = 0; i < this.animate_funcs.length; i++) {
      if(this.animate_funcs[i]) {
        this.animate_funcs[i](this);
      }
    }
    this.render();

    // update the axis helper in case the view was rotated
    if (!this.camera.isOrthographicCamera) {
      this.axisHelperObject.rotation.setFromRotationMatrix(this.camera.matrixWorldInverse);
    }
    else {
      this.orthoScale = this.controls.scale;
    }
  }

  rerender() {
    this.needs_render = true;
    this.renderer.setAnimationLoop(this.doAnimate.bind(this));
  }

  stoprender() {
    this.renderer.setAnimationLoop(null);
  }
}

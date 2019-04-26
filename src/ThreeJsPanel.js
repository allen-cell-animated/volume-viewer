import TrackballControls from './TrackballControls.js';
import Timing from './Timing.js';

import WEBVR from "./vr/WebVR.js";
import vrObjectControls from './vr/vrObjectControls.js';

const DEFAULT_PERSPECTIVE_CAMERA_DISTANCE = 5.0;
const DEFAULT_PERSPECTIVE_CAMERA_NEAR = 0.001;
const DEFAULT_PERSPECTIVE_CAMERA_FAR = 20.0;

export class ThreeJsPanel {
  constructor(parentElement, useWebGL2) {
    this.containerdiv = document.createElement('div');
    this.containerdiv.setAttribute('id', 'volumeViewerContainerDiv');
    this.containerdiv.style.position = 'relative';

    this.canvas = document.createElement('canvas');
    this.canvas.setAttribute('id', 'volumeViewerCanvas');
    this.canvas.height=parentElement.offsetHeight;
    this.canvas.width=parentElement.offsetWidth;
    
    this.canvas.style.backgroundColor = "black";

    this.containerdiv.appendChild(this.canvas);
    parentElement.appendChild(this.containerdiv);

    this.scene = new THREE.Scene();

    this.zooming = false;
    this.animate_funcs = [];
    this.onEnterVRCallback = null;
    this.onLeaveVRCallback = null;

    // are we in a constant render loop or not?
    this.inRenderLoop = false;
    // if we're not in a constant render loop, have we queued any single redraws?
    this.requestedRender = 0;

    this.hasWebGL2 = false;
    if (useWebGL2) {
      let context = this.canvas.getContext('webgl2');
      if (context) {
        this.hasWebGL2 = true;
        this.renderer = new THREE.WebGLRenderer({
          context: context,
          canvas: this.canvas,
          preserveDrawingBuffer: true,
          alpha: true,
          premultipliedAlpha: false,
          sortObjects: true
        });
        //this.renderer.autoClear = false;
        // set pixel ratio to 0.25 or 0.5 to render at lower res.
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.state.setBlending(THREE.NormalBlending);
        //required by WebGL 2.0 for rendering to FLOAT textures
        this.renderer.context.getExtension('EXT_color_buffer_float');  
      }
    }
    if (!this.hasWebGL2) {
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        preserveDrawingBuffer: true,
        alpha: true,
        premultipliedAlpha: false,
        sortObjects: true
      });
      this.renderer.setPixelRatio( window.devicePixelRatio );
      this.renderer.state.setBlending(THREE.NormalBlending);
    }

    this.timer = new Timing();

    var scale = 0.5;
    this.orthoScale = scale;
    var pos = new THREE.Vector3(0,0,0);
    var aspect = this.getWidth() / this.getHeight();

    this.fov = 20;

    this.perspectiveCamera = new THREE.PerspectiveCamera(this.fov, aspect, DEFAULT_PERSPECTIVE_CAMERA_NEAR, DEFAULT_PERSPECTIVE_CAMERA_FAR);
    this.perspectiveCamera.position.z = DEFAULT_PERSPECTIVE_CAMERA_DISTANCE;
    this.perspectiveCamera.up.x = 0.0;
    this.perspectiveCamera.up.y = 1.0;
    this.perspectiveCamera.up.z = 0.0;
    this.perspectiveControls = new TrackballControls(this.perspectiveCamera, this.canvas);
    this.perspectiveControls.rotateSpeed = 4.0/window.devicePixelRatio;
    this.perspectiveControls.autoRotate = false;
    this.perspectiveControls.staticMoving = true;
    this.perspectiveControls.length = 10;
    this.perspectiveControls.enabled = true; //turn off mouse moments by setting to false

    this.orthographicCameraX = new THREE.OrthographicCamera( -scale*aspect, scale*aspect, scale, -scale, 0.001, 20 );
    this.orthographicCameraX.position.x = 2.0;
    this.orthographicCameraX.up.x = 0.0;
    this.orthographicCameraX.up.y = 0.0;
    this.orthographicCameraX.up.z = 1.0;
    this.orthographicCameraX.lookAt( pos );
    this.orthoControlsX = new TrackballControls(this.orthographicCameraX, this.canvas);
    this.orthoControlsX.noRotate = true;
    this.orthoControlsX.scale = scale;
    this.orthoControlsX.scale0 = scale;
    this.orthoControlsX.aspect = aspect;
    this.orthoControlsX.staticMoving = true;
    this.orthoControlsX.enabled = false;

    this.orthographicCameraY = new THREE.OrthographicCamera( -scale*aspect, scale*aspect, scale, -scale, 0.001, 20 );
    this.orthographicCameraY.position.y = 2.0;
    this.orthographicCameraY.up.x = 0.0;
    this.orthographicCameraY.up.y = 0.0;
    this.orthographicCameraY.up.z = 1.0;
    this.orthographicCameraY.lookAt( pos );
    this.orthoControlsY = new TrackballControls(this.orthographicCameraY, this.canvas);
    this.orthoControlsY.noRotate = true;
    this.orthoControlsY.scale = scale;
    this.orthoControlsY.scale0 = scale;
    this.orthoControlsY.aspect = aspect;
    this.orthoControlsY.staticMoving = true;
    this.orthoControlsY.enabled = false;

    this.orthographicCameraZ = new THREE.OrthographicCamera( -scale*aspect, scale*aspect, scale, -scale, 0.001, 20 );
    this.orthographicCameraZ.position.z = 2.0;
    this.orthographicCameraZ.up.x = 0.0;
    this.orthographicCameraZ.up.y = 1.0;
    this.orthographicCameraZ.up.z = 0.0;
    this.orthographicCameraZ.lookAt( pos );
    this.orthoControlsZ = new TrackballControls(this.orthographicCameraZ, this.canvas);
    this.orthoControlsZ.noRotate = true;
    this.orthoControlsZ.scale = scale;
    this.orthoControlsZ.scale0 = scale;
    this.orthoControlsZ.aspect = aspect;
    this.orthoControlsZ.staticMoving = true;
    this.orthoControlsZ.enabled = false;

    this.camera = this.perspectiveCamera;
    this.controls = this.perspectiveControls;

    this.initVR();

    this.setupAxisHelper();
  }

  requestCapture(dataurlcallback) {
    this.dataurlcallback = dataurlcallback;
    this.redraw();
  }

  initVR() {

    this.vrButton = WEBVR.createButton(this.renderer);
    if (this.vrButton) {
      this.vrButton.style.left = 'auto';
      this.vrButton.style.right = '5px';
      this.vrButton.style.bottom = '5px';
      this.containerdiv.appendChild(this.vrButton);

      // VR controllers
      this.vrControls = new vrObjectControls(this.renderer, this.scene, null);

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

      var that = this;
      window.addEventListener( 'vrdisplaypresentchange', () =>  {
        if (that.isVR()) {
          that.startRenderLoop();
          that.onEnterVR();
        }
        else {
          that.onLeaveVR();
          that.resetPerspectiveCamera();
          // under what conditions:
          // stopRenderLoop() 
        }
      } );
  
    }

  }

  isVR() {
    const vrdevice = this.renderer.vr.getDevice();
    return (vrdevice && vrdevice.isPresenting);
  }

  onEnterVR() {
    console.log("ENTERED VR");
    this.renderer.vr.enabled = true;
    this.controls.enabled = false;
    if (this.onEnterVRCallback) {
      this.onEnterVRCallback();
    }
    if (this.vrControls) {
      this.vrControls.onEnterVR();
    }
  }

  onLeaveVR() {
    console.log("LEFT VR");
    if (this.vrControls) {
      this.vrControls.onLeaveVR();
      if (this.onLeaveVRCallback) {
        this.onLeaveVRCallback();
      }
    }
    this.renderer.vr.enabled = false;
  }

  resetPerspectiveCamera() {
    var aspect = this.getWidth() / this.getHeight();

    this.perspectiveCamera = new THREE.PerspectiveCamera(this.fov, aspect, DEFAULT_PERSPECTIVE_CAMERA_NEAR, DEFAULT_PERSPECTIVE_CAMERA_FAR);
    this.perspectiveCamera.position.x = 0.0;
    this.perspectiveCamera.position.y = 0.0;
    this.perspectiveCamera.position.z = DEFAULT_PERSPECTIVE_CAMERA_DISTANCE;
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

    // detach old control change handlers
    this.removeControlHandlers();

    this.controls = newControls;
    this.controls.enabled = true;

    // re-install existing control change handlers on new controls
    if (this.controlStartHandler) {
      this.controls.addEventListener('start', this.controlStartHandler);
    }
    if (this.controlChangeHandler) {
      this.controls.addEventListener('change', this.controlChangeHandler);
    }
    if (this.controlEndHandler) {
      this.controls.addEventListener('end', this.controlEndHandler);
    }

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

    this.w = w;
    this.h = h;
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
    // do whatever we have to do before the main render of this.scene
    for (var i = 0; i < this.animate_funcs.length; i++) {
      if (this.animate_funcs[i]) {
        this.animate_funcs[i](this);
      }
    }

    this.renderer.render(this.scene, this.camera);
    // overlay
    if (this.showAxis) {
      this.renderer.autoClear = false;
      this.renderer.render(this.axisHelperScene, this.axisCamera);
      this.renderer.autoClear = true;
    }

    if (this.dataurlcallback) {
      this.dataurlcallback(this.canvas.toDataURL());
      this.dataurlcallback = null;
    }
  }

  redraw() {
    // if we are not in a render loop already
    if (!this.inRenderLoop) {
      // if there is currently a queued redraw, cancel it and replace it with a new one.
      if (this.requestedRender) {
        cancelAnimationFrame(this.requestedRender);
      }
      this.requestedRender = requestAnimationFrame(this.render.bind(this));
    }
  }

  onAnimationLoop() {
    // delta is in seconds
    this.timer.update();
    const delta = this.timer.lastFrameMs / 1000.0;

    if (this.isVR() && this.vrControls) {
      this.vrControls.update(delta);
    } else {
      this.controls.update(delta);
    }

    this.render();

    // update the axis helper in case the view was rotated
    if (!this.camera.isOrthographicCamera) {
      this.axisHelperObject.rotation.setFromRotationMatrix(this.camera.matrixWorldInverse);
    } else {
      this.orthoScale = this.controls.scale;
    }
  }

  startRenderLoop() {
    this.inRenderLoop = true;
    // reset the timer so that the time delta won't go back to the last time we were animating.
    this.timer.begin();
    this.renderer.setAnimationLoop(this.onAnimationLoop.bind(this));
  }

  stopRenderLoop() {
    this.renderer.setAnimationLoop(null);
    this.inRenderLoop = false;

    if (this.requestedRender) {
      cancelAnimationFrame(this.requestedRender);
      this.requestedRender = 0;
    }
  }

  removeControlHandlers() {
    if (this.controlStartHandler) {
      this.controls.removeEventListener('start', this.controlStartHandler);
    }
    if (this.controlChangeHandler) {
      this.controls.removeEventListener('change', this.controlChangeHandler);
    }
    if (this.controlEndHandler) {
      this.controls.removeEventListener('end', this.controlEndHandler);
    }
  }

  setControlHandlers(onstart, onchange, onend) {
    this.removeControlHandlers();

    if (onstart) {
      this.controlStartHandler = onstart;
      this.controls.addEventListener('start', this.controlStartHandler);
    }
    if (onchange) {
      this.controlChangeHandler = onchange;
      this.controls.addEventListener('change', this.controlChangeHandler);
    }
    if (onend) {
      this.controlEndHandler = onend;
      this.controls.addEventListener('end', this.controlEndHandler);
    }
  }

}
import {
  AxesHelper,
  Camera,
  Color,
  Vector3,
  Object3D,
  Event,
  EventListener,
  Mesh,
  BoxGeometry,
  MeshBasicMaterial,
  OrthographicCamera,
  PerspectiveCamera,
  NormalBlending,
  WebGLRenderer,
  Scene,
} from "three";

import TrackballControls from "./TrackballControls.js";
import Timing from "./Timing";
import { isOrthographicCamera } from "./types";

const DEFAULT_PERSPECTIVE_CAMERA_DISTANCE = 5.0;
const DEFAULT_PERSPECTIVE_CAMERA_NEAR = 0.001;
const DEFAULT_PERSPECTIVE_CAMERA_FAR = 20.0;

export class ThreeJsPanel {
  private containerdiv: HTMLDivElement;
  private canvas: HTMLCanvasElement;
  public scene: Scene;
  private zooming: boolean;
  public animateFuncs: ((panel: ThreeJsPanel) => void)[];
  private inRenderLoop: boolean;
  private requestedRender: number;
  public hasWebGL2: boolean;
  public renderer: WebGLRenderer;
  private timer: Timing;
  public orthoScale: number;
  public orthoHorizontalAxis: number;
  private fov: number;
  private perspectiveCamera: PerspectiveCamera;
  private perspectiveControls: TrackballControls;
  private orthographicCameraX: OrthographicCamera;
  private orthoControlsX: TrackballControls;
  private orthographicCameraY: OrthographicCamera;
  private orthoControlsY: TrackballControls;
  private orthographicCameraZ: OrthographicCamera;
  private orthoControlsZ: TrackballControls;
  public camera: PerspectiveCamera | OrthographicCamera;
  public controls: TrackballControls;
  private controlEndHandler?: EventListener<Event, "end", TrackballControls>;
  private controlChangeHandler?: EventListener<Event, "change", TrackballControls>;
  private controlStartHandler?: EventListener<Event, "start", TrackballControls>;

  public showAxis: boolean;
  private axisScale: number;
  private axisOffset: [number, number];
  private axisHelperScene: Scene;
  private axisHelperObject: Object3D;
  private axisCamera: PerspectiveCamera | OrthographicCamera;

  private orthoScaleBarElement: HTMLDivElement;
  private scaleBarUnit?: string;

  private dataurlcallback?: (url: string) => void;

  constructor(parentElement: HTMLElement, _useWebGL2: boolean) {
    this.containerdiv = document.createElement("div");
    this.containerdiv.style.position = "relative";

    this.canvas = document.createElement("canvas");
    this.canvas.height = parentElement.offsetHeight;
    this.canvas.width = parentElement.offsetWidth;

    this.canvas.style.backgroundColor = "black";

    this.containerdiv.appendChild(this.canvas);
    parentElement.appendChild(this.containerdiv);

    this.scene = new Scene();
    this.axisHelperScene = new Scene();
    this.axisHelperObject = new Object3D();

    this.showAxis = false;
    this.axisScale = 50.0;
    this.axisOffset = [66, 66];

    this.zooming = false;
    this.animateFuncs = [];

    // are we in a constant render loop or not?
    this.inRenderLoop = false;
    // if we're not in a constant render loop, have we queued any single redraws?
    this.requestedRender = 0;

    // if webgl 2 is available, let's just use it anyway.
    // we are ignoring the useWebGL2 flag
    this.hasWebGL2 = false;
    const context = this.canvas.getContext("webgl2");
    if (context) {
      this.hasWebGL2 = true;
      this.renderer = new WebGLRenderer({
        context: context,
        canvas: this.canvas,
        preserveDrawingBuffer: true,
        alpha: true,
        premultipliedAlpha: false,
      });
      //this.renderer.autoClear = false;
      // set pixel ratio to 0.25 or 0.5 to render at lower res.
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.state.setBlending(NormalBlending);
      //required by WebGL 2.0 for rendering to FLOAT textures
      this.renderer.getContext().getExtension("EXT_color_buffer_float");
    } else {
      // TODO Deprecate this code path.
      console.warn(
        "WebGL 2.0 not available. Some functionality may be limited. Please use a browser that supports WebGL 2.0."
      );

      this.renderer = new WebGLRenderer({
        canvas: this.canvas,
        preserveDrawingBuffer: true,
        alpha: true,
        premultipliedAlpha: false,
      });
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.state.setBlending(NormalBlending);
    }
    this.renderer.localClippingEnabled = true;
    this.renderer.setSize(parentElement.offsetWidth, parentElement.offsetHeight);

    this.timer = new Timing();

    const scale = 0.5;
    this.orthoScale = scale;
    const aspect = this.getWidth() / this.getHeight();
    this.orthoHorizontalAxis = 0;

    this.fov = 20;

    this.perspectiveCamera = new PerspectiveCamera(
      this.fov,
      aspect,
      DEFAULT_PERSPECTIVE_CAMERA_NEAR,
      DEFAULT_PERSPECTIVE_CAMERA_FAR
    );
    this.resetPerspectiveCamera();
    this.perspectiveControls = new TrackballControls(this.perspectiveCamera, this.canvas);
    this.perspectiveControls.rotateSpeed = 4.0 / window.devicePixelRatio;
    this.perspectiveControls.autoRotate = false;
    this.perspectiveControls.staticMoving = true;
    this.perspectiveControls.length = 10;
    this.perspectiveControls.enabled = true; //turn off mouse moments by setting to false

    this.orthographicCameraX = new OrthographicCamera(-scale * aspect, scale * aspect, scale, -scale, 0.001, 20);
    this.resetOrthographicCameraX();
    this.orthoControlsX = new TrackballControls(this.orthographicCameraX, this.canvas);
    this.orthoControlsX.noRotate = true;
    this.orthoControlsX.scale = scale;
    this.orthoControlsX.scale0 = scale;
    this.orthoControlsX.aspect = aspect;
    this.orthoControlsX.staticMoving = true;
    this.orthoControlsX.enabled = false;
    this.orthoControlsX.panSpeed = this.canvas.clientWidth * 0.5;

    this.orthographicCameraY = new OrthographicCamera(-scale * aspect, scale * aspect, scale, -scale, 0.001, 20);
    this.resetOrthographicCameraY();
    this.orthoControlsY = new TrackballControls(this.orthographicCameraY, this.canvas);
    this.orthoControlsY.noRotate = true;
    this.orthoControlsY.scale = scale;
    this.orthoControlsY.scale0 = scale;
    this.orthoControlsY.aspect = aspect;
    this.orthoControlsY.staticMoving = true;
    this.orthoControlsY.enabled = false;
    this.orthoControlsY.panSpeed = this.canvas.clientWidth * 0.5;

    this.orthographicCameraZ = new OrthographicCamera(-scale * aspect, scale * aspect, scale, -scale, 0.001, 20);
    this.resetOrthographicCameraZ();
    this.orthoControlsZ = new TrackballControls(this.orthographicCameraZ, this.canvas);
    this.orthoControlsZ.noRotate = true;
    this.orthoControlsZ.scale = scale;
    this.orthoControlsZ.scale0 = scale;
    this.orthoControlsZ.aspect = aspect;
    this.orthoControlsZ.staticMoving = true;
    this.orthoControlsZ.enabled = false;
    this.orthoControlsZ.panSpeed = this.canvas.clientWidth * 0.5;

    this.camera = this.perspectiveCamera;
    this.axisCamera = new PerspectiveCamera();
    this.controls = this.perspectiveControls;

    this.setupAxisHelper();
    this.orthoScaleBarElement = document.createElement("div");
    this.setupOrthoScaleBar();
  }

  updateCameraFocus(fov: number, _focalDistance: number, _apertureSize: number): void {
    this.perspectiveCamera.fov = fov;
    this.fov = fov;
    this.perspectiveCamera.updateProjectionMatrix();
  }

  resetPerspectiveCamera(): void {
    this.perspectiveCamera.position.x = 0.0;
    this.perspectiveCamera.position.y = 0.0;
    this.perspectiveCamera.position.z = DEFAULT_PERSPECTIVE_CAMERA_DISTANCE;
    this.perspectiveCamera.up.x = 0.0;
    this.perspectiveCamera.up.y = 1.0;
    this.perspectiveCamera.up.z = 0.0;
  }

  resetOrthographicCameraX(): void {
    this.orthographicCameraX.position.x = 2.0;
    this.orthographicCameraX.position.y = 0.0;
    this.orthographicCameraX.position.z = 0.0;
    this.orthographicCameraX.up.x = 0.0;
    this.orthographicCameraX.up.y = 0.0;
    this.orthographicCameraX.up.z = 1.0;
    this.orthographicCameraX.lookAt(new Vector3(0, 0, 0));
  }

  resetOrthographicCameraY(): void {
    this.orthographicCameraY.position.x = 0.0;
    this.orthographicCameraY.position.y = 2.0;
    this.orthographicCameraY.position.z = 0.0;
    this.orthographicCameraY.up.x = 0.0;
    this.orthographicCameraY.up.y = 0.0;
    this.orthographicCameraY.up.z = 1.0;
    this.orthographicCameraY.lookAt(new Vector3(0, 0, 0));
  }

  resetOrthographicCameraZ(): void {
    this.orthographicCameraZ.position.x = 0.0;
    this.orthographicCameraZ.position.y = 0.0;
    this.orthographicCameraZ.position.z = 2.0;
    this.orthographicCameraZ.up.x = 0.0;
    this.orthographicCameraZ.up.y = 1.0;
    this.orthographicCameraZ.up.z = 0.0;
    this.orthographicCameraZ.lookAt(new Vector3(0, 0, 0));
  }

  requestCapture(dataurlcallback: (name: string) => void): void {
    this.dataurlcallback = dataurlcallback;
    this.redraw();
  }

  isVR(): boolean {
    return this.renderer.xr.enabled;
  }

  resetToPerspectiveCamera(): void {
    const aspect = this.getWidth() / this.getHeight();

    this.perspectiveCamera = new PerspectiveCamera(
      this.fov,
      aspect,
      DEFAULT_PERSPECTIVE_CAMERA_NEAR,
      DEFAULT_PERSPECTIVE_CAMERA_FAR
    );
    this.resetPerspectiveCamera();
    this.switchViewMode("3D");
    this.controls.object = this.perspectiveCamera;
    this.controls.enabled = true;
    this.controls.reset();
  }

  resetCamera(): void {
    if (this.camera === this.perspectiveCamera) {
      this.resetPerspectiveCamera();
    } else if (this.camera === this.orthographicCameraX) {
      this.resetOrthographicCameraX();
    } else if (this.camera === this.orthographicCameraY) {
      this.resetOrthographicCameraY();
    } else if (this.camera === this.orthographicCameraZ) {
      this.resetOrthographicCameraZ();
    }
    this.controls.reset();
  }

  setupAxisHelper(): void {
    // set up axis widget.

    this.showAxis = false;

    // size of axes in px.
    this.axisScale = 50.0;
    // offset from bottom left corner in px.
    this.axisOffset = [66.0, 66.0];

    this.axisHelperScene = new Scene();

    this.axisHelperObject = new Object3D();
    this.axisHelperObject.name = "axisHelperParentObject";

    const axisCubeMaterial = new MeshBasicMaterial({
      color: 0xaeacad,
    });

    const axisCube = new BoxGeometry(this.axisScale / 5, this.axisScale / 5, this.axisScale / 5);
    const axisCubeMesh = new Mesh(axisCube, axisCubeMaterial);
    this.axisHelperObject.add(axisCubeMesh);

    const axisHelper = new AxesHelper(this.axisScale);
    this.axisHelperObject.add(axisHelper);

    this.axisHelperScene.add(this.axisHelperObject);

    this.axisCamera = new OrthographicCamera(0, this.getWidth(), this.getHeight(), 0, 0.001, this.axisScale * 4.0);
    this.axisCamera.position.z = 1.0;
    this.axisCamera.up.x = 0.0;
    this.axisCamera.up.y = 1.0;
    this.axisCamera.up.z = 0.0;
    this.axisCamera.lookAt(new Vector3(0, 0, 0));
    this.axisCamera.position.set(-this.axisOffset[0], -this.axisOffset[1], this.axisScale * 2.0);
  }

  setupOrthoScaleBar(): void {
    const orthoScaleBarStyle: Partial<CSSStyleDeclaration> = {
      border: "1px solid white",
      borderTop: "none",
      height: "10px",
      display: "none",
      position: "absolute",
      right: "15px",
      bottom: "50px",
      color: "white",
      mixBlendMode: "difference",
      textAlign: "right",
      lineHeight: "0px",
      fontFamily: "-apple-system, 'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif",
      boxSizing: "border-box",
      paddingRight: "10px",
    };
    Object.assign(this.orthoScaleBarElement.style, orthoScaleBarStyle);
    this.containerdiv.appendChild(this.orthoScaleBarElement);
    this.updateOrthoScaleBar();
  }

  updateOrthoScaleBar(scale: number = 1): void {
    const SCALE_BAR_MAX_WIDTH = 150;
    const worldSpaceMaxWidth = this.orthoScale * SCALE_BAR_MAX_WIDTH * scale / window.devicePixelRatio;
    // Round off all but the most significant digit of worldSpaceMaxWidth
    const digits = Math.floor(Math.log10(worldSpaceMaxWidth));
    const div10 = 10 ** digits;
    const scaleValue = Math.floor(worldSpaceMaxWidth / div10) * div10;
    let scaleStr = scaleValue.toString();
    if (digits < 1) {
      // Handle irrational floating point values (e.g. 0.30000000000000004) 
      scaleStr = scaleStr.slice(0, Math.abs(digits) + 2);
    }
    this.orthoScaleBarElement.innerHTML = `${scaleStr}${this.scaleBarUnit || ""}`;
    this.orthoScaleBarElement.style.width = `${SCALE_BAR_MAX_WIDTH * (scaleValue / worldSpaceMaxWidth)}px`;
    // this.orthoScaleBarElement.innerHTML = `${worldSpaceMaxWidth}${this.scaleBarUnit || ""}`;
    // this.orthoScaleBarElement.style.width = `${SCALE_BAR_MAX_WIDTH}px`;
  }

  setOrthoScaleBarVisible(visible: boolean): void {
    this.orthoScaleBarElement.style.display = visible ? "" : "none";
  }

  setOrthoScaleBarUnit(unit: string): void {
    this.scaleBarUnit = unit;
  }

  setAutoRotate(rotate: boolean): void {
    this.controls.autoRotate = rotate;
  }

  getAutoRotate(): boolean {
    return this.controls.autoRotate;
  }

  replaceCamera(newCam: PerspectiveCamera | OrthographicCamera): void {
    this.camera = newCam;
  }

  replaceControls(newControls: TrackballControls): void {
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
      this.controls.addEventListener("start", this.controlStartHandler);
    }
    if (this.controlChangeHandler) {
      this.controls.addEventListener("change", this.controlChangeHandler);
    }
    if (this.controlEndHandler) {
      this.controls.addEventListener("end", this.controlEndHandler);
    }

    this.controls.update();
  }

  switchViewMode(mode: string): void {
    mode = mode.toUpperCase();
    switch (mode) {
      case "YZ":
      case "X":
        this.replaceCamera(this.orthographicCameraX);
        this.replaceControls(this.orthoControlsX);
        this.axisHelperObject.rotation.set(0, Math.PI * 0.5, 0);
        this.setOrthoScaleBarVisible(true);
        this.orthoHorizontalAxis = 1;
        break;
      case "XZ":
      case "Y":
        this.replaceCamera(this.orthographicCameraY);
        this.replaceControls(this.orthoControlsY);
        this.axisHelperObject.rotation.set(Math.PI * 0.5, 0, 0);
        this.setOrthoScaleBarVisible(true);
        this.orthoHorizontalAxis = 0;
        break;
      case "XY":
      case "Z":
        this.replaceCamera(this.orthographicCameraZ);
        this.replaceControls(this.orthoControlsZ);
        this.axisHelperObject.rotation.set(0, 0, 0);
        this.setOrthoScaleBarVisible(true);
        this.orthoHorizontalAxis = 0;
        break;
      default:
        this.replaceCamera(this.perspectiveCamera);
        this.replaceControls(this.perspectiveControls);
        this.axisHelperObject.rotation.setFromRotationMatrix(this.camera.matrixWorldInverse);
        this.setOrthoScaleBarVisible(false);
        break;
    }
  }

  getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  resize(comp: HTMLElement | null, w: number, h: number, _ow?: number, _oh?: number, _eOpts?: unknown): void {
    this.containerdiv.style.width = "" + w + "px";
    this.containerdiv.style.height = "" + h + "px";

    const aspect = w / h;

    this.perspectiveControls.aspect = aspect;
    this.orthoControlsZ.aspect = aspect;
    this.orthoControlsZ.panSpeed = w * 0.5;
    this.orthoControlsY.aspect = aspect;
    this.orthoControlsY.panSpeed = w * 0.5;
    this.orthoControlsX.aspect = aspect;
    this.orthoControlsX.panSpeed = w * 0.5;
    if (isOrthographicCamera(this.camera)) {
      this.camera.left = -this.orthoScale * aspect;
      this.camera.right = this.orthoScale * aspect;
      this.camera.updateProjectionMatrix();
    } else {
      this.camera.aspect = aspect;
      this.camera.updateProjectionMatrix();
    }

    if (isOrthographicCamera(this.axisCamera)) {
      this.axisCamera.left = 0;
      this.axisCamera.right = w;
      this.axisCamera.top = h;
      this.axisCamera.bottom = 0;
      this.axisCamera.updateProjectionMatrix();
    } else {
      this.axisCamera.updateProjectionMatrix();
    }

    this.renderer.setSize(w, h);

    this.perspectiveControls.handleResize();
    this.orthoControlsZ.handleResize();
    this.orthoControlsY.handleResize();
    this.orthoControlsX.handleResize();
  }

  setClearColor(color: Color, alpha: number): void {
    this.renderer.setClearColor(color, alpha);
  }

  getWidth(): number {
    return this.renderer.getContext().canvas.width;
  }

  getHeight(): number {
    return this.renderer.getContext().canvas.height;
  }

  render(): void {
    // update the axis helper in case the view was rotated
    if (!isOrthographicCamera(this.camera)) {
      this.axisHelperObject.rotation.setFromRotationMatrix(this.camera.matrixWorldInverse);
    } else {
      this.orthoScale = this.controls.scale;
    }

    // do whatever we have to do before the main render of this.scene
    for (let i = 0; i < this.animateFuncs.length; i++) {
      if (this.animateFuncs[i]) {
        this.animateFuncs[i](this);
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
      this.dataurlcallback = undefined;
    }
  }

  redraw(): void {
    // if we are not in a render loop already
    if (!this.inRenderLoop) {
      // if there is currently a queued redraw, cancel it and replace it with a new one.
      if (this.requestedRender) {
        cancelAnimationFrame(this.requestedRender);
      }
      this.timer.begin();
      this.requestedRender = requestAnimationFrame(this.onAnimationLoop.bind(this));
    }
  }

  onAnimationLoop(): void {
    // delta is in seconds
    this.timer.update();
    const delta = this.timer.lastFrameMs / 1000.0;

    this.controls.update(delta);

    this.render();
  }

  startRenderLoop(): void {
    this.inRenderLoop = true;
    // reset the timer so that the time delta won't go back to the last time we were animating.
    this.timer.begin();
    this.renderer.setAnimationLoop(this.onAnimationLoop.bind(this));
  }

  stopRenderLoop(): void {
    this.renderer.setAnimationLoop(null);
    this.inRenderLoop = false;

    if (this.requestedRender) {
      cancelAnimationFrame(this.requestedRender);
      this.requestedRender = 0;
    }

    this.timer.end();
  }

  removeControlHandlers(): void {
    if (this.controlStartHandler) {
      this.controls.removeEventListener("start", this.controlStartHandler);
    }
    if (this.controlChangeHandler) {
      this.controls.removeEventListener("change", this.controlChangeHandler);
    }
    if (this.controlEndHandler) {
      this.controls.removeEventListener("end", this.controlEndHandler);
    }
  }

  setControlHandlers(
    onstart: EventListener<Event, "start", TrackballControls>,
    onchange: EventListener<Event, "change", TrackballControls>,
    onend: EventListener<Event, "end", TrackballControls>
  ): void {
    this.removeControlHandlers();

    if (onstart) {
      this.controlStartHandler = onstart;
      this.controls.addEventListener("start", this.controlStartHandler);
    }
    if (onchange) {
      this.controlChangeHandler = onchange;
      this.controls.addEventListener("change", this.controlChangeHandler);
    }
    if (onend) {
      this.controlEndHandler = onend;
      this.controls.addEventListener("end", this.controlEndHandler);
    }
  }
}

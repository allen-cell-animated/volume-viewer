import {
  AxesHelper,
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
import Timing from "./Timing.js";
import scaleBarSVG from "./constants/scaleBarSVG.js";
import { isOrthographicCamera, ViewportCorner, isTop, isRight } from "./types.js";
import { constrainToAxis, formatNumber, getTimestamp } from "./utils/num_utils.js";
import { Axis } from "./VolumeRenderSettings.js";

const DEFAULT_PERSPECTIVE_CAMERA_DISTANCE = 5.0;
const DEFAULT_PERSPECTIVE_CAMERA_NEAR = 0.001;
const DEFAULT_PERSPECTIVE_CAMERA_FAR = 20.0;

const DEFAULT_ORTHO_SCALE = 0.5;

export type CameraState = {
  position: [number, number, number];
  up: [number, number, number];
  target: [number, number, number];
  /** Full vertical FOV in degrees, from bottom to top of the view frustum. Defined only for perspective cameras. */
  fov?: number;
  /** The scale value for the orthographic camera controls; undefined for perspective cameras. */
  orthoScale?: number;
};

export class ThreeJsPanel {
  public containerdiv: HTMLDivElement;
  private canvas: HTMLCanvasElement;
  public scene: Scene;
  private zooming: boolean;
  public animateFuncs: ((panel: ThreeJsPanel) => void)[];
  private inRenderLoop: boolean;
  private requestedRender: number;
  public hasWebGL2: boolean;
  public renderer: WebGLRenderer;
  private timer: Timing;
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
  private viewMode: Axis;
  public controls: TrackballControls;
  private controlEndHandler?: EventListener<Event, "end", TrackballControls>;
  private controlChangeHandler?: EventListener<Event, "change", TrackballControls>;
  private controlStartHandler?: EventListener<Event, "start", TrackballControls>;

  public showAxis: boolean;
  private axisScale: number;
  private axisOffset: [number, number];
  private axisHelperScene: Scene;
  private axisHelperObject: Object3D;
  private axisCamera: OrthographicCamera;

  private scaleBarContainerElement: HTMLDivElement;
  private orthoScaleBarElement: HTMLDivElement;
  public showOrthoScaleBar: boolean;
  private perspectiveScaleBarElement: HTMLDivElement;
  public showPerspectiveScaleBar: boolean;
  private timestepIndicatorElement: HTMLDivElement;
  public showTimestepIndicator: boolean;

  private dataurlcallback?: (url: string) => void;

  constructor(parentElement: HTMLElement | undefined, _useWebGL2: boolean) {
    this.containerdiv = document.createElement("div");
    this.containerdiv.style.position = "relative";

    this.canvas = document.createElement("canvas");
    this.containerdiv.appendChild(this.canvas);
    this.canvas.style.backgroundColor = "black";

    if (parentElement) {
      this.canvas.height = parentElement.offsetHeight;
      this.canvas.width = parentElement.offsetWidth;
      parentElement.appendChild(this.containerdiv);
    }

    this.scene = new Scene();

    this.scaleBarContainerElement = document.createElement("div");
    this.orthoScaleBarElement = document.createElement("div");
    this.showOrthoScaleBar = true;
    this.perspectiveScaleBarElement = document.createElement("div");
    this.showPerspectiveScaleBar = false;
    this.timestepIndicatorElement = document.createElement("div");
    this.showTimestepIndicator = false;

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

    if (parentElement) {
      this.renderer.setSize(parentElement.offsetWidth, parentElement.offsetHeight);
    }

    this.timer = new Timing();

    const scale = DEFAULT_ORTHO_SCALE;
    const aspect = this.getWidth() / this.getHeight();

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
    this.controls = this.perspectiveControls;
    this.viewMode = Axis.NONE;

    this.axisCamera = new OrthographicCamera();
    this.axisHelperScene = new Scene();
    this.axisHelperObject = new Object3D();
    this.axisHelperObject.name = "axisHelperParentObject";

    this.showAxis = false;
    // size of axes in px.
    this.axisScale = 50.0;
    // offset from bottom left corner in px.
    this.axisOffset = [66.0, 66.0];

    this.setupAxisHelper();
    this.setupIndicatorElements();
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

  setAxisPosition(marginX: number, marginY: number, corner: ViewportCorner) {
    // Offset is relative to center of object, not corner of possible extent
    // at offsets lower than BASE_MARGIN, axes may extend off screen
    const BASE_MARGIN = 50;
    this.axisOffset = [marginX + BASE_MARGIN, marginY + BASE_MARGIN];
    if (isTop(corner)) {
      this.axisOffset[1] = this.getHeight() - this.axisOffset[1];
    }
    if (isRight(corner)) {
      this.axisOffset[0] = this.getWidth() - this.axisOffset[0];
    }
    this.axisCamera.position.set(-this.axisOffset[0], -this.axisOffset[1], this.axisScale * 2.0);
  }

  getOrthoScale(): number {
    return this.controls.scale;
  }

  orthoScreenPixelsToPhysicalUnits(pixels: number, physicalUnitsPerWorldUnit: number): number {
    // At orthoScale = 0.5, the viewport is 1 world unit tall
    const worldUnitsPerPixel = (this.getOrthoScale() * 2) / this.getHeight();
    // Multiply by devicePixelRatio to convert from scaled CSS pixels to physical pixels
    // (to account for high dpi monitors, e.g.). We didn't do this to height above because
    // that value comes from three, which works in physical pixels.
    return pixels * window.devicePixelRatio * worldUnitsPerPixel * physicalUnitsPerWorldUnit;
  }

  setupIndicatorElements(): void {
    const scaleBarContainerStyle: Partial<CSSStyleDeclaration> = {
      fontFamily: "-apple-system, 'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif",
      position: "absolute",
      right: "169px",
      bottom: "20px",
    };
    Object.assign(this.scaleBarContainerElement.style, scaleBarContainerStyle);
    this.containerdiv.appendChild(this.scaleBarContainerElement);

    // Orthographic scale bar
    const orthoScaleBarStyle: Partial<CSSStyleDeclaration> = {
      border: "1px solid white",
      borderTop: "none",
      height: "10px",
      display: "none",
      color: "white",
      mixBlendMode: "difference",
      fontSize: "14px",
      textAlign: "right",
      lineHeight: "0",
      boxSizing: "border-box",
      paddingRight: "10px",
      // TODO: Adjust based on width of timestamp
      marginRight: "40px",
    };
    Object.assign(this.orthoScaleBarElement.style, orthoScaleBarStyle);
    this.scaleBarContainerElement.appendChild(this.orthoScaleBarElement);

    // Perspective scale bar
    const perspectiveScaleBarStyle: Partial<CSSStyleDeclaration> = {
      width: "75px",
      textAlign: "center",
      display: "none",
      color: "white",
    };
    Object.assign(this.perspectiveScaleBarElement.style, perspectiveScaleBarStyle);
    this.scaleBarContainerElement.appendChild(this.perspectiveScaleBarElement);

    const labeldiv = document.createElement("div");
    const svgdiv = document.createElement("div");
    svgdiv.style.color = "rgb(255, 255, 0)";
    svgdiv.innerHTML = scaleBarSVG;
    this.perspectiveScaleBarElement.appendChild(labeldiv);
    this.perspectiveScaleBarElement.appendChild(svgdiv);

    // Time step indicator
    const timestepIndicatorStyle: Partial<CSSStyleDeclaration> = {
      fontFamily: "-apple-system, 'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif",
      position: "absolute",
      right: "20px",
      bottom: "20px",
      color: "white",
      mixBlendMode: "difference",
      display: "none",
      lineHeight: "0.75",
    };
    Object.assign(this.timestepIndicatorElement.style, timestepIndicatorStyle);
    this.containerdiv.appendChild(this.timestepIndicatorElement);
  }

  updateOrthoScaleBar(scale: number, unit?: string): void {
    // We want to find the largest round number of physical units that keeps the scale bar within this width on screen
    const SCALE_BAR_MAX_WIDTH = 150;
    // Convert max width to volume physical units
    const physicalMaxWidth = this.orthoScreenPixelsToPhysicalUnits(SCALE_BAR_MAX_WIDTH, scale);
    // Round off all but the most significant digit of physicalMaxWidth
    const digits = Math.floor(Math.log10(physicalMaxWidth));
    const div10 = 10 ** digits;
    const scaleValue = Math.floor(physicalMaxWidth / div10) * div10;
    const scaleStr = formatNumber(scaleValue);
    this.orthoScaleBarElement.innerHTML = `${scaleStr}${unit || ""}`;
    this.orthoScaleBarElement.style.width = `${SCALE_BAR_MAX_WIDTH * (scaleValue / physicalMaxWidth)}px`;
  }

  updatePerspectiveScaleBar(length: number, unit?: string): void {
    const labeldiv = this.perspectiveScaleBarElement.firstChild as HTMLDivElement;
    labeldiv.innerHTML = `${formatNumber(length)}${unit || ""}`;
  }

  updateTimestepIndicator(progress: number, total: number, unit: string): void {
    this.timestepIndicatorElement.innerHTML = getTimestamp(progress, total, unit);
  }

  setPerspectiveScaleBarColor(color: [number, number, number]): void {
    // set the font color of the SVG container. only paths with `stroke="currentColor"` will react to this.
    const svgdiv = this.perspectiveScaleBarElement.lastChild as HTMLDivElement;
    svgdiv.style.color = `rgb(${color[0] * 255}, ${color[1] * 255}, ${color[2] * 255})`;
  }

  updateScaleBarVisibility(): void {
    const isOrtho = isOrthographicCamera(this.camera);
    const orthoVisible = isOrtho && this.showOrthoScaleBar;
    const perspectiveVisible = !isOrtho && this.showPerspectiveScaleBar;
    this.orthoScaleBarElement.style.display = orthoVisible ? "" : "none";
    this.perspectiveScaleBarElement.style.display = perspectiveVisible ? "" : "none";
  }

  setShowOrthoScaleBar(visible: boolean): void {
    this.showOrthoScaleBar = visible;
    this.updateScaleBarVisibility();
  }

  setShowPerspectiveScaleBar(visible: boolean): void {
    this.showPerspectiveScaleBar = visible;
    this.updateScaleBarVisibility();
  }

  setShowTimestepIndicator(visible: boolean): void {
    this.showTimestepIndicator = visible;
    this.timestepIndicatorElement.style.display = visible ? "" : "none";
  }

  setIndicatorPosition(timestep: boolean, marginX: number, marginY: number, corner: ViewportCorner) {
    const { style } = timestep ? this.timestepIndicatorElement : this.scaleBarContainerElement;

    style.removeProperty("top");
    style.removeProperty("bottom");
    style.removeProperty("left");
    style.removeProperty("right");

    const xProp = isRight(corner) ? "right" : "left";
    const yProp = isTop(corner) ? "top" : "bottom";

    Object.assign(style, {
      [xProp]: marginX + "px",
      [yProp]: marginY + "px",
    });
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
        this.viewMode = Axis.X;
        break;
      case "XZ":
      case "Y":
        this.replaceCamera(this.orthographicCameraY);
        this.replaceControls(this.orthoControlsY);
        this.axisHelperObject.rotation.set(Math.PI * 0.5, 0, 0);
        this.viewMode = Axis.Y;
        break;
      case "XY":
      case "Z":
        this.replaceCamera(this.orthographicCameraZ);
        this.replaceControls(this.orthoControlsZ);
        this.axisHelperObject.rotation.set(0, 0, 0);
        this.viewMode = Axis.Z;
        break;
      default:
        this.replaceCamera(this.perspectiveCamera);
        this.replaceControls(this.perspectiveControls);
        this.axisHelperObject.rotation.setFromRotationMatrix(this.camera.matrixWorldInverse);
        this.viewMode = Axis.NONE;
        break;
    }
    this.updateScaleBarVisibility();
  }

  getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  resize(comp: HTMLElement | null, w?: number, h?: number, _ow?: number, _oh?: number, _eOpts?: unknown): void {
    w = w || this.containerdiv.parentElement?.offsetWidth || this.containerdiv.offsetWidth;
    h = h || this.containerdiv.parentElement?.offsetHeight || this.containerdiv.offsetHeight;

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
      this.camera.left = -DEFAULT_ORTHO_SCALE * aspect;
      this.camera.right = DEFAULT_ORTHO_SCALE * aspect;
      this.camera.updateProjectionMatrix();
    } else {
      this.camera.aspect = aspect;
      this.camera.updateProjectionMatrix();
    }

    this.axisCamera.left = 0;
    this.axisCamera.right = w;
    this.axisCamera.top = h;
    this.axisCamera.bottom = 0;
    this.axisCamera.updateProjectionMatrix();

    if (this.renderer.getPixelRatio() !== window.devicePixelRatio) {
      this.renderer.setPixelRatio(window.devicePixelRatio);
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

  getCameraState(): CameraState {
    return {
      position: this.camera.position.toArray(),
      up: this.camera.up.toArray(),
      target: this.controls.target.toArray(),
      orthoScale: isOrthographicCamera(this.camera) ? this.controls.scale : undefined,
      fov: this.camera.type === "PerspectiveCamera" ? this.camera.fov : undefined,
    };
  }

  /**
   * Updates the camera's state, including the position, up vector, target position,
   * scaling, and FOV. If values are missing from `state`, they will be left unchanged.
   *
   * @param state Partial `CameraState` object.
   *
   * If an OrthographicCamera is used, the camera's position will be constrained to match
   * the `target` position along the current view mode.
   */
  setCameraState(state: Partial<CameraState>) {
    const currentState = this.getCameraState();
    // Fill in any missing properties with current state
    const newState = { ...currentState, ...state };

    this.camera.up.fromArray(newState.up).normalize();
    this.controls.target.fromArray(newState.target);
    const constrainedPosition = constrainToAxis(newState.position, newState.target, this.viewMode);
    this.camera.position.fromArray(constrainedPosition);

    // Update fields by camera type
    if (isOrthographicCamera(this.camera)) {
      const scale = newState.orthoScale || DEFAULT_ORTHO_SCALE;
      this.controls.scale = scale;
      this.camera.zoom = 0.5 / scale;
    } else {
      this.camera.fov = newState.fov || this.fov;
    }

    this.controls.update();
    this.camera.updateProjectionMatrix();
  }

  render(): void {
    // update the axis helper in case the view was rotated
    if (!isOrthographicCamera(this.camera)) {
      this.axisHelperObject.rotation.setFromRotationMatrix(this.camera.matrixWorldInverse);
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

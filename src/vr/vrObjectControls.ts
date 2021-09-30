import { Event, TextureLoader, Vector3, Matrix4, Quaternion, WebGLRenderer, Scene, Mesh } from "three";
import ViveController from "./ViveController.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

import VRControllerObj from "../../assets/vr_controller_vive_1_5.obj";
import VRControllerTexture from "../../assets/onepointfive_texture.png";
import VRControllerSpecularTexture from "../../assets/onepointfive_spec.png";

import VolumeDrawable from "../VolumeDrawable";

export class VrObjectControls {
  private controller1: ViveController;
  private controller2: ViveController;
  private object: VolumeDrawable | null;
  private trigger1Down?: boolean;
  private trigger2Down?: boolean;
  private scale: Vector3;
  private previousDist: number | null;
  private currentChannel: [number, number];
  private scene: Scene;
  private vrRestoreState: {
    brightness: number;
    density: number;
    isPathTrace: boolean;
    enabled: boolean[];
  } | null;
  private vrRotate: boolean;
  private vrZoom: boolean;
  private vrRotateStartPos: Vector3;
  private wasZooming: boolean;
  private vrZoomStart: number;
  private vrZoomdist: number;

  constructor(renderer: WebGLRenderer, scene: Scene, object: null) {
    // TODO This code is HTC Vive-specific.  Find a generic controller model to use instead!
    // (...when WebVR has proliferated further and more hand controllers are in play...)
    this.controller1 = new ViveController(0);

    this.controller2 = new ViveController(1);

    this.object = object;

    this.trigger1Down = this.controller1.getButtonState("trigger");
    this.trigger2Down = this.controller2.getButtonState("trigger");

    // really only used once per update() call.
    this.scale = new Vector3();
    this.previousDist = null;

    // one channel index per hand
    this.currentChannel = [0, -1];

    // load the VR controller geometry
    const loader = new OBJLoader();
    const object3d = loader.parse(VRControllerObj);
    const txloader = new TextureLoader();
    const controller = object3d.children[0];
    if (controller instanceof Mesh) {
      controller.material.map = txloader.load(VRControllerTexture);
      controller.material.specularMap = txloader.load(VRControllerSpecularTexture);
    }
    this.controller1.add(object3d.clone());
    this.controller2.add(object3d.clone());

    this.scene = scene;

    this.vrRestoreState = null;
    this.vrRotate = false;
    this.vrZoom = false;
    this.vrRotateStartPos = new Vector3(0, 0, 0);
    this.wasZooming = false;
    this.vrZoomStart = 0;
    this.vrZoomdist = 0;
  }

  pushObjectState(obj: VolumeDrawable): void {
    this.object = obj;

    // push the density, brightness, and enabled state of channels.
    this.vrRestoreState = {
      brightness: this.object.getBrightness(),
      density: this.object.getDensity(),
      isPathTrace: this.object.PT,
      enabled: [],
    };
    for (let i = 0; i < this.object.volume.num_channels; ++i) {
      this.vrRestoreState.enabled.push(this.object.isVolumeChannelEnabled(i));
    }
    // NO PATHTRACING IN VR MODE!
    this.object.setVolumeRendering(false);
  }

  popObjectState(_obj: VolumeDrawable): void {
    // obj is currently expected to be the same as this.object, the obj that was passed in to pushObjectState

    // reset our volume object
    if (this.object) {
      this.object.sceneRoot.quaternion.setFromAxisAngle(new Vector3(0, 0, 1), 0.0);
    }
    // pop density, brightness, and enabled state of channels.
    if (this.vrRestoreState) {
      if (this.object) {
        this.object.setBrightness(this.vrRestoreState.brightness);
        this.object.setDensity(this.vrRestoreState.density);
        for (let i = 0; i < this.object.volume.num_channels; ++i) {
          this.object.setVolumeChannelEnabled(i, this.vrRestoreState.enabled[i]);
        }
        this.object.setVolumeRendering(this.vrRestoreState.isPathTrace);
      }

      this.vrRestoreState = null;
    }

    // tell the VR controls to forget about this object
    this.object = null;
  }

  onMenu1(): void {
    this.cycleChannels(0);
  }
  onMenu2(): void {
    this.cycleChannels(1);
  }

  onEnterVR(): void {
    // add controllers to 3d scene
    this.scene.add(this.controller1);
    this.scene.add(this.controller2);

    this.onAxisChange = this.onAxisChange.bind(this);
    this.controller1.addEventListener("menuup", this.onMenu1);
    this.controller2.addEventListener("menuup", this.onMenu2);
    this.controller1.addEventListener("axischanged", this.onAxisChange);
    this.controller2.addEventListener("axischanged", this.onAxisChange);
  }

  onLeaveVR(): void {
    this.controller1.removeEventListener("menuup", this.onMenu1);
    this.controller2.removeEventListener("menuup", this.onMenu2);
    // remove controllers from 3d scene
    this.scene.remove(this.controller1);
    this.scene.remove(this.controller2);
  }

  onAxisChange(obj: Event): void {
    if (!this.object) {
      return;
    }
    //console.log(obj.axes);
    // ignore events precisely at 0,0?
    if (obj.axes[0] === 0 && obj.axes[1] === 0) {
      return;
    }
    // 0..1
    const x = 0.5 * (obj.axes[0] + 1.0);
    const y = 0.5 * (obj.axes[1] + 1.0);
    this.object.setBrightness(x);
    this.object.setDensity(y);
  }

  cycleChannels(i: number): void {
    if (!this.object) {
      return;
    }

    this.currentChannel[i]++;
    if (this.currentChannel[i] >= this.object.volume.num_channels) {
      this.currentChannel[i] = 0;
    }
    // this will switch off all channels except this.currentChannels
    for (let i = 0; i < this.object.volume.num_channels; ++i) {
      this.object.setVolumeChannelEnabled(i, i === this.currentChannel[0] || i === this.currentChannel[1]);
    }
    this.object.fuse();
  }

  update(_deltaT: number): void {
    // must call update on the controllers, first!
    this.controller1.update();
    this.controller2.update();

    const isTrigger1Down = this.controller1.getButtonState("trigger");
    const isTrigger2Down = this.controller2.getButtonState("trigger");
    const rotating = (isTrigger1Down && !isTrigger2Down) || (isTrigger2Down && !isTrigger1Down);
    const theController = isTrigger1Down ? this.controller1 : this.controller2;
    const zooming = !!isTrigger1Down && !!isTrigger2Down;

    if (rotating) {
      if ((!this.trigger1Down && isTrigger1Down) || (!this.trigger2Down && isTrigger2Down)) {
        this.vrRotate = true;
        this.vrRotateStartPos = new Vector3().setFromMatrixPosition(theController.matrix);
      }
    }
    if ((this.trigger1Down && !isTrigger1Down) || (this.trigger2Down && !isTrigger2Down)) {
      this.vrRotate = false;
    }
    if (this.object && zooming) {
      const obj3d = this.object.sceneRoot;
      this.vrZoom = true;

      this.scale.copy(obj3d.scale);

      const p1 = new Vector3().setFromMatrixPosition(this.controller1.matrix);
      const p2 = new Vector3().setFromMatrixPosition(this.controller2.matrix);
      const dist = p1.distanceTo(p2);
      if (!this.wasZooming) {
        this.vrZoomStart = 0;
        this.vrZoomdist = dist;
      }

      let deltaStretch = 1.0;
      if (this.previousDist !== null && dist !== 0) {
        deltaStretch = dist / this.previousDist;
      }
      this.previousDist = dist;
      this.scale.multiplyScalar(deltaStretch);

      const ZOOM_MAX = 2.0;
      const ZOOM_MIN = 0.25;
      obj3d.scale.x = Math.min(ZOOM_MAX, Math.max(this.scale.x, ZOOM_MIN));
      obj3d.scale.y = Math.min(ZOOM_MAX, Math.max(this.scale.y, ZOOM_MIN));
      obj3d.scale.z = Math.min(ZOOM_MAX, Math.max(this.scale.z, ZOOM_MIN));
    } else {
      this.vrZoom = false;
      this.previousDist = null;
    }

    if (this.object && this.vrRotate) {
      const obj3d = this.object.sceneRoot;

      // dist from last pose position in x and z.
      const pos = new Vector3().setFromMatrixPosition(theController.matrix);

      const origin = obj3d.position;

      let v0 = new Vector3().subVectors(this.vrRotateStartPos, origin);
      v0 = v0.normalize();
      let v1 = new Vector3().subVectors(pos, origin);
      v1 = v1.normalize();

      const mio = new Matrix4();
      mio.copy(obj3d.matrixWorld).invert();

      v0 = v0.transformDirection(mio);
      v0 = v0.normalize();
      v1 = v1.transformDirection(mio);
      v1 = v1.normalize();

      const q = new Quaternion();
      q.setFromUnitVectors(v0, v1);

      obj3d.quaternion.multiply(q);

      this.vrRotateStartPos.set(pos.x, pos.y, pos.z);
    }
    this.trigger1Down = isTrigger1Down;
    this.trigger2Down = isTrigger2Down;
    this.wasZooming = zooming;
  }
}

export default VrObjectControls;

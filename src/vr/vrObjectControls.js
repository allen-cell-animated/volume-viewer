import { TextureLoader, Vector3, Matrix4, Quaternion } from "three";
import ViveController from "./ViveController.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

import VRControllerObj from "../../assets/vr_controller_vive_1_5.obj";
import VRControllerTexture from "../../assets/onepointfive_texture.png";
import VRControllerSpecularTexture from "../../assets/onepointfive_spec.png";

export class vrObjectControls {
  constructor(renderer, scene, object) {
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
    var loader = new OBJLoader();
    var object3d = loader.parse(VRControllerObj);
    var txloader = new TextureLoader();
    var controller = object3d.children[0];
    controller.material.map = txloader.load(VRControllerTexture);
    controller.material.specularMap = txloader.load(VRControllerSpecularTexture);
    this.controller1.add(object3d.clone());
    this.controller2.add(object3d.clone());

    this.scene = scene;
  }

  pushObjectState(obj) {
    this.object = obj;

    // push the density, brightness, and enabled state of channels.
    this.vrRestoreState = {
      brightness: this.object.getBrightness(),
      density: this.object.getDensity(),
      isPathTrace: this.object.PT,
      enabled: [],
    };
    for (let i = 0; i < this.object.num_channels; ++i) {
      this.vrRestoreState.enabled.push(this.object.isVolumeChannelEnabled(i));
    }
    // NO PATHTRACING IN VR MODE!
    this.object.setVolumeRendering(false);
  }

  popObjectState(obj) {
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
        for (let i = 0; i < this.object.num_channels; ++i) {
          this.object.setVolumeChannelEnabled(i, this.vrRestoreState.enabled[i]);
        }
        this.object.setVolumeRendering(this.vrRestoreState.isPathTrace);
      }

      this.vrRestoreState = null;
    }

    // tell the VR controls to forget about this object
    this.object = null;
  }

  onEnterVR() {
    // add controllers to 3d scene
    this.scene.add(this.controller1);
    this.scene.add(this.controller2);

    this.onMenu1 = function() {
      this.cycleChannels(0);
    }.bind(this);
    this.onMenu2 = function() {
      this.cycleChannels(1);
    }.bind(this);
    this.onAxisChange = this.onAxisChange.bind(this);
    this.controller1.addEventListener("menuup", this.onMenu1);
    this.controller2.addEventListener("menuup", this.onMenu2);
    this.controller1.addEventListener("axischanged", this.onAxisChange);
    this.controller2.addEventListener("axischanged", this.onAxisChange);
  }

  onLeaveVR() {
    this.controller1.removeEventListener("menuup", this.onMenu1);
    this.controller2.removeEventListener("menuup", this.onMenu2);
    // remove controllers from 3d scene
    this.scene.remove(this.controller1);
    this.scene.remove(this.controller2);
  }

  onAxisChange(obj) {
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

  cycleChannels(i) {
    if (!this.object) {
      return;
    }

    this.currentChannel[i]++;
    if (this.currentChannel[i] >= this.object.num_channels) {
      this.currentChannel[i] = 0;
    }
    // this will switch off all channels except this.currentChannels
    for (let i = 0; i < this.object.num_channels; ++i) {
      this.object.setVolumeChannelEnabled(i, i === this.currentChannel[0] || i === this.currentChannel[1]);
    }
    this.object.fuse();
  }

  update(deltaT) {
    // must call update on the controllers, first!
    this.controller1.update();
    this.controller2.update();

    const isTrigger1Down = this.controller1.getButtonState("trigger");
    const isTrigger2Down = this.controller2.getButtonState("trigger");
    const rotating = (isTrigger1Down && !isTrigger2Down) || (isTrigger2Down && !isTrigger1Down);
    const theController = isTrigger1Down ? this.controller1 : this.controller2;
    const zooming = isTrigger1Down && isTrigger2Down;

    if (rotating) {
      if ((!this.trigger1Down && isTrigger1Down) || (!this.trigger2Down && isTrigger2Down)) {
        this.VRrotate = true;
        this.VRrotateStartPos = new Vector3().setFromMatrixPosition(theController.matrix);
      }
    }
    if ((this.trigger1Down && !isTrigger1Down) || (this.trigger2Down && !isTrigger2Down)) {
      this.VRrotate = false;
    }
    if (this.object && zooming) {
      let obj3d = this.object.sceneRoot;
      this.VRzoom = true;

      this.scale.copy(obj3d.scale);

      const p1 = new Vector3().setFromMatrixPosition(this.controller1.matrix);
      const p2 = new Vector3().setFromMatrixPosition(this.controller2.matrix);
      const dist = p1.distanceTo(p2);
      if (!this.wasZooming) {
        this.VRzoomStart = 0;
        this.VRzoomdist = dist;
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
      this.VRzoom = false;
      this.previousDist = null;
    }

    if (this.object && this.VRrotate) {
      let obj3d = this.object.sceneRoot;

      // dist from last pose position in x and z.
      var pos = new Vector3().setFromMatrixPosition(theController.matrix);

      var origin = obj3d.position;

      var v0 = new Vector3().subVectors(this.VRrotateStartPos, origin);
      v0 = v0.normalize();
      var v1 = new Vector3().subVectors(pos, origin);
      v1 = v1.normalize();

      var mio = new Matrix4();
      mio.copy(obj3d.matrixWorld).invert();

      v0 = v0.transformDirection(mio);
      v0 = v0.normalize();
      v1 = v1.transformDirection(mio);
      v1 = v1.normalize();

      var q = new Quaternion();
      q.setFromUnitVectors(v0, v1);

      obj3d.quaternion.multiply(q);

      this.VRrotateStartPos.set(pos.x, pos.y, pos.z);
    }
    this.trigger1Down = isTrigger1Down;
    this.trigger2Down = isTrigger2Down;
    this.wasZooming = zooming;
  }
}

export default vrObjectControls;

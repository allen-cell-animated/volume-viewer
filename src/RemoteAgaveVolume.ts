import {
  Euler,
  Matrix4,
  Mesh,
  NormalBlending,
  Object3D,
  PerspectiveCamera,
  PlaneGeometry,
  Quaternion,
  ShaderMaterial,
  ShaderMaterialParameters,
  Texture,
  UniformsUtils,
  Vector3,
} from "three";

import { ThreeJsPanel } from "./ThreeJsPanel";
import { VolumeRenderImpl } from "./VolumeRenderImpl";
import { VolumeRenderSettings, SettingsFlags } from "./VolumeRenderSettings";
import { AgaveClient, JSONValue } from "./temp_agave/agave";
import Volume from "./Volume";
import Channel from "./Channel";
import { Bounds, FuseChannel, isOrthographicCamera } from "./types";

export default class RemoteAgaveVolume implements VolumeRenderImpl {
  private agave: AgaveClient;
  private volume: Volume;
  private settings: VolumeRenderSettings;
  private translation: Vector3;
  private rotation: Euler;

  private imageStream: HTMLImageElement;
  private imageTex: Texture;
  private object: Mesh;
  private screenOutputShader: ShaderMaterialParameters;
  private screenOutputMaterial: ShaderMaterial;

  private cameraDirty = false;
  private bounds: Bounds;
  private pixelSamplingRate = 0.75;

  constructor(volume: Volume, settings: VolumeRenderSettings = new VolumeRenderSettings(volume)) {
    this.volume = volume;
    this.translation = new Vector3(0, 0, 0);
    this.rotation = new Euler();
    this.bounds = {
      bmin: new Vector3(-0.5, -0.5, -0.5),
      bmax: new Vector3(0.5, 0.5, 0.5),
    };
    this.imageStream = new Image();
    this.imageTex = new Texture(this.imageStream);
    //this.imageTex = new DataTexture(new Uint8Array([255, 0, 0, 255]), 1, 1);
    this.screenOutputShader = {
      uniforms: UniformsUtils.merge([
        {
          tTexture0: {
            type: "t",
            value: this.imageTex,
          },
        },
      ]),

      vertexShader: [
        "precision highp float;",
        "precision highp int;",

        "out vec2 vUv;",

        "void main()",
        "{",
        "vUv = uv;",
        "gl_Position = vec4( position, 1.0 );",
        "}",
      ].join("\n"),

      fragmentShader: [
        "precision highp float;",
        "precision highp int;",
        "precision highp sampler2D;",

        "uniform sampler2D tTexture0;",
        "in vec2 vUv;",

        "void main()",
        "{",
        "vec4 pixelColor = texture(tTexture0, vUv);",
        "pc_fragColor = pixelColor;",
        "}",
      ].join("\n"),
    };

    this.screenOutputMaterial = new ShaderMaterial({
      uniforms: this.screenOutputShader.uniforms,
      vertexShader: this.screenOutputShader.vertexShader,
      fragmentShader: this.screenOutputShader.fragmentShader,
      depthWrite: false,
      depthTest: false,
      blending: NormalBlending,
      transparent: true,
    });
    this.object = new Mesh(new PlaneGeometry(2, 2), this.screenOutputMaterial);

    const wsUri = "ws://localhost:1235";
    //const wsUri = "ws://dev-aics-dtp-001.corp.alleninstitute.org:1235";
    //const wsUri = "ws://ec2-35-86-138-54.us-west-2.compute.amazonaws.com:1235";
    this.agave = new AgaveClient(
      wsUri,
      "pathtrace",
      undefined, // this.onConnectionOpened.bind(this),
      this.onJsonReceived.bind(this),
      this.onImageReceived.bind(this)
    );
    this.settings = settings;
  }

  async init(): Promise<boolean> {
    //await this.agave.connect();
    return (
      this.agave
        .connect()
        .then(() => {
          this.onConnectionOpened();
          return true;
        })
        // without an explicit reject handler, promise rejection drops into the catch block
        .catch((err) => {
          console.log(err);
          return false;
        })
    );
  }

  private onConnectionOpened() {
    // tell agave to load this volume.
    // convert subpath to a number for multiresolution level.
    const level = parseInt(this.volume.loadSpec.subpath) || 0;
    this.agave.loadData(
      this.volume.loadSpec.url,
      this.volume.loadSpec.scene,
      level,
      this.volume.loadSpec.time,
      [],
      [
        this.volume.loadSpec.minx || 0,
        this.volume.loadSpec.maxx || 0,
        this.volume.loadSpec.miny || 0,
        this.volume.loadSpec.maxy || 0,
        this.volume.loadSpec.minz || 0,
        this.volume.loadSpec.maxz || 0,
      ]
    );
    this.agave.streamMode(1);
    this.cameraDirty = true;
    this.updateSettings(this.settings);
    // this.agave.enableChannel(0, 1);
    // this.agave.setPercentileThreshold(0, 0.5, 0.98);
    // this.agave.enableChannel(1, 1);
    // this.agave.setPercentileThreshold(1, 0.5, 0.98);
    // this.agave.enableChannel(2, 1);
    // this.agave.setPercentileThreshold(2, 0.5, 0.98);
    this.agave.redraw();
    this.agave.flushCommandBuffer();
  }

  private onJsonReceived(_json: JSONValue) {
    return;
  }
  private onImageReceived(image: Blob) {
    const dataurl = URL.createObjectURL(image);

    // arraybuffer mode
    //const dataurl = "data:image/png;base64," + arrayBufferToBase64String(this.enqueued_image_data);

    // decode jpg/png, get it into Image, then into Texture
    this.imageStream.src = dataurl;

    const img = new Image();
    img.src = dataurl;
    img.onload = () => {
      this.imageTex = new Texture(img);
      this.imageTex.needsUpdate = true;
      this.screenOutputMaterial.uniforms.tTexture0.value = this.imageTex;
      this.screenOutputMaterial.needsUpdate = true;
    };
    //    this.imageTex = new Texture(img);

    //    this.imageTex.needsUpdate = true;
    // this.screenOutputMaterial.uniforms.tTexture0.value = this.imageTex;
    // this.screenOutputMaterial.needsUpdate = true;
    //(this.object.material as Material).needsUpdate = true;
  }
  ///////////////////////////////////////////////
  // VolumeRenderImpl interface implementation //
  ///////////////////////////////////////////////

  get3dObject(): Object3D {
    return this.object;
  }

  doRender(canvas: ThreeJsPanel): void {
    if (!this.agave) {
      return;
    }
    if (!this.agave.isReady()) {
      return;
    }
    if (this.cameraDirty) {
      const cam = canvas.camera;

      let mydir = new Vector3();
      mydir = cam.getWorldDirection(mydir);
      const myup = new Vector3().copy(cam.up);
      // don't rotate this vector.  we are using translation as the pivot point of the object, and THEN rotating.
      const mypos = new Vector3().copy(cam.position);

      // apply volume translation and rotation:
      const physicalSize = this.volume.normalizedPhysicalSize.clone();
      physicalSize.multiplyScalar(0.5);
      // rotate camera.up, camera.direction, and camera position by inverse of volume's modelview
      const m = new Matrix4().makeRotationFromQuaternion(new Quaternion().setFromEuler(this.rotation).invert());
      mypos.sub(this.translation);
      mypos.add(physicalSize);
      mypos.applyMatrix4(m);
      myup.applyMatrix4(m);
      mydir.applyMatrix4(m);
      const target = new Vector3().addVectors(mypos, mydir);
      console.log(mypos, target);
      //this.agave.orbitCamera(4, 0);
      this.agave.eye(mypos.x, mypos.y, mypos.z);
      this.agave.up(myup.x, myup.y, myup.z);
      this.agave.target(mypos.x + mydir.x, mypos.y + mydir.y, mypos.z + mydir.z);
      this.agave.cameraProjection(
        isOrthographicCamera(cam) ? 1 : 0,
        isOrthographicCamera(cam) ? canvas.getOrthoScale() : (cam as PerspectiveCamera).fov
      );

      this.cameraDirty = false;
    }

    this.agave.flushCommandBuffer();
  }
  updateSettings(newSettings: VolumeRenderSettings, dirtyFlags?: number | SettingsFlags): void {
    if (dirtyFlags === undefined) {
      dirtyFlags = SettingsFlags.ALL;
    }

    this.settings = newSettings;

    // Update resolution
    if (dirtyFlags & SettingsFlags.SAMPLING) {
      const { x, y } = this.settings.resolution;
      const dpr = window.devicePixelRatio ? window.devicePixelRatio : 1.0;
      const nx = Math.floor((x * this.pixelSamplingRate) / dpr);
      const ny = Math.floor((y * this.pixelSamplingRate) / dpr);
      this.agave.setResolution(nx, ny);
      this.agave.setPrimaryRayStepSize(this.settings.primaryRayStepSize);
      this.agave.setSecondaryRayStepSize(this.settings.secondaryRayStepSize);
    }

    if (dirtyFlags & SettingsFlags.TRANSFORM) {
      // not implemented yet
      // flipAxes
      this.translation.copy(this.settings.translation);
      this.rotation.copy(this.settings.rotation);
    }

    if (dirtyFlags & SettingsFlags.MATERIAL) {
      // massive fudge factor
      this.agave.density(this.settings.density * 150.0);
    }
    if (dirtyFlags & SettingsFlags.ROI) {
      // translate to [0,1] range
      this.agave.setClipRegion(
        this.settings.bounds.bmin.x + 0.5,
        this.settings.bounds.bmax.x + 0.5,
        this.settings.bounds.bmin.y + 0.5,
        this.settings.bounds.bmax.y + 0.5,
        this.settings.bounds.bmin.z + 0.5,
        this.settings.bounds.bmax.z + 0.5
      );
    }

    if (dirtyFlags & SettingsFlags.CAMERA) {
      // convert to an exposure value
      if (this.settings.brightness === 1.0) {
        this.settings.brightness = 0.999;
      }
      this.agave.exposure(this.settings.brightness);
    }
    if (dirtyFlags & SettingsFlags.MASK) {
      // not implemented yet
    }
    if (dirtyFlags & SettingsFlags.VIEW) {
      // not implemented yet
    }

    if (dirtyFlags & SettingsFlags.BOUNDING_BOX) {
      this.agave.showBoundingBox(this.settings.showBoundingBox ? 1 : 0);
      this.agave.boundingBoxColor(
        this.settings.boundingBoxColor[0],
        this.settings.boundingBoxColor[1],
        this.settings.boundingBoxColor[2]
      );
    }
  }

  cleanup(): void {
    this.agave.disconnect();
  }

  viewpointMoved(): void {
    this.cameraDirty = true;
  }

  setRenderUpdateListener(_listener?: (iteration: number) => void): void {
    console.log("RemoteAgaveVolume.setRenderUpdateListener not implemented");
  }

  onStartControls(): void {
    return;
  }
  onChangeControls(): void {
    this.cameraDirty = true;
  }
  onEndControls(): void {
    return;
  }

  updateActiveChannels(channelcolors: FuseChannel[], _channeldata: Channel[]): void {
    for (let i = 0; i < this.volume.num_channels; i++) {
      this.agave.enableChannel(i, 0);
    }
    for (const channel of channelcolors) {
      const enabled = channel.enabled;
      this.agave.enableChannel(channel.chIndex, enabled ? 1 : 0);
      if (enabled) {
        this.agave.matDiffuse(
          channel.chIndex,
          channel.rgbColor[0] / 255.0,
          channel.rgbColor[1] / 255.0,
          channel.rgbColor[2] / 255.0,
          1.0
        );
      }
    }
  }
}

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
import { AgaveClient, JSONValue } from "./temp_agave/agave";
import Volume from "./Volume";
import { Bounds, isOrthographicCamera } from "./types";

export default class RemoteAgaveVolume implements VolumeRenderImpl {
  private agave: AgaveClient;
  private volume: Volume;
  private translation: Vector3;
  private rotation: Euler;

  private imageStream: HTMLImageElement;
  private imageTex: Texture;
  private object: Mesh;
  private screenOutputShader: ShaderMaterialParameters;
  private screenOutputMaterial: ShaderMaterial;

  private cameraDirty = false;
  private bounds: Bounds;

  constructor(volume: Volume) {
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
    //const wsUri = "ws://ec2-54-245-184-76.us-west-2.compute.amazonaws.com:1235";
    this.agave = new AgaveClient(
      wsUri,
      "pathtrace",
      this.onConnectionOpened.bind(this),
      this.onJsonReceived.bind(this),
      this.onImageReceived.bind(this)
    );
  }

  async init() {
    await this.agave.connect();
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
        this.volume.loadSpec.minx,
        this.volume.loadSpec.maxx,
        this.volume.loadSpec.miny,
        this.volume.loadSpec.maxy,
        this.volume.loadSpec.minz,
        this.volume.loadSpec.maxz,
      ]
    );
    this.agave.streamMode(1);
    this.cameraDirty = true;
    this.agave.enableChannel(0, 1);
    this.agave.setPercentileThreshold(0, 0.5, 0.98);
    this.agave.enableChannel(1, 1);
    this.agave.setPercentileThreshold(1, 0.5, 0.98);
    this.agave.enableChannel(2, 1);
    this.agave.setPercentileThreshold(2, 0.5, 0.98);
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
  setRayStepSizes(rayStepSize: number, secondaryRayStepSize: number): void {
    this.agave.setPrimaryRayStepSize(rayStepSize);
    this.agave.setSecondaryRayStepSize(secondaryRayStepSize);
  }
  setScale(_scale: Vector3): void {
    console.log("RemoteAgaveVolume.setScale not implemented");
  }
  setOrthoScale(_scale: number): void {
    console.log("RemoteAgaveVolume.setOrthoScale not implemented");
  }
  setResolution(_x: number, _y: number): void {
    this.agave.setResolution(_x, _y);
  }

  // -0.5 .. 0.5
  setAxisClip(axis: "x" | "y" | "z", minval: number, maxval: number, _isOrthoAxis: boolean): void {
    this.bounds.bmax[axis] = maxval + 0.5;
    this.bounds.bmin[axis] = minval + 0.5;
    this.agave.setClipRegion(
      this.bounds.bmin.x,
      this.bounds.bmax.x,
      this.bounds.bmin.y,
      this.bounds.bmax.y,
      this.bounds.bmin.z,
      this.bounds.bmax.z
    );
  }

  setIsOrtho(_isOrtho: boolean): void {
    return;
  }

  setOrthoThickness(_thickness: number): void {
    return;
  }

  setInterpolationEnabled(_enabled: boolean): void {
    return;
  }

  setGamma(_gmin: number, _glevel: number, _gmax: number): void {
    // TODO is there some exposure control in agave this can map to?
  }

  setFlipAxes(_flipX: number, _flipY: number, _flipZ: number): void {
    console.log("RemoteAgaveVolume.setFlipAxes not implemented");
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

  cleanup(): void {
    this.agave.disconnect();
  }

  onChannelData(_batch: number[]): void {
    // all channel data is loaded separately by agave on the back end
  }

  setVisible(_visible: boolean): void {
    return;
  }

  setBrightness(brightness: number): void {
    // convert to an exposure value
    if (brightness === 1.0) {
      brightness = 0.999;
    }
    this.agave.exposure(brightness);
  }

  setDensity(density: number): void {
    // massive fudge factor
    this.agave.density(density * 150.0);
  }

  setChannelAsMask(_channel: number): boolean {
    return false;
  }

  setMaskAlpha(_alpha: number): void {
    return;
  }

  setShowBoundingBox(show: boolean): void {
    this.agave.showBoundingBox(show ? 1 : 0);
  }

  setBoundingBoxColor(color: [number, number, number]): void {
    this.agave.boundingBoxColor(color[0], color[1], color[2]);
  }

  viewpointMoved(): void {
    this.cameraDirty = true;
  }

  // 0..1 ranges as input
  updateClipRegion(xmin: number, xmax: number, ymin: number, ymax: number, zmin: number, zmax: number): void {
    this.bounds = {
      bmin: new Vector3(xmin, ymin, zmin),
      bmax: new Vector3(xmax, ymax, zmax),
    };
    // const physicalSize = this.volume.normalizedPhysicalSize;
    // this.pathTracingUniforms.gClippedAaBbMin.value = new Vector3(
    //   xmin * physicalSize.x - 0.5 * physicalSize.x,
    //   ymin * physicalSize.y - 0.5 * physicalSize.y,
    //   zmin * physicalSize.z - 0.5 * physicalSize.z
    // );
    // this.pathTracingUniforms.gClippedAaBbMax.value = new Vector3(
    //   xmax * physicalSize.x - 0.5 * physicalSize.x,
    //   ymax * physicalSize.y - 0.5 * physicalSize.y,
    //   zmax * physicalSize.z - 0.5 * physicalSize.z
    // );

    this.agave.setClipRegion(
      this.bounds.bmin.x,
      this.bounds.bmax.x,
      this.bounds.bmin.y,
      this.bounds.bmax.y,
      this.bounds.bmin.z,
      this.bounds.bmax.z
    );
  }
  setPixelSamplingRate(_rate: number): void {
    console.log("RemoteAgaveVolume.setPixelSamplingRate not implemented");
  }
  setRenderUpdateListener(_listener?: (iteration: number) => void): void {
    console.log("RemoteAgaveVolume.setRenderUpdateListener not implemented");
  }

  setTranslation(vec3xyz: Vector3): void {
    this.translation.copy(vec3xyz);
  }

  setRotation(eulerXYZ: Euler): void {
    this.rotation.copy(eulerXYZ);
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
}

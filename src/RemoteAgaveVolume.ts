import {
  DataTexture,
  Euler,
  Mesh,
  NormalBlending,
  Object3D,
  PlaneGeometry,
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

export default class RemoteAgaveVolume implements VolumeRenderImpl {
  private agave: AgaveClient;
  private volume: Volume;
  private imageStream: HTMLImageElement;
  private imageTex: Texture;
  private object: Mesh;
  private screenOutputShader: ShaderMaterialParameters;
  private screenOutputMaterial: ShaderMaterial;

  constructor(volume: Volume) {
    this.volume = volume;
    this.imageStream = new Image();
    this.imageTex = new Texture(this.imageStream);
    this.imageTex = new DataTexture(new Uint8Array([255, 0, 0, 255]), 1, 1);
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
        "gl_Position = vec4( position*2.0, 1.0 );",
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
        "pc_fragColor = pixelColor;", // sqrt(pixelColor);',
        //'out_FragColor = pow(pixelColor, vec4(1.0/2.2));',
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
    this.object = new Mesh(new PlaneGeometry(1, 1), this.screenOutputMaterial);
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

  private onConnectionOpened() {
    // tell agave to load this volume.
    // convert subpath to a number for multiresolution level.
    const level = parseInt(this.volume.loadSpec.subpath) || 0;
    this.agave.loadData(this.volume.loadSpec.url, this.volume.loadSpec.scene, level, this.volume.loadSpec.time, [
      this.volume.loadSpec.minx,
      this.volume.loadSpec.maxx,
      this.volume.loadSpec.miny,
      this.volume.loadSpec.maxy,
      this.volume.loadSpec.minz,
      this.volume.loadSpec.maxz,
    ]);
  }

  private onJsonReceived(_json: JSONValue) {
    0;
  }
  private onImageReceived(image: Blob) {
    const dataurl = URL.createObjectURL(image);

    // arraybuffer mode
    //const dataurl = "data:image/png;base64," + arrayBufferToBase64String(this.enqueued_image_data);

    // decode jpg/png, get it into Image, then into Texture
    this.imageStream = new Image();
    this.imageStream.src = dataurl;
    this.imageTex = new Texture(this.imageStream);
    this.imageTex.needsUpdate = true;
    this.screenOutputMaterial.uniforms.tTexture0.value = this.imageTex;
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
  setAxisClip(_axis: "x" | "y" | "z", _minval: number, _maxval: number, _isOrthoAxis: boolean): void {
    console.log("RemoteAgaveVolume.setAxisClip not implemented");
  }
  setIsOrtho(_isOrtho: boolean): void {
    console.log("RemoteAgaveVolume.setIsOrtho not implemented");
  }
  setOrthoThickness(_thickness: number): void {
    console.log("RemoteAgaveVolume.setOrthoThickness not implemented");
  }
  setInterpolationEnabled(_enabled: boolean): void {
    console.log("RemoteAgaveVolume.setInterpolationEnabled not implemented");
  }
  setGamma(_gmin: number, _glevel: number, _gmax: number): void {
    console.log("RemoteAgaveVolume.setGamma not implemented");
  }
  setFlipAxes(_flipX: number, _flipY: number, _flipZ: number): void {
    console.log("RemoteAgaveVolume.setFlipAxes not implemented");
  }
  doRender(_canvas: ThreeJsPanel): void {
    console.log("RemoteAgaveVolume.doRender not implemented");
  }
  cleanup(): void {
    console.log("RemoteAgaveVolume.cleanup not implemented");
  }
  onChannelData(_batch: number[]): void {
    console.log("RemoteAgaveVolume.onChannelData not implemented");
  }
  setVisible(_visible: boolean): void {
    console.log("RemoteAgaveVolume.setVisible not implemented");
  }
  setBrightness(brightness: number): void {
    this.agave.exposure(brightness);
  }
  setDensity(density: number): void {
    this.agave.density(density);
  }
  setChannelAsMask(_channel: number): boolean {
    console.log("RemoteAgaveVolume.setChannelAsMask not implemented");
    return false;
  }
  setMaskAlpha(_alpha: number): void {
    console.log("RemoteAgaveVolume.setMaskAlpha not implemented");
  }
  setShowBoundingBox(show: boolean): void {
    this.agave.showBoundingBox(show ? 1 : 0);
  }
  setBoundingBoxColor(color: [number, number, number]): void {
    this.agave.boundingBoxColor(color[0], color[1], color[2]);
  }
  viewpointMoved(): void {
    console.log("RemoteAgaveVolume.viewpointMoved not implemented");
  }
  updateClipRegion(xmin: number, xmax: number, ymin: number, ymax: number, zmin: number, zmax: number): void {
    this.agave.setClipRegion(xmin, xmax, ymin, ymax, zmin, zmax);
  }
  setPixelSamplingRate(_rate: number): void {
    console.log("RemoteAgaveVolume.setPixelSamplingRate not implemented");
  }
  setRenderUpdateListener(_listener?: (iteration: number) => void): void {
    console.log("RemoteAgaveVolume.setRenderUpdateListener not implemented");
  }
  setTranslation(_translation: Vector3): void {
    console.log("RemoteAgaveVolume.setTranslation not implemented");
  }
  setRotation(_rotation: Euler): void {
    console.log("RemoteAgaveVolume.setRotation not implemented");
  }
}

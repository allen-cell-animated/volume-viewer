import { Euler, Object3D, Vector3, Texture, Mesh, MeshBasicMaterial, PlaneGeometry } from "three";
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

  constructor(volume: Volume) {
    this.volume = volume;
    this.imageStream = new Image();
    this.imageTex = new Texture(this.imageStream);
    this.object = new Mesh(new PlaneGeometry(1, 1), new MeshBasicMaterial({ map: this.imageTex }));
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
    const level = parseInt(this.volume.loadSpec.subpath);
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
  private onImageReceived(_image: Blob) {
    //const dataurl = URL.createObjectURL(image);

    // arraybuffer mode
    //const dataurl = "data:image/png;base64," + arrayBufferToBase64String(this.enqueued_image_data);

    // this is directly rendering the image; see redraw()
    // ideally we render to canvas, combine with other elements or threejs etc
    //this.streamimg1.src = dataurl;

    0;
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

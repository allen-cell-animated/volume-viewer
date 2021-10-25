import {
  BoxHelper,
  Euler,
  Vector2,
  Vector3,
  Group,
  BoxGeometry,
  Mesh,
  Material,
  ShaderMaterial,
  Matrix4,
  BufferGeometry,
} from "three";

import FusedChannelData from "./FusedChannelData";
import {
  rayMarchingVertexShaderSrc,
  rayMarchingFragmentShaderSrc,
  rayMarchingShaderUniforms,
} from "./constants/volumeRayMarchShader";
import { Volume } from ".";
import Channel from "./Channel";
import { ThreeJsPanel } from "./ThreeJsPanel";

import { Bounds, FuseChannel } from "./types";

export default class RayMarchedAtlasVolume {
  public volume: Volume;
  public bounds: Bounds;
  private cube: BoxGeometry;
  private cubeMesh: Mesh<BufferGeometry, Material>;
  private boxHelper: BoxHelper;
  private cubeTransformNode: Group;
  private uniforms: typeof rayMarchingShaderUniforms;
  private channelData: FusedChannelData;
  private scale: Vector3;

  constructor(volume: Volume) {
    // need?
    this.volume = volume;

    this.bounds = {
      bmin: new Vector3(-0.5, -0.5, -0.5),
      bmax: new Vector3(0.5, 0.5, 0.5),
    };
    this.scale = new Vector3(1.0, 1.0, 1.0);

    this.cube = new BoxGeometry(1.0, 1.0, 1.0);
    this.cubeMesh = new Mesh(this.cube);
    this.cubeMesh.name = "Volume";

    this.boxHelper = new BoxHelper(this.cubeMesh, 0xffff00);

    this.cubeTransformNode = new Group();
    this.cubeTransformNode.name = "VolumeContainerNode";
    // TODO: when bounding box UX is determined,
    // uncomment the following line to show the box
    //this.cubeTransformNode.add(this.boxHelper);
    this.cubeTransformNode.add(this.cubeMesh);

    this.uniforms = rayMarchingShaderUniforms;

    // shader,vtx and frag.
    const vtxsrc = rayMarchingVertexShaderSrc;
    const fgmtsrc = rayMarchingFragmentShaderSrc;

    const threeMaterial = new ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vtxsrc,
      fragmentShader: fgmtsrc,
      transparent: true,
      depthTest: false,
    });
    this.cubeMesh.material = threeMaterial;

    this.setUniform("ATLAS_X", volume.imageInfo.cols);
    this.setUniform("ATLAS_Y", volume.imageInfo.rows);
    this.setUniform("textureRes", new Vector2(volume.imageInfo.atlas_width, volume.imageInfo.atlas_height));
    this.setUniform("SLICES", volume.z);

    this.channelData = new FusedChannelData(volume.imageInfo.atlas_width, volume.imageInfo.atlas_height);
    // tell channelData about the channels that are already present, one at a time.
    for (let i = 0; i < this.volume.channels.length; ++i) {
      if (this.volume.getChannel(i).loaded) {
        this.channelData.onChannelLoaded([i], this.volume.channels);
      }
    }
  }

  public cleanup(): void {
    this.cube.dispose();
    this.cubeMesh.material.dispose();

    this.channelData.cleanup();
  }

  public setVisible(isVisible: boolean): void {
    this.cubeMesh.visible = isVisible;
  }

  public doRender(canvas: ThreeJsPanel): void {
    if (!this.cubeMesh.visible) {
      return;
    }

    this.cubeMesh.updateMatrixWorld(true);
    this.boxHelper.update();

    const mvm = new Matrix4();
    mvm.multiplyMatrices(canvas.camera.matrixWorldInverse, this.cubeMesh.matrixWorld);
    const mi = new Matrix4();
    mi.copy(mvm).invert();

    this.setUniform("inverseModelViewMatrix", mi);

    const isVR = canvas.isVR();
    if (isVR) {
      this.cubeMesh.material.depthWrite = true;
      this.cubeMesh.material.transparent = false;
      this.cubeMesh.material.depthTest = true;
    } else {
      this.cubeMesh.material.depthWrite = false;
      this.cubeMesh.material.transparent = true;
      this.cubeMesh.material.depthTest = false;
    }
  }

  public get3dObject(): Group {
    return this.cubeTransformNode;
  }

  public onChannelData(batch: number[]): void {
    this.channelData.onChannelLoaded(batch, this.volume.channels);
  }

  public setScale(scale: Vector3): void {
    this.scale = scale;

    this.cubeMesh.scale.copy(new Vector3(scale.x, scale.y, scale.z));
    this.setUniform("volumeScale", scale);
  }

  public setRayStepSizes(_primary: number, _secondary: number): void {
    // no op
  }

  public setTranslation(vec3xyz: Vector3): void {
    this.cubeMesh.position.copy(vec3xyz);
  }

  public setRotation(eulerXYZ: Euler): void {
    this.cubeTransformNode.rotation.copy(eulerXYZ);
  }

  public setOrthoScale(value: number): void {
    this.setUniform("orthoScale", value);
  }

  public setResolution(x: number, y: number): void {
    this.setUniform("iResolution", new Vector2(x, y));
  }

  public setPixelSamplingRate(_value: number): void {
    // no op
  }

  public setDensity(density: number): void {
    this.setUniform("DENSITY", density);
  }

  // TODO brightness and exposure should be the same thing?
  public setBrightness(brightness: number): void {
    this.setUniform("BRIGHTNESS", brightness * 2.0);
  }

  public setIsOrtho(isOrthoAxis: boolean): void {
    this.setUniform("isOrtho", isOrthoAxis ? 1.0 : 0.0);
    if (!isOrthoAxis) {
      this.setOrthoThickness(1.0);
    }
  }

  public viewpointMoved(): void {
    // no op
  }

  public setGamma(gmin: number, glevel: number, gmax: number): void {
    this.setUniform("GAMMA_MIN", gmin);
    this.setUniform("GAMMA_MAX", gmax);
    this.setUniform("GAMMA_SCALE", glevel);
  }

  public setMaxProjectMode(isMaxProject: boolean): void {
    this.setUniform("maxProject", isMaxProject ? 1 : 0);
  }

  public setAxisClip(axis: number, minval: number, maxval: number, isOrthoAxis: boolean): void {
    this.bounds.bmax[axis] = maxval;
    this.bounds.bmin[axis] = minval;

    if (isOrthoAxis) {
      const thicknessPct = maxval - minval;
      this.setOrthoThickness(thicknessPct);
    } else {
      // it is possible this is overly aggressive resetting this value here
      // but testing has shown no ill effects and it is better to have a definite
      // known value when in perspective mode
      this.setOrthoThickness(1.0);
    }

    this.setUniform("AABB_CLIP_MIN", this.bounds.bmin);
    this.setUniform("AABB_CLIP_MAX", this.bounds.bmax);
  }

  public setFlipAxes(flipX: number, flipY: number, flipZ: number): void {
    this.setUniform("flipVolume", new Vector3(flipX, flipY, flipZ));
  }

  // 0..1
  public updateClipRegion(xmin: number, xmax: number, ymin: number, ymax: number, zmin: number, zmax: number): void {
    this.bounds = {
      bmin: new Vector3(xmin - 0.5, ymin - 0.5, zmin - 0.5),
      bmax: new Vector3(xmax - 0.5, ymax - 0.5, zmax - 0.5),
    };
    this.setUniform("AABB_CLIP_MIN", this.bounds.bmin);
    this.setUniform("AABB_CLIP_MAX", this.bounds.bmax);
  }

  public setChannelAsMask(channelIndex: number): boolean {
    if (!this.volume.channels[channelIndex] || !this.volume.channels[channelIndex].loaded) {
      return false;
    }
    return this.channelData.setChannelAsMask(channelIndex, this.volume.channels[channelIndex]);
  }

  public setMaskAlpha(maskAlpha: number): void {
    this.setUniform("maskAlpha", maskAlpha);
  }

  public setOrthoThickness(value: number): void {
    this.setUniform("orthoThickness", value);
  }

  //////////////////////////////////////////
  //////////////////////////////////////////

  private setUniform(name, value) {
    if (!this.uniforms[name]) {
      return;
    }
    this.uniforms[name].value = value;
    this.cubeMesh.material.needsUpdate = true;
  }

  // channelcolors is array of {rgbColor, lut} and channeldata is volume.channels
  public fuse(channelcolors: FuseChannel[], channeldata: Channel[]): void {
    //'m' for max or 'a' for avg
    const fusionType = "m";
    this.channelData.fuse(channelcolors, fusionType, channeldata);

    // update to fused texture
    this.setUniform("textureAtlas", this.channelData.fusedTexture);
    this.setUniform("textureAtlasMask", this.channelData.maskTexture);
  }
}

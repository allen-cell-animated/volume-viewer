import {
  Box3,
  Box3Helper,
  BoxGeometry,
  BufferGeometry,
  Color,
  Euler,
  Group,
  LineBasicMaterial,
  Material,
  Matrix4,
  Mesh,
  ShaderMaterial,
  Vector2,
  Vector3,
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
  private boxHelper: Box3Helper;
  private cubeTransformNode: Group;
  private uniforms: typeof rayMarchingShaderUniforms;
  private channelData: FusedChannelData;
  private scale: Vector3;

  constructor(volume: Volume) {
    // need?
    this.volume = volume;

    // note that these bounds are the clipped region of interest,
    // and not always the whole volume
    this.bounds = {
      bmin: new Vector3(-0.5, -0.5, -0.5),
      bmax: new Vector3(0.5, 0.5, 0.5),
    };
    this.scale = new Vector3(1.0, 1.0, 1.0);

    this.cube = new BoxGeometry(1.0, 1.0, 1.0);
    this.cubeMesh = new Mesh(this.cube);
    this.cubeMesh.name = "Volume";

    this.boxHelper = new Box3Helper(
      new Box3(new Vector3(-0.5, -0.5, -0.5), new Vector3(0.5, 0.5, 0.5)),
      new Color(0xffff00)
    );
    this.boxHelper.updateMatrixWorld();
    this.boxHelper.visible = false;

    this.cubeTransformNode = new Group();
    this.cubeTransformNode.name = "VolumeContainerNode";

    this.cubeTransformNode.add(this.boxHelper);
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
      depthTest: true,
      depthWrite: false,
    });

    this.cubeMesh.material = threeMaterial;

    this.setUniform("ATLAS_X", volume.imageInfo.cols);
    this.setUniform("ATLAS_Y", volume.imageInfo.rows);
    this.setUniform("textureRes", new Vector2(volume.imageInfo.atlas_width, volume.imageInfo.atlas_height));
    this.setUniform("SLICES", volume.z);
    this.setScale(this.scale);

    this.channelData = new FusedChannelData(volume.imageInfo.atlas_width, volume.imageInfo.atlas_height);
  }

  public cleanup(): void {
    this.cube.dispose();
    this.cubeMesh.material.dispose();

    this.channelData.cleanup();
  }

  public setVisible(isVisible: boolean): void {
    this.cubeMesh.visible = isVisible;
    // note that this does not affect bounding box visibility
  }

  public setShowBoundingBox(showBoundingBox: boolean): void {
    this.boxHelper.visible = showBoundingBox;
  }

  public setBoundingBoxColor(color: [number, number, number]): void {
    // note this material update is supposed to be a hidden implementation detail
    // but I didn't want to re-create a whole boxHelper again.
    // I could also create a new LineBasicMaterial but that would also rely on knowledge
    // that Box3Helper expects that type.
    (this.boxHelper.material as LineBasicMaterial).color = new Color(color[0], color[1], color[2]);
  }

  public doRender(canvas: ThreeJsPanel): void {
    if (!this.cubeMesh.visible) {
      return;
    }

    this.channelData.gpuFuse(canvas.renderer);
    this.setUniform("textureAtlas", this.channelData.getFusedTexture());

    this.cubeTransformNode.updateMatrixWorld(true);

    const mvm = new Matrix4();
    mvm.multiplyMatrices(canvas.camera.matrixWorldInverse, this.cubeMesh.matrixWorld);
    const mi = new Matrix4();
    mi.copy(mvm).invert();

    this.setUniform("inverseModelViewMatrix", mi);
  }

  public get3dObject(): Group {
    return this.cubeTransformNode;
  }

  public onChannelData(_batch: number[]): void {
    // no op
  }

  public setScale(scale: Vector3): void {
    this.scale = scale;

    this.cubeMesh.scale.copy(new Vector3(scale.x, scale.y, scale.z));
    this.setUniform("volumeScale", scale);
    this.boxHelper.box.set(
      new Vector3(-0.5 * scale.x, -0.5 * scale.y, -0.5 * scale.z),
      new Vector3(0.5 * scale.x, 0.5 * scale.y, 0.5 * scale.z)
    );
  }

  public setRayStepSizes(_primary: number, _secondary: number): void {
    // no op
  }

  public setTranslation(vec3xyz: Vector3): void {
    this.cubeTransformNode.position.copy(vec3xyz);
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
    this.channelData.fuse(channelcolors, channeldata);

    // update to fused texture
    this.setUniform("textureAtlas", this.channelData.getFusedTexture());
    this.setUniform("textureAtlasMask", this.channelData.maskTexture);
  }
}

import { Vector2, Vector3, Group, BoxGeometry, Mesh, ShaderMaterial, Matrix4 } from "three";

import FusedChannelData from "./FusedChannelData";
import {
  rayMarchingVertexShaderSrc,
  rayMarchingFragmentShaderSrc,
  rayMarchingShaderUniforms,
} from "./constants/volumeRayMarchShader.js";

export default class RayMarchedAtlasVolume {
  constructor(volume) {
    // need?
    this.volume = volume;

    this.bounds = {
      bmin: new Vector3(-0.5, -0.5, -0.5),
      bmax: new Vector3(0.5, 0.5, 0.5),
    };

    this.cube = new BoxGeometry(1.0, 1.0, 1.0);
    this.cubeMesh = new Mesh(this.cube);
    this.cubeMesh.name = "Volume";

    this.cubeTransformNode = new Group();
    this.cubeTransformNode.name = "VolumeContainerNode";
    this.cubeTransformNode.add(this.cubeMesh);

    this.uniforms = rayMarchingShaderUniforms();

    // shader,vtx and frag.
    var vtxsrc = rayMarchingVertexShaderSrc;
    var fgmtsrc = rayMarchingFragmentShaderSrc;

    var threeMaterial = new ShaderMaterial({
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

  cleanup() {
    this.cube.dispose();
    this.cubeMesh.material.dispose();

    this.channelData.cleanup();
  }

  setVisible(isVisible) {
    this.cubeMesh.visible = isVisible;
  }

  doRender(canvas) {
    if (!this.cubeMesh.visible) {
      return;
    }

    this.cubeMesh.updateMatrixWorld(true);

    var mvm = new Matrix4();
    mvm.multiplyMatrices(canvas.camera.matrixWorldInverse, this.cubeMesh.matrixWorld);
    var mi = new Matrix4();
    mi.copy(mvm).invert();

    this.setUniform("inverseModelViewMatrix", mi, true, true);

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

  get3dObject() {
    return this.cubeTransformNode;
  }

  onChannelData(batch) {
    this.channelData.onChannelLoaded(batch, this.volume.channels);
  }

  setScale(scale) {
    this.scale = scale;

    this.cubeMesh.scale.copy(new Vector3(scale.x, scale.y, scale.z));
    this.setUniform("volumeScale", scale);
  }

  setRayStepSizes(primary, secondary) {}

  setTranslation(vec3xyz) {
    this.cubeMesh.position.copy(vec3xyz);
  }

  setRotation(eulerXYZ) {
    this.cubeTransformNode.rotation.copy(eulerXYZ);
  }

  setOrthoScale(value) {
    this.setUniform("orthoScale", value);
  }

  setResolution(x, y) {
    this.setUniform("iResolution", new Vector2(x, y));
  }

  setPixelSamplingRate(value) {}

  setDensity(density) {
    this.setUniform("DENSITY", density);
  }

  // TODO brightness and exposure should be the same thing?
  setBrightness(brightness) {
    this.setUniform("BRIGHTNESS", brightness * 2.0);
  }

  setIsOrtho(isOrthoAxis) {
    this.setUniform("isOrtho", isOrthoAxis ? 1.0 : 0.0);
    if (!isOrthoAxis) {
      this.setOrthoThickness(1.0);
    }
  }

  viewpointMoved() {}

  setGamma(gmin, glevel, gmax) {
    this.setUniform("GAMMA_MIN", gmin);
    this.setUniform("GAMMA_MAX", gmax);
    this.setUniform("GAMMA_SCALE", glevel);
  }

  setMaxProjectMode(isMaxProject) {
    this.setUniform("maxProject", isMaxProject ? 1 : 0);
  }

  setAxisClip(axis, minval, maxval, isOrthoAxis) {
    this.bounds.bmax[axis] = maxval;
    this.bounds.bmin[axis] = minval;

    if (isOrthoAxis) {
      const thicknessPct = maxval - minval;
      this.setOrthoThickness(thicknessPct);
    }
    else {
      // it is possible this is overly aggressive resetting this value here
      // but testing has shown no ill effects and it is better to have a definite
      // known value when in perspective mode
      this.setOrthoThickness(1.0);
    }

    this.setUniform("AABB_CLIP_MIN", this.bounds.bmin);
    this.setUniform("AABB_CLIP_MAX", this.bounds.bmax);
  }

  setFlipAxes(flipX, flipY, flipZ) {
    this.setUniform("flipVolume", new Vector3(flipX, flipY, flipZ));
  }

  // 0..1
  updateClipRegion(xmin, xmax, ymin, ymax, zmin, zmax) {
    this.bounds = {
      bmin: new Vector3(xmin - 0.5, ymin - 0.5, zmin - 0.5),
      bmax: new Vector3(xmax - 0.5, ymax - 0.5, zmax - 0.5),
    };
    this.setUniform("AABB_CLIP_MIN", this.bounds.bmin);
    this.setUniform("AABB_CLIP_MAX", this.bounds.bmax);
  }

  setChannelAsMask(channelIndex) {
    if (!this.volume.channels[channelIndex] || !this.volume.channels[channelIndex].loaded) {
      return false;
    }
    return this.channelData.setChannelAsMask(channelIndex, this.volume.channels[channelIndex]);
  }

  setMaskAlpha(maskAlpha) {
    this.setUniform("maskAlpha", maskAlpha);
  }

  setOrthoThickness(value) {
    this.setUniform("orthoThickness", value);
  }

  //////////////////////////////////////////
  //////////////////////////////////////////

  setUniform(name, value) {
    if (!this.uniforms[name]) {
      return;
    }
    this.uniforms[name].value = value;
    this.cubeMesh.material.needsUpdate = true;
  }

  // channelcolors is array of {rgbColor, lut} and channeldata is volume.channels
  fuse(channelcolors, channeldata) {
    //'m' for max or 'a' for avg
    var fusionType = "m";
    this.channelData.fuse(channelcolors, fusionType, channeldata);

    // update to fused texture
    this.setUniform("textureAtlas", this.channelData.fusedTexture);
    this.setUniform("textureAtlasMask", this.channelData.maskTexture);
  }
}

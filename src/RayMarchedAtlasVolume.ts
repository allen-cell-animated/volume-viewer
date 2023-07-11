import {
  Box3,
  Box3Helper,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  Color,
  Group,
  LineBasicMaterial,
  LineSegments,
  Material,
  Matrix4,
  Mesh,
  ShaderMaterial,
  ShapeGeometry,
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
import { VolumeRenderImpl } from "./VolumeRenderImpl";

import { FuseChannel } from "./types";
import {
  defaultVolumeRenderSettings,
  VolumeRenderSettingUtils,
  VolumeRenderSettings,
  SettingsFlags,
} from "./VolumeRenderSettings";

const BOUNDING_BOX_DEFAULT_COLOR = new Color(0xffff00);

export default class RayMarchedAtlasVolume implements VolumeRenderImpl {
  private settings: VolumeRenderSettings | undefined;
  public volume: Volume;

  private geometry: ShapeGeometry;
  private geometryMesh: Mesh<BufferGeometry, Material>;
  private boxHelper: Box3Helper;
  private tickMarksMesh: LineSegments;
  private geometryTransformNode: Group;
  private uniforms: ReturnType<typeof rayMarchingShaderUniforms>;
  private channelData: FusedChannelData;

  constructor(volume: Volume, settings?: VolumeRenderSettings) {
    // need?
    this.volume = volume;

    this.uniforms = rayMarchingShaderUniforms();
    [this.geometry, this.geometryMesh] = this.createGeometry(this.uniforms);

    this.boxHelper = new Box3Helper(
      new Box3(new Vector3(-0.5, -0.5, -0.5), new Vector3(0.5, 0.5, 0.5)),
      BOUNDING_BOX_DEFAULT_COLOR
    );
    this.boxHelper.updateMatrixWorld();
    this.boxHelper.visible = false;

    this.tickMarksMesh = this.createTickMarks();
    this.tickMarksMesh.updateMatrixWorld();
    this.tickMarksMesh.visible = false;

    this.geometryTransformNode = new Group();
    this.geometryTransformNode.name = "VolumeContainerNode";

    this.geometryTransformNode.add(this.boxHelper, this.tickMarksMesh, this.geometryMesh);

    this.setUniform("ATLAS_X", volume.imageInfo.cols);
    this.setUniform("ATLAS_Y", volume.imageInfo.rows);
    this.setUniform("textureRes", new Vector2(volume.imageInfo.atlas_width, volume.imageInfo.atlas_height));
    this.setUniform("SLICES", volume.z);

    this.channelData = new FusedChannelData(volume.imageInfo.atlas_width, volume.imageInfo.atlas_height);

    if (!settings) {
      settings = defaultVolumeRenderSettings();
      VolumeRenderSettingUtils.resizeWithVolume(settings, volume);
    }
    this.updateSettings(settings, SettingsFlags.ALL);
  }

  public viewpointMoved(): void {
    return;
  }

  public updateSettings(newSettings: VolumeRenderSettings, _dirtyFlags?: number | SettingsFlags) {
    if (_dirtyFlags === undefined) {
      _dirtyFlags = SettingsFlags.ALL;
    }

    this.settings = newSettings;

    if (_dirtyFlags & SettingsFlags.VIEW) {
      this.geometryMesh.visible = this.settings.visible;
      // Configure ortho
      this.setUniform("orthoScale", this.settings.orthoScale);
      this.setUniform("isOrtho", this.settings.isOrtho ? 1.0 : 0.0);
      // Ortho line thickness
      const axis = this.settings.viewAxis;
      if (this.settings.isOrtho && axis !== null) {
        // TODO: Does this code do any relevant changes?
        const maxVal = this.settings.bounds.bmax[axis];
        const minVal = this.settings.bounds.bmin[axis];
        const thicknessPct = maxVal - minVal;
        this.setUniform("orthoThickness", thicknessPct);
      } else {
        this.setUniform("orthoThickness", 1.0);
      }
    }

    if (_dirtyFlags & SettingsFlags.VIEW || _dirtyFlags & SettingsFlags.BOUNDING_BOX) {
      // Update tick marks with either view or bounding box changes
      this.tickMarksMesh.visible = this.settings.showBoundingBox && !this.settings.isOrtho;
      this.setUniform("maxProject", this.settings.maxProjectMode ? 1 : 0);
    }

    if (_dirtyFlags & SettingsFlags.BOUNDING_BOX) {
      // Configure bounding box
      this.boxHelper.visible = this.settings.showBoundingBox;
      const colorVector = this.settings.boundingBoxColor;
      const newBoxColor = new Color(colorVector[0], colorVector[1], colorVector[2]);
      (this.boxHelper.material as LineBasicMaterial).color = newBoxColor;
      (this.tickMarksMesh.material as LineBasicMaterial).color = newBoxColor;
    }

    if (_dirtyFlags & SettingsFlags.TRANSFORM) {
      // Set scale
      const scale = this.settings.scale;
      this.geometryMesh.scale.copy(scale);
      this.setUniform("volumeScale", scale);
      this.boxHelper.box.set(
        new Vector3(-0.5 * scale.x, -0.5 * scale.y, -0.5 * scale.z),
        new Vector3(0.5 * scale.x, 0.5 * scale.y, 0.5 * scale.z)
      );
      this.tickMarksMesh.scale.copy(scale);
      // Set rotation and translation
      this.geometryTransformNode.position.copy(this.settings.translation);
      this.geometryTransformNode.rotation.copy(this.settings.rotation);
      this.setUniform("flipVolume", this.settings.flipAxes);
    }

    if (_dirtyFlags & SettingsFlags.MATERIAL) {
      this.setUniform("DENSITY", this.settings.density);
    }

    if (_dirtyFlags & SettingsFlags.CAMERA) {
      // TODO brightness and exposure should be the same thing?
      this.setUniform("BRIGHTNESS", this.settings.brightness * 2.0);
      // Gamma
      this.setUniform("GAMMA_MIN", this.settings.gammaMin);
      this.setUniform("GAMMA_MAX", this.settings.gammaMax);
      this.setUniform("GAMMA_SCALE", this.settings.gammaLevel);
    }

    if (_dirtyFlags & SettingsFlags.ROI) {
      // Normalize and set bounds
      const bounds = this.settings.bounds;
      const boundsNormalized = {
        bmin: new Vector3(bounds.bmin.x * 2.0, bounds.bmin.y * 2.0, bounds.bmin.z * 2.0),
        bmax: new Vector3(bounds.bmax.x * 2.0, bounds.bmax.y * 2.0, bounds.bmax.z * 2.0),
      };
      this.setUniform("AABB_CLIP_MIN", boundsNormalized.bmin);
      this.setUniform("AABB_CLIP_MAX", boundsNormalized.bmax);
    }

    if (_dirtyFlags & SettingsFlags.SAMPLING) {
      this.setUniform("interpolationEnabled", this.settings.useInterpolation);
      this.setUniform("iResolution", this.settings.resolution);
    }

    if (_dirtyFlags & SettingsFlags.MASK) {
      this.setUniform("maskAlpha", this.settings.maskAlpha);
      this.setUniform("maskAlpha", this.settings.maskAlpha);
    }
  }

  /**
   * Creates the geometry mesh and material for rendering the volume.
   * @param uniforms object containing uniforms to pass to the shader material.
   * @returns the new geometry and geometry mesh.
   */
  private createGeometry(
    uniforms: ReturnType<typeof rayMarchingShaderUniforms>
  ): [ShapeGeometry, Mesh<BufferGeometry, Material>] {
    const geom = new BoxGeometry(1.0, 1.0, 1.0);
    const mesh: Mesh<BufferGeometry, Material> = new Mesh(geom);
    mesh.name = "Volume";

    // shader,vtx and frag.
    const vtxsrc = rayMarchingVertexShaderSrc;
    const fgmtsrc = rayMarchingFragmentShaderSrc;

    const threeMaterial = new ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vtxsrc,
      fragmentShader: fgmtsrc,
      transparent: true,
      depthTest: true,
      depthWrite: false,
    });

    mesh.material = threeMaterial;
    return [geom, mesh];
  }

  private createTickMarks(): LineSegments {
    // Length of tick mark lines in world units
    const TICK_LENGTH = 0.025;
    const { tickMarkPhysicalLength, physicalScale, normalizedPhysicalSize } = this.volume;
    const numTickMarks = physicalScale / tickMarkPhysicalLength;

    const vertices: number[] = [];

    const tickEndY = TICK_LENGTH / normalizedPhysicalSize.y + 0.5;
    const tickSpacingX = 1 / (normalizedPhysicalSize.x * numTickMarks);
    for (let x = -0.5; x <= 0.5; x += tickSpacingX) {
      // prettier-ignore
      vertices.push(
        x, 0.5,       0.5,
        x, tickEndY,  0.5,

        x, -0.5,      -0.5,
        x, -tickEndY, -0.5,

        x, 0.5,       -0.5,
        x, tickEndY,  -0.5,

        x, -0.5,      0.5,
        x, -tickEndY, 0.5,
      );
    }

    const tickEndX = TICK_LENGTH / normalizedPhysicalSize.x + 0.5;
    const tickSpacingY = 1 / (normalizedPhysicalSize.y * numTickMarks);
    for (let y = 0.5; y >= -0.5; y -= tickSpacingY) {
      // prettier-ignore
      vertices.push(
        -0.5,      y, 0.5,
        -tickEndX, y, 0.5,

        -0.5,      y, -0.5,
        -tickEndX, y, -0.5,

        0.5,       y, -0.5,
        tickEndX,  y, -0.5,

        0.5,       y, 0.5,
        tickEndX,  y, 0.5,
      );
    }

    const tickSpacingZ = 1 / (normalizedPhysicalSize.z * numTickMarks);
    for (let z = 0.5; z >= -0.5; z -= tickSpacingZ) {
      // prettier-ignore
      vertices.push(
        -0.5,      0.5,  z,
        -tickEndX, 0.5,  z,

        -0.5,      -0.5, z,
        -tickEndX, -0.5, z,

        0.5,       -0.5, z,
        tickEndX,  -0.5, z,

        0.5,       0.5,  z,
        tickEndX,  0.5,  z,
      );
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(new Float32Array(vertices), 3));
    return new LineSegments(geometry, new LineBasicMaterial({ color: BOUNDING_BOX_DEFAULT_COLOR }));
  }

  public cleanup(): void {
    this.geometry.dispose();
    this.geometryMesh.material.dispose();

    this.channelData.cleanup();
  }

  public doRender(canvas: ThreeJsPanel): void {
    if (!this.geometryMesh.visible) {
      return;
    }

    this.channelData.gpuFuse(canvas.renderer);
    this.setUniform("textureAtlas", this.channelData.getFusedTexture());

    this.geometryTransformNode.updateMatrixWorld(true);

    const mvm = new Matrix4();
    mvm.multiplyMatrices(canvas.camera.matrixWorldInverse, this.geometryMesh.matrixWorld);
    const mi = new Matrix4();
    mi.copy(mvm).invert();

    this.setUniform("inverseModelViewMatrix", mi);
  }

  public get3dObject(): Group {
    return this.geometryTransformNode;
  }

  //////////////////////////////////////////
  //////////////////////////////////////////

  private setUniform<U extends keyof ReturnType<typeof rayMarchingShaderUniforms>>(
    name: U,
    value: ReturnType<typeof rayMarchingShaderUniforms>[U]["value"]
  ) {
    if (!this.uniforms[name]) {
      return;
    }
    this.uniforms[name].value = value;
    this.geometryMesh.material.needsUpdate = true;
  }

  // channelcolors is array of {rgbColor, lut} and channeldata is volume.channels
  public updateActiveChannels(channelcolors: FuseChannel[], channeldata: Channel[]): void {
    this.channelData.fuse(channelcolors, channeldata);

    // update to fused texture
    this.setUniform("textureAtlas", this.channelData.getFusedTexture());
    this.setUniform("textureAtlasMask", this.channelData.maskTexture);
  }

  public setRenderUpdateListener(_listener?: ((iteration: number) => void) | undefined) {
    return;
  }
}

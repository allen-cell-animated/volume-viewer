import {
  Box3,
  Box3Helper,
  BufferGeometry,
  Color,
  Group,
  LineBasicMaterial,
  Material,
  Matrix4,
  Mesh,
  PlaneGeometry,
  ShaderMaterial,
  ShapeGeometry,
  Vector2,
  Vector3,
} from "three";
import { Channel, Volume } from ".";
import { sliceFragmentShaderSrc, sliceShaderUniforms, sliceVertexShaderSrc } from "./constants/volumeSliceShader";
import { VolumeRenderImpl } from "./VolumeRenderImpl";
import { SettingsFlags, VolumeRenderSettings } from "./VolumeRenderSettings";
import FusedChannelData from "./FusedChannelData";
import { FuseChannel } from "./types";
import { ThreeJsPanel } from "./ThreeJsPanel";

const BOUNDING_BOX_DEFAULT_COLOR = new Color(0xffff00);

/**
 * Creates a plane that renders a 2D XY slice of volume atlas data.
 */
export default class Atlas2DSlice implements VolumeRenderImpl {
  private settings: VolumeRenderSettings | undefined;
  public volume: Volume;
  private geometry: ShapeGeometry;
  protected geometryMesh: Mesh<BufferGeometry, Material>;
  private geometryTransformNode: Group;
  private boxHelper: Box3Helper;
  private uniforms: ReturnType<typeof sliceShaderUniforms>;
  private channelData: FusedChannelData;

  /**
   * Creates a new Atlas2DSlice.
   * @param volume The volume that this renderer should render data from.
   * @param settings Optional settings object. If set, updates the renderer with
   * the given settings. Otherwise, uses the default VolumeRenderSettings.
   */
  constructor(volume: Volume, settings: VolumeRenderSettings = new VolumeRenderSettings(volume)) {
    this.volume = volume;
    this.uniforms = sliceShaderUniforms();
    [this.geometry, this.geometryMesh] = this.createGeometry(this.uniforms);

    this.boxHelper = new Box3Helper(
      new Box3(new Vector3(-0.5, -0.5, -0.5), new Vector3(0.5, 0.5, 0.5)),
      BOUNDING_BOX_DEFAULT_COLOR
    );
    this.boxHelper.updateMatrixWorld();
    this.boxHelper.visible = false;

    this.geometryTransformNode = new Group();
    this.geometryTransformNode.name = "VolumeContainerNode";

    this.geometryTransformNode.add(this.boxHelper, this.geometryMesh);

    /* eslint-disable @typescript-eslint/naming-convention */
    const { cols, rows, tile_width, tile_height, tiles } = volume.imageInfo;
    const {
      vol_size_x = tile_width,
      vol_size_y = tile_height,
      vol_size_z = tiles,
      offset_x = 0,
      offset_y = 0,
      offset_z = 0,
    } = volume.imageInfo;
    /* eslint-enable @typescript-eslint/naming-convention */
    const atlasWidth = tile_width * cols;
    const atlasHeight = tile_height * rows;

    this.setUniform("ATLAS_X", cols);
    this.setUniform("ATLAS_Y", rows);
    this.setUniform("textureRes", new Vector2(atlasWidth, atlasHeight));
    this.setUniform("SLICES", volume.z);
    this.setUniform("SUBSET_SCALE", new Vector3(tile_width / vol_size_x, tile_height / vol_size_y, tiles / vol_size_z));
    this.setUniform("SUBSET_OFFSET", new Vector3(offset_x / vol_size_x, offset_y / vol_size_y, offset_z / vol_size_z));
    this.setUniform("Z_SLICE", Math.floor(volume.z / 2));

    this.channelData = new FusedChannelData(atlasWidth, atlasHeight);
    this.updateSettings(settings, SettingsFlags.ALL);
  }

  public updateSettings(newSettings: VolumeRenderSettings, dirtyFlags?: number | SettingsFlags) {
    if (dirtyFlags === undefined) {
      dirtyFlags = SettingsFlags.ALL;
    }

    this.settings = newSettings;

    if (dirtyFlags & SettingsFlags.VIEW) {
      this.geometryMesh.visible = this.settings.visible;
      // Configure ortho
      this.setUniform("orthoScale", this.settings.orthoScale);
      this.setUniform("isOrtho", this.settings.isOrtho ? 1.0 : 0.0);
      // Ortho line thickness
      const axis = this.settings.viewAxis;
      if (this.settings.isOrtho && axis !== null) {
        const maxVal = this.settings.bounds.bmax[axis];
        const minVal = this.settings.bounds.bmin[axis];
        const thicknessPct = maxVal - minVal;
        this.setUniform("orthoThickness", thicknessPct);
      } else {
        this.setUniform("orthoThickness", 1.0);
      }
    }

    if (dirtyFlags & SettingsFlags.BOUNDING_BOX) {
      // Configure bounding box
      this.boxHelper.visible = this.settings.showBoundingBox;
      const colorVector = this.settings.boundingBoxColor;
      const newBoxColor = new Color(colorVector[0], colorVector[1], colorVector[2]);
      (this.boxHelper.material as LineBasicMaterial).color = newBoxColor;
    }

    if (dirtyFlags & SettingsFlags.TRANSFORM) {
      // Set scale
      const scale = this.settings.scale;
      this.geometryMesh.scale.copy(scale);
      this.setUniform("volumeScale", scale);
      this.boxHelper.box.set(
        new Vector3(-0.5 * scale.x, -0.5 * scale.y, -0.5 * scale.z),
        new Vector3(0.5 * scale.x, 0.5 * scale.y, 0.5 * scale.z)
      );
      // Set rotation and translation
      this.geometryTransformNode.position.copy(this.settings.translation);
      this.geometryTransformNode.rotation.copy(this.settings.rotation);
      this.setUniform("flipVolume", this.settings.flipAxes);
    }

    if (dirtyFlags & SettingsFlags.MATERIAL) {
      this.setUniform("DENSITY", this.settings.density);
    }

    if (dirtyFlags & SettingsFlags.CAMERA) {
      this.setUniform("BRIGHTNESS", this.settings.brightness * 2.0);
      // Gamma
      this.setUniform("GAMMA_MIN", this.settings.gammaMin);
      this.setUniform("GAMMA_MAX", this.settings.gammaMax);
      this.setUniform("GAMMA_SCALE", this.settings.gammaLevel);
    }

    if (dirtyFlags & SettingsFlags.ROI) {
      // Normalize and set bounds
      const bounds = this.settings.bounds;
      const boundsNormalized = {
        bmin: new Vector3(bounds.bmin.x * 2.0, bounds.bmin.y * 2.0, bounds.bmin.z * 2.0),
        bmax: new Vector3(bounds.bmax.x * 2.0, bounds.bmax.y * 2.0, bounds.bmax.z * 2.0),
      };
      this.setUniform("AABB_CLIP_MIN", boundsNormalized.bmin);
      this.setUniform("AABB_CLIP_MAX", boundsNormalized.bmax);
      const slice = Math.floor(this.settings.zSlice);
      if (slice >= 0 && slice <= this.volume.z - 1) {
        this.setUniform("Z_SLICE", slice);
      }
    }

    if (dirtyFlags & SettingsFlags.SAMPLING) {
      this.setUniform("interpolationEnabled", this.settings.useInterpolation);
      this.setUniform("iResolution", this.settings.resolution);
    }

    if (dirtyFlags & SettingsFlags.MASK) {
      this.setUniform("maskAlpha", this.settings.maskAlpha);
      this.setUniform("maskAlpha", this.settings.maskAlpha);
    }
  }

  private createGeometry(
    uniforms: ReturnType<typeof sliceShaderUniforms>
  ): [ShapeGeometry, Mesh<BufferGeometry, Material>] {
    const geom = new PlaneGeometry(1.0, 1.0);
    const mesh: Mesh<BufferGeometry, Material> = new Mesh(geom);
    mesh.name = "Plane";

    // shader,vtx and frag.
    const vtxsrc = sliceVertexShaderSrc;
    const fgmtsrc = sliceFragmentShaderSrc;

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

  public cleanup(): void {
    this.geometry.dispose();
    this.geometryMesh.material.dispose();

    this.channelData.cleanup();
  }

  public viewpointMoved(): void {
    return;
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

  // channelcolors is array of {rgbColor, lut} and channeldata is volume.channels
  public updateActiveChannels(channelcolors: FuseChannel[], channeldata: Channel[]): void {
    this.channelData.fuse(channelcolors, channeldata);

    // update to fused texture
    this.setUniform("textureAtlas", this.channelData.getFusedTexture());
    this.setUniform("textureAtlasMask", this.channelData.maskTexture);
  }

  private setUniform<U extends keyof ReturnType<typeof sliceShaderUniforms>>(
    name: U,
    value: ReturnType<typeof sliceShaderUniforms>[U]["value"]
  ) {
    if (!this.uniforms[name]) {
      return;
    }
    this.uniforms[name].value = value;
    this.geometryMesh.material.needsUpdate = true;
  }

  public setRenderUpdateListener(_listener?: ((iteration: number) => void) | undefined) {
    return;
  }
}

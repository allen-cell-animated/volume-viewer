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
  private settings: VolumeRenderSettings;
  public volume: Volume;
  private geometry: ShapeGeometry;
  protected geometryMesh: Mesh<BufferGeometry, Material>;
  private geometryTransformNode: Group;
  private boxHelper: Box3Helper;
  private uniforms: ReturnType<typeof sliceShaderUniforms>;
  private channelData!: FusedChannelData;
  private sliceUpdateWaiting = false;

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

    this.setUniform("Z_SLICE", Math.floor(volume.imageInfo.volumeSize.z / 2));
    this.updateVolumeDimensions();
    this.settings = settings;
    this.updateSettings(settings, SettingsFlags.ALL);
  }

  /**
   * Syncs `this.settings.zSlice` with the corresponding shader uniform, or defers syncing until the slice is loaded.
   * @returns a boolean indicating whether the slice is out of bounds of the volume entirely.
   */
  private updateSlice(): boolean {
    const slice = Math.floor(this.settings.zSlice);
    const sizez = this.volume.imageInfo.volumeSize.z;
    if (slice < 0 || slice >= sizez) {
      return false;
    }

    const regionMinZ = this.volume.imageInfo.subregionOffset.z;
    const regionMaxZ = regionMinZ + this.volume.imageInfo.subregionSize.z;
    if (slice < regionMinZ || slice >= regionMaxZ) {
      // If the slice is outside the current loaded subregion, defer until the subregion is updated
      this.sliceUpdateWaiting = true;
    } else {
      this.setUniform("Z_SLICE", slice);
      this.sliceUpdateWaiting = false;
    }

    return true;
  }

  public updateVolumeDimensions(): void {
    const scale = this.volume.normPhysicalSize;
    // set scale
    this.geometryMesh.scale.copy(scale);
    this.setUniform("volumeScale", scale);
    this.boxHelper.box.set(scale.clone().multiplyScalar(-0.5), scale.clone().multiplyScalar(0.5));

    const { atlasTileDims, subregionSize, volumeSize } = this.volume.imageInfo;
    const atlasSize = new Vector2(subregionSize.x, subregionSize.y).multiply(atlasTileDims);

    // set lots of dimension uniforms
    this.setUniform("ATLAS_DIMS", atlasTileDims);
    this.setUniform("textureRes", atlasSize);
    this.setUniform("SLICES", volumeSize.z);
    this.setUniform("SUBSET_SCALE", this.volume.normRegionSize);
    this.setUniform("SUBSET_OFFSET", this.volume.normRegionOffset);
    if (this.sliceUpdateWaiting) {
      this.updateSlice();
    }

    // (re)create channel data
    if (!this.channelData || this.channelData.width !== atlasSize.x || this.channelData.height !== atlasSize.y) {
      this.channelData?.cleanup();
      this.channelData = new FusedChannelData(atlasSize.x, atlasSize.y);
    }
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

      this.setUniform("AABB_CLIP_MIN", bounds.bmin);
      this.setUniform("AABB_CLIP_MAX", bounds.bmax);

      const sliceInBounds = this.updateSlice();
      if (sliceInBounds) {
        const sliceRatio = Math.floor(this.settings.zSlice) / this.volume.imageInfo.volumeSize.z;
        this.volume.updateRequiredData(
          {
            subregion: new Box3(new Vector3(0, 0, sliceRatio), new Vector3(1, 1, sliceRatio)),
          },
          false
        );
      }
    }

    if (dirtyFlags & SettingsFlags.SAMPLING) {
      this.setUniform("interpolationEnabled", this.settings.useInterpolation);
      this.setUniform("iResolution", this.settings.resolution);
    }

    if (dirtyFlags & SettingsFlags.MASK_ALPHA) {
      this.setUniform("maskAlpha", this.settings.maskChannelIndex < 0 ? 1.0 : this.settings.maskAlpha);
    }
    if (dirtyFlags & SettingsFlags.MASK_DATA) {
      this.channelData.setChannelAsMask(
        this.settings.maskChannelIndex,
        this.volume.getChannel(this.settings.maskChannelIndex)
      );
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
    this.setUniform("textureAtlasMask", this.channelData.maskTexture);

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
  }

  public setRenderUpdateListener(_listener?: ((iteration: number) => void) | undefined) {
    return;
  }
}

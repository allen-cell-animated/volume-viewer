import { Vector3, Object3D, Euler, Vector2 } from "three";

import MeshVolume from "./MeshVolume";
import RayMarchedAtlasVolume from "./RayMarchedAtlasVolume";
import PathTracedVolume from "./PathTracedVolume";
import { LUT_ARRAY_LENGTH } from "./Histogram";
import Volume from "./Volume";
import { VolumeDisplayOptions, VolumeChannelDisplayOptions } from "./types";
import { FuseChannel } from "./types";
import { ThreeJsPanel } from "./ThreeJsPanel";
import { Light } from "./Light";
import Channel from "./Channel";
import { VolumeRenderImpl } from "./VolumeRenderImpl";
import { Pane } from "tweakpane";
import Atlas2DSlice from "./Atlas2DSlice";
import { VolumeRenderSettings, defaultVolumeRenderSettings, VolumeRenderSettingUtils, SettingsFlags } from "./VolumeRenderSettings";

type ColorArray = [number, number, number];
type ColorObject = { r: number; g: number; b: number };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithObjectColors<T extends Record<string, any>> = {
  [K in keyof T]: T[K] extends ColorArray | undefined ? ColorObject : T[K];
};

export const colorArrayToObject = ([r, g, b]: ColorArray): ColorObject => ({ r, g, b });
export const colorObjectToArray = ({ r, g, b }: ColorObject): ColorArray => [r, g, b];

// A renderable multichannel volume image with 8-bits per channel intensity values.
export default class VolumeDrawable {
  public PT: boolean;
  public volume: Volume;
  private settings: VolumeRenderSettings;
  private onChannelDataReadyCallback?: () => void;
  private viewMode: string;
  private channelColors: [number, number, number][];
  private channelOptions: VolumeChannelDisplayOptions[];
  private fusion: FuseChannel[];
  public sceneRoot: Object3D;
  private meshVolume: MeshVolume;

  // these should never coexist simultaneously. always one or the other is present
  // this is a remnant of a pre-typescript world
  private pathTracedVolume?: PathTracedVolume;
  private rayMarchedAtlasVolume?: RayMarchedAtlasVolume;
  private atlas2DSlice?: Atlas2DSlice;

  private volumeRendering: VolumeRenderImpl;

  private renderUpdateListener?: (iteration: number) => void;

  constructor(volume: Volume, options: VolumeDisplayOptions) {
    this.PT = !!options.renderMode;

    // THE VOLUME DATA
    this.volume = volume;
    this.settings = defaultVolumeRenderSettings();
    VolumeRenderSettingUtils.updateWithVolume(this.settings, volume);

    this.onChannelDataReadyCallback = undefined;

    // TODO: Replace with enum
    this.viewMode = "3D";

    this.channelColors = this.volume.channel_colors_default.slice();

    this.channelOptions = new Array<VolumeChannelDisplayOptions>(this.volume.num_channels).fill({});

    this.fusion = this.channelColors.map((col, index) => {
      let rgbColor: number | [number, number, number];
      // take copy of original channel color
      if (col[0] === 0 && col[1] === 0 && col[2] === 0) {
        rgbColor = 0;
      } else {
        rgbColor = [col[0], col[1], col[2]];
      }
      return {
        chIndex: index,
        lut: new Uint8Array(LUT_ARRAY_LENGTH),
        rgbColor: rgbColor,
      };
    });

    this.sceneRoot = new Object3D(); //create an empty container

    this.meshVolume = new MeshVolume(this.volume);

    if (this.PT) {
      this.pathTracedVolume = new PathTracedVolume(this.volume, this.settings);
      this.volumeRendering = this.pathTracedVolume;
    } else {
      this.rayMarchedAtlasVolume = new RayMarchedAtlasVolume(this.volume, this.settings);
      this.volumeRendering = this.rayMarchedAtlasVolume;
    }

    // draw meshes first, and volume last, for blending and depth test reasons with raymarch
    !this.PT && this.sceneRoot.add(this.meshVolume.get3dObject());
    this.sceneRoot.add(this.volumeRendering.get3dObject());
    // draw meshes last (as overlay) for pathtrace? (or not at all?)
    //this.PT && this.sceneRoot.add(this.meshVolume.get3dObject());

    this.sceneRoot.position.set(0, 0, 0);

    this.setScale(this.volume.scale);

    // apply the volume's default transformation
    this.settings.translation = new Vector3().fromArray(this.volume.getTranslation());
    this.settings.rotation = new Euler().fromArray(this.volume.getRotation());

    this.setOptions(options);
    // this.volumeRendering.setZSlice(this.zSlice);
  }

  setOptions(options: VolumeDisplayOptions): void {
    options = options || {};
    if (options.maskChannelIndex !== undefined) {
      this.setChannelAsMask(options.maskChannelIndex);
    }
    if (options.maskAlpha !== undefined) {
      this.setMaskAlpha(options.maskAlpha);
    }
    if (options.clipBounds !== undefined) {
      this.settings.bounds = {
        bmin: new Vector3(options.clipBounds[0], options.clipBounds[2], options.clipBounds[4]),
        bmax: new Vector3(options.clipBounds[1], options.clipBounds[3], options.clipBounds[5]),
      };
      // note: dropping isOrthoAxis argument
      this.setAxisClip("x", options.clipBounds[0], options.clipBounds[1]);
      this.setAxisClip("y", options.clipBounds[2], options.clipBounds[3]);
      this.setAxisClip("z", options.clipBounds[4], options.clipBounds[5]);
    }
    if (options.scale !== undefined) {
      this.setScale(new Vector3().fromArray(options.scale));
    }
    if (options.translation !== undefined) {
      this.setTranslation(new Vector3().fromArray(options.translation));
    }
    if (options.rotation !== undefined) {
      this.setRotation(new Euler().fromArray(options.rotation));
    }

    if (options.renderMode !== undefined) {
      this.setVolumeRendering(!!options.renderMode);
    }
    if (options.primaryRayStepSize !== undefined || options.secondaryRayStepSize !== undefined) {
      this.setRayStepSizes(options.primaryRayStepSize, options.secondaryRayStepSize);
    }
    if (options.showBoundingBox !== undefined) {
      this.setShowBoundingBox(options.showBoundingBox);
    }
    if (options.boundingBoxColor !== undefined) {
      this.setBoundingBoxColor(options.boundingBoxColor);
    }

    if (options.channels !== undefined) {
      // store channel options here!
      this.channelOptions = options.channels;
      this.channelOptions.forEach((channelOptions, channelIndex) => {
        this.setChannelOptions(channelIndex, channelOptions);
      });
    }
  }

  setChannelOptions(channelIndex: number, options: VolumeChannelDisplayOptions): void {
    // merge to current channel options
    this.channelOptions[channelIndex] = Object.assign(this.channelOptions[channelIndex], options);

    if (options.enabled !== undefined) {
      this.setVolumeChannelEnabled(channelIndex, options.enabled);
    }
    if (options.color !== undefined) {
      this.updateChannelColor(channelIndex, options.color);
    }
    if (options.isosurfaceEnabled !== undefined) {
      const hasIso = this.hasIsosurface(channelIndex);
      if (hasIso !== options.isosurfaceEnabled) {
        if (hasIso && !options.isosurfaceEnabled) {
          this.destroyIsosurface(channelIndex);
        } else if (!hasIso && options.isosurfaceEnabled) {
          // 127 is half of the intensity range 0..255
          let isovalue = 127;
          if (options.isovalue !== undefined) {
            isovalue = options.isovalue;
          }
          // 1.0 is fully opaque
          let isosurfaceOpacity = 1.0;
          if (options.isosurfaceOpacity !== undefined) {
            isosurfaceOpacity = options.isosurfaceOpacity;
          }
          this.createIsosurface(channelIndex, isovalue, isosurfaceOpacity, isosurfaceOpacity < 1.0);
        }
      } else if (options.isosurfaceEnabled) {
        if (options.isovalue !== undefined) {
          this.updateIsovalue(channelIndex, options.isovalue);
        }
        if (options.isosurfaceOpacity !== undefined) {
          this.updateOpacity(channelIndex, options.isosurfaceOpacity);
        }
      }
    } else {
      if (options.isovalue !== undefined) {
        this.updateIsovalue(channelIndex, options.isovalue);
      }
      if (options.isosurfaceOpacity !== undefined) {
        this.updateOpacity(channelIndex, options.isosurfaceOpacity);
      }
    }
  }

  setRayStepSizes(primary?: number, secondary?: number): void {
    if (primary !== undefined) {
      this.settings.primaryRayStepSize = primary;
    }
    if (secondary !== undefined) {
      this.settings.secondaryRayStepSize = secondary;
    }
    this.volumeRendering.updateSettings(this.settings, SettingsFlags.RESOLUTION_AND_SAMPLING);
  }

  setScale(scale: Vector3): void {
    if (this.settings.scale === scale) {
      return;
    }
    this.settings.scale = scale;
    this.settings.currentScale = scale.clone();
    this.meshVolume.setScale(scale);
    this.volumeRendering.updateSettings(this.settings, SettingsFlags.TRANSFORM);
  }

  setOrthoScale(value: number): void {
    this.settings.orthoScale = value;
    this.volumeRendering.updateSettings(this.settings, SettingsFlags.VIEW);
  }

  setResolution(viewObj: ThreeJsPanel): void {
    const x = viewObj.getWidth();
    const y = viewObj.getHeight();
    this.meshVolume.setResolution(x, y);
    this.settings.resolution = new Vector2(x, y);
    this.volumeRendering.updateSettings(this.settings, SettingsFlags.RESOLUTION_AND_SAMPLING);
  }

  // Set clipping range (between -0.5 and 0.5) for a given axis.
  // Calling this allows the rendering to compensate for changes in thickness in orthographic views that affect how bright the volume is.
  // @param {number} axis 0, 1, or 2 for x, y, or z axis
  // @param {number} minval -0.5..0.5, should be less than maxval
  // @param {number} maxval -0.5..0.5, should be greater than minval
  // @param {boolean} isOrthoAxis is this an orthographic projection or just a clipping of the range for perspective view
  setAxisClip(axis: "x" | "y" | "z", minval: number, maxval: number, isOrthoAxis?: boolean): void {
    this.settings.bounds.bmax[axis] = maxval;
    this.settings.bounds.bmin[axis] = minval;
    this.settings.orthoAxis = axis;
    this.settings.isOrtho = isOrthoAxis || false;

    !this.PT && this.meshVolume.setAxisClip(axis, minval, maxval, !!isOrthoAxis);
    this.volumeRendering.updateSettings(this.settings, SettingsFlags.ROI | SettingsFlags.VIEW);
  }

  // TODO: Change mode to an enum
  /**
   * Sets the camera mode of the VolumeDrawable.
   * @param mode Mode can be "3D", or "XY" or "Z", or "YZ" or "X", or "XZ" or "Y".
   */
  setViewMode(mode: string): void {
    this.viewMode = mode;
    if (mode === "XY" || mode === "Z") {
      // If currently in 3D raymarch mode, hotswap the 2D slice
      if (this.rayMarchedAtlasVolume && !this.atlas2DSlice) {
        this.setVolumeRendering(false);
      }
    } else {
      // If in 2D slice mode, switch back to 3D raymarch mode
      if (!this.rayMarchedAtlasVolume && this.atlas2DSlice) {
        this.setVolumeRendering(false);
      }
    }
  }

  // Tell this image that it needs to be drawn in an orthographic mode
  // @param {boolean} isOrtho is this an orthographic projection or a perspective view
  setIsOrtho(isOrtho: boolean): void {
    this.settings.isOrtho = isOrtho;
    this.volumeRendering.updateSettings(this.settings, SettingsFlags.VIEW);
  }

  setInterpolationEnabled(active: boolean): void {
    this.settings.useInterpolation = active;
    this.volumeRendering.updateSettings(this.settings, SettingsFlags.RESOLUTION_AND_SAMPLING);
  }

  setOrthoThickness(value: number): void {
    !this.PT && this.meshVolume.setOrthoThickness(value);
    // No settings update because ortho thickness is calculated in the renderer
  }

  // Set parameters for gamma curve for volume rendering.
  // @param {number} gmin 0..1
  // @param {number} glevel 0..1
  // @param {number} gmax 0..1, should be > gmin
  setGamma(gmin: number, glevel: number, gmax: number): void {
    this.settings.gammaMin = gmin;
    this.settings.gammaLevel = glevel;
    this.settings.gammaMax = gmax;
    this.volumeRendering.updateSettings(this.settings, SettingsFlags.CAMERA);
  }

  setFlipAxes(flipX: number, flipY: number, flipZ: number): void {
    this.settings.flipAxes = new Vector3(flipX, flipY, flipZ);
    this.meshVolume.setFlipAxes(flipX, flipY, flipZ);
    this.volumeRendering.updateSettings(this.settings, SettingsFlags.TRANSFORM);
  }

  setMaxProjectMode(isMaxProject: boolean): void {
    !this.PT && this.rayMarchedAtlasVolume && this.rayMarchedAtlasVolume.setMaxProjectMode(isMaxProject);
  }

  onAnimate(canvas: ThreeJsPanel): void {
    // TODO: this is inefficient, as this work is duplicated by threejs.
    // we need camera matrix up to date before giving the 3d objects a chance to use it.
    canvas.camera.updateMatrixWorld(true);

    canvas.camera.matrixWorldInverse.copy(canvas.camera.matrixWorld).invert();

    // TODO confirm sequence
    this.volumeRendering.doRender(canvas);
    !this.PT && this.meshVolume.doRender(canvas);
  }

  // If an isosurface exists, update its isovalue and regenerate the surface. Otherwise do nothing.
  updateIsovalue(channel: number, value: number): void {
    this.meshVolume.updateIsovalue(channel, value);
  }

  getIsovalue(channel: number): number | undefined {
    return this.meshVolume.getIsovalue(channel);
  }

  // Set opacity for isosurface
  updateOpacity(channel: number, value: number): void {
    this.meshVolume.updateOpacity(channel, value);
  }

  hasIsosurface(channel: number): boolean {
    return this.meshVolume.hasIsosurface(channel);
  }

  // If an isosurface is not already created, then create one.  Otherwise do nothing.
  createIsosurface(channel: number, value: number, alpha: number, transp: boolean): void {
    this.meshVolume.createIsosurface(channel, this.channelColors[channel], value, alpha, transp);
  }

  // If an isosurface exists for this channel, destroy it now. Don't just hide it - assume we can free up some resources.
  destroyIsosurface(channel: number): void {
    this.meshVolume.destroyIsosurface(channel);
  }

  fuse(): void {
    if (!this.volume) {
      return;
    }
    this.volumeRendering.updateActiveChannels(this.fusion, this.volume.channels);
  }

  setRenderUpdateListener(callback?: (iteration: number) => void): void {
    this.renderUpdateListener = callback;
    if (this.PT && this.pathTracedVolume) {
      this.pathTracedVolume.setRenderUpdateListener(callback);
    }
  }

  updateShadingMethod(isbrdf: boolean): void {
    if (this.PT && this.pathTracedVolume) {
      this.pathTracedVolume.updateShadingMethod(isbrdf ? 1 : 0);
    }
  }

  updateMaterial(): void {
    //this.PT && this.pathTracedVolume && this.pathTracedVolume.updateMaterial(this);
    this.volumeRendering.updateActiveChannels(this.fusion, this.volume.channels);
  }

  updateLuts(): void {
    // this.PT && this.pathTracedVolume && this.pathTracedVolume.updateLuts(this);
    this.volumeRendering.updateActiveChannels(this.fusion, this.volume.channels);
  }

  setVoxelSize(values: number[]): void {
    this.volume.setVoxelSize(values);
    this.setScale(this.volume.scale);
  }

  cleanup(): void {
    this.meshVolume.cleanup();
    this.volumeRendering.cleanup();
  }

  getChannel(channelIndex: number): Channel {
    return this.volume.getChannel(channelIndex);
  }

  onChannelLoaded(batch: number[]): void {
    // this.volumeRendering.onChannelData(batch);
    this.meshVolume.onChannelData(batch);

    for (let j = 0; j < batch.length; ++j) {
      const idx = batch[j];
      this.setChannelOptions(idx, this.channelOptions[idx]);
    }

    // let the outside world have a chance
    if (this.onChannelDataReadyCallback) {
      this.onChannelDataReadyCallback();
    }
  }

  onChannelAdded(newChannelIndex: number): void {
    this.channelColors[newChannelIndex] = this.volume.channel_colors_default[newChannelIndex];

    this.fusion[newChannelIndex] = {
      chIndex: newChannelIndex,
      lut: new Uint8Array[LUT_ARRAY_LENGTH](),
      rgbColor: [
        this.channelColors[newChannelIndex][0],
        this.channelColors[newChannelIndex][1],
        this.channelColors[newChannelIndex][2],
      ],
    };

    this.settings.specular[newChannelIndex] = [0, 0, 0];
    this.settings.emissive[newChannelIndex] = [0, 0, 0];
    this.settings.glossiness[newChannelIndex] = 0;
  }

  // Save a channel's isosurface as a triangle mesh to either STL or GLTF2 format.  File will be named automatically, using image name and channel name.
  // @param {string} type Either 'GLTF' or 'STL'
  saveChannelIsosurface(channelIndex: number, type: string): void {
    this.meshVolume.saveChannelIsosurface(channelIndex, type, this.volume.name);
  }

  // Hide or display volume data for a channel
  setVolumeChannelEnabled(channelIndex: number, enabled: boolean): void {
    // flip the color to the "null" value
    this.fusion[channelIndex].rgbColor = enabled ? this.channelColors[channelIndex] : 0;
    // if all are nulled out, then hide the volume element from the scene.
    if (this.fusion.every((elem) => elem.rgbColor === 0)) {
      this.settings.visible = false;
    } else {
      this.settings.visible = true;
    }
    this.volumeRendering.updateSettings(this.settings, SettingsFlags.VIEW);
  }

  isVolumeChannelEnabled(channelIndex: number): boolean {
    // the zero value for the fusion rgbColor is the indicator that a channel is hidden.
    return this.fusion[channelIndex].rgbColor !== 0;
  }

  // Set the color for a channel
  // @param {Array.<number>} colorrgb [r,g,b]
  updateChannelColor(channelIndex: number, colorrgb: [number, number, number]): void {
    if (!this.channelColors[channelIndex]) {
      return;
    }
    this.channelColors[channelIndex] = colorrgb;
    // if volume channel is zero'ed out, then don't update it until it is switched on again.
    if (this.fusion[channelIndex].rgbColor !== 0) {
      this.fusion[channelIndex].rgbColor = colorrgb;
    }
    this.meshVolume.updateMeshColors(this.channelColors);
  }

  // TODO remove this from public interface?
  updateMeshColors(): void {
    this.meshVolume.updateMeshColors(this.channelColors);
  }

  // Get the color for a channel
  // @return {Array.<number>} The color as array of [r,g,b]
  getChannelColor(channelIndex: number): [number, number, number] {
    return this.channelColors[channelIndex];
  }

  // Set the material for a channel
  // @param {number} channelIndex
  // @param {Array.<number>} colorrgb [r,g,b]
  // @param {Array.<number>} specularrgb [r,g,b]
  // @param {Array.<number>} emissivergb [r,g,b]
  // @param {number} glossiness
  updateChannelMaterial(
    channelIndex: number,
    colorrgb: [number, number, number],
    specularrgb: [number, number, number],
    emissivergb: [number, number, number],
    glossiness: number
  ): void {
    if (!this.channelColors[channelIndex]) {
      return;
    }
    this.updateChannelColor(channelIndex, colorrgb);
    this.settings.specular[channelIndex] = specularrgb;
    this.settings.emissive[channelIndex] = emissivergb;
    this.settings.glossiness[channelIndex] = glossiness;
  }

  setDensity(density: number): void {
    this.settings.density = density;
    this.volumeRendering.updateSettings(this.settings, SettingsFlags.MATERIAL);
  }

  /**
   * Get the global density of the volume data
   */
  getDensity(): number {
    return this.settings.density;
  }

  setBrightness(brightness: number): void {
    this.settings.brightness = brightness;
    this.volumeRendering.updateSettings(this.settings, SettingsFlags.CAMERA);
  }

  getBrightness(): number {
    return this.settings.brightness;
  }

  setChannelAsMask(channelIndex: number): void {
    if (!this.volume.channels[channelIndex] || !this.volume.channels[channelIndex].loaded) {
      return;
    }
    this.settings.maskChannelIndex = channelIndex;
    this.volumeRendering.updateSettings(this.settings, SettingsFlags.MASK);
  }

  setMaskAlpha(maskAlpha: number): void {
    this.settings.maskAlpha = maskAlpha;
    this.volumeRendering.updateSettings(this.settings, SettingsFlags.MASK);
  }

  setShowBoundingBox(showBoundingBox: boolean): void {
    this.settings.showBoundingBox = showBoundingBox;
    this.volumeRendering.updateSettings(this.settings, SettingsFlags.BOUNDING_BOX);
  }

  setBoundingBoxColor(color: [number, number, number]): void {
    this.settings.boundingBoxColor = color;
    this.volumeRendering.updateSettings(this.settings, SettingsFlags.BOUNDING_BOX);
  }

  getIntensity(c: number, x: number, y: number, z: number): number {
    return this.volume.getIntensity(c, x, y, z);
  }

  onStartControls(): void {
    this.PT && this.pathTracedVolume && this.pathTracedVolume.onStartControls();
  }

  onChangeControls(): void {
    this.PT && this.pathTracedVolume && this.pathTracedVolume.onChangeControls();
  }

  onEndControls(): void {
    this.PT && this.pathTracedVolume && this.pathTracedVolume.onEndControls();
  }

  onResetCamera(): void {
    this.volumeRendering.viewpointMoved();
  }

  onCameraChanged(fov: number, focalDistance: number, apertureSize: number): void {
    this.PT && this.pathTracedVolume && this.pathTracedVolume.updateCamera(fov, focalDistance, apertureSize);
  }

  // values are in 0..1 range
  updateClipRegion(xmin: number, xmax: number, ymin: number, ymax: number, zmin: number, zmax: number): void {
    this.settings.bounds.bmin = new Vector3(xmin - 0.5, ymin - 0.5, zmin - 0.5);
    this.settings.bounds.bmax = new Vector3(xmax - 0.5, ymax - 0.5, zmax - 0.5);
    this.meshVolume.updateClipRegion(xmin, xmax, ymin, ymax, zmin, zmax);
    this.volumeRendering.updateSettings(this.settings, SettingsFlags.ROI);
  }

  updateLights(state: Light[]): void {
    this.PT && this.pathTracedVolume && this.pathTracedVolume.updateLights(state);
  }

  setPixelSamplingRate(value: number): void {
    this.settings.pixelSamplingRate = value;
    this.volumeRendering.updateSettings(this.settings, SettingsFlags.RESOLUTION_AND_SAMPLING);
  }

  setVolumeRendering(isPathtrace: boolean): void {
    if (isPathtrace === this.PT && this.volumeRendering === this.pathTracedVolume) {
      return;
    }

    // remove old 3d object from scene
    isPathtrace && this.sceneRoot.remove(this.meshVolume.get3dObject());
    this.sceneRoot.remove(this.volumeRendering.get3dObject());

    // destroy old resources.
    this.volumeRendering.cleanup();

    this.atlas2DSlice = undefined;
    this.pathTracedVolume = undefined;
    this.rayMarchedAtlasVolume = undefined;

    // create new
    if (isPathtrace) {
      this.pathTracedVolume = new PathTracedVolume(this.volume, this.settings);
      this.volumeRendering = this.pathTracedVolume;
      this.volumeRendering.setRenderUpdateListener(this.renderUpdateListener);
    } else {
      // Quietly swap the RayMarchedAtlasVolume for a 2D slice renderer when our render mode
      // is XY/Z mode.
      if (this.viewMode === "XY" || this.viewMode === "Z") {
        this.atlas2DSlice = new Atlas2DSlice(this.volume);
        this.volumeRendering = this.atlas2DSlice;
      } else {
        this.rayMarchedAtlasVolume = new RayMarchedAtlasVolume(this.volume, this.settings);
        this.volumeRendering = this.rayMarchedAtlasVolume;
      }

      if (this.renderUpdateListener) {
        this.renderUpdateListener(0);
      }
    }

    // ensure transforms on new volume representation are up to date
    this.PT = isPathtrace;

    // add new 3d object to scene
    !this.PT && this.sceneRoot.add(this.meshVolume.get3dObject());
    this.sceneRoot.add(this.volumeRendering.get3dObject());

    this.fuse();
  }

  setTranslation(xyz: Vector3): void {
    this.settings.translation.copy(xyz);
    this.meshVolume.setTranslation(this.settings.translation);
    this.volumeRendering.updateSettings(this.settings, SettingsFlags.TRANSFORM);
  }

  setRotation(eulerXYZ: Euler): void {
    this.settings.rotation.copy(eulerXYZ);
    this.meshVolume.setRotation(this.settings.rotation);
    this.volumeRendering.updateSettings(this.settings);
  }

  setupGui(pane: Pane): void {
    pane.addInput(this.settings, "translation").on("change", ({ value }) => this.setTranslation(value));
    pane.addInput(this.settings, "rotation").on("change", ({ value }) => this.setRotation(value));

    const pathtrace = pane.addFolder({ title: "Pathtrace", expanded: false });
    pathtrace
      .addInput(this.settings, "primaryRayStepSize", { min: 1, max: 100 })
      .on("change", ({ value }) => this.setRayStepSizes(value));
    pathtrace
      .addInput(this.settings, "secondaryRayStepSize", { min: 1, max: 100 })
      .on("change", ({ value }) => this.setRayStepSizes(undefined, value));
  }

  setZSlice(slice: number): boolean {
    if (slice < this.volume.z && slice > 0) {
      this.settings.zSlice = slice;
      this.volumeRendering.updateSettings(this.settings, SettingsFlags.ROI);
      return true;
    }
    return false;
  }

  get showBoundingBox(): boolean {
    return this.settings.showBoundingBox;
  }
}

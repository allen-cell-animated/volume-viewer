import { Vector3, Object3D, Euler } from "three";

import MeshVolume from "./MeshVolume";
import RayMarchedAtlasVolume from "./RayMarchedAtlasVolume";
import PathTracedVolume from "./PathTracedVolume";
import { LUT_ARRAY_LENGTH } from "./Histogram";
import Volume from "./Volume";
import { VolumeDisplayOptions, VolumeChannelDisplayOptions } from "./types";
import { Bounds, FuseChannel } from "./types";
import { ThreeJsPanel } from "./ThreeJsPanel";
import { Light } from "./Light";
import Channel from "./Channel";
import { VolumeRenderImpl } from "./VolumeRenderImpl";
import { Pane } from "tweakpane";
import Atlas2DSlice from "./Atlas2DSlice";

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
  private onChannelDataReadyCallback?: () => void;
  public translation: Vector3;
  public rotation: Euler;
  private flipX: number;
  private flipY: number;
  private flipZ: number;
  private viewMode: string;
  private maskChannelIndex: number;
  private maskAlpha: number;
  private gammaMin: number;
  private gammaLevel: number;
  private gammaMax: number;
  private channelColors: [number, number, number][];
  private channelOptions: VolumeChannelDisplayOptions[];
  private fusion: FuseChannel[];
  public specular: [number, number, number][];
  public emissive: [number, number, number][];
  public glossiness: number[];
  public sceneRoot: Object3D;
  private meshVolume: MeshVolume;
  public primaryRayStepSize: number;
  public secondaryRayStepSize: number;
  public showBoundingBox: boolean;
  private boundingBoxColor: [number, number, number];

  // these should never coexist simultaneously. always one or the other is present
  // this is a remnant of a pre-typescript world
  private pathTracedVolume?: PathTracedVolume;
  private rayMarchedAtlasVolume?: RayMarchedAtlasVolume;
  private atlas2DSlice?: Atlas2DSlice;

  private volumeRendering: VolumeRenderImpl;

  private bounds: Bounds;
  private scale: Vector3;
  private currentScale: Vector3;
  private renderUpdateListener?: (iteration: number) => void;
  private density: number;
  private brightness: number;

  constructor(volume: Volume, options: VolumeDisplayOptions) {
    this.PT = !!options.renderMode;

    // THE VOLUME DATA
    this.volume = volume;

    this.onChannelDataReadyCallback = undefined;

    this.translation = new Vector3(0, 0, 0);
    this.rotation = new Euler();
    this.flipX = 1;
    this.flipY = 1;
    this.flipZ = 1;

    // TODO: Replace with enum
    this.viewMode = "3D";

    this.maskChannelIndex = -1;

    this.maskAlpha = 1.0;

    this.gammaMin = 0.0;
    this.gammaLevel = 1.0;
    this.gammaMax = 1.0;

    // TODO verify that these are reasonable
    this.density = 0;
    this.brightness = 0;

    this.showBoundingBox = false;
    this.boundingBoxColor = [1.0, 1.0, 0.0];

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

    this.specular = new Array(this.volume.num_channels).fill([0, 0, 0]);

    this.emissive = new Array(this.volume.num_channels).fill([0, 0, 0]);

    this.glossiness = new Array(this.volume.num_channels).fill(0);

    this.sceneRoot = new Object3D(); //create an empty container

    this.meshVolume = new MeshVolume(this.volume);

    this.primaryRayStepSize = 1.0;
    this.secondaryRayStepSize = 1.0;
    if (this.PT) {
      this.pathTracedVolume = new PathTracedVolume(this.volume);
      this.volumeRendering = this.pathTracedVolume;
    } else {
      this.rayMarchedAtlasVolume = new RayMarchedAtlasVolume(this.volume);
      this.volumeRendering = this.rayMarchedAtlasVolume;
    }

    // draw meshes first, and volume last, for blending and depth test reasons with raymarch
    !this.PT && this.sceneRoot.add(this.meshVolume.get3dObject());
    this.sceneRoot.add(this.volumeRendering.get3dObject());
    // draw meshes last (as overlay) for pathtrace? (or not at all?)
    //this.PT && this.sceneRoot.add(this.meshVolume.get3dObject());

    this.bounds = {
      bmin: new Vector3(-0.5, -0.5, -0.5),
      bmax: new Vector3(0.5, 0.5, 0.5),
    };

    this.sceneRoot.position.set(0, 0, 0);

    this.scale = new Vector3(1, 1, 1);
    this.currentScale = new Vector3(1, 1, 1);
    this.setScale(this.volume.scale);

    // apply the volume's default transformation
    this.setTranslation(new Vector3().fromArray(this.volume.getTranslation()));
    this.setRotation(new Euler().fromArray(this.volume.getRotation()));

    this.setOptions(options);
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
      this.bounds = {
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
      this.primaryRayStepSize = primary;
    }
    if (secondary !== undefined) {
      this.secondaryRayStepSize = secondary;
    }
    this.volumeRendering.setRayStepSizes(this.primaryRayStepSize, this.secondaryRayStepSize);
  }

  setScale(scale: Vector3): void {
    this.scale = scale;

    this.currentScale = scale.clone();

    this.meshVolume.setScale(scale);
    this.volumeRendering.setScale(scale);
  }

  setOrthoScale(value: number): void {
    this.volumeRendering.setOrthoScale(value);
  }

  setResolution(viewObj: ThreeJsPanel): void {
    const x = viewObj.getWidth();
    const y = viewObj.getHeight();
    this.volumeRendering.setResolution(x, y);
    this.meshVolume.setResolution(x, y);
  }

  // Set clipping range (between -0.5 and 0.5) for a given axis.
  // Calling this allows the rendering to compensate for changes in thickness in orthographic views that affect how bright the volume is.
  // @param {number} axis 0, 1, or 2 for x, y, or z axis
  // @param {number} minval -0.5..0.5, should be less than maxval
  // @param {number} maxval -0.5..0.5, should be greater than minval
  // @param {boolean} isOrthoAxis is this an orthographic projection or just a clipping of the range for perspective view
  setAxisClip(axis: "x" | "y" | "z", minval: number, maxval: number, isOrthoAxis?: boolean): void {
    this.bounds.bmax[axis] = maxval;
    this.bounds.bmin[axis] = minval;

    !this.PT && this.meshVolume.setAxisClip(axis, minval, maxval, !!isOrthoAxis);
    this.volumeRendering.setAxisClip(axis, minval, maxval, isOrthoAxis || false);
  }

// TODO: Change mode to an enum
/**
 * Sets the camera mode of the VolumeDrawable.
 * @param mode Mode can be "3D", or "XY" or "Z", or "YZ" or "X", or "XZ" or "Y".
 */
  setViewMode(mode: string): void {
    this.viewMode = mode;
    if (mode === "XY" || mode === "Z") {
      // Currently in raymarch mode, hotswap the 2D slice
      console.log(this.rayMarchedAtlasVolume);
      console.log(this.atlas2DSlice);
      if (this.rayMarchedAtlasVolume && !this.atlas2DSlice) {
        // We are not already rendering with 2D mode, so trigger a switch
        this.setVolumeRendering(false);
        console.log(this.volumeRendering);
      }
    } else {
      if (!this.rayMarchedAtlasVolume && this.atlas2DSlice) {
        // Switch back to 3D mode
        this.setVolumeRendering(false);
      }
    }
  }

  // Tell this image that it needs to be drawn in an orthographic mode
  // @param {boolean} isOrtho is this an orthographic projection or a perspective view
  setIsOrtho(isOrtho: boolean): void {
    this.volumeRendering.setIsOrtho(isOrtho);
  }

  setInterpolationEnabled(active: boolean): void {
    this.volumeRendering.setInterpolationEnabled(active);
  }

  setOrthoThickness(value: number): void {
    !this.PT && this.meshVolume.setOrthoThickness(value);
    this.volumeRendering.setOrthoThickness(value);
  }

  // Set parameters for gamma curve for volume rendering.
  // @param {number} gmin 0..1
  // @param {number} glevel 0..1
  // @param {number} gmax 0..1, should be > gmin
  setGamma(gmin: number, glevel: number, gmax: number): void {
    this.gammaMin = gmin;
    this.gammaLevel = glevel;
    this.gammaMax = gmax;
    this.volumeRendering.setGamma(gmin, glevel, gmax);
  }

  setFlipAxes(flipX: number, flipY: number, flipZ: number): void {
    this.flipX = flipX;
    this.flipY = flipY;
    this.flipZ = flipZ;
    this.volumeRendering.setFlipAxes(flipX, flipY, flipZ);
    this.meshVolume.setFlipAxes(flipX, flipY, flipZ);
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

    if (this.PT) {
      if (this.pathTracedVolume) {
        this.pathTracedVolume.updateActiveChannels(this);
      }
    } else {
      if (this.rayMarchedAtlasVolume) {
        this.rayMarchedAtlasVolume.fuse(this.fusion, this.volume.channels);
      }
    }
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
    this.PT && this.pathTracedVolume && this.pathTracedVolume.updateMaterial(this);
    !this.PT && this.rayMarchedAtlasVolume && this.rayMarchedAtlasVolume.fuse(this.fusion, this.volume.channels);
  }

  updateLuts(): void {
    this.PT && this.pathTracedVolume && this.pathTracedVolume.updateLuts(this);
    !this.PT && this.rayMarchedAtlasVolume && this.rayMarchedAtlasVolume.fuse(this.fusion, this.volume.channels);
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
    this.volumeRendering.onChannelData(batch);
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

    this.specular[newChannelIndex] = [0, 0, 0];
    this.emissive[newChannelIndex] = [0, 0, 0];
    this.glossiness[newChannelIndex] = 0;
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
      this.volumeRendering.setVisible(false);
    } else {
      this.volumeRendering.setVisible(true);
    }
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
    this.specular[channelIndex] = specularrgb;
    this.emissive[channelIndex] = emissivergb;
    this.glossiness[channelIndex] = glossiness;
  }

  setDensity(density: number): void {
    this.density = density;
    this.volumeRendering.setDensity(density);
  }

  /**
   * Get the global density of the volume data
   */
  getDensity(): number {
    return this.density;
  }

  setBrightness(brightness: number): void {
    this.brightness = brightness;
    this.volumeRendering.setBrightness(brightness);
  }

  getBrightness(): number {
    return this.brightness;
  }

  setChannelAsMask(channelIndex: number): boolean {
    if (!this.volume.channels[channelIndex] || !this.volume.channels[channelIndex].loaded) {
      return false;
    }
    this.maskChannelIndex = channelIndex;
    return this.volumeRendering.setChannelAsMask(channelIndex);
  }

  setMaskAlpha(maskAlpha: number): void {
    this.maskAlpha = maskAlpha;
    this.volumeRendering.setMaskAlpha(maskAlpha);
  }

  setShowBoundingBox(showBoundingBox: boolean): void {
    this.showBoundingBox = showBoundingBox;
    this.volumeRendering.setShowBoundingBox(showBoundingBox);
  }

  setBoundingBoxColor(color: [number, number, number]): void {
    this.boundingBoxColor = color;
    this.volumeRendering.setBoundingBoxColor(color);
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
    this.bounds.bmin = new Vector3(xmin - 0.5, ymin - 0.5, zmin - 0.5);
    this.bounds.bmax = new Vector3(xmax - 0.5, ymax - 0.5, zmax - 0.5);
    this.volumeRendering.updateClipRegion(xmin, xmax, ymin, ymax, zmin, zmax);
    this.meshVolume.updateClipRegion(xmin, xmax, ymin, ymax, zmin, zmax);
  }

  updateLights(state: Light[]): void {
    this.PT && this.pathTracedVolume && this.pathTracedVolume.updateLights(state);
  }

  setPixelSamplingRate(value: number): void {
    this.volumeRendering.setPixelSamplingRate(value);
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
      this.pathTracedVolume = new PathTracedVolume(this.volume);
      this.volumeRendering = this.pathTracedVolume;
      this.volumeRendering.setRenderUpdateListener(this.renderUpdateListener);
    } else {
      // Quietly swap the RayMarchedAtlasVolume for a 2D slice renderer when our render mode
      // is XY/Z mode. 
      if (this.viewMode === "XY" || this.viewMode === "Z") {
        console.log("Switching view mode to Atlas2DSlice");
        this.atlas2DSlice = new Atlas2DSlice(this.volume);
        this.volumeRendering = this.atlas2DSlice;
      } else {
        this.rayMarchedAtlasVolume = new RayMarchedAtlasVolume(this.volume);
        this.volumeRendering = this.rayMarchedAtlasVolume;
      }

      for (let i = 0; i < this.volume.num_channels; ++i) {
        if (this.volume.getChannel(i).loaded) {
          this.volumeRendering.onChannelData([i]);
        }
      }
      if (this.renderUpdateListener) {
        this.renderUpdateListener(0);
      }
    }

    // ensure transforms on new volume representation are up to date
    this.volumeRendering.setTranslation(this.translation);
    this.volumeRendering.setRotation(this.rotation);

    this.PT = isPathtrace;

    this.setChannelAsMask(this.maskChannelIndex);
    this.setMaskAlpha(this.maskAlpha);
    this.setScale(this.volume.scale);
    this.setBrightness(this.getBrightness());
    this.setDensity(this.getDensity());
    this.setGamma(this.gammaMin, this.gammaLevel, this.gammaMax);
    this.setFlipAxes(this.flipX, this.flipY, this.flipZ);

    // reset clip bounds
    this.setAxisClip("x", this.bounds.bmin.x, this.bounds.bmax.x);
    this.setAxisClip("y", this.bounds.bmin.y, this.bounds.bmax.y);
    this.setAxisClip("z", this.bounds.bmin.z, this.bounds.bmax.z);
    this.updateClipRegion(
      this.bounds.bmin.x + 0.5,
      this.bounds.bmax.x + 0.5,
      this.bounds.bmin.y + 0.5,
      this.bounds.bmax.y + 0.5,
      this.bounds.bmin.z + 0.5,
      this.bounds.bmax.z + 0.5
    );
    this.setRayStepSizes(this.primaryRayStepSize, this.secondaryRayStepSize);

    this.setShowBoundingBox(this.showBoundingBox);
    this.setBoundingBoxColor(this.boundingBoxColor);

    // add new 3d object to scene
    !this.PT && this.sceneRoot.add(this.meshVolume.get3dObject());
    this.sceneRoot.add(this.volumeRendering.get3dObject());

    this.fuse();
  }

  setTranslation(xyz: Vector3): void {
    this.translation.copy(xyz);
    this.volumeRendering.setTranslation(this.translation);
    this.meshVolume.setTranslation(this.translation);
  }

  setRotation(eulerXYZ: Euler): void {
    this.rotation.copy(eulerXYZ);
    this.volumeRendering.setRotation(this.rotation);
    this.meshVolume.setRotation(this.rotation);
  }

  setupGui(pane: Pane): void {
    pane.addInput(this, "translation").on("change", ({ value }) => this.setTranslation(value));
    pane.addInput(this, "rotation").on("change", ({ value }) => this.setRotation(value));

    const pathtrace = pane.addFolder({ title: "Pathtrace", expanded: false });
    pathtrace
      .addInput(this, "primaryRayStepSize", { min: 1, max: 100 })
      .on("change", ({ value }) => this.setRayStepSizes(value));
    pathtrace
      .addInput(this, "secondaryRayStepSize", { min: 1, max: 100 })
      .on("change", ({ value }) => this.setRayStepSizes(undefined, value));
  }
}

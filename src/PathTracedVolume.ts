import {
  DataTexture,
  Data3DTexture,
  Euler,
  FloatType,
  Matrix4,
  Mesh,
  NormalBlending,
  OrthographicCamera,
  PerspectiveCamera,
  PlaneGeometry,
  Quaternion,
  RGBAFormat,
  Scene,
  ShaderMaterial,
  ShaderMaterialParameters,
  UniformsUtils,
  UnsignedByteType,
  Vector2,
  Vector3,
  WebGLRenderTarget,
} from "three";
import { LinearFilter, NearestFilter } from "three/src/constants";

import { denoiseFragmentShaderSrc, denoiseShaderUniforms, denoiseVertexShaderSrc } from "./constants/denoiseShader";
import {
  pathTracingFragmentShaderSrc,
  pathTracingUniforms,
  pathTracingVertexShaderSrc,
} from "./constants/volumePTshader";
import { LUT_ARRAY_LENGTH } from "./Histogram";
import Volume from "./Volume";
import { Bounds, isOrthographicCamera } from "./types";
import { ThreeJsPanel } from "./ThreeJsPanel";
import VolumeDrawable from "./VolumeDrawable";
import { Light } from "./Light";
import { VolumeRenderImpl } from "./VolumeRenderImpl";

export default class PathTracedVolume implements VolumeRenderImpl {
  private volume: Volume;
  private viewChannels: number[]; // should have 4 or less elements
  private scale: Vector3;
  private translation: Vector3;
  private rotation: Euler;
  private pixelSamplingRate: number;
  private pathTracingUniforms: typeof pathTracingUniforms;
  private volumeTexture: Data3DTexture;
  private maskChannelIndex: number;
  private maskAlpha: number;
  private bounds: Bounds;
  private cameraIsMoving: boolean;
  private sampleCounter: number;
  private frameCounter: number;
  private stepSizePrimaryRayVoxels: number;
  private stepSizeSecondaryRayVoxels: number;
  private pathTracingScene: Scene;
  private screenTextureScene: Scene;
  private quadCamera: OrthographicCamera;
  private fullTargetResolution: Vector2;
  private pathTracingRenderTarget: WebGLRenderTarget;
  private screenTextureRenderTarget: WebGLRenderTarget;
  private screenTextureShader: ShaderMaterialParameters;
  private screenOutputShader: ShaderMaterialParameters;
  private pathTracingGeometry: PlaneGeometry;
  private pathTracingMaterial: ShaderMaterial;
  private pathTracingMesh: Mesh;
  private screenTextureGeometry: PlaneGeometry;
  private screenTextureMaterial: ShaderMaterial;
  private screenTextureMesh: Mesh;
  private screenOutputGeometry: PlaneGeometry;
  private screenOutputMaterial: ShaderMaterial;
  private denoiseShaderUniforms = denoiseShaderUniforms();
  private screenOutputDenoiseMaterial: ShaderMaterial;
  private screenOutputMesh: Mesh;
  private gradientDelta: number;
  private renderUpdateListener?: (iteration: number) => void;

  constructor(volume: Volume) {
    // need?
    this.volume = volume;
    this.viewChannels = [-1, -1, -1, -1];

    this.scale = new Vector3(1, 1, 1);
    this.translation = new Vector3(0, 0, 0);
    this.rotation = new Euler();

    // scale factor is a huge optimization.  Maybe use 1/dpi scale
    this.pixelSamplingRate = 0.75;

    this.pathTracingUniforms = pathTracingUniforms;

    // create volume texture
    const sx = volume.x,
      sy = volume.y,
      sz = volume.z;
    const data = new Uint8Array(sx * sy * sz * 4).fill(0);
    // defaults to rgba and unsignedbytetype so dont need to supply format this time.
    this.volumeTexture = new Data3DTexture(data, volume.x, volume.y, volume.z);
    this.volumeTexture.minFilter = this.volumeTexture.magFilter = LinearFilter;
    this.volumeTexture.generateMipmaps = false;

    this.volumeTexture.needsUpdate = true;

    this.maskChannelIndex = -1;
    this.maskAlpha = 1.0;

    // create Lut textures
    // empty array
    const lutData = new Uint8Array(LUT_ARRAY_LENGTH * 4).fill(1);
    const lut0 = new DataTexture(lutData, 256, 4, RGBAFormat, UnsignedByteType);
    lut0.minFilter = lut0.magFilter = LinearFilter;
    lut0.needsUpdate = true;
    this.pathTracingUniforms.gLutTexture.value = lut0;

    this.bounds = {
      bmin: new Vector3(-0.5, -0.5, -0.5),
      bmax: new Vector3(0.5, 0.5, 0.5),
    };

    this.cameraIsMoving = false;
    this.sampleCounter = 0;
    this.frameCounter = 0;

    this.stepSizePrimaryRayVoxels = 1.0;
    this.stepSizeSecondaryRayVoxels = 1.0;

    this.pathTracingScene = new Scene();
    this.screenTextureScene = new Scene();

    // quadCamera is simply the camera to help render the full screen quad (2 triangles),
    // hence the name.  It is an Orthographic camera that sits facing the view plane, which serves as
    // the window into our 3d world. This camera will not move or rotate for the duration of the app.
    this.quadCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

    this.fullTargetResolution = new Vector2(2, 2);

    this.pathTracingRenderTarget = new WebGLRenderTarget(2, 2, {
      minFilter: NearestFilter,
      magFilter: NearestFilter,
      format: RGBAFormat,
      type: FloatType,
      depthBuffer: false,
      stencilBuffer: false,
    });
    this.pathTracingRenderTarget.texture.generateMipmaps = false;

    this.screenTextureRenderTarget = new WebGLRenderTarget(2, 2, {
      minFilter: NearestFilter,
      magFilter: NearestFilter,
      format: RGBAFormat,
      type: FloatType,
      depthBuffer: false,
      stencilBuffer: false,
    });
    this.screenTextureRenderTarget.texture.generateMipmaps = false;

    this.screenTextureShader = {
      uniforms: UniformsUtils.merge([
        {
          tTexture0: {
            type: "t",
            value: null,
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
        "gl_Position = vec4( position, 1.0 );",
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
        "pc_fragColor = texture(tTexture0, vUv);",
        "}",
      ].join("\n"),
    };

    this.screenOutputShader = {
      uniforms: UniformsUtils.merge([
        {
          gInvExposure: {
            type: "f",
            value: 1.0 / (1.0 - 0.75),
          },
          tTexture0: {
            type: "t",
            value: null,
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
        "gl_Position = vec4( position, 1.0 );",
        "}",
      ].join("\n"),

      fragmentShader: [
        "precision highp float;",
        "precision highp int;",
        "precision highp sampler2D;",

        "uniform float gInvExposure;",
        "uniform sampler2D tTexture0;",
        "in vec2 vUv;",

        // Used to convert from XYZ to linear RGB space
        "const mat3 XYZ_2_RGB = (mat3(",
        "  3.2404542, -1.5371385, -0.4985314,",
        " -0.9692660,  1.8760108,  0.0415560,",
        "  0.0556434, -0.2040259,  1.0572252",
        "));",

        "vec3 XYZtoRGB(vec3 xyz) {",
        "return xyz * XYZ_2_RGB;",
        "}",

        "void main()",
        "{",
        "vec4 pixelColor = texture(tTexture0, vUv);",

        "pixelColor.rgb = XYZtoRGB(pixelColor.rgb);",

        //'pixelColor.rgb = pow(pixelColor.rgb, vec3(1.0/2.2));',
        "pixelColor.rgb = 1.0-exp(-pixelColor.rgb*gInvExposure);",
        "pixelColor = clamp(pixelColor, 0.0, 1.0);",

        "pc_fragColor = pixelColor;", // sqrt(pixelColor);',
        //'out_FragColor = pow(pixelColor, vec4(1.0/2.2));',
        "}",
      ].join("\n"),
    };

    this.pathTracingGeometry = new PlaneGeometry(2, 2);

    // initialize texture.
    this.pathTracingUniforms.volumeTexture.value = this.volumeTexture;
    this.pathTracingUniforms.tPreviousTexture.value = this.screenTextureRenderTarget.texture;

    this.pathTracingMaterial = new ShaderMaterial({
      uniforms: this.pathTracingUniforms,
      // defines: pathTracingDefines,
      vertexShader: pathTracingVertexShaderSrc,
      fragmentShader: pathTracingFragmentShaderSrc,
      depthTest: false,
      depthWrite: false,
    });
    this.pathTracingMesh = new Mesh(this.pathTracingGeometry, this.pathTracingMaterial);
    this.pathTracingScene.add(this.pathTracingMesh);

    this.screenTextureGeometry = new PlaneGeometry(2, 2);

    this.screenTextureMaterial = new ShaderMaterial({
      uniforms: this.screenTextureShader.uniforms,
      vertexShader: this.screenTextureShader.vertexShader,
      fragmentShader: this.screenTextureShader.fragmentShader,
      depthWrite: false,
      depthTest: false,
    });

    this.screenTextureMaterial.uniforms.tTexture0.value = this.pathTracingRenderTarget.texture;

    this.screenTextureMesh = new Mesh(this.screenTextureGeometry, this.screenTextureMaterial);
    this.screenTextureScene.add(this.screenTextureMesh);

    this.screenOutputGeometry = new PlaneGeometry(2, 2);

    this.screenOutputMaterial = new ShaderMaterial({
      uniforms: this.screenOutputShader.uniforms,
      vertexShader: this.screenOutputShader.vertexShader,
      fragmentShader: this.screenOutputShader.fragmentShader,
      depthWrite: false,
      depthTest: false,
      blending: NormalBlending,
      transparent: true,
    });

    this.denoiseShaderUniforms = denoiseShaderUniforms();
    this.screenOutputDenoiseMaterial = new ShaderMaterial({
      uniforms: this.denoiseShaderUniforms,
      vertexShader: denoiseVertexShaderSrc,
      fragmentShader: denoiseFragmentShaderSrc,
      depthWrite: false,
      depthTest: false,
      blending: NormalBlending,
      transparent: true,
    });

    this.screenOutputMaterial.uniforms.tTexture0.value = this.pathTracingRenderTarget.texture;
    this.screenOutputDenoiseMaterial.uniforms.tTexture0.value = this.pathTracingRenderTarget.texture;

    this.screenOutputMesh = new Mesh(this.screenOutputGeometry, this.screenOutputMaterial);

    this.gradientDelta = 1.0 / Math.max(sx, Math.max(sy, sz));
    const invGradientDelta = 1.0 / this.gradientDelta; // a voxel count...

    this.pathTracingUniforms.gGradientDeltaX.value = new Vector3(this.gradientDelta, 0, 0);
    this.pathTracingUniforms.gGradientDeltaY.value = new Vector3(0, this.gradientDelta, 0);
    this.pathTracingUniforms.gGradientDeltaZ.value = new Vector3(0, 0, this.gradientDelta);
    // can this be a per-x,y,z value?
    this.pathTracingUniforms.gInvGradientDelta.value = invGradientDelta; // a voxel count
    this.pathTracingUniforms.gGradientFactor.value = 50.0; // related to voxel counts also

    this.setRayStepSizes(1.0, 1.0);

    // bounds will go from 0 to physicalSize
    const physicalSize = volume.normalizedPhysicalSize;

    this.pathTracingUniforms.gInvAaBbMax.value = new Vector3(
      1.0 / physicalSize.x,
      1.0 / physicalSize.y,
      1.0 / physicalSize.z
    );
    this.updateClipRegion(0, 1, 0, 1, 0, 1);

    this.updateLightsSecondary();
  }

  public cleanup(): void {
    // warning do not use after cleanup is called!
    this.volumeTexture.dispose();
  }

  public setRenderUpdateListener(callback?: (iteration: number) => void): void {
    this.renderUpdateListener = callback;
  }

  public resetProgress(): void {
    if (this.sampleCounter !== 0 && this.renderUpdateListener) {
      this.renderUpdateListener(0);
    }
    this.sampleCounter = 0;
  }

  public setVisible(_isVisible: boolean): void {
    // this.visible = isVisible;
  }

  public setShowBoundingBox(_showBoundingBox: boolean): void {
    // TODO: NOT IMPLEMENTED YET
  }

  public setBoundingBoxColor(_color: [number, number, number]): void {
    // TODO: NOT IMPLEMENTED YET
  }

  public doRender(canvas: ThreeJsPanel): void {
    if (!this.volumeTexture) {
      return;
    }

    if (this.cameraIsMoving) {
      this.resetProgress();
      this.frameCounter += 1.0;
    } else {
      this.sampleCounter += 1.0;
      this.frameCounter += 1.0;
      if (this.renderUpdateListener) {
        this.renderUpdateListener(this.sampleCounter);
      }
    }

    this.pathTracingUniforms.uSampleCounter.value = this.sampleCounter;
    this.pathTracingUniforms.uFrameCounter.value = this.frameCounter;

    // CAMERA
    // force the camera to update its world matrix.
    canvas.camera.updateMatrixWorld(true);
    const cam = canvas.camera;

    // rotate lights with camera, as if we are tumbling the volume with a fixed camera and world lighting.
    // this code is analogous to this threejs code from View3d.preRender:
    // this.scene.getObjectByName('lightContainer').rotation.setFromRotationMatrix(this.canvas3d.camera.matrixWorld);
    const mycamxform = cam.matrixWorld.clone();
    mycamxform.setPosition(new Vector3(0, 0, 0));
    this.updateLightsSecondary(mycamxform);

    let mydir = new Vector3();
    mydir = cam.getWorldDirection(mydir);
    const myup = new Vector3().copy(cam.up);
    // don't rotate this vector.  we are using translation as the pivot point of the object, and THEN rotating.
    const mypos = new Vector3().copy(cam.position);

    // apply volume translation and rotation:
    // rotate camera.up, camera.direction, and camera position by inverse of volume's modelview
    const m = new Matrix4().makeRotationFromQuaternion(new Quaternion().setFromEuler(this.rotation).invert());
    mypos.sub(this.translation);
    mypos.applyMatrix4(m);
    myup.applyMatrix4(m);
    mydir.applyMatrix4(m);

    this.pathTracingUniforms.gCamera.value.mIsOrtho = isOrthographicCamera(cam) ? 1 : 0;
    this.pathTracingUniforms.gCamera.value.mFrom.copy(mypos);
    this.pathTracingUniforms.gCamera.value.mN.copy(mydir);
    this.pathTracingUniforms.gCamera.value.mU.crossVectors(this.pathTracingUniforms.gCamera.value.mN, myup).normalize();
    this.pathTracingUniforms.gCamera.value.mV
      .crossVectors(this.pathTracingUniforms.gCamera.value.mU, this.pathTracingUniforms.gCamera.value.mN)
      .normalize();

    // the choice of y = scale/aspect or x = scale*aspect is made here to match up with the other raymarch volume
    const fScale = isOrthographicCamera(cam)
      ? canvas.getOrthoScale()
      : Math.tan((0.5 * (cam as PerspectiveCamera).fov * Math.PI) / 180.0);

    const aspect = this.pathTracingUniforms.uResolution.value.x / this.pathTracingUniforms.uResolution.value.y;
    this.pathTracingUniforms.gCamera.value.mScreen.set(
      -fScale * aspect,
      fScale * aspect,
      // the "0" Y pixel will be at +Scale.
      fScale,
      -fScale
    );
    const scr = this.pathTracingUniforms.gCamera.value.mScreen;
    this.pathTracingUniforms.gCamera.value.mInvScreen.set(
      // the amount to increment for each pixel
      (scr.y - scr.x) / this.pathTracingUniforms.uResolution.value.x,
      (scr.w - scr.z) / this.pathTracingUniforms.uResolution.value.y
    );

    const denoiseLerpC = 0.33 * (Math.max(this.sampleCounter - 1, 1.0) * 0.035);
    if (denoiseLerpC > 0.0 && denoiseLerpC < 1.0) {
      this.screenOutputDenoiseMaterial.uniforms.gDenoiseLerpC.value = denoiseLerpC;
      this.screenOutputMesh.material = this.screenOutputDenoiseMaterial;
    } else {
      this.screenOutputMesh.material = this.screenOutputMaterial;
    }
    this.screenOutputDenoiseMaterial.uniforms.gDenoisePixelSize.value.x = this.pathTracingUniforms.uResolution.value.x;
    this.screenOutputDenoiseMaterial.uniforms.gDenoisePixelSize.value.y = this.pathTracingUniforms.uResolution.value.y;

    // RENDERING in 3 steps

    // STEP 1
    // Perform PathTracing and Render(save) into pathTracingRenderTarget

    // This is currently rendered as a fullscreen quad with no camera transform in the vertex shader!
    // It is also composited with screenTextureRenderTarget's texture.
    // (Read previous screenTextureRenderTarget to use as a new starting point to blend with)
    canvas.renderer.setRenderTarget(this.pathTracingRenderTarget);
    canvas.renderer.render(this.pathTracingScene, this.quadCamera);

    // STEP 2
    // Render(copy) the final pathTracingScene output(above) into screenTextureRenderTarget
    // This will be used as a new starting point for Step 1 above
    canvas.renderer.setRenderTarget(this.screenTextureRenderTarget);
    canvas.renderer.render(this.screenTextureScene, this.quadCamera);

    // STEP 3
    // Render full screen quad with generated pathTracingRenderTarget in STEP 1 above.
    // After the image is gamma corrected, it will be shown on the screen as the final accumulated output
    // DMT - this step is handled by the threeJsPanel.
    // tell the threejs panel to use the quadCamera to render this scene.

    // renderer.render( this.screenOutputScene, this.quadCamera );
    canvas.renderer.setRenderTarget(null);
  }

  public get3dObject(): Mesh {
    return this.screenOutputMesh;
  }

  public onChannelData(_batch: number[]): void {
    // no op
  }

  public setScale(scale: Vector3): void {
    this.scale = scale;
  }

  public setRayStepSizes(primary: number, secondary: number): void {
    // reset render if changed
    if (this.stepSizePrimaryRayVoxels !== primary || this.stepSizeSecondaryRayVoxels !== secondary) {
      this.resetProgress();
    }
    this.stepSizePrimaryRayVoxels = primary;
    this.stepSizeSecondaryRayVoxels = secondary;

    this.pathTracingUniforms.gStepSize.value = this.stepSizePrimaryRayVoxels * this.gradientDelta;
    this.pathTracingUniforms.gStepSizeShadow.value = this.stepSizeSecondaryRayVoxels * this.gradientDelta;
  }

  public setTranslation(vec3xyz: Vector3): void {
    this.translation.copy(vec3xyz);
    this.resetProgress();
  }

  public setRotation(eulerXYZ: Euler): void {
    this.rotation.copy(eulerXYZ);
    this.resetProgress();
  }

  public setOrthoScale(_value: number): void {
    // no op
  }

  public setGamma(_gmin: number, _glevel: number, _gmax: number): void {
    // no op
  }

  public setFlipAxes(flipX: number, flipY: number, flipZ: number): void {
    this.pathTracingUniforms.flipVolume.value = new Vector3(flipX, flipY, flipZ);
    // TODO: only reset if changed!
    this.resetProgress();
  }

  public setResolution(x: number, y: number): void {
    this.fullTargetResolution = new Vector2(x, y);
    const dpr = window.devicePixelRatio ? window.devicePixelRatio : 1.0;
    const nx = Math.floor((x * this.pixelSamplingRate) / dpr);
    const ny = Math.floor((y * this.pixelSamplingRate) / dpr);
    this.pathTracingUniforms.uResolution.value.x = nx;
    this.pathTracingUniforms.uResolution.value.y = ny;

    // TODO optimization: scale this value down when nx,ny is small.  For now can leave it at 3 (a 7x7 pixel filter).
    const denoiseFilterR = 3;
    this.screenOutputDenoiseMaterial.uniforms.gDenoiseWindowRadius.value = denoiseFilterR;
    this.screenOutputDenoiseMaterial.uniforms.gDenoiseInvWindowArea.value =
      1.0 / ((2.0 * denoiseFilterR + 1.0) * (2.0 * denoiseFilterR + 1.0));

    this.pathTracingRenderTarget.setSize(nx, ny);
    this.screenTextureRenderTarget.setSize(nx, ny);

    this.resetProgress();
  }

  setPixelSamplingRate(rate: number): void {
    this.pixelSamplingRate = rate;
    this.setResolution(this.fullTargetResolution.x, this.fullTargetResolution.y);
    this.resetProgress();
  }

  setDensity(density: number): void {
    this.pathTracingUniforms.gDensityScale.value = density * 150.0;
    this.resetProgress();
  }

  // TODO brightness and exposure should be the same thing? or gamma?
  setBrightness(brightness: number): void {
    // convert to an exposure value
    if (brightness === 1.0) {
      brightness = 0.999;
    }
    this.updateExposure(brightness);
  }

  // -0.5 .. 0.5
  setAxisClip(axis: "x" | "y" | "z", minval: number, maxval: number, _isOrthoAxis: boolean): void {
    this.bounds.bmax[axis] = maxval;
    this.bounds.bmin[axis] = minval;
    const physicalSize = this.volume.normalizedPhysicalSize;
    this.pathTracingUniforms.gClippedAaBbMin.value = new Vector3(
      this.bounds.bmin.x * physicalSize.x,
      this.bounds.bmin.y * physicalSize.y,
      this.bounds.bmin.z * physicalSize.z
    );
    this.pathTracingUniforms.gClippedAaBbMax.value = new Vector3(
      this.bounds.bmax.x * physicalSize.x,
      this.bounds.bmax.y * physicalSize.y,
      this.bounds.bmax.z * physicalSize.z
    );
    this.resetProgress();
  }

  setChannelAsMask(channelIndex: number): boolean {
    if (!this.volume.channels[channelIndex] || !this.volume.channels[channelIndex].loaded) {
      return false;
    }
    if (this.maskChannelIndex !== channelIndex) {
      this.maskChannelIndex = channelIndex;
      this.updateVolumeData4();
      this.resetProgress();
    }
    return true;
  }

  setMaskAlpha(maskAlpha: number): void {
    this.maskAlpha = maskAlpha;
    this.updateVolumeData4();
    this.resetProgress();
  }

  setOrthoThickness(_value: number): void {
    // no op
  }

  setIsOrtho(isOrthoAxis: boolean): void {
    this.pathTracingUniforms.gCamera.value.mIsOrtho = isOrthoAxis ? 1 : 0;
    this.resetProgress();
  }

  setInterpolationEnabled(active: boolean): void {
    this.volumeTexture.minFilter = this.volumeTexture.magFilter = active ? LinearFilter : NearestFilter;
    this.volumeTexture.needsUpdate = true;
  }

  //////////////////////////////////////////
  //////////////////////////////////////////

  onStartControls(): void {
    this.cameraIsMoving = true;
  }

  onChangeControls(): void {
    // this.cameraIsMoving = true;
  }

  onEndControls(): void {
    this.cameraIsMoving = false;
    this.resetProgress();
  }

  viewpointMoved(): void {
    this.resetProgress();
  }

  updateActiveChannels(image: VolumeDrawable): void {
    const ch = [-1, -1, -1, -1];
    let activeChannel = 0;
    const NC = this.volume.num_channels;
    const maxch = 4;
    for (let i = 0; i < NC && activeChannel < maxch; ++i) {
      if (image.isVolumeChannelEnabled(i) && image.getChannel(i).loaded) {
        ch[activeChannel] = i;
        activeChannel++;
      }
    }

    const unchanged = ch.every((elem, index) => elem === this.viewChannels[index], this);
    if (unchanged) {
      return;
    }

    this.pathTracingUniforms.gNChannels.value = activeChannel;

    this.viewChannels = ch;
    // update volume data according to channels selected.
    this.updateVolumeData4();
    this.resetProgress();
    this.updateLuts(image);
    this.updateMaterial(image);

    // console.log(this.pathTracingUniforms);
  }

  updateVolumeData4(): void {
    const sx = this.volume.x,
      sy = this.volume.y,
      sz = this.volume.z;

    const data = new Uint8Array(sx * sy * sz * 4);
    data.fill(0);

    for (let i = 0; i < 4; ++i) {
      const ch = this.viewChannels[i];
      if (ch === -1) {
        continue;
      }

      for (let iz = 0; iz < sz; ++iz) {
        for (let iy = 0; iy < sy; ++iy) {
          for (let ix = 0; ix < sx; ++ix) {
            data[i + ix * 4 + iy * 4 * sx + iz * 4 * sx * sy] = this.volume.getChannel(ch).getIntensity(ix, iy, iz);
          }
        }
      }
      if (this.maskChannelIndex !== -1 && this.maskAlpha < 1.0) {
        const maskChannel = this.volume.getChannel(this.maskChannelIndex);
        // const maskMax = maskChannel.getHistogram().dataMax;
        let maskVal = 1.0;
        const maskAlpha = this.maskAlpha;
        for (let iz = 0; iz < sz; ++iz) {
          for (let iy = 0; iy < sy; ++iy) {
            for (let ix = 0; ix < sx; ++ix) {
              // nonbinary masking
              // maskVal = maskChannel.getIntensity(ix,iy,iz) * maskAlpha / maskMax;

              // binary masking
              maskVal = maskChannel.getIntensity(ix, iy, iz) > 0 ? 1.0 : maskAlpha;

              data[i + ix * 4 + iy * 4 * sx + iz * 4 * sx * sy] *= maskVal;
            }
          }
        }
      }
    }
    // defaults to rgba and unsignedbytetype so dont need to supply format this time.
    this.volumeTexture.image.data.set(data);
    this.volumeTexture.needsUpdate = true;
  }

  updateLuts(image: VolumeDrawable): void {
    for (let i = 0; i < this.pathTracingUniforms.gNChannels.value; ++i) {
      const channel = this.viewChannels[i];
      const combinedLut = image.getChannel(channel).combineLuts(image.getChannelColor(channel));

      this.pathTracingUniforms.gLutTexture.value.image.data.set(combinedLut, i * LUT_ARRAY_LENGTH);

      this.pathTracingUniforms.gIntensityMax.value.setComponent(
        i,
        this.volume.channels[channel].histogram.getMax() / 255.0
      );
      this.pathTracingUniforms.gIntensityMin.value.setComponent(
        i,
        this.volume.channels[channel].histogram.getMin() / 255.0
      );
    }
    this.pathTracingUniforms.gLutTexture.value.needsUpdate = true;

    this.resetProgress();
  }

  // image is a material interface that supports per-channel color, spec,
  // emissive, glossiness
  updateMaterial(image: VolumeDrawable): void {
    for (let c = 0; c < this.viewChannels.length; ++c) {
      const i = this.viewChannels[c];
      if (i > -1) {
        // diffuse color is actually blended into the LUT now.
        const combinedLut = image.getChannel(i).combineLuts(image.getChannelColor(i));
        this.pathTracingUniforms.gLutTexture.value.image.data.set(combinedLut, c * LUT_ARRAY_LENGTH);
        this.pathTracingUniforms.gLutTexture.value.needsUpdate = true;
        this.pathTracingUniforms.gDiffuse.value[c] = new Vector3(1.0, 1.0, 1.0);

        this.pathTracingUniforms.gSpecular.value[c] = new Vector3()
          .fromArray(image.specular[i])
          .multiplyScalar(1.0 / 255.0);
        this.pathTracingUniforms.gEmissive.value[c] = new Vector3()
          .fromArray(image.emissive[i])
          .multiplyScalar(1.0 / 255.0);
        this.pathTracingUniforms.gGlossiness.value[c] = image.glossiness[i];
      }
    }
    this.resetProgress();
  }

  updateShadingMethod(brdf: number): void {
    this.pathTracingUniforms.gShadingType.value = brdf;
    this.resetProgress();
  }

  updateShowLights(showlights: number): void {
    this.pathTracingUniforms.uShowLights.value = showlights;
    this.resetProgress();
  }

  updateExposure(e: number): void {
    // 1.0 causes division by zero.
    if (e > 0.99999) {
      e = 0.99999;
    }
    this.screenOutputMaterial.uniforms.gInvExposure.value = 1.0 / (1.0 - e) - 1.0;
    this.screenOutputDenoiseMaterial.uniforms.gInvExposure.value = 1.0 / (1.0 - e) - 1.0;
    this.resetProgress();
  }

  updateCamera(fov: number, focalDistance: number, apertureSize: number): void {
    this.pathTracingUniforms.gCamera.value.mApertureSize = apertureSize;
    this.pathTracingUniforms.gCamera.value.mFocalDistance = focalDistance;

    this.resetProgress();
  }

  updateLights(state: Light[]): void {
    // 0th light in state array is sphere light
    this.pathTracingUniforms.gLights.value[0].mColorTop = new Vector3().copy(state[0].mColorTop);
    this.pathTracingUniforms.gLights.value[0].mColorMiddle = new Vector3().copy(state[0].mColorMiddle);
    this.pathTracingUniforms.gLights.value[0].mColorBottom = new Vector3().copy(state[0].mColorBottom);

    // 1st light in state array is area light
    this.pathTracingUniforms.gLights.value[1].mColor = new Vector3().copy(state[1].mColor);
    this.pathTracingUniforms.gLights.value[1].mTheta = state[1].mTheta;
    this.pathTracingUniforms.gLights.value[1].mPhi = state[1].mPhi;
    this.pathTracingUniforms.gLights.value[1].mDistance = state[1].mDistance;
    this.pathTracingUniforms.gLights.value[1].mWidth = state[1].mWidth;
    this.pathTracingUniforms.gLights.value[1].mHeight = state[1].mHeight;

    this.updateLightsSecondary();

    this.resetProgress();
  }

  updateLightsSecondary(cameraMatrix?: Matrix4): void {
    const physicalSize = this.volume.normalizedPhysicalSize;
    const bbctr = new Vector3(physicalSize.x * 0.5, physicalSize.y * 0.5, physicalSize.z * 0.5);

    for (let i = 0; i < 2; ++i) {
      const lt = this.pathTracingUniforms.gLights.value[i];
      lt.update(bbctr, cameraMatrix);
    }
  }

  // 0..1 ranges as input
  updateClipRegion(xmin: number, xmax: number, ymin: number, ymax: number, zmin: number, zmax: number): void {
    this.bounds = {
      bmin: new Vector3(xmin - 0.5, ymin - 0.5, zmin - 0.5),
      bmax: new Vector3(xmax - 0.5, ymax - 0.5, zmax - 0.5),
    };
    const physicalSize = this.volume.normalizedPhysicalSize;
    this.pathTracingUniforms.gClippedAaBbMin.value = new Vector3(
      xmin * physicalSize.x - 0.5 * physicalSize.x,
      ymin * physicalSize.y - 0.5 * physicalSize.y,
      zmin * physicalSize.z - 0.5 * physicalSize.z
    );
    this.pathTracingUniforms.gClippedAaBbMax.value = new Vector3(
      xmax * physicalSize.x - 0.5 * physicalSize.x,
      ymax * physicalSize.y - 0.5 * physicalSize.y,
      zmax * physicalSize.z - 0.5 * physicalSize.z
    );
    this.resetProgress();
  }

  public setZSlice(slice: number): void {
    return;
  }

}

import {
  DataTexture,
  DataTexture3D,
  Euler,
  FloatType,
  Matrix4,
  Mesh,
  OrthographicCamera,
  PlaneBufferGeometry,
  Quaternion,
  RGBAFormat,
  Scene,
  ShaderMaterial,
  UniformsUtils,
  UnsignedByteType,
  Vector2,
  Vector3,
  WebGLRenderTarget,
} from "three";
import { LinearFilter, NearestFilter } from "three/src/constants";

import { denoiseFragmentShaderSrc, denoiseShaderUniforms, denoiseVertexShaderSrc } from "./constants/denoiseShader.js";
import {
  pathTracingFragmentShaderSrc,
  pathTracingUniforms,
  pathTracingVertexShaderSrc,
} from "./constants/volumePTshader.js";

export default class PathTracedVolume {
  constructor(volume) {
    // need?
    this.volume = volume;
    this.viewChannels = [-1, -1, -1, -1];

    this.scale = new Vector3(1, 1, 1);
    this.translation = new Vector3(0, 0, 0);
    this.rotation = new Euler();

    // scale factor is a huge optimization.  Maybe use 1/dpi scale
    this.pixelSamplingRate = 0.75;

    this.pathTracingUniforms = pathTracingUniforms();

    // create volume texture
    const sx = volume.x,
      sy = volume.y,
      sz = volume.z;
    const data = new Uint8Array(sx * sy * sz * 4).fill(0);
    // defaults to rgba and unsignedbytetype so dont need to supply format this time.
    this.volumeTexture = new DataTexture3D(data, volume.x, volume.y, volume.z);
    this.volumeTexture.minFilter = this.volumeTexture.magFilter = LinearFilter;
    this.volumeTexture.generateMipmaps = false;

    this.volumeTexture.needsUpdate = true;

    this.maskChannelIndex = -1;
    this.maskAlpha = 1.0;

    // create Lut textures
    // empty array
    var lutData = new Uint8Array(256 * 4 * 4).fill(1);
    const lut0 = new DataTexture(lutData, 256, 4, RGBAFormat, UnsignedByteType);
    lut0.minFilter = lut0.magFilter = LinearFilter;
    lut0.needsUpdate = true;
    this.pathTracingUniforms.g_lutTexture.value = lut0;

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
        "#version 300 es",

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
        "#version 300 es",

        "precision highp float;",
        "precision highp int;",
        "precision highp sampler2D;",

        "uniform sampler2D tTexture0;",
        "in vec2 vUv;",
        "out vec4 out_FragColor;",

        "void main()",
        "{",
        "out_FragColor = texture(tTexture0, vUv);",
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
        "#version 300 es",

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
        "#version 300 es",

        "precision highp float;",
        "precision highp int;",
        "precision highp sampler2D;",

        "uniform float gInvExposure;",
        "uniform sampler2D tTexture0;",
        "in vec2 vUv;",
        "out vec4 out_FragColor;",

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

        "out_FragColor = pixelColor;", // sqrt(pixelColor);',
        //'out_FragColor = pow(pixelColor, vec4(1.0/2.2));',
        "}",
      ].join("\n"),
    };

    this.pathTracingGeometry = new PlaneBufferGeometry(2, 2);

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

    this.screenTextureGeometry = new PlaneBufferGeometry(2, 2);

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

    this.screenOutputGeometry = new PlaneBufferGeometry(2, 2);

    this.screenOutputMaterial = new ShaderMaterial({
      uniforms: this.screenOutputShader.uniforms,
      vertexShader: this.screenOutputShader.vertexShader,
      fragmentShader: this.screenOutputShader.fragmentShader,
      depthWrite: false,
      depthTest: false,
    });

    this.denoiseShaderUniforms = denoiseShaderUniforms();
    this.screenOutputDenoiseMaterial = new ShaderMaterial({
      uniforms: this.denoiseShaderUniforms,
      vertexShader: denoiseVertexShaderSrc,
      fragmentShader: denoiseFragmentShaderSrc,
      depthWrite: false,
      depthTest: false,
    });

    this.screenOutputMaterial.uniforms.tTexture0.value = this.pathTracingRenderTarget.texture;
    this.screenOutputDenoiseMaterial.uniforms.tTexture0.value = this.pathTracingRenderTarget.texture;

    this.screenOutputMesh = new Mesh(this.screenOutputGeometry, this.screenOutputMaterial);

    this.gradientDelta = 1.0 / Math.max(sx, Math.max(sy, sz));
    const InvGradientDelta = 1.0 / this.gradientDelta; // a voxel count...

    this.pathTracingUniforms.gGradientDeltaX.value = new Vector3(this.gradientDelta, 0, 0);
    this.pathTracingUniforms.gGradientDeltaY.value = new Vector3(0, this.gradientDelta, 0);
    this.pathTracingUniforms.gGradientDeltaZ.value = new Vector3(0, 0, this.gradientDelta);
    // can this be a per-x,y,z value?
    this.pathTracingUniforms.gInvGradientDelta.value = InvGradientDelta; // a voxel count
    this.pathTracingUniforms.gGradientFactor.value = 50.0; // related to voxel counts also

    this.setRayStepSizes(1.0, 1.0);

    // bounds will go from 0 to PhysicalSize
    const PhysicalSize = volume.normalizedPhysicalSize;

    this.pathTracingUniforms.gInvAaBbMax.value = new Vector3(
      1.0 / PhysicalSize.x,
      1.0 / PhysicalSize.y,
      1.0 / PhysicalSize.z
    );
    this.updateClipRegion(0, 1, 0, 1, 0, 1);

    this.updateLightsSecondary();
  }

  cleanup() {
    if (this.volumeTexture) {
      this.volumeTexture.dispose();
      this.volumeTexture = null;
    }
  }

  setRenderUpdateListener(callback) {
    this.renderUpdateListener = callback;
  }

  resetProgress() {
    if (this.sampleCounter !== 0 && this.renderUpdateListener) {
      this.renderUpdateListener(0);
    }
    this.sampleCounter = 0;
  }

  setVisible(isVisible) {
    // this.visible = isVisible;
  }

  doRender(canvas) {
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
    let myup = new Vector3().copy(cam.up);
    // don't rotate this vector.  we are using translation as the pivot point of the object, and THEN rotating.
    let mypos = new Vector3().copy(cam.position);

    // apply volume translation and rotation:
    // rotate camera.up, camera.direction, and camera position by inverse of volume's modelview
    const m = new Matrix4().makeRotationFromQuaternion(new Quaternion().setFromEuler(this.rotation).inverse());
    mypos.applyMatrix4(m);
    mypos.sub(this.translation);
    myup.applyMatrix4(m);
    mydir.applyMatrix4(m);

    this.pathTracingUniforms.gCamera.value.m_isOrtho = cam.isOrthographicCamera ? 1 : 0;
    this.pathTracingUniforms.gCamera.value.m_from.copy(mypos);
    this.pathTracingUniforms.gCamera.value.m_N.copy(mydir);
    this.pathTracingUniforms.gCamera.value.m_U
      .crossVectors(this.pathTracingUniforms.gCamera.value.m_N, myup)
      .normalize();
    this.pathTracingUniforms.gCamera.value.m_V
      .crossVectors(this.pathTracingUniforms.gCamera.value.m_U, this.pathTracingUniforms.gCamera.value.m_N)
      .normalize();

    // the choice of y = scale/aspect or x = scale*aspect is made here to match up with the other raymarch volume
    const Scale = cam.isOrthographicCamera ? canvas.orthoScale : Math.tan((0.5 * cam.fov * Math.PI) / 180.0);

    const aspect = this.pathTracingUniforms.uResolution.value.x / this.pathTracingUniforms.uResolution.value.y;
    this.pathTracingUniforms.gCamera.value.m_screen.set(
      -Scale * aspect,
      Scale * aspect,
      // the "0" Y pixel will be at +Scale.
      Scale,
      -Scale
    );
    const scr = this.pathTracingUniforms.gCamera.value.m_screen;
    this.pathTracingUniforms.gCamera.value.m_invScreen.set(
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

  get3dObject() {
    return this.screenOutputMesh;
  }

  onChannelData(batch) {}

  setScale(scale) {
    this.scale = scale;
  }

  setRayStepSizes(primary, secondary) {
    // reset render if changed
    if (this.stepSizePrimaryRayVoxels !== primary || this.stepSizeSecondaryRayVoxels !== secondary) {
      this.resetProgress();
    }
    this.stepSizePrimaryRayVoxels = primary;
    this.stepSizeSecondaryRayVoxels = secondary;

    this.pathTracingUniforms.gStepSize.value = this.stepSizePrimaryRayVoxels * this.gradientDelta;
    this.pathTracingUniforms.gStepSizeShadow.value = this.stepSizeSecondaryRayVoxels * this.gradientDelta;
  }

  setTranslation(vec3xyz) {
    this.translation.copy(vec3xyz);
    this.resetProgress();
  }

  setRotation(eulerXYZ) {
    this.rotation.copy(eulerXYZ);
    this.resetProgress();
  }

  setOrthoScale(value) {}

  setGamma(gmin, glevel, gmax) {}

  setFlipAxes(flipX, flipY, flipZ) {
    this.pathTracingUniforms.flipVolume.value = new Vector3(flipX, flipY, flipZ);
    // TODO: only reset if changed!
    this.resetProgress();
  }

  setResolution(x, y) {
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

  setPixelSamplingRate(rate) {
    this.pixelSamplingRate = rate;
    this.setResolution(this.fullTargetResolution.x, this.fullTargetResolution.y);
    this.resetProgress();
  }

  setDensity(density) {
    this.pathTracingUniforms.gDensityScale.value = density * 150.0;
    this.resetProgress();
  }

  // TODO brightness and exposure should be the same thing? or gamma?
  setBrightness(brightness) {
    // convert to an exposure value
    if (brightness === 1.0) {
      brightness = 0.999;
    }
    this.updateExposure(brightness);
  }

  // -0.5 .. 0.5
  setAxisClip(axis, minval, maxval, isOrthoAxis) {
    this.bounds.bmax[axis] = maxval;
    this.bounds.bmin[axis] = minval;
    const PhysicalSize = this.volume.normalizedPhysicalSize;
    this.pathTracingUniforms.gClippedAaBbMin.value = new Vector3(
      this.bounds.bmin.x * PhysicalSize.x,
      this.bounds.bmin.y * PhysicalSize.y,
      this.bounds.bmin.z * PhysicalSize.z
    );
    this.pathTracingUniforms.gClippedAaBbMax.value = new Vector3(
      this.bounds.bmax.x * PhysicalSize.x,
      this.bounds.bmax.y * PhysicalSize.y,
      this.bounds.bmax.z * PhysicalSize.z
    );
    this.resetProgress();
  }

  setChannelAsMask(channelIndex) {
    if (!this.volume.channels[channelIndex] || !this.volume.channels[channelIndex].loaded) {
      return false;
    }
    if (this.maskChannelIndex !== channelIndex) {
      this.maskChannelIndex = channelIndex;
      this.updateVolumeData4();
      this.resetProgress();
    }
  }

  setMaskAlpha(maskAlpha) {
    this.maskAlpha = maskAlpha;
    this.updateVolumeData4();
    this.resetProgress();
  }

  setOrthoThickness(value) {}

  setIsOrtho(isOrthoAxis) {
    this.pathTracingUniforms.gCamera.value.m_isOrtho = isOrthoAxis ? 1 : 0;
    this.resetProgress();
  }

  //////////////////////////////////////////
  //////////////////////////////////////////

  onStartControls() {
    this.cameraIsMoving = true;
  }

  onChangeControls() {
    // this.cameraIsMoving = true;
  }

  onEndControls() {
    this.cameraIsMoving = false;
    this.resetProgress();
  }

  viewpointMoved() {
    this.resetProgress();
  }

  updateActiveChannels(image) {
    var ch = [-1, -1, -1, -1];
    var activeChannel = 0;
    var NC = this.volume.num_channels;
    const maxch = 4;
    for (let i = 0; i < NC && activeChannel < maxch; ++i) {
      if (image.isVolumeChannelEnabled(i) && image.getChannel(i).loaded) {
        ch[activeChannel] = i;
        activeChannel++;
      }
    }

    let unchanged = ch.every((elem, index) => {
      return elem === this.viewChannels[index];
    }, this);
    if (unchanged) {
      return;
    }

    this.pathTracingUniforms.g_nChannels.value = activeChannel;

    this.viewChannels = ch;
    // update volume data according to channels selected.
    this.updateVolumeData4();
    this.resetProgress();
    this.updateLuts();
    this.updateMaterial(image);

    // console.log(this.pathTracingUniforms);
  }

  updateVolumeData4() {
    var sx = this.volume.x,
      sy = this.volume.y,
      sz = this.volume.z;

    var data = new Uint8Array(sx * sy * sz * 4);
    data.fill(0);

    for (var i = 0; i < 4; ++i) {
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

  updateLuts() {
    for (let i = 0; i < this.pathTracingUniforms.g_nChannels.value; ++i) {
      const channel = this.viewChannels[i];
      this.pathTracingUniforms.g_lutTexture.value.image.data.set(this.volume.channels[channel].lut, i * 256 * 4);

      this.pathTracingUniforms.g_intensityMax.value.setComponent(
        i,
        this.volume.channels[channel].histogram.dataMax / 255.0
      );
      this.pathTracingUniforms.g_intensityMin.value.setComponent(
        i,
        this.volume.channels[channel].histogram.dataMin / 255.0
      );
    }
    this.pathTracingUniforms.g_lutTexture.value.needsUpdate = true;

    this.resetProgress();
  }

  // image is a material interface that supports per-channel color, spec,
  // emissive, glossiness
  updateMaterial(image) {
    for (let c = 0; c < this.viewChannels.length; ++c) {
      let i = this.viewChannels[c];
      if (i > -1) {
        this.pathTracingUniforms.g_diffuse.value[c] = new Vector3()
          .fromArray(image.getChannelColor(i))
          .multiplyScalar(1.0 / 255.0);
        this.pathTracingUniforms.g_specular.value[c] = new Vector3()
          .fromArray(image.specular[i])
          .multiplyScalar(1.0 / 255.0);
        this.pathTracingUniforms.g_emissive.value[c] = new Vector3()
          .fromArray(image.emissive[i])
          .multiplyScalar(1.0 / 255.0);
        this.pathTracingUniforms.g_glossiness.value[c] = image.glossiness[i];
      }
    }
    this.resetProgress();
  }

  updateShadingMethod(brdf) {
    this.pathTracingUniforms.gShadingType.value = brdf;
    this.resetProgress();
  }

  updateShowLights(showlights) {
    this.pathTracingUniforms.uShowLights.value = showlights;
    this.resetProgress();
  }

  updateExposure(e) {
    // 1.0 causes division by zero.
    if (e > 0.99999) {
      e = 0.99999;
    }
    this.screenOutputMaterial.uniforms.gInvExposure.value = 1.0 / (1.0 - e) - 1.0;
    this.screenOutputDenoiseMaterial.uniforms.gInvExposure.value = 1.0 / (1.0 - e) - 1.0;
    this.resetProgress();
  }

  updateCamera(fov, focalDistance, apertureSize) {
    this.pathTracingUniforms.gCamera.value.m_apertureSize = apertureSize;
    this.pathTracingUniforms.gCamera.value.m_focalDistance = focalDistance;

    this.resetProgress();
  }

  updateLights(state) {
    // 0th light in state array is sphere light
    this.pathTracingUniforms.gLights.value[0].m_colorTop = new Vector3().copy(state[0].m_colorTop);
    this.pathTracingUniforms.gLights.value[0].m_colorMiddle = new Vector3().copy(state[0].m_colorMiddle);
    this.pathTracingUniforms.gLights.value[0].m_colorBottom = new Vector3().copy(state[0].m_colorBottom);

    // 1st light in state array is area light
    this.pathTracingUniforms.gLights.value[1].m_color = new Vector3().copy(state[1].m_color);
    this.pathTracingUniforms.gLights.value[1].m_theta = state[1].m_theta;
    this.pathTracingUniforms.gLights.value[1].m_phi = state[1].m_phi;
    this.pathTracingUniforms.gLights.value[1].m_distance = state[1].m_distance;
    this.pathTracingUniforms.gLights.value[1].m_width = state[1].m_width;
    this.pathTracingUniforms.gLights.value[1].m_height = state[1].m_height;

    this.updateLightsSecondary();

    this.resetProgress();
  }

  updateLightsSecondary(cameraMatrix) {
    const PhysicalSize = this.volume.normalizedPhysicalSize;
    const bbctr = new Vector3(PhysicalSize.x * 0.5, PhysicalSize.y * 0.5, PhysicalSize.z * 0.5);

    for (let i = 0; i < 2; ++i) {
      let lt = this.pathTracingUniforms.gLights.value[i];
      lt.update(bbctr, cameraMatrix);
    }
  }

  updateClipRegion(xmin, xmax, ymin, ymax, zmin, zmax) {
    this.bounds = {
      bmin: new Vector3(xmin - 0.5, ymin - 0.5, zmin - 0.5),
      bmax: new Vector3(xmax - 0.5, ymax - 0.5, zmax - 0.5),
    };
    const PhysicalSize = this.volume.normalizedPhysicalSize;
    this.pathTracingUniforms.gClippedAaBbMin.value = new Vector3(
      xmin * PhysicalSize.x - 0.5 * PhysicalSize.x,
      ymin * PhysicalSize.y - 0.5 * PhysicalSize.y,
      zmin * PhysicalSize.z - 0.5 * PhysicalSize.z
    );
    this.pathTracingUniforms.gClippedAaBbMax.value = new Vector3(
      xmax * PhysicalSize.x - 0.5 * PhysicalSize.x,
      ymax * PhysicalSize.y - 0.5 * PhysicalSize.y,
      zmax * PhysicalSize.z - 0.5 * PhysicalSize.z
    );
    this.resetProgress();
  }
}

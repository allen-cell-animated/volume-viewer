import {
  Color,
  DataTexture,
  RedFormat,
  UnsignedByteType,
  ClampToEdgeWrapping,
  Scene,
  OrthographicCamera,
  WebGLRenderTarget,
  RGBAFormat,
  ShaderMaterial,
  ShaderMaterialParameters,
  Mesh,
  PlaneGeometry,
  WebGLRenderer,
  OneFactor,
  CustomBlending,
  MaxEquation,
  Texture,
  LinearFilter,
  Vector2,
} from "three";

import Channel from "./Channel.js";
import { renderToBufferVertShader } from "./constants/basicShaders.js";
import fuseShaderSrcUI from "./constants/shaders/fuseUI.frag";
import fuseShaderSrcF from "./constants/shaders/fuseF.frag";
import fuseShaderSrcI from "./constants/shaders/fuseI.frag";
import type { FuseChannel, NumberType } from "./types.js";

// This is the owner of the fused RGBA volume texture atlas, and the mask texture atlas.
// This module is responsible for updating the fused texture, given the read-only volume channel data.
export default class FusedChannelData {
  public width: number;
  public height: number;

  public maskTexture: DataTexture;

  private fuseRequested: FuseChannel[] | null;
  private channelsDataToFuse: Channel[];

  private fuseGeometry: PlaneGeometry;
  private fuseMaterialF: ShaderMaterial;
  private fuseMaterialUI: ShaderMaterial;
  private fuseMaterialI: ShaderMaterial;

  private fuseMaterialProps: Partial<ShaderMaterialParameters>;
  private fuseScene: Scene;
  private quadCamera: OrthographicCamera;
  private fuseRenderTarget: WebGLRenderTarget;

  constructor(atlasX: number, atlasY: number) {
    // allow for resizing
    this.width = atlasX;
    this.height = atlasY;

    this.maskTexture = new DataTexture(
      new Uint8ClampedArray(this.width * this.height).fill(255),
      this.width,
      this.height,
      RedFormat,
      UnsignedByteType
    );
    this.maskTexture.generateMipmaps = false;
    this.maskTexture.magFilter = LinearFilter;
    this.maskTexture.minFilter = LinearFilter;
    this.maskTexture.wrapS = ClampToEdgeWrapping;
    this.maskTexture.wrapT = ClampToEdgeWrapping;
    // for single-channel tightly packed array data:
    this.maskTexture.unpackAlignment = 1;

    this.fuseRequested = null;
    this.channelsDataToFuse = [];

    this.fuseScene = new Scene();
    this.quadCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.fuseRenderTarget = new WebGLRenderTarget(this.width, this.height, {
      minFilter: LinearFilter,
      magFilter: LinearFilter,
      format: RGBAFormat,
      type: UnsignedByteType, // FloatType ?
      depthBuffer: false,
      stencilBuffer: false,
      generateMipmaps: false,
      wrapS: ClampToEdgeWrapping,
      wrapT: ClampToEdgeWrapping,
    });

    this.fuseMaterialProps = {
      vertexShader: renderToBufferVertShader,
      depthTest: false,
      depthWrite: false,
      blending: CustomBlending,
      blendSrc: OneFactor,
      blendDst: OneFactor,
      blendEquation: MaxEquation,
    };
    // this exists to keep one reference alive
    // to make sure we do not fully delete and re-create
    // a shader every time.
    this.fuseMaterialF = this.setupFuseMaterial(fuseShaderSrcF);
    this.fuseMaterialUI = this.setupFuseMaterial(fuseShaderSrcUI);
    this.fuseMaterialI = this.setupFuseMaterial(fuseShaderSrcI);
    this.fuseMaterialF.needsUpdate = true;
    this.fuseMaterialUI.needsUpdate = true;
    this.fuseMaterialI.needsUpdate = true;
    this.fuseGeometry = new PlaneGeometry(2, 2);
  }

  private setupFuseMaterial(fragShaderSrc: string) {
    return new ShaderMaterial({
      uniforms: {
        lutSampler: {
          value: null,
        },
        lutMinMax: { value: new Vector2(0, 255) },
        srcTexture: {
          value: null,
        },
      },
      fragmentShader: fragShaderSrc,
      ...this.fuseMaterialProps,
    });
  }

  getFusedTexture(): Texture {
    return this.fuseRenderTarget.texture;
  }

  public cleanup(): void {
    this.fuseScene.clear();
    this.maskTexture.dispose();
  }

  private getShader(dtype: NumberType): ShaderMaterial {
    switch (dtype) {
      case "float32":
        return this.fuseMaterialF;
      case "uint8":
      case "uint16":
      case "uint32":
        return this.fuseMaterialUI;
      case "int8":
      case "int16":
      case "int32":
        return this.fuseMaterialI;
      default:
        throw new Error("Unsupported data type for fuse shader");
    }
  }

  fuse(combination: FuseChannel[], channels: Channel[]): void {
    // we can fuse if we have any loaded channels that are showing.
    // actually, we can fuse if no channels are showing (but they are loaded), too.
    let canFuse = false;
    for (let i = 0; i < combination.length; ++i) {
      const c = combination[i];
      const idx = c.chIndex;
      if (channels[idx].loaded) {
        // set the lut in this fuse combination.
        // can optimize by calling combineLuts more lazily
        c.lut = channels[idx].combineLuts(c.rgbColor, c.lut);
        canFuse = true;
        //break;
      }
    }
    if (!canFuse) {
      this.channelsDataToFuse = [];
      this.fuseRequested = [];
      return;
    }

    this.fuseRequested = combination;
    this.channelsDataToFuse = channels;
  }

  public gpuFuse(renderer: WebGLRenderer): void {
    const combination = this.fuseRequested;
    const channels = this.channelsDataToFuse;
    if (!combination) {
      return;
    }

    // webgl draw one mesh per channel to fuse.  clear texture to 0,0,0,0

    this.fuseScene.traverse((node) => {
      if (node instanceof Mesh) {
        // materials were holding references to the channel data textures
        // causing mem leak so we must dispose before clearing the scene
        node.material.dispose();
      }
    });
    this.fuseScene.clear();
    for (let i = 0; i < combination.length; ++i) {
      if (combination[i].rgbColor) {
        const chIndex = combination[i].chIndex;
        if (!channels[chIndex].loaded) {
          continue;
        }
        // add a draw call per channel here.
        // must clone the material to keep a unique set of uniforms
        const mat = this.getShader(channels[chIndex].dtype).clone();
        mat.uniforms.lutSampler.value = channels[chIndex].lutTexture;
        // the lut texture is spanning only the data range of the channel, not the datatype range
        mat.uniforms.lutMinMax.value = new Vector2(channels[chIndex].rawMin, channels[chIndex].rawMax);
        mat.uniforms.srcTexture.value = channels[chIndex].dataTexture;
        this.fuseScene.add(new Mesh(this.fuseGeometry, mat));
      }
    }
    renderer.setRenderTarget(this.fuseRenderTarget);
    renderer.autoClearColor = true;
    const prevClearColor = new Color();
    renderer.getClearColor(prevClearColor);
    const prevClearAlpha = renderer.getClearAlpha();
    renderer.setClearColor(0x000000, 0);
    renderer.render(this.fuseScene, this.quadCamera);
    renderer.setRenderTarget(null);
    renderer.setClearColor(prevClearColor, prevClearAlpha);
    // "dirty flag"
    this.fuseRequested = null;
  }

  // currently only one channel can be selected to participate as a mask
  public setChannelAsMask(idx: number, channel: Channel): boolean {
    if (!channel || !channel.loaded) {
      return false;
    }
    // binarize the data
    // (TODO consider whether it should be binarized or not?)
    const datacopy = new Uint8ClampedArray(channel.imgData.data.length);
    for (let i = 0; i < channel.imgData.data.length; i++) {
      datacopy[i] = channel.imgData.data[i] > 0 ? 255 : 0;
    }
    const maskData = {
      data: datacopy,
      width: this.width,
      height: this.height,
      colorSpace: "srgb" as PredefinedColorSpace,
    };
    this.maskTexture.image = maskData;
    this.maskTexture.needsUpdate = true;
    return true;
  }
}

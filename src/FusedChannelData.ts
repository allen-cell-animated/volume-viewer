import {
  DataTexture,
  LuminanceFormat,
  NearestFilter,
  UnsignedByteType,
  ClampToEdgeWrapping,
  Scene,
  OrthographicCamera,
  WebGLRenderTarget,
  RGBAFormat,
  ShaderMaterial,
  Mesh,
  PlaneBufferGeometry,
  WebGLRenderer,
  OneFactor,
  CustomBlending,
  MaxEquation,
  UniformsUtils,
  Texture,
} from "three";
import { LinearFilter } from "three/src/constants";

import Channel from "./Channel";
import { fuseShaderSrc, fuseVertexShaderSrc } from "./constants/fuseShader";
import { FuseChannel } from "./types";

// This is the owner of the fused RGBA volume texture atlas, and the mask texture atlas.
// This module is responsible for updating the fused texture, given the read-only volume channel data.
export default class FusedChannelData {
  private width: number;
  private height: number;

  public maskTexture: DataTexture;

  private fuseRequested: FuseChannel[] | null;
  private channelsDataToFuse: Channel[];

  private fuseGeometry: PlaneBufferGeometry;
  private fuseMaterial: ShaderMaterial;
  private fuseScene: Scene;
  private quadCamera: OrthographicCamera;
  private fuseRenderTarget: WebGLRenderTarget;

  constructor(atlasX: number, atlasY: number) {
    // allow for resizing
    this.width = atlasX;
    this.height = atlasY;

    this.maskTexture = new DataTexture(
      new Uint8ClampedArray(this.width * this.height),
      this.width,
      this.height,
      LuminanceFormat,
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
      minFilter: NearestFilter,
      magFilter: NearestFilter,
      format: RGBAFormat,
      type: UnsignedByteType, // FloatType ?
      depthBuffer: false,
      stencilBuffer: false,
    });
    this.fuseRenderTarget.texture.generateMipmaps = false;
    this.fuseRenderTarget.texture.generateMipmaps = false;
    this.fuseRenderTarget.texture.magFilter = LinearFilter;
    this.fuseRenderTarget.texture.minFilter = LinearFilter;
    this.fuseRenderTarget.texture.wrapS = ClampToEdgeWrapping;
    this.fuseRenderTarget.texture.wrapT = ClampToEdgeWrapping;

    this.fuseMaterial = new ShaderMaterial({
      uniforms: UniformsUtils.merge([
        {
          lutSampler: {
            type: "t",
            value: null,
          },
          srcTexture: {
            type: "t",
            value: null,
          },
        },
      ]),
      vertexShader: fuseVertexShaderSrc,
      fragmentShader: fuseShaderSrc,
      depthTest: false,
      depthWrite: false,
      blending: CustomBlending,
      blendSrc: OneFactor,
      blendDst: OneFactor,
      blendEquation: MaxEquation,
    });
    this.fuseGeometry = new PlaneBufferGeometry(2, 2);
  }

  getFusedTexture(): Texture {
    return this.fuseRenderTarget.texture;
  }

  public cleanup(): void {
    this.fuseScene.clear();
    this.maskTexture.dispose();
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
    this.fuseScene.clear();
    for (let i = 0; i < combination.length; ++i) {
      if (combination[i].rgbColor) {
        const chIndex = combination[i].chIndex;
        // add a draw call per channel here.
        // TODO create these at channel creation time!
        const mat = this.fuseMaterial.clone();
        mat.uniforms.lutSampler.value = channels[chIndex].lutTexture;
        mat.uniforms.srcTexture.value = channels[chIndex].dataTexture;
        this.fuseScene.add(new Mesh(this.fuseGeometry, mat));
      }
    }
    renderer.setRenderTarget(this.fuseRenderTarget);
    renderer.autoClearColor = true;
    renderer.setClearColor(0x000000, 0);
    renderer.render(this.fuseScene, this.quadCamera);
    renderer.setRenderTarget(null);
    // "dirty flag"
    this.fuseRequested = null;
  }

  // currently only one channel can be selected to participate as a mask
  public setChannelAsMask(idx: number, channel: Channel): boolean {
    if (!channel || !channel.loaded) {
      return false;
    }
    const datacopy = channel.imgData.data.buffer.slice(0);
    const maskData = {
      data: new Uint8ClampedArray(datacopy),
      width: this.width,
      height: this.height,
    };
    this.maskTexture.image = maskData;
    this.maskTexture.needsUpdate = true;
    return true;
  }
}

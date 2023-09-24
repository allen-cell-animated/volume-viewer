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
  public width: number;
  public height: number;

  public maskTexture: DataTexture;

  private fuseRequested: FuseChannel[] | null;
  private channelsDataToFuse: Channel[];

  private fuseGeometry: PlaneGeometry;
  private fuseMaterial: ShaderMaterial;
  private fuseMaterialProps: Partial<ShaderMaterialParameters>;
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
      vertexShader: fuseVertexShaderSrc,
      fragmentShader: fuseShaderSrc,
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
    this.fuseMaterial = new ShaderMaterial({
      uniforms: {
        lutSampler: {
          value: null,
        },
        srcTexture: {
          value: null,
        },
      },
      ...this.fuseMaterialProps,
    });
    this.fuseGeometry = new PlaneGeometry(2, 2);
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

    this.fuseScene.traverse(function (node) {
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
        // add a draw call per channel here.
        // TODO create these at channel creation time!
        const mat = new ShaderMaterial({
          uniforms: {
            lutSampler: {
              value: channels[chIndex].lutTexture,
            },
            srcTexture: {
              value: channels[chIndex].dataTexture,
            },
          },
          ...this.fuseMaterialProps,
        });

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
    const datacopy = channel.imgData.data.buffer.slice(0);
    const maskData = {
      data: new Uint8ClampedArray(datacopy),
      width: this.width,
      height: this.height,
      colorSpace: "srgb" as PredefinedColorSpace,
    };
    this.maskTexture.image = maskData;
    this.maskTexture.needsUpdate = true;
    return true;
  }
}

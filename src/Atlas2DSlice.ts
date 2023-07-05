import {
  Box3,
  Box3Helper,
  BufferAttribute,
  BufferGeometry,
  Color,
  DoubleSide,
  Euler,
  Group,
  LineBasicMaterial,
  LineSegments,
  Material,
  Matrix4,
  Mesh,
  PlaneGeometry,
  ShaderMaterial,
  ShapeGeometry,
  Vector2,
  Vector3,
} from "three";

import FusedChannelData from "./FusedChannelData";
import { Volume } from ".";
import Channel from "./Channel";
import { ThreeJsPanel } from "./ThreeJsPanel";
import { VolumeRenderImpl } from "./VolumeRenderImpl";

import { Bounds, FuseChannel } from "./types";
import { sliceFragmentShaderSrc, sliceShaderUniforms, sliceVertexShaderSrc } from "./constants/volumeSliceShader";
import RayMarchedAtlasVolume from "./RayMarchedAtlasVolume";

const BOUNDING_BOX_DEFAULT_COLOR = new Color(0xffff00);

/**
 * Creates a plane that renders a 2D XY slice of volume atlas data.
 */
export default class Atlas2DSlice extends RayMarchedAtlasVolume {

  constructor(volume: Volume) {
    super(volume);
    this.uniforms = sliceShaderUniforms;
    this.setUniform("Z_SLICE", Math.floor(volume.z / 2));
  }

  // Overload geometry to create plane instead of a cube mesh
  protected createGeometry(): [ShapeGeometry, Mesh<BufferGeometry, Material>] {
    const geom = new PlaneGeometry(1.0, 1.0);
    const mesh: Mesh<BufferGeometry, Material> = new Mesh(geom);
    mesh.name = "Plane";

    // shader,vtx and frag.
    const vtxsrc = sliceVertexShaderSrc;
    const fgmtsrc = sliceFragmentShaderSrc;

    const threeMaterial = new ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vtxsrc,
      fragmentShader: fgmtsrc,
      transparent: true,
      depthTest: true,
      depthWrite: false,
    });

    mesh.material = threeMaterial;
    return [geom, mesh];
  }

  public setZSlice(slice: number): void {
    // Clamp the slice value
    slice = Math.floor(Math.max(0, Math.min(slice, this.volume.z - 1)));
    this.setUniform("Z_SLICE", slice);
  }
}

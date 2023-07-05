import {
  BufferGeometry,
  Material,
  Mesh,
  PlaneGeometry,
  ShaderMaterial,
  ShapeGeometry,

} from "three";
import { Volume } from ".";
import { sliceFragmentShaderSrc, sliceVertexShaderSrc } from "./constants/volumeSliceShader";
import RayMarchedAtlasVolume from "./RayMarchedAtlasVolume";
import { rayMarchingShaderUniforms } from "./constants/volumeRayMarchShader";

/**
 * Creates a plane that renders a 2D XY slice of volume atlas data.
 */
export default class Atlas2DSlice extends RayMarchedAtlasVolume {

  constructor(volume: Volume) {
    super(volume);
    this.setUniform("Z_SLICE", Math.floor(volume.z / 2));
  }

  // Overload geometry to create plane instead of a cube mesh
  protected createGeometry(uniforms: typeof rayMarchingShaderUniforms): [ShapeGeometry, Mesh<BufferGeometry, Material>] {
    const geom = new PlaneGeometry(1.0, 1.0);
    const mesh: Mesh<BufferGeometry, Material> = new Mesh(geom);
    mesh.name = "Plane";

    // shader,vtx and frag.
    const vtxsrc = sliceVertexShaderSrc;
    const fgmtsrc = sliceFragmentShaderSrc;

    const threeMaterial = new ShaderMaterial({
      uniforms: uniforms,  // TODO: refactor into param
      vertexShader: vtxsrc,
      fragmentShader: fgmtsrc,
      transparent: true,
      depthTest: true,
      depthWrite: false,
    });

    mesh.material = threeMaterial;
    return [geom, mesh];
  }

  public setZSlice(_slice: number): boolean {
    // Clamp the slice value
    _slice = Math.floor(_slice);
    if (_slice < 0 || _slice > this.volume.z - 1) {
      return false;
    }
    this.setUniform("Z_SLICE", _slice);
    this.geometryMesh.material.needsUpdate = true;
    return true;
  }
}

import { Vector2, Vector3, Matrix4, Texture } from "three";
import sliceVertexShader from "./shaders/slice.vert";
import sliceFragShader from "./shaders/slice.frag";
import { rayMarchingShaderUniforms } from "./volumeRayMarchShader";

export const sliceVertexShaderSrc = sliceVertexShader;

export const sliceFragmentShaderSrc = sliceFragShader;

let uniforms = rayMarchingShaderUniforms;
uniforms["Z_SLICE"] =  {
  type: "i",
  value: 50,
};
export const sliceShaderUniforms = uniforms;


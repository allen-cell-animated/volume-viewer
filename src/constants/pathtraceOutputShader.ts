import pathtraceOutputFragmentShader from "./shaders/pathtrace_output.frag";
export const pathtraceOutputFragmentShaderSrc = pathtraceOutputFragmentShader;

export const pathtraceOutputShaderUniforms = () => ({
  gInvExposure: {
    type: "f",
    value: 1.0 / (1.0 - 0.75),
  },
  tTexture0: {
    type: "t",
    value: null,
  },
});

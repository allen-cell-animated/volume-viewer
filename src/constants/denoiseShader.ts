import { Vector2, UniformsUtils } from "three";

import denoiseFragmentShader from "./shaders/pathtrace_denoise.frag";
export const denoiseFragmentShaderSrc = denoiseFragmentShader;

const DENOISE_WINDOW_RADIUS = 3;
export function denoiseShaderUniforms(): Record<string, { type: string; value: unknown }> {
  return UniformsUtils.merge([
    {
      gInvExposure: {
        type: "f",
        value: 1.0 / (1.0 - 0.75),
      },
      gDenoiseWindowRadius: {
        type: "i",
        value: DENOISE_WINDOW_RADIUS,
      },
      gDenoiseNoise: {
        type: "f",
        value: 0.05,
      },
      gDenoiseInvWindowArea: {
        type: "f",
        value: 1.0 / ((2.0 * DENOISE_WINDOW_RADIUS + 1.0) * (2.0 * DENOISE_WINDOW_RADIUS + 1.0)),
      },
      gDenoiseWeightThreshold: {
        type: "f",
        value: 0.1,
      },
      gDenoiseLerpThreshold: {
        type: "f",
        value: 0.0,
      },
      gDenoiseLerpC: {
        type: "f",
        value: 0.01,
      },
      gDenoisePixelSize: {
        type: "v2",
        value: new Vector2(1, 1),
      },
      tTexture0: {
        type: "t",
        value: null,
      },
    },
  ]);
}

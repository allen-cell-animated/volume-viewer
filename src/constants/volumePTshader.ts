import { Texture, Vector2, Vector3, Vector4 } from "three";
import { Light, AREA_LIGHT, SKY_LIGHT } from "../Light";
import pathTraceVertexShader from "./shaders/pathtrace.vert";
import pathTraceFragmentShader from "./shaders/pathtrace.frag";

// threejs passthrough vertex shader for fullscreen quad
export const pathTracingVertexShaderSrc = pathTraceVertexShader;
export const pathTracingFragmentShaderSrc = pathTraceFragmentShader;

// Must match values in shader code above.
const SHADERTYPE_BRDF = 0;
// const ShaderType_Phase = 1;
// const ShaderType_Mixed = 2;

export const pathTracingUniforms = () => {
  return {
    tPreviousTexture: { type: "t", value: new Texture() },

    uSampleCounter: { type: "f", value: 0.0 },
    uFrameCounter: { type: "f", value: 1.0 },

    uResolution: { type: "v2", value: new Vector2() },

    ///////////////////////////
    gClippedAaBbMin: { type: "v3", value: new Vector3(0, 0, 0) },
    gClippedAaBbMax: { type: "v3", value: new Vector3(1, 1, 1) },
    gDensityScale: { type: "f", value: 50.0 },
    gStepSize: { type: "f", value: 1.0 },
    gStepSizeShadow: { type: "f", value: 1.0 },
    gInvAaBbMax: { type: "v3", value: new Vector3() },
    gNChannels: { type: "i", value: 0 },
    gShadingType: { type: "i", value: SHADERTYPE_BRDF },
    gGradientDeltaX: { type: "v3", value: new Vector3(0.01, 0, 0) },
    gGradientDeltaY: { type: "v3", value: new Vector3(0, 0.01, 0) },
    gGradientDeltaZ: { type: "v3", value: new Vector3(0, 0, 0.01) },
    gInvGradientDelta: { type: "f", value: 0.0 },
    // controls the amount of BRDF-like versus phase-function-like shading
    gGradientFactor: { type: "f", value: 0.25 },

    gCamera: {
      value: {
        // Camera struct
        mFrom: new Vector3(),
        mU: new Vector3(),
        mV: new Vector3(),
        mN: new Vector3(),
        mScreen: new Vector4(), // left, right, bottom, top
        mInvScreen: new Vector2(), // 1/w, 1/h
        mFocalDistance: 0.0,
        mApertureSize: 0.0,
        mIsOrtho: 0.0,
      },
    },
    gLights: {
      value: [new Light(SKY_LIGHT), new Light(AREA_LIGHT)],
    },

    volumeTexture: { type: "t", value: new Texture() },
    // per channel
    gLutTexture: { type: "t", value: new Texture() },
    gIntensityMax: { type: "v4", value: new Vector4(1, 1, 1, 1) },
    gIntensityMin: { type: "v4", value: new Vector4(0, 0, 0, 0) },
    gOpacity: { type: "1fv", value: [1, 1, 1, 1] },
    gEmissive: {
      type: "v3v",
      value: [new Vector3(0, 0, 0), new Vector3(0, 0, 0), new Vector3(0, 0, 0), new Vector3(0, 0, 0)],
    },
    gDiffuse: {
      type: "v3v",
      value: [new Vector3(1, 0, 0), new Vector3(0, 1, 0), new Vector3(0, 0, 1), new Vector3(1, 0, 1)],
    },
    gSpecular: {
      type: "v3v",
      value: [new Vector3(0, 0, 0), new Vector3(0, 0, 0), new Vector3(0, 0, 0), new Vector3(0, 0, 0)],
    },
    gGlossiness: { type: "1fv", value: [1, 1, 1, 1] },
    uShowLights: { type: "f", value: 0 },
    flipVolume: { type: "v3", value: new Vector3(1, 1, 1) },
  };
};

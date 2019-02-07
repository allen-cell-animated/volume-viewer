const DENOISE_WINDOW_RADIUS = 3;
export function denoiseShaderUniforms() {
    return THREE.UniformsUtils.merge([
        {
          gInvExposure: {
            type: "f",
            value: 1.0 / (1.0 - 0.75)
          },
          gDenoiseWindowRadius: {
            type: "i",
            value: DENOISE_WINDOW_RADIUS
          },
          gDenoiseNoise: {
            type: "f",
            value: 0.05
          },
          gDenoiseInvWindowArea: {
            type: "f",
            value: 1.0 / ((2.0 * DENOISE_WINDOW_RADIUS + 1.0) * (2.0 * DENOISE_WINDOW_RADIUS + 1.0))
          },
          gDenoiseWeightThreshold: {
            type: "f",
            value: 0.1
          },
          gDenoiseLerpThreshold: {
            type: "f",
            value: 0.0
          },
          gDenoiseLerpC: {
            type: "f",
            value: 0.01
          },
          gDenoisePixelSize: {
            type: "v2",
            value: new THREE.Vector2(1,1)
          },
          tTexture0: {
            type: "t",
            value: null
          }
        }
      ]);
}

export const denoiseVertexShaderSrc = `
#version 300 es

precision highp float;
precision highp int;

out vec2 vUv;

void main()
{
  vUv = uv;
  gl_Position = vec4( position, 1.0 );
}
`;

export const denoiseFragmentShaderSrc = `
#version 300 es

precision highp float;
precision highp int;
precision highp sampler2D;

uniform float gInvExposure;
uniform int gDenoiseWindowRadius;
uniform float gDenoiseNoise;
uniform float gDenoiseInvWindowArea;
uniform float gDenoiseWeightThreshold;
uniform float gDenoiseLerpThreshold;
uniform float gDenoiseLerpC;
uniform vec2 gDenoisePixelSize;

uniform sampler2D tTexture0;
in vec2 vUv;
out vec4 out_FragColor;

vec3 XYZtoRGB(vec3 xyz) {
  return vec3(
    3.240479f*xyz[0] - 1.537150f*xyz[1] - 0.498535f*xyz[2],
    -0.969256f*xyz[0] + 1.875991f*xyz[1] + 0.041556f*xyz[2],
    0.055648f*xyz[0] - 0.204043f*xyz[1] + 1.057311f*xyz[2]
  );
}

void main()
{
  vec4 pixelColor = texture(tTexture0, vUv);
  // TODO TONE MAP!!!!!!
  pixelColor.rgb = XYZtoRGB(pixelColor.rgb);

  pixelColor.rgb = 1.0-exp(-pixelColor.rgb*gInvExposure);
  pixelColor = clamp(pixelColor, 0.0, 1.0);

  /////////////////////
  /////////////////////
  /////////////////////
  /////////////////////
  //// DENOISING FILTER
  /////////////////////
  // see https://developer.download.nvidia.com/compute/cuda/1.1-Beta/x86_website/projects/imageDenoising/doc/imageDenoising.pdf
  /////////////////////
  vec4 clr00 = pixelColor;

  float fCount = 0.0;
  float SumWeights = 0.0;
  vec3 clr = vec3(0.0, 0.0, 0.0);

  vec2 uvsample = vUv;
  vec3 rgbsample;
  for (int i = -gDenoiseWindowRadius; i <= gDenoiseWindowRadius; i++) {
    for (int j = -gDenoiseWindowRadius; j <= gDenoiseWindowRadius; j++) {

      // boundary checking?
      vec3 clrIJ = texture(tTexture0, vUv + vec2(float(i)/gDenoisePixelSize.x, float(j)/gDenoisePixelSize.y)).rgb;
      //vec3 clrIJ = texelFetch(tTexture0, ivec2(gl_FragCoord.xy) + ivec2(i,j), 0).rgb;

      rgbsample = XYZtoRGB(clrIJ);
      // tone map!
      rgbsample = 1.0 - exp(-rgbsample * gInvExposure);
      rgbsample = clamp(rgbsample, 0.0, 1.0);

      clrIJ = rgbsample;

      float distanceIJ = (clr00.x-clrIJ.x)*(clr00.x-clrIJ.x) + (clr00.y-clrIJ.y)*(clr00.y-clrIJ.y) + (clr00.z-clrIJ.z)*(clr00.z-clrIJ.z);

      // gDenoiseNoise = 1/h^2
      //
      float weightIJ = exp(-(distanceIJ * gDenoiseNoise + float(i * i + j * j) * gDenoiseInvWindowArea));

      clr += (clrIJ * weightIJ);

      SumWeights += weightIJ;

      fCount += (weightIJ > gDenoiseWeightThreshold) ? gDenoiseInvWindowArea : 0.0;
    }
  }

  SumWeights = 1.0 / SumWeights;

  clr.rgb *= SumWeights;

  float LerpQ = (fCount > gDenoiseLerpThreshold) ? gDenoiseLerpC : 1.0f - gDenoiseLerpC;

  clr.rgb = mix(clr.rgb, clr00.rgb, LerpQ);
  clr.rgb = clamp(clr.rgb, 0.0, 1.0);

  out_FragColor = vec4(clr.rgb, clr00.a);
}
`;

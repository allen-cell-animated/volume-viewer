// threejs passthrough vertex shader for fullscreen quad
export const fuseVertexShaderSrc = `
precision highp float;
precision highp int;
out vec2 vUv;
void main()
{
  vUv = uv;
  gl_Position = vec4( position, 1.0 );
}
`;

export const fuseShaderSrcF = `
// precision highp float;
// precision highp int;
//precision highp uint;
// precision highp sampler2D;
// precision mediump isampler2D;
// precision mediump usampler2D;
// precision highp sampler3D;

// the lut texture is a 256x1 rgba texture for each channel
uniform sampler2D lutSampler;

uniform vec2 lutMinMax;

// src texture is the raw volume intensity data
uniform sampler2D srcTexture;

void main()
{
    ivec2 vUv = ivec2(int(gl_FragCoord.x), int(gl_FragCoord.y));

    float intensity = texelFetch(srcTexture, vUv, 0).r;

    float ilookup = float(float(intensity) - lutMinMax.x) / float(lutMinMax.y - lutMinMax.x);
    // apply lut to intensity:
    vec4 pix = texture(lutSampler, vec2(ilookup, 0.5));
    gl_FragColor = vec4(pix.xyz*pix.w, pix.w);
}
`;

export const fuseShaderSrcUI = `
// precision highp float;
// precision lowp int;
// //precision lowp uint;
// precision highp sampler2D;
// precision mediump isampler2D;
precision lowp usampler2D;
// precision highp sampler3D;

// the lut texture is a 256x1 rgba texture for each channel
uniform sampler2D lutSampler;

uniform vec2 lutMinMax;

// src texture is the raw volume intensity data
uniform usampler2D srcTexture;

void main()
{
    ivec2 vUv = ivec2(int(gl_FragCoord.x), int(gl_FragCoord.y));

    uint intensity = texelFetch(srcTexture, vUv, 0).r;

    float ilookup = float(float(intensity) - lutMinMax.x) / float(lutMinMax.y - lutMinMax.x);
    // apply lut to intensity:
    vec4 pix = texture(lutSampler, vec2(ilookup, 0.5));
    gl_FragColor = vec4(pix.xyz*pix.w, pix.w);
}
`;

export const fuseShaderSrcI = `
// precision highp float;
// precision highp int;
//precision highp uint;
// precision highp sampler2D;
// precision mediump isampler2D;
// precision mediump usampler2D;
// precision highp sampler3D;

// the lut texture is a 256x1 rgba texture for each channel
uniform sampler2D lutSampler;

uniform vec2 lutMinMax;

// src texture is the raw volume intensity data
uniform isampler2D srcTexture;

void main()
{
    ivec2 vUv = ivec2(int(gl_FragCoord.x), int(gl_FragCoord.y));

    int intensity = texelFetch(srcTexture, vUv, 0).r;

    float ilookup = float(float(intensity) - lutMinMax.x) / float(lutMinMax.y - lutMinMax.x);
    // apply lut to intensity:
    vec4 pix = texture(lutSampler, vec2(ilookup, 0.5));
    gl_FragColor = vec4(pix.xyz*pix.w, pix.w);
}
`;

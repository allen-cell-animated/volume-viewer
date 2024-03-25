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

export const fuseShaderSrc = `
precision highp float;
precision highp int;
precision highp sampler2D;
precision mediump usampler2D;
precision highp sampler3D;

// the lut texture is a 256x1 rgba texture for each channel
uniform sampler2D lutSampler;

uniform vec2 lutMinMax;

// src texture is the raw volume intensity data
#if FORMAT == 1 // FP
uniform sampler2D srcTexture;
#elif FORMAT == 2 // UINT
uniform usampler2D srcTexture;
#elif FORMAT == 3 // INT
uniform isampler2D srcTexture;
#endif

void main()
{
    ivec2 vUv = ivec2(int(gl_FragCoord.x), int(gl_FragCoord.y));

    // load from channel
    #if FORMAT == 1 // FP
    float intensity = texelFetch(srcTexture, vUv, 0).r;
    #elif FORMAT == 2 // UINT
    uint intensity = texelFetch(srcTexture, vUv, 0).r;
    #elif FORMAT == 3 // INT
    int intensity = texelFetch(srcTexture, vUv, 0).r;
    #endif

    float ilookup = float(float(intensity) - lutMinMax.x) / float(lutMinMax.y - lutMinMax.x);
    // apply lut to intensity:
    vec4 pix = texture(lutSampler, vec2(ilookup, 0.5));
    gl_FragColor = vec4(pix.xyz*pix.w, pix.w);
}
`;

precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;

// the lut texture is a 256x1 rgba texture for each channel
uniform sampler2D lutSampler;
// src texture is the raw volume intensity data
uniform sampler2D srcTexture;

void main()
{
    ivec2 vUv = ivec2(int(gl_FragCoord.x), int(gl_FragCoord.y));

    // load from channel
    float intensity = texelFetch(srcTexture, vUv, 0).r;

    // apply lut to intensity:
    vec4 pix = texture(lutSampler, vec2(intensity, 0.5));
    gl_FragColor = vec4(pix.xyz*pix.w, pix.w);
}

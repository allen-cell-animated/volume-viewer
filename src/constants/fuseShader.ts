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
precision highp sampler3D;

// the luttexture is a 256x4 rgba texture
// each row is a 256 element lookup table.
uniform sampler2D lutSampler;
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
`;

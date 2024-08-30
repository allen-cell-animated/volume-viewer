// "basic" shaders which perform simple functions and appear multiple times in the codebase.
// These are the only shaders defined outside a dedicated GLSL file to make extra sure they appear
// only once in the built package.

export const renderToBufferVertShader = `
precision highp float;
precision highp int;
out vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

export const copyImageFragShader = `
precision highp float;
precision highp int;
precision highp sampler2D;

in vec2 vUv;
uniform sampler2D image;

void main() {
  gl_FragColor = texture2D(image, vUv);
}
`;

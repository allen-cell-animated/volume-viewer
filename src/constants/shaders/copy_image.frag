precision highp float;
precision highp int;
precision highp sampler2D;

in vec2 vUv;
uniform sampler2D image;

void main() {
    gl_FragColor = texture2D(image, vUv);
}

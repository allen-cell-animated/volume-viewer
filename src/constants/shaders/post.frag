varying vec2 vUv;
uniform sampler2D image;

void main() {
    gl_FragColor = texture2D(image, vUv);
}

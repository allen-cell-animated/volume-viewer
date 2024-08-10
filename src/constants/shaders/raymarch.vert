// switch on high precision floats
#ifdef GL_ES
precision highp float;
#endif
varying vec3 pObj;
varying vec2 vUv;
void main() {
  vUv = uv;
  pObj = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

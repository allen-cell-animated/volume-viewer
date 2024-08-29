// switch on high precision floats
#ifdef GL_ES
precision highp float;
#endif

varying vec3 pObj;

void main() {
  pObj = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

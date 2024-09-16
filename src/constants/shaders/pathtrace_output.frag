precision highp float;
precision highp int;
precision highp sampler2D;

uniform float gInvExposure;
uniform sampler2D tTexture0;
in vec2 vUv;

// Used to convert from XYZ to linear RGB space
const mat3 XYZ_2_RGB = (mat3(
  3.2404542, -1.5371385, -0.4985314,
 -0.9692660,  1.8760108,  0.0415560,
  0.0556434, -0.2040259,  1.0572252
));

vec3 XYZtoRGB(vec3 xyz) {
  return xyz * XYZ_2_RGB;
}

void main() {
  vec4 pixelColor = texture(tTexture0, vUv);

  pixelColor.rgb = XYZtoRGB(pixelColor.rgb);

  // pixelColor.rgb = pow(pixelColor.rgb, vec3(1.0/2.2));
  pixelColor.rgb = 1.0-exp(-pixelColor.rgb*gInvExposure);
  pixelColor = clamp(pixelColor, 0.0, 1.0);

  pc_fragColor = pixelColor; // sqrt(pixelColor);
  // out_FragColor = pow(pixelColor, vec4(1.0/2.2));
}

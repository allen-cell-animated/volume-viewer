
#ifdef GL_ES
precision highp float;
#endif

uniform vec2 textureRes;
uniform float GAMMA_MIN;
uniform float GAMMA_MAX;
uniform float GAMMA_SCALE;
uniform float BRIGHTNESS;
uniform float DENSITY;
uniform float maskAlpha;
uniform float ATLAS_X;
uniform float ATLAS_Y;
uniform vec3 AABB_CLIP_MIN;
uniform vec3 AABB_CLIP_MAX;
uniform sampler2D textureAtlas;
uniform sampler2D textureAtlasMask;
uniform int Z_SLICE;
uniform float SLICES;
uniform bool interpolationEnabled;
uniform vec3 flipVolume;

varying vec2 vUv;

vec4 luma2Alpha(vec4 color, float vmin, float vmax, float C) {
  float x = dot(color.rgb, vec3(0.2125, 0.7154, 0.0721));
  float xi = (x - vmin) / (vmax - vmin);
  xi = clamp(xi, 0.0, 1.0);
  float y = pow(xi, C);
  y = clamp(y, 0.0, 1.0);
  color[3] = y;
  return color;
}

vec2 offsetFrontBack(float t, float nx, float ny) {
  int a = int(t);
  int ax = int(ATLAS_X);
  vec2 os = vec2(float(a - (a / ax) * ax) / ATLAS_X, float(a / ax) / ATLAS_Y);
  return clamp(os, vec2(0.0, 0.0), vec2(1.0 - 1.0 / ATLAS_X, 1.0 - 1.0 / ATLAS_Y));
}

vec4 sampleAtlasLinear(sampler2D tex, vec4 pos) {
  float bounds = float(pos[0] >= 0.0 && pos[0] <= 1.0 &&
    pos[1] >= 0.0 && pos[1] <= 1.0 &&
    pos[2] >= 0.0 && pos[2] <= 1.0);
  float nSlices = float(SLICES);
  vec2 loc0 = vec2((flipVolume.x * (pos.x - 0.5) + 0.5) / ATLAS_X, (flipVolume.y * (pos.y - 0.5) + 0.5) / ATLAS_Y);

  // loc ranges from 0 to 1/ATLAS_X, 1/ATLAS_Y
  // shrink loc0 to within one half edge texel - so as not to sample across edges of tiles.
  loc0 = vec2(0.5 / textureRes.x, 0.5 / textureRes.y) + loc0 * vec2(1.0 - (ATLAS_X) / textureRes.x, 1.0 - (ATLAS_Y) / textureRes.y);

  // interpolate between two slices
  float z = (pos.z) * (nSlices - 1.0);
  float z0 = floor(z);
  float t = z - z0; //mod(z, 1.0);
  float z1 = min(z0 + 1.0, nSlices - 1.0);

  // flipped:
  if(flipVolume.z == -1.0) {
    z0 = nSlices - z0 - 1.0;
    z1 = nSlices - z1 - 1.0;
    t = 1.0 - t;
  }

  // get slice offsets in texture atlas
  vec2 o0 = offsetFrontBack(z0, ATLAS_X, ATLAS_Y) + loc0;
  vec2 o1 = offsetFrontBack(z1, ATLAS_X, ATLAS_Y) + loc0;

  vec4 slice0Color = texture2D(tex, o0);
  vec4 slice1Color = texture2D(tex, o1);
  // NOTE we could premultiply the mask in the fuse function,
  // but that is slower to update the maskAlpha value than here in the shader.
  // it is a memory vs perf tradeoff.  Do users really need to update the maskAlpha at realtime speed?
  float slice0Mask = texture2D(textureAtlasMask, o0).x;
  float slice1Mask = texture2D(textureAtlasMask, o1).x;
  // or use max for conservative 0 or 1 masking?
  float maskVal = mix(slice0Mask, slice1Mask, t);
  // take mask from 0..1 to alpha..1
  maskVal = mix(maskVal, 1.0, maskAlpha);
  vec4 retval = mix(slice0Color, slice1Color, t);
  // only mask the rgb, not the alpha(?)
  retval.rgb *= maskVal;
  return bounds * retval;
}

vec4 sampleAtlasNearest(sampler2D tex, vec4 pos) {
  float bounds = float(pos[0] >= 0.0 && pos[0] <= 1.0 &&
    pos[1] >= 0.0 && pos[1] <= 1.0 &&
    pos[2] >= 0.0 && pos[2] <= 1.0);
  float nSlices = float(SLICES);
  vec2 loc0 = vec2((flipVolume.x * (pos.x - 0.5) + 0.5) / ATLAS_X, (flipVolume.y * (pos.y - 0.5) + 0.5) / ATLAS_Y);

  // No interpolation - sample just one slice at a pixel center.
  // Ideally this would be accomplished in part by switching this texture to linear
  //   filtering, but three makes this difficult to do through a WebGLRenderTarget.
  loc0 = floor(loc0 * textureRes) / textureRes;
  loc0 += vec2(0.5 / textureRes.x, 0.5 / textureRes.y);

  float z = min(floor(pos.z * nSlices), nSlices - 1.0);

  if(flipVolume.z == -1.0) {
    z = nSlices - z - 1.0;
  }

  vec2 o = offsetFrontBack(z, ATLAS_X, ATLAS_Y) + loc0;
  vec4 voxelColor = texture2D(tex, o);

  // Apply mask
  float voxelMask = texture2D(textureAtlasMask, o).x;
  voxelMask = mix(voxelMask, 1.0, maskAlpha);
  voxelColor.rgb *= voxelMask;

  return bounds * voxelColor;
}

void main() {
  gl_FragColor = vec4(0.0);

  vec3 boxMin = AABB_CLIP_MIN;
  vec3 boxMax = AABB_CLIP_MAX;
  // Normalize UV for [-0.5, 0.5] range
  vec2 normUv = vUv - vec2(0.5);

  if(normUv.x < boxMin.x || normUv.x > boxMax.x || normUv.y < boxMin.y || normUv.y > boxMax.y) {
    // return background color if outside of clipping box
    gl_FragColor = vec4(0.0);
    return;
  }

  // Normalize z-slice by total slices
  vec4 pos = vec4(vUv, float(Z_SLICE) / (SLICES - 1.0), 0.0);

  vec4 C;
  if(interpolationEnabled) {
    C = sampleAtlasLinear(textureAtlas, pos);
  } else {
    C = sampleAtlasNearest(textureAtlas, pos);
  }
  C = luma2Alpha(C, GAMMA_MIN, GAMMA_MAX, GAMMA_SCALE);
  C.xyz *= BRIGHTNESS;
  C.w *= DENSITY;  // Uncertain if needed

  C = clamp(C, 0.0, 1.0);
  gl_FragColor = C;
  return;
}
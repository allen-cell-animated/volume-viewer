import { Light, AREA_LIGHT, SKY_LIGHT } from "../light";

// threejs passthrough vertex shader for fullscreen quad
export const pathTracingVertexShaderSrc = `
#version 300 es
precision highp float;
precision highp int;
out vec2 vUv;
void main()
{
  vUv = uv;
  gl_Position = vec4( position, 1.0 );
}
`;

export const pathTracingFragmentShaderSrc = `
#version 300 es

precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;

#define PI (3.1415926535897932384626433832795)
#define PI_OVER_2 (1.57079632679489661923)
#define PI_OVER_4 (0.785398163397448309616)
#define INV_PI (1.0/PI)
#define INV_2_PI (0.5/PI)
#define INV_4_PI (0.25/PI)

const vec3 BLACK = vec3(0,0,0);
const vec3 WHITE = vec3(1.0,1.0,1.0);
const int ShaderType_Brdf = 0;
const int ShaderType_Phase = 1;
const float MAX_RAY_LEN = 1500000.0f;

in vec2 vUv;
out vec4 out_FragColor;

struct Camera {
  vec3 m_from;
  vec3 m_U, m_V, m_N;
  vec4 m_screen;  // left, right, bottom, top
  vec2 m_invScreen;  // 1/w, 1/h
  float m_focalDistance;
  float m_apertureSize;
};

uniform Camera gCamera;

struct Light {
  float   m_theta;
  float   m_phi;
  float   m_width;
  float   m_halfWidth;
  float   m_height;
  float   m_halfHeight;
  float   m_distance;
  float   m_skyRadius;
  vec3    m_P;
  vec3    m_target;
  vec3    m_N;
  vec3    m_U;
  vec3    m_V;
  float   m_area;
  float   m_areaPdf;
  vec3    m_color;
  vec3    m_colorTop;
  vec3    m_colorMiddle;
  vec3    m_colorBottom;
  int     m_T;
};
const int NUM_LIGHTS = 2;
uniform Light gLights[2];

uniform vec3 gClippedAaBbMin;
uniform vec3 gClippedAaBbMax;
uniform float gDensityScale;
uniform float gStepSize;
uniform float gStepSizeShadow;
uniform sampler3D volumeTexture;
uniform vec3 gInvAaBbMax;
uniform int g_nChannels;
uniform int gShadingType;
uniform vec3 gGradientDeltaX;
uniform vec3 gGradientDeltaY;
uniform vec3 gGradientDeltaZ;
uniform float gInvGradientDelta;
uniform float gGradientFactor;
uniform float uShowLights;

// per channel 
uniform sampler2D g_lutTexture[4];
uniform vec4 g_intensityMax;
uniform vec4 g_intensityMin;
uniform float g_opacity[4];
uniform vec3 g_emissive[4];
uniform vec3 g_diffuse[4];
uniform vec3 g_specular[4];
uniform float g_roughness[4];

// compositing / progressive render
uniform float uFrameCounter;
uniform float uSampleCounter;
uniform vec2 uResolution;
uniform sampler2D tPreviousTexture;

// from iq https://www.shadertoy.com/view/4tXyWN
float rand( inout uvec2 seed )
{
  seed += uvec2(1);
  uvec2 q = 1103515245U * ( (seed >> 1U) ^ (seed.yx) );
  uint  n = 1103515245U * ( (q.x) ^ (q.y >> 3U) );
  return float(n) * (1.0 / float(0xffffffffU));
}

vec3 XYZtoRGB(vec3 xyz) {
  return vec3(
    3.240479f*xyz[0] - 1.537150f*xyz[1] - 0.498535f*xyz[2],
    -0.969256f*xyz[0] + 1.875991f*xyz[1] + 0.041556f*xyz[2],
    0.055648f*xyz[0] - 0.204043f*xyz[1] + 1.057311f*xyz[2]
  );
}

vec3 RGBtoXYZ(vec3 rgb) {
  return vec3(
    0.412453f*rgb[0] + 0.357580f*rgb[1] + 0.180423f*rgb[2],
    0.212671f*rgb[0] + 0.715160f*rgb[1] + 0.072169f*rgb[2],
    0.019334f*rgb[0] + 0.119193f*rgb[1] + 0.950227f*rgb[2]
  );
}

vec3 getUniformSphereSample(in vec2 U)
{
  float z = 1.f - 2.f * U.x;
  float r = sqrt(max(0.f, 1.f - z*z));
  float phi = 2.f * PI * U.y;
  float x = r * cos(phi);
  float y = r * sin(phi);
  return vec3(x, y, z);
}

float SphericalPhi(in vec3 Wl)
{
  float p = atan(Wl.z, Wl.x);
  return (p < 0.f) ? p + 2.f * PI : p;
}

float SphericalTheta(in vec3 Wl)
{
  return acos(clamp(Wl.y, -1.f, 1.f));
}

bool SameHemisphere(in vec3 Ww1, in vec3 Ww2)
{
   return (Ww1.z * Ww2.z) > 0.0f;
}

vec2 getConcentricDiskSample(in vec2 U)
{
  float r, theta;
  // Map 0..1 to -1..1
  float sx = 2.0 * U.x - 1.0;
  float sy = 2.0 * U.y - 1.0;
  
  // Map square to (r,theta)
  
  // Handle degeneracy at the origin
  if (sx == 0.0 && sy == 0.0)
  {
    return vec2(0.0f, 0.0f);
  }

  // quadrants of disk
  if (sx >= -sy)
  {
    if (sx > sy)
    {
      r = sx;
      if (sy > 0.0)
        theta = sy/r;
      else
        theta = 8.0f + sy/r;
    }
    else
    {
      r = sy;
      theta = 2.0f - sx/r;
    }
  }
  else
  {
    if (sx <= sy)
    {
      r = -sx;
      theta = 4.0f - sy/r;
    }
    else
    {
      r = -sy;
      theta = 6.0f + sx/r;
    }
  }
  
  theta *= PI_OVER_4;

  return vec2(r*cos(theta), r*sin(theta));
}

vec3 getCosineWeightedHemisphereSample(in vec2 U)
{
  vec2 ret = getConcentricDiskSample(U);
  return vec3(ret.x, ret.y, sqrt(max(0.f, 1.f - ret.x * ret.x - ret.y * ret.y)));
}

struct Ray {
  vec3 m_O;
  vec3 m_D;
  float m_MinT, m_MaxT;
};

vec3 rayAt(Ray r, float t) {
  return r.m_O + t*r.m_D;
}

Ray GenerateCameraRay(in Camera cam, in vec2 Pixel, in vec2 ApertureRnd)
{
  vec2 ScreenPoint;

  ScreenPoint.x = cam.m_screen.x + (cam.m_invScreen.x * Pixel.x);
  ScreenPoint.y = cam.m_screen.z + (cam.m_invScreen.y * Pixel.y);

  vec3 RayO = cam.m_from;
  // negating ScreenPoint.y flips the up/down direction. depends on whether you want pixel 0 at top or bottom
  // we could also have flipped m_screen and m_invScreen, or cam.m_V?
  vec3 RayD = normalize(cam.m_N + (ScreenPoint.x * cam.m_U) + (-ScreenPoint.y * cam.m_V));

  if (cam.m_apertureSize != 0.0f)
  {
    vec2 LensUV = cam.m_apertureSize * getConcentricDiskSample(ApertureRnd);

    vec3 LI = cam.m_U * LensUV.x + cam.m_V * LensUV.y;
    RayO += LI;
    RayD = normalize((RayD * cam.m_focalDistance) - LI);
  }

  return Ray(RayO, RayD, 0.0, MAX_RAY_LEN);
}

bool IntersectBox(in Ray R, out float pNearT, out float pFarT)
{
  vec3 invR		= vec3(1.0f, 1.0f, 1.0f) / R.m_D;
  vec3 bottomT		= invR * (vec3(gClippedAaBbMin.x, gClippedAaBbMin.y, gClippedAaBbMin.z) - R.m_O);
  vec3 topT		= invR * (vec3(gClippedAaBbMax.x, gClippedAaBbMax.y, gClippedAaBbMax.z) - R.m_O);
  vec3 minT		= min(topT, bottomT);
  vec3 maxT		= max(topT, bottomT);
  float largestMinT = max(max(minT.x, minT.y), max(minT.x, minT.z));
  float smallestMaxT = min(min(maxT.x, maxT.y), min(maxT.x, maxT.z));

  pNearT = largestMinT;
  pFarT	= smallestMaxT;

  return smallestMaxT > largestMinT;
}

// assume volume is centered at 0,0,0 so p spans -bounds to + bounds
vec3 PtoVolumeTex(vec3 p) {
  //return (p-gClippedAaBbMin)*gInvAaBbMax;
  return p*gInvAaBbMax + vec3(0.5, 0.5, 0.5);
}

const float UINT8_MAX = 1.0;//255.0;

// strategy: sample up to 4 channels, and take the post-LUT maximum intensity as the channel that wins
float GetNormalizedIntensityMax4ch(in vec3 P, out int ch)
{
  vec4 intensity = UINT8_MAX * texture(volumeTexture, PtoVolumeTex(P));

  float maxIn = 0.0;
  ch = 0;

  //intensity = (intensity - g_intensityMin) / (g_intensityMax - g_intensityMin);
  intensity.x = texture(g_lutTexture[0], vec2(intensity.x, 0.5)).x;
  intensity.y = texture(g_lutTexture[1], vec2(intensity.y, 0.5)).x;
  intensity.z = texture(g_lutTexture[2], vec2(intensity.z, 0.5)).x;
  intensity.w = texture(g_lutTexture[3], vec2(intensity.w, 0.5)).x;

  for (int i = 0; i < min(g_nChannels, 4); ++i) {
    if (intensity[i] > maxIn) {
      maxIn = intensity[i];
      ch = i;
    }
  }
  return maxIn;
}

float GetNormalizedIntensity4ch(vec3 P, int ch)
{
  vec4 intensity = UINT8_MAX * texture(volumeTexture, PtoVolumeTex(P));
  // select channel
  float intensityf = intensity[ch];
  //intensityf = (intensityf - g_intensityMin[ch]) / (g_intensityMax[ch] - g_intensityMin[ch]);
  //intensityf = texture(g_lutTexture[ch], vec2(intensityf, 0.5)).x;

  return intensityf;
}

// note that gInvGradientDelta is maxpixeldim of volume
// gGradientDeltaX,Y,Z is 1/X,Y,Z of volume
vec3 Gradient4ch(vec3 P, int ch)
{
  vec3 Gradient;

  Gradient.x = (GetNormalizedIntensity4ch(P + (gGradientDeltaX), ch) - GetNormalizedIntensity4ch(P - (gGradientDeltaX), ch)) * gInvGradientDelta;
  Gradient.y = (GetNormalizedIntensity4ch(P + (gGradientDeltaY), ch) - GetNormalizedIntensity4ch(P - (gGradientDeltaY), ch)) * gInvGradientDelta;
  Gradient.z = (GetNormalizedIntensity4ch(P + (gGradientDeltaZ), ch) - GetNormalizedIntensity4ch(P - (gGradientDeltaZ), ch)) * gInvGradientDelta;

  return Gradient;
}

float GetOpacity(float NormalizedIntensity, int ch)
{
  // apply lut
  float Intensity = NormalizedIntensity * g_opacity[ch];
  return Intensity;
}

vec3 GetEmissionN(float NormalizedIntensity, int ch)
{
  return g_emissive[ch];
}

vec3 GetDiffuseN(float NormalizedIntensity, int ch)
{
  return g_diffuse[ch];
}

vec3 GetSpecularN(float NormalizedIntensity, int ch)
{
  return g_specular[ch];
}

float GetRoughnessN(float NormalizedIntensity, int ch)
{
  return g_roughness[ch];
}

// a bsdf sample, a sample on a light source, and a randomly chosen light index
struct LightingSample {
  float m_bsdfComponent;
  vec2  m_bsdfDir;
  vec2  m_lightPos;
  float m_lightComponent;
  float m_LightNum;
};

LightingSample LightingSample_LargeStep(inout uvec2 seed) {
  return LightingSample(
    rand(seed), 
    vec2(rand(seed), rand(seed)),
    vec2(rand(seed), rand(seed)),
    rand(seed), 
    rand(seed)
    );
}

// return a color xyz
vec3 Light_Le(in Light light, in vec2 UV)
{
  if (light.m_T == 0)
    return RGBtoXYZ(light.m_color) / light.m_area;

  if (light.m_T == 1)
  {
    if (UV.y > 0.0f)
      return RGBtoXYZ(mix(light.m_colorMiddle, light.m_colorTop, abs(UV.y)));
    else
      return RGBtoXYZ(mix(light.m_colorMiddle, light.m_colorBottom, abs(UV.y)));
  }

  return BLACK;
}

// return a color xyz
vec3 Light_SampleL(in Light light, in vec3 P, out Ray Rl, out float Pdf, in LightingSample LS)
{
  vec3 L = BLACK;
  Pdf = 0.0;
  vec3 Ro = vec3(0,0,0), Rd = vec3(0,0,1);
  if (light.m_T == 0)
  {
    Ro = (light.m_P + ((-0.5f + LS.m_lightPos.x) * light.m_width * light.m_U) + ((-0.5f + LS.m_lightPos.y) * light.m_height * light.m_V));
    Rd = normalize(P - Ro);
    L = dot(Rd, light.m_N) > 0.0f ? Light_Le(light, vec2(0.0f)) : BLACK;
    Pdf = abs(dot(Rd, light.m_N)) > 0.0f ? dot(P-Ro, P-Ro) / (abs(dot(Rd, light.m_N)) * light.m_area) : 0.0f;
  }
  else if (light.m_T == 1)
  {
    Ro = light.m_P + light.m_skyRadius * getUniformSphereSample(LS.m_lightPos);
    Rd = normalize(P - Ro);
    L = Light_Le(light, vec2(1.0f) - 2.0f * LS.m_lightPos);
    Pdf = pow(light.m_skyRadius, 2.0f) / light.m_area;
  }

  Rl = Ray(Ro, Rd, 0.0f, length(P - Ro));

  return L;
}

// Intersect ray with light
bool Light_Intersect(Light light, inout Ray R, out float T, out vec3 L, out float pPdf)
{
  if (light.m_T == 0)
  {
    // Compute projection
    float DotN = dot(R.m_D, light.m_N);

    // Ray is coplanar with light surface
    if (DotN >= 0.0f)
      return false;

    // Compute hit distance
    T = (-light.m_distance - dot(R.m_O, light.m_N)) / DotN;

    // Intersection is in ray's negative direction
    if (T < R.m_MinT || T > R.m_MaxT)
      return false;

    // Determine position on light
    vec3 Pl = rayAt(R, T);

    // Vector from point on area light to center of area light
    vec3 Wl = Pl - light.m_P;

    // Compute texture coordinates
    vec2 UV = vec2(dot(Wl, light.m_U), dot(Wl, light.m_V));

    // Check if within bounds of light surface
    if (UV.x > light.m_halfWidth || UV.x < -light.m_halfWidth || UV.y > light.m_halfHeight || UV.y < -light.m_halfHeight)
      return false;

    R.m_MaxT = T;

    //pUV = UV;

    if (DotN < 0.0f)
      L = RGBtoXYZ(light.m_color) / light.m_area;
    else
      L = BLACK;

    pPdf = dot(R.m_O-Pl, R.m_O-Pl) / (DotN * light.m_area);

    return true;
  }

  else if (light.m_T == 1)
  {
    T = light.m_skyRadius;

    // Intersection is in ray's negative direction
    if (T < R.m_MinT || T > R.m_MaxT)
      return false;

    R.m_MaxT = T;

    vec2 UV = vec2(SphericalPhi(R.m_D) * INV_2_PI, SphericalTheta(R.m_D) * INV_PI);

    L = Light_Le(light, vec2(1.0f,1.0f) - 2.0f * UV);

    pPdf = pow(light.m_skyRadius, 2.0f) / light.m_area;
    //pUV = UV;

    return true;
  }

  return false;
}

float Light_Pdf(in Light light, in vec3 P, in vec3 Wi)
{
  vec3 L;
  vec2 UV;
  float Pdf = 1.0f;

  Ray Rl = Ray(P, Wi, 0.0f, 100000.0f);

  if (light.m_T == 0)
  {
    float T = 0.0f;

    if (!Light_Intersect(light, Rl, T, L, Pdf))
      return 0.0f;

    return pow(T, 2.0f) / (abs(dot(light.m_N, -Wi)) * light.m_area);
  }

  else if (light.m_T == 1)
  {
    return pow(light.m_skyRadius, 2.0f) / light.m_area;
  }

  return 0.0f;
}

struct VolumeShader {
  int m_Type; // 0 = bsdf, 1 = phase

  vec3 m_Kd; // isotropic phase // xyz color
  vec3 m_R; // specular reflectance
  float m_Ior;
  float m_Exponent;
  vec3 m_Nn;
  vec3 m_Nu;
  vec3 m_Nv;
};

// return a xyz color
vec3 ShaderPhase_F(in VolumeShader shader, in vec3 Wo, in vec3 Wi)
{
  return shader.m_Kd * INV_PI;
}

float ShaderPhase_Pdf(in VolumeShader shader, in vec3 Wo, in vec3 Wi)
{
  return INV_4_PI;
}

vec3 ShaderPhase_SampleF(in VolumeShader shader, in vec3 Wo, out vec3 Wi, out float Pdf, in vec2 U)
{
  Wi	= getUniformSphereSample(U);
  Pdf	= ShaderPhase_Pdf(shader, Wo, Wi);

  return ShaderPhase_F(shader, Wo, Wi);
}

// return a xyz color
vec3 Lambertian_F(in VolumeShader shader, in vec3 Wo, in vec3 Wi)
{
  return shader.m_Kd * INV_PI;
}

float Lambertian_Pdf(in VolumeShader shader, in vec3 Wo, in vec3 Wi)
{
  //return abs(Wi.z)*INV_PI;
  return SameHemisphere(Wo, Wi) ? abs(Wi.z) * INV_PI : 0.0f;
}

// return a xyz color
vec3 Lambertian_SampleF(in VolumeShader shader, in vec3 Wo, out vec3 Wi, out float Pdf, in vec2 U)
{
  Wi = getCosineWeightedHemisphereSample(U);

  if (Wo.z < 0.0f)
    Wi.z *= -1.0f;

  Pdf = Lambertian_Pdf(shader, Wo, Wi);

  return Lambertian_F(shader, Wo, Wi);
}

vec3 SphericalDirection(in float SinTheta, in float CosTheta, in float Phi)
{
  return vec3(SinTheta * cos(Phi), SinTheta * sin(Phi), CosTheta);
}

void Blinn_SampleF(in VolumeShader shader, in vec3 Wo, out vec3 Wi, out float Pdf, in vec2 U)
{
  // Compute sampled half-angle vector wh for Blinn distribution
  float costheta = pow(U.x, 1.f / (shader.m_Exponent+1.0));
  float sintheta = sqrt(max(0.f, 1.f - costheta*costheta));
  float phi = U.y * 2.f * PI;

  vec3 wh = SphericalDirection(sintheta, costheta, phi);

  if (!SameHemisphere(Wo, wh))
    wh = -wh;

  // Compute incident direction by reflecting about $\wh$
  Wi = -Wo + 2.f * dot(Wo, wh) * wh;

  // Compute PDF for wi from Blinn distribution
  float blinn_pdf = ((shader.m_Exponent + 1.f) * pow(costheta, shader.m_Exponent)) / (2.f * PI * 4.f * dot(Wo, wh));

  if (dot(Wo, wh) <= 0.f)
    blinn_pdf = 0.f;

  Pdf = blinn_pdf;
}

float Blinn_D(in VolumeShader shader, in vec3 wh)
{
  float costhetah = abs(wh.z);//AbsCosTheta(wh);
  return (shader.m_Exponent+2.0) * INV_2_PI * pow(costhetah, shader.m_Exponent);
}
float Microfacet_G(in VolumeShader shader, in vec3 wo, in vec3 wi, in vec3 wh)
{
  float NdotWh = abs(wh.z);//AbsCosTheta(wh);
  float NdotWo = abs(wo.z);//AbsCosTheta(wo);
  float NdotWi = abs(wi.z);//AbsCosTheta(wi);
  float WOdotWh = abs(dot(wo, wh));

  return min(1.f, min((2.f * NdotWh * NdotWo / WOdotWh), (2.f * NdotWh * NdotWi / WOdotWh)));
}

vec3 Microfacet_F(in VolumeShader shader, in vec3 wo, in vec3 wi)
{
  float cosThetaO = abs(wo.z);//AbsCosTheta(wo);
  float cosThetaI = abs(wi.z);//AbsCosTheta(wi);

  if (cosThetaI == 0.f || cosThetaO == 0.f)
    return BLACK;

  vec3 wh = wi + wo;

  if (wh.x == 0. && wh.y == 0. && wh.z == 0.)
    return BLACK;

  wh = normalize(wh);
  float cosThetaH = dot(wi, wh);

  vec3 F = WHITE;//m_Fresnel.Evaluate(cosThetaH);

  return shader.m_R * Blinn_D(shader, wh) * Microfacet_G(shader, wo, wi, wh) * F / (4.f * cosThetaI * cosThetaO);
}

vec3 ShaderBsdf_WorldToLocal(in VolumeShader shader, in vec3 W)
{
  return vec3(dot(W, shader.m_Nu), dot(W, shader.m_Nv), dot(W, shader.m_Nn));
}

vec3 ShaderBsdf_LocalToWorld(in VolumeShader shader, in vec3 W)
{
  return vec3(	shader.m_Nu.x * W.x + shader.m_Nv.x * W.y + shader.m_Nn.x * W.z,
    shader.m_Nu.y * W.x + shader.m_Nv.y * W.y + shader.m_Nn.y * W.z,
    shader.m_Nu.z * W.x + shader.m_Nv.z * W.y + shader.m_Nn.z * W.z);
}

float Blinn_Pdf(in VolumeShader shader, in vec3 Wo, in vec3 Wi)
{
  vec3 wh = normalize(Wo + Wi);

  float costheta = abs(wh.z);//AbsCosTheta(wh);
  // Compute PDF for wi from Blinn distribution
  float blinn_pdf = ((shader.m_Exponent + 1.f) * pow(costheta, shader.m_Exponent)) / (2.f * PI * 4.f * dot(Wo, wh));

  if (dot(Wo, wh) <= 0.0f)
    blinn_pdf = 0.0f;

  return blinn_pdf;
}

vec3 Microfacet_SampleF(in VolumeShader shader, in vec3 wo, out vec3 wi, out float Pdf, in vec2 U)
{
  Blinn_SampleF(shader, wo, wi, Pdf, U);

  if (!SameHemisphere(wo, wi))
    return BLACK;

  return Microfacet_F(shader, wo, wi);
}

float Microfacet_Pdf(in VolumeShader shader, in vec3 wo, in vec3 wi)
{
  if (!SameHemisphere(wo, wi))
    return 0.0f;

  return Blinn_Pdf(shader, wo, wi);
}

// return a xyz color
vec3 ShaderBsdf_F(in VolumeShader shader, in vec3 Wo, in vec3 Wi)
{
  vec3 Wol = ShaderBsdf_WorldToLocal(shader, Wo);
  vec3 Wil = ShaderBsdf_WorldToLocal(shader, Wi);

  vec3 R = vec3(0,0,0);

  R += Lambertian_F(shader, Wol, Wil);
  R += Microfacet_F(shader, Wol, Wil);

  return R;
}

float ShaderBsdf_Pdf(in VolumeShader shader, in vec3 Wo, in vec3 Wi)
{
  vec3 Wol = ShaderBsdf_WorldToLocal(shader, Wo);
  vec3 Wil = ShaderBsdf_WorldToLocal(shader, Wi);

  float Pdf = 0.0f;

  Pdf += Lambertian_Pdf(shader, Wol, Wil);
  Pdf += Microfacet_Pdf(shader, Wol, Wil);

  return Pdf;
}


vec3 ShaderBsdf_SampleF(in VolumeShader shader, in LightingSample S, in vec3 Wo, out vec3 Wi, out float Pdf, in vec2 U)
{
  vec3 Wol = ShaderBsdf_WorldToLocal(shader, Wo);
  vec3 Wil = vec3(0,0,0);

  vec3 R = vec3(0,0,0);

  if (S.m_bsdfComponent <= 0.5f)
  {
    Lambertian_SampleF(shader, Wol, Wil, Pdf, S.m_bsdfDir);
  }
  else
  {
    Microfacet_SampleF(shader, Wol, Wil, Pdf, S.m_bsdfDir);
  }

  Pdf += Lambertian_Pdf(shader, Wol, Wil);
  Pdf += Microfacet_Pdf(shader, Wol, Wil);

  R += Lambertian_F(shader, Wol, Wil);
  R += Microfacet_F(shader, Wol, Wil);

  Wi = ShaderBsdf_LocalToWorld(shader, Wil);

  //return vec3(1,1,1);
  return R;
}

// return a xyz color
vec3 Shader_F(in VolumeShader shader, in vec3 Wo, in vec3 Wi)
{
  if (shader.m_Type == 0) {
    return ShaderBsdf_F(shader, Wo, Wi);
  }
  else {
    return ShaderPhase_F(shader, Wo, Wi);
  }
}

float Shader_Pdf(in VolumeShader shader, in vec3 Wo, in vec3 Wi)
{
  if (shader.m_Type == 0) {
    return ShaderBsdf_Pdf(shader, Wo, Wi);
  }
  else {
    return ShaderPhase_Pdf(shader, Wo, Wi);
  }
}

vec3 Shader_SampleF(in VolumeShader shader, in LightingSample S, in vec3 Wo, out vec3 Wi, out float Pdf, in vec2 U)
{
  //return vec3(1,0,0);
  if (shader.m_Type == 0) {
    return ShaderBsdf_SampleF(shader, S, Wo, Wi, Pdf, U);
  }
  else {
    return ShaderPhase_SampleF(shader, Wo, Wi, Pdf, U);
  }
}


bool IsBlack(in vec3 v) {
  return (v.x==0.0 && v.y == 0.0 && v.z == 0.0);
}

float PowerHeuristic(float nf, float fPdf, float ng, float gPdf)
{
  float f = nf * fPdf;
  float g = ng * gPdf;
  // The power heuristic is Veach's MIS balance heuristic except each component is being squared
  // balance heuristic would be f/(f+g) ...?
  return (f * f) / (f * f + g * g); 
}

float MISContribution(float pdf1, float pdf2)
{
  return PowerHeuristic(1.0f, pdf1, 1.0f, pdf2);
}

// "shadow ray" using gStepSizeShadow, test whether it can exit the volume or not
bool DoesSecondaryRayScatterInVolume(inout Ray R, inout uvec2 seed)
{
  float MinT;
  float MaxT;
  vec3 Ps;

  if (!IntersectBox(R, MinT, MaxT))
    return false;

  MinT = max(MinT, R.m_MinT);
  MaxT = min(MaxT, R.m_MaxT);

  // delta (Woodcock) tracking
  float S	= -log(rand(seed)) / gDensityScale;
  float Sum = 0.0f;
  float SigmaT = 0.0f;

  MinT += rand(seed) * gStepSizeShadow;
  int ch = 0;
  float intensity = 0.0;
  while (Sum < S)
  {
    Ps = rayAt(R, MinT);  // R.m_O + MinT * R.m_D;

    if (MinT > MaxT)
      return false;
    
    intensity = GetNormalizedIntensityMax4ch(Ps, ch);
    SigmaT = gDensityScale * GetOpacity(intensity, ch);

    Sum += SigmaT * gStepSizeShadow;
    MinT += gStepSizeShadow;
  }

  return true;
}

int GetNearestLight(Ray R, out vec3 oLightColor, out vec3 Pl, out float oPdf)
{
  int hit = -1;
  float T = 0.0f;
  Ray rayCopy = R;
  float pdf = 0.0f;

  for (int i = 0; i < 2; i++)
  {
    if (Light_Intersect(gLights[i], rayCopy, T, oLightColor, pdf))
    {
      Pl = rayAt(R, T);
      hit = i;
    }
  }
  oPdf = pdf;

  return hit;
}

// return a XYZ color
// Wo is direction from scatter point out toward incident ray direction

// Wi goes toward light sample and is not necessarily perfect reflection of Wo
// ^Wi   ^N    ^Wo
//  \    |    /
//   \   |   /
//    \  |  /
//     \ | /
//      \|/ Pe = volume sample where scattering occurs
//   ---------
vec3 EstimateDirectLight(int shaderType, float Density, int ch, in Light light, in LightingSample LS, in vec3 Wo, in vec3 Pe, in vec3 N, inout uvec2 seed)
{
  vec3 Ld = BLACK, Li = BLACK, F = BLACK;

  vec3 diffuse = GetDiffuseN(Density, ch);
  vec3 specular = GetSpecularN(Density, ch);
  float roughness = GetRoughnessN(Density, ch);

  // can N and Wo be coincident????
  vec3 nu = normalize(cross(N, Wo)); 
  vec3 nv = normalize(cross(N, nu));

  // the IoR here is hard coded... and unused!!!!
  VolumeShader Shader = VolumeShader(shaderType, RGBtoXYZ(diffuse), RGBtoXYZ(specular), 2.5f, roughness, N, nu, nv);

  float LightPdf = 1.0f, ShaderPdf = 1.0f;
  
  Ray Rl = Ray(vec3(0,0,0), vec3(0,0,1.0), 0.0, MAX_RAY_LEN); 
  // Rl is ray from light toward Pe in volume, with a max traversal of the distance from Pe to Light sample pos.
  Li = Light_SampleL(light, Pe, Rl, LightPdf, LS);
  
  // Wi: negate ray direction: from volume scatter point toward light...?
  vec3 Wi = -Rl.m_D, P = vec3(0,0,0);

  // we will calculate two lighting contributions and combine them by MIS.

  F = Shader_F(Shader,Wo, Wi); 

  ShaderPdf = Shader_Pdf(Shader, Wo, Wi);

  // get a lighting contribution along Rl;  see if Rl would scatter in the volume or not
  if (!IsBlack(Li) && (ShaderPdf > 0.0f) && (LightPdf > 0.0f) && !DoesSecondaryRayScatterInVolume(Rl, seed))
  {
    // ray from light can see through volume to Pe!

    float dotProd = 1.0;
    if (shaderType == ShaderType_Brdf){

      // (use abs or clamp here?)
      dotProd = abs(dot(Wi, N));
    }
    Ld += F * Li * dotProd * MISContribution(LightPdf, ShaderPdf) / LightPdf;

  }

  // get a lighting contribution by sampling nearest light from the scattering point
  F = Shader_SampleF(Shader, LS, Wo, Wi, ShaderPdf, LS.m_bsdfDir);
  if (!IsBlack(F) && (ShaderPdf > 0.0f))
  {
    vec3 Pl = vec3(0,0,0);
    int n = GetNearestLight(Ray(Pe, Wi, 0.0f, 1000000.0f), Li, Pl, LightPdf);
    if (n > -1)
    {
      Light pLight = gLights[n];
      LightPdf = Light_Pdf(pLight, Pe, Wi);

      if ((LightPdf > 0.0f) && !IsBlack(Li)) {
        Ray rr = Ray(Pl, normalize(Pe - Pl), 0.0f, length(Pe - Pl));
        if (!DoesSecondaryRayScatterInVolume(rr, seed))
        {
          float dotProd = 1.0;
          if (shaderType == ShaderType_Brdf){
      
            // (use abs or clamp here?)
            dotProd = abs(dot(Wi, N));
          }
          // note order of MIS params is swapped
          Ld += F * Li * dotProd * MISContribution(ShaderPdf, LightPdf) / ShaderPdf;
        }

      }
    }
  }

  return Ld;

}

// return a linear xyz color
vec3 UniformSampleOneLight(int shaderType, float Density, int ch, in vec3 Wo, in vec3 Pe, in vec3 N, inout uvec2 seed)
{
  //if (NUM_LIGHTS == 0)
  //  return BLACK;

  // select a random light, a random 2d sample on light, and a random 2d sample on brdf
  LightingSample LS = LightingSample_LargeStep(seed);

  int WhichLight = int(floor(LS.m_LightNum * float(NUM_LIGHTS)));

  Light light = gLights[WhichLight];

  return float(NUM_LIGHTS) * EstimateDirectLight(shaderType, Density, ch, light, LS, Wo, Pe, N, seed);
  
}    

bool SampleScatteringEvent(inout Ray R, inout uvec2 seed, out vec3 Ps)
{
  float MinT;
  float MaxT;

  if (!IntersectBox(R, MinT, MaxT))
    return false;

  MinT = max(MinT, R.m_MinT);
  MaxT = min(MaxT, R.m_MaxT);

  // delta (Woodcock) tracking

  // notes, not necessarily coherent:
  // ray march along the ray's projected path and keep an average sigmaT value.
  // The distance is weighted by the intensity at each ray step sample. High intensity increases the apparent distance.
  // When the distance has become greater than the average sigmaT value given by -log(RandomFloat[0, 1]) / averageSigmaT 
  // then that would be considered the interaction position.

  // sigmaT = sigmaA + sigmaS = absorption coeff + scattering coeff = extinction coeff

  // Beer-Lambert law: transmittance T(t) = exp(-sigmaT*t)
  // importance sampling the exponential function to produce a free path distance S
  // the PDF is p(t) = sigmaT * exp(-sigmaT * t)
  // S is the free-path distance = -ln(1-zeta)/sigmaT where zeta is a random variable
  // density scale 0... S --> 0..inf.  Low density means randomly sized ray paths
  // density scale inf... S --> 0.   High density means short ray paths!
  
  // note that ln(x:0..1) is negative
  float S	= -log(rand(seed)) / gDensityScale;  
  
  float Sum		= 0.0f;
  float SigmaT	= 0.0f; // accumulated extinction along ray march

  // start: take one step now.
  MinT += rand(seed) * gStepSize;

  int ch = 0;
  float intensity = 0.0;
  
  // ray march until we have traveled S (or hit the maxT of the ray)
  while (Sum < S)
  {
    Ps = rayAt(R, MinT);  // R.m_O + MinT * R.m_D;

    if (MinT > MaxT)
      return false;
    
    intensity = GetNormalizedIntensityMax4ch(Ps, ch);
    SigmaT = gDensityScale * GetOpacity(intensity, ch);

    Sum += SigmaT * gStepSize;
    MinT += gStepSize;
  }

  // Ps is the point
  return true;
}


vec4 CalculateRadiance(inout uvec2 seed) {
  float r = rand(seed);
  //return vec4(r,0,0,1);

  vec3 Lv = BLACK, Li = BLACK;

  //Ray Re = Ray(vec3(0,0,0), vec3(0,0,1), 0.0, MAX_RAY_LEN);
  
  vec2 UV = vUv*uResolution + vec2(rand(seed), rand(seed));

  Ray Re = GenerateCameraRay(gCamera, UV, vec2(rand(seed), rand(seed)));
  
  //return vec4(vUv, 0.0, 1.0);
  //return vec4(0.5*(Re.m_D + 1.0), 1.0);
  //return vec4(Re.m_D, 1.0);

  //Re.m_MinT = 0.0f; 
  //Re.m_MaxT = MAX_RAY_LEN;

  vec3 Pe = vec3(0,0,0), Pl = vec3(0,0,0);
  float lpdf = 0.0;
  
  float alpha = 0.0;
  // find point Pe along ray Re
  if (SampleScatteringEvent(Re, seed, Pe))
  {
    alpha = 1.0;
    // is there a light between Re.m_O and Pe? (ray's maxT is distance to Pe)
    // (test to see if area light was hit before volume.)
    int i = GetNearestLight(Ray(Re.m_O, Re.m_D, 0.0f, length(Pe - Re.m_O)), Li, Pl, lpdf);
    if (i > -1)
    {
      // set sample pixel value in frame estimate (prior to accumulation)
      return vec4(Li, 1.0);
    }
    
    int ch = 0;
    float D = GetNormalizedIntensityMax4ch(Pe, ch);

    // emission from volume
    Lv += RGBtoXYZ(GetEmissionN(D, ch));

    vec3 gradient = Gradient4ch(Pe, ch);
    // send ray out from Pe toward light
    switch (gShadingType)
    {
      case 0:
      {
        Lv += UniformSampleOneLight(ShaderType_Brdf, D, ch, normalize(-Re.m_D), Pe, normalize(gradient), seed);
        break;
      }
    
      case 1:
      {
        Lv += 0.5f * UniformSampleOneLight(ShaderType_Phase, D, ch, normalize(-Re.m_D), Pe, normalize(gradient), seed);
        break;
      }

      case 2:
      {
        //const float GradMag = GradientMagnitude(Pe, volumedata.gradientVolumeTexture[ch]) * (1.0/volumedata.intensityMax[ch]);
        float GradMag = length(gradient);
        float PdfBrdf = (1.0f - exp(-gGradientFactor * GradMag));

        vec3 cls; // xyz color
        if (rand(seed) < PdfBrdf) {
          cls = UniformSampleOneLight(ShaderType_Brdf, D, ch, normalize(-Re.m_D), Pe, normalize(gradient), seed);
        }
        else {
          cls = 0.5f * UniformSampleOneLight(ShaderType_Phase, D, ch, normalize(-Re.m_D), Pe, normalize(gradient), seed);
        }

        Lv += cls;

        break;
      }
    }
  }
  else
  {
    // background color:
    // set Lv to a selected color based on environment light source?
//    if (uShowLights > 0.0) {
//      int n = GetNearestLight(Ray(Re.m_O, Re.m_D, 0.0f, 1000000.0f), Li, Pl, lpdf);
//      if (n > -1)
//        Lv = Li;  
//    }

    //Lv = vec3(r,0,0);

  }

  // set sample pixel value in frame estimate (prior to accumulation)

  return vec4(Lv, alpha);
}

vec4 CumulativeMovingAverage(vec4 A, vec4 Ax, float N)
{
   return A + ((Ax - A) / max((N), 1.0f));
}

void main()
{
  // seed for rand(seed) function
  uvec2 seed = uvec2(uFrameCounter, uFrameCounter + 1.0) * uvec2(gl_FragCoord);

  // perform path tracing and get resulting pixel color
  vec4 pixelColor = CalculateRadiance( seed );
    
  vec4 previousColor = texture(tPreviousTexture, vUv);
  if (uSampleCounter < 1.0) {
    previousColor = vec4(0,0,0,0);
  }

  out_FragColor = CumulativeMovingAverage(previousColor, pixelColor, uSampleCounter);
}
`;


export function pathTracingUniforms() {
  return {
      
    tPreviousTexture: { type: "t", value: null },
    
    uSampleCounter: { type: "f", value: 0.0 },
    uFrameCounter: { type: "f", value: 1.0 },
    
    uResolution: { type: "v2", value: new THREE.Vector2() },

///////////////////////////
    gClippedAaBbMin: { type: "v3", value: new THREE.Vector3(0,0,0) },
    gClippedAaBbMax: { type: "v3", value: new THREE.Vector3(1,1,1) },
    gDensityScale: { type: "f", value: 50.0 },
    gStepSize: { type: "f", value: 1.0 },
    gStepSizeShadow: { type: "f", value: 1.0 },
    gInvAaBbMax: { type: "v3", value: new THREE.Vector3() },
    g_nChannels: { type: "i", value: 1 },
    gShadingType: { type: "i", value: 2 },
    gGradientDeltaX: { type: "v3", value: new THREE.Vector3(0.01, 0, 0) },
    gGradientDeltaY: { type: "v3", value: new THREE.Vector3(0, 0.01, 0) },
    gGradientDeltaZ: { type: "v3", value: new THREE.Vector3(0, 0, 0.01) },
    gInvGradientDelta: { type: "f", value: 0.0 },
    // controls the amount of BRDF-like versus phase-function-like shading
    gGradientFactor: { type: "f", value: 0.25 },

    gCamera: {
      value: {
        // Camera struct
        m_from: new THREE.Vector3(),
        m_U: new THREE.Vector3(),
        m_V: new THREE.Vector3(),
        m_N: new THREE.Vector3(),
        m_screen: new THREE.Vector4(),  // left, right, bottom, top
        m_invScreen: new THREE.Vector2(),  // 1/w, 1/h
        m_focalDistance: 0.0,
        m_apertureSize: 0.0
      }
    },
    gLights: {
      value: [
        new Light(SKY_LIGHT), new Light(AREA_LIGHT)
      ]
    },
    
    volumeTexture: { type: "t", value: null },
    // per channel 
    g_lutTexture: { type: "tv", value: [null, null, null, null] },
    g_intensityMax: { type: "v4", value: new THREE.Vector4(1,1,1,1) },
    g_intensityMin: { type: "v4", value: new THREE.Vector4(0,0,0,0) },
    g_opacity: { type: "1fv", value: [1,1,1,1] },
    g_emissive: { type: "v3v", value: [
      new THREE.Vector3(0,0,0),
      new THREE.Vector3(0,0,0),
      new THREE.Vector3(0,0,0),
      new THREE.Vector3(0,0,0)
    ] },
    g_diffuse: { type: "v3v", value: [
      new THREE.Vector3(1,0,0),
      new THREE.Vector3(0,1,0),
      new THREE.Vector3(0,0,1),
      new THREE.Vector3(1,0,1)
    ] },
    g_specular: { type: "v3v", value: [
      new THREE.Vector3(0,0,0),
      new THREE.Vector3(0,0,0),
      new THREE.Vector3(0,0,0),
      new THREE.Vector3(0,0,0)
    ] },
    g_roughness: { type: "1fv", value: [1,1,1,1] },
    uShowLights: { type:"f", value: 0 }
  };
};


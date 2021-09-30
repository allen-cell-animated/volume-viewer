import { Color, UniformsUtils, ShaderMaterial } from "three";
export const fresnelShaderSettings = {
  bias: 0.4,
  power: 2.0,
  scale: 1.0,
};

export const defaultMaterialSettings = {
  shininess: 1000,
  specularColor: 0x010101,
};

export const transparentMaterialSettings = {
  shininess: 1000,
  specularColor: 0x010101,
  transparency: {
    bias: -0.2,
    power: 2.0,
    scale: 1.0,
  },
};

const shaderLibrary = {
  fresnel: {
    uniforms: {
      bias: { value: 0.4 },
      power: { value: 2.0 },
      scale: { value: 1.0 },
      uBaseColor: { value: new Color(0xffffff) },
    },

    vertexShader: `varying vec3 vNormal;
            varying vec3 vI;

            void main() {

                vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
                vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

                vNormal = normalize( normalMatrix * normal );

                vec4 I = modelViewMatrix * vec4(position, 1.0);
                vI = normalize(mvPosition.xyz);

                gl_Position = projectionMatrix * mvPosition;

            }`,

    fragmentShader: `uniform float bias;
            uniform float power;
            uniform float scale;
            uniform vec3 uBaseColor;

            varying vec3 vNormal;

            varying vec3 vI;

            void main() {
                float edge = 1.0 - max( dot( normalize( vNormal ), normalize( -vI ) ), 0.0);
                edge = max(0.0, min(1.0, -bias + scale * pow((0.0 + edge), power)));

                float threshold = 0.1;
                if ( edge < threshold ) {
                    discard;
                }
                gl_FragColor = vec4( uBaseColor, edge );
                return;
            }`,
  },
};

export function createShaderMaterial(id: string): ShaderMaterial {
  const shader = shaderLibrary[id];

  const u = UniformsUtils.clone(shader.uniforms);
  const vs = shader.vertexShader;
  const fs = shader.fragmentShader;

  const material = new ShaderMaterial({
    fragmentShader: fs,
    uniforms: u,
    vertexShader: vs,
  });
  return material;
}

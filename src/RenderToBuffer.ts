import {
  IUniform,
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  WebGLRenderer,
  Scene,
  ShaderMaterial,
  WebGLRenderTarget,
} from "three";

import bufferVertexShaderSrc from "./constants/shaders/render_to_buffer.vert";

export default class RenderToBuffer {
  public scene: Scene;
  public geometry: PlaneGeometry;
  public material: ShaderMaterial;
  public mesh: Mesh;
  public camera: OrthographicCamera;

  constructor(fragmentSrc: string, uniforms: { [key: string]: IUniform }) {
    this.scene = new Scene();
    this.geometry = new PlaneGeometry(2, 2);

    this.material = new ShaderMaterial({
      vertexShader: bufferVertexShaderSrc,
      fragmentShader: fragmentSrc,
      uniforms,
    });

    this.material.depthWrite = false;
    this.material.depthTest = false;

    this.mesh = new Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);

    this.camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  }

  public render(renderer: WebGLRenderer, target?: WebGLRenderTarget) {
    renderer.setRenderTarget(target ?? null);
    renderer.render(this.scene, this.camera);
    renderer.setRenderTarget(null);
  }
}
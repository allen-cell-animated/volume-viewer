import {
  BufferGeometry,
  Euler,
  Object3D,
  Vector3,
  Color,
  Mesh,
  Group,
  Material,
  MeshPhongMaterial,
  Plane,
  DoubleSide,
} from "three";
import { STLExporter } from "three/examples/jsm/exporters/STLExporter";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";

import { defaultMaterialSettings } from "./constants/materials.js";

import FileSaver from "./FileSaver";
import NaiveSurfaceNets from "./NaiveSurfaceNets.js";
import MarchingCubes from "./MarchingCubes";
import Volume from "./Volume";
import { Bounds } from "./types.js";
import { ThreeJsPanel } from "./ThreeJsPanel.js";

// this cutoff is chosen to have a small buffer of values before the object is treated
// as transparent for gpu blending and depth testing.
const ALPHA_THRESHOLD = 0.9;

export default class MeshVolume {
  private volume: Volume;
  private meshRoot: Object3D;
  private meshPivot: Group;
  private meshrep: Object3D[];
  private channel_colors: [number, number, number][];
  private channel_opacities: number[];
  private bounds: Bounds;
  private scale: Vector3;

  constructor(volume: Volume) {
    // need?
    this.volume = volume;

    this.meshRoot = new Object3D(); //create an empty container
    this.meshRoot.name = "Mesh Surface Group";

    // handle transform ordering for giving the meshroot a rotation about a pivot point
    this.meshPivot = new Group();
    this.meshPivot.name = "MeshContainerNode";
    this.meshPivot.add(this.meshRoot);

    this.meshrep = [];

    this.channel_colors = [];
    this.channel_opacities = [];

    this.bounds = {
      bmin: new Vector3(-0.5, -0.5, -0.5),
      bmax: new Vector3(0.5, 0.5, 0.5),
    };
  }

  cleanup(): void {
    for (let i = 0; i < this.volume.num_channels; ++i) {
      this.destroyIsosurface(i);
    }
  }

  setVisible(isVisible: boolean): void {
    this.meshRoot.visible = isVisible;
  }

  doRender(_canvas: ThreeJsPanel): void {
    // no op
  }

  get3dObject(): Group {
    return this.meshPivot;
  }

  onChannelData(batch: number[]): void {
    for (let j = 0; j < batch.length; ++j) {
      const idx = batch[j];
      // if an isosurface was created before the channel data arrived, we need to re-calculate it now.
      if (this.meshrep[idx]) {
        const isovalue = this.getIsovalue(idx);
        this.updateIsovalue(idx, isovalue === undefined ? 127 : isovalue);
      }
    }
  }

  setScale(scale: Vector3): void {
    this.scale = scale;

    this.meshRoot.scale.copy(new Vector3(0.5 * scale.x, 0.5 * scale.y, 0.5 * scale.z));
  }

  setFlipAxes(flipX: number, flipY: number, flipZ: number): void {
    this.meshRoot.scale.copy(
      new Vector3(0.5 * this.scale.x * flipX, 0.5 * this.scale.y * flipY, 0.5 * this.scale.z * flipZ)
    );
  }

  setTranslation(vec3xyz: Vector3): void {
    this.meshRoot.position.copy(vec3xyz);
  }

  setRotation(eulerXYZ: Euler): void {
    this.meshPivot.rotation.copy(eulerXYZ);
    this.updateClipFromBounds();
  }

  setResolution(_x: number, _y: number): void {
    // no op
  }

  setOrthoThickness(_value: number): void {
    // no op
  }

  setAxisClip(axis: number, minval: number, maxval: number, _isOrthoAxis: boolean): void {
    this.bounds.bmax[axis] = maxval;
    this.bounds.bmin[axis] = minval;
    this.updateClipFromBounds();
  }

  //////////////////////////////

  updateMeshColors(channel_colors: [number, number, number][]): void {
    // stash values here for later changes
    this.channel_colors = channel_colors;

    // update existing meshes
    for (let i = 0; i < this.volume.num_channels; ++i) {
      if (this.meshrep[i]) {
        const rgb = channel_colors[i];
        const c = (rgb[0] << 16) | (rgb[1] << 8) | rgb[2];

        this.meshrep[i].traverse(function (child) {
          if (child instanceof Mesh) {
            child.material.color = new Color(c);
          }
        });
        if (this.meshrep[i].material) {
          this.meshrep[i].material.color = new Color(c);
        }
      }
    }
  }

  createMaterialForChannel(rgb: [number, number, number], alpha: number, _transp: boolean): Material {
    const col = (rgb[0] << 16) | (rgb[1] << 8) | rgb[2];
    const material = new MeshPhongMaterial({
      color: new Color(col),
      shininess: defaultMaterialSettings.shininess,
      specular: new Color(defaultMaterialSettings.specularColor),
      opacity: alpha,
      transparent: alpha < ALPHA_THRESHOLD,
      side: DoubleSide,
    });
    return material;
  }

  createMeshForChannel(
    channelIndex: number,
    colorrgb: [number, number, number],
    isovalue: number,
    alpha: number,
    transp: boolean
  ): Object3D {
    // note that if isovalue out of range, this will return an empty array.
    const geometries = this.generateIsosurfaceGeometry(channelIndex, isovalue);
    const material = this.createMaterialForChannel(colorrgb, alpha, transp);

    const theObject = new Object3D();
    theObject.name = "Channel" + channelIndex;
    theObject.userData = { isovalue: isovalue };
    // proper scaling will be done in parent object
    for (let i = 0; i < geometries.length; ++i) {
      const mesh = new Mesh(geometries[i], material);
      theObject.add(mesh);
    }
    return theObject;
  }

  updateIsovalue(channel: number, value: number): void {
    if (!this.meshrep[channel]) {
      return;
    }
    if (this.meshrep[channel].userData.isovalue === value) {
      return;
    }

    // find the current isosurface opacity and color.
    const opacity = this.channel_opacities[channel];
    const color = this.channel_colors[channel];

    this.destroyIsosurface(channel);
    this.meshrep[channel] = this.createMeshForChannel(channel, color, value, opacity, false);

    this.meshRoot.add(this.meshrep[channel]);
  }

  getIsovalue(channel: number): number | undefined {
    if (!this.meshrep[channel]) {
      return undefined;
    }
    return this.meshrep[channel].userData.isovalue;
  }

  updateClipRegion(xmin: number, xmax: number, ymin: number, ymax: number, zmin: number, zmax: number): void {
    // incoming values expected to be between 0 and 1.
    // I shift them here to be between -0.5 and 0.5
    this.bounds = {
      bmin: new Vector3(xmin - 0.5, ymin - 0.5, zmin - 0.5),
      bmax: new Vector3(xmax - 0.5, ymax - 0.5, zmax - 0.5),
    };
    this.updateClipFromBounds();
  }

  updateClipFromBounds(): void {
    const xmin = this.bounds.bmin.x;
    const ymin = this.bounds.bmin.y;
    const zmin = this.bounds.bmin.z;
    const xmax = this.bounds.bmax.x;
    const ymax = this.bounds.bmax.y;
    const zmax = this.bounds.bmax.z;

    const euler = this.meshPivot.rotation;

    for (let channel = 0; channel < this.meshrep.length; ++channel) {
      if (!this.meshrep[channel]) {
        continue;
      }
      const planes: Plane[] = [];
      // up to 6 planes.
      if (xmin > -0.5) {
        planes.push(new Plane(new Vector3(1, 0, 0).applyEuler(euler), this.meshRoot.position.x + -xmin * this.scale.x));
      }
      if (ymin > -0.5) {
        planes.push(new Plane(new Vector3(0, 1, 0).applyEuler(euler), this.meshRoot.position.y + -ymin * this.scale.y));
      }
      if (zmin > -0.5) {
        planes.push(new Plane(new Vector3(0, 0, 1).applyEuler(euler), this.meshRoot.position.z + -zmin * this.scale.z));
      }
      if (xmax < 0.5) {
        planes.push(new Plane(new Vector3(-1, 0, 0).applyEuler(euler), this.meshRoot.position.x + xmax * this.scale.x));
      }
      if (ymax < 0.5) {
        planes.push(new Plane(new Vector3(0, -1, 0).applyEuler(euler), this.meshRoot.position.y + ymax * this.scale.y));
      }
      if (zmax < 0.5) {
        planes.push(new Plane(new Vector3(0, 0, -1).applyEuler(euler), this.meshRoot.position.z + zmax * this.scale.z));
      }
      this.meshrep[channel].traverse(function (child) {
        if (child instanceof Mesh) {
          child.material.clippingPlanes = planes;
        }
      });
      if (this.meshrep[channel].material) {
        this.meshrep[channel].material.clippingPlanes = planes;
      }
    }
  }

  updateOpacity(channel: number, value: number): void {
    this.channel_opacities[channel] = value;
    if (!this.meshrep[channel]) {
      return;
    }

    this.meshrep[channel].traverse(function (child) {
      if (child instanceof Mesh) {
        child.material.opacity = value;
        child.material.transparent = value < ALPHA_THRESHOLD;
        //child.material.depthWrite = !child.material.transparent;
      }
    });
    if (this.meshrep[channel].material) {
      this.meshrep[channel].material.opacity = value;
      this.meshrep[channel].material.transparent = value < ALPHA_THRESHOLD;
      //this.meshrep[channel].material.depthWrite = !this.meshrep[channel].material.transparent;
    }
  }

  hasIsosurface(channel: number): boolean {
    return !!this.meshrep[channel];
  }

  createIsosurface(
    channel: number,
    color: [number, number, number],
    value: number,
    alpha: number,
    transp: boolean
  ): void {
    if (!this.meshrep[channel]) {
      if (value === undefined) {
        // 127 is half of the intensity range 0..255
        value = 127;
      }
      if (alpha === undefined) {
        // 1.0 indicates full opacity, non-transparent
        alpha = 1.0;
      }
      if (transp === undefined) {
        transp = alpha < ALPHA_THRESHOLD;
      }
      this.meshrep[channel] = this.createMeshForChannel(channel, color, value, alpha, transp);
      this.channel_opacities[channel] = alpha;
      this.channel_colors[channel] = color;
      this.meshRoot.add(this.meshrep[channel]);
    }
  }

  destroyIsosurface(channel: number): void {
    if (this.meshrep[channel]) {
      this.meshRoot.remove(this.meshrep[channel]);
      this.meshrep[channel].traverse(function (child) {
        if (child instanceof Mesh) {
          child.material.dispose();
          child.geometry.dispose();
        }
      });
      if (this.meshrep[channel].geometry) {
        this.meshrep[channel].geometry.dispose();
      }
      if (this.meshrep[channel].material) {
        this.meshrep[channel].material.dispose();
      }
      this.meshrep[channel] = null;
    }
  }

  saveChannelIsosurface(channelIndex: number, type: string, namePrefix: string): void {
    if (!this.meshrep[channelIndex]) {
      return;
    }

    if (type === "STL") {
      this.exportSTL(this.meshrep[channelIndex], namePrefix + "_" + this.volume.channel_names[channelIndex]);
    } else if (type === "GLTF") {
      // temporarily set other meshreps to invisible
      const prevviz: boolean[] = [];
      for (let i = 0; i < this.meshrep.length; ++i) {
        if (this.meshrep[i]) {
          prevviz[i] = this.meshrep[i].visible;
          this.meshrep[i].visible = i === channelIndex;
        }
      }
      this.exportGLTF(this.meshRoot, namePrefix + "_" + this.volume.channel_names[channelIndex]);
      for (let i = 0; i < this.meshrep.length; ++i) {
        if (this.meshrep[i]) {
          this.meshrep[i].visible = prevviz[i];
        }
      }
    }
  }

  exportSTL(input: Object3D, fname: string): void {
    const ex = new STLExporter();
    const output = ex.parse(input, { binary: true });
    FileSaver.saveBinary(output.buffer, fname + ".stl");
  }

  // takes a scene or object or array of scenes or objects or both!
  exportGLTF(input: Object3D, fname: string): void {
    const gltfExporter = new GLTFExporter();
    const options = {
      // transforms as translate rotate scale?
      trs: false,
      onlyVisible: true,
      truncateDrawRange: true,
      binary: true,
      forceIndices: false,
      forcePowerOfTwoTextures: true,
    };
    gltfExporter.parse(
      input,
      function (result) {
        if (result instanceof ArrayBuffer) {
          FileSaver.saveArrayBuffer(result, fname + ".glb");
        } else {
          const output = JSON.stringify(result, null, 2);
          FileSaver.saveString(output, fname + ".gltf");
        }
      },
      options
    );
  }

  generateIsosurfaceGeometry(channelIndex: number, isovalue: number): BufferGeometry[] {
    if (!this.volume) {
      return [];
    }
    const volumedata = this.volume.channels[channelIndex].volumeData;

    const marchingcubes = true;

    if (marchingcubes) {
      const effect = new MarchingCubes(
        [this.volume.x, this.volume.y, this.volume.z],
        null,
        false,
        false,
        true,
        volumedata
      );
      effect.position.copy(this.meshRoot.position);
      effect.scale.set(0.5 * this.scale.x, 0.5 * this.scale.y, 0.5 * this.scale.z);
      effect.isovalue = isovalue;
      const geometries = effect.generateGeometry();
      // TODO: weld vertices and recompute normals if MarchingCubes results in excessive coincident verts
      // for (var i = 0; i < geometries.length; ++i) {
      //   var g = new THREE.Geometry().fromBufferGeometry(geometries[i]);
      //   g.mergeVertices();
      //   geometries[i] = new THREE.BufferGeometry().fromGeometry(g);
      //   geometries[i].computeVertexNormals();
      // }
      return geometries || [];
    } else {
      const result = NaiveSurfaceNets.surfaceNets(volumedata, [this.volume.x, this.volume.y, this.volume.z], isovalue);
      return NaiveSurfaceNets.constructTHREEGeometry(result);
    }
  }
}
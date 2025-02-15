/**
 * Port of http://webglsamples.org/blob/blob.html
 */

// MODIFIED 2018-2022 BY DANIELT@ALLENINSTITUTE.ORG TO ACCEPT enableColors, enableNormals, volumeFieldRef options

import { BufferAttribute, BufferGeometry, Material, Mesh } from "three";

import type { TypedArray, NumberType } from "./types.js";

class MarchingCubes extends Mesh {
  public isovalue: number;
  public enableUvs: boolean;
  public enableColors: boolean;
  public enableNormals: boolean;
  public dirty: boolean;
  public resolution: [number, number, number];
  public stepSizeX: number;
  public stepSizeY: number;
  public stepSizeZ: number;
  public sizeX: number;
  public sizeY: number;
  public sizeZ: number;
  public sizeXY: number;
  public sizeXYZ: number;
  public size3: number;
  public halfsizeX: number;
  public halfsizeY: number;
  public halfsizeZ: number;
  public deltaX: number;
  public deltaY: number;
  public deltaZ: number;
  public yd: number;
  public zd: number;
  public field: TypedArray<NumberType>;
  public normal_cache: Float32Array;
  public maxCount: number; //4096; // TODO: find the fastest size for this buffer
  public count: number;
  public hasPositions: boolean;
  public hasNormals: boolean;
  public hasColors: boolean;
  public hasUvs: boolean;
  public positionArray: Float32Array;
  public normalArray: Float32Array;
  public uvArray: Float32Array;
  public colorArray: Float32Array;

  private init: (res: [number, number, number], vol: TypedArray<NumberType>) => void;
  private begin: () => void;
  private end: (renderCallback: (mc: MarchingCubes) => void) => void;
  private reset: () => void;
  public render: (renderCallback: (mc: MarchingCubes) => void) => void;
  public generateGeometry: () => BufferGeometry[] | undefined;

  constructor(
    resolution: [number, number, number],
    material: Material,
    enableUvs: boolean,
    enableColors: boolean,
    enableNormals: boolean,
    volumeFieldRef: TypedArray<NumberType>
  ) {
    const geometry = new BufferGeometry();
    super(geometry, material);
    this.maxCount = 16384; //4096; // TODO: find the fastest size for this buffer
    this.count = 0;
    this.hasPositions = false;
    this.hasNormals = false;
    this.hasColors = false;
    this.hasUvs = false;

    const scope = this;

    // basic default init; these should be reset later.
    //this.position = new Vector3();
    //this.scale = new Vector3(1, 1, 1);
    this.isovalue = 0;

    // temp buffers used in polygonize

    const vlist = new Float32Array(12 * 3);
    const nlist = new Float32Array(12 * 3);

    this.enableUvs = !!enableUvs;
    this.enableColors = !!enableColors;
    this.enableNormals = !!enableNormals;

    this.dirty = true;
    this.resolution = [0, 0, 0];
    this.stepSizeX = 0;
    this.stepSizeY = 0;
    this.stepSizeZ = 0;
    this.sizeX = 0;
    this.sizeY = 0;
    this.sizeZ = 0;
    this.sizeXY = 0;
    this.sizeXYZ = 0;
    this.size3 = 0;
    this.halfsizeX = 0;
    this.halfsizeY = 0;
    this.halfsizeZ = 0;
    this.deltaX = 0;
    this.deltaY = 0;
    this.deltaZ = 0;
    this.yd = 0;
    this.zd = 0;
    this.field = new Uint8Array();
    this.normal_cache = new Float32Array();
    this.positionArray = new Float32Array();
    this.normalArray = new Float32Array();
    this.uvArray = new Float32Array();
    this.colorArray = new Float32Array();

    // functions have to be object properties
    // prototype functions kill performance
    // (tested and it was 4x slower !!!)

    this.init = function (resolution: [number, number, number], volumeFieldRef: TypedArray<NumberType>) {
      this.dirty = true;

      this.resolution = resolution;

      // parameters

      this.isovalue = 0.05;

      this.stepSizeX = 1;
      this.stepSizeY = 1;
      this.stepSizeZ = 1;

      // size of field, 32 is pushing it in Javascript :)
      this.sizeX = resolution[0];
      this.sizeY = resolution[1];
      this.sizeZ = resolution[2];
      this.sizeXY = this.sizeX * this.sizeY;
      this.sizeXYZ = this.sizeXY * this.sizeZ;
      this.size3 = this.sizeXYZ;
      this.halfsizeX = this.sizeX / 2.0;
      this.halfsizeY = this.sizeY / 2.0;
      this.halfsizeZ = this.sizeZ / 2.0;

      // deltas

      this.deltaX = 2.0 / this.sizeX;
      this.deltaY = 2.0 / this.sizeY;
      this.deltaZ = 2.0 / this.sizeZ;
      this.yd = this.sizeX;
      this.zd = this.sizeXY;

      if (volumeFieldRef) {
        this.field = volumeFieldRef;
      } else {
        this.field = new Float32Array(this.size3);
      }

      this.normal_cache = new Float32Array(this.size3 * 3);

      // immediate render mode simulator

      this.maxCount = 16384; //4096; // TODO: find the fastest size for this buffer
      this.count = 0;

      this.hasPositions = false;
      this.hasNormals = false;
      this.hasColors = false;
      this.hasUvs = false;

      this.positionArray = new Float32Array(this.maxCount * 3);
      if (this.enableNormals) {
        this.normalArray = new Float32Array(this.maxCount * 3);
      }

      if (this.enableUvs) {
        this.uvArray = new Float32Array(this.maxCount * 2);
      }

      if (this.enableColors) {
        this.colorArray = new Float32Array(this.maxCount * 3);
      }
    };

    ///////////////////////
    // Polygonization
    ///////////////////////

    function lerp(a, b, t) {
      return a + (b - a) * t;
    }

    function VIntX(q, offset, isol, x, y, z, valp1, valp2) {
      const mu = (isol - valp1) / (valp2 - valp1),
        nc = scope.normal_cache;

      vlist[offset + 0] = x + mu * scope.deltaX * scope.stepSizeX;
      vlist[offset + 1] = y;
      vlist[offset + 2] = z;

      nlist[offset + 0] = lerp(nc[q + 0], nc[q + 3], mu);
      nlist[offset + 1] = lerp(nc[q + 1], nc[q + 4], mu);
      nlist[offset + 2] = lerp(nc[q + 2], nc[q + 5], mu);
    }

    function VIntY(q, offset, isol, x, y, z, valp1, valp2) {
      const mu = (isol - valp1) / (valp2 - valp1),
        nc = scope.normal_cache;

      vlist[offset + 0] = x;
      vlist[offset + 1] = y + mu * scope.deltaY * scope.stepSizeY;
      vlist[offset + 2] = z;

      const q2 = q + scope.yd * 3;

      nlist[offset + 0] = lerp(nc[q + 0], nc[q2 + 0], mu);
      nlist[offset + 1] = lerp(nc[q + 1], nc[q2 + 1], mu);
      nlist[offset + 2] = lerp(nc[q + 2], nc[q2 + 2], mu);
    }

    function VIntZ(q, offset, isol, x, y, z, valp1, valp2) {
      const mu = (isol - valp1) / (valp2 - valp1),
        nc = scope.normal_cache;

      vlist[offset + 0] = x;
      vlist[offset + 1] = y;
      vlist[offset + 2] = z + mu * scope.deltaZ * scope.stepSizeZ;

      const q2 = q + scope.zd * 3;

      nlist[offset + 0] = lerp(nc[q + 0], nc[q2 + 0], mu);
      nlist[offset + 1] = lerp(nc[q + 1], nc[q2 + 1], mu);
      nlist[offset + 2] = lerp(nc[q + 2], nc[q2 + 2], mu);
    }

    function compNorm(q) {
      const q3 = q * 3;

      if (scope.normal_cache[q3] === 0.0) {
        scope.normal_cache[q3 + 0] = scope.field[q - 1 * scope.stepSizeX] - scope.field[q + 1 * scope.stepSizeX];
        scope.normal_cache[q3 + 1] =
          scope.field[q - scope.yd * scope.stepSizeY] - scope.field[q + scope.yd * scope.stepSizeY];
        scope.normal_cache[q3 + 2] =
          scope.field[q - scope.zd * scope.stepSizeZ] - scope.field[q + scope.zd * scope.stepSizeZ];
      }
    }

    // Returns total number of triangles. Fills triangles.
    // (this is where most of time is spent - it's inner work of O(n3) loop )

    function polygonize(fx, fy, fz, q, isol, renderCallback) {
      // cache indices
      const q1 = q + 1 * scope.stepSizeX,
        qy = q + scope.yd * scope.stepSizeY,
        qz = q + scope.zd * scope.stepSizeZ,
        q1y = q1 + scope.yd * scope.stepSizeY,
        q1z = q1 + scope.zd * scope.stepSizeZ,
        qyz = q + scope.yd * scope.stepSizeY + scope.zd * scope.stepSizeZ,
        q1yz = q1 + scope.yd * scope.stepSizeY + scope.zd * scope.stepSizeZ;

      let cubeindex = 0;
      const field0 = scope.field[q],
        field1 = scope.field[q1],
        field2 = scope.field[qy],
        field3 = scope.field[q1y],
        field4 = scope.field[qz],
        field5 = scope.field[q1z],
        field6 = scope.field[qyz],
        field7 = scope.field[q1yz];

      if (field0 < isol) cubeindex |= 1;
      if (field1 < isol) cubeindex |= 2;
      if (field2 < isol) cubeindex |= 8;
      if (field3 < isol) cubeindex |= 4;
      if (field4 < isol) cubeindex |= 16;
      if (field5 < isol) cubeindex |= 32;
      if (field6 < isol) cubeindex |= 128;
      if (field7 < isol) cubeindex |= 64;

      // if cube is entirely in/out of the surface - bail, nothing to draw

      const bits = edgeTable[cubeindex];
      if (bits === 0) return 0;

      const dx = scope.deltaX * scope.stepSizeX,
        dy = scope.deltaY * scope.stepSizeY,
        dz = scope.deltaZ * scope.stepSizeZ,
        fx2 = fx + dx,
        fy2 = fy + dy,
        fz2 = fz + dz;

      // top of the cube

      if (bits & 1) {
        compNorm(q);
        compNorm(q1);
        VIntX(q * 3, 0, isol, fx, fy, fz, field0, field1);
      }

      if (bits & 2) {
        compNorm(q1);
        compNorm(q1y);
        VIntY(q1 * 3, 3, isol, fx2, fy, fz, field1, field3);
      }

      if (bits & 4) {
        compNorm(qy);
        compNorm(q1y);
        VIntX(qy * 3, 6, isol, fx, fy2, fz, field2, field3);
      }

      if (bits & 8) {
        compNorm(q);
        compNorm(qy);
        VIntY(q * 3, 9, isol, fx, fy, fz, field0, field2);
      }

      // bottom of the cube

      if (bits & 16) {
        compNorm(qz);
        compNorm(q1z);
        VIntX(qz * 3, 12, isol, fx, fy, fz2, field4, field5);
      }

      if (bits & 32) {
        compNorm(q1z);
        compNorm(q1yz);
        VIntY(q1z * 3, 15, isol, fx2, fy, fz2, field5, field7);
      }

      if (bits & 64) {
        compNorm(qyz);
        compNorm(q1yz);
        VIntX(qyz * 3, 18, isol, fx, fy2, fz2, field6, field7);
      }

      if (bits & 128) {
        compNorm(qz);
        compNorm(qyz);
        VIntY(qz * 3, 21, isol, fx, fy, fz2, field4, field6);
      }

      // vertical lines of the cube

      if (bits & 256) {
        compNorm(q);
        compNorm(qz);
        VIntZ(q * 3, 24, isol, fx, fy, fz, field0, field4);
      }

      if (bits & 512) {
        compNorm(q1);
        compNorm(q1z);
        VIntZ(q1 * 3, 27, isol, fx2, fy, fz, field1, field5);
      }

      if (bits & 1024) {
        compNorm(q1y);
        compNorm(q1yz);
        VIntZ(q1y * 3, 30, isol, fx2, fy2, fz, field3, field7);
      }

      if (bits & 2048) {
        compNorm(qy);
        compNorm(qyz);
        VIntZ(qy * 3, 33, isol, fx, fy2, fz, field2, field6);
      }

      cubeindex <<= 4; // re-purpose cubeindex into an offset into triTable

      let o1,
        o2,
        o3,
        numtris = 0,
        i = 0;

      // here is where triangles are created

      while (triTable[cubeindex + i] != -1) {
        o1 = cubeindex + i;
        o2 = o1 + 1;
        o3 = o1 + 2;

        posnormtriv(vlist, nlist, 3 * triTable[o1], 3 * triTable[o2], 3 * triTable[o3], renderCallback);

        i += 3;
        numtris++;
      }

      return numtris;
    }

    /////////////////////////////////////
    // Immediate render mode simulator
    /////////////////////////////////////

    function posnormtriv(pos, norm, o1, o2, o3, renderCallback) {
      const c = scope.count * 3;

      // positions

      scope.positionArray[c + 0] = pos[o1];
      scope.positionArray[c + 1] = pos[o1 + 1];
      scope.positionArray[c + 2] = pos[o1 + 2];

      scope.positionArray[c + 3] = pos[o2];
      scope.positionArray[c + 4] = pos[o2 + 1];
      scope.positionArray[c + 5] = pos[o2 + 2];

      scope.positionArray[c + 6] = pos[o3];
      scope.positionArray[c + 7] = pos[o3 + 1];
      scope.positionArray[c + 8] = pos[o3 + 2];

      // normals

      if (scope.enableNormals) {
        scope.normalArray[c + 0] = norm[o1];
        scope.normalArray[c + 1] = norm[o1 + 1];
        scope.normalArray[c + 2] = norm[o1 + 2];

        scope.normalArray[c + 3] = norm[o2];
        scope.normalArray[c + 4] = norm[o2 + 1];
        scope.normalArray[c + 5] = norm[o2 + 2];

        scope.normalArray[c + 6] = norm[o3];
        scope.normalArray[c + 7] = norm[o3 + 1];
        scope.normalArray[c + 8] = norm[o3 + 2];
      }

      // uvs

      if (scope.enableUvs) {
        const d = scope.count * 2;

        scope.uvArray[d + 0] = pos[o1];
        scope.uvArray[d + 1] = pos[o1 + 2];

        scope.uvArray[d + 2] = pos[o2];
        scope.uvArray[d + 3] = pos[o2 + 2];

        scope.uvArray[d + 4] = pos[o3];
        scope.uvArray[d + 5] = pos[o3 + 2];
      }

      // colors

      if (scope.enableColors) {
        scope.colorArray[c + 0] = pos[o1];
        scope.colorArray[c + 1] = pos[o1 + 1];
        scope.colorArray[c + 2] = pos[o1 + 2];

        scope.colorArray[c + 3] = pos[o2];
        scope.colorArray[c + 4] = pos[o2 + 1];
        scope.colorArray[c + 5] = pos[o2 + 2];

        scope.colorArray[c + 6] = pos[o3];
        scope.colorArray[c + 7] = pos[o3 + 1];
        scope.colorArray[c + 8] = pos[o3 + 2];
      }

      scope.count += 3;

      if (scope.count >= scope.maxCount - 3) {
        scope.hasPositions = true;
        if (scope.enableNormals) {
          scope.hasNormals = true;
        }

        if (scope.enableUvs) {
          scope.hasUvs = true;
        }

        if (scope.enableColors) {
          scope.hasColors = true;
        }

        renderCallback(scope);
      }
    }

    this.begin = function () {
      this.count = 0;

      this.hasPositions = false;
      this.hasNormals = false;
      this.hasUvs = false;
      this.hasColors = false;
    };

    this.end = function (renderCallback) {
      if (this.count === 0) return;

      for (let i = this.count * 3; i < this.positionArray.length; i++) {
        this.positionArray[i] = 0.0;
      }

      this.hasPositions = true;
      if (this.enableNormals) {
        this.hasNormals = true;
      }

      if (this.enableUvs) {
        this.hasUvs = true;
      }

      if (this.enableColors) {
        this.hasColors = true;
      }

      renderCallback(this);
    };

    /////////////////////////////////////
    // Updates
    /////////////////////////////////////

    this.reset = function () {
      var i;

      // wipe the normal cache

      for (i = 0; i < this.size3; i++) {
        this.normal_cache[i * 3] = 0.0;
        this.field[i] = 0.0;
      }
    };

    this.render = function (renderCallback) {
      if (!this.dirty) {
        this.end(renderCallback);
        return;
      }

      this.begin();

      // Triangulate. Yeah, this is slow.

      const smin2x = this.sizeX - 2;
      const smin2y = this.sizeY - 2;
      const smin2z = this.sizeZ - 2;

      for (let z = 1; z < smin2z; z += this.stepSizeZ) {
        const z_offset = this.sizeXY * z;
        const fz = (z - this.halfsizeZ) / this.halfsizeZ; //+ 1

        for (let y = 1; y < smin2y; y += this.stepSizeY) {
          const y_offset = z_offset + this.sizeX * y;
          const fy = (y - this.halfsizeY) / this.halfsizeY; //+ 1

          for (let x = 1; x < smin2x; x += this.stepSizeX) {
            const fx = (x - this.halfsizeX) / this.halfsizeX; //+ 1
            const q = y_offset + x;

            polygonize(fx, fy, fz, q, this.isovalue, renderCallback);
          }
        }
      }

      this.end(renderCallback);
    };

    this.generateGeometry = function () {
      if (!this.dirty) {
        return;
      }

      let start = 0;
      const geoparent: BufferGeometry[] = [];
      //var normals = [];

      const geo_callback = function (object) {
        const geo = new BufferGeometry();
        geo.setAttribute("position", new BufferAttribute(object.positionArray.slice(), 3));
        if (object.enableNormals) {
          geo.setAttribute("normal", new BufferAttribute(object.normalArray.slice(), 3));
        }
        // for ( var i = 0; i < object.count; i ++ ) {
        //
        // 	var vertex = new Vector3().fromArray( object.positionArray, i * 3 );
        // 	var normal = new Vector3().fromArray( object.normalArray, i * 3 );
        //
        // 	geo.vertices.push( vertex );
        // 	normals.push( normal );
        //
        // }

        const inds = new Uint16Array(object.count);
        const nfaces = object.count / 3;

        for (let i = 0; i < nfaces; i++) {
          const a = /* start + */ i * 3;
          const b = a + 1;
          const c = a + 2;

          inds[i * 3 + 0] = a;
          inds[i * 3 + 1] = b;
          inds[i * 3 + 2] = c;

          // var na = normals[ a ];
          // var nb = normals[ b ];
          // var nc = normals[ c ];
          //
          // var face = new Face3( a, b, c, [ na, nb, nc ] );
          // geo.faces.push( face );
        }
        geo.setIndex(new BufferAttribute(inds, 1));
        geoparent.push(geo);

        start += nfaces;
        object.count = 0;
      };

      this.render(geo_callback);

      // console.log( "generated " + geo.faces.length + " triangles" );

      this.dirty = false;
      return geoparent;
    };

    this.init(resolution, volumeFieldRef);
  }
}

/////////////////////////////////////
// Marching cubes lookup tables
/////////////////////////////////////

// These tables are straight from Paul Bourke's page:
// http://local.wasp.uwa.edu.au/~pbourke/geometry/polygonise/
// who in turn got them from Cory Gene Bloyd.

const edgeTable = new Int32Array([
  0x0, 0x109, 0x203, 0x30a, 0x406, 0x50f, 0x605, 0x70c, 0x80c, 0x905, 0xa0f, 0xb06, 0xc0a, 0xd03, 0xe09, 0xf00, 0x190,
  0x99, 0x393, 0x29a, 0x596, 0x49f, 0x795, 0x69c, 0x99c, 0x895, 0xb9f, 0xa96, 0xd9a, 0xc93, 0xf99, 0xe90, 0x230, 0x339,
  0x33, 0x13a, 0x636, 0x73f, 0x435, 0x53c, 0xa3c, 0xb35, 0x83f, 0x936, 0xe3a, 0xf33, 0xc39, 0xd30, 0x3a0, 0x2a9, 0x1a3,
  0xaa, 0x7a6, 0x6af, 0x5a5, 0x4ac, 0xbac, 0xaa5, 0x9af, 0x8a6, 0xfaa, 0xea3, 0xda9, 0xca0, 0x460, 0x569, 0x663, 0x76a,
  0x66, 0x16f, 0x265, 0x36c, 0xc6c, 0xd65, 0xe6f, 0xf66, 0x86a, 0x963, 0xa69, 0xb60, 0x5f0, 0x4f9, 0x7f3, 0x6fa, 0x1f6,
  0xff, 0x3f5, 0x2fc, 0xdfc, 0xcf5, 0xfff, 0xef6, 0x9fa, 0x8f3, 0xbf9, 0xaf0, 0x650, 0x759, 0x453, 0x55a, 0x256, 0x35f,
  0x55, 0x15c, 0xe5c, 0xf55, 0xc5f, 0xd56, 0xa5a, 0xb53, 0x859, 0x950, 0x7c0, 0x6c9, 0x5c3, 0x4ca, 0x3c6, 0x2cf, 0x1c5,
  0xcc, 0xfcc, 0xec5, 0xdcf, 0xcc6, 0xbca, 0xac3, 0x9c9, 0x8c0, 0x8c0, 0x9c9, 0xac3, 0xbca, 0xcc6, 0xdcf, 0xec5, 0xfcc,
  0xcc, 0x1c5, 0x2cf, 0x3c6, 0x4ca, 0x5c3, 0x6c9, 0x7c0, 0x950, 0x859, 0xb53, 0xa5a, 0xd56, 0xc5f, 0xf55, 0xe5c, 0x15c,
  0x55, 0x35f, 0x256, 0x55a, 0x453, 0x759, 0x650, 0xaf0, 0xbf9, 0x8f3, 0x9fa, 0xef6, 0xfff, 0xcf5, 0xdfc, 0x2fc, 0x3f5,
  0xff, 0x1f6, 0x6fa, 0x7f3, 0x4f9, 0x5f0, 0xb60, 0xa69, 0x963, 0x86a, 0xf66, 0xe6f, 0xd65, 0xc6c, 0x36c, 0x265, 0x16f,
  0x66, 0x76a, 0x663, 0x569, 0x460, 0xca0, 0xda9, 0xea3, 0xfaa, 0x8a6, 0x9af, 0xaa5, 0xbac, 0x4ac, 0x5a5, 0x6af, 0x7a6,
  0xaa, 0x1a3, 0x2a9, 0x3a0, 0xd30, 0xc39, 0xf33, 0xe3a, 0x936, 0x83f, 0xb35, 0xa3c, 0x53c, 0x435, 0x73f, 0x636, 0x13a,
  0x33, 0x339, 0x230, 0xe90, 0xf99, 0xc93, 0xd9a, 0xa96, 0xb9f, 0x895, 0x99c, 0x69c, 0x795, 0x49f, 0x596, 0x29a, 0x393,
  0x99, 0x190, 0xf00, 0xe09, 0xd03, 0xc0a, 0xb06, 0xa0f, 0x905, 0x80c, 0x70c, 0x605, 0x50f, 0x406, 0x30a, 0x203, 0x109,
  0x0,
]);

const triTable = new Int32Array([
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 8, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, 0, 1, 9, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 8, 3, 9, 8, 1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, 1, 2, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 8, 3, 1, 2, 10, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, 9, 2, 10, 0, 2, 9, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 2, 8, 3, 2, 10, 8, 10, 9, 8, -1, -1, -1, -1,
  -1, -1, -1, 3, 11, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 11, 2, 8, 11, 0, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, 1, 9, 0, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 11, 2, 1, 9, 11, 9, 8, 11, -1, -1, -1,
  -1, -1, -1, -1, 3, 10, 1, 11, 10, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 10, 1, 0, 8, 10, 8, 11, 10, -1, -1,
  -1, -1, -1, -1, -1, 3, 9, 0, 3, 11, 9, 11, 10, 9, -1, -1, -1, -1, -1, -1, -1, 9, 8, 10, 10, 8, 11, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, 4, 7, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 4, 3, 0, 7, 3, 4, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, 0, 1, 9, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 4, 1, 9, 4, 7, 1, 7, 3, 1, -1, -1, -1,
  -1, -1, -1, -1, 1, 2, 10, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 3, 4, 7, 3, 0, 4, 1, 2, 10, -1, -1, -1, -1,
  -1, -1, -1, 9, 2, 10, 9, 0, 2, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1, 2, 10, 9, 2, 9, 7, 2, 7, 3, 7, 9, 4, -1, -1, -1,
  -1, 8, 4, 7, 3, 11, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 11, 4, 7, 11, 2, 4, 2, 0, 4, -1, -1, -1, -1, -1, -1,
  -1, 9, 0, 1, 8, 4, 7, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1, 4, 7, 11, 9, 4, 11, 9, 11, 2, 9, 2, 1, -1, -1, -1, -1, 3,
  10, 1, 3, 11, 10, 7, 8, 4, -1, -1, -1, -1, -1, -1, -1, 1, 11, 10, 1, 4, 11, 1, 0, 4, 7, 11, 4, -1, -1, -1, -1, 4, 7,
  8, 9, 0, 11, 9, 11, 10, 11, 0, 3, -1, -1, -1, -1, 4, 7, 11, 4, 11, 9, 9, 11, 10, -1, -1, -1, -1, -1, -1, -1, 9, 5, 4,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 9, 5, 4, 0, 8, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 5, 4,
  1, 5, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 8, 5, 4, 8, 3, 5, 3, 1, 5, -1, -1, -1, -1, -1, -1, -1, 1, 2, 10, 9,
  5, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 3, 0, 8, 1, 2, 10, 4, 9, 5, -1, -1, -1, -1, -1, -1, -1, 5, 2, 10, 5, 4,
  2, 4, 0, 2, -1, -1, -1, -1, -1, -1, -1, 2, 10, 5, 3, 2, 5, 3, 5, 4, 3, 4, 8, -1, -1, -1, -1, 9, 5, 4, 2, 3, 11, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 11, 2, 0, 8, 11, 4, 9, 5, -1, -1, -1, -1, -1, -1, -1, 0, 5, 4, 0, 1, 5, 2, 3,
  11, -1, -1, -1, -1, -1, -1, -1, 2, 1, 5, 2, 5, 8, 2, 8, 11, 4, 8, 5, -1, -1, -1, -1, 10, 3, 11, 10, 1, 3, 9, 5, 4, -1,
  -1, -1, -1, -1, -1, -1, 4, 9, 5, 0, 8, 1, 8, 10, 1, 8, 11, 10, -1, -1, -1, -1, 5, 4, 0, 5, 0, 11, 5, 11, 10, 11, 0, 3,
  -1, -1, -1, -1, 5, 4, 8, 5, 8, 10, 10, 8, 11, -1, -1, -1, -1, -1, -1, -1, 9, 7, 8, 5, 7, 9, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, 9, 3, 0, 9, 5, 3, 5, 7, 3, -1, -1, -1, -1, -1, -1, -1, 0, 7, 8, 0, 1, 7, 1, 5, 7, -1, -1, -1, -1, -1,
  -1, -1, 1, 5, 3, 3, 5, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 9, 7, 8, 9, 5, 7, 10, 1, 2, -1, -1, -1, -1, -1, -1,
  -1, 10, 1, 2, 9, 5, 0, 5, 3, 0, 5, 7, 3, -1, -1, -1, -1, 8, 0, 2, 8, 2, 5, 8, 5, 7, 10, 5, 2, -1, -1, -1, -1, 2, 10,
  5, 2, 5, 3, 3, 5, 7, -1, -1, -1, -1, -1, -1, -1, 7, 9, 5, 7, 8, 9, 3, 11, 2, -1, -1, -1, -1, -1, -1, -1, 9, 5, 7, 9,
  7, 2, 9, 2, 0, 2, 7, 11, -1, -1, -1, -1, 2, 3, 11, 0, 1, 8, 1, 7, 8, 1, 5, 7, -1, -1, -1, -1, 11, 2, 1, 11, 1, 7, 7,
  1, 5, -1, -1, -1, -1, -1, -1, -1, 9, 5, 8, 8, 5, 7, 10, 1, 3, 10, 3, 11, -1, -1, -1, -1, 5, 7, 0, 5, 0, 9, 7, 11, 0,
  1, 0, 10, 11, 10, 0, -1, 11, 10, 0, 11, 0, 3, 10, 5, 0, 8, 0, 7, 5, 7, 0, -1, 11, 10, 5, 7, 11, 5, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, 10, 6, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 8, 3, 5, 10, 6, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, -1, 9, 0, 1, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 8, 3, 1, 9, 8, 5, 10, 6, -1, -1,
  -1, -1, -1, -1, -1, 1, 6, 5, 2, 6, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 6, 5, 1, 2, 6, 3, 0, 8, -1, -1, -1,
  -1, -1, -1, -1, 9, 6, 5, 9, 0, 6, 0, 2, 6, -1, -1, -1, -1, -1, -1, -1, 5, 9, 8, 5, 8, 2, 5, 2, 6, 3, 2, 8, -1, -1, -1,
  -1, 2, 3, 11, 10, 6, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 11, 0, 8, 11, 2, 0, 10, 6, 5, -1, -1, -1, -1, -1, -1,
  -1, 0, 1, 9, 2, 3, 11, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1, 5, 10, 6, 1, 9, 2, 9, 11, 2, 9, 8, 11, -1, -1, -1, -1, 6,
  3, 11, 6, 5, 3, 5, 1, 3, -1, -1, -1, -1, -1, -1, -1, 0, 8, 11, 0, 11, 5, 0, 5, 1, 5, 11, 6, -1, -1, -1, -1, 3, 11, 6,
  0, 3, 6, 0, 6, 5, 0, 5, 9, -1, -1, -1, -1, 6, 5, 9, 6, 9, 11, 11, 9, 8, -1, -1, -1, -1, -1, -1, -1, 5, 10, 6, 4, 7, 8,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 4, 3, 0, 4, 7, 3, 6, 5, 10, -1, -1, -1, -1, -1, -1, -1, 1, 9, 0, 5, 10, 6, 8,
  4, 7, -1, -1, -1, -1, -1, -1, -1, 10, 6, 5, 1, 9, 7, 1, 7, 3, 7, 9, 4, -1, -1, -1, -1, 6, 1, 2, 6, 5, 1, 4, 7, 8, -1,
  -1, -1, -1, -1, -1, -1, 1, 2, 5, 5, 2, 6, 3, 0, 4, 3, 4, 7, -1, -1, -1, -1, 8, 4, 7, 9, 0, 5, 0, 6, 5, 0, 2, 6, -1,
  -1, -1, -1, 7, 3, 9, 7, 9, 4, 3, 2, 9, 5, 9, 6, 2, 6, 9, -1, 3, 11, 2, 7, 8, 4, 10, 6, 5, -1, -1, -1, -1, -1, -1, -1,
  5, 10, 6, 4, 7, 2, 4, 2, 0, 2, 7, 11, -1, -1, -1, -1, 0, 1, 9, 4, 7, 8, 2, 3, 11, 5, 10, 6, -1, -1, -1, -1, 9, 2, 1,
  9, 11, 2, 9, 4, 11, 7, 11, 4, 5, 10, 6, -1, 8, 4, 7, 3, 11, 5, 3, 5, 1, 5, 11, 6, -1, -1, -1, -1, 5, 1, 11, 5, 11, 6,
  1, 0, 11, 7, 11, 4, 0, 4, 11, -1, 0, 5, 9, 0, 6, 5, 0, 3, 6, 11, 6, 3, 8, 4, 7, -1, 6, 5, 9, 6, 9, 11, 4, 7, 9, 7, 11,
  9, -1, -1, -1, -1, 10, 4, 9, 6, 4, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 4, 10, 6, 4, 9, 10, 0, 8, 3, -1, -1,
  -1, -1, -1, -1, -1, 10, 0, 1, 10, 6, 0, 6, 4, 0, -1, -1, -1, -1, -1, -1, -1, 8, 3, 1, 8, 1, 6, 8, 6, 4, 6, 1, 10, -1,
  -1, -1, -1, 1, 4, 9, 1, 2, 4, 2, 6, 4, -1, -1, -1, -1, -1, -1, -1, 3, 0, 8, 1, 2, 9, 2, 4, 9, 2, 6, 4, -1, -1, -1, -1,
  0, 2, 4, 4, 2, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 8, 3, 2, 8, 2, 4, 4, 2, 6, -1, -1, -1, -1, -1, -1, -1, 10,
  4, 9, 10, 6, 4, 11, 2, 3, -1, -1, -1, -1, -1, -1, -1, 0, 8, 2, 2, 8, 11, 4, 9, 10, 4, 10, 6, -1, -1, -1, -1, 3, 11, 2,
  0, 1, 6, 0, 6, 4, 6, 1, 10, -1, -1, -1, -1, 6, 4, 1, 6, 1, 10, 4, 8, 1, 2, 1, 11, 8, 11, 1, -1, 9, 6, 4, 9, 3, 6, 9,
  1, 3, 11, 6, 3, -1, -1, -1, -1, 8, 11, 1, 8, 1, 0, 11, 6, 1, 9, 1, 4, 6, 4, 1, -1, 3, 11, 6, 3, 6, 0, 0, 6, 4, -1, -1,
  -1, -1, -1, -1, -1, 6, 4, 8, 11, 6, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 7, 10, 6, 7, 8, 10, 8, 9, 10, -1, -1,
  -1, -1, -1, -1, -1, 0, 7, 3, 0, 10, 7, 0, 9, 10, 6, 7, 10, -1, -1, -1, -1, 10, 6, 7, 1, 10, 7, 1, 7, 8, 1, 8, 0, -1,
  -1, -1, -1, 10, 6, 7, 10, 7, 1, 1, 7, 3, -1, -1, -1, -1, -1, -1, -1, 1, 2, 6, 1, 6, 8, 1, 8, 9, 8, 6, 7, -1, -1, -1,
  -1, 2, 6, 9, 2, 9, 1, 6, 7, 9, 0, 9, 3, 7, 3, 9, -1, 7, 8, 0, 7, 0, 6, 6, 0, 2, -1, -1, -1, -1, -1, -1, -1, 7, 3, 2,
  6, 7, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 2, 3, 11, 10, 6, 8, 10, 8, 9, 8, 6, 7, -1, -1, -1, -1, 2, 0, 7, 2, 7,
  11, 0, 9, 7, 6, 7, 10, 9, 10, 7, -1, 1, 8, 0, 1, 7, 8, 1, 10, 7, 6, 7, 10, 2, 3, 11, -1, 11, 2, 1, 11, 1, 7, 10, 6, 1,
  6, 7, 1, -1, -1, -1, -1, 8, 9, 6, 8, 6, 7, 9, 1, 6, 11, 6, 3, 1, 3, 6, -1, 0, 9, 1, 11, 6, 7, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, 7, 8, 0, 7, 0, 6, 3, 11, 0, 11, 6, 0, -1, -1, -1, -1, 7, 11, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, 7, 6, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 3, 0, 8, 11, 7, 6, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, 0, 1, 9, 11, 7, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 8, 1, 9, 8, 3, 1, 11, 7, 6, -1, -1, -1,
  -1, -1, -1, -1, 10, 1, 2, 6, 11, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 2, 10, 3, 0, 8, 6, 11, 7, -1, -1, -1,
  -1, -1, -1, -1, 2, 9, 0, 2, 10, 9, 6, 11, 7, -1, -1, -1, -1, -1, -1, -1, 6, 11, 7, 2, 10, 3, 10, 8, 3, 10, 9, 8, -1,
  -1, -1, -1, 7, 2, 3, 6, 2, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 7, 0, 8, 7, 6, 0, 6, 2, 0, -1, -1, -1, -1, -1,
  -1, -1, 2, 7, 6, 2, 3, 7, 0, 1, 9, -1, -1, -1, -1, -1, -1, -1, 1, 6, 2, 1, 8, 6, 1, 9, 8, 8, 7, 6, -1, -1, -1, -1, 10,
  7, 6, 10, 1, 7, 1, 3, 7, -1, -1, -1, -1, -1, -1, -1, 10, 7, 6, 1, 7, 10, 1, 8, 7, 1, 0, 8, -1, -1, -1, -1, 0, 3, 7, 0,
  7, 10, 0, 10, 9, 6, 10, 7, -1, -1, -1, -1, 7, 6, 10, 7, 10, 8, 8, 10, 9, -1, -1, -1, -1, -1, -1, -1, 6, 8, 4, 11, 8,
  6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 3, 6, 11, 3, 0, 6, 0, 4, 6, -1, -1, -1, -1, -1, -1, -1, 8, 6, 11, 8, 4, 6,
  9, 0, 1, -1, -1, -1, -1, -1, -1, -1, 9, 4, 6, 9, 6, 3, 9, 3, 1, 11, 3, 6, -1, -1, -1, -1, 6, 8, 4, 6, 11, 8, 2, 10, 1,
  -1, -1, -1, -1, -1, -1, -1, 1, 2, 10, 3, 0, 11, 0, 6, 11, 0, 4, 6, -1, -1, -1, -1, 4, 11, 8, 4, 6, 11, 0, 2, 9, 2, 10,
  9, -1, -1, -1, -1, 10, 9, 3, 10, 3, 2, 9, 4, 3, 11, 3, 6, 4, 6, 3, -1, 8, 2, 3, 8, 4, 2, 4, 6, 2, -1, -1, -1, -1, -1,
  -1, -1, 0, 4, 2, 4, 6, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 9, 0, 2, 3, 4, 2, 4, 6, 4, 3, 8, -1, -1, -1, -1,
  1, 9, 4, 1, 4, 2, 2, 4, 6, -1, -1, -1, -1, -1, -1, -1, 8, 1, 3, 8, 6, 1, 8, 4, 6, 6, 10, 1, -1, -1, -1, -1, 10, 1, 0,
  10, 0, 6, 6, 0, 4, -1, -1, -1, -1, -1, -1, -1, 4, 6, 3, 4, 3, 8, 6, 10, 3, 0, 3, 9, 10, 9, 3, -1, 10, 9, 4, 6, 10, 4,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 4, 9, 5, 7, 6, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 8, 3, 4, 9, 5,
  11, 7, 6, -1, -1, -1, -1, -1, -1, -1, 5, 0, 1, 5, 4, 0, 7, 6, 11, -1, -1, -1, -1, -1, -1, -1, 11, 7, 6, 8, 3, 4, 3, 5,
  4, 3, 1, 5, -1, -1, -1, -1, 9, 5, 4, 10, 1, 2, 7, 6, 11, -1, -1, -1, -1, -1, -1, -1, 6, 11, 7, 1, 2, 10, 0, 8, 3, 4,
  9, 5, -1, -1, -1, -1, 7, 6, 11, 5, 4, 10, 4, 2, 10, 4, 0, 2, -1, -1, -1, -1, 3, 4, 8, 3, 5, 4, 3, 2, 5, 10, 5, 2, 11,
  7, 6, -1, 7, 2, 3, 7, 6, 2, 5, 4, 9, -1, -1, -1, -1, -1, -1, -1, 9, 5, 4, 0, 8, 6, 0, 6, 2, 6, 8, 7, -1, -1, -1, -1,
  3, 6, 2, 3, 7, 6, 1, 5, 0, 5, 4, 0, -1, -1, -1, -1, 6, 2, 8, 6, 8, 7, 2, 1, 8, 4, 8, 5, 1, 5, 8, -1, 9, 5, 4, 10, 1,
  6, 1, 7, 6, 1, 3, 7, -1, -1, -1, -1, 1, 6, 10, 1, 7, 6, 1, 0, 7, 8, 7, 0, 9, 5, 4, -1, 4, 0, 10, 4, 10, 5, 0, 3, 10,
  6, 10, 7, 3, 7, 10, -1, 7, 6, 10, 7, 10, 8, 5, 4, 10, 4, 8, 10, -1, -1, -1, -1, 6, 9, 5, 6, 11, 9, 11, 8, 9, -1, -1,
  -1, -1, -1, -1, -1, 3, 6, 11, 0, 6, 3, 0, 5, 6, 0, 9, 5, -1, -1, -1, -1, 0, 11, 8, 0, 5, 11, 0, 1, 5, 5, 6, 11, -1,
  -1, -1, -1, 6, 11, 3, 6, 3, 5, 5, 3, 1, -1, -1, -1, -1, -1, -1, -1, 1, 2, 10, 9, 5, 11, 9, 11, 8, 11, 5, 6, -1, -1,
  -1, -1, 0, 11, 3, 0, 6, 11, 0, 9, 6, 5, 6, 9, 1, 2, 10, -1, 11, 8, 5, 11, 5, 6, 8, 0, 5, 10, 5, 2, 0, 2, 5, -1, 6, 11,
  3, 6, 3, 5, 2, 10, 3, 10, 5, 3, -1, -1, -1, -1, 5, 8, 9, 5, 2, 8, 5, 6, 2, 3, 8, 2, -1, -1, -1, -1, 9, 5, 6, 9, 6, 0,
  0, 6, 2, -1, -1, -1, -1, -1, -1, -1, 1, 5, 8, 1, 8, 0, 5, 6, 8, 3, 8, 2, 6, 2, 8, -1, 1, 5, 6, 2, 1, 6, -1, -1, -1,
  -1, -1, -1, -1, -1, -1, -1, 1, 3, 6, 1, 6, 10, 3, 8, 6, 5, 6, 9, 8, 9, 6, -1, 10, 1, 0, 10, 0, 6, 9, 5, 0, 5, 6, 0,
  -1, -1, -1, -1, 0, 3, 8, 5, 6, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 10, 5, 6, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, 11, 5, 10, 7, 5, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 11, 5, 10, 11, 7, 5, 8, 3, 0, -1, -1,
  -1, -1, -1, -1, -1, 5, 11, 7, 5, 10, 11, 1, 9, 0, -1, -1, -1, -1, -1, -1, -1, 10, 7, 5, 10, 11, 7, 9, 8, 1, 8, 3, 1,
  -1, -1, -1, -1, 11, 1, 2, 11, 7, 1, 7, 5, 1, -1, -1, -1, -1, -1, -1, -1, 0, 8, 3, 1, 2, 7, 1, 7, 5, 7, 2, 11, -1, -1,
  -1, -1, 9, 7, 5, 9, 2, 7, 9, 0, 2, 2, 11, 7, -1, -1, -1, -1, 7, 5, 2, 7, 2, 11, 5, 9, 2, 3, 2, 8, 9, 8, 2, -1, 2, 5,
  10, 2, 3, 5, 3, 7, 5, -1, -1, -1, -1, -1, -1, -1, 8, 2, 0, 8, 5, 2, 8, 7, 5, 10, 2, 5, -1, -1, -1, -1, 9, 0, 1, 5, 10,
  3, 5, 3, 7, 3, 10, 2, -1, -1, -1, -1, 9, 8, 2, 9, 2, 1, 8, 7, 2, 10, 2, 5, 7, 5, 2, -1, 1, 3, 5, 3, 7, 5, -1, -1, -1,
  -1, -1, -1, -1, -1, -1, -1, 0, 8, 7, 0, 7, 1, 1, 7, 5, -1, -1, -1, -1, -1, -1, -1, 9, 0, 3, 9, 3, 5, 5, 3, 7, -1, -1,
  -1, -1, -1, -1, -1, 9, 8, 7, 5, 9, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 5, 8, 4, 5, 10, 8, 10, 11, 8, -1, -1,
  -1, -1, -1, -1, -1, 5, 0, 4, 5, 11, 0, 5, 10, 11, 11, 3, 0, -1, -1, -1, -1, 0, 1, 9, 8, 4, 10, 8, 10, 11, 10, 4, 5,
  -1, -1, -1, -1, 10, 11, 4, 10, 4, 5, 11, 3, 4, 9, 4, 1, 3, 1, 4, -1, 2, 5, 1, 2, 8, 5, 2, 11, 8, 4, 5, 8, -1, -1, -1,
  -1, 0, 4, 11, 0, 11, 3, 4, 5, 11, 2, 11, 1, 5, 1, 11, -1, 0, 2, 5, 0, 5, 9, 2, 11, 5, 4, 5, 8, 11, 8, 5, -1, 9, 4, 5,
  2, 11, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 2, 5, 10, 3, 5, 2, 3, 4, 5, 3, 8, 4, -1, -1, -1, -1, 5, 10, 2, 5, 2,
  4, 4, 2, 0, -1, -1, -1, -1, -1, -1, -1, 3, 10, 2, 3, 5, 10, 3, 8, 5, 4, 5, 8, 0, 1, 9, -1, 5, 10, 2, 5, 2, 4, 1, 9, 2,
  9, 4, 2, -1, -1, -1, -1, 8, 4, 5, 8, 5, 3, 3, 5, 1, -1, -1, -1, -1, -1, -1, -1, 0, 4, 5, 1, 0, 5, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, 8, 4, 5, 8, 5, 3, 9, 0, 5, 0, 3, 5, -1, -1, -1, -1, 9, 4, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, 4, 11, 7, 4, 9, 11, 9, 10, 11, -1, -1, -1, -1, -1, -1, -1, 0, 8, 3, 4, 9, 7, 9, 11, 7, 9, 10, 11, -1,
  -1, -1, -1, 1, 10, 11, 1, 11, 4, 1, 4, 0, 7, 4, 11, -1, -1, -1, -1, 3, 1, 4, 3, 4, 8, 1, 10, 4, 7, 4, 11, 10, 11, 4,
  -1, 4, 11, 7, 9, 11, 4, 9, 2, 11, 9, 1, 2, -1, -1, -1, -1, 9, 7, 4, 9, 11, 7, 9, 1, 11, 2, 11, 1, 0, 8, 3, -1, 11, 7,
  4, 11, 4, 2, 2, 4, 0, -1, -1, -1, -1, -1, -1, -1, 11, 7, 4, 11, 4, 2, 8, 3, 4, 3, 2, 4, -1, -1, -1, -1, 2, 9, 10, 2,
  7, 9, 2, 3, 7, 7, 4, 9, -1, -1, -1, -1, 9, 10, 7, 9, 7, 4, 10, 2, 7, 8, 7, 0, 2, 0, 7, -1, 3, 7, 10, 3, 10, 2, 7, 4,
  10, 1, 10, 0, 4, 0, 10, -1, 1, 10, 2, 8, 7, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 4, 9, 1, 4, 1, 7, 7, 1, 3, -1,
  -1, -1, -1, -1, -1, -1, 4, 9, 1, 4, 1, 7, 0, 8, 1, 8, 7, 1, -1, -1, -1, -1, 4, 0, 3, 7, 4, 3, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, 4, 8, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 9, 10, 8, 10, 11, 8, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, 3, 0, 9, 3, 9, 11, 11, 9, 10, -1, -1, -1, -1, -1, -1, -1, 0, 1, 10, 0, 10, 8, 8, 10, 11, -1, -1,
  -1, -1, -1, -1, -1, 3, 1, 10, 11, 3, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 2, 11, 1, 11, 9, 9, 11, 8, -1, -1,
  -1, -1, -1, -1, -1, 3, 0, 9, 3, 9, 11, 1, 2, 9, 2, 11, 9, -1, -1, -1, -1, 0, 2, 11, 8, 0, 11, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, 3, 2, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 2, 3, 8, 2, 8, 10, 10, 8, 9, -1, -1, -1,
  -1, -1, -1, -1, 9, 10, 2, 0, 9, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 2, 3, 8, 2, 8, 10, 0, 1, 8, 1, 10, 8, -1,
  -1, -1, -1, 1, 10, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 3, 8, 9, 1, 8, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, 0, 9, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 3, 8, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
]);

export { MarchingCubes, edgeTable, triTable };
export default MarchingCubes;

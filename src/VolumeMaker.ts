/**
 * Basic utility functions to create sample volume data
 * @class
 */
export default class VolumeMaker {
  /**
   * Rasterize a signed distance function into a volume of vx * vy * vz dimensions. This is a binary filling operation.
   * @param {number} vx
   * @param {number} vy
   * @param {number} vz
   * @param {function} sdFunc A function f(x,y,z) that returns a distance. f < 0 will be the interior of the volume, and f>=0 will be outside.
   */
  static createVolume(
    vx: number,
    vy: number,
    vz: number,
    sdFunc: (px: number, py: number, pz: number) => number
  ): Uint8Array {
    const data = new Uint8Array(vx * vy * vz).fill(0);
    const cx = vx / 2;
    const cy = vy / 2;
    const cz = vz / 2;
    let offset, px, py, pz;
    for (let i = 0; i < vz; ++i) {
      for (let j = 0; j < vy; ++j) {
        for (let k = 0; k < vx; ++k) {
          offset = i * (vx * vy) + j * vx + k;
          px = k - cx;
          py = j - cy;
          pz = i - cz;
          if (sdFunc(px, py, pz) < 0) {
            data[offset] = 255;
          } else {
            data[offset] = 0;
          }
        }
      }
    }
    return data;
  }

  /**
   * Create a volume filled with a sphere in the center
   * @param {number} vx
   * @param {number} vy
   * @param {number} vz
   * @param {number} radius
   */
  static createSphere(vx: number, vy: number, vz: number, radius: number): Uint8Array {
    return VolumeMaker.createVolume(vx, vy, vz, (px, py, pz) => {
      return Math.sqrt(px * px + py * py + pz * pz) - radius;
    });
  }

  /**
   * Create a volume with a cylinder centered inside.
   * @param {number} vx
   * @param {number} vy
   * @param {number} vz
   * @param {number} hx width of cap (?)
   * @param {number} hy depth of cap (?)
   */
  static createCylinder(vx: number, vy: number, vz: number, hx: number, hy: number): Uint8Array {
    let dx, dy, mdx, mdy;
    return VolumeMaker.createVolume(vx, vy, vz, (px, py, pz) => {
      dx = Math.abs(Math.sqrt(px * px + pz * pz)) - hx;
      dy = Math.abs(py) - hy;
      mdx = Math.max(dx, 0.0);
      mdy = Math.max(dy, 0.0);
      return Math.min(Math.max(dx, dy), 0.0) + Math.sqrt(mdx * mdx + mdy * mdy);
    });
  }

  /**
   * Create a volume with a torus centered inside
   * @param {number} vx
   * @param {number} vy
   * @param {number} vz
   * @param {number} tx inner radius
   * @param {number} ty outer radius
   */
  static createTorus(vx: number, vy: number, vz: number, tx: number, ty: number): Uint8Array {
    let qx, qy;
    return VolumeMaker.createVolume(vx, vy, vz, (px, py, pz) => {
      qx = Math.sqrt(px * px + pz * pz) - tx;
      qy = py;
      return Math.sqrt(qx * qx + qy * qy) - ty;
    });
  }

  /**
   * Create a volume with a cone centered inside.  cx, cy must be a 2d normalized pair...?
   * @param {number} vx
   * @param {number} vy
   * @param {number} vz
   * @param {number} cx base radius
   * @param {number} cy height
   */
  static createCone(vx: number, vy: number, vz: number, cx: number, cy: number): Uint8Array {
    let q;
    return VolumeMaker.createVolume(vx, vy, vz, (px, py, pz) => {
      q = Math.sqrt(px * px + py * py);
      return cx * q + cy * pz;
    });
  }
}

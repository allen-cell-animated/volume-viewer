import { Vector3 } from "three";
export const AREA_LIGHT = 0;
export const SKY_LIGHT = 1;

export class Light {
  // type = 1 for sky light, 0 for area light
  constructor(type) {
    this.m_theta = (14 * Math.PI) / 180.0;
    this.m_phi = (54 * Math.PI) / 180.0;
    this.m_width = 1.0;
    this.m_height = 1.0;
    this.m_distance = 4.0;
    this.m_skyRadius = 1000.0;
    this.m_P = new Vector3();
    this.m_target = new Vector3();
    this.m_area = 1.0;
    this.m_color = new Vector3(75, 75, 75);
    this.m_colorTop = new Vector3(0.3, 0.3, 0.3);
    this.m_colorMiddle = new Vector3(0.3, 0.3, 0.3);
    this.m_colorBottom = new Vector3(0.3, 0.3, 0.3);

    // type = 1 for sky light, 0 for area light
    this.m_T = type;

    // secondary properties:
    this.m_N = new Vector3(0, 0, 1);
    this.m_U = new Vector3(1, 0, 0);
    this.m_V = new Vector3(0, 1, 0);
    this.update(new Vector3(0, 0, 0));
  }

  update(targetPoint, cameraMatrix) {
    this.m_halfWidth = 0.5 * this.m_width;
    this.m_halfHeight = 0.5 * this.m_height;
    this.m_target.copy(targetPoint);

    // Determine light position
    this.m_P.x = this.m_distance * Math.sin(this.m_phi) * Math.sin(this.m_theta);
    this.m_P.z = this.m_distance * Math.sin(this.m_phi) * Math.cos(this.m_theta);
    this.m_P.y = this.m_distance * Math.cos(this.m_phi);

    this.m_P.add(this.m_target);

    if (cameraMatrix) {
      // We want to treat the lights as positioned relative to the camera, so camera rotations should not move them.
      // In other words, when we rotate the camera, it should seem like we are tumbling the volume under fixed lighting.
      this.m_P.applyMatrix4(cameraMatrix);
      this.m_target.applyMatrix4(cameraMatrix);
    }

    // Determine area
    if (this.m_T === AREA_LIGHT) {
      this.m_area = this.m_width * this.m_height;
      this.m_areaPdf = 1.0 / this.m_area;
    } else if (this.m_T === SKY_LIGHT) {
      this.m_P.copy(targetPoint);
      // shift by nonzero amount
      this.m_target.addVectors(this.m_P, new Vector3(0.0, 0.0, 1.0));
      this.m_skyRadius = 1000.0 * targetPoint.length() * 2.0;
      this.m_area = 4.0 * Math.PI * Math.pow(this.m_skyRadius, 2.0);
      this.m_areaPdf = 1.0 / this.m_area;
    }

    // Compute orthogonal basis frame
    this.m_N.subVectors(this.m_target, this.m_P).normalize();
    // if N and "up" are parallel, then just choose a different "up"
    if (this.m_N.y === 1.0 || this.m_N.y === -1.0) {
      this.m_U.crossVectors(this.m_N, new Vector3(1.0, 0.0, 0.0)).normalize();
    } else {
      // standard "up" vector
      this.m_U.crossVectors(this.m_N, new Vector3(0.0, 1.0, 0.0)).normalize();
    }
    this.m_V.crossVectors(this.m_N, this.m_U).normalize();
  }
}

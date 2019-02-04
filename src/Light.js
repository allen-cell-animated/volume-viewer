export const AREA_LIGHT = 0;
export const SKY_LIGHT = 1;

export class Light {

    // type = 1 for sky light, 0 for area light
    constructor(type) {
        this.m_theta = 0.0;
        this.m_phi = 0.0;
        this.m_width = 10.0;
        this.m_height = 10.0;
        this.m_distance = 10.0;
        this.m_skyRadius = 1000.0;
        this.m_P = new THREE.Vector3();
        this.m_target = new THREE.Vector3();
        this.m_area = 100.0;
        this.m_color = new THREE.Vector3(1,1,1);
        this.m_colorTop = new THREE.Vector3(1,0,0);
        this.m_colorMiddle = new THREE.Vector3(1,1,1);
        this.m_colorBottom = new THREE.Vector3(0,0,1);
        this.m_T = type; // sky light

        // secondary properties:
        this.m_N = new THREE.Vector3(0,0,1);
        this.m_U = new THREE.Vector3(1,0,0);
        this.m_V = new THREE.Vector3(0,1,0);
        this.update(new THREE.Vector3(0,0,0));
    }

    update(targetPoint) {
        this.m_halfWidth = 0.5 * this.m_width;
        this.m_halfHeight = 0.5 * this.m_height;
        this.m_target.copy(targetPoint);
  
        // Determine light position
        this.m_P.x = this.m_distance * Math.cos(this.m_phi) * Math.sin(this.m_theta);
        this.m_P.z = this.m_distance * Math.cos(this.m_phi) * Math.cos(this.m_theta);
        this.m_P.y = this.m_distance * Math.sin(this.m_phi);
  
        this.m_P.add(this.m_target);
  
        // Determine area
        if (this.m_T === AREA_LIGHT) {
          this.m_area = this.m_width * this.m_height;
          this.m_areaPdf = 1.0 / this.m_area;
        }
        else if (this.m_T === SKY_LIGHT) {
          this.m_P.copy(targetPoint);
          // shift by nonzero amount
          this.m_target.addVectors(this.m_P, new THREE.Vector3(0.0, 0.0, 1.0));
          this.m_skyRadius = 1000.0 * targetPoint.length() * 2.0;
          this.m_area = 4.0 * Math.PI * Math.pow(this.m_skyRadius, 2.0);
          this.m_areaPdf = 1.0 / this.m_area;
        }

        // Compute orthogonal basis frame
        this.m_N.subVectors(this.m_target, this.m_P).normalize();
        this.m_U.crossVectors(this.m_N, new THREE.Vector3(0.0, 1.0, 0.0)).normalize();
        this.m_V.crossVectors(this.m_N, this.m_U).normalize();
    }
};

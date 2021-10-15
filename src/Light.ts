import { Vector3, Matrix4 } from "three";
export const AREA_LIGHT = 0;
export const SKY_LIGHT = 1;

export class Light {
  public mTheta: number;
  public mPhi: number;
  public mWidth: number;
  public mHeight: number;
  public mDistance: number;
  public mSkyRadius: number;
  public mP: Vector3;
  public mTarget: Vector3;
  public mArea: number;
  public mColor: Vector3;
  public mColorTop: Vector3;
  public mColorMiddle: Vector3;
  public mColorBottom: Vector3;
  public mT: number;
  public mN: Vector3;
  public mU: Vector3;
  public mV: Vector3;
  public mHalfWidth: number;
  public mHalfHeight: number;
  private mAreaPdf: number;

  // type = 1 for sky light, 0 for area light
  constructor(type: number) {
    this.mTheta = (14 * Math.PI) / 180.0;
    this.mPhi = (54 * Math.PI) / 180.0;
    this.mWidth = 1.0;
    this.mHeight = 1.0;
    this.mHalfWidth = 0.5 * this.mWidth;
    this.mHalfHeight = 0.5 * this.mHeight;
    this.mDistance = 4.0;
    this.mSkyRadius = 1000.0;
    this.mP = new Vector3();
    this.mTarget = new Vector3();
    this.mArea = 1.0;
    this.mAreaPdf = 1.0 / this.mArea;
    this.mColor = new Vector3(75, 75, 75);
    this.mColorTop = new Vector3(0.3, 0.3, 0.3);
    this.mColorMiddle = new Vector3(0.3, 0.3, 0.3);
    this.mColorBottom = new Vector3(0.3, 0.3, 0.3);

    // type = 1 for sky light, 0 for area light
    this.mT = type;

    // secondary properties:
    this.mN = new Vector3(0, 0, 1);
    this.mU = new Vector3(1, 0, 0);
    this.mV = new Vector3(0, 1, 0);
    this.update(new Vector3(0, 0, 0));
  }

  update(targetPoint: Vector3, cameraMatrix?: Matrix4): void {
    this.mHalfWidth = 0.5 * this.mWidth;
    this.mHalfHeight = 0.5 * this.mHeight;
    this.mTarget.copy(targetPoint);

    // Determine light position
    this.mP.x = this.mDistance * Math.sin(this.mPhi) * Math.sin(this.mTheta);
    this.mP.z = this.mDistance * Math.sin(this.mPhi) * Math.cos(this.mTheta);
    this.mP.y = this.mDistance * Math.cos(this.mPhi);

    this.mP.add(this.mTarget);

    if (cameraMatrix) {
      // We want to treat the lights as positioned relative to the camera, so camera rotations should not move them.
      // In other words, when we rotate the camera, it should seem like we are tumbling the volume under fixed lighting.
      this.mP.applyMatrix4(cameraMatrix);
      this.mTarget.applyMatrix4(cameraMatrix);
    }

    // Determine area
    if (this.mT === AREA_LIGHT) {
      this.mArea = this.mWidth * this.mHeight;
      this.mAreaPdf = 1.0 / this.mArea;
    } else if (this.mT === SKY_LIGHT) {
      this.mP.copy(targetPoint);
      // shift by nonzero amount
      this.mTarget.addVectors(this.mP, new Vector3(0.0, 0.0, 1.0));
      this.mSkyRadius = 1000.0 * targetPoint.length() * 2.0;
      this.mArea = 4.0 * Math.PI * Math.pow(this.mSkyRadius, 2.0);
      this.mAreaPdf = 1.0 / this.mArea;
    }

    // Compute orthogonal basis frame
    this.mN.subVectors(this.mTarget, this.mP).normalize();
    // if N and "up" are parallel, then just choose a different "up"
    if (this.mN.y === 1.0 || this.mN.y === -1.0) {
      this.mU.crossVectors(this.mN, new Vector3(1.0, 0.0, 0.0)).normalize();
    } else {
      // standard "up" vector
      this.mU.crossVectors(this.mN, new Vector3(0.0, 1.0, 0.0)).normalize();
    }
    this.mV.crossVectors(this.mN, this.mU).normalize();
  }
}

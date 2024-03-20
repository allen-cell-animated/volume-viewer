export const LUT_ENTRIES = 256;
export const LUT_ARRAY_LENGTH = LUT_ENTRIES * 4;

/**
 * @typedef {Object} ControlPoint Used for the TF (transfer function) editor GUI.
 * Need to be converted to LUT for rendering.
 * @property {number} x The X Coordinate
 * @property {number} opacity The Opacity, from 0 to 1
 * @property {Array.<number>} color The Color, 3 numbers from 0-255 for r,g,b
 */
export type ControlPoint = {
  x: number;
  opacity: number;
  color: [number, number, number];
};

/**
 * @typedef {Object} Lut Used for rendering.
 * @property {Array.<number>} lut LUT_ARRAY_LENGTH element lookup table as array
 * (maps scalar intensity to a rgb color plus alpha, with each value from 0-255)
 * @property {Array.<ControlPoint>} controlPoints
 */
export class Lut {
  public lut: Uint8Array;
  public controlPoints: ControlPoint[];

  constructor() {
    this.lut = new Uint8Array(LUT_ARRAY_LENGTH);
    this.controlPoints = [];
  }
}

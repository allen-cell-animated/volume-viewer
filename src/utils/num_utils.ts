import { Axis } from "../VolumeRenderSettings.js";

export const DEFAULT_SIG_FIGS = 5;

// Adapted from https://gist.github.com/ArneS/2ecfbe4a9d7072ac56c0.
function digitToUnicodeSupercript(n: number): string {
  const subst = [0x2070, 185, 178, 179, 0x2074, 0x2075, 0x2076, 0x2077, 0x2078, 0x2079];
  return String.fromCharCode(subst[n]);
}

/**
 * Converts a number to scientific notation with the specified number of significant
 * figures, handling negative numbers and rounding.
 * @param input The number to convert.
 * @param significantFigures the number of signficant figures/digits. Must be >= 1.
 * @returns a string, formatted as a number in scientific notation.
 * @example
 * ```
 * numberToSciNotation(1, 3) // "1.00×10⁰"
 * numberToSciNotation(0.99, 2) // "9.9×10⁻¹"
 * numberToSciNotation(0.999, 2) // "1.0×10⁰"
 * numberToSciNotation(-0.05, 1) // "-5×10⁻²"
 * numberToSciNotation(1400, 3) // "1.40×10³"
 * ```
 */
function numberToSciNotation(input: number, sigFigs = DEFAULT_SIG_FIGS): string {
  const nativeExpForm = input.toExponential(sigFigs - 1);
  const [significand, exponent] = nativeExpForm.split("e");
  const expSign = exponent[0] === "-" ? "⁻" : "";
  const expDigits = exponent.slice(1).split("");
  const expSuperscript = expDigits.map((digit) => digitToUnicodeSupercript(Number(digit))).join("");
  return `${significand}×10${expSign}${expSuperscript}`;
}

/**
 * Returns a string-encoded number rounded to a specified decimal precision, without ever formatting in scientific
 * notation like `Number.toPrecision` might do.
 */
function toSigFigs(value: number, sigFigs: number): string {
  const exponent = Math.floor(Math.log10(Math.abs(value)));
  return value.toFixed(Math.max(sigFigs - exponent - 1, 0));
}

/** Trims trailing instances of `char` off the end of `str`. */
// This is not technically a number utility, but it's useful to `formatNumber` below.
function trimTrailing(str: string, char: string): string {
  let i = str.length - 1;
  while (str[i] === char) {
    i--;
  }
  return str.slice(0, i + 1);
}

/**
 * Formats numbers for display as a string with a (hopefully) limited length.
 *
 * - If the number is an integer with 4 or fewer digits, it is returned as a string.
 * - If the number is a decimal, it is rounded to `sigFigs` significant figures. (default 5)
 * - If the number's absolute value is over 10,000 or less than 0.01, it is formatted in scientific notation to
 *   `sciSigFigs` significant figures. (Default `sigFigs - 2`, so 3 if neither are specified. The `- 2` leaves space
 *   for the exponential part. Remember: the purpose of this function is keeping number strings *consistently* short!)
 */
export function formatNumber(value: number, sigFigs = DEFAULT_SIG_FIGS, sciSigFigs = sigFigs - 2): string {
  const valueAbs = Math.abs(value);

  if (Number.isInteger(value)) {
    // Format integers with 5+ digits in scientific notation
    if (valueAbs >= 10_000) {
      return numberToSciNotation(value, sciSigFigs);
    }
    // Just stringify other integers
    return value.toString();
  } else {
    const numStr = toSigFigs(value, sigFigs);
    const numRounded = Math.abs(Number(numStr));
    if (numRounded >= 10_000 || numRounded < 0.01) {
      return numberToSciNotation(value, sciSigFigs);
    }
    const trimmed = trimTrailing(numStr, "0");
    return trimmed.endsWith(".") ? trimmed.slice(0, -1) : trimmed;
  }
}

/**
 * Constrains the `src` vector relative to the `target` so it only has freedom along the
 * specified `axis`. Does nothing if `axis = Axis.NONE`.
 *
 * @example
 * ```
 *   const src = [1, 2, 3];
 *   const target = [4, 5, 6];
 *   const constrained = constrainToAxis(src, target, Axis.X);
 *   console.log(constrained); // [1, 5, 6]
 * ```
 */
export function constrainToAxis(
  src: [number, number, number],
  target: [number, number, number],
  axis: Axis
): [number, number, number] {
  switch (axis) {
    case Axis.X:
      return [src[0], target[1], target[2]];
    case Axis.Y:
      return [target[0], src[1], target[2]];
    case Axis.Z:
      return [target[0], target[1], src[2]];
    default:
      return [...src];
  }
}

const DEFAULT_SIG_FIGS = 5;

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

const ZERO_SCI = numberToSciNotation(0);

/** Trims trailing instances of `char` off the end of `str`. */
// This is not technically a number utility, but it's useful to `formatNumber` below.
function trimTrailing(str: string, char: string): string {
  let i = str.length - 1;
  while (str[i] === char) {
    i--;
  }
  return str.slice(0, i + 1);
}

export function formatNumber(value: number): string {
  const valueAbs = Math.abs(value);
  if (valueAbs < 0.01 || valueAbs >= 10_000) {
    const sciNotation = numberToSciNotation(value);
    if (sciNotation === ZERO_SCI) {
      return "0";
    }
    return numberToSciNotation(value, 3);
  } else if (Number.isInteger(value)) {
    return value.toString();
  } else {
    // `toPrecision` may try to format numbers in scientific notation, so we do a similar thing with `toFixed` instead.
    const numStr = value.toFixed(DEFAULT_SIG_FIGS - Math.floor(Math.log10(value)) - 1);
    const trimmed = trimTrailing(numStr, "0");
    return trimmed.endsWith(".") ? trimmed.slice(0, -1) : trimmed;
  }
}

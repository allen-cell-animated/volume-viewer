export const defaultColors: [number, number, number][] = [
  [255, 0, 255],
  [255, 255, 255],
  [0, 255, 255],
];

interface HSVColor {
  h: number;
  s: number;
  v: number;
}
// 0 <= (h, s, v) <= 1
// returns 0 <= (r, g, b) <= 255 rounded to nearest integer
// you can also pass in just one arg as an object of {h, s, v} props.
function HSVtoRGB(h: number | HSVColor, s: number, v: number): [number, number, number] {
  let r, g, b;
  let hh = 0;
  if (arguments.length === 1) {
    const hsv = h as HSVColor;
    (s = hsv.s), (v = hsv.v), (hh = hsv.h);
  } else {
    hh = h as number;
  }
  const i = Math.floor(hh * 6);
  const f = hh * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0:
      (r = v), (g = t), (b = p);
      break;
    case 1:
      (r = q), (g = v), (b = p);
      break;
    case 2:
      (r = p), (g = v), (b = t);
      break;
    case 3:
      (r = p), (g = q), (b = v);
      break;
    case 4:
      (r = t), (g = p), (b = v);
      break;
    case 5:
      (r = v), (g = p), (b = q);
      break;
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// 1993 Park-Miller LCG
function LCG(s) {
  return function () {
    s = Math.imul(48271, s) | 0 % 2147483647;
    return (s & 2147483647) / 2147483648;
  };
}
// Use it like so:
const myrand = LCG(123);

// if index exceeds defaultColors start choosing random ones
// returns [r,g,b] 0-255 range
export const getColorByChannelIndex = (index: number): [number, number, number] => {
  if (!defaultColors[index]) {
    defaultColors[index] = HSVtoRGB(myrand(), myrand() * 0.5 + 0.5, myrand() * 0.5 + 0.5);
  }
  return defaultColors[index];
};

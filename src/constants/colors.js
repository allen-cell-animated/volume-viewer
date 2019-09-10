export const defaultColors = [[255, 0, 255], [255, 255, 255], [0, 255, 255]];

// 0 <= (h, s, v) <= 1
// returns 0 <= (r, g, b) <= 255 rounded to nearest integer
// you can also pass in just one arg as an object of {h, s, v} props.
function HSVtoRGB(h, s, v) {
  let r, g, b, i, f, p, q, t;
  if (arguments.length === 1) {
    (s = h.s), (v = h.v), (h = h.h);
  }
  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);
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
  return function() {
    s = Math.imul(48271, s) | 0 % 2147483647;
    return (s & 2147483647) / 2147483648;
  };
}
// Use it like so:
var myrand = LCG(123);

// if index exceeds defaultColors start choosing random ones
export const getColorByChannelIndex = index => {
  if (!defaultColors[index]) {
    defaultColors[index] = HSVtoRGB(
      myrand(),
      myrand() * 0.5 + 0.5,
      myrand() * 0.5 + 0.5
    );
  }
  return defaultColors[index];
};

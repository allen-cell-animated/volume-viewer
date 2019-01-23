export const defaultColors = [
    [255, 0, 255],
    [255, 255, 255],
    [0, 255, 255],
    [226, 205, 179],
    [111, 186, 17],
    [141, 163, 192],
    [245, 241, 203],
    [224, 227, 209],
    [221, 155, 245],
    [227, 244, 245],
    [255, 98, 0],
    [247, 219, 120],
    [249, 165, 88],
    [218, 214, 235],
    [235, 26, 206],
    [36, 188, 250],
    [111, 186, 17],
    [167, 151, 119],
    [207, 198, 207],
    [249, 165, 88],
    [247, 85, 67],
    [141, 163, 192],
    [152, 176, 214],
    [17, 168, 154],
    [150, 0, 24],
    [253, 219, 2],
    [231, 220, 190],
    [226, 205, 179],
    [235, 213, 210],
    [227, 244, 245],
    [240, 236, 221],
    [219, 232, 209],
    [224, 227, 209],
    [222, 213, 193],
    [136, 136, 136],
    [240, 224, 211],
    [244, 212, 215],
    [247, 250, 252],
    [213, 222, 240],
    [87, 249, 235]
];

// 0 <= (h, s, v) <= 1
// returns 0 <= (r, g, b) <= 255 rounded to nearest integer
// you can also pass in just one arg as an object of {h, s, v} props.
function HSVtoRGB(h, s, v) {
    let r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}
  
// if index exceeds defaultColors start choosing random ones
export const getColorByChannelIndex = (index) => {
    return defaultColors[index] || HSVtoRGB(Math.random(), Math.random()*0.5 + 0.5, Math.random()*0.5 + 0.5);
};

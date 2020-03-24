// https://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately
/* accepts parameters
 * h, s, v
 */
export function HSVtoRGB(h: number, s: number, v: number) {
    let r: number = 0;
    let g: number = 0;
    let b: number = 0;
    let i, f, p, q, t: number;
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

/* accepts parameters
 * r, g, b
 */
// function RGBtoHSV(r: number, g: number, b: number) {
//     let max = Math.max(r, g, b),
//         min = Math.min(r, g, b),
//         d = max - min,
//         h,
//         s = max === 0 ? 0 : d / max,
//         v = max / 255;

//     switch (max) {
//         case min:
//             h = 0;
//             break;
//         case r:
//             h = g - b + d * (g < b ? 6 : 0);
//             h /= 6 * d;
//             break;
//         case g:
//             h = b - r + d * 2;
//             h /= 6 * d;
//             break;
//         case b:
//             h = r - g + d * 4;
//             h /= 6 * d;
//             break;
//     }
//     return [h, s, v];
// }

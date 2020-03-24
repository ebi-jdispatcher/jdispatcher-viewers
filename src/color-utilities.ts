import { ColorType } from "./custom-types";

export function getRgbColor(
    evalue: number,
    gradientSteps: number[],
    colorScheme: ColorType
) {
    // assumes length of gradientSteps is 5
    const colorSchemeSteps: number[] = colorScheme.keys;
    if (colorSchemeSteps.length != gradientSteps.length) {
        throw Error(
            "Color Scheme and Gradient Steps should have matching lengths!"
        );
    }
    if (evalue === 0.0) {
        return `rgb(${colorScheme[colorSchemeSteps[0]].join(",")})`;
    } else {
        const start = gradientSteps[0];
        const step1 = gradientSteps[1];
        const step2 = gradientSteps[2];
        const step3 = gradientSteps[3];
        const end = gradientSteps[4];
        let h: number;
        if (evalue < step1) {
            const logStart =
                start === 0 ? Math.log10(Number.MIN_VALUE) : Math.log10(start);
            h =
                0.0 +
                (Math.log10(evalue) - logStart) /
                    (Math.log10(step1) - logStart);
        } else if (evalue < step2) {
            h =
                1.0 +
                (Math.log10(evalue) - Math.log10(step1)) /
                    (Math.log10(step2) - Math.log10(step1));
        } else if (evalue < step3) {
            h =
                2.0 +
                (Math.log10(evalue) - Math.log10(step2)) /
                    (Math.log10(step3) - Math.log10(step2));
        } else if (evalue < end) {
            h =
                3.0 +
                (Math.log10(evalue) - Math.log10(step3)) /
                    (Math.log10(end) - Math.log10(step3));
        } else {
            h = 4.0;
        }
        const rgb = HSVtoRGB(h / 6, 0.75, 1.0);
        console.log(gradientSteps);
        console.log(h);
        console.log(rgb);
        return `rgb(${rgb.join(",")})`;
    }
}

export function getGradientSteps(
    minEvalue: number,
    maxEvalue: number,
    minNotZeroEvalue: number,
    scaleType: string
): number[] {
    let gradientSteps: number[] = [];
    if (scaleType === "fixed") {
        gradientSteps = [
            0,
            Math.pow(10, -1),
            Math.pow(10, 0),
            Math.pow(10, 1),
            Math.pow(10, 2)
        ];
    } else if (scaleType === "dynamic") {
        if (maxEvalue < 1e-304) {
            const eScale = -304;
            gradientSteps = [
                0,
                Math.pow(10, eScale),
                Math.pow(10, eScale / 2),
                Math.pow(10, eScale / 4),
                Math.pow(10, eScale / 8)
            ];
        } else if (minEvalue < 1) {
            const maxLog10 = Math.log10(maxEvalue);
            if (maxEvalue <= 1) {
                let secondNotZeroEvalue: number;
                if (minEvalue === 0 && minNotZeroEvalue > 0) {
                    secondNotZeroEvalue = Math.log10(minNotZeroEvalue) - 1;
                } else {
                    const minLog10 = Math.log10(minEvalue);
                    secondNotZeroEvalue = minLog10 + (maxLog10 - minLog10) / 2;
                }
                const thirdNotZeroEvalue =
                    secondNotZeroEvalue + (maxEvalue - secondNotZeroEvalue) / 2;
                const fourthNotZeroEvalue =
                    thirdNotZeroEvalue + (maxEvalue - thirdNotZeroEvalue) / 2;
                gradientSteps = [
                    minEvalue,
                    Math.pow(10, secondNotZeroEvalue),
                    Math.pow(10, thirdNotZeroEvalue),
                    Math.pow(10, fourthNotZeroEvalue),
                    maxEvalue
                ];
            } else {
                const evalueDiff =
                    Math.log10(minNotZeroEvalue) - Math.log10(maxEvalue);
                if (Math.abs(evalueDiff) <= 2) {
                    gradientSteps = [
                        minEvalue,
                        1,
                        (2 + maxEvalue) / 3,
                        (2 + 2 * maxEvalue) / 3,
                        maxEvalue
                    ];
                } else if (Math.abs(evalueDiff) <= 4) {
                    gradientSteps = [
                        minEvalue,
                        Math.pow(10, evalueDiff / 2),
                        1,
                        (maxEvalue + 1) / 2,
                        maxEvalue
                    ];
                } else {
                    gradientSteps = [
                        minEvalue,
                        Math.pow(10, evalueDiff / 2),
                        Math.pow(10, evalueDiff / 4),
                        1,
                        maxEvalue
                    ];
                }
            }
        } else {
            gradientSteps = [
                minEvalue,
                (3 * minEvalue + maxEvalue) / 4,
                (minEvalue + maxEvalue) / 2,
                (minEvalue + 3 * maxEvalue) / 4,
                maxEvalue
            ];
        }
    } else {
        console.log(`${scaleType} not yet implemented!`);
    }
    return gradientSteps;
}

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

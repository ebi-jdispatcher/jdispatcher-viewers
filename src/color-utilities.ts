import { ColorType, ColorSchemeEnum, ProteinFeaturesEnum } from "./custom-types";

export function getRgbColorGradient(
    score: number,
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
    if (score + 0.0 === 0.0) {
        return `rgb(${colorScheme[colorSchemeSteps[0]].join(",")})`;
    } else {
        const start = gradientSteps[0];
        const step1 = gradientSteps[1];
        const step2 = gradientSteps[2];
        const step3 = gradientSteps[3];
        const end = gradientSteps[4];
        let h: number;
        if (score < step1) {
            const logStart =
                start === 0 ? Math.log10(Number.MIN_VALUE) : Math.log10(start);
            h =
                0.0 +
                (Math.log10(score) - logStart) / (Math.log10(step1) - logStart);
        } else if (score < step2) {
            h =
                1.0 +
                (Math.log10(score) - Math.log10(step1)) /
                    (Math.log10(step2) - Math.log10(step1));
        } else if (score < step3) {
            h =
                2.0 +
                (Math.log10(score) - Math.log10(step2)) /
                    (Math.log10(step3) - Math.log10(step2));
        } else if (score < end) {
            h =
                3.0 +
                (Math.log10(score) - Math.log10(step3)) /
                    (Math.log10(end) - Math.log10(step3));
        } else {
            h = 4.0;
        }
        const rgb = HSVtoRGB(h / 6, 0.75, 1.0);
        return `rgb(${rgb.join(",")})`;
    }
}

export function getRgbColorFixed(
    score: number,
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
    if (score + 0.0 === 0.0 || score < gradientSteps[1]) {
        return `rgb(${colorScheme[colorSchemeSteps[0]].join(",")})`;
    } else if (score >= gradientSteps[1] && score < gradientSteps[2]) {
        return `rgb(${colorScheme[colorSchemeSteps[1]].join(",")})`;
    } else if (score >= gradientSteps[2] && score < gradientSteps[3]) {
        return `rgb(${colorScheme[colorSchemeSteps[2]].join(",")})`;
    } else if (score >= gradientSteps[3] && score < gradientSteps[4]) {
        return `rgb(${colorScheme[colorSchemeSteps[3]].join(",")})`;
    } else if (score >= gradientSteps[4]) {
        return `rgb(${colorScheme[colorSchemeSteps[4]].join(",")})`;
    } else {
        return `rgb(192,192,192)`;
    }
}

export function getGradientSteps(
    minScore: number,
    maxScore: number,
    minNotZeroScore: number,
    colorScheme: ColorSchemeEnum
): number[] {
    let gradientSteps: number[] = [];
    if (colorScheme === ColorSchemeEnum.fixed) {
        gradientSteps = [
            0,
            Math.pow(10, -1),
            Math.pow(10, 0),
            Math.pow(10, 1),
            Math.pow(10, 2)
        ];
    } else if (colorScheme === ColorSchemeEnum.dynamic) {
        if (maxScore < 1e-304) {
            const eScale = -304;
            gradientSteps = [
                0,
                Math.pow(10, eScale),
                Math.pow(10, eScale / 2),
                Math.pow(10, eScale / 4),
                Math.pow(10, eScale / 8)
            ];
        } else if (minScore < 1) {
            const maxLog10 = Math.log10(maxScore);
            if (maxScore <= 1) {
                let secondNotZeroEvalue: number;
                if (minScore === 0 && minNotZeroScore > 0) {
                    secondNotZeroEvalue = Math.log10(minNotZeroScore) - 1;
                } else {
                    const minLog10 = Math.log10(minScore);
                    secondNotZeroEvalue = minLog10 + (maxLog10 - minLog10) / 2;
                }
                const thirdNotZeroEvalue =
                    secondNotZeroEvalue + (maxScore - secondNotZeroEvalue) / 2;
                const fourthNotZeroEvalue =
                    thirdNotZeroEvalue + (maxScore - thirdNotZeroEvalue) / 2;
                gradientSteps = [
                    minScore,
                    Math.pow(10, secondNotZeroEvalue),
                    Math.pow(10, thirdNotZeroEvalue),
                    Math.pow(10, fourthNotZeroEvalue),
                    maxScore
                ];
            } else {
                const evalueDiff =
                    Math.log10(minNotZeroScore) - Math.log10(maxScore);
                if (Math.abs(evalueDiff) <= 2) {
                    gradientSteps = [
                        minScore,
                        1,
                        (2 + maxScore) / 3,
                        (2 + 2 * maxScore) / 3,
                        maxScore
                    ];
                } else if (Math.abs(evalueDiff) <= 4) {
                    gradientSteps = [
                        minScore,
                        Math.pow(10, evalueDiff / 2),
                        1,
                        (maxScore + 1) / 2,
                        maxScore
                    ];
                } else {
                    gradientSteps = [
                        minScore,
                        Math.pow(10, evalueDiff / 2),
                        Math.pow(10, evalueDiff / 4),
                        1,
                        maxScore
                    ];
                }
            }
        } else {
            gradientSteps = [
                minScore,
                (3 * minScore + maxScore) / 4,
                (minScore + maxScore) / 2,
                (minScore + 3 * maxScore) / 4,
                maxScore
            ];
        }
    } else if (colorScheme === ColorSchemeEnum.ncbiblast) {
        gradientSteps = [0, 40, 50, 80, 200];
    } else {
        // fixed (based on E-value)
        gradientSteps = [0, 1e-5, 1e-2, 1, 100];
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

export function colorByProteinFeatureName(domainName: ProteinFeaturesEnum): string {
    let color: string;
    if (domainName == "GENE3D" || domainName == "CATHGENE3D")
        color = "rgb(119,2,221)";
    else if (domainName == "PANTHER") color = "rgb(153,102,51)";
    else if (domainName == "PFAM") color = "rgb(102,51,255)";
    else if (domainName == "PIRSF" || domainName == "PIR")
        color = "rgb(217,119,249)";
    else if (domainName == "PRINTS") color = "rgb(51,204,51)";
    else if (domainName == "PRODOM") color = "rgb(102,153,255)";
    else if (domainName == "PROFILE") color = "rgb(255,153,51)";
    else if (domainName == "PROSITE") color = "rgb(255,204,51)";
    else if (domainName == "SMART") color = "rgb(206,0,49)";
    else if (domainName == "SUPERFAMILY" || domainName == "SSF")
        color = "rgb(0,0,0)";
    else if (domainName == "TIGERFAMs") color = "rgb(46,140,12)";
    else if (domainName == "HAMAP") color = "rgb(102,255,255)";
    else if (domainName == "SIGNALP") color = "rgb(217,119,249)";
    else if (domainName == "TMHMM") color = "rgb(41,140,12)";
    else color = "rgb(128,128,128)"; // UNCLASSIFIED and OTHERS
    return color;
}

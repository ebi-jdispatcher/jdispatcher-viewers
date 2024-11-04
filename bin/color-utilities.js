import { ColorSchemeEnum } from './custom-types';
export function getRgbColorGradient(score, gradientSteps, colorScheme) {
    // assumes length of gradientSteps is 5
    const colorSchemeSteps = colorScheme.keys;
    if (colorSchemeSteps.length != gradientSteps.length) {
        throw Error('Color Scheme and Gradient Steps should have matching lengths!');
    }
    if (score + 0.0 === 0.0) {
        return `rgb(${colorScheme[colorSchemeSteps[0]].join(',')})`;
    }
    else {
        const start = gradientSteps[0];
        const step1 = gradientSteps[1];
        const step2 = gradientSteps[2];
        const step3 = gradientSteps[3];
        const end = gradientSteps[4];
        let h;
        if (score < step1) {
            const logStart = start === 0 ? Math.log10(Number.MIN_VALUE) : Math.log10(start);
            h = 0.0 + (Math.log10(score) - logStart) / (Math.log10(step1) - logStart);
        }
        else if (score < step2) {
            h = 1.0 + (Math.log10(score) - Math.log10(step1)) / (Math.log10(step2) - Math.log10(step1));
        }
        else if (score < step3) {
            h = 2.0 + (Math.log10(score) - Math.log10(step2)) / (Math.log10(step3) - Math.log10(step2));
        }
        else if (score < end) {
            h = 3.0 + (Math.log10(score) - Math.log10(step3)) / (Math.log10(end) - Math.log10(step3));
        }
        else {
            h = 4.0;
        }
        const rgb = HSVtoRGB(h / 6, 0.75, 1.0);
        return `rgb(${rgb.join(',')})`;
    }
}
export function getRgbColorFixed(score, gradientSteps, colorScheme) {
    // assumes length of gradientSteps is 5
    const colorSchemeSteps = colorScheme.keys;
    if (colorSchemeSteps.length != gradientSteps.length) {
        throw Error('Color Scheme and Gradient Steps should have matching lengths!');
    }
    if (score + 0.0 === 0.0 || score < gradientSteps[1]) {
        return `rgb(${colorScheme[colorSchemeSteps[0]].join(',')})`;
    }
    else if (score >= gradientSteps[1] && score < gradientSteps[2]) {
        return `rgb(${colorScheme[colorSchemeSteps[1]].join(',')})`;
    }
    else if (score >= gradientSteps[2] && score < gradientSteps[3]) {
        return `rgb(${colorScheme[colorSchemeSteps[2]].join(',')})`;
    }
    else if (score >= gradientSteps[3] && score < gradientSteps[4]) {
        return `rgb(${colorScheme[colorSchemeSteps[3]].join(',')})`;
    }
    else if (score >= gradientSteps[4]) {
        return `rgb(${colorScheme[colorSchemeSteps[4]].join(',')})`;
    }
    else {
        return `rgb(192,192,192)`;
    }
}
export function getGradientSteps(minEvalue, maxEvalue, minEvalueNotZero, colorScheme) {
    let gradientSteps = [];
    if (colorScheme === ColorSchemeEnum.fixed) {
        gradientSteps = [0, Math.pow(10, -1), Math.pow(10, 0), Math.pow(10, 1), Math.pow(10, 2)];
    }
    else if (colorScheme === ColorSchemeEnum.dynamic) {
        if (maxEvalue < 1e-304) {
            const eScale = -304;
            gradientSteps = [
                0,
                Math.pow(10, eScale),
                Math.pow(10, eScale / 2),
                Math.pow(10, eScale / 4),
                Math.pow(10, eScale / 8),
            ];
        }
        else if (minEvalue < 1) {
            const maxLog10 = Math.log10(maxEvalue);
            if (maxEvalue <= 1) {
                let secondEvalue;
                let thirdEvalue;
                let forthEvalue;
                if (minEvalue === 0 && minEvalueNotZero > 0) {
                    secondEvalue = Math.log10(minEvalueNotZero) - 1;
                }
                else {
                    const minLog10 = Math.log10(minEvalue);
                    secondEvalue = minLog10 + (maxLog10 - minLog10) / 2;
                }
                thirdEvalue = secondEvalue + (maxLog10 - secondEvalue) / 2;
                forthEvalue = thirdEvalue + (maxLog10 - thirdEvalue) / 2;
                gradientSteps = [
                    minEvalue,
                    Math.pow(10, secondEvalue),
                    Math.pow(10, thirdEvalue),
                    Math.pow(10, forthEvalue),
                    maxEvalue,
                ];
            }
            else {
                const diffEvalue = Math.log10(minEvalueNotZero) - Math.log10(maxEvalue);
                if (Math.abs(diffEvalue) <= 2) {
                    gradientSteps = [minEvalue, 1, (2 + maxEvalue) / 3, (2 + 2 * maxEvalue) / 3, maxEvalue];
                }
                else if (Math.abs(diffEvalue) <= 4) {
                    gradientSteps = [minEvalue, Math.pow(10, diffEvalue / 2), 1, (maxEvalue + 1) / 2, maxEvalue];
                }
                else {
                    gradientSteps = [minEvalue, Math.pow(10, diffEvalue / 2), Math.pow(10, diffEvalue / 4), 1, maxEvalue];
                }
            }
        }
        else {
            gradientSteps = [
                minEvalue,
                (3 * minEvalue + maxEvalue) / 4,
                (minEvalue + maxEvalue) / 2,
                (minEvalue + 3 * maxEvalue) / 4,
                maxEvalue,
            ];
        }
    }
    else if (colorScheme === ColorSchemeEnum.ncbiblast) {
        gradientSteps = [0, 40, 50, 80, 200];
    }
    else {
        // fixed (based on E-value)
        gradientSteps = [0, 1e-5, 1e-2, 1, 100];
    }
    return gradientSteps;
}
// https://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately
/* accepts parameters
 * h, s, v
 */
export function HSVtoRGB(h, s, v) {
    // Clamp input values to the expected range [0, 1]
    h = Math.min(Math.max(h, 0), 1);
    s = Math.min(Math.max(s, 0), 1);
    v = Math.min(Math.max(v, 0), 1);
    let r = 0;
    let g = 0;
    let b = 0;
    let i, f, p, q, t;
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
// Using custom coloring scheme
export function colorByDatabaseName(domainName) {
    let color;
    // if (domainName == "InterPro") color = "rgb(211,47,47)";
    if (domainName == 'Pfam')
        color = 'rgb(211,47,47)';
    else if (domainName == 'SUPERFAMILY')
        color = 'rgb(171,71,188)';
    else if (domainName == 'SMART')
        color = 'rgb(106,27,154)';
    else if (domainName == 'HAMAP')
        color = 'rgb(57,73,171)';
    else if (domainName == 'PANTHER')
        color = 'rgb(33,150,243)';
    else if (domainName == 'PRODOM')
        color = 'rgb(0,188,212)';
    else if (domainName == 'PROSITE profiles')
        color = 'rgb(0,150,136)';
    else if (domainName == 'CDD')
        color = 'rgb(76,175,80)';
    else if (domainName == 'CATH-Gene3D')
        color = 'rgb(205,220,57)';
    else if (domainName == 'PIRSF')
        color = 'rgb(255,235,59)';
    else if (domainName == 'PRINTS')
        color = 'rgb(255,193,7)';
    else if (domainName == 'TIGRFAMs')
        color = 'rgb(255,112,67)';
    else if (domainName == 'SFLD')
        color = 'rgb(121,85,72)';
    else if (domainName == 'PROSITE patterns')
        color = 'rgb(55,71,79)';
    else
        color = 'rgb(128,128,128)'; // UNCLASSIFIED and OTHERS
    return color;
}
// Using coloring scheme from https://www.ebi.ac.uk/interpro/entry/InterPro/#table
// if (domainName == "InterPro") color = "rgb(45,174,193)";
// else if (domainName == "Pfam") color = "rgb(98,135,177)";
// else if (domainName == "HAMAP") color = "rgb(44,214,214)";
// else if (domainName == "PANTHER") color = "rgb(191,172,146)";
// else if (domainName == "SUPERFAMILY") color = "rgb(104,104,104)";
// else if (domainName == "SMART") color = "rgb(255,141,141)";
// else if (domainName == "PROSITE profiles") color = "rgb(246,159,116)";
// else if (domainName == "SFLD") color = "rgb(0,177,211)";
// else if (domainName == "CDD") color = "rgb(173,220,88)";
// else if (domainName == "PRINTS") color = "rgb(84,199,95)";
// else if (domainName == "TIGRFAMs") color = "rgb(86,185,166)";
// else if (domainName == "CATH-Gene3D") color = "rgb(168,140,195)";
// else if (domainName == "PIRSF") color = "rgb(251,189,221)";
// else if (domainName == "PROSITE patterns") color = "rgb(243,199,102)";
// else if (domainName == "PRODOM") color = "rgb(102,153,255)";

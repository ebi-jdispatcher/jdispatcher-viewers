import { getColorType } from './color-schemes';
import { ColorType, ColorSchemeEnum, ScaleTypeEnum, ScoreTypeEnum } from './custom-types';

/**
 * Calculates an RGB color based on a logarithmic gradient.
 * @param {number} score - The score to determine the color.
 * @param {number[]} gradientSteps - The steps for the gradient (assumes length is 5).
 * @param {ColorSchemeEnum} colorScheme - The color scheme to use.
 * @returns {string} The RGB color as a string.
 */
export function getRgbColorLogGradient(score: number, gradientSteps: number[], colorScheme: ColorSchemeEnum) {
  // assumes length of gradientSteps is 5
  let colorType: ColorType = getColorType(colorScheme);
  const colorSchemeSteps: number[] = colorType.keys;
  if (colorSchemeSteps.length != gradientSteps.length) {
    throw Error('Color Scheme and Gradient Steps should have matching lengths!');
  }
  if (score + 0.0 === 0.0) {
    return `rgb(${colorType[colorSchemeSteps[0]].join(',')})`;
  } else {
    const start = gradientSteps[0];
    const step1 = gradientSteps[1];
    const step2 = gradientSteps[2];
    const step3 = gradientSteps[3];
    const end = gradientSteps[4];
    let h: number;
    if (score < step1) {
      const logStart = start === 0 ? Math.log10(Number.MIN_VALUE) : Math.log10(start);
      h = 0.0 + (Math.log10(score) - logStart) / (Math.log10(step1) - logStart);
    } else if (score < step2) {
      h = 1.0 + (Math.log10(score) - Math.log10(step1)) / (Math.log10(step2) - Math.log10(step1));
    } else if (score < step3) {
      h = 2.0 + (Math.log10(score) - Math.log10(step2)) / (Math.log10(step3) - Math.log10(step2));
    } else if (score < end) {
      h = 3.0 + (Math.log10(score) - Math.log10(step3)) / (Math.log10(end) - Math.log10(step3));
    } else {
      h = 4.0;
    }
    const rgb = HSVtoRGB(h / 6, 0.75, 1.0);
    return `rgb(${rgb.join(',')})`;
  }
}

/**
 * Interpolates a color from a gradient based on a value.
 * @param {number} value - The value to interpolate (between 0 and 1).
 * @param {ColorType} colorType - The color gradient to use.
 * @returns {[number, number, number]} The interpolated RGB color as an array.
 */
function interpolateGradient(value: number, colorType: ColorType): [number, number, number] {
  const { keys } = colorType;

  // Clamp value to [0, 1]
  if (value <= 0) return colorType[0.0];
  if (value >= 1) return colorType[1.0];

  // Find the two nearest keys
  for (let i = 0; i < keys.length - 1; i++) {
    const lowerKey = keys[i];
    const upperKey = keys[i + 1];
    if (value >= lowerKey && value <= upperKey) {
      const lowerColor = colorType[lowerKey];
      const upperColor = colorType[upperKey];
      const fraction = (value - lowerKey) / (upperKey - lowerKey);

      // Linear interpolation for each RGB component
      const r = Math.round(lowerColor[0] + fraction * (upperColor[0] - lowerColor[0]));
      const g = Math.round(lowerColor[1] + fraction * (upperColor[1] - lowerColor[1]));
      const b = Math.round(lowerColor[2] + fraction * (upperColor[2] - lowerColor[2]));
      return [r, g, b];
    }
  }

  // Fallback (shouldn’t happen with valid keys)
  return colorType[1.0];
}

/**
 * Calculates an RGB color based on a linear gradient.
 * @param {number} score - The score to determine the color.
 * @param {number[]} gradientSteps - The steps for the gradient (assumes length is 5).
 * @param {ColorSchemeEnum} colorScheme - The color scheme to use.
 * @returns {string} The RGB color as a string.
 */
export function getRgbColorLinearGradient(score: number, gradientSteps: number[], colorScheme: ColorSchemeEnum) {
  // assumes length of gradientSteps is 5
  let colorType: ColorType = getColorType(colorScheme);
  const colorSchemeSteps: number[] = colorType.keys;
  if (colorSchemeSteps.length != gradientSteps.length) {
    throw Error('Color Scheme and Gradient Steps should have matching lengths!');
  }
  if (score + 0.0 === 0.0) {
    return `rgb(${colorType[colorSchemeSteps[0]].join(',')})`;
  } else {
    const start = gradientSteps[0];
    const step1 = gradientSteps[1];
    const step2 = gradientSteps[2];
    const step3 = gradientSteps[3];
    const end = gradientSteps[4];
    let h: number;
    console.log(start, step1, step2, step3, end, score);
    if (score < step1) {
      h = 0.0 + (score - start) / (step1 - start);
    } else if (score < step2) {
      h = 1.0 + (score - step1) / (step2 - step1);
    } else if (score < step3) {
      h = 2.0 + (score - step2) / (step3 - step2);
    } else if (score < end) {
      h = 3.0 + (score - step3) / (end - step3);
    } else {
      h = 4.0;
    }
    // Normalize h from 0–4 to 0–1
    const normalizedH = h / 4;

    // Interpolate the grayscale color
    const rgb = interpolateGradient(normalizedH, colorType);
    return `rgb(${rgb.join(',')})`;
  }
}

/**
 * Calculates an RGB color based on fixed gradient steps.
 * @param {number} score - The score to determine the color.
 * @param {number[]} gradientSteps - The steps for the gradient (assumes length is 5).
 * @param {ColorSchemeEnum} colorScheme - The color scheme to use.
 * @returns {string} The RGB color as a string.
 */
export function getRgbColorFixed(score: number, gradientSteps: number[], colorScheme: ColorSchemeEnum) {
  // assumes length of gradientSteps is 5
  let colorType: ColorType = getColorType(colorScheme);
  const colorSchemeSteps: number[] = colorType.keys;
  if (colorSchemeSteps.length != gradientSteps.length) {
    throw Error('Color Scheme and Gradient Steps should have matching lengths!');
  }
  if (score + 0.0 === 0.0 || score < gradientSteps[1]) {
    return `rgb(${colorType[colorSchemeSteps[0]].join(',')})`;
  } else if (score >= gradientSteps[1] && score < gradientSteps[2]) {
    return `rgb(${colorType[colorSchemeSteps[1]].join(',')})`;
  } else if (score >= gradientSteps[2] && score < gradientSteps[3]) {
    return `rgb(${colorType[colorSchemeSteps[2]].join(',')})`;
  } else if (score >= gradientSteps[3] && score < gradientSteps[4]) {
    return `rgb(${colorType[colorSchemeSteps[3]].join(',')})`;
  } else if (score >= gradientSteps[4]) {
    return `rgb(${colorType[colorSchemeSteps[4]].join(',')})`;
  } else {
    return `rgb(192,192,192)`;
  }
}

/**
 * Calculates gradient steps based on the provided parameters.
 * @param {number} minScore - The minimum score.
 * @param {number} maxSCore - The maximum score.
 * @param {number} minScoreNotZero - The minimum non-zero score.
 * @param {ScaleTypeEnum} scaleType - The scale type (fixed or dynamic).
 * @param {ScoreTypeEnum} scoreType - The type of score (e.g., bitscore, similarity, etc.).
 * @param {ColorSchemeEnum} colorScheme - The color scheme to use.
 * @returns {number[]} An array of gradient steps.
 */
export function getGradientSteps(
  minScore: number,
  maxSCore: number,
  minScoreNotZero: number,
  scaleType: ScaleTypeEnum,
  scoreType: ScoreTypeEnum,
  colorScheme: ColorSchemeEnum
): number[] {
  let gradientSteps: number[] = [];
  if (colorScheme === ColorSchemeEnum.qualitative || colorScheme === ColorSchemeEnum.ncbiblast) {
    // buckets instead of gradient
    if (scaleType === ScaleTypeEnum.fixed) {
      // fixed scale
      if (scoreType === ScoreTypeEnum.bitscore) {
        gradientSteps = [0, 40, 50, 80, 200];
      } else if (scoreType === ScoreTypeEnum.similarity || scoreType === ScoreTypeEnum.identity) {
        gradientSteps = [0, 20, 40, 60, 80];
      } else {
        // fixed (based on E-value)
        gradientSteps = [0, 0.001, 0.01, 0.1, 1];
      }
    } else {
      // dynamic scale
      // dynamic scale
      if (scoreType === ScoreTypeEnum.evalue) {
        if (maxSCore < 1e-304) {
          const eScale = -304;
          gradientSteps = [
            0,
            Math.pow(10, eScale),
            Math.pow(10, eScale / 2),
            Math.pow(10, eScale / 4),
            Math.pow(10, eScale / 8),
          ];
        } else if (minScore < 1) {
          const maxLog10 = Math.log10(maxSCore);
          if (maxSCore <= 1) {
            let secondEvalue: number;
            let thirdEvalue: number;
            let forthEvalue: number;
            let fifthEvalue: number;
            if (minScore === 0 && minScoreNotZero > 0) {
              secondEvalue = Math.log10(minScoreNotZero) - 1;
            } else {
              const minLog10 = Math.log10(minScore);
              secondEvalue = minLog10 + (maxLog10 - minLog10) / 3;
            }
            thirdEvalue = secondEvalue + (maxLog10 - secondEvalue) / 3;
            forthEvalue = thirdEvalue + (maxLog10 - thirdEvalue) / 3;
            fifthEvalue = forthEvalue + (maxLog10 - forthEvalue) / 3;
            gradientSteps = [
              minScore,
              Math.pow(10, secondEvalue),
              Math.pow(10, thirdEvalue),
              Math.pow(10, forthEvalue),
              Math.pow(10, fifthEvalue),
            ];
          } else {
            const diffEvalue = Math.log10(minScoreNotZero) - Math.log10(maxSCore);
            if (Math.abs(diffEvalue) <= 2) {
              gradientSteps = [minScore, 1, (2 + maxSCore) / 4, (2 + 2 * maxSCore) / 4, (2 + 3 * maxSCore) / 4];
            } else if (Math.abs(diffEvalue) <= 4) {
              gradientSteps = [minScore, Math.pow(10, diffEvalue / 2), 1, (maxSCore + 1) / 2, ((maxSCore + 1) / 2) * 2];
            } else {
              gradientSteps = [
                minScore,
                Math.pow(10, diffEvalue / 2),
                Math.pow(10, diffEvalue / 4),
                Math.pow(10, diffEvalue / 8),
                1,
              ];
            }
          }
        } else {
          gradientSteps = [
            minScore,
            (maxSCore - minScore) / 5,
            ((maxSCore - minScore) / 5) * 2,
            ((maxSCore - minScore) / 5) * 3,
            ((maxSCore - minScore) / 5) * 4,
          ];
        }
      } else {
        gradientSteps = [
          minScore,
          (maxSCore - minScore) / 5,
          ((maxSCore - minScore) / 5) * 2,
          ((maxSCore - minScore) / 5) * 3,
          ((maxSCore - minScore) / 5) * 4,
        ];
      }
    }
  } else {
    // gradient
    if (scaleType === ScaleTypeEnum.fixed) {
      if (scoreType === ScoreTypeEnum.evalue) {
        const diffEvalue = Math.log10(minScoreNotZero) - Math.log10(maxSCore);
        minScore = 0.0;
        maxSCore = 10.0;
        if (Math.abs(diffEvalue) <= 2) {
          gradientSteps = [minScore, 1, (2 + maxSCore) / 3, (2 + 2 * maxSCore) / 3, maxSCore];
        } else if (Math.abs(diffEvalue) <= 4) {
          gradientSteps = [minScore, Math.pow(10, diffEvalue / 2), 1, (maxSCore + 1) / 2, maxSCore];
        } else {
          gradientSteps = [minScore, Math.pow(10, diffEvalue / 2), Math.pow(10, diffEvalue / 4), 1, maxSCore];
        }
        // }
      } else if (scoreType === ScoreTypeEnum.bitscore) {
        gradientSteps = [0, 40, 50, 80, 200];
      } else if (scoreType === ScoreTypeEnum.similarity || scoreType === ScoreTypeEnum.identity) {
        gradientSteps = [0, 25, 50, 75, 100];
      } else {
        // fixed (based on E-value)
        gradientSteps = [0, 1e-5, 1e-2, 1, 100];
      }
    } else {
      // dynamic scale
      if (scoreType === ScoreTypeEnum.evalue) {
        if (maxSCore < 1e-304) {
          const eScale = -304;
          gradientSteps = [
            0,
            Math.pow(10, eScale),
            Math.pow(10, eScale / 2),
            Math.pow(10, eScale / 4),
            Math.pow(10, eScale / 8),
          ];
        } else if (minScore < 1) {
          const maxLog10 = Math.log10(maxSCore);
          if (maxSCore <= 1) {
            let secondEvalue: number;
            let thirdEvalue: number;
            let forthEvalue: number;
            if (minScore === 0 && minScoreNotZero > 0) {
              secondEvalue = Math.log10(minScoreNotZero) - 1;
            } else {
              const minLog10 = Math.log10(minScore);
              secondEvalue = minLog10 + (maxLog10 - minLog10) / 2;
            }
            thirdEvalue = secondEvalue + (maxLog10 - secondEvalue) / 2;
            forthEvalue = thirdEvalue + (maxLog10 - thirdEvalue) / 2;
            gradientSteps = [
              minScore,
              Math.pow(10, secondEvalue),
              Math.pow(10, thirdEvalue),
              Math.pow(10, forthEvalue),
              maxSCore,
            ];
          } else {
            const diffEvalue = Math.log10(minScoreNotZero) - Math.log10(maxSCore);
            if (Math.abs(diffEvalue) <= 2) {
              gradientSteps = [minScore, 1, (2 + maxSCore) / 3, (2 + 2 * maxSCore) / 3, maxSCore];
            } else if (Math.abs(diffEvalue) <= 4) {
              gradientSteps = [minScore, Math.pow(10, diffEvalue / 2), 1, (maxSCore + 1) / 2, maxSCore];
            } else {
              gradientSteps = [minScore, Math.pow(10, diffEvalue / 2), Math.pow(10, diffEvalue / 4), 1, maxSCore];
            }
          }
        } else {
          gradientSteps = [
            minScore,
            minScore + (maxSCore - minScore) / 5,
            minScore + ((maxSCore - minScore) / 5) * 2,
            minScore + ((maxSCore - minScore) / 5) * 3,
            maxSCore,
          ];
        }
      } else {
        gradientSteps = [
          minScore,
          minScore + (maxSCore - minScore) / 5,
          minScore + ((maxSCore - minScore) / 5) * 2,
          minScore + ((maxSCore - minScore) / 5) * 3,
          maxSCore,
        ];
      }
    }
  }
  return gradientSteps;
}

// https://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately
/* accepts parameters
 * h, s, v
 */
/**
 * Converts HSV (Hue, Saturation, Value) to RGB (Red, Green, Blue).
 * @param {number} h - Hue (0–1).
 * @param {number} s - Saturation (0–1).
 * @param {number} v - Value (0–1).
 * @returns {[number, number, number]} The RGB color as an array.
 */
export function HSVtoRGB(h: number, s: number, v: number) {
  // Clamp input values to the expected range [0, 1]
  h = Math.min(Math.max(h, 0), 1);
  s = Math.min(Math.max(s, 0), 1);
  v = Math.min(Math.max(v, 0), 1);

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
      ((r = v), (g = t), (b = p));
      break;
    case 1:
      ((r = q), (g = v), (b = p));
      break;
    case 2:
      ((r = p), (g = v), (b = t));
      break;
    case 3:
      ((r = p), (g = q), (b = v));
      break;
    case 4:
      ((r = t), (g = p), (b = v));
      break;
    case 5:
      ((r = v), (g = p), (b = q));
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
/**
 * Returns a color based on the database name.
 * @param {string} domainName - The name of the database.
 * @returns {string} The RGB color as a string.
 */
export function colorByDatabaseName(domainName: string): string {
  let color: string;
  // if (domainName == "InterPro") color = "rgb(211,47,47)";
  if (domainName == 'Pfam') color = 'rgb(211,47,47)';
  else if (domainName == 'SUPERFAMILY') color = 'rgb(171,71,188)';
  else if (domainName == 'SMART') color = 'rgb(106,27,154)';
  else if (domainName == 'HAMAP') color = 'rgb(57,73,171)';
  else if (domainName == 'PANTHER') color = 'rgb(33,150,243)';
  else if (domainName == 'PRODOM') color = 'rgb(0,188,212)';
  else if (domainName == 'PROSITE profiles') color = 'rgb(0,150,136)';
  else if (domainName == 'CDD') color = 'rgb(76,175,80)';
  else if (domainName == 'CATH-Gene3D') color = 'rgb(205,220,57)';
  else if (domainName == 'PIRSF') color = 'rgb(255,235,59)';
  else if (domainName == 'PRINTS') color = 'rgb(255,193,7)';
  else if (domainName == 'TIGRFAMs') color = 'rgb(255,112,67)';
  else if (domainName == 'SFLD') color = 'rgb(121,85,72)';
  else if (domainName == 'PROSITE patterns') color = 'rgb(55,71,79)';
  else color = 'rgb(128,128,128)'; // UNCLASSIFIED and OTHERS
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

import { fabric } from 'fabric';
import { ColorSchemeEnum, ColorType } from './custom-types';

/**
 * A gradient color map for heatmap visualization.
 * @type {ColorType}
 */
export const heatmapGradient: ColorType = {
  0.0: [255, 64, 64],
  0.25: [255, 255, 64],
  0.5: [64, 255, 64],
  0.75: [64, 255, 255],
  1.0: [64, 64, 255],
  keys: [0.0, 0.25, 0.5, 0.75, 1.0],
};

/**
 * A gradient color map for greyscale visualization.
 * @type {ColorType}
 */
export const greyscaleGradient: ColorType = {
  0.0: [215, 215, 215],
  0.25: [177, 177, 177],
  0.5: [141, 141, 141],
  0.75: [107, 107, 107],
  1.0: [74, 74, 74],
  keys: [0.0, 0.25, 0.5, 0.75, 1.0],
};

/**
 * A gradient color map for sequential visualization.
 * @type {ColorType}
 */
export const sequentialGradient: ColorType = {
  0.0: [193, 231, 255],
  0.25: [148, 190, 217],
  0.5: [105, 150, 179],
  0.75: [61, 112, 143],
  1.0: [0, 76, 109],
  keys: [0.0, 0.25, 0.5, 0.75, 1.0],
};

/**
 * A gradient color map for divergent visualization.
 * @type {ColorType}
 */
export const divergentGradient: ColorType = {
  0.0: [222, 66, 91],
  0.25: [236, 156, 157],
  0.5: [255, 233, 171],
  0.75: [159, 192, 143],
  1.0: [72, 143, 49],
  keys: [0.0, 0.25, 0.5, 0.75, 1.0],
};

/**
 * A gradient color map for qualitative visualization.
 * @type {ColorType}
 */
export const qualitativeGradient: ColorType = {
  0.0: [102, 194, 165],
  0.25: [252, 141, 98],
  0.5: [141, 160, 203],
  0.75: [231, 138, 195],
  1.0: [166, 216, 84],
  keys: [0.0, 0.25, 0.5, 0.75, 1.0],
};

/**
 * Creates a linear gradient for qualitative visualization.
 * @param {number} start - The starting x-coordinate of the gradient.
 * @param {number} end - The ending x-coordinate of the gradient.
 * @returns {fabric.Gradient} A Fabric.js gradient object.
 */
export function colorQualitativeGradient(start: number, end: number) {
  return new fabric.Gradient({
    type: 'linear',
    coords: {
      x1: start,
      y1: 0,
      x2: end,
      y2: 0,
    },
    colorStops: [
      { offset: 0.0, color: `rgb(${qualitativeGradient[0.0].join(',')})` },
      { offset: 0.199999, color: `rgb(${qualitativeGradient[0.0].join(',')})` },
      { offset: 0.2, color: `rgb(${qualitativeGradient[0.25].join(',')})` },
      { offset: 0.399999, color: `rgb(${qualitativeGradient[0.25].join(',')})` },
      { offset: 0.4, color: `rgb(${qualitativeGradient[0.5].join(',')})` },
      { offset: 0.599999, color: `rgb(${qualitativeGradient[0.5].join(',')})` },
      { offset: 0.6, color: `rgb(${qualitativeGradient[0.75].join(',')})` },
      { offset: 0.799999, color: `rgb(${qualitativeGradient[0.75].join(',')})` },
      { offset: 0.8, color: `rgb(${qualitativeGradient[1.0].join(',')})` },
      { offset: 1.0, color: `rgb(${qualitativeGradient[1.0].join(',')})` },
    ],
  });
}

/**
 * A gradient color map for NCBI BLAST visualization.
 * @type {ColorType}
 */
export const ncbiBlastGradient: ColorType = {
  0: [0, 0, 0],
  40: [0, 32, 233],
  50: [117, 234, 76],
  80: [219, 61, 233],
  200: [219, 51, 36],
  keys: [0, 40, 50, 80, 200],
};

/**
 * Creates a linear gradient for NCBI BLAST visualization.
 * @param {number} start - The starting x-coordinate of the gradient.
 * @param {number} end - The ending x-coordinate of the gradient.
 * @returns {fabric.Gradient} A Fabric.js gradient object.
 */
export function colorNcbiBlastGradient(start: number, end: number) {
  return new fabric.Gradient({
    type: 'linear',
    coords: {
      x1: start,
      y1: 0,
      x2: end,
      y2: 0,
    },
    colorStops: [
      { offset: 0.0, color: `rgb(${ncbiBlastGradient[0].join(',')})` },
      { offset: 0.199999, color: `rgb(${ncbiBlastGradient[0].join(',')})` },
      { offset: 0.2, color: `rgb(${ncbiBlastGradient[40].join(',')})` },
      { offset: 0.399999, color: `rgb(${ncbiBlastGradient[40].join(',')})` },
      { offset: 0.4, color: `rgb(${ncbiBlastGradient[50].join(',')})` },
      { offset: 0.599999, color: `rgb(${ncbiBlastGradient[50].join(',')})` },
      { offset: 0.6, color: `rgb(${ncbiBlastGradient[80].join(',')})` },
      { offset: 0.799999, color: `rgb(${ncbiBlastGradient[80].join(',')})` },
      { offset: 0.8, color: `rgb(${ncbiBlastGradient[200].join(',')})` },
      { offset: 1.0, color: `rgb(${ncbiBlastGradient[200].join(',')})` },
    ],
  });
}

/**
 * Retrieves the appropriate color gradient based on the specified color scheme.
 * @param {ColorSchemeEnum} colorScheme - The color scheme to use.
 * @returns {ColorType} The corresponding color gradient.
 */
export function getColorType(colorScheme: ColorSchemeEnum) {
  let colorType: ColorType = heatmapGradient;
  if (colorScheme === ColorSchemeEnum.heatmap) {
    colorType = heatmapGradient;
  } else if (colorScheme === ColorSchemeEnum.greyscale) {
    colorType = greyscaleGradient;
  } else if (colorScheme === ColorSchemeEnum.sequential) {
    colorType = sequentialGradient;
  } else if (colorScheme === ColorSchemeEnum.divergent) {
    colorType = divergentGradient;
  } else if (colorScheme === ColorSchemeEnum.qualitative) {
    colorType = qualitativeGradient;
  } else if (colorScheme === ColorSchemeEnum.ncbiblast) {
    colorType = ncbiBlastGradient;
  }
  return colorType;
}

/**
 * Creates a generic linear gradient based on the specified color scheme.
 * @param {number} start - The starting x-coordinate of the gradient.
 * @param {number} end - The ending x-coordinate of the gradient.
 * @param {ColorSchemeEnum} colorScheme - The color scheme to use.
 * @returns {fabric.Gradient} A Fabric.js gradient object.
 */
export function colorGenericGradient(start: number, end: number, colorScheme: ColorSchemeEnum): fabric.Gradient {
  let gradient: ColorType = getColorType(colorScheme);
  const colorStops = gradient.keys.map(key => ({
    offset: key,
    color: `rgb(${gradient[key].join(',')})`,
  }));
  return new fabric.Gradient({
    type: 'linear',
    coords: { x1: start, y1: 0, x2: end, y2: 0 },
    colorStops: colorStops,
  });
}

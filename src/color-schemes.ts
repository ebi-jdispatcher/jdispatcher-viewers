import { fabric } from 'fabric';
import { ColorSchemeEnum, ColorType } from './custom-types';

export const heatmapGradient: ColorType = {
  0.0: [255, 64, 64],
  0.25: [255, 255, 64],
  0.5: [64, 255, 64],
  0.75: [64, 255, 255],
  1.0: [64, 64, 255],
  keys: [0.0, 0.25, 0.5, 0.75, 1.0],
};

export function colorDefaultGradient(start: number, end: number) {
  const colorStops = defaultGradient.keys.map(key => ({
    offset: key,
    color: `rgb(${defaultGradient[key].join(',')})`,
  }));
export const greyscaleGradient: ColorType = {
  0.0: [215, 215, 215],
  0.25: [177, 177, 177],
  0.5: [141, 141, 141],
  0.75: [107, 107, 107],
  1.0: [74, 74, 74],
  keys: [0.0, 0.25, 0.5, 0.75, 1.0],
};

export const sequentialGradient: ColorType = {
  0.0: [193, 231, 255],
  0.25: [148, 190, 217],
  0.5: [105, 150, 179],
  0.75: [61, 112, 143],
  1.0: [0, 76, 109],
  keys: [0.0, 0.25, 0.5, 0.75, 1.0],
};

export const divergentGradient: ColorType = {
  0.0: [222, 66, 91],
  0.25: [236, 156, 157],
  0.5: [255, 233, 171],
  0.75: [159, 192, 143],
  1.0: [72, 143, 49],
  keys: [0.0, 0.25, 0.5, 0.75, 1.0],
};

export const qualitativeGradient: ColorType = {
  0.0: [102, 194, 165],
  0.25: [252, 141, 98],
  0.5: [141, 160, 203],
  0.75: [231, 138, 195],
  1.0: [166, 216, 84],
  keys: [0.0, 0.25, 0.5, 0.75, 1.0],
};
  return new fabric.Gradient({
    type: 'linear',
    coords: {
      x1: start,
      y1: 0,
      x2: end,
      y2: 0,
    },
    colorStops: colorStops,
  });
}

export const ncbiBlastGradient: ColorType = {
  0: [0, 0, 0],
  40: [0, 32, 233],
  50: [117, 234, 76],
  80: [219, 61, 233],
  200: [219, 51, 36],
  keys: [0, 40, 50, 80, 200],
};

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
}

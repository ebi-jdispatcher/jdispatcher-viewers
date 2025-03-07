// src/coords-utilities.ts
function getTextLegendPaddingFactor(inputString) {
  let positionFactor = 0;
  if (inputString.length === 1) {
    positionFactor = 2.5;
  } else if (inputString.length === 2) {
    positionFactor = 10;
  } else if (inputString.length === 3) {
    positionFactor = 15.5;
  } else if (inputString.length === 4) {
    positionFactor = 21;
  } else if (inputString.length === 5) {
    positionFactor = 29;
  } else if (inputString.length === 6) {
    positionFactor = 35;
  } else if (inputString.length === 7) {
    positionFactor = 41;
  } else if (inputString.length === 8) {
    positionFactor = 47;
  }
  return positionFactor;
}
function getTotalPixels(queryLen, subjLen, varLen, contentWidth, contentScoringWidth) {
  const totalLen = queryLen + subjLen;
  const totalPixels = (varLen * contentWidth - contentScoringWidth) / totalLen;
  return totalPixels;
}
function getPixelCoords(contentWidth, contentLabelWidth, marginWidth) {
  const startPixels = contentLabelWidth + marginWidth;
  const endPixels = contentLabelWidth + contentWidth - marginWidth;
  return [startPixels, endPixels];
}
function getQuerySubjPixelCoords(queryLen, subjLen, subjHspLen, contentWidth, contentScoringWidth, contentLabelWidth, marginWidth) {
  const totalQueryPixels = getTotalPixels(queryLen, subjLen, queryLen, contentWidth, contentScoringWidth);
  const totalSubjPixels = getTotalPixels(queryLen, subjLen, subjHspLen, contentWidth, contentScoringWidth);
  const startQueryPixels = contentLabelWidth + marginWidth;
  const endQueryPixels = contentLabelWidth + totalQueryPixels - marginWidth;
  const startSubjPixels = contentLabelWidth + totalQueryPixels + contentScoringWidth + marginWidth;
  const endSubjPixels = contentLabelWidth + totalQueryPixels + contentScoringWidth + totalSubjPixels - marginWidth;
  return [startQueryPixels, endQueryPixels, startSubjPixels, endSubjPixels];
}
function getDomainPixelCoords(startPixels, endPixels, hitLen, startDomain, endDomain, marginWidth) {
  const startDomainPixels = startPixels + startDomain * (endPixels - startPixels) / hitLen + marginWidth;
  const endDomainPixels = startPixels + endDomain * (endPixels - startPixels) / hitLen - marginWidth - startDomainPixels;
  return [startDomainPixels, endDomainPixels];
}

// src/color-schemes.ts
import { fabric } from "fabric";

// src/custom-types.ts
var ColorSchemeEnum = /* @__PURE__ */ ((ColorSchemeEnum3) => {
  ColorSchemeEnum3["heatmap"] = "heatmap";
  ColorSchemeEnum3["ncbiblast"] = "ncbiblast";
  ColorSchemeEnum3["greyscale"] = "greyscale";
  ColorSchemeEnum3["sequential"] = "sequential";
  ColorSchemeEnum3["divergent"] = "divergent";
  ColorSchemeEnum3["qualitative"] = "qualitative";
  return ColorSchemeEnum3;
})(ColorSchemeEnum || {});
var ScaleTypeEnum = /* @__PURE__ */ ((ScaleTypeEnum3) => {
  ScaleTypeEnum3["dynamic"] = "dynamic";
  ScaleTypeEnum3["fixed"] = "fixed";
  return ScaleTypeEnum3;
})(ScaleTypeEnum || {});
var ScoreTypeEnum = /* @__PURE__ */ ((ScoreTypeEnum3) => {
  ScoreTypeEnum3["evalue"] = "evalue";
  ScoreTypeEnum3["bitscore"] = "bitscore";
  ScoreTypeEnum3["identity"] = "identity";
  ScoreTypeEnum3["similarity"] = "similarity";
  return ScoreTypeEnum3;
})(ScoreTypeEnum || {});
var DataModelEnum = /* @__PURE__ */ ((DataModelEnum2) => {
  DataModelEnum2["SSSResultModel"] = "SSSResultModel";
  DataModelEnum2["IPRMCResultModel"] = "IPRMCResultModel";
  DataModelEnum2["IPRMCResultModelFlat"] = "IPRMCResultModelFlat";
  return DataModelEnum2;
})(DataModelEnum || {});
var jobIdDefaults = {
  value: "",
  required: true,
  minLength: 35,
  maxLength: 60,
  pattern: /([a-z_])*-([A-Z0-9])*-\d*-\d*-\d*-(np2|p1m|p2m)$/
};
var objectDefaults = {
  selectable: false,
  evented: false,
  objectCaching: false
};
var textDefaults = { ...objectDefaults };
var rectDefaults = { ...objectDefaults };
var lineDefaults = { ...objectDefaults };
function toPositiveNumber(value) {
  if (value < 0) {
    throw new Error(`${value} is not a positive number`);
  }
  return value;
}

// src/color-schemes.ts
var heatmapGradient = {
  0: [255, 64, 64],
  0.25: [255, 255, 64],
  0.5: [64, 255, 64],
  0.75: [64, 255, 255],
  1: [64, 64, 255],
  keys: [0, 0.25, 0.5, 0.75, 1]
};
var greyscaleGradient = {
  0: [215, 215, 215],
  0.25: [177, 177, 177],
  0.5: [141, 141, 141],
  0.75: [107, 107, 107],
  1: [74, 74, 74],
  keys: [0, 0.25, 0.5, 0.75, 1]
};
var sequentialGradient = {
  0: [193, 231, 255],
  0.25: [148, 190, 217],
  0.5: [105, 150, 179],
  0.75: [61, 112, 143],
  1: [0, 76, 109],
  keys: [0, 0.25, 0.5, 0.75, 1]
};
var divergentGradient = {
  0: [222, 66, 91],
  0.25: [236, 156, 157],
  0.5: [255, 233, 171],
  0.75: [159, 192, 143],
  1: [72, 143, 49],
  keys: [0, 0.25, 0.5, 0.75, 1]
};
var qualitativeGradient = {
  0: [102, 194, 165],
  0.25: [252, 141, 98],
  0.5: [141, 160, 203],
  0.75: [231, 138, 195],
  1: [166, 216, 84],
  keys: [0, 0.25, 0.5, 0.75, 1]
};
function colorQualitativeGradient(start, end) {
  return new fabric.Gradient({
    type: "linear",
    coords: {
      x1: start,
      y1: 0,
      x2: end,
      y2: 0
    },
    colorStops: [
      { offset: 0, color: `rgb(${qualitativeGradient[0].join(",")})` },
      { offset: 0.199999, color: `rgb(${qualitativeGradient[0].join(",")})` },
      { offset: 0.2, color: `rgb(${qualitativeGradient[0.25].join(",")})` },
      { offset: 0.399999, color: `rgb(${qualitativeGradient[0.25].join(",")})` },
      { offset: 0.4, color: `rgb(${qualitativeGradient[0.5].join(",")})` },
      { offset: 0.599999, color: `rgb(${qualitativeGradient[0.5].join(",")})` },
      { offset: 0.6, color: `rgb(${qualitativeGradient[0.75].join(",")})` },
      { offset: 0.799999, color: `rgb(${qualitativeGradient[0.75].join(",")})` },
      { offset: 0.8, color: `rgb(${qualitativeGradient[1].join(",")})` },
      { offset: 1, color: `rgb(${qualitativeGradient[1].join(",")})` }
    ]
  });
}
var ncbiBlastGradient = {
  0: [0, 0, 0],
  40: [0, 32, 233],
  50: [117, 234, 76],
  80: [219, 61, 233],
  200: [219, 51, 36],
  keys: [0, 40, 50, 80, 200]
};
function colorNcbiBlastGradient(start, end) {
  return new fabric.Gradient({
    type: "linear",
    coords: {
      x1: start,
      y1: 0,
      x2: end,
      y2: 0
    },
    colorStops: [
      { offset: 0, color: `rgb(${ncbiBlastGradient[0].join(",")})` },
      { offset: 0.199999, color: `rgb(${ncbiBlastGradient[0].join(",")})` },
      { offset: 0.2, color: `rgb(${ncbiBlastGradient[40].join(",")})` },
      { offset: 0.399999, color: `rgb(${ncbiBlastGradient[40].join(",")})` },
      { offset: 0.4, color: `rgb(${ncbiBlastGradient[50].join(",")})` },
      { offset: 0.599999, color: `rgb(${ncbiBlastGradient[50].join(",")})` },
      { offset: 0.6, color: `rgb(${ncbiBlastGradient[80].join(",")})` },
      { offset: 0.799999, color: `rgb(${ncbiBlastGradient[80].join(",")})` },
      { offset: 0.8, color: `rgb(${ncbiBlastGradient[200].join(",")})` },
      { offset: 1, color: `rgb(${ncbiBlastGradient[200].join(",")})` }
    ]
  });
}
function getColorType(colorScheme) {
  let colorType = heatmapGradient;
  if (colorScheme === "heatmap" /* heatmap */) {
    colorType = heatmapGradient;
  } else if (colorScheme === "greyscale" /* greyscale */) {
    colorType = greyscaleGradient;
  } else if (colorScheme === "sequential" /* sequential */) {
    colorType = sequentialGradient;
  } else if (colorScheme === "divergent" /* divergent */) {
    colorType = divergentGradient;
  } else if (colorScheme === "qualitative" /* qualitative */) {
    colorType = qualitativeGradient;
  } else if (colorScheme === "ncbiblast" /* ncbiblast */) {
    colorType = ncbiBlastGradient;
  }
  return colorType;
}
function colorGenericGradient(start, end, colorScheme) {
  let gradient = getColorType(colorScheme);
  const colorStops = gradient.keys.map((key) => ({
    offset: key,
    color: `rgb(${gradient[key].join(",")})`
  }));
  return new fabric.Gradient({
    type: "linear",
    coords: { x1: start, y1: 0, x2: end, y2: 0 },
    colorStops
  });
}

// src/color-utilities.ts
function getRgbColorLogGradient(score, gradientSteps, colorScheme) {
  let colorType = getColorType(colorScheme);
  const colorSchemeSteps = colorType.keys;
  if (colorSchemeSteps.length != gradientSteps.length) {
    throw Error("Color Scheme and Gradient Steps should have matching lengths!");
  }
  if (score + 0 === 0) {
    return `rgb(${colorType[colorSchemeSteps[0]].join(",")})`;
  } else {
    const start = gradientSteps[0];
    const step1 = gradientSteps[1];
    const step2 = gradientSteps[2];
    const step3 = gradientSteps[3];
    const end = gradientSteps[4];
    let h;
    if (score < step1) {
      const logStart = start === 0 ? Math.log10(Number.MIN_VALUE) : Math.log10(start);
      h = 0 + (Math.log10(score) - logStart) / (Math.log10(step1) - logStart);
    } else if (score < step2) {
      h = 1 + (Math.log10(score) - Math.log10(step1)) / (Math.log10(step2) - Math.log10(step1));
    } else if (score < step3) {
      h = 2 + (Math.log10(score) - Math.log10(step2)) / (Math.log10(step3) - Math.log10(step2));
    } else if (score < end) {
      h = 3 + (Math.log10(score) - Math.log10(step3)) / (Math.log10(end) - Math.log10(step3));
    } else {
      h = 4;
    }
    const rgb = HSVtoRGB(h / 6, 0.75, 1);
    return `rgb(${rgb.join(",")})`;
  }
}
function interpolateGradient(value, colorType) {
  const { keys } = colorType;
  if (value <= 0) return colorType[0];
  if (value >= 1) return colorType[1];
  for (let i = 0; i < keys.length - 1; i++) {
    const lowerKey = keys[i];
    const upperKey = keys[i + 1];
    if (value >= lowerKey && value <= upperKey) {
      const lowerColor = colorType[lowerKey];
      const upperColor = colorType[upperKey];
      const fraction = (value - lowerKey) / (upperKey - lowerKey);
      const r = Math.round(lowerColor[0] + fraction * (upperColor[0] - lowerColor[0]));
      const g = Math.round(lowerColor[1] + fraction * (upperColor[1] - lowerColor[1]));
      const b = Math.round(lowerColor[2] + fraction * (upperColor[2] - lowerColor[2]));
      return [r, g, b];
    }
  }
  return colorType[1];
}
function getRgbColorLinearGradient(score, gradientSteps, colorScheme) {
  let colorType = getColorType(colorScheme);
  const colorSchemeSteps = colorType.keys;
  if (colorSchemeSteps.length != gradientSteps.length) {
    throw Error("Color Scheme and Gradient Steps should have matching lengths!");
  }
  if (score + 0 === 0) {
    return `rgb(${colorType[colorSchemeSteps[0]].join(",")})`;
  } else {
    const start = gradientSteps[0];
    const step1 = gradientSteps[1];
    const step2 = gradientSteps[2];
    const step3 = gradientSteps[3];
    const end = gradientSteps[4];
    let h;
    console.log(start, step1, step2, step3, end, score);
    if (score < step1) {
      h = 0 + (score - start) / (step1 - start);
    } else if (score < step2) {
      h = 1 + (score - step1) / (step2 - step1);
    } else if (score < step3) {
      h = 2 + (score - step2) / (step3 - step2);
    } else if (score < end) {
      h = 3 + (score - step3) / (end - step3);
    } else {
      h = 4;
    }
    const normalizedH = h / 4;
    const rgb = interpolateGradient(normalizedH, colorType);
    return `rgb(${rgb.join(",")})`;
  }
}
function getRgbColorFixed(score, gradientSteps, colorScheme) {
  let colorType = getColorType(colorScheme);
  const colorSchemeSteps = colorType.keys;
  if (colorSchemeSteps.length != gradientSteps.length) {
    throw Error("Color Scheme and Gradient Steps should have matching lengths!");
  }
  if (score + 0 === 0 || score < gradientSteps[1]) {
    return `rgb(${colorType[colorSchemeSteps[0]].join(",")})`;
  } else if (score >= gradientSteps[1] && score < gradientSteps[2]) {
    return `rgb(${colorType[colorSchemeSteps[1]].join(",")})`;
  } else if (score >= gradientSteps[2] && score < gradientSteps[3]) {
    return `rgb(${colorType[colorSchemeSteps[2]].join(",")})`;
  } else if (score >= gradientSteps[3] && score < gradientSteps[4]) {
    return `rgb(${colorType[colorSchemeSteps[3]].join(",")})`;
  } else if (score >= gradientSteps[4]) {
    return `rgb(${colorType[colorSchemeSteps[4]].join(",")})`;
  } else {
    return `rgb(192,192,192)`;
  }
}
function getGradientSteps(minScore, maxSCore, minScoreNotZero, scaleType, scoreType, colorScheme) {
  let gradientSteps = [];
  if (colorScheme === "qualitative" /* qualitative */ || colorScheme === "ncbiblast" /* ncbiblast */) {
    if (scaleType === "fixed" /* fixed */) {
      if (scoreType === "bitscore" /* bitscore */) {
        gradientSteps = [0, 40, 50, 80, 200];
      } else if (scoreType === "similarity" /* similarity */ || scoreType === "identity" /* identity */) {
        gradientSteps = [0, 20, 40, 60, 80];
      } else {
        gradientSteps = [0, 1e-3, 0.01, 0.1, 1];
      }
    } else {
      if (scoreType === "evalue" /* evalue */) {
        if (maxSCore < 1e-304) {
          const eScale = -304;
          gradientSteps = [
            0,
            Math.pow(10, eScale),
            Math.pow(10, eScale / 2),
            Math.pow(10, eScale / 4),
            Math.pow(10, eScale / 8)
          ];
        } else if (minScore < 1) {
          const maxLog10 = Math.log10(maxSCore);
          if (maxSCore <= 1) {
            let secondEvalue;
            let thirdEvalue;
            let forthEvalue;
            let fifthEvalue;
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
              Math.pow(10, fifthEvalue)
            ];
          } else {
            const diffEvalue = Math.log10(minScoreNotZero) - Math.log10(maxSCore);
            if (Math.abs(diffEvalue) <= 2) {
              gradientSteps = [minScore, 1, (2 + maxSCore) / 4, (2 + 2 * maxSCore) / 4, (2 + 3 * maxSCore) / 4];
            } else if (Math.abs(diffEvalue) <= 4) {
              gradientSteps = [minScore, Math.pow(10, diffEvalue / 2), 1, (maxSCore + 1) / 2, (maxSCore + 1) / 2 * 2];
            } else {
              gradientSteps = [
                minScore,
                Math.pow(10, diffEvalue / 2),
                Math.pow(10, diffEvalue / 4),
                Math.pow(10, diffEvalue / 8),
                1
              ];
            }
          }
        } else {
          gradientSteps = [
            minScore,
            (maxSCore - minScore) / 5,
            (maxSCore - minScore) / 5 * 2,
            (maxSCore - minScore) / 5 * 3,
            (maxSCore - minScore) / 5 * 4
          ];
        }
      } else {
        gradientSteps = [
          minScore,
          (maxSCore - minScore) / 5,
          (maxSCore - minScore) / 5 * 2,
          (maxSCore - minScore) / 5 * 3,
          (maxSCore - minScore) / 5 * 4
        ];
      }
    }
  } else {
    if (scaleType === "fixed" /* fixed */) {
      if (scoreType === "evalue" /* evalue */) {
        const diffEvalue = Math.log10(minScoreNotZero) - Math.log10(maxSCore);
        minScore = 0;
        maxSCore = 10;
        if (Math.abs(diffEvalue) <= 2) {
          gradientSteps = [minScore, 1, (2 + maxSCore) / 3, (2 + 2 * maxSCore) / 3, maxSCore];
        } else if (Math.abs(diffEvalue) <= 4) {
          gradientSteps = [minScore, Math.pow(10, diffEvalue / 2), 1, (maxSCore + 1) / 2, maxSCore];
        } else {
          gradientSteps = [minScore, Math.pow(10, diffEvalue / 2), Math.pow(10, diffEvalue / 4), 1, maxSCore];
        }
      } else if (scoreType === "bitscore" /* bitscore */) {
        gradientSteps = [0, 40, 50, 80, 200];
      } else if (scoreType === "similarity" /* similarity */ || scoreType === "identity" /* identity */) {
        gradientSteps = [0, 25, 50, 75, 100];
      } else {
        gradientSteps = [0, 1e-5, 0.01, 1, 100];
      }
    } else {
      if (scoreType === "evalue" /* evalue */) {
        if (maxSCore < 1e-304) {
          const eScale = -304;
          gradientSteps = [
            0,
            Math.pow(10, eScale),
            Math.pow(10, eScale / 2),
            Math.pow(10, eScale / 4),
            Math.pow(10, eScale / 8)
          ];
        } else if (minScore < 1) {
          const maxLog10 = Math.log10(maxSCore);
          if (maxSCore <= 1) {
            let secondEvalue;
            let thirdEvalue;
            let forthEvalue;
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
              maxSCore
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
            minScore + (maxSCore - minScore) / 5 * 2,
            minScore + (maxSCore - minScore) / 5 * 3,
            maxSCore
          ];
        }
      } else {
        gradientSteps = [
          minScore,
          minScore + (maxSCore - minScore) / 5,
          minScore + (maxSCore - minScore) / 5 * 2,
          minScore + (maxSCore - minScore) / 5 * 3,
          maxSCore
        ];
      }
    }
  }
  return gradientSteps;
}
function HSVtoRGB(h, s, v) {
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
      r = v, g = t, b = p;
      break;
    case 1:
      r = q, g = v, b = p;
      break;
    case 2:
      r = p, g = v, b = t;
      break;
    case 3:
      r = p, g = q, b = v;
      break;
    case 4:
      r = t, g = p, b = v;
      break;
    case 5:
      r = v, g = p, b = q;
      break;
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}
function colorByDatabaseName(domainName) {
  let color;
  if (domainName == "Pfam") color = "rgb(211,47,47)";
  else if (domainName == "SUPERFAMILY") color = "rgb(171,71,188)";
  else if (domainName == "SMART") color = "rgb(106,27,154)";
  else if (domainName == "HAMAP") color = "rgb(57,73,171)";
  else if (domainName == "PANTHER") color = "rgb(33,150,243)";
  else if (domainName == "PRODOM") color = "rgb(0,188,212)";
  else if (domainName == "PROSITE profiles") color = "rgb(0,150,136)";
  else if (domainName == "CDD") color = "rgb(76,175,80)";
  else if (domainName == "CATH-Gene3D") color = "rgb(205,220,57)";
  else if (domainName == "PIRSF") color = "rgb(255,235,59)";
  else if (domainName == "PRINTS") color = "rgb(255,193,7)";
  else if (domainName == "TIGRFAMs") color = "rgb(255,112,67)";
  else if (domainName == "SFLD") color = "rgb(121,85,72)";
  else if (domainName == "PROSITE patterns") color = "rgb(55,71,79)";
  else color = "rgb(128,128,128)";
  return color;
}

// src/other-utilities.ts
import { fabric as fabric2 } from "fabric";
import { xml2json } from "xml-js";
var BasicCanvasRenderer = class {
  /**
   * Creates an instance of BasicCanvasRenderer.
   * @constructor
   * @param {string | HTMLCanvasElement} element - The canvas element or its ID to render into.
   */
  constructor(element) {
    this.element = element;
  }
  /**
   * Initializes the Fabric.js canvas instance based on the staticCanvas property.
   * @protected
   * @returns {void}
   */
  getFabricCanvas() {
    const startupDef = {
      defaultCursor: "default",
      moveCursor: "default",
      hoverCursor: "default"
    };
    if (this.staticCanvas) {
      this.canvas = new fabric2.StaticCanvas(this.element, startupDef);
    } else {
      this.canvas = new fabric2.Canvas(this.element, startupDef);
    }
  }
  /**
   * Sets the width and height of the canvas.
   * @protected
   * @returns {void}
   */
  setFrameSize() {
    this.canvas.setWidth(this.canvasWidth);
    this.canvas.setHeight(this.canvasHeight);
  }
  /**
   * Renders all objects on the canvas.
   * @protected
   * @returns {void}
   */
  renderCanvas() {
    this.canvas.renderAll();
  }
};
var ObjectCache = class {
  constructor() {
    /**
     * The internal Map storing cached key-value pairs.
     * @type {Map<string, T>}
     * @private
     */
    this.values = /* @__PURE__ */ new Map();
  }
  /**
   * Retrieves a cached object by its key.
   * @param {string} key - The key associated with the cached object.
   * @returns {T | undefined} - The cached object if found, otherwise undefined.
   */
  get(key) {
    const hasKey = this.values.has(key);
    if (hasKey) {
      return this.values.get(key);
    }
    return;
  }
  /**
   * Adds an object to the cache if it doesn’t already exist.
   * @param {string} key - The key to associate with the object.
   * @param {T} value - The object to cache.
   * @returns {void}
   */
  put(key, value) {
    const hasKey = this.values.has(key);
    if (!hasKey) {
      this.values.set(key, value);
    }
  }
  /**
   * Removes an object from the cache by its key.
   * @param {string} key - The key of the object to remove.
   * @returns {void}
   */
  delete(key) {
    const hasKey = this.values.has(key);
    if (hasKey) {
      this.values.delete(key);
    }
  }
};
function countDecimals(n) {
  if (!Number.isFinite(n)) return 0;
  if (Math.floor(n) === n) return 0;
  return n.toString().split(".")[1]?.length || 0;
}
function numberToString(n) {
  if (!Number.isFinite(n)) {
    return "0";
  } else if (n === 0) {
    return n.toString();
  } else if (n < 1e-4 || n > 1e4) {
    return n.toExponential(2);
  } else if (Number.isInteger(n)) {
    return n + ".0";
  } else if (countDecimals(n) > 2) {
    return n.toFixed(2);
  } else {
    return n.toString();
  }
}
async function fetchData(dataLoc, format = "json") {
  const response = await fetch(dataLoc);
  if (!response.ok) {
    throw new Error(`Could not retrieve data from ${dataLoc}`);
  }
  if (format === "json") {
    return response.json();
  }
  return response.text();
}
function dataAsType(data, dtype) {
  if (dtype === "SSSResultModel" /* SSSResultModel */) {
    return data;
  } else if (dtype === "IPRMCResultModel" /* IPRMCResultModel */) {
    return data;
  } else if (dtype === "IPRMCResultModelFlat" /* IPRMCResultModelFlat */) {
    return data;
  } else {
    return data;
  }
}
function getJdispatcherJsonURL(jobId) {
  if (!jobIdDefaults.pattern?.test(jobId)) {
    throw new Error("Invalid jobId format: does not match expected pattern");
  }
  const toolName = jobId.split("-")[0];
  if (jobId === "mock_jobid-I20200317-103136-0485-5599422-np2") {
    return "https://raw.githubusercontent.com/ebi-jdispatcher/jdispatcher-viewers/master/src/testdata/ncbiblast.json";
  } else if (jobId.endsWith("-np2")) {
    return `https://wwwdev.ebi.ac.uk/Tools/services/rest/${toolName}/result/${jobId}/json`;
  } else {
    return `https://www.ebi.ac.uk/Tools/services/rest/${toolName}/result/${jobId}/json`;
  }
}
function validateJobId(jobIdObj, verbose = false) {
  let isValid = true;
  if (jobIdObj.required) {
    isValid = isValid && jobIdObj.value.trim().length !== 0;
  }
  if (jobIdObj.minLength) {
    isValid = isValid && jobIdObj.value.trim().length >= jobIdObj.minLength;
  }
  if (jobIdObj.maxLength) {
    isValid = isValid && jobIdObj.value.trim().length <= jobIdObj.maxLength;
  }
  if (jobIdObj.pattern) {
    isValid = isValid && jobIdObj.pattern.test(jobIdObj.value.trim());
  }
  if (verbose) {
    if (isValid) {
      console.log(`JobId "${jobIdObj.value}" is valid!`);
    } else {
      console.log(`JobId "${jobIdObj.value}" is not valid!`);
    }
  }
  return isValid;
}
function validateSubmittedJobIdInput(data) {
  const jobId = { ...jobIdDefaults };
  jobId.value = data;
  if (!jobId.value.startsWith("http") && !jobId.value.includes("/") && !jobId.value.includes("./") && validateJobId(jobId)) {
    data = getJdispatcherJsonURL(data);
  }
  return data;
}
function getIPRMCDbfetchURL(accessions) {
  if (!accessions || typeof accessions !== "string") {
    throw new Error("Accessions must be a non-empty string");
  }
  const encodedAccessions = encodeURIComponent(accessions);
  return `https://www.ebi.ac.uk/Tools/dbfetch/dbfetch?db=iprmc;id=${encodedAccessions};format=iprmcxml;style=raw`;
}
function getIPRMCDbfetchAccessions(sssDataObj, numberHits = 30) {
  if (!sssDataObj?.hits || !Array.isArray(sssDataObj.hits)) return "";
  const maxHits = Math.max(0, numberHits);
  return sssDataObj.hits.slice(0, maxHits).map((hit) => hit.hit_acc).join(",");
}
function validateSubmittedDbfetchInput(sssDataObj, numberHits = 30) {
  const accessions = getIPRMCDbfetchAccessions(sssDataObj, numberHits);
  return getIPRMCDbfetchURL(accessions);
}
function getIPRMCDataModelFlatFromXML(iprmcXML, numberHits = 30) {
  const iprmcDataObj = parseXMLData(iprmcXML);
  return getFlattenIPRMCDataModel(iprmcDataObj, numberHits);
}
function parseXMLData(data) {
  try {
    return JSON.parse(
      xml2json(data, {
        compact: true,
        spaces: 2,
        alwaysArray: true
      })
    );
  } catch (error) {
    console.log("Cannot parse the resulting Dbfetch response (likely not formatted XML)!");
    return {};
  }
}
function domainDatabaseNameToString(domainName) {
  domainName = domainName.toUpperCase();
  let domainNameEnum = "Unclassified";
  if (domainName === "IPR" || domainName === "INTERPRO") {
    domainNameEnum = "InterPro";
  } else if (domainName === "CATHGENE3D" || domainName === "CATH-GENE3D" || domainName === "GENE3D") {
    domainNameEnum = "CATH-Gene3D";
  } else if (domainName === "CDD") {
    domainNameEnum = "CDD";
  } else if (domainName === "PANTHER") {
    domainNameEnum = "PANTHER";
  } else if (domainName === "HAMAP") {
    domainNameEnum = "HAMAP";
  } else if (domainName === "PFAM") {
    domainNameEnum = "Pfam";
  } else if (domainName === "PIRSF") {
    domainNameEnum = "PIRSF";
  } else if (domainName === "PRINTS") {
    domainNameEnum = "PRINTS";
  } else if (domainName === "PROSITE PROFILES" || domainName === "PROSITE_PROFILES" || domainName === "PROFILE") {
    domainNameEnum = "PROSITE profiles";
  } else if (domainName === "PROSITE PATTERNS" || domainName === "PROSITE_PATTERNS" || domainName === "PROSITE") {
    domainNameEnum = "PROSITE patterns";
  } else if (domainName === "SFLD") {
    domainNameEnum = "SFLD";
  } else if (domainName === "SMART") {
    domainNameEnum = "SMART";
  } else if (domainName === "SUPERFAMILY" || domainName === "SSF") {
    domainNameEnum = "SUPERFAMILY";
  } else if (domainName === "TIGERFAMS") {
    domainNameEnum = "TIGRFAMs";
  } else if (domainName === "PRODOM") {
    domainNameEnum = "PRODOM";
  }
  return domainNameEnum;
}
function getUniqueIPRMCDomainDatabases(dataObj, proteinIdList) {
  const domainPredictions = [];
  for (const protein of proteinIdList) {
    for (const match of dataObj[`${protein}`]["matches"]) {
      domainPredictions.push(match.split("_")[0]);
    }
  }
  return domainPredictions.filter((v, i, x) => x.indexOf(v) === i);
}
function getFlattenIPRMCDataModel(dataObj, numberHits) {
  let tmpNumberHits = 0;
  let iprmcDataFlatObj = {};
  for (const protein of dataObj["interpromatch"][0]["protein"]) {
    tmpNumberHits++;
    if (tmpNumberHits <= numberHits) {
      let matches = [];
      let matchObjs = {};
      for (const match of protein["match"]) {
        let matchObj = {};
        if (match.ipr !== void 0) {
          const iprdomain = `${domainDatabaseNameToString(match._attributes.dbname)}_${match.ipr[0]._attributes.id}`;
          if (!matches.includes(iprdomain)) {
            matches.push(iprdomain);
          }
          if (!(iprdomain in matchObjs)) {
            matchObjs[iprdomain] = [];
          }
          matchObj = {
            id: match.ipr[0]._attributes.id,
            name: match.ipr[0]._attributes.name,
            dbname: domainDatabaseNameToString(match._attributes.dbname),
            type: match.ipr[0]._attributes.type,
            altid: match._attributes.id,
            altname: match._attributes.name,
            // altdbname: "InterPro",
            status: match._attributes.status,
            model: match._attributes.model,
            evd: match._attributes.evd,
            start: Number(match.lcn[0]._attributes.start),
            end: Number(match.lcn[0]._attributes.end),
            fragments: match.lcn[0]._attributes.fragments,
            score: match.lcn[0]._attributes.fragments
          };
          matchObjs[iprdomain].push(matchObj);
        } else {
          const iprdomain = `${domainDatabaseNameToString(match._attributes.dbname)}_${match._attributes.id}`;
          if (!matches.includes(iprdomain)) {
            matches.push(iprdomain);
          }
          if (!(iprdomain in matchObjs)) {
            matchObjs[iprdomain] = [];
          }
          matchObj = {
            id: match._attributes.id,
            name: match._attributes.name,
            dbname: domainDatabaseNameToString(match._attributes.dbname),
            status: match._attributes.status,
            model: match._attributes.model,
            evd: match._attributes.evd,
            type: "Unclassified",
            start: Number(match.lcn[0]._attributes.start),
            end: Number(match.lcn[0]._attributes.end),
            fragments: match.lcn[0]._attributes.fragments,
            score: match.lcn[0]._attributes.fragments
          };
          matchObjs[iprdomain].push(matchObj);
        }
      }
      iprmcDataFlatObj[protein._attributes.id] = {
        id: protein._attributes.id,
        name: protein._attributes.name,
        length: Number(protein._attributes.length),
        matches: matches.sort(),
        match: matchObjs
      };
    }
  }
  return iprmcDataFlatObj;
}
function getDomainURLbyDatabase(domainID, domainName) {
  let domainURL = "";
  if (domainID.startsWith("IPR")) {
    domainURL = `https://www.ebi.ac.uk/interpro/entry/InterPro/${domainID}`;
  } else if (domainName === "CATH-Gene3D") {
    domainURL = `https://www.ebi.ac.uk/interpro/entry/cathgene3d/${domainID}`;
  } else if (domainName === "CDD") {
    domainURL = `https://www.ebi.ac.uk/interpro/entry/cdd/${domainID}`;
  } else if (domainName === "PANTHER") {
    domainURL = `https://www.ebi.ac.uk/interpro/entry/panther/${domainID}`;
  } else if (domainName === "HAMAP") {
    domainURL = `https://www.ebi.ac.uk/interpro/entry/hamap/${domainID}`;
  } else if (domainName === "Pfam") {
    domainURL = `https://www.ebi.ac.uk/interpro/entry/pfam/${domainID}`;
  } else if (domainName === "PIRSF") {
    domainURL = `https://www.ebi.ac.uk/interpro/entry/pirsf/${domainID}`;
  } else if (domainName === "PRINTS") {
    domainURL = `https://www.ebi.ac.uk/interpro/entry/prints/${domainID}`;
  } else if (domainName === "PROSITE profiles") {
    domainURL = `https://www.ebi.ac.uk/interpro/entry/profile/${domainID}`;
  } else if (domainName === "PROSITE patterns") {
    domainURL = `https://www.ebi.ac.uk/interpro/entry/prosite/${domainID}`;
  } else if (domainName === "SFLD") {
    domainURL = `https://www.ebi.ac.uk/interpro/entry/sfld/${domainID}`;
  } else if (domainName === "SMART") {
    domainURL = `https://www.ebi.ac.uk/interpro/entry/smart/${domainID}`;
  } else if (domainName === "SUPERFAMILY") {
    domainURL = `https://www.ebi.ac.uk/interpro/entry/ssf/${domainID}`;
  } else if (domainName === "TIGRFAMs") {
    domainURL = `https://www.ebi.ac.uk/interpro/entry/tigrfams/${domainID}`;
  } else if (domainName === "PRODOM") {
    domainURL = `https://www.ebi.ac.uk/interpro/entry/prodom/${domainID}`;
  }
  return domainURL;
}
var coordStates = {};
function tooltipState(coord, data) {
  if (!(coord in coordStates)) {
    coordStates[coord] = { state: false, data };
  }
  coordStates[coord].state = !coordStates[coord].state;
  if (coordStates[coord].state && data !== void 0) {
    coordStates[coord].data = data;
  }
  return coordStates[coord];
}

// src/drawing-utilities.ts
import { fabric as fabric3 } from "fabric";
function drawHeaderTextGroup(dataObj, renderOptions, topPadding) {
  const origTopPadding = topPadding;
  const textObj = { ...textDefaults };
  textObj.fontWeight = "bold";
  textObj.fontSize = renderOptions.fontSize + 1;
  textObj.top = topPadding;
  textObj.left = 5;
  const program = dataObj.program;
  const version = dataObj.version;
  const programText = new fabric3.Text(`${program} (version: ${version})`, textObj);
  let db_names = [];
  for (const db of dataObj.dbs) {
    db_names.push(db.name);
  }
  const dbs = db_names.join(", ");
  textObj.fontWeight = "normal";
  textObj.fontSize = renderOptions.fontSize;
  topPadding += 15;
  textObj.top = topPadding;
  const databaseText = new fabric3.Text(`Database(s): ${dbs}`, textObj);
  topPadding += 15;
  textObj.top = topPadding;
  const sequenceText = new fabric3.Text("Sequence: ", textObj);
  const length = dataObj.query_len;
  topPadding += 15;
  textObj.top = topPadding;
  const lengthText = new fabric3.Text(`Length: ${length}`, textObj);
  const start = dataObj.start;
  textObj.top = origTopPadding;
  textObj.left = renderOptions.canvasWidth - 170;
  const startText = new fabric3.Text(`${start}`, textObj);
  const end = dataObj.end;
  textObj.top = origTopPadding + 15;
  const endText = new fabric3.Text(`${end}`, textObj);
  const textGroup = new fabric3.Group(
    [programText, databaseText, sequenceText, lengthText, startText, endText],
    objectDefaults
  );
  return textGroup;
}
function drawHeaderLinkText(dataObj, renderOptions, topPadding) {
  const sequence = dataObj.query_def;
  const textSeqObj = { ...textDefaults };
  textSeqObj.fontFamily = "Menlo";
  textSeqObj.fontSize = renderOptions.fontSize - 2;
  textSeqObj.evented = true;
  textSeqObj.top = topPadding - 15;
  textSeqObj.left = 57.5;
  const sequenceDefText = new fabric3.Text(`${sequence}`, textSeqObj);
  return [sequenceDefText, textSeqObj];
}
function drawContentHeaderTextGroup(coordValues, renderOptions, topPadding) {
  const textObj = { ...textDefaults };
  textObj.fontWeight = "bold";
  textObj.fontSize = renderOptions.fontSize + 1;
  textObj.top = topPadding + 2;
  textObj.textAlign = "center";
  const totalQueryPixels = getTotalPixels(
    coordValues.queryLen,
    coordValues.subjLen,
    coordValues.queryLen,
    renderOptions.contentWidth,
    renderOptions.contentScoringWidth
  );
  const totalSubjPixels = getTotalPixels(
    coordValues.queryLen,
    coordValues.subjLen,
    coordValues.subjLen,
    renderOptions.contentWidth,
    renderOptions.contentScoringWidth
  );
  textObj.left = coordValues.startQueryPixels;
  const queryText = new fabric3.Text("Sequence Match", textObj);
  queryText.width = totalQueryPixels;
  textObj.left = coordValues.startEvalPixels;
  let scoreTypeLabel;
  if (renderOptions.scoreType === "identity" /* identity */) {
    scoreTypeLabel = new fabric3.Text("Identity", textObj);
  } else if (renderOptions.scoreType === "similarity" /* similarity */) {
    scoreTypeLabel = new fabric3.Text("Similarity", textObj);
  } else if (renderOptions.scoreType === "bitscore" /* bitscore */) {
    scoreTypeLabel = new fabric3.Text("Bit score", textObj);
  } else {
    scoreTypeLabel = new fabric3.Text("E-value", textObj);
  }
  scoreTypeLabel.width = renderOptions.contentScoringWidth;
  scoreTypeLabel.textAlign = "center";
  textObj.left = coordValues.startSubjPixels;
  const subjText = new fabric3.Text("Subject Match", textObj);
  subjText.width = totalSubjPixels;
  const textGroup = new fabric3.Group([queryText, scoreTypeLabel, subjText], objectDefaults);
  return textGroup;
}
function drawLineTracksQuerySubject(coordValues, renderOptions, topPadding) {
  const lineObj = { ...lineDefaults };
  lineObj.top = topPadding;
  lineObj.stroke = "black";
  lineObj.strokeWidth = renderOptions.strokeWidth;
  const coordsQuery = [
    coordValues.startQueryPixels,
    topPadding,
    coordValues.endQueryPixels,
    topPadding
  ];
  lineObj.left = coordValues.startQueryPixels;
  const queryLine = new fabric3.Line(coordsQuery, lineObj);
  const coordsQueryStartCap = [
    coordValues.startQueryPixels,
    topPadding - 3,
    coordValues.startQueryPixels,
    topPadding + 3
  ];
  lineObj.top = topPadding - 2;
  const queryStartCap = new fabric3.Line(coordsQueryStartCap, lineObj);
  const coordsQueryEndCap = [
    coordValues.endQueryPixels,
    topPadding - 3,
    coordValues.endQueryPixels,
    topPadding + 3
  ];
  lineObj.left = coordValues.endQueryPixels;
  const queryEndCap = new fabric3.Line(coordsQueryEndCap, lineObj);
  const coordsSubj = [
    coordValues.startSubjPixels,
    topPadding,
    coordValues.endSubjPixels,
    topPadding
  ];
  lineObj.top = topPadding;
  lineObj.left = coordValues.startSubjPixels;
  const subjLine = new fabric3.Line(coordsSubj, lineObj);
  const coordsSubjStartCap = [
    coordValues.startSubjPixels,
    topPadding - 3,
    coordValues.startSubjPixels,
    topPadding + 3
  ];
  lineObj.top = topPadding - 2;
  const subjStartCap = new fabric3.Line(coordsSubjStartCap, lineObj);
  const coordsSubjEndCap = [
    coordValues.endSubjPixels,
    topPadding - 3,
    coordValues.endSubjPixels,
    topPadding + 3
  ];
  lineObj.left = coordValues.endSubjPixels;
  const subjEndCap = new fabric3.Line(coordsSubjEndCap, lineObj);
  const lineGroup = new fabric3.Group(
    [queryLine, subjLine, queryStartCap, queryEndCap, subjStartCap, subjEndCap],
    objectDefaults
  );
  return lineGroup;
}
function drawLineTracks(coordValues, renderOptions, topPadding) {
  const lineObj = { ...lineDefaults };
  lineObj.top = topPadding;
  lineObj.stroke = "black";
  lineObj.strokeWidth = renderOptions.strokeWidth;
  const coordsQuery = [
    coordValues.startPixels,
    topPadding,
    coordValues.endPixels,
    topPadding
  ];
  lineObj.left = coordValues.startPixels;
  const Line = new fabric3.Line(coordsQuery, lineObj);
  const coordsStartCap = [
    coordValues.startPixels,
    topPadding - 3,
    coordValues.startPixels,
    topPadding + 3
  ];
  lineObj.top = topPadding - 2;
  const startCap = new fabric3.Line(coordsStartCap, lineObj);
  const coordsEndCap = [
    coordValues.endPixels,
    topPadding - 3,
    coordValues.endPixels,
    topPadding + 3
  ];
  lineObj.left = coordValues.endPixels;
  const endCap = new fabric3.Line(coordsEndCap, lineObj);
  const lineGroup = new fabric3.Group([Line, startCap, endCap], objectDefaults);
  return lineGroup;
}
function drawDomainLineTracks(coordValues, renderOptions, topPadding) {
  const lineObj = { ...lineDefaults };
  lineObj.top = topPadding;
  lineObj.stroke = "black";
  lineObj.strokeWidth = renderOptions.strokeWidth;
  lineObj.strokeDashArray = renderOptions.strokeDashArray;
  const coordsQuery = [
    coordValues.startPixels,
    topPadding,
    coordValues.endPixels,
    topPadding
  ];
  lineObj.left = coordValues.startPixels;
  return new fabric3.Line(coordsQuery, lineObj);
}
function drawContentFooterTextGroup(coordValues, renderOptions, topPadding) {
  const textObj = { ...textDefaults };
  textObj.fontSize = renderOptions.fontSize;
  textObj.top = topPadding;
  textObj.left = coordValues.startPixels - 2.5;
  const startText = new fabric3.Text(`${coordValues.start}`, textObj);
  let positionFactor = getTextLegendPaddingFactor(`${coordValues.end}`);
  textObj.left = coordValues.endPixels - positionFactor;
  const endText = new fabric3.Text(`${coordValues.end}`, textObj);
  const textGroup = new fabric3.Group([startText, endText], objectDefaults);
  return textGroup;
}
function drawContentQuerySubjFooterTextGroup(coordValues, renderOptions, topPadding) {
  const textObj = { ...textDefaults };
  textObj.fontSize = renderOptions.fontSize;
  textObj.top = topPadding;
  textObj.left = coordValues.startQueryPixels - 2.5;
  const startQueryText = new fabric3.Text("1", textObj);
  let positionFactor = getTextLegendPaddingFactor(`${coordValues.queryLen}`);
  textObj.left = coordValues.endQueryPixels - positionFactor;
  const endQueryText = new fabric3.Text(`${coordValues.queryLen}`, textObj);
  textObj.left = coordValues.startSubjPixels - 2.5;
  const startSubjText = new fabric3.Text("1", textObj);
  positionFactor = getTextLegendPaddingFactor(`${coordValues.subjLen}`);
  textObj.left = coordValues.endSubjPixels - positionFactor;
  const endSubjText = new fabric3.Text(`${coordValues.subjLen}`, textObj);
  const textGroup = new fabric3.Group([startQueryText, endQueryText, startSubjText, endSubjText], objectDefaults);
  return textGroup;
}
function drawNoHitsFoundText(renderOptions, topPadding) {
  const textObj = { ...textDefaults };
  textObj.fontWeight = "bold";
  textObj.fontSize = renderOptions.fontSize + 1;
  textObj.top = topPadding;
  textObj.left = renderOptions.contentWidth / 2;
  textObj.fill = "red";
  const noHitsText = new fabric3.Text("--------------------No hits found--------------------", textObj);
  return noHitsText;
}
function drawContentSequenceInfoText(maxIDLen, hit, renderOptions, topPadding) {
  const textObj = { ...textDefaults };
  textObj.fontFamily = "Menlo";
  textObj.fontSize = renderOptions.fontSize - 2;
  textObj.top = topPadding - 2;
  const variableSpace = " ".repeat(maxIDLen - (hit.hit_db.length + hit.hit_id.length));
  const spaceText = new fabric3.Text(variableSpace, textObj);
  let hit_def = `${hit.hit_db}:${hit.hit_id}  ${hit.hit_desc}`;
  let hit_def_full = `${variableSpace}${hit.hit_db}:${hit.hit_id}  ${hit.hit_desc}`;
  if (hit_def_full.length > 40) {
    hit_def = (hit_def_full.slice(0, 38) + "...").slice(variableSpace.length);
  }
  textObj.left = 10 + variableSpace.length * 6;
  textObj.evented = true;
  const hitText = new fabric3.Text(hit_def, textObj);
  return [spaceText, hitText, textObj];
}
function drawHspNoticeText(totalNumberHsps, numberHsps, renderOptions, topPadding) {
  const textObj = { ...textDefaults };
  textObj.fontSize = renderOptions.fontSize;
  textObj.top = topPadding;
  textObj.left = renderOptions.contentWidth / 2;
  textObj.fill = "red";
  const hspTextNotice = new fabric3.Text(
    `This hit contains ${totalNumberHsps} alignments, but only the first ${numberHsps} are displayed!`,
    textObj
  );
  return hspTextNotice;
}
function drawScoreText(startEvalPixels, hsp, renderOptions, topPadding) {
  const textObj = { ...textDefaults };
  textObj.fontSize = renderOptions.fontSize;
  textObj.top = topPadding - 15;
  textObj.textAlign = "center";
  textObj.left = startEvalPixels;
  let hspScoreText;
  if (renderOptions.scoreType === "bitscore" /* bitscore */) {
    hspScoreText = new fabric3.Text(numberToString(hsp.hsp_bit_score), textObj);
  } else if (renderOptions.scoreType === "identity" /* identity */) {
    hspScoreText = new fabric3.Text(numberToString(hsp.hsp_identity), textObj);
  } else if (renderOptions.scoreType === "similarity" /* similarity */) {
    hspScoreText = new fabric3.Text(numberToString(hsp.hsp_positive), textObj);
  } else {
    hspScoreText = new fabric3.Text(numberToString(hsp.hsp_expect), textObj);
  }
  return hspScoreText;
}
function drawDomainQueySubject(startQueryPixels, endQueryPixels, startSubjPixels, endSubjPixels, topPadding, fill) {
  const rectObj = { ...rectDefaults };
  rectObj.evented = true;
  rectObj.top = topPadding;
  rectObj.fill = fill;
  rectObj.rx = 5;
  rectObj.ry = 5;
  rectObj.top = topPadding - 15;
  rectObj.left = startQueryPixels;
  rectObj.width = endQueryPixels;
  rectObj.height = 10;
  const queryDomain = new fabric3.Rect(rectObj);
  rectObj.top = topPadding - 15;
  rectObj.left = startSubjPixels;
  rectObj.width = endSubjPixels;
  rectObj.height = 10;
  const subjDomain = new fabric3.Rect(rectObj);
  return [queryDomain, subjDomain];
}
function drawDomainTooltips(startHspPixels, endHspPixels, seq_from, seq_to, hsp, renderOptions, topPadding) {
  const floatTextObj = { ...textDefaults };
  floatTextObj.fontSize = renderOptions.fontSize + 1;
  floatTextObj.textAlign = "left";
  floatTextObj.originX = "top";
  floatTextObj.originY = "top";
  floatTextObj.top = 5;
  let tooltip;
  tooltip = `Start: ${seq_from}
End: ${seq_to}
E-value: ${numberToString(
    hsp.hsp_expect
  )}
Bit score: ${numberToString(hsp.hsp_bit_score)}
Identity: ${numberToString(
    hsp.hsp_identity
  )}
Similarity: ${numberToString(hsp.hsp_positive)}`;
  const tooltipText = new fabric3.Text(tooltip, floatTextObj);
  const rectObj = { ...rectDefaults };
  rectObj.fill = "white";
  rectObj.stroke = "lightseagreen";
  rectObj.rx = 5;
  rectObj.ry = 5;
  rectObj.originX = "top";
  rectObj.originY = "top";
  rectObj.width = 140;
  rectObj.height = 125;
  rectObj.opacity = 0.95;
  const tooltipBox = new fabric3.Rect(rectObj);
  const tooltipGroup = new fabric3.Group([tooltipBox, tooltipText], {
    selectable: false,
    evented: false,
    objectCaching: false,
    visible: false,
    top: topPadding,
    left: startHspPixels + endHspPixels / 2
  });
  return tooltipGroup;
}
function drawScaleLabelText(renderOptions, topPadding, label) {
  const textSelObj = { ...textDefaults };
  textSelObj.fontSize = renderOptions.fontSize + 1;
  textSelObj.fontWeight = "bold";
  textSelObj.top = topPadding;
  textSelObj.left = renderOptions.scaleLabelWidth;
  const scaleTypeText = new fabric3.Text(label, textSelObj);
  return scaleTypeText;
}
function drawScaleTypeCheckBoxText(renderOptions, topPadding) {
  const textSelObj = { ...textDefaults };
  textSelObj.fontSize = renderOptions.fontSize + 1;
  textSelObj.top = topPadding;
  textSelObj.left = renderOptions.scaleLabelWidth;
  const textCheckDynObj = { ...textDefaults };
  textCheckDynObj.fontSize = renderOptions.fontSize + 12;
  textCheckDynObj.fill = "grey";
  textCheckDynObj.evented = true;
  textCheckDynObj.top = topPadding - 8;
  textCheckDynObj.left = renderOptions.scaleLabelWidth;
  const textCheckFixObj = { ...textCheckDynObj };
  let checkSym;
  renderOptions.scaleType === "dynamic" /* dynamic */ ? checkSym = "\u2612" : checkSym = "\u2610";
  if (renderOptions.scaleType === "dynamic" /* dynamic */) textCheckDynObj.fill = "black";
  textCheckDynObj.left += 120;
  const dynamicCheckboxText = new fabric3.Text(checkSym, textCheckDynObj);
  textSelObj.left += 140;
  const dynamicText = new fabric3.Text("Dynamic (Score: min to max)", textSelObj);
  renderOptions.scaleType === "fixed" /* fixed */ ? checkSym = "\u2612" : checkSym = "\u2610";
  if (renderOptions.scaleType === "fixed" /* fixed */) textCheckFixObj.fill = "black";
  textCheckFixObj.left += 340;
  const fixedCheckboxText = new fabric3.Text(checkSym, textCheckFixObj);
  textSelObj.left += 220;
  let fixedText;
  if (renderOptions.scoreType === "bitscore" /* bitscore */) {
    fixedText = new fabric3.Text("Fixed (Bit score: <40 to \u2265200)", textSelObj);
  } else if (renderOptions.scoreType === "similarity" /* similarity */) {
    fixedText = new fabric3.Text("Fixed (Similarity: 0.0 to 100.0)", textSelObj);
  } else if (renderOptions.scoreType === "identity" /* identity */) {
    fixedText = new fabric3.Text("Fixed (Identity: 0.0 to 100.0)", textSelObj);
  } else {
    fixedText = new fabric3.Text("Fixed (E-value: 0.0 to 10.0)", textSelObj);
  }
  return [dynamicCheckboxText, dynamicText, textCheckDynObj, fixedCheckboxText, fixedText, textCheckFixObj];
}
function drawScoreTypeCheckBoxText(renderOptions, topPadding) {
  const textSelObj = { ...textDefaults };
  textSelObj.fontSize = renderOptions.fontSize + 1;
  textSelObj.top = topPadding;
  textSelObj.left = renderOptions.scaleLabelWidth;
  const textCheckEvalueObj = { ...textDefaults };
  textCheckEvalueObj.fontSize = renderOptions.fontSize + 12;
  textCheckEvalueObj.fill = "grey";
  textCheckEvalueObj.evented = true;
  textCheckEvalueObj.top = topPadding - 8;
  textCheckEvalueObj.left = renderOptions.scaleLabelWidth;
  const textCheckIdentityObj = { ...textCheckEvalueObj };
  const textCheckSimilarityObj = { ...textCheckEvalueObj };
  const textCheckBitscoreObj = { ...textCheckEvalueObj };
  let checkSym;
  renderOptions.scoreType === "evalue" /* evalue */ ? checkSym = "\u2612" : checkSym = "\u2610";
  if (renderOptions.scoreType === "evalue" /* evalue */) textCheckEvalueObj.fill = "black";
  textCheckEvalueObj.left += 120;
  const evalueCheckboxText = new fabric3.Text(checkSym, textCheckEvalueObj);
  textSelObj.left += 140;
  const evalueText = new fabric3.Text("E-value", textSelObj);
  renderOptions.scoreType === "identity" /* identity */ ? checkSym = "\u2612" : checkSym = "\u2610";
  if (renderOptions.scoreType === "identity" /* identity */) textCheckIdentityObj.fill = "black";
  textCheckIdentityObj.left += 230;
  const identityCheckboxText = new fabric3.Text(checkSym, textCheckIdentityObj);
  textSelObj.left += 110;
  const identityText = new fabric3.Text("Identity", textSelObj);
  renderOptions.scoreType === "similarity" /* similarity */ ? checkSym = "\u2612" : checkSym = "\u2610";
  if (renderOptions.scoreType === "similarity" /* similarity */) textCheckSimilarityObj.fill = "black";
  textCheckSimilarityObj.left += 340;
  const similarityCheckboxText = new fabric3.Text(checkSym, textCheckSimilarityObj);
  textSelObj.left += 110;
  const similarityText = new fabric3.Text("Similarity", textSelObj);
  renderOptions.scoreType === "bitscore" /* bitscore */ ? checkSym = "\u2612" : checkSym = "\u2610";
  if (renderOptions.scoreType === "bitscore" /* bitscore */) textCheckBitscoreObj.fill = "black";
  textCheckBitscoreObj.left += 460;
  const bitscoreCheckboxText = new fabric3.Text(checkSym, textCheckBitscoreObj);
  textSelObj.left += 120;
  const bitscoreText = new fabric3.Text("Bit score", textSelObj);
  return [
    evalueCheckboxText,
    evalueText,
    textCheckEvalueObj,
    identityCheckboxText,
    identityText,
    textCheckIdentityObj,
    similarityCheckboxText,
    similarityText,
    textCheckSimilarityObj,
    bitscoreCheckboxText,
    bitscoreText,
    textCheckBitscoreObj
  ];
}
function drawColorSchemeCheckBoxText(renderOptions, topPadding) {
  const textSelObj = { ...textDefaults };
  textSelObj.fontSize = renderOptions.fontSize + 1;
  textSelObj.top = topPadding;
  textSelObj.left = renderOptions.scaleLabelWidth;
  const textCheckHeatmapObj = { ...textDefaults };
  textCheckHeatmapObj.fontSize = renderOptions.fontSize + 12;
  textCheckHeatmapObj.fill = "grey";
  textCheckHeatmapObj.evented = true;
  textCheckHeatmapObj.top = topPadding - 8;
  textCheckHeatmapObj.left = renderOptions.scaleLabelWidth;
  const textCheckGreyscaleObj = { ...textCheckHeatmapObj };
  const textCheckSequentialObj = { ...textCheckHeatmapObj };
  const textCheckDivergentObj = { ...textCheckHeatmapObj };
  const textCheckQualitativeObj = { ...textCheckHeatmapObj };
  const textCheckNcbiBlastObj = { ...textCheckHeatmapObj };
  let checkSym;
  renderOptions.colorScheme === "heatmap" /* heatmap */ ? checkSym = "\u2612" : checkSym = "\u2610";
  if (renderOptions.colorScheme === "heatmap" /* heatmap */) textCheckHeatmapObj.fill = "black";
  textCheckHeatmapObj.left += 120;
  const heatmapCheckboxText = new fabric3.Text(checkSym, textCheckHeatmapObj);
  textSelObj.left += 140;
  const heatmapText = new fabric3.Text("Heatmap", textSelObj);
  renderOptions.colorScheme === "greyscale" /* greyscale */ ? checkSym = "\u2612" : checkSym = "\u2610";
  if (renderOptions.colorScheme === "greyscale" /* greyscale */) textCheckGreyscaleObj.fill = "black";
  textCheckGreyscaleObj.left += 230;
  const greyscaleCheckboxText = new fabric3.Text(checkSym, textCheckGreyscaleObj);
  textSelObj.left += 110;
  const greyscaleText = new fabric3.Text("Greyscale", textSelObj);
  renderOptions.colorScheme === "sequential" /* sequential */ ? checkSym = "\u2612" : checkSym = "\u2610";
  if (renderOptions.colorScheme === "sequential" /* sequential */) textCheckSequentialObj.fill = "black";
  textCheckSequentialObj.left += 340;
  const sequentialCheckboxText = new fabric3.Text(checkSym, textCheckSequentialObj);
  textSelObj.left += 110;
  const sequentialText = new fabric3.Text("Sequential", textSelObj);
  renderOptions.colorScheme === "divergent" /* divergent */ ? checkSym = "\u2612" : checkSym = "\u2610";
  if (renderOptions.colorScheme === "divergent" /* divergent */) textCheckDivergentObj.fill = "black";
  textCheckDivergentObj.left += 460;
  const divergentCheckboxText = new fabric3.Text(checkSym, textCheckDivergentObj);
  textSelObj.left += 120;
  const divergentText = new fabric3.Text("Divergent", textSelObj);
  renderOptions.colorScheme === "qualitative" /* qualitative */ ? checkSym = "\u2612" : checkSym = "\u2610";
  if (renderOptions.colorScheme === "qualitative" /* qualitative */) textCheckQualitativeObj.fill = "black";
  textCheckQualitativeObj.left += 560;
  const qualitativeCheckboxText = new fabric3.Text(checkSym, textCheckQualitativeObj);
  textSelObj.left += 100;
  const qualitativeText = new fabric3.Text("Qualitative", textSelObj);
  renderOptions.colorScheme === "ncbiblast" /* ncbiblast */ ? checkSym = "\u2612" : checkSym = "\u2610";
  if (renderOptions.colorScheme === "ncbiblast" /* ncbiblast */) textCheckNcbiBlastObj.fill = "black";
  textCheckNcbiBlastObj.left += 660;
  const ncbiblastCheckboxText = new fabric3.Text(checkSym, textCheckNcbiBlastObj);
  textSelObj.left += 100;
  const ncbiblastText = new fabric3.Text("NCBI BLAST+", textSelObj);
  return [
    heatmapCheckboxText,
    heatmapText,
    textCheckHeatmapObj,
    greyscaleCheckboxText,
    greyscaleText,
    textCheckGreyscaleObj,
    sequentialCheckboxText,
    sequentialText,
    textCheckSequentialObj,
    divergentCheckboxText,
    divergentText,
    textCheckDivergentObj,
    qualitativeCheckboxText,
    qualitativeText,
    textCheckQualitativeObj,
    ncbiblastCheckboxText,
    ncbiblastText,
    textCheckNcbiBlastObj
  ];
}
function drawScaleScoreText(renderOptions, topPadding) {
  const textObj = { ...textDefaults };
  textObj.fontSize = renderOptions.fontSize + 1;
  textObj.top = topPadding;
  textObj.textAlign = "right";
  let scoreTypeLabel;
  if (renderOptions.scoreType === "identity" /* identity */) {
    scoreTypeLabel = "Identity";
  } else if (renderOptions.scoreType === "similarity" /* similarity */) {
    scoreTypeLabel = "Similarity";
  } else if (renderOptions.scoreType === "bitscore" /* bitscore */) {
    scoreTypeLabel = "Bit score";
  } else {
    scoreTypeLabel = "E-value";
  }
  textObj.left = renderOptions.scaleLabelWidth - 70;
  const scaleScoreText = new fabric3.Text(`${scoreTypeLabel}`, textObj);
  return scaleScoreText;
}
function drawScaleColorGradient(renderOptions, topPadding) {
  const rectObj = { ...rectDefaults };
  rectObj.top = topPadding;
  rectObj.left = renderOptions.scaleLabelWidth;
  rectObj.width = renderOptions.scaleWidth;
  rectObj.height = 15;
  const colorScale = new fabric3.Rect(rectObj);
  if (renderOptions.colorScheme === "ncbiblast" /* ncbiblast */) {
    colorScale.set("fill", colorNcbiBlastGradient(0, renderOptions.scaleWidth));
  } else if (renderOptions.colorScheme === "qualitative" /* qualitative */) {
    colorScale.set("fill", colorQualitativeGradient(0, renderOptions.scaleWidth));
  } else {
    colorScale.set("fill", colorGenericGradient(0, renderOptions.scaleWidth, renderOptions.colorScheme));
  }
  return colorScale;
}
function drawLineAxis5Buckets(startGradPixels, o25GradPixels, o50GradPixels, o75GradPixels, endGradPixels, renderOptions, topPadding) {
  const lineObj = { ...lineDefaults };
  lineObj.top = topPadding;
  lineObj.stroke = "black";
  lineObj.strokeWidth = renderOptions.strokeWidth;
  const coordsAxis = [startGradPixels, topPadding, endGradPixels, topPadding];
  lineObj.left = startGradPixels;
  const axisLine = new fabric3.Line(coordsAxis, lineObj);
  const coordsAxisStartTick = [
    startGradPixels,
    topPadding,
    startGradPixels,
    topPadding + 4
  ];
  const axisStartTick = new fabric3.Line(coordsAxisStartTick, lineObj);
  const coordsAxis25Tick = [o25GradPixels, topPadding, o25GradPixels, topPadding + 4];
  lineObj.left = o25GradPixels;
  const axis25Tick = new fabric3.Line(coordsAxis25Tick, lineObj);
  const coordsAxis50Tick = [o50GradPixels, topPadding, o50GradPixels, topPadding + 4];
  lineObj.left = o50GradPixels;
  const axis50Tick = new fabric3.Line(coordsAxis50Tick, lineObj);
  const coordsAxis75Tick = [o75GradPixels, topPadding, o75GradPixels, topPadding + 4];
  lineObj.left = o75GradPixels;
  const axis75Tick = new fabric3.Line(coordsAxis75Tick, lineObj);
  const coordsAxisEndTick = [
    endGradPixels,
    topPadding,
    endGradPixels,
    topPadding + 4
  ];
  lineObj.left = endGradPixels;
  const axisEndTick = new fabric3.Line(coordsAxisEndTick, lineObj);
  const axisGroup = new fabric3.Group(
    [axisLine, axisStartTick, axis25Tick, axis50Tick, axis75Tick, axisEndTick],
    objectDefaults
  );
  return axisGroup;
}
function drawLineAxis6Buckets(startGradPixels, o20GradPixels, o40GradPixels, o60GradPixels, o80GradPixels, endGradPixels, renderOptions, topPadding) {
  const lineObj = { ...lineDefaults };
  lineObj.top = topPadding;
  lineObj.stroke = "black";
  lineObj.strokeWidth = renderOptions.strokeWidth;
  const coordsAxis = [startGradPixels, topPadding, endGradPixels, topPadding];
  lineObj.left = startGradPixels;
  const axisLine = new fabric3.Line(coordsAxis, lineObj);
  const coordsAxisStartTick = [
    startGradPixels,
    topPadding,
    startGradPixels,
    topPadding + 4
  ];
  const axisStartTick = new fabric3.Line(coordsAxisStartTick, lineObj);
  const coordsAxis20Tick = [o20GradPixels, topPadding, o20GradPixels, topPadding + 4];
  lineObj.left = o20GradPixels;
  const axis20Tick = new fabric3.Line(coordsAxis20Tick, lineObj);
  const coordsAxis40Tick = [o40GradPixels, topPadding, o40GradPixels, topPadding + 4];
  lineObj.left = o40GradPixels;
  const axis40Tick = new fabric3.Line(coordsAxis40Tick, lineObj);
  const coordsAxis60Tick = [o60GradPixels, topPadding, o60GradPixels, topPadding + 4];
  lineObj.left = o60GradPixels;
  const axis60Tick = new fabric3.Line(coordsAxis60Tick, lineObj);
  const coordsAxis80Tick = [o80GradPixels, topPadding, o80GradPixels, topPadding + 4];
  lineObj.left = o80GradPixels;
  const axis80Tick = new fabric3.Line(coordsAxis80Tick, lineObj);
  const coordsAxisEndTick = [
    endGradPixels,
    topPadding,
    endGradPixels,
    topPadding + 4
  ];
  lineObj.left = endGradPixels;
  const axisEndTick = new fabric3.Line(coordsAxisEndTick, lineObj);
  const axisGroup = new fabric3.Group(
    [axisLine, axisStartTick, axis20Tick, axis40Tick, axis60Tick, axis80Tick, axisEndTick],
    objectDefaults
  );
  return axisGroup;
}
function drawScaleTick5LabelsGroup(gradientSteps, leftPadding, renderOptions, topPadding) {
  const textObj = { ...textDefaults };
  textObj.top = topPadding;
  textObj.fontSize = renderOptions.fontSize;
  let label = `<${numberToString(gradientSteps[1])}`;
  textObj.left = renderOptions.scaleLabelWidth + leftPadding - label.length * 3 - 72;
  const o20LabelText = new fabric3.Text(label, textObj);
  label = `${numberToString(gradientSteps[1])} - ${numberToString(gradientSteps[2])}`;
  textObj.left = renderOptions.scaleLabelWidth + leftPadding * 2 - label.length * 3 - 72;
  const o40LabelText = new fabric3.Text(label, textObj);
  label = `${numberToString(gradientSteps[2])} - ${numberToString(gradientSteps[3])}`;
  textObj.left = renderOptions.scaleLabelWidth + leftPadding * 3 - label.length * 3 - 72;
  const o60LabelText = new fabric3.Text(label, textObj);
  label = `${numberToString(gradientSteps[3])} - ${numberToString(gradientSteps[4])}`;
  textObj.left = renderOptions.scaleLabelWidth + leftPadding * 4 - label.length * 3 - 72;
  const o80LabelText = new fabric3.Text(label, textObj);
  label = `\u2265${numberToString(gradientSteps[4])}`;
  textObj.left = renderOptions.scaleLabelWidth + renderOptions.scaleWidth - label.length * 3 - 72;
  const endLabelText = new fabric3.Text(label, textObj);
  const textGroup = new fabric3.Group(
    [o20LabelText, o40LabelText, o60LabelText, o80LabelText, endLabelText],
    objectDefaults
  );
  return textGroup;
}
function drawScaleTick4LabelsGroup(gradientSteps, leftPadding, renderOptions, topPadding) {
  const textObj = { ...textDefaults };
  textObj.top = topPadding;
  textObj.fontSize = renderOptions.fontSize;
  textObj.left = renderOptions.scaleLabelWidth - numberToString(gradientSteps[0]).length * 3;
  const startLabelText = new fabric3.Text(numberToString(gradientSteps[0]), textObj);
  textObj.left = renderOptions.scaleLabelWidth + leftPadding - numberToString(gradientSteps[1]).length * 3;
  const o25LabelText = new fabric3.Text(numberToString(gradientSteps[1]), textObj);
  textObj.left = renderOptions.scaleLabelWidth + leftPadding * 2 - numberToString(gradientSteps[2]).length * 3;
  const o50LabelText = new fabric3.Text(numberToString(gradientSteps[2]), textObj);
  textObj.left = renderOptions.scaleLabelWidth + leftPadding * 3 - numberToString(gradientSteps[3]).length * 3;
  const o75LabelText = new fabric3.Text(numberToString(gradientSteps[3]), textObj);
  textObj.left = renderOptions.scaleLabelWidth + renderOptions.scaleWidth - numberToString(gradientSteps[4]).length * 3;
  const endLabelText = new fabric3.Text(numberToString(gradientSteps[4]), textObj);
  const textGroup = new fabric3.Group(
    [startLabelText, o25LabelText, o50LabelText, o75LabelText, endLabelText],
    objectDefaults
  );
  return textGroup;
}
function drawFooterText(renderOptions, topPadding) {
  const textObj = { ...textDefaults };
  textObj.fontSize = renderOptions.fontSize;
  textObj.evented = true;
  textObj.top = topPadding;
  textObj.left = 310;
  const copyright = `European Bioinformatics Institute (EMBL-EBI) - `;
  const copyrightText = new fabric3.Text(`${copyright}`, textObj);
  return [copyrightText, textObj];
}
function drawFooterLinkText(url, renderOptions, topPadding) {
  const textSeqObj = { ...textDefaults };
  textSeqObj.fontSize = renderOptions.fontSize;
  textSeqObj.evented = true;
  textSeqObj.top = topPadding;
  textSeqObj.left = 593;
  const sequenceDefText = new fabric3.Text(`${url}`, textSeqObj);
  return [sequenceDefText, textSeqObj];
}
function drawCanvasWrapperStroke(renderOptions) {
  const canvasWrapper = new fabric3.Rect({
    selectable: false,
    evented: false,
    objectCaching: false,
    top: 0,
    left: 0,
    width: renderOptions.canvasWidth - 1,
    height: renderOptions.canvasHeight - 1,
    strokeWidth: 1,
    stroke: "lightseagreen",
    fill: "transparent"
  });
  return canvasWrapper;
}
function drawContentTitleText(renderOptions, topPadding) {
  const textObj = { ...textDefaults };
  textObj.fontWeight = "bold";
  textObj.fontSize = renderOptions.fontSize + 2;
  textObj.top = topPadding;
  textObj.left = 350;
  const title = "Fast Family and Domain Prediction by InterPro";
  return new fabric3.Text(`${title}`, textObj);
}
function drawContentSupressText(renderOptions, topPadding, numberHits) {
  const textObj = { ...textDefaults };
  textObj.fontSize = renderOptions.fontSize;
  textObj.top = topPadding;
  textObj.left = renderOptions.contentWidth / 2;
  textObj.fill = "red";
  const title = `This is a partial representation of the result, only the first ${numberHits} hits are displayed!`;
  return new fabric3.Text(`${title}`, textObj);
}
function drawProteinFeaturesText(renderOptions, topPadding) {
  const textSelObj = { ...textDefaults };
  textSelObj.fontSize = renderOptions.fontSize + 1;
  textSelObj.fontWeight = "bold";
  textSelObj.top = topPadding;
  textSelObj.left = renderOptions.scaleLabelWidth - 5;
  const scaleTypeText = new fabric3.Text("Select your database:", textSelObj);
  return scaleTypeText;
}
function drawDomainCheckbox(renderOptions, topPadding, leftPadding, currentDomainDatabase) {
  const rectObj = { ...rectDefaults };
  rectObj.top = topPadding;
  rectObj.left = leftPadding;
  rectObj.height = 15;
  rectObj.width = 15;
  rectObj.evented = true;
  const textObj = { ...textDefaults };
  textObj.fontSize = renderOptions.fontSize + 1;
  textObj.top = topPadding;
  textObj.left = leftPadding + 20;
  if (renderOptions.currentDisabled) {
    textObj.fill = "grey";
    rectObj.fill = "white";
    rectObj.stroke = "grey";
  } else if (renderOptions.currentDomainDatabase !== void 0) {
    rectObj.fill = colorByDatabaseName(renderOptions.currentDomainDatabase);
    rectObj.stroke = "black";
  } else {
    rectObj.fill = "white";
    rectObj.stroke = "grey";
  }
  const proteinFeatureRect = new fabric3.Rect(rectObj);
  const proteinFeatureText = new fabric3.Text(currentDomainDatabase, textObj);
  return [proteinFeatureRect, proteinFeatureText, rectObj, rectObj];
}
function drawHitTransparentBox(startPixels, endPixels, topPadding, fill, height) {
  const rectObj = { ...rectDefaults };
  rectObj.fill = fill;
  rectObj.opacity = 0.5;
  rectObj.rx = 5;
  rectObj.ry = 5;
  rectObj.top = topPadding + 15;
  rectObj.left = startPixels;
  rectObj.width = endPixels;
  rectObj.height = height;
  return new fabric3.Rect(rectObj);
}
function drawContentDomainInfoText(domainID, renderOptions, topPadding) {
  const textObj = { ...textDefaults };
  textObj.fontFamily = "Menlo";
  textObj.fontSize = renderOptions.fontSize - 2;
  textObj.top = topPadding - 5;
  const variableSpace = " ".repeat(40 - domainID.length);
  const spaceText = new fabric3.Text(variableSpace, textObj);
  let domain = `${domainID}`;
  let domain_full = `${variableSpace}${domainID}`;
  if (domain_full.length > 40) {
    domain = (domain_full.slice(0, 38) + "...").slice(variableSpace.length);
  }
  textObj.left = 12 + variableSpace.length * 7.25;
  textObj.evented = true;
  const hitText = new fabric3.Text(domain, textObj);
  return [spaceText, hitText, textObj];
}
function drawDomains(startPixels, endPixels, topPadding, color) {
  const rectObj = { ...rectDefaults };
  rectObj.evented = true;
  rectObj.top = topPadding;
  rectObj.fill = color;
  rectObj.rx = 5;
  rectObj.ry = 5;
  rectObj.top = topPadding - 15;
  rectObj.left = startPixels;
  rectObj.width = endPixels;
  rectObj.height = 10;
  rectObj.stroke = "black";
  rectObj.strokeWidth = 0.5;
  return new fabric3.Rect(rectObj);
}
function drawDomainInfoTooltips(startPixels, endPixels, seq_from, seq_to, domain, renderOptions, topPadding) {
  const floatTextObj = { ...textDefaults };
  floatTextObj.fontSize = renderOptions.fontSize + 1;
  floatTextObj.textAlign = "left";
  floatTextObj.originX = "top";
  floatTextObj.originY = "top";
  floatTextObj.top = 5;
  floatTextObj.left = 10;
  floatTextObj.width = 200;
  let tooltip = `Start: ${seq_from}
End: ${seq_to}
Database: ${domain.dbname}
`;
  if (domain.altid !== void 0 && domain.altname !== void 0) {
    tooltip += `ID: ${domain.altid}
Name: ${domain.altname}
Type: ${domain.type}
IPR ID: ${domain.id}
IPR Name: ${domain.name}
`;
  } else {
    tooltip += `ID: ${domain.id}
Name: ${domain.name}
Type: ${domain.type}
`;
  }
  const tooltipText = new fabric3.Textbox(tooltip, floatTextObj);
  const rectObj = { ...rectDefaults };
  rectObj.fill = "white";
  rectObj.stroke = "lightseagreen";
  rectObj.rx = 5;
  rectObj.ry = 5;
  rectObj.originX = "top";
  rectObj.originY = "top";
  rectObj.width = tooltipText.width + 40;
  rectObj.height = tooltipText.height;
  rectObj.opacity = 0.95;
  const tooltipBox = new fabric3.Rect(rectObj);
  const tooltipGroup = new fabric3.Group([tooltipBox, tooltipText], {
    selectable: false,
    evented: false,
    objectCaching: false,
    visible: false,
    top: topPadding,
    left: startPixels + endPixels / 2
  });
  return tooltipGroup;
}
function drawURLInfoTooltip(startPixels, sequence, URL, renderOptions, topPadding) {
  const floatTextObj = { ...textDefaults };
  floatTextObj.fontSize = renderOptions.fontSize + 1;
  floatTextObj.originX = "left";
  floatTextObj.originY = "top";
  floatTextObj.top = 5;
  floatTextObj.left = 5;
  if (sequence.length > 150) {
    sequence = sequence.slice(0, 150) + "...";
  }
  let tooltipText;
  if (sequence !== "") {
    const seqLabel = sequence.length * 6.3;
    const urlLabel = URL.length * 6.3;
    if (seqLabel > urlLabel) {
      floatTextObj.width = seqLabel + 5;
    } else {
      floatTextObj.width = urlLabel + 5;
    }
    tooltipText = new fabric3.Text(`${sequence}
${URL}`, floatTextObj);
  } else {
    const urlLabel = URL.length * 6.3;
    floatTextObj.width = urlLabel + 5;
    tooltipText = new fabric3.Text(`${URL}`, floatTextObj);
  }
  const rectObj = { ...rectDefaults };
  rectObj.fill = "white";
  rectObj.stroke = "lightseagreen";
  rectObj.strokeWidth = 0.5;
  rectObj.rx = 5;
  rectObj.ry = 5;
  rectObj.originX = "left";
  rectObj.originY = "top";
  rectObj.width = tooltipText.width + 10;
  rectObj.height = tooltipText.height + 10;
  rectObj.opacity = 0.95;
  const tooltipBox = new fabric3.Rect(rectObj);
  const tooltipGroup = new fabric3.Group([tooltipBox, tooltipText], {
    selectable: false,
    evented: false,
    objectCaching: false,
    visible: true,
    top: topPadding,
    originX: "left"
  });
  tooltipGroup.left = startPixels + 10;
  return tooltipGroup;
}

// src/custom-events.ts
function mouseOverText(fabricObj, textObj, sequence, URL, renderOptions, _this, _tooltip = true) {
  fabricObj.on("mouseover", (e) => {
    if (e.target) {
      e.target.set("hoverCursor", "pointer");
      e.target.setOptions(textObj);
      e.target.setOptions({ underline: true });
      if (_tooltip) {
        const urlTooltip = drawURLInfoTooltip(+fabricObj.left, sequence, URL, renderOptions, +fabricObj.top + 15);
        _this.canvas.add(urlTooltip);
        urlTooltip.visible = false;
      }
      _this.canvas.renderAll();
    }
  });
}
function mouseDownLink(fabricObj, href, _this) {
  fabricObj.on("mousedown", (e) => {
    if (e.target) {
      window.open(href, "_blank");
      _this.canvas.renderAll();
    }
  });
}
function mouseOutText(fabricObj, textObj, _this) {
  fabricObj.on("mouseout", (e) => {
    if (e.target) {
      e.target.setOptions(textObj);
      e.target.setOptions({ underline: false });
      _this.canvas.renderAll();
    }
  });
}
function isHsp(object) {
  return "hsp_hit_from" in object;
}
function mouseOverDomain(fabricObj, startPixels, endPixels, seq_from, seq_to, domain, renderOptions, _this) {
  fabricObj.on("mouseover", (e) => {
    if (e.target) {
      e.target.set("hoverCursor", "pointer");
      let tooltipGroup;
      if (isHsp(domain)) {
        tooltipGroup = drawDomainTooltips(
          startPixels,
          endPixels,
          seq_from,
          seq_to,
          domain,
          renderOptions,
          fabricObj.top + 5
        );
      } else {
        tooltipGroup = drawDomainInfoTooltips(
          startPixels,
          endPixels,
          seq_from,
          seq_to,
          domain,
          renderOptions,
          fabricObj.top + 5
        );
      }
      _this.canvas.add(tooltipGroup);
      tooltipGroup.set({ visible: true });
      tooltipGroup.bringToFront();
      _this.canvas.renderAll();
      tooltipGroup.set({ visible: false });
    }
  });
}
function mouseClickDomain(fabricObj, startPixels, endPixels, seq_from, seq_to, domain, renderOptions, _this) {
  fabricObj.on("mousedown", (e) => {
    if (e.target) {
      e.target.set("hoverCursor", "pointer");
      let tooltipGroup;
      if (isHsp(domain)) {
        tooltipGroup = drawDomainTooltips(
          startPixels,
          endPixels,
          seq_from,
          seq_to,
          domain,
          renderOptions,
          fabricObj.top + 5
        );
      } else {
        tooltipGroup = drawDomainInfoTooltips(
          startPixels,
          endPixels,
          seq_from,
          seq_to,
          domain,
          renderOptions,
          fabricObj.top + 5
        );
      }
      const coordProxy = startPixels;
      +endPixels + seq_from + seq_to;
      let newState = tooltipState(coordProxy, tooltipGroup);
      if (newState.state) {
        _this.canvas.add(tooltipGroup);
        tooltipGroup.set({ visible: true });
        fabricObj.bringToFront();
        tooltipGroup.bringToFront();
      } else {
        fabricObj.bringToFront();
        _this.canvas.remove(newState.data);
        _this.canvas.renderAll();
      }
    }
  });
}
function mouseOutDomain(fabricObj, _this) {
  fabricObj.on("mouseout", (e) => {
    if (e.target) {
      _this.canvas.renderAll();
    }
  });
}
function mouseOverCheckbox(fabricObj, textObj, _this) {
  fabricObj.on("mouseover", (e) => {
    if (e.target) {
      e.target.set("hoverCursor", "pointer");
      e.target.setOptions(textObj);
      e.target.setOptions({ fill: "black" });
      _this.canvas.renderAll();
    }
  });
}
function mouseDownCheckbox(fabricObj, value, inputEnum, _this) {
  fabricObj.on("mousedown", (e) => {
    if (e.target) {
      if (inputEnum === "ColorSchemeEnum") {
        if (_this.colorScheme != value) {
          _this.colorScheme = value;
          _this.render();
        }
      } else if (inputEnum === "ScaleTypeEnum") {
        if (_this.scaleType != value) {
          _this.scaleType = value;
          _this.render();
        }
      } else if (inputEnum === "ScoreTypeEnum") {
        if (_this.scoreType != value) {
          _this.scoreType = value;
          _this.render();
        }
      }
    }
  });
}
function mouseOutCheckbox(fabricObj, textObj, value, inputEnum, _this) {
  fabricObj.on("mouseout", (e) => {
    if (e.target) {
      e.target.setOptions(textObj);
      if (inputEnum === "ColorSchemeEnum") {
        if (_this.colorScheme != value) {
          e.target.setOptions({
            fill: "grey"
          });
        }
      } else if (inputEnum === "ScaleTypeEnum") {
        if (_this.scaleType != value) {
          e.target.setOptions({
            fill: "grey"
          });
        }
      } else if (inputEnum === "ScoreTypeEnum") {
        if (_this.scoreType != value) {
          e.target.setOptions({
            fill: "grey"
          });
        }
      }
      _this.canvas.renderAll();
    }
  });
}
function mouseOverDomainCheckbox(fabricObj, rectObj, currentDomainDatabase, _this) {
  fabricObj.on("mouseover", (e) => {
    if (e.target) {
      e.target.set("hoverCursor", "pointer");
      e.target.setOptions(rectObj);
      let currentDomainDatabaseDisabled = false;
      if (!_this.uniqueDomainDatabases.includes(currentDomainDatabase)) {
        currentDomainDatabaseDisabled = true;
      }
      if (currentDomainDatabaseDisabled) {
        e.target.setOptions({ fill: "white", stroke: "grey" });
        e.target.set("hoverCursor", "default");
      } else if (!_this.domainDatabaseList.includes(currentDomainDatabase)) {
        e.target.setOptions({ stroke: "black" });
        e.target.set("hoverCursor", "pointer");
      } else {
        e.target.setOptions({ opacity: 0.5, stroke: "grey" });
        e.target.set("hoverCursor", "pointer");
      }
      _this.canvas.renderAll();
    }
  });
}
function mouseDownDomainCheckbox(fabricObj, currentDomainDatabase, _this) {
  fabricObj.on("mousedown", (e) => {
    if (e.target) {
      if (!_this.domainDatabaseList.includes(currentDomainDatabase) && _this.uniqueDomainDatabases.includes(currentDomainDatabase)) {
        _this.domainDatabaseList.push(currentDomainDatabase);
        _this.currentDomainDatabase = currentDomainDatabase;
        _this.render();
      } else if (_this.uniqueDomainDatabases.includes(currentDomainDatabase)) {
        const indx = _this.domainDatabaseList.indexOf(currentDomainDatabase);
        if (indx > -1) {
          _this.domainDatabaseList.splice(indx, 1);
        }
        _this.currentDomainDatabase = void 0;
        _this.render();
      }
    }
  });
}
function mouseOutDomainCheckbox(fabricObj, rectObj, currentDomainDatabase, _this) {
  fabricObj.on("mouseout", (e) => {
    if (e.target) {
      let currentDomainDatabaseDisabled = false;
      if (!_this.uniqueDomainDatabases.includes(currentDomainDatabase)) {
        currentDomainDatabaseDisabled = true;
      }
      if (!_this.domainDatabaseList.includes(currentDomainDatabase)) {
        e.target.setOptions({ stroke: "grey", fill: "white" });
      } else if (currentDomainDatabaseDisabled) {
        e.target.setOptions({ stroke: "grey", fill: "white" });
      } else {
        e.target.setOptions(rectObj);
        e.target.setOptions({ opacity: 1, stroke: "black" });
      }
      _this.canvas.renderAll();
    }
  });
}

// src/visual-output-app.ts
var objCache = new ObjectCache();
var VisualOutput = class extends BasicCanvasRenderer {
  constructor(element, dataObj, renderOptions) {
    super(element);
    this.dataObj = dataObj;
    this.topPadding = 0;
    this.queryLen = 0;
    this.subjLen = 0;
    this.gradientSteps = [];
    this.queryFactor = 1;
    this.subjFactor = 1;
    renderOptions.canvasWidth != void 0 ? this.canvasWidth = renderOptions.canvasWidth : this.canvasWidth = 1200;
    renderOptions.canvasHeight != void 0 ? this.canvasHeight = renderOptions.canvasHeight : this.canvasHeight = 110;
    renderOptions.contentWidth != void 0 ? this.contentWidth = renderOptions.contentWidth : this.contentWidth = 65 * this.canvasWidth / 100;
    renderOptions.contentScoringWidth != void 0 ? this.contentScoringWidth = renderOptions.contentScoringWidth : this.contentScoringWidth = 7 * this.canvasWidth / 100;
    renderOptions.contentLabelWidth != void 0 ? this.contentLabelWidth = renderOptions.contentLabelWidth : this.contentLabelWidth = 27 * this.canvasWidth / 100;
    renderOptions.scaleWidth != void 0 ? this.scaleWidth = renderOptions.scaleWidth : this.scaleWidth = 75 * this.canvasWidth / 100;
    renderOptions.scaleLabelWidth != void 0 ? this.scaleLabelWidth = renderOptions.scaleLabelWidth : this.scaleLabelWidth = 15 * this.canvasWidth / 100;
    renderOptions.marginWidth != void 0 ? this.marginWidth = renderOptions.marginWidth : this.marginWidth = 0.15 * this.canvasWidth / 100;
    renderOptions.colorScheme != void 0 ? this.colorScheme = renderOptions.colorScheme : this.colorScheme = "heatmap" /* heatmap */;
    renderOptions.scaleType != void 0 ? this.scaleType = renderOptions.scaleType : this.scaleType = "dynamic" /* dynamic */;
    renderOptions.scoreType != void 0 ? this.scoreType = renderOptions.scoreType : this.scoreType = "evalue" /* evalue */;
    renderOptions.numberHits != void 0 ? this.numberHits = renderOptions.numberHits : this.numberHits = 100;
    renderOptions.numberHsps != void 0 ? this.numberHsps = renderOptions.numberHsps : this.numberHsps = 10;
    renderOptions.logSkippedHsps != void 0 ? this.logSkippedHsps = renderOptions.logSkippedHsps : this.logSkippedHsps = true;
    renderOptions.fontSize != void 0 ? this.fontSize = renderOptions.fontSize : this.fontSize = 14;
    renderOptions.fontWeigth != void 0 ? this.fontWeigth = renderOptions.fontWeigth : this.fontWeigth = "normal";
    renderOptions.fontFamily != void 0 ? this.fontFamily = renderOptions.fontFamily : this.fontFamily = "Arial";
    renderOptions.canvasWrapperStroke != void 0 ? this.canvasWrapperStroke = renderOptions.canvasWrapperStroke : this.canvasWrapperStroke = false;
    renderOptions.staticCanvas != void 0 ? this.staticCanvas = renderOptions.staticCanvas : this.staticCanvas = false;
    this.getFabricCanvas();
  }
  render() {
    this.loadInitalProperties();
    this.loadInitialCoords();
    this.canvas.clear();
    this.drawHeaderGroup();
    this.drawContentGroup();
    this.drawFooterGroup();
    this.wrapCanvas();
    this.setFrameSize();
    this.renderCanvas();
  }
  loadInitalProperties() {
    this.queryLen = this.dataObj.query_len;
    for (const hit of this.dataObj.hits.slice(0, this.numberHits)) {
      if (hit.hit_len > this.subjLen) {
        this.subjLen = hit.hit_len;
      }
    }
    const diffQueryFactor = this.queryLen / this.subjLen;
    const diffSubjFactor = this.subjLen / this.queryLen;
    if (diffQueryFactor > 8) {
      this.subjFactor = this.queryLen * 0.5 / this.subjLen;
    }
    if (diffSubjFactor > 8) {
      this.queryFactor = this.subjLen * 0.5 / this.queryLen;
    }
  }
  loadInitialCoords() {
    this.startQueryPixels = objCache.get("startQueryPixels");
    this.endQueryPixels = objCache.get("endQueryPixels");
    this.startSubjPixels = objCache.get("startSubjPixels");
    this.endSubjPixels = objCache.get("endSubjPixels");
    this.startEvalPixels = objCache.get("startEvalPixels");
    if (!this.startQueryPixels && !this.endQueryPixels && !this.startSubjPixels && !this.endSubjPixels && !this.startEvalPixels) {
      [this.startQueryPixels, this.endQueryPixels, this.startSubjPixels, this.endSubjPixels] = getQuerySubjPixelCoords(
        this.queryLen * this.queryFactor,
        this.subjLen * this.subjFactor,
        this.subjLen * this.subjFactor,
        this.contentWidth,
        this.contentScoringWidth,
        this.contentLabelWidth,
        this.marginWidth
      );
      this.startEvalPixels = this.endQueryPixels + 2 * this.marginWidth;
      objCache.put("startQueryPixels", this.startQueryPixels);
      objCache.put("endQueryPixels", this.endQueryPixels);
      objCache.put("startSubjPixels", this.startSubjPixels);
      objCache.put("endSubjPixels", this.endSubjPixels);
      objCache.put("startEvalPixels", this.startEvalPixels);
    }
  }
  drawHeaderGroup() {
    this.topPadding = 2;
    let textHeaderGroup;
    textHeaderGroup = objCache.get("textHeaderGroup");
    if (!textHeaderGroup) {
      textHeaderGroup = drawHeaderTextGroup(
        this.dataObj,
        {
          fontSize: this.fontSize,
          canvasWidth: this.canvasWidth
        },
        this.topPadding
      );
      objCache.put("textHeaderGroup", textHeaderGroup);
    }
    this.canvas.add(textHeaderGroup);
    this.topPadding += 45;
    let textHeaderLink;
    let textSeqObj;
    textHeaderLink = objCache.get("textHeaderLink");
    textSeqObj = objCache.get("textHeaderLink_textSeqObj");
    if (!textHeaderLink) {
      [textHeaderLink, textSeqObj] = drawHeaderLinkText(this.dataObj, { fontSize: this.fontSize }, this.topPadding);
      objCache.put("textHeaderLink", textHeaderLink);
      objCache.put("textHeaderLink_textSeqObj", textSeqObj);
    }
    this.canvas.add(textHeaderLink);
    if (!this.staticCanvas) {
      if (this.dataObj.query_url !== null && this.dataObj.query_url !== "") {
        mouseOverText(
          textHeaderLink,
          textSeqObj,
          this.dataObj.query_def,
          this.dataObj.query_url,
          { fontSize: this.fontSize },
          this
        );
        mouseDownLink(textHeaderLink, this.dataObj.query_url, this);
        mouseOutText(textHeaderLink, textSeqObj, this);
      }
    }
  }
  drawContentGroup() {
    if (this.dataObj.hits.length > 0) {
      this.topPadding += 25;
      let textContentHeaderGroup;
      textContentHeaderGroup = objCache.get("textContentHeaderGroup");
      if (!textContentHeaderGroup) {
        textContentHeaderGroup = drawContentHeaderTextGroup(
          {
            queryLen: this.queryLen * this.queryFactor,
            subjLen: this.subjLen * this.subjFactor,
            startQueryPixels: this.startQueryPixels,
            startEvalPixels: this.startEvalPixels,
            startSubjPixels: this.startSubjPixels
          },
          {
            contentWidth: this.contentWidth,
            contentScoringWidth: this.contentScoringWidth,
            fontSize: this.fontSize,
            scoreType: this.scoreType
          },
          this.topPadding
        );
      }
      this.canvas.add(textContentHeaderGroup);
      this.topPadding += 20;
      let lineTrackGroup;
      lineTrackGroup = objCache.get("lineTrackGroup");
      if (!lineTrackGroup) {
        lineTrackGroup = drawLineTracksQuerySubject(
          {
            startQueryPixels: this.startQueryPixels,
            endQueryPixels: this.endQueryPixels,
            startSubjPixels: this.startSubjPixels,
            endSubjPixels: this.endSubjPixels
          },
          { strokeWidth: 2 },
          this.topPadding
        );
        objCache.put("lineTrackGroup", lineTrackGroup);
      }
      this.canvas.add(lineTrackGroup);
      this.topPadding += 5;
      let textContentFooterGroup;
      textContentFooterGroup = objCache.get("textContentFooterGroup");
      if (!textContentFooterGroup) {
        textContentFooterGroup = drawContentQuerySubjFooterTextGroup(
          {
            queryLen: this.queryLen,
            subjLen: this.subjLen,
            startQueryPixels: this.startQueryPixels,
            endQueryPixels: this.endQueryPixels,
            startSubjPixels: this.startSubjPixels,
            endSubjPixels: this.endSubjPixels
          },
          {
            fontSize: this.fontSize
          },
          this.topPadding
        );
      }
      this.canvas.add(textContentFooterGroup);
      this.topPadding += 25;
      this.drawDynamicContentGroup();
      this.topPadding += 20;
      this.drawColorScaleGroup();
    } else {
      this.topPadding += 20;
      const noHitsTextGroup = drawNoHitsFoundText(
        {
          fontSize: this.fontSize,
          contentWidth: this.contentWidth
        },
        this.topPadding
      );
      this.canvas.add(noHitsTextGroup);
    }
  }
  drawDynamicContentGroup() {
    let subjLen = 0;
    let maxIDLen = 0;
    for (const hit of this.dataObj.hits.slice(0, this.numberHits)) {
      if (hit.hit_len > subjLen) subjLen = hit.hit_len;
      if (hit.hit_db.length + hit.hit_id.length > maxIDLen) maxIDLen = hit.hit_db.length + hit.hit_id.length;
    }
    let minScore = Number.MAX_VALUE;
    let maxScore = 0;
    let minNotZeroScore = Number.MAX_VALUE;
    for (const hit of this.dataObj.hits.slice(0, this.numberHits)) {
      for (const hsp of hit.hit_hsps) {
        if (this.scoreType === "bitscore" /* bitscore */) {
          if (hsp.hsp_bit_score < minScore) minScore = hsp.hsp_bit_score;
          if (hsp.hsp_bit_score > maxScore) maxScore = hsp.hsp_bit_score;
          if (hsp.hsp_bit_score < minNotZeroScore && hsp.hsp_bit_score > 0) minNotZeroScore = hsp.hsp_bit_score;
        } else if (this.scoreType === "identity" /* identity */) {
          if (hsp.hsp_identity < minScore) minScore = hsp.hsp_identity;
          if (hsp.hsp_identity > maxScore) maxScore = hsp.hsp_identity;
          if (hsp.hsp_identity < minNotZeroScore && hsp.hsp_identity > 0) minNotZeroScore = hsp.hsp_identity;
        } else if (this.scoreType === "similarity" /* similarity */) {
          if (hsp.hsp_positive < minScore) minScore = hsp.hsp_positive;
          if (hsp.hsp_positive > maxScore) maxScore = hsp.hsp_positive;
          if (hsp.hsp_positive < minNotZeroScore && hsp.hsp_positive > 0) minNotZeroScore = hsp.hsp_positive;
        } else {
          if (hsp.hsp_expect < minScore) minScore = hsp.hsp_expect;
          if (hsp.hsp_expect > maxScore) maxScore = hsp.hsp_expect;
          if (hsp.hsp_expect < minNotZeroScore && hsp.hsp_expect > 0) minNotZeroScore = hsp.hsp_expect;
        }
      }
    }
    this.gradientSteps = getGradientSteps(
      minScore,
      maxScore,
      minNotZeroScore,
      this.scaleType,
      this.scoreType,
      this.colorScheme
    );
    let tmpNumberHits = 0;
    for (const hit of this.dataObj.hits) {
      tmpNumberHits++;
      if (tmpNumberHits <= this.numberHits) {
        let numberHsps = 0;
        const totalNumberHsps = hit.hit_hsps.length;
        let textObj;
        let spaceText, hitText;
        [spaceText, hitText, textObj] = drawContentSequenceInfoText(
          maxIDLen,
          hit,
          { fontSize: this.fontSize },
          this.topPadding
        );
        this.canvas.add(spaceText);
        this.canvas.add(hitText);
        if (!this.staticCanvas) {
          mouseOverText(hitText, textObj, hit.hit_def, hit.hit_url, { fontSize: this.fontSize }, this);
          mouseDownLink(hitText, hit.hit_url, this);
          mouseOutText(hitText, textObj, this);
        }
        for (const hsp of hit.hit_hsps) {
          numberHsps++;
          if (numberHsps <= this.numberHsps) {
            const subjHspLen = hit.hit_len;
            let startQueryPixels;
            let endQueryPixels;
            let startSubjPixels;
            let endSubjPixels;
            [startQueryPixels, endQueryPixels, startSubjPixels, endSubjPixels] = getQuerySubjPixelCoords(
              this.queryLen * this.queryFactor,
              this.subjLen * this.subjFactor,
              subjHspLen,
              this.contentWidth,
              this.contentScoringWidth,
              this.contentLabelWidth,
              this.marginWidth
            );
            this.topPadding += 5;
            const linesGroup = drawLineTracksQuerySubject(
              {
                startQueryPixels,
                endQueryPixels,
                startSubjPixels,
                endSubjPixels
              },
              { strokeWidth: 1 },
              this.topPadding
            );
            this.canvas.add(linesGroup);
            let startQueryHspPixels;
            let endQueryHspPixels;
            let startSubjHspPixels;
            let endSubjHspPixels;
            let hspQueryStart;
            let hspQueryEnd;
            let hspSubjStart;
            let hspSubjEnd;
            if (hsp.hsp_query_frame === "-1") {
              hspQueryStart = hsp.hsp_query_to;
              hspQueryEnd = hsp.hsp_query_from;
            } else {
              hspQueryStart = hsp.hsp_query_from;
              hspQueryEnd = hsp.hsp_query_to;
            }
            if (hsp.hsp_hit_frame === "-1") {
              hspSubjStart = hsp.hsp_hit_to;
              hspSubjEnd = hsp.hsp_hit_from;
            } else {
              hspSubjStart = hsp.hsp_hit_from;
              hspSubjEnd = hsp.hsp_hit_to;
            }
            [startQueryHspPixels, endQueryHspPixels] = getDomainPixelCoords(
              startQueryPixels,
              endQueryPixels,
              this.queryLen,
              hspQueryStart,
              hspQueryEnd,
              this.marginWidth
            );
            [startSubjHspPixels, endSubjHspPixels] = getDomainPixelCoords(
              startSubjPixels,
              endSubjPixels,
              subjHspLen,
              hspSubjStart,
              hspSubjEnd,
              this.marginWidth
            );
            let color;
            let score;
            if (this.scoreType === "bitscore" /* bitscore */) {
              score = hsp.hsp_bit_score;
            } else if (this.scoreType === "identity" /* identity */) {
              score = hsp.hsp_identity;
            } else if (this.scoreType === "similarity" /* similarity */) {
              score = hsp.hsp_positive;
            } else {
              score = hsp.hsp_expect;
            }
            if (this.colorScheme === "qualitative" /* qualitative */ || this.colorScheme === "ncbiblast" /* ncbiblast */) {
              color = getRgbColorFixed(score, this.gradientSteps, this.colorScheme);
            } else {
              if (this.scoreType === "evalue" /* evalue */ && this.colorScheme === "heatmap" /* heatmap */) {
                color = getRgbColorLogGradient(score, this.gradientSteps, this.colorScheme);
              } else {
                color = getRgbColorLinearGradient(score, this.gradientSteps, this.colorScheme);
              }
            }
            this.topPadding += 10;
            let queryDomain, subjDomain;
            [queryDomain, subjDomain] = drawDomainQueySubject(
              startQueryHspPixels,
              endQueryHspPixels,
              startSubjHspPixels,
              endSubjHspPixels,
              this.topPadding,
              color
            );
            this.canvas.add(queryDomain);
            this.canvas.add(subjDomain);
            const scoreText = drawScoreText(
              this.startEvalPixels,
              hsp,
              {
                fontSize: this.fontSize,
                scoreType: this.scoreType
              },
              this.topPadding
            );
            scoreText.width = this.contentScoringWidth;
            this.canvas.add(scoreText);
            if (!this.staticCanvas) {
              mouseOverDomain(
                queryDomain,
                startQueryHspPixels,
                endQueryHspPixels,
                hspQueryStart,
                hspQueryEnd,
                hsp,
                {
                  fontSize: this.fontSize,
                  colorScheme: this.colorScheme
                },
                this
              );
              mouseOutDomain(queryDomain, this);
              mouseClickDomain(
                queryDomain,
                startQueryHspPixels,
                endQueryHspPixels,
                hspQueryStart,
                hspQueryEnd,
                hsp,
                {
                  fontSize: this.fontSize,
                  colorScheme: this.colorScheme
                },
                this
              );
              mouseOverDomain(
                subjDomain,
                startSubjHspPixels,
                endSubjHspPixels,
                hspSubjStart,
                hspSubjEnd,
                hsp,
                {
                  fontSize: this.fontSize,
                  colorScheme: this.colorScheme
                },
                this
              );
              mouseOutDomain(subjDomain, this);
              mouseClickDomain(
                subjDomain,
                startSubjHspPixels,
                endSubjHspPixels,
                hspSubjStart,
                hspSubjEnd,
                hsp,
                {
                  fontSize: this.fontSize,
                  colorScheme: this.colorScheme
                },
                this
              );
            }
          } else {
            if (this.logSkippedHsps === true) {
              let hspTextNotice;
              hspTextNotice = objCache.get("hspTextNotice");
              if (!hspTextNotice) {
                hspTextNotice = drawHspNoticeText(
                  totalNumberHsps,
                  this.numberHsps,
                  {
                    fontSize: this.fontSize,
                    contentWidth: this.contentWidth
                  },
                  this.topPadding
                );
                objCache.put("hspTextNotice", hspTextNotice);
              }
              this.canvas.add(hspTextNotice);
              this.topPadding += 20;
            }
            break;
          }
        }
      } else {
        this.topPadding += 20;
        let supressText;
        supressText = objCache.get("supressText");
        if (!supressText) {
          supressText = drawContentSupressText(
            {
              fontSize: this.fontSize,
              contentWidth: this.contentWidth
            },
            this.topPadding,
            this.numberHits
          );
          objCache.put("supressText", supressText);
        }
        supressText.top = this.topPadding;
        this.canvas.add(supressText);
        this.topPadding += 20;
        break;
      }
    }
  }
  drawColorScaleGroup() {
    const scaleTypeText = drawScaleLabelText(
      {
        fontSize: this.fontSize,
        scaleLabelWidth: this.scaleLabelWidth
      },
      this.topPadding,
      "Scale Type:"
    );
    this.canvas.add(scaleTypeText);
    let textCheckDynObj, textCheckFixObj;
    let dynamicBoxText, dynamicText, fixedBoxText, fixedText;
    [dynamicBoxText, dynamicText, textCheckDynObj, fixedBoxText, fixedText, textCheckFixObj] = drawScaleTypeCheckBoxText(
      {
        scaleType: this.scaleType,
        scoreType: this.scoreType,
        fontSize: this.fontSize,
        scaleLabelWidth: this.scaleLabelWidth
      },
      this.topPadding
    );
    this.canvas.add(dynamicBoxText);
    this.canvas.add(dynamicText);
    if (!this.staticCanvas) {
      mouseOverCheckbox(dynamicBoxText, textCheckDynObj, this);
      mouseOutCheckbox(dynamicBoxText, textCheckDynObj, "dynamic" /* dynamic */, "ScaleTypeEnum", this);
      mouseDownCheckbox(dynamicBoxText, "dynamic" /* dynamic */, "ScaleTypeEnum", this);
    }
    this.canvas.add(fixedBoxText);
    this.canvas.add(fixedText);
    if (!this.staticCanvas) {
      mouseOverCheckbox(fixedBoxText, textCheckFixObj, this);
      mouseOutCheckbox(fixedBoxText, textCheckFixObj, "fixed" /* fixed */, "ScaleTypeEnum", this);
      mouseDownCheckbox(fixedBoxText, "fixed" /* fixed */, "ScaleTypeEnum", this);
    }
    this.topPadding += 20;
    const scoreTypeText = drawScaleLabelText(
      {
        fontSize: this.fontSize,
        scaleLabelWidth: this.scaleLabelWidth
      },
      this.topPadding,
      "Score Used:"
    );
    this.canvas.add(scoreTypeText);
    let textCheckEvalueObj, textCheckIdentityObj, textCheckSimilarityObj, textCheckBitscoreObj;
    let evalueBoxText, evalueText, identityBoxText, identityText, similarityBoxText, similarityText, bitscoreBoxText, bitscoreText;
    [
      evalueBoxText,
      evalueText,
      textCheckEvalueObj,
      identityBoxText,
      identityText,
      textCheckIdentityObj,
      similarityBoxText,
      similarityText,
      textCheckSimilarityObj,
      bitscoreBoxText,
      bitscoreText,
      textCheckBitscoreObj
    ] = drawScoreTypeCheckBoxText(
      {
        scoreType: this.scoreType,
        fontSize: this.fontSize,
        scaleLabelWidth: this.scaleLabelWidth
      },
      this.topPadding
    );
    this.canvas.add(evalueBoxText);
    this.canvas.add(evalueText);
    if (!this.staticCanvas) {
      mouseOverCheckbox(evalueBoxText, textCheckEvalueObj, this);
      mouseOutCheckbox(evalueBoxText, textCheckEvalueObj, "evalue" /* evalue */, "ScoreTypeEnum", this);
      mouseDownCheckbox(evalueBoxText, "evalue" /* evalue */, "ScoreTypeEnum", this);
    }
    this.canvas.add(identityBoxText);
    this.canvas.add(identityText);
    if (!this.staticCanvas) {
      mouseOverCheckbox(identityBoxText, textCheckIdentityObj, this);
      mouseOutCheckbox(identityBoxText, textCheckIdentityObj, "identity" /* identity */, "ScoreTypeEnum", this);
      mouseDownCheckbox(identityBoxText, "identity" /* identity */, "ScoreTypeEnum", this);
    }
    this.canvas.add(similarityBoxText);
    this.canvas.add(similarityText);
    if (!this.staticCanvas) {
      mouseOverCheckbox(similarityBoxText, textCheckSimilarityObj, this);
      mouseOutCheckbox(similarityBoxText, textCheckSimilarityObj, "similarity" /* similarity */, "ScoreTypeEnum", this);
      mouseDownCheckbox(similarityBoxText, "similarity" /* similarity */, "ScoreTypeEnum", this);
    }
    this.canvas.add(bitscoreBoxText);
    this.canvas.add(bitscoreText);
    if (!this.staticCanvas) {
      mouseOverCheckbox(bitscoreBoxText, textCheckBitscoreObj, this);
      mouseOutCheckbox(bitscoreBoxText, textCheckBitscoreObj, "bitscore" /* bitscore */, "ScoreTypeEnum", this);
      mouseDownCheckbox(bitscoreBoxText, "bitscore" /* bitscore */, "ScoreTypeEnum", this);
    }
    this.topPadding += 20;
    const colorSchemeText = drawScaleLabelText(
      {
        fontSize: this.fontSize,
        scaleLabelWidth: this.scaleLabelWidth
      },
      this.topPadding,
      "Color Scheme:"
    );
    this.canvas.add(colorSchemeText);
    let textCheckHeatmapObj, textCheckGreyscaleObj, textCheckSequentialObj, textCheckDivergentObj, textCheckQualitativeObj, textCheckNcbiBlastObj;
    let heatmapBoxText, heatmapText, greyscaleBoxText, greyscaleText, sequentialBoxText, sequentialText, divergentBoxText, divergentText, qualitativeBoxText, qualitativeText, ncbiblastBoxText, ncbiblastText;
    [
      heatmapBoxText,
      heatmapText,
      textCheckHeatmapObj,
      greyscaleBoxText,
      greyscaleText,
      textCheckGreyscaleObj,
      sequentialBoxText,
      sequentialText,
      textCheckSequentialObj,
      divergentBoxText,
      divergentText,
      textCheckDivergentObj,
      qualitativeBoxText,
      qualitativeText,
      textCheckQualitativeObj,
      ncbiblastBoxText,
      ncbiblastText,
      textCheckNcbiBlastObj
    ] = drawColorSchemeCheckBoxText(
      {
        colorScheme: this.colorScheme,
        fontSize: this.fontSize,
        scaleLabelWidth: this.scaleLabelWidth
      },
      this.topPadding
    );
    this.canvas.add(heatmapBoxText);
    this.canvas.add(heatmapText);
    if (!this.staticCanvas) {
      mouseOverCheckbox(heatmapBoxText, textCheckHeatmapObj, this);
      mouseOutCheckbox(heatmapBoxText, textCheckHeatmapObj, "heatmap" /* heatmap */, "ColorSchemeEnum", this);
      mouseDownCheckbox(heatmapBoxText, "heatmap" /* heatmap */, "ColorSchemeEnum", this);
    }
    this.canvas.add(greyscaleBoxText);
    this.canvas.add(greyscaleText);
    if (!this.staticCanvas) {
      mouseOverCheckbox(greyscaleBoxText, textCheckGreyscaleObj, this);
      mouseOutCheckbox(greyscaleBoxText, textCheckGreyscaleObj, "greyscale" /* greyscale */, "ColorSchemeEnum", this);
      mouseDownCheckbox(greyscaleBoxText, "greyscale" /* greyscale */, "ColorSchemeEnum", this);
    }
    this.canvas.add(sequentialBoxText);
    this.canvas.add(sequentialText);
    if (!this.staticCanvas) {
      mouseOverCheckbox(sequentialBoxText, textCheckSequentialObj, this);
      mouseOutCheckbox(sequentialBoxText, textCheckSequentialObj, "sequential" /* sequential */, "ColorSchemeEnum", this);
      mouseDownCheckbox(sequentialBoxText, "sequential" /* sequential */, "ColorSchemeEnum", this);
    }
    this.canvas.add(divergentBoxText);
    this.canvas.add(divergentText);
    if (!this.staticCanvas) {
      mouseOverCheckbox(divergentBoxText, textCheckDivergentObj, this);
      mouseOutCheckbox(divergentBoxText, textCheckDivergentObj, "divergent" /* divergent */, "ColorSchemeEnum", this);
      mouseDownCheckbox(divergentBoxText, "divergent" /* divergent */, "ColorSchemeEnum", this);
    }
    this.canvas.add(qualitativeBoxText);
    this.canvas.add(qualitativeText);
    if (!this.staticCanvas) {
      mouseOverCheckbox(qualitativeBoxText, textCheckQualitativeObj, this);
      mouseOutCheckbox(
        qualitativeBoxText,
        textCheckQualitativeObj,
        "qualitative" /* qualitative */,
        "ColorSchemeEnum",
        this
      );
      mouseDownCheckbox(qualitativeBoxText, "qualitative" /* qualitative */, "ColorSchemeEnum", this);
    }
    this.canvas.add(ncbiblastBoxText);
    this.canvas.add(ncbiblastText);
    if (!this.staticCanvas) {
      mouseOverCheckbox(ncbiblastBoxText, textCheckNcbiBlastObj, this);
      mouseOutCheckbox(ncbiblastBoxText, textCheckNcbiBlastObj, "ncbiblast" /* ncbiblast */, "ColorSchemeEnum", this);
      mouseDownCheckbox(ncbiblastBoxText, "ncbiblast" /* ncbiblast */, "ColorSchemeEnum", this);
    }
    this.topPadding += 25;
    const scaleScoreText = drawScaleScoreText(
      {
        fontSize: this.fontSize,
        scaleLabelWidth: this.scaleLabelWidth,
        scoreType: this.scoreType
      },
      this.topPadding
    );
    this.canvas.add(scaleScoreText);
    const colorScale = drawScaleColorGradient(
      {
        scaleWidth: this.scaleWidth,
        scaleLabelWidth: this.scaleLabelWidth,
        colorScheme: this.colorScheme
      },
      this.topPadding
    );
    this.canvas.add(colorScale);
    if (this.colorScheme === "ncbiblast" /* ncbiblast */ || this.colorScheme === "qualitative" /* qualitative */) {
      const oneFifthGradPixels = (this.scaleLabelWidth + this.scaleWidth - this.scaleLabelWidth) / 5;
      this.topPadding += 15;
      const axisGroup = drawLineAxis6Buckets(
        this.scaleLabelWidth,
        this.scaleLabelWidth + oneFifthGradPixels,
        this.scaleLabelWidth + oneFifthGradPixels * 2,
        this.scaleLabelWidth + oneFifthGradPixels * 3,
        this.scaleLabelWidth + oneFifthGradPixels * 4,
        this.scaleLabelWidth + this.scaleWidth,
        { strokeWidth: 1 },
        this.topPadding
      );
      this.canvas.add(axisGroup);
      this.topPadding += 5;
      const tickLabels5Group = drawScaleTick5LabelsGroup(
        this.gradientSteps,
        oneFifthGradPixels,
        {
          fontSize: this.fontSize,
          scaleWidth: this.scaleWidth,
          scaleLabelWidth: this.scaleLabelWidth
        },
        this.topPadding
      );
      this.canvas.add(tickLabels5Group);
    } else {
      const oneForthGradPixels = (this.scaleLabelWidth + this.scaleWidth - this.scaleLabelWidth) / 4;
      this.topPadding += 15;
      const axisGroup = drawLineAxis5Buckets(
        this.scaleLabelWidth,
        this.scaleLabelWidth + oneForthGradPixels,
        this.scaleLabelWidth + oneForthGradPixels * 2,
        this.scaleLabelWidth + oneForthGradPixels * 3,
        this.scaleLabelWidth + this.scaleWidth,
        { strokeWidth: 1 },
        this.topPadding
      );
      this.canvas.add(axisGroup);
      this.topPadding += 5;
      const tickLabels4Group = drawScaleTick4LabelsGroup(
        this.gradientSteps,
        oneForthGradPixels,
        {
          fontSize: this.fontSize,
          scaleWidth: this.scaleWidth,
          scaleLabelWidth: this.scaleLabelWidth
        },
        this.topPadding
      );
      this.canvas.add(tickLabels4Group);
    }
  }
  drawFooterGroup() {
    this.topPadding += 30;
    let copyrightText;
    let textFooterObj;
    copyrightText = objCache.get("copyrightText");
    textFooterObj = objCache.get("copyrightText_textFooterObj");
    if (!copyrightText && !textFooterObj) {
      [copyrightText, textFooterObj] = drawFooterText(
        {
          fontSize: this.fontSize
        },
        this.topPadding
      );
      objCache.put("copyrightText", copyrightText);
      objCache.put("copyrightText_textFooterObj", textFooterObj);
    }
    this.canvas.add(copyrightText);
    let textFooterLink;
    let textFooterLinkObj;
    textFooterLink = objCache.get("textFooterLink");
    textFooterLinkObj = objCache.get("textFooterLink_textSeqObj");
    const footerLink = "https://github.com/ebi-jdispatcher/jdispatcher-viewers";
    if (!textFooterLink && !textFooterLinkObj) {
      if (!textFooterLink) {
        [textFooterLink, textFooterLinkObj] = drawFooterLinkText(
          footerLink,
          { fontSize: this.fontSize },
          this.topPadding
        );
        objCache.put("textFooterLink", textFooterLink);
        objCache.put("textFooterLink_textSeqObj", textFooterLinkObj);
      }
      this.canvas.add(textFooterLink);
      if (!this.staticCanvas) {
        mouseOverText(textFooterLink, textFooterLinkObj, footerLink, "", { fontSize: this.fontSize }, this, false);
        mouseDownLink(textFooterLink, footerLink, this);
        mouseOutText(textFooterLink, textFooterLinkObj, this);
      }
    }
    this.canvas.add(textFooterLink);
  }
  wrapCanvas() {
    this.topPadding += 20;
    this.canvasHeight = this.topPadding;
    if (this.canvasWrapperStroke) {
      const canvasWrapper = drawCanvasWrapperStroke({
        canvasWidth: this.canvasWidth,
        canvasHeight: this.canvasHeight
      });
      this.canvas.add(canvasWrapper);
    }
  }
};

// src/functional-predictions-app.ts
var defaultDomainDatabaseList = [
  "PRODOM",
  "CATH-Gene3D",
  "CDD",
  "PANTHER",
  "HAMAP",
  "Pfam",
  "PIRSF",
  "PRINTS",
  "PROSITE profiles",
  "PROSITE patterns",
  "SFLD",
  "SMART",
  "SUPERFAMILY",
  "TIGRFAMs"
];
function createDomainCheckbox(_this, currentDomainDatabase, domainDatabases, topPadding, leftPadding, renderOptions) {
  if (_this.domainDatabaseList.includes(currentDomainDatabase)) {
    _this.currentDomainDatabase = currentDomainDatabase;
  } else {
    _this.currentDomainDatabase = void 0;
  }
  _this.currentDomainDatabaseDisabled = false;
  if (!domainDatabases.includes(currentDomainDatabase)) {
    _this.currentDomainDatabaseDisabled = true;
  }
  let rectObj;
  let textObj;
  let rect;
  let text;
  [rect, text, rectObj, textObj] = drawDomainCheckbox(
    {
      currentDomainDatabase: _this.currentDomainDatabase,
      currentDisabled: _this.currentDomainDatabaseDisabled,
      fontSize: renderOptions.fontSize
    },
    topPadding,
    leftPadding,
    currentDomainDatabase
  );
  _this.canvas.add(rect);
  _this.canvas.add(text);
  if (!renderOptions.staticCanvas) {
    mouseOverDomainCheckbox(rect, rectObj, currentDomainDatabase, _this);
    mouseOutDomainCheckbox(rect, rectObj, currentDomainDatabase, _this);
    mouseDownDomainCheckbox(rect, currentDomainDatabase, _this);
  }
}
var objCache2 = new ObjectCache();
var FunctionalPredictions = class extends BasicCanvasRenderer {
  constructor(element, sssDataObj, iprmcDataObj, renderOptions, domainDatabaseList = defaultDomainDatabaseList) {
    super(element);
    this.sssDataObj = sssDataObj;
    this.iprmcDataObj = iprmcDataObj;
    this.domainDatabaseList = domainDatabaseList;
    this.topPadding = 0;
    this.queryStart = 0;
    this.queryEnd = 0;
    this.gradientSteps = [];
    this.uniqueDomainDatabases = [];
    this.currentDomainDatabaseDisabled = false;
    renderOptions.canvasWidth != void 0 ? this.canvasWidth = renderOptions.canvasWidth : this.canvasWidth = 1200;
    renderOptions.canvasHeight != void 0 ? this.canvasHeight = renderOptions.canvasHeight : this.canvasHeight = 110;
    renderOptions.contentWidth != void 0 ? this.contentWidth = renderOptions.contentWidth : this.contentWidth = 72.5 * this.canvasWidth / 100;
    renderOptions.contentLabelWidth != void 0 ? this.contentLabelWidth = renderOptions.contentLabelWidth : this.contentLabelWidth = 26.5 * this.canvasWidth / 100;
    renderOptions.contentLabelLeftWidth != void 0 ? this.contentLabelLeftWidth = renderOptions.contentLabelLeftWidth : this.contentLabelLeftWidth = 8.25 * this.canvasWidth / 100;
    renderOptions.scaleWidth != void 0 ? this.scaleWidth = renderOptions.scaleWidth : this.scaleWidth = 75 * this.canvasWidth / 100;
    renderOptions.scaleLabelWidth != void 0 ? this.scaleLabelWidth = renderOptions.scaleLabelWidth : this.scaleLabelWidth = 15 * this.canvasWidth / 100;
    renderOptions.marginWidth != void 0 ? this.marginWidth = renderOptions.marginWidth : this.marginWidth = 0.15 * this.canvasWidth / 100;
    renderOptions.colorScheme != void 0 ? this.colorScheme = renderOptions.colorScheme : this.colorScheme = "heatmap" /* heatmap */;
    renderOptions.scaleType != void 0 ? this.scaleType = renderOptions.scaleType : this.scaleType = "dynamic" /* dynamic */;
    renderOptions.scoreType != void 0 ? this.scoreType = renderOptions.scoreType : this.scoreType = "evalue" /* evalue */;
    renderOptions.numberHits != void 0 ? this.numberHits = renderOptions.numberHits : this.numberHits = 30;
    renderOptions.fontSize != void 0 ? this.fontSize = renderOptions.fontSize : this.fontSize = 14;
    renderOptions.fontWeigth != void 0 ? this.fontWeigth = renderOptions.fontWeigth : this.fontWeigth = "normal";
    renderOptions.fontFamily != void 0 ? this.fontFamily = renderOptions.fontFamily : this.fontFamily = "Arial";
    renderOptions.canvasWrapperStroke != void 0 ? this.canvasWrapperStroke = renderOptions.canvasWrapperStroke : this.canvasWrapperStroke = false;
    renderOptions.staticCanvas != void 0 ? this.staticCanvas = renderOptions.staticCanvas : this.staticCanvas = false;
    this.getFabricCanvas();
  }
  render() {
    this.loadIPRMCProperties();
    this.loadInitalProperties();
    this.loadInitialCoords();
    this.canvas.clear();
    this.drawHeaderGroup();
    this.drawContentGroup();
    this.drawFooterGroup();
    this.wrapCanvas();
    this.setFrameSize();
    this.renderCanvas();
  }
  loadInitalProperties() {
    this.queryStart = 1;
    this.queryEnd = this.sssDataObj.query_len;
  }
  loadInitialCoords() {
    this.startPixels = objCache2.get("startPixels");
    this.endPixels = objCache2.get("endPixels");
    if (!this.startPixels && !this.endPixels) {
      [this.startPixels, this.endPixels] = getPixelCoords(this.contentWidth, this.contentLabelWidth, this.marginWidth);
      objCache2.put("startPixels", this.startPixels);
      objCache2.put("endPixels", this.endPixels);
    }
  }
  loadIPRMCProperties() {
    if (this.sssDataObj != void 0) {
      this.uniqueDomainDatabases = objCache2.get("uniqueDomainDatabases");
      if (!this.uniqueDomainDatabases) {
        let proteinIdList = [];
        for (const hit of this.sssDataObj.hits.slice(0, this.numberHits)) {
          proteinIdList.push(hit.hit_acc);
        }
        this.uniqueDomainDatabases = getUniqueIPRMCDomainDatabases(this.iprmcDataObj, proteinIdList);
        objCache2.put("uniqueDomainDatabases", this.uniqueDomainDatabases);
      }
      for (const db of this.domainDatabaseList) {
        if (!this.uniqueDomainDatabases.includes(domainDatabaseNameToString(db))) {
          const indx = this.domainDatabaseList.indexOf(db);
          if (indx > -1) {
            this.domainDatabaseList.splice(indx, 1);
          }
        }
      }
    }
  }
  drawHeaderGroup() {
    this.topPadding = 2;
    let textHeaderGroup;
    textHeaderGroup = objCache2.get("textHeaderGroup");
    if (!textHeaderGroup) {
      textHeaderGroup = drawHeaderTextGroup(
        this.sssDataObj,
        {
          fontSize: this.fontSize,
          canvasWidth: this.canvasWidth
        },
        this.topPadding
      );
      objCache2.put("textHeaderGroup", textHeaderGroup);
    }
    this.canvas.add(textHeaderGroup);
    this.topPadding += 45;
    let textHeaderLink;
    let textSeqObj;
    textHeaderLink = objCache2.get("textHeaderLink");
    textSeqObj = objCache2.get("textHeaderLink_textSeqObj");
    if (!textHeaderLink) {
      [textHeaderLink, textSeqObj] = drawHeaderLinkText(this.sssDataObj, { fontSize: this.fontSize }, this.topPadding);
      objCache2.put("textHeaderLink", textHeaderLink);
      objCache2.put("textHeaderLink_textSeqObj", textSeqObj);
    }
    this.canvas.add(textHeaderLink);
    if (!this.staticCanvas) {
      if (this.sssDataObj.query_url != null && this.sssDataObj.query_url !== "") {
        mouseOverText(
          textHeaderLink,
          textSeqObj,
          this.sssDataObj.query_def,
          this.sssDataObj.query_url,
          { fontSize: this.fontSize },
          this
        );
        mouseDownLink(textHeaderLink, this.sssDataObj.query_url, this);
        mouseOutText(textHeaderLink, textSeqObj, this);
      }
    }
  }
  drawContentGroup() {
    this.topPadding += 25;
    let titleText;
    titleText = objCache2.get("titleText");
    if (!titleText) {
      titleText = drawContentTitleText(
        {
          fontSize: this.fontSize + 1
        },
        this.topPadding
      );
      objCache2.put("titleText", titleText);
    }
    this.canvas.add(titleText);
    if (this.sssDataObj.hits.length > 0) {
      this.topPadding += 35;
      this.drawPredictionsGroup();
      this.topPadding += 50;
      this.drawDynamicContentGroup();
      this.drawColorScaleGroup();
    } else {
      this.topPadding += 20;
      const noHitsTextGroup = drawNoHitsFoundText(
        {
          fontSize: this.fontSize,
          contentWidth: this.contentWidth
        },
        this.topPadding
      );
      this.canvas.add(noHitsTextGroup);
    }
  }
  drawPredictionsGroup() {
    let pfLabelText;
    pfLabelText = objCache2.get("pfLabelText");
    if (!pfLabelText) {
      pfLabelText = drawProteinFeaturesText(
        {
          fontSize: this.fontSize,
          scaleLabelWidth: this.scaleLabelWidth - 50
        },
        this.topPadding
      );
      objCache2.put("pfLabelText", pfLabelText);
    }
    this.canvas.add(pfLabelText);
    createDomainCheckbox(this, "Pfam", this.uniqueDomainDatabases, this.topPadding, this.contentLabelLeftWidth + 190, {
      fontSize: this.fontSize,
      staticCanvas: this.staticCanvas
    });
    createDomainCheckbox(
      this,
      "SUPERFAMILY",
      this.uniqueDomainDatabases,
      this.topPadding,
      this.contentLabelLeftWidth + 260,
      { fontSize: this.fontSize, staticCanvas: this.staticCanvas }
    );
    createDomainCheckbox(this, "SMART", this.uniqueDomainDatabases, this.topPadding, this.contentLabelLeftWidth + 390, {
      fontSize: this.fontSize,
      staticCanvas: this.staticCanvas
    });
    createDomainCheckbox(this, "HAMAP", this.uniqueDomainDatabases, this.topPadding, this.contentLabelLeftWidth + 480, {
      fontSize: this.fontSize,
      staticCanvas: this.staticCanvas
    });
    createDomainCheckbox(
      this,
      "PANTHER",
      this.uniqueDomainDatabases,
      this.topPadding,
      this.contentLabelLeftWidth + 570,
      { fontSize: this.fontSize, staticCanvas: this.staticCanvas }
    );
    createDomainCheckbox(
      this,
      "PRODOM",
      this.uniqueDomainDatabases,
      this.topPadding,
      this.contentLabelLeftWidth + 680,
      { fontSize: this.fontSize, staticCanvas: this.staticCanvas }
    );
    createDomainCheckbox(
      this,
      "PROSITE profiles",
      this.uniqueDomainDatabases,
      this.topPadding,
      this.contentLabelLeftWidth + 770,
      { fontSize: this.fontSize, staticCanvas: this.staticCanvas }
    );
    this.topPadding += 30;
    createDomainCheckbox(this, "CDD", this.uniqueDomainDatabases, this.topPadding, this.contentLabelLeftWidth + 190, {
      fontSize: this.fontSize,
      staticCanvas: this.staticCanvas
    });
    createDomainCheckbox(
      this,
      "CATH-Gene3D",
      this.uniqueDomainDatabases,
      this.topPadding,
      this.contentLabelLeftWidth + 260,
      { fontSize: this.fontSize, staticCanvas: this.staticCanvas }
    );
    createDomainCheckbox(this, "PIRSF", this.uniqueDomainDatabases, this.topPadding, this.contentLabelLeftWidth + 390, {
      fontSize: this.fontSize,
      staticCanvas: this.staticCanvas
    });
    createDomainCheckbox(
      this,
      "PRINTS",
      this.uniqueDomainDatabases,
      this.topPadding,
      this.contentLabelLeftWidth + 480,
      { fontSize: this.fontSize, staticCanvas: this.staticCanvas }
    );
    createDomainCheckbox(
      this,
      "TIGRFAMs",
      this.uniqueDomainDatabases,
      this.topPadding,
      this.contentLabelLeftWidth + 570,
      { fontSize: this.fontSize, staticCanvas: this.staticCanvas }
    );
    createDomainCheckbox(this, "SFLD", this.uniqueDomainDatabases, this.topPadding, this.contentLabelLeftWidth + 680, {
      fontSize: this.fontSize,
      staticCanvas: this.staticCanvas
    });
    createDomainCheckbox(
      this,
      "PROSITE patterns",
      this.uniqueDomainDatabases,
      this.topPadding,
      this.contentLabelLeftWidth + 770,
      { fontSize: this.fontSize, staticCanvas: this.staticCanvas }
    );
  }
  drawDynamicContentGroup() {
    let maxIDLen = 0;
    for (const hit of this.sssDataObj.hits.slice(0, this.numberHits)) {
      if (hit.hit_db.length + hit.hit_id.length > maxIDLen) maxIDLen = hit.hit_db.length + hit.hit_id.length;
    }
    let minScore = Number.MAX_VALUE;
    let maxScore = 0;
    let minNotZeroScore = Number.MAX_VALUE;
    for (const hit of this.sssDataObj.hits.slice(0, this.numberHits)) {
      for (const hsp of hit.hit_hsps) {
        if (this.scoreType === "bitscore" /* bitscore */) {
          if (hsp.hsp_bit_score < minScore) minScore = hsp.hsp_bit_score;
          if (hsp.hsp_bit_score > maxScore) maxScore = hsp.hsp_bit_score;
          if (hsp.hsp_bit_score < minNotZeroScore && hsp.hsp_bit_score > 0) minNotZeroScore = hsp.hsp_bit_score;
        } else if (this.scoreType === "identity" /* identity */) {
          if (hsp.hsp_identity < minScore) minScore = hsp.hsp_identity;
          if (hsp.hsp_identity > maxScore) maxScore = hsp.hsp_identity;
          if (hsp.hsp_identity < minNotZeroScore && hsp.hsp_identity > 0) minNotZeroScore = hsp.hsp_identity;
        } else if (this.scoreType === "similarity" /* similarity */) {
          if (hsp.hsp_positive < minScore) minScore = hsp.hsp_positive;
          if (hsp.hsp_positive > maxScore) maxScore = hsp.hsp_positive;
          if (hsp.hsp_positive < minNotZeroScore && hsp.hsp_positive > 0) minNotZeroScore = hsp.hsp_positive;
        } else {
          if (hsp.hsp_expect < minScore) minScore = hsp.hsp_expect;
          if (hsp.hsp_expect > maxScore) maxScore = hsp.hsp_expect;
          if (hsp.hsp_expect < minNotZeroScore && hsp.hsp_expect > 0) minNotZeroScore = hsp.hsp_expect;
        }
      }
    }
    this.gradientSteps = getGradientSteps(
      minScore,
      maxScore,
      minNotZeroScore,
      this.scaleType,
      this.scoreType,
      this.colorScheme
    );
    let tmpNumberHits = 0;
    for (const hit of this.sssDataObj.hits) {
      tmpNumberHits++;
      if (tmpNumberHits <= this.numberHits) {
        let textObj;
        let spaceText, hitText;
        [spaceText, hitText, textObj] = drawContentSequenceInfoText(
          maxIDLen,
          hit,
          { fontSize: this.fontSize },
          this.topPadding
        );
        this.canvas.add(spaceText);
        this.canvas.add(hitText);
        if (!this.staticCanvas) {
          mouseOverText(hitText, textObj, hit.hit_def, hit.hit_url, { fontSize: this.fontSize }, this);
          mouseDownLink(hitText, hit.hit_url, this);
          mouseOutText(hitText, textObj, this);
        }
        const lineTrackGroup = drawLineTracks(
          {
            startPixels: this.startPixels,
            endPixels: this.endPixels
          },
          { strokeWidth: 1 },
          this.topPadding
        );
        this.canvas.add(lineTrackGroup);
        this.topPadding += 5;
        const textContentFooterGroup = drawContentFooterTextGroup(
          {
            start: this.queryStart,
            end: hit.hit_len,
            startPixels: this.startPixels,
            endPixels: this.endPixels
          },
          {
            fontSize: this.fontSize
          },
          this.topPadding
        );
        this.canvas.add(textContentFooterGroup);
        this.topPadding += 15;
        let boxColor = "white";
        let hspStart = 0;
        let hspEnd = 0;
        for (const hsp of hit.hit_hsps) {
          if (hsp.hsp_hit_frame === "-1") {
            hspStart = hsp.hsp_hit_to;
            hspEnd = hsp.hsp_hit_from;
          } else {
            hspStart = hsp.hsp_hit_from;
            hspEnd = hsp.hsp_hit_to;
          }
          let score;
          if (this.scoreType === "bitscore" /* bitscore */) {
            score = hsp.hsp_bit_score;
          } else if (this.scoreType === "identity" /* identity */) {
            score = hsp.hsp_identity;
          } else if (this.scoreType === "similarity" /* similarity */) {
            score = hsp.hsp_positive;
          } else {
            score = hsp.hsp_expect;
          }
          if (this.colorScheme === "qualitative" /* qualitative */ || this.colorScheme === "ncbiblast" /* ncbiblast */) {
            boxColor = getRgbColorFixed(score, this.gradientSteps, this.colorScheme);
          } else {
            if (this.scoreType === "evalue" /* evalue */ && this.colorScheme === "heatmap" /* heatmap */) {
              boxColor = getRgbColorLogGradient(score, this.gradientSteps, this.colorScheme);
            } else {
              boxColor = getRgbColorLinearGradient(score, this.gradientSteps, this.colorScheme);
            }
          }
          break;
        }
        let startDomainPixels = 0;
        let endDomainPixels = 0;
        [startDomainPixels, endDomainPixels] = getDomainPixelCoords(
          this.startPixels,
          this.endPixels,
          hit.hit_len,
          hspStart,
          hspEnd,
          this.marginWidth
        );
        let boxHeight = 0;
        let tmpTopPadding = this.topPadding - 15;
        if (hit.hit_acc in this.iprmcDataObj) {
          if (this.iprmcDataObj[hit.hit_acc]["matches"] !== void 0) {
            for (const did of this.iprmcDataObj[hit.hit_acc]["matches"]) {
              const domain = domainDatabaseNameToString(
                this.iprmcDataObj[hit.hit_acc]["match"][did][0]["dbname"]
              );
              if (this.domainDatabaseList.includes(domain)) {
                this.topPadding += 15;
                boxHeight += 15;
                let dashedLineTrackGroup = drawDomainLineTracks(
                  {
                    startPixels: this.startPixels,
                    endPixels: this.endPixels
                  },
                  { strokeWidth: 1, strokeDashArray: [1, 5] },
                  this.topPadding
                );
                this.canvas.add(dashedLineTrackGroup);
                dashedLineTrackGroup.sendToBack();
                let textObj2;
                let spaceText2, hitText2;
                [spaceText2, hitText2, textObj2] = drawContentDomainInfoText(
                  did.split("_")[1] + " \u25BA",
                  { fontSize: this.fontSize },
                  this.topPadding
                );
                this.canvas.add(spaceText2);
                this.canvas.add(hitText2);
                const domainURL = getDomainURLbyDatabase(did.split("_")[1], domain);
                if (!this.staticCanvas) {
                  mouseOverText(hitText2, textObj2, "", domainURL, { fontSize: this.fontSize }, this);
                  mouseDownLink(hitText2, domainURL, this);
                  mouseOutText(hitText2, textObj2, this);
                }
                for (const dp of this.iprmcDataObj[hit.hit_acc]["match"][did]) {
                  let domainStart = dp.start;
                  let domainEnd = dp.end;
                  let startDomainPixels2 = 0;
                  let endDomainPixels2 = 0;
                  [startDomainPixels2, endDomainPixels2] = getDomainPixelCoords(
                    this.startPixels,
                    this.endPixels,
                    hit.hit_len,
                    domainStart,
                    domainEnd,
                    this.marginWidth
                  );
                  const dpDomain = drawDomains(
                    startDomainPixels2,
                    endDomainPixels2,
                    this.topPadding + 10,
                    colorByDatabaseName(dp.dbname)
                  );
                  this.canvas.add(dpDomain);
                  if (!this.staticCanvas) {
                    mouseOverDomain(
                      dpDomain,
                      startDomainPixels2,
                      endDomainPixels2,
                      domainStart,
                      domainEnd,
                      dp,
                      {
                        fontSize: this.fontSize
                      },
                      this
                    );
                    mouseOutDomain(dpDomain, this);
                    mouseClickDomain(
                      dpDomain,
                      startDomainPixels2,
                      endDomainPixels2,
                      domainStart,
                      domainEnd,
                      dp,
                      {
                        fontSize: this.fontSize
                      },
                      this
                    );
                  }
                }
              }
            }
          }
        }
        boxHeight += 15;
        const hitTransparentBox = drawHitTransparentBox(
          startDomainPixels,
          endDomainPixels,
          tmpTopPadding,
          boxColor,
          boxHeight
        );
        this.canvas.add(hitTransparentBox);
        hitTransparentBox.sendToBack();
        this.topPadding += 40;
      } else {
        let supressText;
        supressText = objCache2.get("supressText");
        if (!supressText) {
          supressText = drawContentSupressText(
            {
              fontSize: this.fontSize,
              contentWidth: this.contentWidth
            },
            this.topPadding,
            this.numberHits
          );
          objCache2.put("supressText", supressText);
        }
        supressText.top = this.topPadding;
        this.canvas.add(supressText);
        this.topPadding += 40;
        break;
      }
    }
  }
  drawColorScaleGroup() {
    const scaleTypeText = drawScaleLabelText(
      {
        fontSize: this.fontSize,
        scaleLabelWidth: this.scaleLabelWidth
      },
      this.topPadding,
      "Scale Type:"
    );
    this.canvas.add(scaleTypeText);
    let textCheckDynObj, textCheckFixObj;
    let dynamicBoxText, dynamicText, fixedBoxText, fixedText;
    [dynamicBoxText, dynamicText, textCheckDynObj, fixedBoxText, fixedText, textCheckFixObj] = drawScaleTypeCheckBoxText(
      {
        scaleType: this.scaleType,
        scoreType: this.scoreType,
        fontSize: this.fontSize,
        scaleLabelWidth: this.scaleLabelWidth
      },
      this.topPadding
    );
    this.canvas.add(dynamicBoxText);
    this.canvas.add(dynamicText);
    if (!this.staticCanvas) {
      mouseOverCheckbox(dynamicBoxText, textCheckDynObj, this);
      mouseOutCheckbox(dynamicBoxText, textCheckDynObj, "dynamic" /* dynamic */, "ScaleTypeEnum", this);
      mouseDownCheckbox(dynamicBoxText, "dynamic" /* dynamic */, "ScaleTypeEnum", this);
    }
    this.canvas.add(fixedBoxText);
    this.canvas.add(fixedText);
    if (!this.staticCanvas) {
      mouseOverCheckbox(fixedBoxText, textCheckFixObj, this);
      mouseOutCheckbox(fixedBoxText, textCheckFixObj, "fixed" /* fixed */, "ScaleTypeEnum", this);
      mouseDownCheckbox(fixedBoxText, "fixed" /* fixed */, "ScaleTypeEnum", this);
    }
    this.topPadding += 20;
    const scoreTypeText = drawScaleLabelText(
      {
        fontSize: this.fontSize,
        scaleLabelWidth: this.scaleLabelWidth
      },
      this.topPadding,
      "Score Used:"
    );
    this.canvas.add(scoreTypeText);
    let textCheckEvalueObj, textCheckIdentityObj, textCheckSimilarityObj, textCheckBitscoreObj;
    let evalueBoxText, evalueText, identityBoxText, identityText, similarityBoxText, similarityText, bitscoreBoxText, bitscoreText;
    [
      evalueBoxText,
      evalueText,
      textCheckEvalueObj,
      identityBoxText,
      identityText,
      textCheckIdentityObj,
      similarityBoxText,
      similarityText,
      textCheckSimilarityObj,
      bitscoreBoxText,
      bitscoreText,
      textCheckBitscoreObj
    ] = drawScoreTypeCheckBoxText(
      {
        scoreType: this.scoreType,
        fontSize: this.fontSize,
        scaleLabelWidth: this.scaleLabelWidth
      },
      this.topPadding
    );
    this.canvas.add(evalueBoxText);
    this.canvas.add(evalueText);
    if (!this.staticCanvas) {
      mouseOverCheckbox(evalueBoxText, textCheckEvalueObj, this);
      mouseOutCheckbox(evalueBoxText, textCheckEvalueObj, "evalue" /* evalue */, "ScoreTypeEnum", this);
      mouseDownCheckbox(evalueBoxText, "evalue" /* evalue */, "ScoreTypeEnum", this);
    }
    this.canvas.add(identityBoxText);
    this.canvas.add(identityText);
    if (!this.staticCanvas) {
      mouseOverCheckbox(identityBoxText, textCheckIdentityObj, this);
      mouseOutCheckbox(identityBoxText, textCheckIdentityObj, "identity" /* identity */, "ScoreTypeEnum", this);
      mouseDownCheckbox(identityBoxText, "identity" /* identity */, "ScoreTypeEnum", this);
    }
    this.canvas.add(similarityBoxText);
    this.canvas.add(similarityText);
    if (!this.staticCanvas) {
      mouseOverCheckbox(similarityBoxText, textCheckSimilarityObj, this);
      mouseOutCheckbox(similarityBoxText, textCheckSimilarityObj, "similarity" /* similarity */, "ScoreTypeEnum", this);
      mouseDownCheckbox(similarityBoxText, "similarity" /* similarity */, "ScoreTypeEnum", this);
    }
    this.canvas.add(bitscoreBoxText);
    this.canvas.add(bitscoreText);
    if (!this.staticCanvas) {
      mouseOverCheckbox(bitscoreBoxText, textCheckBitscoreObj, this);
      mouseOutCheckbox(bitscoreBoxText, textCheckBitscoreObj, "bitscore" /* bitscore */, "ScoreTypeEnum", this);
      mouseDownCheckbox(bitscoreBoxText, "bitscore" /* bitscore */, "ScoreTypeEnum", this);
    }
    this.topPadding += 20;
    const colorSchemeText = drawScaleLabelText(
      {
        fontSize: this.fontSize,
        scaleLabelWidth: this.scaleLabelWidth
      },
      this.topPadding,
      "Color Scheme:"
    );
    this.canvas.add(colorSchemeText);
    let textCheckHeatmapObj, textCheckGreyscaleObj, textCheckSequentialObj, textCheckDivergentObj, textCheckQualitativeObj, textCheckNcbiBlastObj;
    let heatmapBoxText, heatmapText, greyscaleBoxText, greyscaleText, sequentialBoxText, sequentialText, divergentBoxText, divergentText, qualitativeBoxText, qualitativeText, ncbiblastBoxText, ncbiblastText;
    [
      heatmapBoxText,
      heatmapText,
      textCheckHeatmapObj,
      greyscaleBoxText,
      greyscaleText,
      textCheckGreyscaleObj,
      sequentialBoxText,
      sequentialText,
      textCheckSequentialObj,
      divergentBoxText,
      divergentText,
      textCheckDivergentObj,
      qualitativeBoxText,
      qualitativeText,
      textCheckQualitativeObj,
      ncbiblastBoxText,
      ncbiblastText,
      textCheckNcbiBlastObj
    ] = drawColorSchemeCheckBoxText(
      {
        colorScheme: this.colorScheme,
        fontSize: this.fontSize,
        scaleLabelWidth: this.scaleLabelWidth
      },
      this.topPadding
    );
    this.canvas.add(heatmapBoxText);
    this.canvas.add(heatmapText);
    if (!this.staticCanvas) {
      mouseOverCheckbox(heatmapBoxText, textCheckHeatmapObj, this);
      mouseOutCheckbox(heatmapBoxText, textCheckHeatmapObj, "heatmap" /* heatmap */, "ColorSchemeEnum", this);
      mouseDownCheckbox(heatmapBoxText, "heatmap" /* heatmap */, "ColorSchemeEnum", this);
    }
    this.canvas.add(greyscaleBoxText);
    this.canvas.add(greyscaleText);
    if (!this.staticCanvas) {
      mouseOverCheckbox(greyscaleBoxText, textCheckGreyscaleObj, this);
      mouseOutCheckbox(greyscaleBoxText, textCheckGreyscaleObj, "greyscale" /* greyscale */, "ColorSchemeEnum", this);
      mouseDownCheckbox(greyscaleBoxText, "greyscale" /* greyscale */, "ColorSchemeEnum", this);
    }
    this.canvas.add(sequentialBoxText);
    this.canvas.add(sequentialText);
    if (!this.staticCanvas) {
      mouseOverCheckbox(sequentialBoxText, textCheckSequentialObj, this);
      mouseOutCheckbox(sequentialBoxText, textCheckSequentialObj, "sequential" /* sequential */, "ColorSchemeEnum", this);
      mouseDownCheckbox(sequentialBoxText, "sequential" /* sequential */, "ColorSchemeEnum", this);
    }
    this.canvas.add(divergentBoxText);
    this.canvas.add(divergentText);
    if (!this.staticCanvas) {
      mouseOverCheckbox(divergentBoxText, textCheckDivergentObj, this);
      mouseOutCheckbox(divergentBoxText, textCheckDivergentObj, "divergent" /* divergent */, "ColorSchemeEnum", this);
      mouseDownCheckbox(divergentBoxText, "divergent" /* divergent */, "ColorSchemeEnum", this);
    }
    this.canvas.add(qualitativeBoxText);
    this.canvas.add(qualitativeText);
    if (!this.staticCanvas) {
      mouseOverCheckbox(qualitativeBoxText, textCheckQualitativeObj, this);
      mouseOutCheckbox(
        qualitativeBoxText,
        textCheckQualitativeObj,
        "qualitative" /* qualitative */,
        "ColorSchemeEnum",
        this
      );
      mouseDownCheckbox(qualitativeBoxText, "qualitative" /* qualitative */, "ColorSchemeEnum", this);
    }
    this.canvas.add(ncbiblastBoxText);
    this.canvas.add(ncbiblastText);
    if (!this.staticCanvas) {
      mouseOverCheckbox(ncbiblastBoxText, textCheckNcbiBlastObj, this);
      mouseOutCheckbox(ncbiblastBoxText, textCheckNcbiBlastObj, "ncbiblast" /* ncbiblast */, "ColorSchemeEnum", this);
      mouseDownCheckbox(ncbiblastBoxText, "ncbiblast" /* ncbiblast */, "ColorSchemeEnum", this);
    }
    this.topPadding += 25;
    const scaleScoreText = drawScaleScoreText(
      {
        fontSize: this.fontSize,
        scaleLabelWidth: this.scaleLabelWidth,
        scoreType: this.scoreType
      },
      this.topPadding
    );
    this.canvas.add(scaleScoreText);
    const colorScale = drawScaleColorGradient(
      {
        scaleWidth: this.scaleWidth,
        scaleLabelWidth: this.scaleLabelWidth,
        colorScheme: this.colorScheme
      },
      this.topPadding
    );
    this.canvas.add(colorScale);
    if (this.colorScheme === "ncbiblast" /* ncbiblast */ || this.colorScheme === "qualitative" /* qualitative */) {
      const oneFifthGradPixels = (this.scaleLabelWidth + this.scaleWidth - this.scaleLabelWidth) / 5;
      this.topPadding += 15;
      const axisGroup = drawLineAxis6Buckets(
        this.scaleLabelWidth,
        this.scaleLabelWidth + oneFifthGradPixels,
        this.scaleLabelWidth + oneFifthGradPixels * 2,
        this.scaleLabelWidth + oneFifthGradPixels * 3,
        this.scaleLabelWidth + oneFifthGradPixels * 4,
        this.scaleLabelWidth + this.scaleWidth,
        { strokeWidth: 1 },
        this.topPadding
      );
      this.canvas.add(axisGroup);
      this.topPadding += 5;
      const tickLabels5Group = drawScaleTick5LabelsGroup(
        this.gradientSteps,
        oneFifthGradPixels,
        {
          fontSize: this.fontSize,
          scaleWidth: this.scaleWidth,
          scaleLabelWidth: this.scaleLabelWidth
        },
        this.topPadding
      );
      this.canvas.add(tickLabels5Group);
    } else {
      const oneForthGradPixels = (this.scaleLabelWidth + this.scaleWidth - this.scaleLabelWidth) / 4;
      this.topPadding += 15;
      const axisGroup = drawLineAxis5Buckets(
        this.scaleLabelWidth,
        this.scaleLabelWidth + oneForthGradPixels,
        this.scaleLabelWidth + oneForthGradPixels * 2,
        this.scaleLabelWidth + oneForthGradPixels * 3,
        this.scaleLabelWidth + this.scaleWidth,
        { strokeWidth: 1 },
        this.topPadding
      );
      this.canvas.add(axisGroup);
      this.topPadding += 5;
      const tickLabels4Group = drawScaleTick4LabelsGroup(
        this.gradientSteps,
        oneForthGradPixels,
        {
          fontSize: this.fontSize,
          scaleWidth: this.scaleWidth,
          scaleLabelWidth: this.scaleLabelWidth
        },
        this.topPadding
      );
      this.canvas.add(tickLabels4Group);
    }
  }
  drawFooterGroup() {
    this.topPadding += 30;
    let copyrightText;
    let textFooterObj;
    copyrightText = objCache2.get("copyrightText");
    textFooterObj = objCache2.get("copyrightText_textFooterObj");
    if (!copyrightText && !textFooterObj) {
      [copyrightText, textFooterObj] = drawFooterText(
        {
          fontSize: this.fontSize
        },
        this.topPadding
      );
      objCache2.put("copyrightText", copyrightText);
      objCache2.put("copyrightText_textFooterObj", textFooterObj);
    }
    this.canvas.add(copyrightText);
    let textFooterLink;
    let textFooterLinkObj;
    textFooterLink = objCache2.get("textFooterLink");
    textFooterLinkObj = objCache2.get("textFooterLink_textSeqObj");
    const footerLink = "https://github.com/ebi-jdispatcher/jdispatcher-viewers";
    if (!textFooterLink && !textFooterLinkObj) {
      if (!textFooterLink) {
        [textFooterLink, textFooterLinkObj] = drawFooterLinkText(
          footerLink,
          { fontSize: this.fontSize },
          this.topPadding
        );
        objCache2.put("textFooterLink", textFooterLink);
        objCache2.put("textFooterLink_textSeqObj", textFooterLinkObj);
      }
      if (!this.staticCanvas) {
        mouseOverText(textFooterLink, textFooterLinkObj, footerLink, "", { fontSize: this.fontSize }, this, false);
        mouseDownLink(textFooterLink, footerLink, this);
        mouseOutText(textFooterLink, textFooterLinkObj, this);
      }
    }
    this.canvas.add(textFooterLink);
  }
  wrapCanvas() {
    this.topPadding += 20;
    this.canvasHeight = this.topPadding;
    if (this.canvasWrapperStroke) {
      const canvasWrapper = drawCanvasWrapperStroke({
        canvasWidth: this.canvasWidth,
        canvasHeight: this.canvasHeight
      });
      this.canvas.add(canvasWrapper);
    }
  }
};
export {
  BasicCanvasRenderer,
  ColorSchemeEnum,
  DataModelEnum,
  FunctionalPredictions,
  HSVtoRGB,
  ObjectCache,
  ScaleTypeEnum,
  ScoreTypeEnum,
  VisualOutput,
  colorByDatabaseName,
  colorGenericGradient,
  colorNcbiBlastGradient,
  colorQualitativeGradient,
  countDecimals,
  dataAsType,
  divergentGradient,
  domainDatabaseNameToString,
  drawCanvasWrapperStroke,
  drawColorSchemeCheckBoxText,
  drawContentDomainInfoText,
  drawContentFooterTextGroup,
  drawContentHeaderTextGroup,
  drawContentQuerySubjFooterTextGroup,
  drawContentSequenceInfoText,
  drawContentSupressText,
  drawContentTitleText,
  drawDomainCheckbox,
  drawDomainInfoTooltips,
  drawDomainLineTracks,
  drawDomainQueySubject,
  drawDomainTooltips,
  drawDomains,
  drawFooterLinkText,
  drawFooterText,
  drawHeaderLinkText,
  drawHeaderTextGroup,
  drawHitTransparentBox,
  drawHspNoticeText,
  drawLineAxis5Buckets,
  drawLineAxis6Buckets,
  drawLineTracks,
  drawLineTracksQuerySubject,
  drawNoHitsFoundText,
  drawProteinFeaturesText,
  drawScaleColorGradient,
  drawScaleLabelText,
  drawScaleScoreText,
  drawScaleTick4LabelsGroup,
  drawScaleTick5LabelsGroup,
  drawScaleTypeCheckBoxText,
  drawScoreText,
  drawScoreTypeCheckBoxText,
  drawURLInfoTooltip,
  fetchData,
  getColorType,
  getDomainPixelCoords,
  getDomainURLbyDatabase,
  getGradientSteps,
  getIPRMCDataModelFlatFromXML,
  getIPRMCDbfetchAccessions,
  getIPRMCDbfetchURL,
  getJdispatcherJsonURL,
  getPixelCoords,
  getQuerySubjPixelCoords,
  getRgbColorFixed,
  getRgbColorLinearGradient,
  getRgbColorLogGradient,
  getTextLegendPaddingFactor,
  getTotalPixels,
  getUniqueIPRMCDomainDatabases,
  greyscaleGradient,
  heatmapGradient,
  jobIdDefaults,
  lineDefaults,
  mouseClickDomain,
  mouseDownCheckbox,
  mouseDownDomainCheckbox,
  mouseDownLink,
  mouseOutCheckbox,
  mouseOutDomain,
  mouseOutDomainCheckbox,
  mouseOutText,
  mouseOverCheckbox,
  mouseOverDomain,
  mouseOverDomainCheckbox,
  mouseOverText,
  ncbiBlastGradient,
  numberToString,
  objectDefaults,
  qualitativeGradient,
  rectDefaults,
  sequentialGradient,
  textDefaults,
  toPositiveNumber,
  tooltipState,
  validateJobId,
  validateSubmittedDbfetchInput,
  validateSubmittedJobIdInput
};

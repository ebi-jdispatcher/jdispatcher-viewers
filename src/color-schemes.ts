import { fabric } from "fabric";
import { ColorType } from "./custom-types";

export const defaultGradient: ColorType = {
    0.0: [255, 64, 64],
    0.25: [255, 255, 64],
    0.5: [64, 255, 64],
    0.75: [64, 255, 255],
    1.0: [64, 64, 255],
    keys: [0.0, 0.25, 0.5, 0.75, 1.0],
};

export function colorDefaultGradient(
    canvasObj: fabric.Object,
    start: number,
    end: number
) {
    canvasObj.setGradient("fill", {
        type: "linear",
        x1: start,
        y1: 0,
        x2: end,
        y2: 0,
        colorStops: {
            0.0: `rgb(${defaultGradient[0.0].join(",")})`,
            0.25: `rgb(${defaultGradient[0.25].join(",")})`,
            0.5: `rgb(${defaultGradient[0.5].join(",")})`,
            0.75: `rgb(${defaultGradient[0.75].join(",")})`,
            1.0: `rgb(${defaultGradient[1.0].join(",")})`,
        },
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

export function colorNcbiBlastGradient(
    canvasObj: fabric.Object,
    start: number,
    end: number
) {
    canvasObj.setGradient("fill", {
        type: "linear",
        x1: start,
        y1: 0,
        x2: end,
        y2: 0,
        colorStops: {
            0.0: `rgb(${ncbiBlastGradient[0].join(",")})`,
            0.199999: `rgb(${ncbiBlastGradient[0].join(",")})`,
            0.2: `rgb(${ncbiBlastGradient[40].join(",")})`,
            0.399999: `rgb(${ncbiBlastGradient[40].join(",")})`,
            0.4: `rgb(${ncbiBlastGradient[50].join(",")})`,
            0.599999: `rgb(${ncbiBlastGradient[50].join(",")})`,
            0.6: `rgb(${ncbiBlastGradient[80].join(",")})`,
            0.799999: `rgb(${ncbiBlastGradient[80].join(",")})`,
            0.8: `rgb(${ncbiBlastGradient[200].join(",")})`,
            1.0: `rgb(${ncbiBlastGradient[200].join(",")})`,
        },
    });
}

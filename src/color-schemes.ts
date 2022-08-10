import {fabric} from "fabric";
import {ColorType} from "./custom-types";

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
    canvasObj.set("fill", new fabric.Gradient({
        type: "linear",
        coords: {
            x1: start,
            y1: 0,
            x2: end,
            y2: 0
        },
        colorStops: [
            {offset: 0.0, color: `rgb(${defaultGradient[0.0].join(",")})`},
            {offset: 0.25, color: `rgb(${defaultGradient[0.25].join(",")})`},
            {offset: 0.5, color: `rgb(${defaultGradient[0.5].join(",")})`},
            {offset: 0.75, color: `rgb(${defaultGradient[0.75].join(",")})`},
            {offset: 1.0, color: `rgb(${defaultGradient[1.0].join(",")})`}
        ]
    }));
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
    canvasObj.set("fill", new fabric.Gradient({
        type: "linear",
        coords: {
            x1: start,
            y1: 0,
            x2: end,
            y2: 0
        },
        colorStops: [
            {offset: 0.0, color: `rgb(${ncbiBlastGradient[0].join(",")})`},
            {offset: 0.199999, color: `rgb(${ncbiBlastGradient[0].join(",")})`},
            {offset: 0.2, color: `rgb(${ncbiBlastGradient[40].join(",")})`},
            {offset: 0.399999, color: `rgb(${ncbiBlastGradient[40].join(",")})`},
            {offset: 0.4, color: `rgb(${ncbiBlastGradient[50].join(",")})`},
            {offset: 0.599999, color: `rgb(${ncbiBlastGradient[50].join(",")})`},
            {offset: 0.6, color: `rgb(${ncbiBlastGradient[80].join(",")})`},
            {offset: 0.799999, color: `rgb(${ncbiBlastGradient[80].join(",")})`},
            {offset: 0.8, color: `rgb(${ncbiBlastGradient[200].join(",")})`},
            {offset: 1.0, color: `rgb(${ncbiBlastGradient[200].join(",")})`},
        ]
    }));
}

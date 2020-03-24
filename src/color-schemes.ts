import { fabric } from "fabric";
import { ColorType } from "./custom-types";


export const defaultGradient: ColorType = {
    0.00: [255, 64, 64],
    0.25: [255, 255, 64],
    0.50: [64, 255, 64],
    0.75: [64, 255, 255],
    1.00: [64, 64, 255],
    "keys": [0.00, 0.25, 0.50, 0.75, 1.00]
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
            0.0: `rgb(${defaultGradient[0.00].join(",")})`,
            0.25: `rgb(${defaultGradient[0.25].join(",")})`,
            0.5: `rgb(${defaultGradient[0.50].join(",")})`,
            0.75: `rgb(${defaultGradient[0.75].join(",")})`,
            1.0: `rgb(${defaultGradient[1.00].join(",")})`
        }
    });
}

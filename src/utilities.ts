import { fabric } from "fabric";
import { CanvasDefaults } from "./config";
import { LineType } from "./custom-types";
import { HSVtoRGB } from "./color-utilities";

export function getTextLegendPaddingFactor(inputString: string): number {
    let positionFactor = 0;
    if (inputString.length === 1) {
        positionFactor = 2.5;
    } else if (inputString.length === 2) {
        positionFactor = 10;
    } else if (inputString.length === 3) {
        positionFactor = 15.5;
    } else if (inputString.length === 4) {
        positionFactor = 21;
    }
    return positionFactor;
}

function getTotalPixels(queryLen: number, subjLen: number, varLen: number) {
    const totalLen = queryLen + subjLen;
    const totalPixels =
        (varLen * CanvasDefaults.maxPixels - CanvasDefaults.evaluePixels) /
        totalLen;
    return totalPixels;
}

export function getQuerySubjPixelCoords(
    queryLen: number,
    subjLen: number,
    subjHspLen: number
) {
    const totalQueryPixels = getTotalPixels(queryLen, subjLen, queryLen);
    const totalSubjPixels = getTotalPixels(queryLen, subjLen, subjHspLen);
    const startQueryPixels =
        CanvasDefaults.leftPaddingPixels + CanvasDefaults.borderPixels;
    const endQueryPixels =
        CanvasDefaults.leftPaddingPixels +
        totalQueryPixels -
        CanvasDefaults.borderPixels;
    const startSubjPixels =
        CanvasDefaults.leftPaddingPixels +
        totalQueryPixels +
        CanvasDefaults.evaluePixels +
        CanvasDefaults.borderPixels;
    const endSubjPixels =
        CanvasDefaults.leftPaddingPixels +
        totalQueryPixels +
        CanvasDefaults.evaluePixels +
        totalSubjPixels -
        CanvasDefaults.borderPixels;
    return [startQueryPixels, endQueryPixels, startSubjPixels, endSubjPixels];
}

export function getEvalPixelCoords(endQueryPixels: number) {
    const startEvalPixels = endQueryPixels + 2 * CanvasDefaults.borderPixels;
    const endEvalPixels =
        endQueryPixels +
        CanvasDefaults.borderPixels +
        CanvasDefaults.evaluePixels -
        CanvasDefaults.borderPixels;
    return [startEvalPixels, endEvalPixels];
}

export function getHspPixelCoords(
    queryLen: number,
    subjLen: number,
    varLen: number,
    paddingPixels: number,
    hspStart: number,
    hspEnd: number
) {
    const totalPixels = getTotalPixels(queryLen, subjLen, varLen);
    const startPixels = (hspStart * totalPixels) / varLen;
    const endPixels = ((hspEnd - hspStart - 1) * totalPixels) / varLen;
    const startHspPixels = paddingPixels + startPixels;
    const endHspPixels = endPixels - 2 * CanvasDefaults.borderPixels;
    return [startHspPixels, endHspPixels];
}

export function drawLineTracks(
    startQueryPixels: number,
    endQueryPixels: number,
    startSubjPixels: number,
    endSubjPixels: number,
    topPadding: number,
    strokeWidth: number
): [fabric.Group, number] {
    const top: number = 15;
    let lineObj: LineType = {
        selectable: false,
        evented: false,
        objectCaching: false,
        top: topPadding + top,
        stroke: "black",
        strokeWidth: strokeWidth
    };
    //  Query
    const coordsQuery: [number, number, number, number] = [
        startQueryPixels,
        topPadding + top,
        endQueryPixels,
        topPadding + top
    ];
    lineObj.left = startQueryPixels;
    const queryLine = new fabric.Line(coordsQuery, lineObj);

    const coordsQueryStartCap: [number, number, number, number] = [
        startQueryPixels,
        topPadding + top - 3,
        startQueryPixels,
        topPadding + top + 3
    ];
    lineObj.top = topPadding + top - 2;
    const queryStartCap = new fabric.Line(coordsQueryStartCap, lineObj);

    const coordsQueryEndCap: [number, number, number, number] = [
        endQueryPixels,
        topPadding + top - 3,
        endQueryPixels,
        topPadding + top + 3
    ];
    lineObj.left = endQueryPixels;
    const queryEndCap = new fabric.Line(coordsQueryEndCap, lineObj);

    // Subject
    const coordsSubj: [number, number, number, number] = [
        startSubjPixels,
        topPadding + top,
        endSubjPixels,
        topPadding + top
    ];
    lineObj.top = topPadding + top;
    lineObj.left = startSubjPixels;
    const subjLine = new fabric.Line(coordsSubj, lineObj);

    const coordsSubjStartCap: [number, number, number, number] = [
        startSubjPixels,
        topPadding + top - 3,
        startSubjPixels,
        topPadding + top + 3
    ];
    lineObj.top = topPadding + top - 2;
    const subjStartCap = new fabric.Line(coordsSubjStartCap, lineObj);

    const coordsSubjEndCap: [number, number, number, number] = [
        endSubjPixels,
        topPadding + top - 3,
        endSubjPixels,
        topPadding + top + 3
    ];
    lineObj.left = endSubjPixels;
    const subjEndCap = new fabric.Line(coordsSubjEndCap, lineObj);

    // Group
    const lineGroup = new fabric.Group(
        [
            queryLine,
            subjLine,
            queryStartCap,
            queryEndCap,
            subjStartCap,
            subjEndCap
        ],
        CanvasDefaults.groupConfig
    );
    return [lineGroup, topPadding + top];
}

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

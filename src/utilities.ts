import { fabric } from "fabric";
import { CanvasDefaults } from "./config";
import { LineType } from "./custom-types";

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

export function getQuerySubjPixelCoords(
    queryLen: number,
    subjLen: number,
    subjHspLen: number
) {
    const totalLen: number = queryLen + subjLen;
    const totalQueryPixels: number =
        (queryLen * CanvasDefaults.maxPixels - CanvasDefaults.evaluePixels) / totalLen;
    // const totalSubjPixels: number =
    //     (subjLen * Defaults.maxPixels - Defaults.evaluePixels) / totalLen;
    const subjDiffPixels: number =
        (subjHspLen * CanvasDefaults.maxPixels - CanvasDefaults.evaluePixels) / totalLen;
    const startQueryPixels = CanvasDefaults.leftPaddingPixels + CanvasDefaults.borderPixels;
    const endQueryPixels =
        CanvasDefaults.leftPaddingPixels + totalQueryPixels - CanvasDefaults.borderPixels;
    const startSubjPixels =
        CanvasDefaults.leftPaddingPixels +
        totalQueryPixels +
        CanvasDefaults.evaluePixels +
        CanvasDefaults.borderPixels;
    const endSubjPixels =
        CanvasDefaults.leftPaddingPixels +
        totalQueryPixels +
        CanvasDefaults.evaluePixels +
        subjDiffPixels -
        CanvasDefaults.borderPixels;

    return [startQueryPixels, endQueryPixels, startSubjPixels, endSubjPixels];
}

export function getEvalPixelCoords(queryLen: number, subjLen: number) {
    const totalLen: number = queryLen + subjLen;
    const totalQueryPixels: number =
        (queryLen * CanvasDefaults.maxPixels - CanvasDefaults.evaluePixels) / totalLen;
    const startEvalPixels =
        CanvasDefaults.leftPaddingPixels + totalQueryPixels + CanvasDefaults.borderPixels;
    const endEvalPixels =
        CanvasDefaults.leftPaddingPixels +
        totalQueryPixels +
        CanvasDefaults.evaluePixels -
        CanvasDefaults.borderPixels;
    return [startEvalPixels, endEvalPixels];
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

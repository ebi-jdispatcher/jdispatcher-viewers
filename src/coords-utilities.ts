import { CanvasDefaults } from "./config";

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

export function getTotalPixels(queryLen: number, subjLen: number, varLen: number) {
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
    // const endEvalPixels =
    //     endQueryPixels +
    //     CanvasDefaults.borderPixels +
    //     CanvasDefaults.evaluePixels -
    //     CanvasDefaults.borderPixels;
    return startEvalPixels;
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

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

export function getTotalPixels(
    queryLen: number,
    subjLen: number,
    varLen: number,
    contentWidth: number,
    contentScoringWidth: number
) {
    const totalLen = queryLen + subjLen;
    const totalPixels =
        (varLen * contentWidth - contentScoringWidth) / totalLen;
    return totalPixels;
}

export function getQuerySubjPixelCoords(
    queryLen: number,
    subjLen: number,
    subjHspLen: number,
    contentWidth: number,
    contentScoringWidth: number,
    contentLabelWidth: number,
    marginWidth: number
) {
    const totalQueryPixels = getTotalPixels(
        queryLen,
        subjLen,
        queryLen,
        contentWidth,
        contentScoringWidth
    );
    const totalSubjPixels = getTotalPixels(
        queryLen,
        subjLen,
        subjHspLen,
        contentWidth,
        contentScoringWidth
    );
    const startQueryPixels = contentLabelWidth + marginWidth;
    const endQueryPixels = contentLabelWidth + totalQueryPixels - marginWidth;
    const startSubjPixels =
        contentLabelWidth +
        totalQueryPixels +
        contentScoringWidth +
        marginWidth;
    const endSubjPixels =
        contentLabelWidth +
        totalQueryPixels +
        contentScoringWidth +
        totalSubjPixels -
        marginWidth;
    return [startQueryPixels, endQueryPixels, startSubjPixels, endSubjPixels];
}

export function getHspPixelCoords(
    queryLen: number,
    subjLen: number,
    varLen: number,
    paddingPixels: number,
    hspStart: number,
    hspEnd: number,
    contentWidth: number,
    contentScoringWidth: number,
    marginWidth: number
) {
    const totalPixels = getTotalPixels(
        queryLen,
        subjLen,
        varLen,
        contentWidth,
        contentScoringWidth
    );
    const startPixels = (hspStart * totalPixels) / varLen;
    const endPixels = ((hspEnd - hspStart - 1) * totalPixels) / varLen;
    const startHspPixels = paddingPixels + startPixels;
    const endHspPixels = endPixels - 2 * marginWidth;
    return [startHspPixels, endHspPixels];
}

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

export function getPixelCoords(
    contentWidth: number,
    contentLabelWidth: number,
    marginWidth: number
) {
    const startPixels = contentLabelWidth + marginWidth;
    const endPixels = contentLabelWidth + contentWidth - marginWidth;
    return [startPixels, endPixels];
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
    startPixels: number,
    endPixels: number,
    hitLen: number,
    hspStart: number,
    hspEnd: number
) {
    const startHspPixels =
        startPixels + (hspStart * (endPixels - startPixels)) / hitLen;
    const endHspPixels =
        startPixels +
        (hspEnd * (endPixels - startPixels)) / hitLen -
        startHspPixels;
    return [startHspPixels, endHspPixels];
}

export function getHspBoxPixelCoords(
    startPixels: number,
    endPixels: number,
    hitLen: number,
    startDomain: number,
    endDomain: number,
    marginWidth: number
): [number, number] {
    const totalPixels = endPixels - startPixels;
    const startDomainPixels =
        startPixels + (startDomain * totalPixels) / hitLen - marginWidth;
    const endDomainPixels = (endDomain * totalPixels) / hitLen - marginWidth;
    return [startDomainPixels, endDomainPixels];
}

export function getDomainPixelCoords(
    startPixels: number,
    endPixels: number,
    hitLen: number,
    startDomain: number,
    endDomain: number,
    marginWidth: number
): [number, number] {
    const totalPixels = endPixels - startPixels;
    const startDomainPixels =
        startPixels + (startDomain * totalPixels) / hitLen - marginWidth;
    const endDomainPixels =
        startPixels +
        (endDomain * totalPixels) / hitLen -
        marginWidth -
        startDomainPixels;
    return [startDomainPixels, endDomainPixels];
}

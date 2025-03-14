export function getTextLegendPaddingFactor(inputString) {
    let positionFactor = 0;
    if (inputString.length === 1) {
        positionFactor = 2.5;
    }
    else if (inputString.length === 2) {
        positionFactor = 10;
    }
    else if (inputString.length === 3) {
        positionFactor = 15.5;
    }
    else if (inputString.length === 4) {
        positionFactor = 21;
    }
    else if (inputString.length === 5) {
        positionFactor = 29;
    }
    else if (inputString.length === 6) {
        positionFactor = 35;
    }
    else if (inputString.length === 7) {
        positionFactor = 41;
    }
    else if (inputString.length === 8) {
        positionFactor = 47;
    }
    return positionFactor;
}
export function getTotalPixels(queryLen, subjLen, varLen, contentWidth, contentScoringWidth) {
    const totalLen = queryLen + subjLen;
    const totalPixels = (varLen * contentWidth - contentScoringWidth) / totalLen;
    return totalPixels;
}
export function getPixelCoords(contentWidth, contentLabelWidth, marginWidth) {
    const startPixels = contentLabelWidth + marginWidth;
    const endPixels = contentLabelWidth + contentWidth - marginWidth;
    return [startPixels, endPixels];
}
export function getQuerySubjPixelCoords(queryLen, subjLen, subjHspLen, contentWidth, contentScoringWidth, contentLabelWidth, marginWidth) {
    const totalQueryPixels = getTotalPixels(queryLen, subjLen, queryLen, contentWidth, contentScoringWidth);
    const totalSubjPixels = getTotalPixels(queryLen, subjLen, subjHspLen, contentWidth, contentScoringWidth);
    const startQueryPixels = contentLabelWidth + marginWidth;
    const endQueryPixels = contentLabelWidth + totalQueryPixels - marginWidth;
    const startSubjPixels = contentLabelWidth + totalQueryPixels + contentScoringWidth + marginWidth;
    const endSubjPixels = contentLabelWidth + totalQueryPixels + contentScoringWidth + totalSubjPixels - marginWidth;
    return [startQueryPixels, endQueryPixels, startSubjPixels, endSubjPixels];
}
export function getDomainPixelCoords(startPixels, endPixels, hitLen, startDomain, endDomain, marginWidth) {
    const startDomainPixels = startPixels + (startDomain * (endPixels - startPixels)) / hitLen + marginWidth;
    const endDomainPixels = startPixels + (endDomain * (endPixels - startPixels)) / hitLen - marginWidth - startDomainPixels;
    return [startDomainPixels, endDomainPixels];
}

/**
 * Calculates a padding factor based on the length of the input string.
 * @param {string} inputString - The input string to determine the padding factor.
 * @returns {number} The calculated padding factor.
 */
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

/**
 * Calculates the total number of pixels based on the provided lengths and widths.
 * @param {number} queryLen - The length of the query.
 * @param {number} subjLen - The length of the subject.
 * @param {number} varLen - The variable length.
 * @param {number} contentWidth - The width of the content.
 * @param {number} contentScoringWidth - The width of the scoring content.
 * @returns {number} The total number of pixels.
 */
export function getTotalPixels(
  queryLen: number,
  subjLen: number,
  varLen: number,
  contentWidth: number,
  contentScoringWidth: number
) {
  const totalLen = queryLen + subjLen;
  const totalPixels = (varLen * contentWidth - contentScoringWidth) / totalLen;
  return totalPixels;
}

/**
 * Calculates the pixel coordinates for the start and end positions.
 * @param {number} contentWidth - The width of the content.
 * @param {number} contentLabelWidth - The width of the content label.
 * @param {number} marginWidth - The width of the margin.
 * @returns {[number, number]} An array containing the start and end pixel coordinates.
 */
export function getPixelCoords(contentWidth: number, contentLabelWidth: number, marginWidth: number) {
  const startPixels = contentLabelWidth + marginWidth;
  const endPixels = contentLabelWidth + contentWidth - marginWidth;
  return [startPixels, endPixels];
}

/**
 * Calculates the pixel coordinates for query and subject regions.
 * @param {number} queryLen - The length of the query.
 * @param {number} subjLen - The length of the subject.
 * @param {number} subjHspLen - The length of the subject HSP.
 * @param {number} contentWidth - The width of the content.
 * @param {number} contentScoringWidth - The width of the scoring content.
 * @param {number} contentLabelWidth - The width of the content label.
 * @param {number} marginWidth - The width of the margin.
 * @returns {[number, number, number, number]} An array containing the start and end
 * pixel coordinates for query and subject regions.
 */
export function getQuerySubjPixelCoords(
  queryLen: number,
  subjLen: number,
  subjHspLen: number,
  contentWidth: number,
  contentScoringWidth: number,
  contentLabelWidth: number,
  marginWidth: number
) {
  const totalQueryPixels = getTotalPixels(queryLen, subjLen, queryLen, contentWidth, contentScoringWidth);
  const totalSubjPixels = getTotalPixels(queryLen, subjLen, subjHspLen, contentWidth, contentScoringWidth);
  const startQueryPixels = contentLabelWidth + marginWidth;
  const endQueryPixels = contentLabelWidth + totalQueryPixels - marginWidth;
  const startSubjPixels = contentLabelWidth + totalQueryPixels + contentScoringWidth + marginWidth;
  const endSubjPixels = contentLabelWidth + totalQueryPixels + contentScoringWidth + totalSubjPixels - marginWidth;
  return [startQueryPixels, endQueryPixels, startSubjPixels, endSubjPixels];
}

/**
 * Calculates the pixel coordinates for a domain region.
 * @param {number} startPixels - The starting pixel position.
 * @param {number} endPixels - The ending pixel position.
 * @param {number} hitLen - The length of the hit.
 * @param {number} startDomain - The starting position of the domain.
 * @param {number} endDomain - The ending position of the domain.
 * @param {number} marginWidth - The width of the margin.
 * @returns {[number, number]} An array containing the start and end pixel coordinates for the domain.
 */
export function getDomainPixelCoords(
  startPixels: number,
  endPixels: number,
  hitLen: number,
  startDomain: number,
  endDomain: number,
  marginWidth: number
): [number, number] {
  const startDomainPixels = startPixels + (startDomain * (endPixels - startPixels)) / hitLen + marginWidth;
  const endDomainPixels =
    startPixels + (endDomain * (endPixels - startPixels)) / hitLen - marginWidth - startDomainPixels;
  return [startDomainPixels, endDomainPixels];
}

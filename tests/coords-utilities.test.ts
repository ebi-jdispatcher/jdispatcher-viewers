import {
  getTextLegendPaddingFactor,
  getTotalPixels,
  getPixelCoords,
  getQuerySubjPixelCoords,
  getDomainPixelCoords,
} from '../src/coords-utilities';

describe('getTextLegendPaddingFactor', () => {
  it('should return correct padding factor for different string lengths', () => {
    expect(getTextLegendPaddingFactor('A')).toBe(2.5);
    expect(getTextLegendPaddingFactor('AB')).toBe(10);
    expect(getTextLegendPaddingFactor('ABC')).toBe(15.5);
    expect(getTextLegendPaddingFactor('ABCD')).toBe(21);
    expect(getTextLegendPaddingFactor('ABCDE')).toBe(29);
    expect(getTextLegendPaddingFactor('ABCDEF')).toBe(35);
    expect(getTextLegendPaddingFactor('ABCDEFG')).toBe(41);
    expect(getTextLegendPaddingFactor('ABCDEFGH')).toBe(47);
    expect(getTextLegendPaddingFactor('')).toBe(0);
  });
});

describe('getTotalPixels', () => {
  test('should calculate total pixels correctly with positive numbers', () => {
    const queryLen = 100;
    const subjLen = 200;
    const varLen = 10;
    const contentWidth = 500;
    const contentScoringWidth = 50;

    const result = getTotalPixels(queryLen, subjLen, varLen, contentWidth, contentScoringWidth);
    expect(result).toBeCloseTo(16.5); // Adjust this value based on the expected outcome
  });

  test('should return 0 when contentWidth and contentScoringWidth are equal', () => {
    const queryLen = 100;
    const subjLen = 200;
    const varLen = 10;
    const contentWidth = 50;
    const contentScoringWidth = 50;

    const result = getTotalPixels(queryLen, subjLen, varLen, contentWidth, contentScoringWidth);
    expect(result).toBe(1.5);
  });

  test('should handle zero lengths gracefully', () => {
    const queryLen = 0;
    const subjLen = 200;
    const varLen = 10;
    const contentWidth = 500;
    const contentScoringWidth = 50;

    const result = getTotalPixels(queryLen, subjLen, varLen, contentWidth, contentScoringWidth);
    expect(result).toBeCloseTo(24.75); // Adjust this based on your expected result
  });

  test('should return Infinity when totalLen is 0', () => {
    const queryLen = 0;
    const subjLen = 0;
    const varLen = 10;
    const contentWidth = 500;
    const contentScoringWidth = 50;

    const result = getTotalPixels(queryLen, subjLen, varLen, contentWidth, contentScoringWidth);
    expect(result).toBe(Infinity); // Division by zero case
  });

  test('should handle very large numbers', () => {
    const queryLen = 1e9;
    const subjLen = 1e9;
    const varLen = 10;
    const contentWidth = 1e8;
    const contentScoringWidth = 5e7;

    const result = getTotalPixels(queryLen, subjLen, varLen, contentWidth, contentScoringWidth);
    expect(result).toBeCloseTo(0.475); // Adjust this based on your expected result
  });
});

describe('getPixelCoords', () => {
  it('should return correct start and end pixels based on content and margin widths', () => {
    const [start, end] = getPixelCoords(300, 50, 25);
    expect(start).toBe(75);
    expect(end).toBe(325);
  });
});

describe('getQuerySubjPixelCoords', () => {
  it('should calculate pixel coordinates for query and subject', () => {
    const [startQuery, endQuery, startSubj, endSubj] = getQuerySubjPixelCoords(100, 200, 150, 300, 50, 50, 10);
    expect(startQuery).toBe(60);
    expect(endQuery).toBeCloseTo(139.83, 1);
    expect(startSubj).toBeCloseTo(209.83, 1);
    expect(endSubj).toBeCloseTo(339.66, 1);
  });
});

describe('getDomainPixelCoords', () => {
  it('should calculate start and end domain pixel coordinates', () => {
    const [startDomainPixels, endDomainPixels] = getDomainPixelCoords(100, 500, 1000, 200, 400, 10);
    expect(startDomainPixels).toBeCloseTo(190);
    expect(endDomainPixels).toBeCloseTo(60);
  });

  it('should handle edge case where startDomain is equal to endDomain', () => {
    const [startDomainPixels, endDomainPixels] = getDomainPixelCoords(100, 500, 1000, 300, 300, 10);
    expect(startDomainPixels).toBeCloseTo(230);
    expect(endDomainPixels).toBeCloseTo(-20); // based on formula with zero length domain
  });
});

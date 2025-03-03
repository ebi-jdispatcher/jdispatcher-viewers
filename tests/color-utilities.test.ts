import {
  getRgbColorLogGradient,
  getRgbColorLinearGradient,
  getRgbColorFixed,
  getGradientSteps,
  HSVtoRGB,
  colorByDatabaseName,
} from '../src/color-utilities';
import { ColorSchemeEnum, ScoreTypeEnum, ScaleTypeEnum } from '../src/custom-types';

describe('getRgbColorLinearGradient', () => {
  const gradientSteps = [0.0, 0.25, 0.5, 0.75, 1.0];

  it('returns color for zero score', () => {
    expect(getRgbColorLinearGradient(0.0, gradientSteps, ColorSchemeEnum.heatmap)).toBe('rgb(255,64,64)');
  });

  it('throws error for mismatched lengths between gradientSteps and colorScheme', () => {
    const invalidGradientSteps = [0, 1, 2];
    expect(() => getRgbColorLogGradient(0, invalidGradientSteps, ColorSchemeEnum.heatmap)).toThrow(
      'Color Scheme and Gradient Steps should have matching lengths!'
    );
  });

  it('calculates gradient color for a score within step range', () => {
    const color = getRgbColorLogGradient(1.5, gradientSteps, ColorSchemeEnum.heatmap);
    expect(color).toMatch(/rgb\(\d{1,3},\d{1,3},\d{1,3}\)/);
  });
});

describe('getRgbColorFixed', () => {
  const gradientSteps = [0.0, 0.25, 0.5, 0.75, 1.0];

  it('returns fixed color for score at the lowest range', () => {
    expect(getRgbColorFixed(0.25, gradientSteps, ColorSchemeEnum.heatmap)).toBe('rgb(255,255,64)');
  });

  it('returns fixed color for score within middle range', () => {
    expect(getRgbColorFixed(0.5, gradientSteps, ColorSchemeEnum.heatmap)).toBe('rgb(64,255,64)');
    expect(getRgbColorFixed(0.75, gradientSteps, ColorSchemeEnum.heatmap)).toBe('rgb(64,255,255)');
  });

  it('returns fixed color for score in the highest range', () => {
    expect(getRgbColorFixed(1.0, gradientSteps, ColorSchemeEnum.heatmap)).toBe('rgb(64,64,255)');
  });
});

describe('getGradientSteps', () => {
  it('returns fixed gradient steps for ColorSchemeEnum.heatmap', () => {
    const steps = getGradientSteps(0, 100, 1, ScaleTypeEnum.fixed, ScoreTypeEnum.identity, ColorSchemeEnum.heatmap);
    expect(steps).toEqual([0, 25, 50, 75, 100]);
  });

  it('returns dynamic gradient steps based on e-values', () => {
    const steps = getGradientSteps(1e-5, 1, 1e-5, ScaleTypeEnum.dynamic, ScoreTypeEnum.evalue, ColorSchemeEnum.heatmap);
    expect(steps).toHaveLength(5);
    expect(steps[0]).toBeCloseTo(1e-5);
    expect(steps[4]).toBeCloseTo(1);
  });

  it('returns specific gradient steps for ColorSchemeEnum.ncbiblast', () => {
    const steps = getGradientSteps(0, 200, 1, ScaleTypeEnum.fixed, ScoreTypeEnum.bitscore, ColorSchemeEnum.ncbiblast);
    expect(steps).toEqual([0, 40, 50, 80, 200]);
  });
});

describe('HSVtoRGB', () => {
  it('converts HSV to RGB correctly for various values', () => {
    expect(HSVtoRGB(0, 1, 1)).toEqual([255, 0, 0]); // Red
    expect(HSVtoRGB(0.3333, 1, 1)).toEqual([0, 255, 0]); // Green
    expect(HSVtoRGB(0.6666, 1, 1)).toEqual([0, 0, 255]); // Blue
  });

  it('handles black and white correctly', () => {
    expect(HSVtoRGB(0, 0, 0)).toEqual([0, 0, 0]); // Black
    expect(HSVtoRGB(0, 0, 1)).toEqual([255, 255, 255]); // White
  });
});

describe('colorByDatabaseName', () => {
  it('returns correct color for known domain names', () => {
    expect(colorByDatabaseName('Pfam')).toBe('rgb(211,47,47)');
    expect(colorByDatabaseName('SMART')).toBe('rgb(106,27,154)');
    expect(colorByDatabaseName('PROSITE profiles')).toBe('rgb(0,150,136)');
  });

  it('returns default color for unknown domain names', () => {
    expect(colorByDatabaseName('UnknownDomain')).toBe('rgb(128,128,128)');
  });
});

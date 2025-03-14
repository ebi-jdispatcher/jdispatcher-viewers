import {
  ColorSchemeEnum,
  RenderOptions,
  JobIdValidable,
  jobIdDefaults,
  TextType,
  RectType,
  ObjectType,
  ColorType,
  CoordsValues,
  objectDefaults,
  textDefaults,
  rectDefaults,
  lineDefaults,
  toPositiveNumber,
  posnumber,
} from '../src/custom-types';

// Test suite for ColorSchemeEnum
describe('ColorSchemeEnum', () => {
  test('should have expected values', () => {
    expect(ColorSchemeEnum.heatmap).toBe('heatmap');
    expect(ColorSchemeEnum.greyscale).toBe('greyscale');
    expect(ColorSchemeEnum.sequential).toBe('sequential');
    expect(ColorSchemeEnum.divergent).toBe('divergent');
    expect(ColorSchemeEnum.qualitative).toBe('qualitative');
    expect(ColorSchemeEnum.ncbiblast).toBe('ncbiblast');
  });
});

// Test suite for RenderOptions
describe('RenderOptions Interface', () => {
  const options: RenderOptions = {
    canvasWidth: 800,
    canvasHeight: 600,
    colorScheme: ColorSchemeEnum.heatmap,
  };

  test('should accept valid values for RenderOptions properties', () => {
    expect(typeof options.canvasWidth).toBe('number');
    expect(typeof options.canvasHeight).toBe('number');
    expect(options.colorScheme).toBe(ColorSchemeEnum.heatmap);
  });

  test('should allow undefined properties in RenderOptions', () => {
    const partialOptions: RenderOptions = { jobId: 'job123' };
    expect(partialOptions.jobId).toBe('job123');
    expect(partialOptions.canvasWidth).toBeUndefined();
  });
});

// Test suite for JobIdValidable and jobIdDefaults
describe('JobIdValidable', () => {
  test('should match jobIdDefaults values', () => {
    expect(jobIdDefaults.value).toBe('');
    expect(jobIdDefaults.required).toBe(true);
    expect(jobIdDefaults.minLength).toBe(35);
    expect(jobIdDefaults.maxLength).toBe(60);
    expect(jobIdDefaults.pattern).toBeInstanceOf(RegExp);
  });

  test('should validate jobId pattern', () => {
    const validJobId = 'abc-DEF-123-456-789-p2m';
    const invalidJobId = 'abc-123';

    expect(jobIdDefaults.pattern?.test(validJobId)).toBe(true);
    expect(jobIdDefaults.pattern?.test(invalidJobId)).toBe(false);
  });
});

// Test suite for TextType, RectType, and ObjectType
describe('TextType, RectType, and ObjectType interfaces', () => {
  test('should apply default values correctly', () => {
    expect(objectDefaults.selectable).toBe(false);
    expect(objectDefaults.evented).toBe(false);
    expect(objectDefaults.objectCaching).toBe(false);

    expect(textDefaults.selectable).toBe(objectDefaults.selectable);
    expect(rectDefaults.objectCaching).toBe(objectDefaults.objectCaching);
  });
});

// Test suite for ColorType
describe('ColorType Interface', () => {
  const colorType: ColorType = {
    keys: [1, 2, 3],
    1: [255, 0, 0],
    2: [0, 255, 0],
    3: [0, 0, 255],
  };

  test('should have keys as array of numbers', () => {
    expect(Array.isArray(colorType.keys)).toBe(true);
    expect(colorType.keys).toContain(1);
  });

  test('should have color mappings as [number, number, number]', () => {
    expect(colorType[1]).toEqual([255, 0, 0]);
    expect(colorType[2]).toEqual([0, 255, 0]);
  });
});

// Test suite for CoordsValues interface
describe('CoordsValues Interface', () => {
  const coords: CoordsValues = {
    queryLen: 100,
    subjLen: 200,
    start: 10,
    end: 90,
  };

  test('should accept coordinate properties', () => {
    expect(coords.queryLen).toBe(100);
    expect(coords.subjLen).toBe(200);
    expect(coords.start).toBe(10);
    expect(coords.end).toBe(90);
  });
});

describe('toPositiveNumber', () => {
  it('should return a posnumber for a positive input', () => {
    const value = 5;
    const result: posnumber = toPositiveNumber(value);
    expect(result).toBe(value); // Check if the returned value is the input itself
    expect(typeof result).toBe('number'); // Ensure the type is still a number
  });

  it('should return a posnumber for zero', () => {
    const value = 0;
    const result: posnumber = toPositiveNumber(value);
    expect(result).toBe(value); // Check if the returned value is zero
    expect(typeof result).toBe('number'); // Ensure the type is still a number
  });

  it('should throw an error for a negative input', () => {
    const value = -3;
    expect(() => toPositiveNumber(value)).toThrow(`${value} is not a positive number`);
  });
});

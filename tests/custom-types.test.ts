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
} from '../src/custom-types';

// Test suite for ColorSchemeEnum
describe('ColorSchemeEnum', () => {
  test('should have expected values', () => {
    expect(ColorSchemeEnum.fixed).toBe('fixed');
    expect(ColorSchemeEnum.dynamic).toBe('dynamic');
    expect(ColorSchemeEnum.ncbiblast).toBe('ncbiblast');
    expect(ColorSchemeEnum.blasterjs).toBe('blasterjs');
  });
});

// Test suite for RenderOptions
describe('RenderOptions Interface', () => {
  const options: RenderOptions = {
    canvasWidth: 800,
    canvasHeight: 600,
    colorScheme: ColorSchemeEnum.fixed,
  };

  test('should accept valid values for RenderOptions properties', () => {
    expect(typeof options.canvasWidth).toBe('number');
    expect(typeof options.canvasHeight).toBe('number');
    expect(options.colorScheme).toBe(ColorSchemeEnum.fixed);
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

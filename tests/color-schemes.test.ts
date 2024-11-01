import { fabric } from 'fabric';
import { defaultGradient, colorDefaultGradient, ncbiBlastGradient, colorNcbiBlastGradient } from '../src/color-schemes';

describe('defaultGradient', () => {
  it('should have expected gradient color values', () => {
    expect(defaultGradient[0.0]).toEqual([255, 64, 64]);
    expect(defaultGradient[0.25]).toEqual([255, 255, 64]);
    expect(defaultGradient[0.5]).toEqual([64, 255, 64]);
    expect(defaultGradient[0.75]).toEqual([64, 255, 255]);
    expect(defaultGradient[1.0]).toEqual([64, 64, 255]);
  });

  it('should have expected keys', () => {
    expect(defaultGradient.keys).toEqual([0.0, 0.25, 0.5, 0.75, 1.0]);
  });
});

describe('colorDefaultGradient', () => {
  it('should apply default gradient to a fabric object', () => {
    const canvasObj = new fabric.Object({});
    colorDefaultGradient(canvasObj, 0, 100);

    const gradient = canvasObj.get('fill') as fabric.Gradient;
    expect(gradient.type).toBe('linear');
    expect(gradient.coords).toEqual({ x1: 0, y1: 0, x2: 100, y2: 0 });

    const expectedColorStops = [
      { offset: 0.0, color: 'rgb(255,64,64)' },
      { offset: 0.25, color: 'rgb(255,255,64)' },
      { offset: 0.5, color: 'rgb(64,255,64)' },
      { offset: 0.75, color: 'rgb(64,255,255)' },
      { offset: 1.0, color: 'rgb(64,64,255)' },
    ];

    expect(gradient.colorStops).toEqual(expectedColorStops);
  });
});

describe('ncbiBlastGradient', () => {
  it('should have expected NCBI Blast gradient color values', () => {
    expect(ncbiBlastGradient[0]).toEqual([0, 0, 0]);
    expect(ncbiBlastGradient[40]).toEqual([0, 32, 233]);
    expect(ncbiBlastGradient[50]).toEqual([117, 234, 76]);
    expect(ncbiBlastGradient[80]).toEqual([219, 61, 233]);
    expect(ncbiBlastGradient[200]).toEqual([219, 51, 36]);
  });

  it('should have expected keys', () => {
    expect(ncbiBlastGradient.keys).toEqual([0, 40, 50, 80, 200]);
  });
});

describe('colorNcbiBlastGradient', () => {
  it('should apply NCBI Blast gradient to a fabric object', () => {
    const canvasObj = new fabric.Object({});
    colorNcbiBlastGradient(canvasObj, 0, 100);

    const gradient = canvasObj.get('fill') as fabric.Gradient;
    expect(gradient.type).toBe('linear');
    expect(gradient.coords).toEqual({ x1: 0, y1: 0, x2: 100, y2: 0 });

    const expectedColorStops = [
      { offset: 0.0, color: 'rgb(0,0,0)' },
      { offset: 0.199999, color: 'rgb(0,0,0)' },
      { offset: 0.2, color: 'rgb(0,32,233)' },
      { offset: 0.399999, color: 'rgb(0,32,233)' },
      { offset: 0.4, color: 'rgb(117,234,76)' },
      { offset: 0.599999, color: 'rgb(117,234,76)' },
      { offset: 0.6, color: 'rgb(219,61,233)' },
      { offset: 0.799999, color: 'rgb(219,61,233)' },
      { offset: 0.8, color: 'rgb(219,51,36)' },
      { offset: 1.0, color: 'rgb(219,51,36)' },
    ];

    expect(gradient.colorStops).toEqual(expectedColorStops);
  });
});

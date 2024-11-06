import { numberToString, countDecimals, ObjectCache, BasicCanvasRenderer } from '../src/other-utilities';
import { fabric } from 'fabric';

describe('ObjectCache', () => {
  let cache: ObjectCache<number>;

  beforeEach(() => {
    cache = new ObjectCache<number>();
  });

  test('should return undefined for non-existent key', () => {
    expect(cache.get('nonexistent')).toBeUndefined();
  });

  test('should store and retrieve a value', () => {
    cache.put('key1', 100);
    expect(cache.get('key1')).toBe(100);
  });

  test('should not overwrite existing value for a key', () => {
    cache.put('key1', 100);
    cache.put('key1', 200);
    expect(cache.get('key1')).toBe(100); // Should remain 100, not overwritten
  });

  test('should delete a value', () => {
    cache.put('key1', 100);
    cache.delete('key1');
    expect(cache.get('key1')).toBeUndefined();
  });

  test('should handle deleting a non-existent key gracefully', () => {
    expect(() => cache.delete('nonexistent')).not.toThrow();
  });
});

// Mock the fabric.Canvas and fabric.StaticCanvas classes
jest.mock('fabric', () => ({
  Canvas: jest.fn().mockImplementation(() => ({
    setWidth: jest.fn(),
    setHeight: jest.fn(),
    renderAll: jest.fn(),
  })),
  StaticCanvas: jest.fn().mockImplementation(() => ({
    setWidth: jest.fn(),
    setHeight: jest.fn(),
    renderAll: jest.fn(),
  })),
}));

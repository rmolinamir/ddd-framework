import { describe, expect, test } from 'vitest';
import { applyOverrides } from '../apply-overrides';

describe('applyOverrides', () => {
  test('should apply overrides', () => {
    const objA = { a: 1, b: 2 };
    const objB = { b: 3, c: 4 };

    const objC = applyOverrides(objA, objB);

    expect(objC).toEqual({ a: 1, b: 3, c: 4 });
  });
});

import { describe, expect, test } from 'vitest';
import { timeout } from '../timeout';

describe('timeout', () => {
  test('should wait for over 3 seconds', async () => {
    const start = Date.now();
    await timeout(3000);
    const end = Date.now();
    expect(end - start).toBeGreaterThanOrEqual(3000);
  });
});

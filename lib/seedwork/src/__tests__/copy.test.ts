import fs from 'fs-extra';
import path from 'path';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import {
  enquireNoToEverything,
  enquireRandomAnswers,
  enquireYesToEverything
} from './mocks';

describe('copy', () => {
  describe('copies everything', () => {
    beforeEach(() => {
      enquireYesToEverything();
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    test('copies', async () => {
      const outputDirectory = path.resolve(__dirname, 'tmp');

      fs.emptyDir(outputDirectory);

      const { copy } = await import('../copy');

      await expect(copy(outputDirectory)).resolves.not.toThrow();
    }, 30000);
  });

  describe('copies', () => {
    beforeEach(() => {
      enquireRandomAnswers();
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    test('copies', async () => {
      const outputDirectory = path.resolve(__dirname, 'tmp');

      fs.emptyDir(outputDirectory);

      const { copy } = await import('../copy');

      await expect(copy(outputDirectory)).resolves.not.toThrow();
    }, 30000);
  });

  describe('copies nothing', () => {
    beforeEach(() => {
      enquireNoToEverything();
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    test('copies', async () => {
      const outputDirectory = path.resolve(__dirname, 'tmp');

      fs.emptyDir(outputDirectory);

      const { copy } = await import('../copy');

      await expect(copy(outputDirectory)).resolves.not.toThrow();
    }, 30000);
  });

  describe('gracefully exists if output directory does not exist', () => {
    test('copies', async () => {
      const outputDirectory = path.resolve(__dirname, Date.now().toString());

      const { copy } = await import('../copy');

      await expect(copy(outputDirectory)).resolves.not.toThrow();
    }, 30000);
  });
});

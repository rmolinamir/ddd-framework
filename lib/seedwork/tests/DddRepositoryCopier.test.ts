import fs from 'fs-extra';
import path from 'path';

import enquireNoToEverything from './mocks/enquireNoToEverything';
import enquireRandomAnswers from './mocks/enquireRandomAnswers';
import enquireYesToEverything from './mocks/enquireYesToEverything';

describe('DddRepositoryCopier', () => {
  describe('copies everything', () => {
    beforeEach(() => {
      enquireYesToEverything();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test('copies', async () => {
      const outputDirectory = path.resolve(__dirname, 'tmp');

      fs.emptyDir(outputDirectory);

      const { DddRepositoryCopier } = await import(
        '../src/DddRepositoryCopier'
      );

      await expect(
        DddRepositoryCopier.copy(outputDirectory)
      ).resolves.not.toThrow();
    }, 30000);
  });

  describe('copies', () => {
    beforeEach(() => {
      enquireRandomAnswers();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test('copies', async () => {
      const outputDirectory = path.resolve(__dirname, 'tmp');

      fs.emptyDir(outputDirectory);

      const { DddRepositoryCopier } = await import(
        '../src/DddRepositoryCopier'
      );

      await expect(
        DddRepositoryCopier.copy(outputDirectory)
      ).resolves.not.toThrow();
    }, 30000);
  });

  describe('copies nothing', () => {
    beforeEach(() => {
      enquireNoToEverything();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test('copies', async () => {
      const outputDirectory = path.resolve(__dirname, 'tmp');

      fs.emptyDir(outputDirectory);

      const { DddRepositoryCopier } = await import(
        '../src/DddRepositoryCopier'
      );

      await expect(
        DddRepositoryCopier.copy(outputDirectory)
      ).resolves.not.toThrow();
    }, 30000);
  });

  describe('gracefully exists if output directory does not exist', () => {
    test('copies', async () => {
      const outputDirectory = path.resolve(__dirname, Date.now().toString());

      const { DddRepositoryCopier } = await import(
        '../src/DddRepositoryCopier'
      );

      await expect(
        DddRepositoryCopier.copy(outputDirectory)
      ).resolves.not.toThrow();
    }, 30000);
  });
});

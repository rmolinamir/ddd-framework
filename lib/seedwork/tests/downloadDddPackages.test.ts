import fs from 'fs-extra';
import path from 'path';

describe('downloadDddPackages', () => {
  test('downloads the repository and ignores blacklisted packages', async () => {
    const outputDirectory = path.resolve(__dirname, 'tmp');

    fs.emptyDir(outputDirectory);

    const { details: DddRepositoryRegistry } = await import('../src/constants');
    const { default: downloadDddPackages } = await import(
      '../src/helpers/downloadDddPackages'
    );

    const dddPackages = await downloadDddPackages(true);

    expect(dddPackages).not.toHaveLength(0);

    for (const { dirent } of dddPackages) {
      expect(dirent).not.toBe('seedwork');
      expect(DddRepositoryRegistry).not.toContain(dirent);
    }
  }, 30000);
});

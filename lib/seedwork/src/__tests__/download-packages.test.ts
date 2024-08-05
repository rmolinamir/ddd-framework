import fs from 'fs-extra';
import path from 'path';
import { describe, expect, test } from 'vitest';

describe('downloadPackages', () => {
  test('downloads the repository and ignores blacklisted packages', async () => {
    const outputDirectory = path.resolve(__dirname, 'tmp');

    fs.emptyDir(outputDirectory);

    const { repository } = await import('../constants');
    const { downloadPackages } = await import('../functions');

    const packages = await downloadPackages(
      repository.author,
      repository.name,
      repository.versions[0]
    );

    expect(packages).not.toHaveLength(0);

    for (const { dirent } of packages) expect(dirent.name).not.toBe('seedwork');
  }, 30000);
});

import assert from 'assert';
import fs from 'fs-extra';
import path from 'path';

import { ignoredDirectories } from '../constants';
import { findAndReplaceImportStatements } from '../helpers';
import { Package } from '../types';

/**
 * Copies the given package to the output directory.
 */
export async function copyPackage(
  pckg: Package,
  outDir: string
): Promise<void> {
  assert(
    pckg.packageJson.name,
    `DDD framework package ${pckg.dirent.name} has an invalid package.json file, please contact the maintainer(s).`
  );

  const packageTmpDir = path.join(pckg.tmpDir, 'src');

  await findAndReplaceImportStatements(pckg.tmpDir, packageTmpDir);

  const packageOutDir = path.join(outDir, pckg.dirent.name);

  await fs.copy(packageTmpDir, packageOutDir, {
    overwrite: true,
    // Filters out ignored directories:
    filter: (src) => {
      if (fs.lstatSync(src).isDirectory()) {
        const basename = path.basename(src);
        return ignoredDirectories.some((d) => basename.match(d) === null);
      } else return true;
    }
  });

  await fs.remove(pckg.tmpDir);
}

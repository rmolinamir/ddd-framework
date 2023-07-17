import degit from 'degit';
import fs from 'fs-extra';
import path from 'path';

import { getTmpDir, ignoredPackages } from '../constants';
import { Package, PackageJson, Version } from '../types';

/**
 * Downloads the given package from npm.
 */
export async function downloadPackages(
  author: string,
  name: string,
  version: Version,
  verbose = false
): Promise<Package[]> {
  const tmpDir = getTmpDir();

  await fs.emptyDir(tmpDir);

  const emitter = degit(`${author}/${name}#${version.branch}`, {
    cache: false,
    force: true,
    verbose: true
  });

  const promise = new Promise<void>((resolve, reject) => {
    if (verbose) {
      emitter.on('info', console.info);
      emitter.on('warn', console.warn);
    }

    emitter
      .clone(tmpDir)
      .then(() => {
        resolve();
      })
      .catch((err) => reject(err));
  });

  await promise;

  const libDir = path.resolve(tmpDir, 'lib');

  const dirents = (await fs.readdir(libDir, { withFileTypes: true })).filter(
    (dirent) => dirent.isDirectory() && !ignoredPackages.includes(dirent.name)
  );

  const packages: Package[] = dirents.map((dirent) => {
    const direntDir = path.join(libDir, dirent.name);

    const packageJson = JSON.parse(
      fs.readFileSync(path.join(direntDir, 'package.json'), 'utf-8')
    ) as PackageJson;

    return {
      dirent,
      packageJson,
      tmpDir: direntDir
    };
  });

  return packages;
}

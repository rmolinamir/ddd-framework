import degit from 'degit';
import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import { DddPackage } from '../types/DddPackage';
import { DddRepositoryRegistry } from '../DddRepositoryRegistry';
import { PackageJson } from '../types/PackageJson';

const { author, name, blacklistedPackages } = DddRepositoryRegistry;

export default async function downloadDddPackages(
  verbose = false
): Promise<DddPackage[]> {
  const tmpDir = path.join(os.tmpdir(), '@ddd-framework/core');

  await fs.emptyDir(tmpDir);

  const emitter = degit(`${author}/${name}`, {
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
    (dirent) =>
      dirent.isDirectory() && !blacklistedPackages.includes(dirent.name)
  );

  const dddPackages: DddPackage[] = dirents.map((dirent) => {
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

  return dddPackages;
}

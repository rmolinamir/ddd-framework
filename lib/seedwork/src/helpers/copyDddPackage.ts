import assert from 'assert';
import fs from 'fs-extra';
import path from 'path';
import { DddPackage } from '../types/DddPackage';

async function findAndReplaceImportStatements(
  rootDir: string,
  importDir: string
): Promise<void> {
  for (const dirent of await fs.readdir(rootDir, {
    withFileTypes: true
  })) {
    const direntDir = path.join(rootDir, dirent.name);

    if (dirent.isDirectory())
      await findAndReplaceImportStatements(direntDir, importDir);
    else {
      const file = await fs.readFile(direntDir, 'utf-8');

      const relativeImportDir = path.join(path.relative(direntDir, importDir));

      const newFile = file.replace(
        /from((\s|\n)*)'(@ddd-framework)\//gm,
        `from '${relativeImportDir}/`
      );

      await fs.writeFile(direntDir, newFile, 'utf-8');
    }
  }
}

export default async function copyDddPackage(
  dddPackage: DddPackage,
  outputDir: string
): Promise<void> {
  assert(
    dddPackage.packageJson.name,
    `DDD framework package ${dddPackage.dirent.name} has an invalid package.json file, please contact the maintainer(s).`
  );

  const dddPackageSrcDir = path.join(dddPackage.tmpDir, 'src');

  await findAndReplaceImportStatements(dddPackage.tmpDir, dddPackageSrcDir);

  const dddPackageOutputDir = path.join(outputDir, dddPackage.dirent.name);

  return fs.copy(dddPackageSrcDir, dddPackageOutputDir, {
    overwrite: true
  });
}

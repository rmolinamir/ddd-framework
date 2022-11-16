import fs from 'fs-extra';
import copyDddPackage from './helpers/copyDddPackage';
import downloadDddPackages from './helpers/downloadDddPackages';
import getDddPackagesTmpDir from './helpers/getDddPackagesTmpDir';
import selectDddPackagesToCopy from './helpers/selectDddPackagesToCopy';
import shouldContinueIfDddDependenciesAreNotInstalled from './helpers/shouldContinueIfDddDependenciesAreNotInstalled';
import shouldContinueIfOutputDirIsNotEmpty from './helpers/shouldContinueIfOutputDirIsNotEmpty';

export class DddRepositoryCopier {
  private constructor() {}

  public static async copy(outputDir: string): Promise<void> {
    if (!fs.existsSync(outputDir)) {
      console.warn(`Could not find output directory: ${outputDir}`);
      return;
    }

    if (!(await shouldContinueIfOutputDirIsNotEmpty(outputDir))) return;

    const tmpDir = getDddPackagesTmpDir();

    await fs.emptyDir(tmpDir);

    const dddPackages = await downloadDddPackages();

    if (!(await shouldContinueIfDddDependenciesAreNotInstalled(dddPackages)))
      return;

    const selectedDddPackages = await selectDddPackagesToCopy(dddPackages);

    await Promise.all(
      selectedDddPackages.map(async (dddPackage) => {
        return copyDddPackage(dddPackage, outputDir);
      })
    );
  }
}

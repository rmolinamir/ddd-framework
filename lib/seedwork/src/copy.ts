import fs from 'fs-extra';

import { repository } from './constants';
import {
  continueIfDepsAreNotInstalled,
  continueIfOutDirIsNotEmpty,
  copyPackage,
  downloadPackages,
  selectPackagesToCopy,
  selectVersionToCopy
} from './functions';

/**
 * Copies the selected version of the @ddd-framework to the given output directory.
 * @returns true if the copy was successful, false otherwise.
 */
export async function copy(outputDir: string): Promise<boolean> {
  if (!fs.existsSync(outputDir)) {
    console.warn(`Could not find output directory: ${outputDir}`);
    return false;
  }

  if (!(await continueIfOutDirIsNotEmpty(outputDir))) return false;

  const version = await selectVersionToCopy();

  if (!version) return false;

  const dddPackages = await downloadPackages(
    repository.author,
    repository.name,
    version
  );

  if (!(await continueIfDepsAreNotInstalled(dddPackages))) return false;

  const selectedDddPackages = await selectPackagesToCopy(dddPackages);

  await Promise.all(
    selectedDddPackages.map(async (dddPackage) => {
      return copyPackage(dddPackage, outputDir);
    })
  );

  return true;
}

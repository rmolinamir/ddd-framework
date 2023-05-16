import { prompt } from 'enquirer';

import { DddPackage } from '../types/DddPackage';

export default async function selectDddPackagesToCopy(
  dddPackages: DddPackage[]
): Promise<DddPackage[]> {
  const { response: selectedPackageNames } = await prompt<{
    response: string[];
  }>({
    type: 'multiselect',
    name: 'response',
    message:
      'Select which packages to include in the seedwork (any @ddd-framework dependency will also be installed):',
    choices: dddPackages.map(({ dirent, packageJson }) => {
      return { name: dirent.name, message: packageJson.name || dirent.name };
    }),
    validate(answer) {
      if (answer.length) return true;
      else return 'Please select at least one option.';
    }
  });

  const selectedPackagesByDirentName = dddPackages.reduce<{
    [direntName: string]: DddPackage;
  }>((selected, dddPackage) => {
    if (selectedPackageNames.includes(dddPackage.dirent.name))
      selected[dddPackage.dirent.name] = dddPackage;

    return selected;
  }, {});

  // Checking for framework dependencies of the selected @ddd-framework packages:
  Object.values(selectedPackagesByDirentName).forEach((dddPackage) => {
    const dependencies = Object.keys(dddPackage.packageJson.dependencies || {})
      .concat(Object.keys(dddPackage.packageJson.peerDependencies || {}))
      .concat(Object.keys(dddPackage.packageJson.devDependencies || {}));

    for (const dep of dependencies) {
      const dddPackageDependency = dddPackages.find(
        (d) => d.packageJson.name === dep
      );
      if (dddPackageDependency)
        selectedPackagesByDirentName[dddPackageDependency.dirent.name] =
          dddPackageDependency;
    }
  });

  return Object.values(selectedPackagesByDirentName);
}

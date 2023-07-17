import { promptToSelect } from '../helpers';
import { Package } from '../types';

/**
 * Prompts the user to select which packages to include in the seedwork.
 */
export async function selectPackagesToCopy(
  packages: Package[]
): Promise<Package[]> {
  const selectedPackages = await promptToSelect(
    'multiselect',
    'Select which packages to include in the seedwork (any @ddd-framework dependency will also be installed):',
    packages.map(({ dirent, packageJson }) => {
      return { name: dirent.name, message: packageJson.name || dirent.name };
    })
  );

  const selectedPackagesMap = packages.reduce<{
    [direntName: string]: Package;
  }>((selected, dddPackage) => {
    if (selectedPackages.includes(dddPackage.dirent.name))
      selected[dddPackage.dirent.name] = dddPackage;

    return selected;
  }, {});

  // Checking for framework dependencies of the selected @ddd-framework packages:
  Object.values(selectedPackagesMap).forEach((pckge) => {
    const deps = Object.keys(pckge.packageJson.dependencies || {})
      .concat(Object.keys(pckge.packageJson.peerDependencies || {}))
      .concat(Object.keys(pckge.packageJson.devDependencies || {}));

    for (const dep of deps) {
      const selectedPackage = packages.find((d) => d.packageJson.name === dep);

      if (selectedPackage)
        selectedPackagesMap[selectedPackage.dirent.name] = selectedPackage;
    }
  });

  return Object.values(selectedPackagesMap);
}

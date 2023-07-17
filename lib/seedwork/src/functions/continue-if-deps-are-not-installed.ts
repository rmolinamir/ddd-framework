import checkDependencies from 'check-dependencies';

import { ignoredDeps } from '../constants';
import { promptToConfirm } from '../helpers/prompt-to-confirm';
import { Package } from '../types/package';

const checkDependenciesLogRegExp = /^(.*):\sinstalled:.*\sexpected:.*$/;

/**
 * Checks if the dependencies of the given packages are installed and prompts the user to continue if they are not.
 */
export async function continueIfDepsAreNotInstalled(
  packages: Package[]
): Promise<boolean> {
  const deps = Array.from(
    packages.reduce<Set<string>>((deps, { packageJson }) => {
      Object.keys(packageJson.dependencies || {}).forEach((d) => deps.add(d));

      Object.keys(packageJson.devDependencies || {}).forEach((d) =>
        deps.add(d)
      );

      Object.keys(packageJson.peerDependencies || {}).forEach((d) =>
        deps.add(d)
      );

      return deps;
    }, new Set())
  ).filter((d) => !ignoredDeps.includes(d));

  const { log } = await checkDependencies({
    packageManager: 'npm'
  });

  const installedDeps = log.reduce<{ [dependency: string]: true }>(
    (deps, l) => {
      const matches = l.match(checkDependenciesLogRegExp);

      if (matches) deps[matches[1]] = true;

      return deps;
    },
    {}
  );

  const missingDeps = deps.reduce<string[]>((deps, d) => {
    if (!(d in installedDeps)) deps.push(d);
    return deps;
  }, []);

  if (missingDeps.length) {
    return promptToConfirm(
      missingDeps.length > 1
        ? `These dependencies are not installed but are required by the seedwork: ${missingDeps.join(
            ', '
          )}. Would you like to continue without them?`
        : `Dependency ${missingDeps[0]} is not installed but is required by the seedwork. Would you like to continue without it?`
    );
  }

  return true;
}

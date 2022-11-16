import checkDependencies from 'check-dependencies';
import { prompt } from 'enquirer';
import { DddPackage } from '../types/DddPackage';

const unnecessaryDependencies = [
  '@ddd-framework/core',
  '@ddd-framework/cqrs',
  '@ddd-framework/event-sourcing',
  '@faker-js/faker',
  '@types/jest',
  'jest',
  'ts-jest',
  'typescript'
];

const checkDependenciesLogRegExp = /^(.*):\sinstalled:.*\sexpected:.*$/;

export default async function shouldContinueIfDddDependenciesAreNotInstalled(
  dddPackages: DddPackage[]
): Promise<boolean> {
  const dddDependencies = Array.from(
    dddPackages.reduce<Set<string>>((deps, { packageJson }) => {
      Object.keys(packageJson.dependencies || {}).forEach((d) => deps.add(d));

      Object.keys(packageJson.devDependencies || {}).forEach((d) =>
        deps.add(d)
      );

      Object.keys(packageJson.peerDependencies || {}).forEach((d) =>
        deps.add(d)
      );

      return deps;
    }, new Set())
  ).filter((d) => !unnecessaryDependencies.includes(d));

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

  const missingDddDependencies = dddDependencies.reduce<string[]>((deps, d) => {
    if (!(d in installedDeps)) deps.push(d);
    return deps;
  }, []);

  if (missingDddDependencies.length) {
    const { response } = await prompt<{ response: boolean }>({
      type: 'confirm',
      name: 'response',
      message:
        missingDddDependencies.length > 1
          ? `These dependencies are not installed but are required by the seedwork: ${missingDddDependencies.join(
              ', '
            )}. Would you like to continue without them?`
          : `Dependency ${missingDddDependencies[0]} is not installed but is required by the seedwork. Would you like to continue without it?`
    });

    return response;
  }

  return true;
}

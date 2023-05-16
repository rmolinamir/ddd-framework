export const details = {
  author: 'rmolinamir' as const,
  name: 'ddd-framework' as const
};

export const ignoredPackages = ['seedwork'];

export const ignoredDirectories = [/^__(.*?)__$/im];

export const ignoredDependencies = [
  '@config/eslint',
  '@config/jest',
  '@config/tsconfig',
  '@ddd-framework/core',
  '@ddd-framework/cqrs',
  '@ddd-framework/event-sourcing',
  '@faker-js/faker',
  '@types/jest',
  'jest',
  'ts-jest',
  'typescript'
];

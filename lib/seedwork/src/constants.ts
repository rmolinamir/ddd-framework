import os from 'os';
import path from 'path';
import { Repository } from './types';

export const repository: Repository = {
  author: 'rmolinamir',
  name: 'ddd-framework',
  versions: [
    {
      name: 'v1',
      branch: 'main'
    },
    {
      name: 'v0',
      branch: 'v0'
    }
  ]
};

export const getTmpDir = () =>
  path.join(os.tmpdir(), Date.now().toString(), '@ddd-framework');

export const ignoredPackages = ['seedwork'];

export const ignoredDirectories = [/^__(.*?)__$/im];

export const ignoredDeps = [
  '@config/eslint',
  '@config/jest',
  '@config/release-it',
  '@config/tsconfig',
  '@ddd-framework/collections',
  '@ddd-framework/core',
  '@ddd-framework/cqrs',
  '@ddd-framework/dto',
  '@ddd-framework/event-sourcing',
  '@ddd-framework/postgres',
  '@faker-js/faker',
  '@types/jest',
  'jest',
  'ts-jest',
  'tsx',
  'typescript',
  'vitest'
];

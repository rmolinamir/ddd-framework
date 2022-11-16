import type { Dirent } from 'fs';
import type { PackageJson } from './PackageJson';

export type DddPackage = {
  dirent: Dirent;
  packageJson: PackageJson;
  tmpDir: string;
};

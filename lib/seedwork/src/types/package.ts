import type { Dirent } from 'fs';

import type { PackageJson } from './package-json';

export type Package = {
  dirent: Dirent;
  packageJson: PackageJson;
  tmpDir: string;
};

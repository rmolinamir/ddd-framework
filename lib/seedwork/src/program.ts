import assert from 'assert';
import { Command } from 'commander';
import fs from 'fs-extra';
import path from 'path';

import { repository } from './constants';
import { copy } from './copy';
import { PackageJson } from './types';

const packageJson: PackageJson = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '..', 'package.json'), 'utf-8')
);

export const program = new Command();

const NAME = packageJson.name;
const DESCRIPTION = packageJson.description;
const VERSION = packageJson.version;

assert(
  NAME && DESCRIPTION && VERSION,
  `@ddd-framework/seedwork package has an invalid package.json file, please contact the maintainer(s).`
);

program.name(NAME).description(DESCRIPTION).version(VERSION);

program
  .argument('<outDir>', 'Output directory for the generated seedwork.')
  .action(async (arg: string) => {
    try {
      const outDir = path.resolve(arg);
      const res = await copy(outDir);
      if (res)
        console.info(
          `\n✔ Good luck using the seedwork. If there any issues, please report them at: 🔗 https://github.com/${repository.author}/${repository.name}/issues`
        );
      else
        console.info(
          `\nIf there were any issues, please report them at: 🔗 https://github.com/${repository.author}/${repository.name}/issues`
        );
    } catch (err) {
      console.error((err as Error).message);
    }
  });

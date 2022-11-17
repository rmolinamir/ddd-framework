import assert from 'assert';
import { Command } from 'commander';
import path from 'path';
import fs from 'fs-extra';
import { DddRepositoryCopier } from './DddRepositoryCopier';
import { PackageJson } from './types';
import { DddRepositoryRegistry } from './DddRepositoryRegistry';

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
  .argument('<outputDirectory>', 'Output directory for the generated seedwork.')
  .action(async (arg: string) => {
    try {
      const outputDirectory = path.resolve(arg);
      const copied = await DddRepositoryCopier.copy(outputDirectory);
      if (copied)
        console.info(
          `\n✔ Good luck using the seedwork. If there any issues, please report them at: 🔗 https://github.com/${DddRepositoryRegistry.author}/${DddRepositoryRegistry.name}/issues`
        );
      else
        console.info(
          `\nIf there were any issues, please report them at: 🔗 https://github.com/${DddRepositoryRegistry.author}/${DddRepositoryRegistry.name}/issues`
        );
    } catch (err) {
      console.error((err as Error).message);
    }
  });

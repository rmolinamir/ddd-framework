import fs from 'fs-extra';
import path from 'path';

/**
 * Finds and replaces import statements in the given directory.
 */
export async function findAndReplaceImportStatements(
  rootDir: string,
  importDir: string
): Promise<void> {
  for (const dirent of await fs.readdir(rootDir, {
    withFileTypes: true
  })) {
    const direntDir = path.join(rootDir, dirent.name);

    if (dirent.isDirectory())
      await findAndReplaceImportStatements(direntDir, importDir);
    else {
      const file = await fs.readFile(direntDir, 'utf-8');

      const relativeImportDir = path.join(path.relative(direntDir, importDir));

      const newFile = file.replace(
        /from((\s|\n)*)'(@ddd-framework)\//gm,
        `from '${relativeImportDir}/`
      );

      await fs.writeFile(direntDir, newFile, 'utf-8');
    }
  }
}

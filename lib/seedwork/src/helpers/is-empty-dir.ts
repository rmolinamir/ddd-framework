import fs from 'fs-extra';

/**
 * Returns true if the given directory is empty.
 */
export async function isEmptyDir(dir: string): Promise<boolean> {
  return (await fs.readdir(dir)).length === 0;
}

import fs from 'fs-extra';

export default async function isEmptyDir(dir: string): Promise<boolean> {
  return (await fs.readdir(dir)).length === 0;
}

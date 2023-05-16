import { prompt } from 'enquirer';

import isEmptyDir from './isEmptyDir';

export default async function shouldContinueIfOutputDirIsNotEmpty(
  outputDir: string
): Promise<boolean> {
  const isOutputDirEmpty = await isEmptyDir(outputDir);

  if (!isOutputDirEmpty) {
    const { response } = await prompt<{ response: boolean }>({
      type: 'confirm',
      name: 'response',
      message: 'The output directory is not empty, would you like to continue?'
    });

    return response;
  }

  return true;
}

import { isEmptyDir } from '../helpers/is-empty-dir';
import { promptToConfirm } from '../helpers/prompt-to-confirm';

/**
 * Checks if the output directory is empty and prompts the user to continue if it is not.
 */
export async function continueIfOutDirIsNotEmpty(
  outDir: string
): Promise<boolean> {
  const isEmpty = await isEmptyDir(outDir);

  if (!isEmpty) {
    return promptToConfirm(
      'The output directory is not empty, would you like to continue?'
    );
  }

  return true;
}

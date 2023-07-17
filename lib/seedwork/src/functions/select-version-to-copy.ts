import { repository } from '../constants';
import { promptToSelect } from '../helpers';
import { Version } from '../types';

/**
 * Prompts the user to select which version of the @ddd-framework to copy.
 */
export async function selectVersionToCopy(): Promise<Version | undefined> {
  const name = await promptToSelect(
    'select',
    'Select which version of the @ddd-framework to copy:',
    repository.versions.map((version) => version.name)
  );

  return repository.versions.find((v) => v.name === name);
}

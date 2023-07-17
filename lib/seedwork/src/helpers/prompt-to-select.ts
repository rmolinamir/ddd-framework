import { prompt } from 'enquirer';

type Choice = { name: string; message?: string };

export function promptToSelect<Res extends string>(
  type: 'select',
  message: string,
  choices: string[] | Choice[]
): Promise<Res>;

export function promptToSelect<Res extends string[]>(
  type: 'multiselect',
  message: string,
  choices: string[] | Choice[]
): Promise<Res>;

/**
 * Prompts the user to select an option from the given choices.
 */
export async function promptToSelect(
  type: 'select' | 'multiselect',
  message: string,
  choices: string[] | Choice[]
) {
  if (type === 'select') {
    const { response } = await prompt<{
      response: string[];
    }>({
      type: 'select',
      name: 'response',
      message,
      choices,
      validate(answer) {
        if (answer.length) return true;
        else return 'Please select a valid option.';
      }
    });

    return response;
  } else if (type === 'multiselect') {
    const { response } = await prompt<{
      response: string[];
    }>({
      type: 'multiselect',
      name: 'response',
      message,
      choices,
      validate(answer) {
        if (answer.length) return true;
        else return 'Please select at least one option.';
      }
    });

    return response;
  } else {
    throw new Error(`Invalid type: ${type}`);
  }
}

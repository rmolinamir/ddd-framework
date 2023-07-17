import { prompt } from 'enquirer';

/**
 * Prompts the user to confirm the given message.
 */
export async function promptToConfirm(message: string): Promise<boolean> {
  const { response } = await prompt<{ response: boolean }>({
    type: 'confirm',
    name: 'response',
    message
  });

  return response;
}

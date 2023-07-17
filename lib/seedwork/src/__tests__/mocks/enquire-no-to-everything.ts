import { PromptAnswer, PromptOptions } from '../types/enquirer';

export function enquireNoToEverything() {
  jest.mock('enquirer', () => {
    return {
      prompt: (options: PromptOptions): PromptAnswer | jest.Mock => {
        if (options && options.type === 'confirm') {
          return { [options.name as PropertyKey]: false };
        } else if (options && options.type === 'select') {
          return {
            [options.name as PropertyKey]: ''
          };
        } else if (options && options.type === 'multiselect') {
          return {
            [options.name as PropertyKey]: []
          };
        }

        return jest.fn();
      }
    };
  });
}

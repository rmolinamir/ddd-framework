import { MockInstance, vi } from 'vitest';
import { PromptAnswer, PromptOptions } from '../types/enquirer';

export function enquireNoToEverything() {
  vi.mock('enquirer', () => {
    return {
      prompt: (options: PromptOptions): PromptAnswer | MockInstance => {
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

        return vi.fn();
      }
    };
  });
}

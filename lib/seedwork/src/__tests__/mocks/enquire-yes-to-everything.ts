import { MockInstance, vi } from 'vitest';
import { faker } from '@faker-js/faker';
import { PromptAnswer, PromptOptions } from '../types/enquirer';

export function enquireYesToEverything() {
  vi.mock('enquirer', () => {
    return {
      prompt: (options: PromptOptions): PromptAnswer | MockInstance => {
        if (options && options.type === 'confirm') {
          return { [options.name as PropertyKey]: true };
        } else if (options && options.type === 'select') {
          const answer = faker.helpers.arrayElement(
            options.choices.map((choice) =>
              typeof choice === 'string' ? choice : choice.value || choice.name
            )
          );
          return { [options.name as PropertyKey]: answer };
        } else if (options && options.type === 'multiselect') {
          return {
            [options.name as PropertyKey]: options.choices.map((choice) =>
              typeof choice === 'string' ? choice : choice.value || choice.name
            )
          };
        }

        return vi.fn();
      }
    };
  });
}

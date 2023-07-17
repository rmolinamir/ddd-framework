import { faker } from '@faker-js/faker';

import { PromptAnswer, PromptOptions } from '../types/enquirer';

export function enquireYesToEverything() {
  jest.mock('enquirer', () => {
    return {
      prompt: (options: PromptOptions): PromptAnswer | jest.Mock => {
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

        return jest.fn();
      }
    };
  });
}

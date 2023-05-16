import { faker } from '@faker-js/faker';

import { PromptAnswer, PromptOptions } from '../types/enquirer';

export default function enquireRandomAnswers() {
  jest.mock('enquirer', () => {
    return {
      prompt: (options: PromptOptions): PromptAnswer | jest.Mock => {
        if (options && options.type === 'confirm') {
          return { [options.name as PropertyKey]: faker.datatype.boolean() };
        } else if (options && options.type === 'multiselect') {
          const answers = faker.helpers.arrayElements(
            options.choices.map((choice) =>
              typeof choice === 'string' ? choice : choice.value || choice.name
            )
          );
          return { [options.name as PropertyKey]: answers };
        }

        return jest.fn();
      }
    };
  });
}

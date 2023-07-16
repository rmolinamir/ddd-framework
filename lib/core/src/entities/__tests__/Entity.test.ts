import { faker } from '@faker-js/faker';

import User, { UserId } from '../../../tests/User';

describe('Entity', () => {
  test('equals', () => {
    const idOne = faker.string.uuid();
    const idTwo = faker.string.uuid();

    const userOne = new User(new UserId(idOne));
    const userTwo = new User(new UserId(idOne));
    const userThree = new User(new UserId(idTwo));

    expect(userOne.equals(userTwo)).toBe(true);
    expect(userOne.equals(userThree)).toBe(false);
  });
});

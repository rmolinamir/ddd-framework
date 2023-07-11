import { faker } from '@faker-js/faker';

import EntityId from '../EntityId';

describe('EntityId', () => {
  class Order {
    @EntityId()
    public orderId: string;

    constructor(orderId: string) {
      this.orderId = orderId;
    }
  }

  test('getEntityIdOf', () => {
    const order = new Order(faker.string.uuid());

    const id = EntityId.getId(order);

    expect(id).toBe(order.orderId);
    expect(typeof id).toBe('string');
  });

  test('hasEntityId', () => {
    const order = new Order(faker.string.uuid());

    expect(EntityId.hasId(order)).toBe(true);
  });
});

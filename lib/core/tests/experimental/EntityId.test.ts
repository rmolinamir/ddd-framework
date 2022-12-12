import { faker } from '@faker-js/faker';
import EntityId, {
  getEntityIdOf,
  hasEntityId
} from '../../src/experimental/decorators/EntityId';

describe('EntityId', () => {
  class Order {
    @EntityId()
    public orderId: string;

    constructor(orderId: string) {
      this.orderId = orderId;
    }
  }

  test('getEntityIdOf', () => {
    const order = new Order(faker.datatype.uuid());

    const id = getEntityIdOf(order);

    expect(id).toBe(order.orderId);
    expect(typeof id).toBe('string');
  });

  test('hasEntityId', () => {
    const order = new Order(faker.datatype.uuid());

    expect(hasEntityId(order)).toBe(true);
  });
});

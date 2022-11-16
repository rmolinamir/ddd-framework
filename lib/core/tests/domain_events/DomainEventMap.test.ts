import { faker } from '@faker-js/faker';
import { DomainEvent, DomainEventMap } from '../../src';

describe('DomainEventMap', () => {
  test('is in DomainEventMap', async () => {
    @DomainEvent.Register('OrderCreated', faker.system.semver())
    class OrderCreated extends DomainEvent {}

    const MappedDomainEvent = DomainEventMap.get(
      OrderCreated.eventType,
      OrderCreated.eventVersion
    );

    expect(MappedDomainEvent).toBe(OrderCreated);
  });

  test('is NOT in DomainEventMap if disabled', async () => {
    @DomainEvent.Register('OrderCreated', faker.system.semver(), undefined)
    class OrderCreated extends DomainEvent {}

    const MappedDomainEvent = DomainEventMap.get(
      OrderCreated.eventType,
      OrderCreated.eventVersion
    );

    expect(MappedDomainEvent).toBe(OrderCreated);
  });
});

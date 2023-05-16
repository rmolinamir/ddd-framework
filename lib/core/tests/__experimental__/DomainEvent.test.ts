import { faker } from '@faker-js/faker';

import {
  DOMAIN_EVENT_METADATA,
  DOMAIN_EVENT_WATERMARK
} from '../../src/__experimental__/decorators/constants';
import {
  DomainEvent,
  getDomainEventMetadata,
  isDomainEvent
} from '../../src/__experimental__/decorators/domain_events';

const DOMAIN_EVENT_TYPE = 'order-cancelled';
const DOMAIN_EVENT_VERSION = faker.system.semver();

describe('DomainEvent', () => {
  @DomainEvent(DOMAIN_EVENT_TYPE, DOMAIN_EVENT_VERSION)
  class OrderCreated {
    constructor(public orderId: string) {}
  }

  test('reflection API', () => {
    expect(
      Reflect.hasMetadata(DOMAIN_EVENT_WATERMARK, OrderCreated)
    ).toBeTruthy();

    expect(
      Reflect.getMetadata(DOMAIN_EVENT_METADATA, OrderCreated)
    ).toBeTruthy();
  });

  test('getDomainEventMetadata', () => {
    const metadata = getDomainEventMetadata(OrderCreated);

    expect(metadata.type).toBe(metadata.type);
    expect(metadata.version).toBe(metadata.version);
  });

  test('isDomainEvent', () => {
    expect(isDomainEvent(OrderCreated)).toBe(true);
  });
});

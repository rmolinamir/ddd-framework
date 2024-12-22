import { describe, expect, test } from 'vitest';
import { faker } from '@faker-js/faker';
import { AggregateId } from '../../aggregates';
import { EntityId } from '../../entities';
import { DomainEvent } from '../domain-event';

describe('DomainEvent', () => {
  const eventType = faker.string.uuid();
  const eventVersion = faker.string.uuid();

  @DomainEvent(eventType, eventVersion)
  class TestEvent {
    @AggregateId()
    public cardId: string;

    @EntityId()
    public transactionId: string;

    public transactionValue: number;

    constructor(
      cardId: string,
      transactionId: string,
      transactionValue: number
    ) {
      this.cardId = cardId;
      this.transactionId = transactionId;
      this.transactionValue = transactionValue;
    }
  }

  test('isDomainEvent works as expected', () => {
    const event = new TestEvent(eventType, eventVersion, 100);

    expect(DomainEvent.isDomainEvent(TestEvent)).toBe(true);
    expect(DomainEvent.isDomainEvent(event)).toBe(true);
  });

  test('getMetadata works as expected', () => {
    const event = new TestEvent(eventType, eventVersion, 100);

    expect(DomainEvent.getMetadata(TestEvent)).toEqual({
      type: eventType,
      version: eventVersion
    });

    expect(DomainEvent.getMetadata(event)).toEqual({
      type: eventType,
      version: eventVersion
    });
  });

  describe('when there is no Aggregate or Entity ID', () => {
    test('should throw', () => {
      expect(() => {
        @DomainEvent(faker.string.uuid(), faker.system.semver())
        class TestEvent {
          public id: string;

          constructor(id: string) {
            this.id = id;
          }
        }

        return new TestEvent(faker.string.uuid());
      }).toThrow();
    });
  });
});

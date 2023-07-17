import { faker } from '@faker-js/faker';

import {
  GiftCardTransaction,
  ReimburseCardCommand
} from '../../../tests/gift-card';
import { AggregateId } from '../../aggregates';
import { DomainPrimitive } from '../../value-objects';
import { Entity } from '../entity';
import { EntityId } from '../entity-id';

describe('Entity', () => {
  test('equals works as expected', () => {
    const transactionId = faker.string.uuid();

    const transaction1 = new GiftCardTransaction(transactionId, 100);
    const transaction2 = new GiftCardTransaction(transactionId, 100);

    expect(transaction1.equals(transaction2)).toBe(true);
  });

  test('equals works as expected with DomainPrimitive', () => {
    class GiftCardTransactionId extends DomainPrimitive<string> {
      protected validate(): void {}
    }

    class GiftCardTransaction extends Entity {
      @EntityId()
      public transactionId!: GiftCardTransactionId;

      constructor(transactionId: GiftCardTransactionId) {
        super();
        this.transactionId = transactionId;
      }
    }

    const transactionId = new GiftCardTransactionId(faker.string.uuid());

    const transaction1 = new GiftCardTransaction(transactionId);
    const transaction2 = new GiftCardTransaction(transactionId);

    expect(transaction1.equals(transaction2)).toBe(true);
  });

  test('notEquals works as expected', () => {
    const transaction1 = new GiftCardTransaction(faker.string.uuid(), 100);
    const transaction2 = new GiftCardTransaction(faker.string.uuid(), 100);

    expect(transaction1.notEquals(transaction2)).toBe(true);
  });

  describe('raise', () => {
    test('events works as expected', () => {
      const transactionId = faker.string.uuid();

      const transaction = new GiftCardTransaction(transactionId, 100);

      transaction.handle(
        new ReimburseCardCommand(faker.string.uuid(), transactionId)
      );

      expect(transaction.events()).toHaveLength(1);
    });

    test('clearEvents works as expected', () => {
      const transactionId = faker.string.uuid();

      const transaction = new GiftCardTransaction(transactionId, 100);

      transaction.handle(
        new ReimburseCardCommand(faker.string.uuid(), transactionId)
      );

      expect(transaction.events()).toHaveLength(1);

      transaction.clearEvents();

      expect(transaction.events()).toHaveLength(0);
    });

    test('throws when raising an event without an aggregate identifier', () => {
      class TestEvent {
        public id: string;

        constructor(id: string) {
          this.id = id;
        }
      }

      class AnEntity extends Entity {
        @EntityId()
        public id: string;

        constructor(id: string) {
          super();
          this.id = id;
        }

        public doSomething() {
          this.raise(new TestEvent(faker.string.uuid()));
        }
      }

      const entity = new AnEntity(faker.string.uuid());

      expect(() => entity.doSomething()).toThrow();
    });
  });

  test('validate decorator', () => {
    const validator = jest.fn();

    class TestEvent {
      @AggregateId()
      public id: string;

      constructor(id: string) {
        this.id = id;
      }
    }

    class AnEntity extends Entity {
      @EntityId()
      public id: string;

      constructor(id: string) {
        super();
        this.id = id;
      }

      @Entity.Invariant()
      public doSomething() {
        this.raise(new TestEvent(faker.string.uuid()));
      }

      protected validateInvariants = validator;
    }

    const entity = new AnEntity(faker.string.uuid());

    entity.doSomething();

    expect(validator).toHaveBeenCalled();
  });
});

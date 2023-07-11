import { faker } from '@faker-js/faker';

import { IllegalStateException } from '../../../exceptions';
import { DomainPrimitive } from '../../../value_objects';
import AggregateId from '../AggregateId';
import Entity from '../Entity';
import EntityId from '../EntityId';

class GiftCardTransaction extends Entity {
  @EntityId()
  public transactionId: string;

  public transactionValue: number;

  public reimbursed = false;

  constructor(transactionId: string, transactionValue: number) {
    super();
    this.transactionId = transactionId;
    this.transactionValue = transactionValue;
  }

  public handle(cmd: ReimburseCardCommand) {
    if (this.reimbursed)
      throw new IllegalStateException('Transaction already reimbursed');

    this.reimbursed = true;

    this.raise(
      new CardReimbursedEvent(
        cmd.getCardId(),
        this.transactionId,
        this.transactionValue
      )
    );
  }
}

class ReimburseCardCommand {
  constructor(public cardId: string, public transactionId: string) {}

  public getCardId() {
    return this.cardId;
  }
}

class CardReimbursedEvent {
  @AggregateId()
  public cardId: string;

  @EntityId()
  public transactionId: string;

  public transactionValue: number;

  constructor(cardId: string, transactionId: string, transactionValue: number) {
    this.cardId = cardId;
    this.transactionId = transactionId;
    this.transactionValue = transactionValue;
  }
}

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

    // TODO: Should it throw?
    test('raising an event without an aggregate identifier throws', () => {
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

      expect(() => entity.doSomething()).not.toThrow();
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

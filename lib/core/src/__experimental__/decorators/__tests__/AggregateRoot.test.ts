import { faker } from '@faker-js/faker';

import { IllegalStateException } from '../../../exceptions';
import AggregateId from '../AggregateId';
import AggregateRoot from '../AggregateRoot';
import Entity from '../Entity';
import EntityId from '../EntityId';

class TransactCommand {
  constructor(public cardId: string, public transactionValue: number) {}
}

class TransactionEvent {
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

class ReimburseCardCommand {
  constructor(public cardId: string, public transactionId: string) {}
}

class CardReimbursedEvent {
  @AggregateId()
  public cardId: string;

  @EntityId()
  public transactionId: string;

  constructor(cardId: string, transactionId: string) {
    this.cardId = cardId;
    this.transactionId = transactionId;
  }
}

@AggregateRoot()
class GiftCard extends Entity {
  @AggregateId()
  public id: string;

  public remainingValue: number;

  public transactions: GiftCardTransaction[] = [];

  constructor(id: string, initialBalance: number) {
    super();
    this.id = id;
    this.remainingValue = initialBalance;
  }

  public handle(cmd: TransactCommand | ReimburseCardCommand) {
    if (cmd instanceof TransactCommand) {
      const transaction = new GiftCardTransaction(
        faker.string.uuid(),
        cmd.transactionValue
      );

      this.remainingValue -= transaction.transactionValue;

      this.transactions.push(transaction);

      this.validateInvariants();

      transaction.raise(
        new TransactionEvent(
          this.id,
          transaction.transactionId,
          transaction.transactionValue
        )
      );
    } else if (ReimburseCardCommand) {
      const transaction = this.transactions.find(
        (i) => i.transactionId === cmd.transactionId
      );

      if (transaction) {
        this.remainingValue += transaction.transactionValue;
        transaction.reimburse(this.id);
      }
    }
  }

  protected validateInvariants(): void {
    if (this.remainingValue < 0)
      throw new IllegalStateException('Gift card cannot be overdrawn');
  }
}

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

  public reimburse(cardId: string) {
    if (this.reimbursed)
      throw new IllegalStateException('Transaction already reimbursed');

    this.reimbursed = true;

    this.raise(new CardReimbursedEvent(cardId, this.transactionId));
  }
}

describe('AggregateRoot', () => {
  test('isRoot works as expected', () => {
    const card = new GiftCard(faker.string.uuid(), 100);

    expect(AggregateRoot.isRoot(GiftCard)).toBe(true);
    expect(AggregateRoot.isRoot(card)).toBe(true);
    expect(AggregateRoot.isRoot(GiftCardTransaction)).toBe(false);
  });

  describe('(AggregateRoot) Entity', () => {
    test('equals works as expected', () => {
      const cardId = faker.string.uuid();

      const card1 = new GiftCard(cardId, 100);
      const card2 = new GiftCard(cardId, 100);

      expect(card1.equals(card2)).toBe(true);
    });

    test('invariants', () => {
      const cardId = faker.string.uuid();

      const card = new GiftCard(cardId, 100);

      expect(() => card.handle(new TransactCommand(cardId, 150))).toThrow();
    });

    describe('raise', () => {
      test('root events works as expected', () => {
        const cardId = faker.string.uuid();

        const card = new GiftCard(cardId, 100);

        card.handle(new TransactCommand(cardId, 50));

        expect(card.events()).toHaveLength(1);
      });

      test('root clearEvents works as expected', () => {
        const cardId = faker.string.uuid();

        const card = new GiftCard(cardId, 100);

        card.handle(new TransactCommand(cardId, 50));

        expect(card.events()).toHaveLength(1);

        card.clearEvents();

        expect(card.events()).toHaveLength(0);
      });

      test('child entity events works as expected', () => {
        const cardId = faker.string.uuid();

        const card = new GiftCard(cardId, 100);

        // Add transaction #1:

        card.handle(new TransactCommand(cardId, 50));

        expect(card.events()).toHaveLength(1);
        expect(card.transactions[0].events()).toHaveLength(1);

        // Reimburse transaction #1:

        card.handle(
          new ReimburseCardCommand(card.id, card.transactions[0].transactionId)
        );

        expect(card.events()).toHaveLength(2);
        expect(card.transactions[0].events()).toHaveLength(2);

        // Add transaction #2:

        card.handle(new TransactCommand(cardId, 50));

        expect(card.events()).toHaveLength(3);
        expect(card.transactions[0].events()).toHaveLength(2);
        expect(card.transactions[1].events()).toHaveLength(1);

        // Reimburse transaction #2:

        card.handle(
          new ReimburseCardCommand(card.id, card.transactions[1].transactionId)
        );

        expect(card.events()).toHaveLength(4);
        expect(card.transactions[0].events()).toHaveLength(2);
        expect(card.transactions[1].events()).toHaveLength(2);
      });

      test('child entity clearEvents works as expected', () => {
        const cardId = faker.string.uuid();

        const card = new GiftCard(cardId, 100);

        // Add transaction #1:

        card.handle(new TransactCommand(cardId, 50));

        expect(card.events()).toHaveLength(1);
        expect(card.transactions[0].events()).toHaveLength(1);

        // Reimburse transaction #1:

        card.handle(
          new ReimburseCardCommand(card.id, card.transactions[0].transactionId)
        );

        expect(card.events()).toHaveLength(2);
        expect(card.transactions[0].events()).toHaveLength(2);

        // Add transaction #2:

        card.handle(new TransactCommand(cardId, 50));

        expect(card.events()).toHaveLength(3);
        expect(card.transactions[0].events()).toHaveLength(2);
        expect(card.transactions[1].events()).toHaveLength(1);

        // Reimburse transaction #2:

        card.handle(
          new ReimburseCardCommand(card.id, card.transactions[1].transactionId)
        );

        expect(card.events()).toHaveLength(4);
        expect(card.transactions[0].events()).toHaveLength(2);
        expect(card.transactions[1].events()).toHaveLength(2);

        // Clearing events:

        card.transactions[0].clearEvents();

        expect(card.events()).toHaveLength(2);
        expect(card.transactions[0].events()).toHaveLength(0);
        expect(card.transactions[1].events()).toHaveLength(2);
      });
    });
  });
});

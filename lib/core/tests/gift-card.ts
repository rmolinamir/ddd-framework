import { faker } from '@faker-js/faker';

import {
  AggregateId,
  AggregateRoot,
  Entity,
  EntityId,
  IllegalStateException
} from '../src';

export class TransactCommand {
  constructor(public cardId: string, public transactionValue: number) {}
}

export class TransactionEvent {
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

export class ReimburseCardCommand {
  constructor(public cardId: string, public transactionId: string) {}
}

export class CardReimbursedEvent {
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

export class GiftCardTransaction extends Entity {
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
        cmd.cardId,
        this.transactionId,
        this.transactionValue
      )
    );
  }
}

@AggregateRoot()
export class GiftCard extends Entity {
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
    } else if (cmd instanceof ReimburseCardCommand) {
      const transaction = this.transactions.find(
        (i) => i.transactionId === cmd.transactionId
      );

      if (transaction) {
        this.remainingValue += transaction.transactionValue;
        transaction.handle(cmd);
      }
    }
  }

  protected validateInvariants(): void {
    if (this.remainingValue < 0)
      throw new IllegalStateException('Gift card cannot be overdrawn');
  }
}

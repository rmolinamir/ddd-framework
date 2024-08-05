import { describe, expect, test } from 'vitest';
import { faker } from '@faker-js/faker';
import {
  GiftCard,
  GiftCardTransaction,
  ReimburseCardCommand,
  TransactCommand
} from '../../../tests/gift-card';
import { AggregateRoot } from '../aggregate-root';

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

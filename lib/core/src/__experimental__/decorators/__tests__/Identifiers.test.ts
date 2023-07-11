import { faker } from '@faker-js/faker';

import { DomainPrimitive } from '../../../value_objects';
import AggregateId from '../AggregateId';
import AggregateRoot from '../AggregateRoot';
import Entity from '../Entity';
import EntityId from '../EntityId';

@AggregateRoot()
class GiftCard extends Entity {
  @AggregateId()
  public id: string;

  public remainingValue: number;

  constructor(id: string, initialBalance: number) {
    super();
    this.id = id;
    this.remainingValue = initialBalance;
  }
}

describe('Identifiers', () => {
  describe('AggregateId', () => {
    test('the aggregate has a registered id metadata', () => {
      const card = new GiftCard(faker.string.uuid(), 100);

      expect(AggregateId.hasId(card)).toBe(true);
    });

    test('the aggregate id is retrievable', () => {
      const card = new GiftCard(faker.string.uuid(), 100);

      expect(card.id).toBeDefined();
      expect(AggregateId.getId(card)).toBe(card.id);
    });

    test('entity using DomainPrimitive as id works as expected', () => {
      class GiftCardId extends DomainPrimitive<string> {
        protected validate(): void {}
      }

      @AggregateRoot()
      class GiftCard extends Entity {
        @AggregateId()
        public id: GiftCardId;

        public remainingValue: number;

        constructor(id: GiftCardId, initialBalance: number) {
          super();
          this.id = id;
          this.remainingValue = initialBalance;
        }
      }

      const uuid = faker.string.uuid();
      const cardId = new GiftCardId(uuid);

      const card = new GiftCard(cardId, 100);

      expect(card).toBeInstanceOf(GiftCard);

      expect(AggregateId.hasId(card)).toBe(true);

      expect(card.id).toBeDefined();
      expect(AggregateId.getId(card)).toBe(card.id);

      expect(AggregateId.getId<GiftCardId>(card).equals(cardId)).toBe(true);
      expect(AggregateId.getId<GiftCardId>(card).unpack()).toBe(uuid);
    });

    describe('exceptions', () => {
      test('decorating a non-aggregate root entity with @AggregateId throws', () => {
        expect.assertions(1);

        try {
          class GiftCard extends Entity {
            @AggregateId()
            public id!: string;
          }

          // eslint-disable-next-line no-new
          new GiftCard();
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
        }
      });

      test('decorating two properties with @AggregateId throws', () => {
        expect.assertions(1);

        try {
          @AggregateRoot()
          class GiftCard extends Entity {
            @AggregateId()
            public id!: string;

            @AggregateId()
            public anotherId!: string;
          }

          // eslint-disable-next-line no-new
          new GiftCard();
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
        }
      });

      test('decorating the same property twice with @AggregateId does not throw', () => {
        expect.assertions(0);

        try {
          @AggregateRoot()
          class GiftCard extends Entity {
            @AggregateId()
            @AggregateId()
            public id!: string;
          }

          // eslint-disable-next-line no-new
          new GiftCard();
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
        }
      });
    });
  });

  describe('EntityId', () => {
    test('the entity has a registered id metadata', () => {
      const card = new GiftCard(faker.string.uuid(), 100);

      expect(EntityId.hasId(card)).toBe(true);

      expect(card.id).toBeDefined();
      expect(EntityId.getId(card)).toBe(card.id);
    });

    test('entity using DomainPrimitive as id works as expected', () => {
      class GiftCardId extends DomainPrimitive<string> {
        protected validate(): void {}
      }

      class GiftCard extends Entity {
        @EntityId()
        public id: GiftCardId;

        public remainingValue: number;

        constructor(id: GiftCardId, initialBalance: number) {
          super();
          this.id = id;
          this.remainingValue = initialBalance;
        }
      }

      const uuid = faker.string.uuid();
      const cardId = new GiftCardId(uuid);

      const card = new GiftCard(cardId, 100);

      expect(card).toBeInstanceOf(GiftCard);

      expect(EntityId.hasId(card)).toBe(true);

      expect(card.id).toBeDefined();
      expect(EntityId.getId(card)).toBe(card.id);

      expect(EntityId.getId<GiftCardId>(card).equals(cardId)).toBe(true);
      expect(EntityId.getId<GiftCardId>(card).unpack()).toBe(uuid);
    });
  });

  describe('AggregateId & EntityId', () => {
    test('the aggregate id is the same as the entity id', () => {
      const card = new GiftCard(faker.string.uuid(), 100);

      expect(AggregateId.getId(card)).toBe(card.id);
      expect(EntityId.getId(card)).toBe(card.id);
      expect(AggregateId.getId(card)).toBe(EntityId.getId(card));
    });

    test('decorating an aggregate root with @AggregateId and @EntityId throws', () => {
      expect.assertions(1);

      try {
        @AggregateRoot()
        class GiftCard extends Entity {
          @AggregateId()
          public id!: string;

          @EntityId()
          public anotherId!: string;
        }

        // eslint-disable-next-line no-new
        new GiftCard();
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });

    test('decorating an object with @AggregateId and @EntityId does not throw', () => {
      expect.assertions(0);

      try {
        class GiftCard {
          @AggregateId()
          public id!: string;

          @EntityId()
          public anotherId!: string;
        }

        // eslint-disable-next-line no-new
        new GiftCard();
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });
});

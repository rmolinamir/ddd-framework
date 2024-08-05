import { describe, expect, test } from 'vitest';
import { faker } from '@faker-js/faker';
import { AggregateId, AggregateRoot } from '../../aggregates';
import { DomainPrimitive } from '../../value-objects';
import { Entity } from '../entity';
import { EntityId } from '../entity-id';

@AggregateRoot()
class User extends Entity {
  @AggregateId()
  public id: string;

  constructor(id: string) {
    super();
    this.id = id;
  }
}

describe('Identifiers', () => {
  describe('AggregateId', () => {
    test('the aggregate has a registered id metadata', () => {
      const card = new User(faker.string.uuid());

      expect(AggregateId.hasId(card)).toBe(true);
    });

    test('the aggregate id is retrievable', () => {
      const card = new User(faker.string.uuid());

      expect(card.id).toBeDefined();
      expect(AggregateId.getId(card)).toBe(card.id);
    });

    test('entity using DomainPrimitive as id works as expected', () => {
      class UserId extends DomainPrimitive<string> {
        protected validate(): void {}
      }

      @AggregateRoot()
      class User extends Entity {
        @AggregateId()
        public id: UserId;

        constructor(id: UserId) {
          super();
          this.id = id;
        }
      }

      const uuid = faker.string.uuid();
      const userId = new UserId(uuid);

      const card = new User(userId);

      expect(card).toBeInstanceOf(User);

      expect(AggregateId.hasId(card)).toBe(true);

      expect(card.id).toBeDefined();
      expect(AggregateId.getId(card)).toBe(card.id);

      expect(AggregateId.getId<UserId>(card).equals(userId)).toBe(true);
      expect(AggregateId.getId<UserId>(card).unpack()).toBe(uuid);
    });

    describe('exceptions', () => {
      test('decorating a non-aggregate root entity with @AggregateId throws', () => {
        expect.assertions(1);

        try {
          class User extends Entity {
            @AggregateId()
            public id!: string;
          }

          // eslint-disable-next-line no-new
          new User();
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
        }
      });

      test('decorating two properties with @AggregateId throws', () => {
        expect.assertions(1);

        try {
          @AggregateRoot()
          class User extends Entity {
            @AggregateId()
            public id!: string;

            @AggregateId()
            public anotherId!: string;
          }

          // eslint-disable-next-line no-new
          new User();
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
        }
      });

      test('decorating the same property twice with @AggregateId does not throw', () => {
        expect.assertions(0);

        try {
          @AggregateRoot()
          class User extends Entity {
            @AggregateId()
            @AggregateId()
            public id!: string;
          }

          // eslint-disable-next-line no-new
          new User();
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
        }
      });
    });
  });

  describe('EntityId', () => {
    test('the entity has a registered id metadata', () => {
      const card = new User(faker.string.uuid());

      expect(EntityId.hasId(card)).toBe(true);

      expect(card.id).toBeDefined();
      expect(EntityId.getId(card)).toBe(card.id);
    });

    test('entity using DomainPrimitive as id works as expected', () => {
      class UserId extends DomainPrimitive<string> {
        protected validate(): void {}
      }

      class User extends Entity {
        @EntityId()
        public id: UserId;

        constructor(id: UserId) {
          super();
          this.id = id;
        }
      }

      const uuid = faker.string.uuid();
      const userId = new UserId(uuid);

      const card = new User(userId);

      expect(card).toBeInstanceOf(User);

      expect(EntityId.hasId(card)).toBe(true);

      expect(card.id).toBeDefined();
      expect(EntityId.getId(card)).toBe(card.id);

      expect(EntityId.getId<UserId>(card).equals(userId)).toBe(true);
      expect(EntityId.getId<UserId>(card).unpack()).toBe(uuid);
    });
  });

  describe('AggregateId & EntityId', () => {
    test('the aggregate id is the same as the entity id', () => {
      const card = new User(faker.string.uuid());

      expect(AggregateId.getId(card)).toBe(card.id);
      expect(EntityId.getId(card)).toBe(card.id);
      expect(AggregateId.getId(card)).toBe(EntityId.getId(card));
    });

    test('decorating an aggregate root with @AggregateId and @EntityId throws', () => {
      expect.assertions(1);

      try {
        @AggregateRoot()
        class User extends Entity {
          @AggregateId()
          public id!: string;

          @EntityId()
          public anotherId!: string;
        }

        // eslint-disable-next-line no-new
        new User();
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });

    test('decorating an object with @AggregateId and @EntityId does not throw', () => {
      expect.assertions(0);

      try {
        class User {
          @AggregateId()
          public id!: string;

          @EntityId()
          public anotherId!: string;
        }

        // eslint-disable-next-line no-new
        new User();
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });
});

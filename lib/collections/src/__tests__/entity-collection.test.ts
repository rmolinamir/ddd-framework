import { describe, expect, test } from 'vitest';
import { faker } from '@faker-js/faker';
import { User, UserId } from '../../tests/user';
import { EntityCollection } from '../entity-collection';

describe('EntityCollection', () => {
  const user = new User(new UserId(faker.string.uuid()));
  const userTwo = new User(new UserId(faker.string.uuid()));

  test('count', () => {
    const collection = new EntityCollection<User>();

    expect(collection.add(user).contains(user)).toBeTruthy();

    expect(collection.count).toBe(1);
  });

  test('lastInserted', () => {
    const collection = new EntityCollection<User>();

    expect(() => collection.lastInserted).toThrow();

    expect(collection.add(user).lastInserted.equals(user)).toBeTruthy();

    collection.add(userTwo);

    expect(collection.lastInserted.equals(user)).toBeFalsy();
    expect(collection.lastInserted.equals(userTwo)).toBeTruthy();

    const anotherCollection = EntityCollection.from(collection);
    expect(anotherCollection.lastInserted.equals(userTwo)).toBeTruthy();
  });

  describe('add', () => {
    test('add Entity', () => {
      const collection = new EntityCollection<User>();

      expect(collection.add(user).contains(user)).toBeTruthy();
    });

    test('cannot upsert Entity', () => {
      const collection = new EntityCollection<User>();

      expect(() => collection.add(user).add(user)).toThrow();
    });
  });

  test('clear', () => {
    const collection = new EntityCollection<User>();

    collection.add(user);

    expect(collection.contains(user)).toBeTruthy();

    collection.clear();

    expect(collection.contains(user)).toBeFalsy();
  });

  describe('contains', () => {
    test('contains', () => {
      const collection = new EntityCollection<User>();

      collection.add(user);

      expect(collection.contains(user)).toBeTruthy();

      collection.remove(user);

      expect(collection.contains(user)).toBeFalsy();
    });

    test('implicitly contains with Entity id property', () => {
      const collection = new EntityCollection<User>();

      collection.add(user);

      expect(collection.contains(user)).toBeTruthy();

      collection.remove(user);

      expect(collection.contains(user)).toBeFalsy();
    });

    test('explicitly contains with Entity id property', () => {
      const collection = new EntityCollection<User, 'id'>();

      collection.add(user);

      expect(collection.contains(new UserId(user.id.unpack()))).toBeTruthy();

      collection.remove(user);

      expect(collection.contains(new UserId(user.id.unpack()))).toBeFalsy();
    });
  });

  test('copyTo', () => {
    const collection = new EntityCollection<User>();

    collection.add(user).add(userTwo);

    const array: User[] = [];

    collection.copyTo(array, 0);

    expect(array).toHaveLength(collection.count);
    expect(array[0]).toBe(user);
    expect(array[1]).toBe(userTwo);
  });

  describe('get', () => {
    test('get', () => {
      const collection = new EntityCollection<User>();

      collection.add(user);

      expect(collection.get(user)).toBe(user);

      collection.remove(user);

      expect(collection.get(user)).toBe(undefined);
    });

    test('implicitly get with Entity id property', () => {
      const collection = new EntityCollection<User>();

      collection.add(user);

      expect(collection.get(user)).toBeTruthy();

      collection.remove(user);

      expect(collection.get(user)).toBe(undefined);
    });

    test('explicitly get with Entity id property', () => {
      const collection = new EntityCollection<User, 'id'>();

      collection.add(user);

      expect(collection.get(new UserId(user.id.unpack()))).toBeTruthy();

      collection.remove(user);

      expect(collection.get(new UserId(user.id.unpack()))).toBe(undefined);
    });
  });

  describe('remove', () => {
    test('remove', () => {
      const collection = new EntityCollection<User>();

      collection.add(user);

      expect(collection.contains(user)).toBeTruthy();

      collection.remove(user);

      expect(collection.contains(user)).toBeFalsy();
    });

    test('implicitly remove with Entity id property', () => {
      const collection = new EntityCollection<User>();

      collection.add(user);

      expect(collection.contains(user)).toBeTruthy();

      collection.remove(user);

      expect(collection.contains(user)).toBeFalsy();
    });

    test('explicitly remove with Entity id property', () => {
      const collection = new EntityCollection<User, 'id'>();

      collection.add(user);

      expect(collection.contains(user)).toBeTruthy();

      collection.remove(new UserId(user.id.unpack()));

      expect(collection.contains(user)).toBeFalsy();
    });
  });

  test('identities', () => {
    const collection = new EntityCollection<User>();

    collection.add(user).add(userTwo);

    expect(collection.contains(user)).toBeTruthy();
    expect(collection.contains(userTwo)).toBeTruthy();

    const identities = collection.identities();

    expect(identities.includes(user.id)).toBeTruthy();
    expect(identities.includes(userTwo.id)).toBeTruthy();
  });

  test('entities', () => {
    const collection = new EntityCollection<User>();

    collection.add(user).add(userTwo);

    expect(collection.contains(user)).toBeTruthy();
    expect(collection.contains(userTwo)).toBeTruthy();

    const entities = collection.entities();

    expect(entities.includes(user)).toBeTruthy();
    expect(entities.includes(userTwo)).toBeTruthy();
  });

  test('entries', () => {
    const collection = new EntityCollection<User>();

    collection.add(user).add(userTwo);

    expect(collection.contains(user)).toBeTruthy();
    expect(collection.contains(userTwo)).toBeTruthy();

    const entries = collection.entries();

    expect(entries[0]).toMatchObject([user.id, user]);
    expect(entries[1]).toMatchObject([userTwo.id, userTwo]);
  });

  test('forEach', () => {
    const collection = new EntityCollection<User>();

    collection.add(user).add(userTwo);

    expect(collection.contains(user)).toBeTruthy();
    expect(collection.contains(userTwo)).toBeTruthy();

    let loops = 0;

    collection.forEach((entity) => {
      expect(collection.contains(entity)).toBeTruthy();
      loops += 1;
    });

    expect(loops).toBe(collection.count);
  });

  describe('Symbol.iterator', () => {
    test('for loop', () => {
      const collection = new EntityCollection<User>();

      collection.add(user).add(userTwo);

      expect(collection.contains(user)).toBeTruthy();
      expect(collection.contains(userTwo)).toBeTruthy();

      let loops = 0;

      for (const entity of collection) {
        expect(collection.contains(entity)).toBeTruthy();
        loops += 1;
      }

      expect(loops).toBe(collection.count);
    });

    test('spread', () => {
      const collection = new EntityCollection<User>();

      collection.add(user).add(userTwo);

      expect(collection.contains(user)).toBeTruthy();
      expect(collection.contains(userTwo)).toBeTruthy();

      const arr = [...collection];

      expect(arr).toHaveLength(collection.count);
      expect(arr).toContain(user);
      expect(arr).toContain(userTwo);
    });
  });

  describe('from', () => {
    test('iterable', () => {
      const iterable = [user, userTwo];

      const collection = EntityCollection.from(iterable);

      expect(collection.count).toBe(iterable.length);
      expect(collection.contains(user)).toBeTruthy();
      expect(collection.contains(userTwo)).toBeTruthy();
    });

    test('iterable with reducer', () => {
      const iterable = [user.id, userTwo.id];

      const collection = EntityCollection.from(iterable, (id) =>
        user.id.equals(id) ? user : userTwo
      );

      expect(collection.count).toBe(iterable.length);
      expect(collection.contains(user)).toBeTruthy();
      expect(collection.contains(userTwo)).toBeTruthy();
    });

    test('dictionary', () => {
      const dictionary = {
        [user.id.unpack()]: user,
        [userTwo.id.unpack()]: userTwo
      };

      const collection = EntityCollection.from(dictionary);

      expect(collection.count).toBe(Object.values(dictionary).length);
      expect(collection.contains(user)).toBeTruthy();
      expect(collection.contains(userTwo)).toBeTruthy();
    });

    test('dictionary with reducer', () => {
      const dictionary = {
        [user.id.unpack()]: user.id,
        [userTwo.id.unpack()]: userTwo.id
      };

      const collection = EntityCollection.from(dictionary, ([, id]) =>
        user.id.equals(id) ? user : userTwo
      );

      expect(collection.count).toBe(Object.values(dictionary).length);
      expect(collection.contains(user)).toBeTruthy();
      expect(collection.contains(userTwo)).toBeTruthy();
    });
  });
});

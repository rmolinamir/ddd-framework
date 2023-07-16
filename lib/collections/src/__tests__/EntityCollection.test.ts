import { v4 } from 'uuid';

import User, { UserId } from '../../tests/User';
import EntityCollection from '../EntityCollection';

describe('EntityCollection', () => {
  const user = new User(new UserId(v4()));
  const userTwo = new User(new UserId(v4()));

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

    const anotherCollection = EntityCollection.from<User>(collection);
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

    test('contains with Entity id property', () => {
      const collection = new EntityCollection<User>();

      collection.add(user);

      expect(collection.contains(user.id)).toBeTruthy();

      collection.remove(user.id);

      expect(collection.contains(user.id)).toBeFalsy();
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

    test('get with Entity id property', () => {
      const collection = new EntityCollection<User>();

      collection.add(user);

      expect(collection.get(user.id)).toBeTruthy();

      collection.remove(user.id);

      expect(collection.get(user.id)).toBe(undefined);
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

    test('remove with Entity id property', () => {
      const collection = new EntityCollection<User>();

      collection.add(user);

      expect(collection.contains(user.id)).toBeTruthy();

      collection.remove(user.id);

      expect(collection.contains(user.id)).toBeFalsy();
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

      const collection = EntityCollection.from(dictionary, (id) =>
        user.id.equals(id) ? user : userTwo
      );

      expect(collection.count).toBe(Object.values(dictionary).length);
      expect(collection.contains(user)).toBeTruthy();
      expect(collection.contains(userTwo)).toBeTruthy();
    });

    test('iterable', () => {
      const users = [user, userTwo];

      const collection = EntityCollection.from(users);

      expect(collection.count).toBe(users.length);
      expect(collection.contains(user)).toBeTruthy();
      expect(collection.contains(userTwo)).toBeTruthy();
    });
  });
});

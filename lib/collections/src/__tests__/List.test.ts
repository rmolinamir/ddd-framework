import { describe, expect, test } from 'vitest';
import { faker } from '@faker-js/faker';
import { User, UserId } from '../../tests/user';
import { List } from '../list';

describe('List', () => {
  const user = new User(new UserId(faker.string.uuid()));
  const userTwo = new User(new UserId(faker.string.uuid()));

  describe('constructor', () => {
    test('spread argument', () => {
      const list = new List(1, 2, 3, 4, 5);
      expect(list.count).toBe(5);
      expect(list.unpack()).toMatchObject([1, 2, 3, 4, 5]);
    });

    test('array argument', () => {
      const list = new List([1, 2, 3, 4, 5]);
      expect(list.count).toBe(5);
      expect(list.unpack()).toMatchObject([1, 2, 3, 4, 5]);
    });

    test('list argument', () => {
      const list = new List(new List([1, 2, 3, 4, 5]));
      expect(list.count).toBe(5);
      expect(list.unpack()).toMatchObject([1, 2, 3, 4, 5]);
    });
  });

  test('count', () => {
    const list = new List();

    expect(list.count).toBe(0);
  });

  test('first', () => {
    const list = new List(1, 2, 3);

    expect(list.first).toBe(1);
  });

  test('last', () => {
    const list = new List(1, 2, 3);

    expect(list.last).toBe(3);
  });

  describe('immutability', () => {
    test('insert', () => {
      const list = new List<User>();

      const newList = list.insert(user);

      expect(list.count).toBe(0);
      expect(newList.count).toBe(1);
    });

    test('remove', () => {
      const list = new List<User>().insert(user);

      expect(list.count).toBe(1);

      const newList = list.remove(user);

      expect(list.count).toBe(1);

      expect(newList.count).toBe(0);
      expect(newList.count).toBe(0);
    });

    test('removeAt', () => {
      const list = new List(0, 1, 2, 3, 4, 5);

      expect(list.count).toBe(6);

      const newList = list.removeAt(3);

      expect(list.count).toBe(6);

      expect(newList.count).toBe(5);
      expect(newList.contains(0)).toBeTruthy();
      expect(newList.contains(1)).toBeTruthy();
      expect(newList.contains(2)).toBeTruthy();
      expect(newList.contains(3)).toBeFalsy();
      expect(newList.contains(4)).toBeTruthy();
      expect(newList.contains(5)).toBeTruthy();
    });

    test('clear', () => {
      const list = new List<User>().insert(user).insert(userTwo);

      const newList = list.clear();

      expect(list.count).toBe(2);

      expect(newList.count).toBe(0);
    });
  });

  test('insert', () => {
    const list = new List<User>();

    const newList = list.insert(user);

    expect(newList.count).toBe(1);
  });

  test('contains', () => {
    const list = new List<User>();

    expect(list.insert(user).contains(user)).toBeTruthy();
  });

  test('find', () => {
    const list = new List<User>();

    expect(list.insert(user).find((i) => user.equals(i))).toBe(user);
  });

  test('itemAt', () => {
    const list = new List<User>().insert(user).insert(userTwo);

    expect(list.itemAt(0)?.equals(user)).toBe(true);
    expect(list.itemAt(1)?.equals(userTwo)).toBe(true);
  });

  test('indexOf', () => {
    const list = new List<User>().insert(user).insert(userTwo);

    expect(list.indexOf(user)).toBe(0);
    expect(list.indexOf(userTwo)).toBe(1);
  });

  test('remove', () => {
    const list = new List<User>().insert(user);

    expect(list.count).toBe(1);

    const newList = list.remove(user);

    expect(list.count).toBe(1);

    expect(newList.count).toBe(0);
    expect(newList.count).toBe(0);
  });

  test('removeAt', () => {
    const list = new List<User>().insert(user).insert(userTwo);

    expect(list.count).toBe(2);

    const newList = list.removeAt(0);

    expect(list.count).toBe(2);

    expect(newList.count).toBe(1);
    expect(newList.contains(user)).toBeFalsy();
    expect(newList.contains(userTwo)).toBeTruthy();
  });

  test('clear', () => {
    const list = new List<UserId>()
      .insert(new UserId(faker.string.uuid()))
      .insert(new UserId(faker.string.uuid()))
      .insert(new UserId(faker.string.uuid()))
      .insert(new UserId(faker.string.uuid()))
      .insert(new UserId(faker.string.uuid()))
      .insert(new UserId(faker.string.uuid()))
      .insert(new UserId(faker.string.uuid()))
      .insert(new UserId(faker.string.uuid()))
      .insert(new UserId(faker.string.uuid()))
      .insert(new UserId(faker.string.uuid()));

    expect(list.count).toBe(10);

    const newList = list.clear();

    expect(list.count).toBe(10);

    expect(newList.count).toBe(0);

    expect(newList.equals(new List()));
  });

  test('map', () => {
    const userIds = new List<UserId>()
      .insert(new UserId(faker.string.uuid()))
      .insert(new UserId(faker.string.uuid()))
      .insert(new UserId(faker.string.uuid()))
      .insert(new UserId(faker.string.uuid()))
      .insert(new UserId(faker.string.uuid()))
      .insert(new UserId(faker.string.uuid()))
      .insert(new UserId(faker.string.uuid()))
      .insert(new UserId(faker.string.uuid()))
      .insert(new UserId(faker.string.uuid()))
      .insert(new UserId(faker.string.uuid()));

    const strings = userIds.map((id) => id.unpack());

    expect(userIds.equals(strings)).toBe(false);
    expect(userIds.itemAt(0)?.unpack()).toBe(strings.itemAt(0));
  });

  test('sort', () => {
    const list = new List(4, 1, 2, 3, 6, 7, 3, 1, 2);

    expect(list.count).toBe(9);

    expect(list.sort(() => 1).equals(new List(1, 1, 2, 2, 3, 3, 4, 6, 7)));
    expect(list.sort(() => -1).equals(new List(7, 6, 4, 3, 3, 2, 2, 1, 1)));
  });

  test('shuffle', () => {
    const list = new List<UserId>()
      .insert(new UserId(faker.string.uuid()))
      .insert(new UserId(faker.string.uuid()))
      .insert(new UserId(faker.string.uuid()))
      .insert(new UserId(faker.string.uuid()))
      .insert(new UserId(faker.string.uuid()))
      .insert(new UserId(faker.string.uuid()))
      .insert(new UserId(faker.string.uuid()))
      .insert(new UserId(faker.string.uuid()))
      .insert(new UserId(faker.string.uuid()))
      .insert(new UserId(faker.string.uuid()));

    const newList = new List(list);

    expect(list.equals(newList)).toBe(true);

    const shuffledList = newList.shuffle();

    expect(list.equals(newList)).toBe(true);
    expect(list.equals(shuffledList)).toBe(false);
  });

  test('unpack', () => {
    const list = new List(1, 2, 3, 4, 5);

    expect(list.count).toBe(5);

    const array = list.unpack();

    expect(list.count).toBe(5);
    expect(list.unpack()).not.toBe(array);
    expect(list.unpack()).toMatchObject(array);
  });

  test('equals', () => {
    const list = new List(4, 1, 2, 3, 6, 7, 3, 1, 2);

    expect(list.sort(() => 1).equals(new List(1, 1, 2, 2, 3, 3, 4, 6, 7)));
    expect(list.sort(() => -1).equals(new List(7, 6, 4, 3, 3, 2, 2, 1, 1)));
  });

  test('static from', () => {
    const digits = List.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], (number) =>
      String(number)
    );

    expect(
      digits.equals(new List('0', '1', '2', '3', '4', '5', '6', '7', '8', '9'))
    );
  });
});

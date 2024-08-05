import { Entity, ValueObject } from '@ddd-framework/core';

/**
 * Represents an immutable collection of objects that can be accessed by index.
 * Provides methods to search, sort, and manipulate lists.
 */
export class List<Item = unknown>
  extends ValueObject
  implements Iterable<Item>
{
  private readonly array: Array<Item>;

  constructor(...items: Item[]);
  constructor(items?: Array<Item>);
  constructor(items?: List<Item>);
  constructor(arg1: Array<Item> | List<Item> | Item = [], ...args: Item[]) {
    super();
    if (arg1 instanceof List) {
      this.array = Array.from(arg1.array);
    } else if (Array.isArray(arg1)) {
      this.array = arg1;
    } else {
      this.array = Array.from([arg1, ...args]);
    }
  }

  /**
   * Returns the number of items in the List.
   */
  public get count(): number {
    return this.array.length;
  }

  /**
   * Returns the first item in the List.
   */
  public get first(): Item | undefined {
    return this.array[0];
  }

  /**
   * Returns the last item in the List.
   */
  public get last(): Item | undefined {
    return this.array[this.array.length - 1];
  }

  /**
   * Returns a new List with the inserted item at the end.
   */
  public insert(item: Item): List<Item> {
    const array = Array.from(this.array);

    array.push(item);

    return new List<Item>(array);
  }

  /**
   * Removes an empty List with the same settings.
   */
  public clear(): List<Item> {
    return new List<Item>();
  }

  /**
   * Determines whether the List contains an item.
   */
  public contains(item: Item): boolean {
    return this.array.includes(item);
  }

  /**
   * Finds an item from the List using a predicate.
   */
  public find(predicate: (i: Item) => boolean): Item | undefined {
    return this.array.find((i) => predicate(i));
  }

  /**
   * Returns an item at a specific index from the List.
   */
  public itemAt(index: number): Item | undefined {
    return this.array[index];
  }

  /**
   * Returns the index of an item from the List.
   */
  public indexOf(item: Item): number | undefined {
    return this.array.indexOf(item);
  }

  /**
   * Removes an item from the List.
   */
  public remove(item: Item): List<Item> {
    const array = this.array.filter((i) => {
      if (item instanceof ValueObject && i instanceof ValueObject)
        return item.notEquals(i);
      else if (item instanceof Entity && i instanceof Entity)
        return item.notEquals(i);
      else return i !== item;
    });

    return new List<Item>(array);
  }

  /**
   * Removes an item at a certain index from the List.
   */
  public removeAt(index: number): List<Item> {
    const array = Array.from(this.array);

    array.splice(index, 1);

    return new List<Item>(array);
  }

  /**
   * Performs the specified action for each item in the List.
   */
  public forEach(callback: (item: Item) => void): void {
    this.array.forEach((i) => callback(i));
  }

  /**
   * Maps a List to a new List.
   */
  public map<Value = Item>(mapper: (item: Item) => Value): List<Value> {
    const array = Array.from(this.array).map((i) => mapper(i));

    return new List<Value>(array);
  }

  /**
   * Returns a new shuffled List.
   * Implemented using the Durstenfeld shuffle, an optimized version of Fisher-Yates shuffle.
   */
  public shuffle(): List<Item> {
    const array = Array.from(this.array);

    for (let index = array.length - 1; index > 0; index--) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [array[index], array[randomIndex]] = [array[randomIndex], array[index]];
    }

    return new List<Item>(array);
  }

  /**
   * Returns a new sorted List.
   */
  public sort(compare?: (a: Item, b: Item) => number): List<Item> {
    const array = Array.from(this.array);

    array.sort(compare);

    return new List<Item>(array);
  }

  /**
   * Returns an Array from the List.
   */
  public unpack(): Array<Item> {
    return Array.from(this.array);
  }

  /**
   * Returns a new List from an Array or another List.
   */
  public static from<Item, Value>(
    iterable: Iterable<Value>,
    reducer: (value: Value) => Item
  ): List<Item>;

  public static from<Item = unknown>(iterable: Iterable<Item>): List<Item>;

  public static from<Item = unknown, Value = unknown>(
    arg1: Iterable<Value> | Iterable<Item>,
    arg2?: (value: Value) => Item
  ): List<Item> {
    if (typeof arg2 === 'function') {
      return new List<Item>(
        Array.from(arg1 as Iterable<Value>).map((v) => arg2(v) as Item)
      );
    } else {
      return new List<Item>(Array.from(arg1 as Iterable<Item>));
    }
  }

  /**
   * Returns a new iterator object that yields the Items for each element in the List in insertion order.
   */
  public [Symbol.iterator](): Iterator<Item> {
    return this.array.values();
  }
}

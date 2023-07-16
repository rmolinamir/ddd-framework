import {
  Entity,
  Identity,
  InvalidOperationException,
  NotFoundException
} from '@ddd-framework/core';

type UnpackIdentity<E extends Entity<Identity>> = ReturnType<E['id']['unpack']>;

type EntityCollectionMap<E extends Entity<Identity>> = Map<
  UnpackIdentity<E>,
  E
>;

/**
 * Represents a collection of Entity objects on the "many" end of a relationship.
 */
export type EntityCollectionOptions = { shouldUpsert: boolean };

/**
 * Represents a collection of Entity objects on the "many" end of a relationship.
 */
export default class EntityCollection<E extends Entity<Identity>>
  implements Iterable<E>
{
  private _last?: E;

  constructor(protected map: EntityCollectionMap<E> = new Map()) {}

  /**
   * Returns the number of key/value pairs contained in the EntityCollection.
   */
  public get count(): number {
    return this.map.size;
  }

  /**
   * Returns the number of key/value pairs contained in the EntityCollection.
   */
  public get lastInserted(): E {
    if (!this._last)
      throw new NotFoundException('There are no Entities in the collection.');
    return this._last;
  }

  /**
   * Adds an entity to the EntityCollection.
   */
  public add(entity: E): EntityCollection<E> {
    if (this.contains(entity))
      throw new InvalidOperationException(
        'Entity is already in the collection.'
      );

    this.map.set(entity.id.unpack() as UnpackIdentity<E>, entity);

    this._last = entity;

    return this;
  }

  /**
   * Removes all entitys from the EntityCollection.
   */
  public clear(): void {
    this.map.clear();
  }

  /**
   * Determines whether the EntityCollection contains a specific value.
   */
  public contains(entity: E | E['id']): boolean {
    if ('id' in entity)
      return this.map.has(entity.id.unpack() as UnpackIdentity<E>);
    else return this.map.has(entity.unpack() as UnpackIdentity<E>);
  }

  /**
   * Copies the elements of the EntityCollection to an Array, starting at a particular Array index.
   */
  public copyTo(array: E[], index: number): E[] {
    return array.splice(index, 0, ...this);
  }

  /**
   * Returns a specific object from the EntityCollection.
   */
  public get(entity: E | E['id']) {
    if ('id' in entity)
      return this.map.get(entity.id.unpack() as UnpackIdentity<E>);
    else return this.map.get(entity.unpack() as UnpackIdentity<E>);
  }

  /**
   * Removes a specific object from the EntityCollection.
   */
  public remove(entity: E | E['id']) {
    if ('id' in entity)
      return this.map.delete(entity.id.unpack() as UnpackIdentity<E>);
    else return this.map.delete(entity.unpack() as UnpackIdentity<E>);
  }

  /**
   * Returns a new Array object that contains the keys for each element in the EntityCollection in insertion order.
   */
  public identities(): Array<E['id']> {
    return Array.from(this.map.values(), (entity) => entity.id);
  }

  /**
   * Returns a new Array object that contains the values for each element in the EntityCollection in insertion order.
   */
  public entities(): Array<E> {
    return Array.from(this.map.values());
  }

  /**
   * Returns a new Array object that contains a two-member array of [key, value] for each element in the EntityCollection in insertion order.
   */
  public entries(): Array<[E['id'], E]> {
    return Array.from(this.map.values(), (entity) => [entity.id, entity]);
  }

  /**
   * Returns a dictionary object of identifiers and respective entities.
   */
  public dictionary(): Record<ReturnType<Identity['unpack']>, E>;
  public dictionary<Value = E>(
    reducer: (entity: E) => Value
  ): Record<ReturnType<Identity['unpack']>, Value>;

  public dictionary<Value = E>(
    reducer?: (entity: E) => Value
  ): Record<ReturnType<Identity['unpack']>, Value> {
    const dictionary = this.entities().reduce<
      Record<ReturnType<Identity['unpack']>, Value>
    >((dictionary, entity) => {
      if (reducer) dictionary[entity.id.unpack()] = reducer(entity);
      else dictionary[entity.id.unpack()] = entity as unknown as Value;

      return dictionary;
    }, {});

    return dictionary;
  }

  /**
   * Calls callbackFn once for each Entity present in the EntityCollection, in insertion order.
   * If a thisArg parameter is provided to forEach, it will be used as the this value for each callback.
   */
  public forEach(callbackfn: (entity: E) => void, thisArg?: unknown) {
    this.map.forEach(callbackfn, thisArg);
  }

  /**
   * Returns a new iterator object that yields the values for each element in the EntityCollection in insertion order.
   */
  public [Symbol.iterator](): Iterator<E> {
    return this.map.values();
  }

  /**
   * Returns a new EntityCollection from an iterable object of Entities.
   */
  public static from<E extends Entity<Identity>>(
    dictionary: Record<string, E>,
    options?: Partial<EntityCollectionOptions>
  ): EntityCollection<E>;

  public static from<E extends Entity<Identity>, Value>(
    dictionary: Record<string, Value>,
    reducer: (value: Value) => E,
    options?: Partial<EntityCollectionOptions>
  ): EntityCollection<E>;

  public static from<E extends Entity<Identity>>(
    iterable: Iterable<E> | ArrayLike<E>,
    options?: Partial<EntityCollectionOptions>
  ): EntityCollection<E>;

  public static from<E extends Entity<Identity>, Value>(
    arg1:
      | Record<string, E>
      | Record<string, Value>
      | Iterable<E>
      | ArrayLike<E>,
    arg2?: Partial<EntityCollectionOptions> | ((value: Value) => E)
  ): EntityCollection<E> {
    if (Symbol.iterator in arg1) {
      const iterable = arg1 as Iterable<E> | ArrayLike<E>;

      const collection = new EntityCollection<E>(undefined);

      Array.from(iterable).forEach((entity) => collection.add(entity));

      return collection;
    } else if (typeof arg2 === 'function') {
      const dictionary = arg1 as Record<string, Value>;

      const reducer = arg2;

      const collection = new EntityCollection<E>(undefined);

      Array.from(Object.values(dictionary)).forEach((value) =>
        collection.add(reducer(value))
      );

      return collection;
    } else {
      const dictionary = arg1 as Record<string, E>;

      const collection = new EntityCollection<E>(undefined);

      Array.from(Object.values(dictionary)).forEach((entity) =>
        collection.add(entity)
      );

      return collection;
    }
  }
}

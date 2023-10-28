import {
  DomainPrimitive,
  Entity,
  EntityId,
  InvalidOperationException,
  NotFoundException
} from '@ddd-framework/core';

type EntityCollectionMap<E extends Entity> = Map<symbol, E>;

/**
 * Represents a collection of Entity objects on the "many" end of a relationship.
 */
export class EntityCollection<E extends Entity, K extends keyof E = keyof E>
  implements Iterable<E>
{
  private _last?: E;

  protected map: EntityCollectionMap<E> = new Map();

  /**
   * Returns the number of key/value pairs contained in the EntityCollection.
   */
  public get count(): number {
    return this.map.size;
  }

  /**
   * Returns the last inserted Entity in the EntityCollection.
   */
  public get lastInserted(): E {
    if (!this._last)
      throw new NotFoundException('There are no Entities in the collection.');
    return this._last;
  }

  /**
   * Adds an entity to the EntityCollection.
   */
  public add(entity: E): EntityCollection<E, K> {
    if (this.contains(entity))
      throw new InvalidOperationException(
        'Entity is already in the collection.'
      );

    this.map.set(EntityId.getId(entity), entity);

    this._last = entity;

    return this;
  }

  /**
   * Removes all entities from the EntityCollection.
   */
  public clear(): void {
    this.map.clear();
  }

  /**
   * Determines whether the EntityCollection contains a specific value.
   */
  public contains(entity: E): boolean;
  public contains(entityId: E[K]): boolean;
  public contains(arg: E | E[K]): boolean {
    if (arg instanceof Entity) return this.map.has(EntityId.getId(arg));
    return this.map.has(arg as symbol);
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
  public get(entity: E): Entity | undefined;
  public get(entityId: E[K]): Entity | undefined;
  public get(arg: E | E[K]): Entity | undefined {
    if (arg instanceof Entity) return this.map.get(EntityId.getId(arg));
    return this.map.get(arg as symbol);
  }

  /**
   * Removes a specific object from the EntityCollection.
   */
  public remove(entity: E): boolean;
  public remove(entityId: E[K]): boolean;
  public remove(arg: E | E[K]): boolean {
    if (arg instanceof Entity) return this.map.delete(EntityId.getId(arg));
    return this.map.delete(arg as symbol);
  }

  /**
   * Returns a new Array object that contains the keys for each element in the EntityCollection in insertion order.
   */
  public identities<Identity>(): Array<Identity> {
    return Array.from(this.map.values(), (entity) =>
      EntityId.getId<Identity>(entity)
    );
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
  public entries<Identity>(): Array<[Identity, E]> {
    return Array.from(this.map.values(), (entity) => [
      EntityId.getId<Identity>(entity),
      entity
    ]);
  }

  /**
   * Returns a dictionary object of the collection's entities keyed by their IDs.
   */
  public dictionary(): Record<PropertyKey, E>;

  public dictionary<Value = E>(
    reducer: (entity: E) => Value
  ): Record<PropertyKey, Value>;

  public dictionary<Value = E>(
    reducer?: (entity: E) => Value
  ): Record<PropertyKey, Value> {
    const dictionary = this.entities().reduce<Record<PropertyKey, Value>>(
      (dictionary, entity) => {
        let dictionaryKey: PropertyKey;

        const entityId = EntityId.getId(entity);

        if (entityId instanceof DomainPrimitive)
          dictionaryKey = entityId.unpack();
        else dictionaryKey = entityId as PropertyKey;

        if (reducer) dictionary[dictionaryKey] = reducer(entity);
        else dictionary[dictionaryKey] = entity as unknown as Value;

        return dictionary;
      },
      {}
    );

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
  public static from<E extends Entity, K extends keyof E>(
    iterable: Iterable<E>
  ): EntityCollection<E, K>;

  public static from<E extends Entity, K extends keyof E, Value>(
    iterable: Iterable<Value>,
    reducer: (value: Value) => E
  ): EntityCollection<E, K>;

  public static from<E extends Entity, K extends keyof E>(
    dictionary: Record<string | number | symbol, E>
  ): EntityCollection<E, K>;

  public static from<
    E extends Entity,
    K extends keyof E,
    Key extends string | number | symbol,
    Value
  >(
    dictionary: Record<Key, Value>,
    reducer: (entry: [Key, Value]) => E
  ): EntityCollection<E, K>;

  public static from<E extends Entity, Value>(
    arg1:
      | Iterable<E>
      | Iterable<Value>
      | Record<string, E>
      | Record<string, Value>,
    arg2?:
      | ((value: Value) => E)
      | ((entry: [string | number | symbol, Value]) => E)
  ): EntityCollection<E> {
    const collection = new EntityCollection<E>();

    if (Symbol.iterator in arg1) {
      if (arg2) {
        const values = arg1 as Iterable<Value>;
        const reducer = arg2 as (value: Value) => E;
        Array.from(values).forEach((value) => collection.add(reducer(value)));
      } else {
        const entities = arg1 as Iterable<E>;
        Array.from(entities).forEach((entity) => collection.add(entity));
      }
    } else {
      if (arg2) {
        const dictionary = arg1 as Record<string, Value>;
        const reducer = arg2 as (entry: [string, Value]) => E;
        Array.from(Object.entries(dictionary)).forEach((entry) =>
          collection.add(reducer(entry))
        );
      } else {
        const dictionary = arg1 as Record<string, E>;
        Array.from(Object.values(dictionary)).forEach((entity) =>
          collection.add(entity)
        );
      }
    }

    return collection;
  }
}

import { InvalidOperationException, NotFoundException } from '../../exceptions';
import { DomainPrimitive } from '../../value_objects';
import Entity from './Entity';
import EntityId from './EntityId';

type EntityCollectionMap<E extends Entity> = Map<Symbol, E>;

/**
 * Represents a collection of Entity objects on the "many" end of a relationship.
 */
export type EntityCollectionOptions = { shouldUpsert: boolean };

// TODO: JSDocs.
export default class EntityCollection<E extends Entity> implements Iterable<E> {
  private _last?: E;

  protected map: EntityCollectionMap<E> = new Map();

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

    this.map.set(EntityId.getId(entity), entity);

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
  public contains(entity: E): boolean {
    return this.map.has(EntityId.getId(entity));
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
  public get(entity: E) {
    return this.map.get(EntityId.getId(entity));
  }

  /**
   * Removes a specific object from the EntityCollection.
   */
  public remove(entity: E) {
    return this.map.delete(EntityId.getId(entity));
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
  public static from<E extends Entity>(
    dictionary: Record<string, E>,
    options?: Partial<EntityCollectionOptions>
  ): EntityCollection<E>;

  public static from<E extends Entity, Value>(
    dictionary: Record<string, Value>,
    reducer: (value: Value) => E,
    options?: Partial<EntityCollectionOptions>
  ): EntityCollection<E>;

  public static from<E extends Entity>(
    iterable: Iterable<E> | ArrayLike<E>,
    options?: Partial<EntityCollectionOptions>
  ): EntityCollection<E>;

  public static from<E extends Entity, Value>(
    arg1:
      | Record<string, E>
      | Record<string, Value>
      | Iterable<E>
      | ArrayLike<E>,
    arg2?: Partial<EntityCollectionOptions> | ((value: Value) => E)
  ): EntityCollection<E> {
    if (Symbol.iterator in arg1) {
      const iterable = arg1 as Iterable<E> | ArrayLike<E>;

      const collection = new EntityCollection<E>();

      Array.from(iterable).forEach((entity) => collection.add(entity));

      return collection;
    } else if (typeof arg2 === 'function') {
      const dictionary = arg1 as Record<string, Value>;

      const reducer = arg2;

      const collection = new EntityCollection<E>();

      Array.from(Object.values(dictionary)).forEach((value) =>
        collection.add(reducer(value))
      );

      return collection;
    } else {
      const dictionary = arg1 as Record<string, E>;

      const collection = new EntityCollection<E>();

      Array.from(Object.values(dictionary)).forEach((entity) =>
        collection.add(entity)
      );

      return collection;
    }
  }
}

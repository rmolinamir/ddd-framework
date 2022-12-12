import type { AggregateRoot } from '../aggregates';
import type { Identity } from '../common';
import type { Entity, EntityCollection } from '../entities';
import type { DomainPrimitive, List, ValueObject } from '../value_objects';
import type { Primitive } from '../value_objects/DomainPrimitive';
import type { ExcludeFunctionsOf } from './ExcludeFunctionsOf';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FunctionType = (...args: any) => any;

// TODO: Add symbol, bigint, & RegExp
type IsBuiltInType<T> = T extends
  | string
  | number
  | boolean
  | null
  | undefined
  | FunctionType
  | Set<unknown>
  | Map<unknown, unknown>
  | ReadonlyMap<unknown, unknown>
  | Date
  | Array<unknown>
  ? true
  : false;

type SerializeAggregateRoot<T> = T extends AggregateRoot
  ? DataTransferObject<Omit<T, 'events'>>
  : T;

type SerializeEntityCollection<T> = T extends EntityCollection<infer E>
  ? Record<SerializeDomainPrimitive<E['id']>, DataTransferObject<E>>
  : T;

type SerializeList<T> = T extends List<infer I> ? DataTransferObject<I>[] : T;

type SerializeDomainPrimitive<T> = T extends DomainPrimitive<Primitive>
  ? DataTransferObject<ReturnType<T['unpack']>>
  : T;

type SerializeValueObject<T> = T extends ValueObject
  ? { [K in keyof ExcludeFunctionsOf<T>]: DataTransferObject<T[K]> }
  : T;

type SerializeDate<T> = T extends Date ? string : T;

type SerializeMap<T> = T extends
  | Map<infer K, infer V>
  | ReadonlyMap<infer K, infer V>
  ? Record<
      K extends string | number | symbol ? K : string,
      IsBuiltInType<V> extends true
        ? V
        : { [K in keyof ExcludeFunctionsOf<V>]: DataTransferObject<V[K]> }
    >
  : T;

type SerializeSet<T> = T extends Set<infer I> ? DataTransferObject<I>[] : T;

type SerializeArray<T> = T extends Array<infer I> ? DataTransferObject<I>[] : T;

type Serialize<T> = T extends infer U extends AggregateRoot
  ? SerializeAggregateRoot<U>
  : T extends infer U extends EntityCollection<Entity<Identity>>
  ? SerializeEntityCollection<U>
  : T extends infer U extends List<unknown>
  ? SerializeList<U>
  : T extends infer U extends DomainPrimitive<Primitive>
  ? SerializeDomainPrimitive<U>
  : T extends infer U extends ValueObject
  ? SerializeValueObject<U>
  : IsBuiltInType<T> extends true
  ? SerializeDate<SerializeMap<SerializeSet<SerializeArray<T>>>>
  : { [K in keyof ExcludeFunctionsOf<T>]: DataTransferObject<T[K]> };

/**
 * Deeply converts a generic type into an anemic type by excluding any methods.
 * Useful for object/class initializers or data-centric operations.
 */
export type DataTransferObject<T> = T extends FunctionType
  ? never
  : Extract<T, undefined> extends never
  ? Serialize<T>
  : Serialize<T> | undefined;

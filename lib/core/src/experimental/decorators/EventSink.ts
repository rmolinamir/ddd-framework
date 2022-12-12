import { Identity } from '../../common';
import { ObjectLiteral } from '../../types';
import { DomainPrimitive } from '../../value_objects';
import Entity from './Entity';

export default class EventSink<DomainEvent extends ObjectLiteral> {
  private static singleton: EventSink<ObjectLiteral>;

  private sink: Map<PropertyKey, DomainEvent[]> = new Map();

  private constructor() {}

  /**
   * Returns all events of an Aggregate.
   */
  public static add<DomainEvent extends ObjectLiteral>(
    aggregateRoot: Entity,
    aDomainEvent: DomainEvent
  ): void;

  /**
   * Returns all events of an Aggregate.
   */
  public static add<DomainEvent extends ObjectLiteral>(
    aggregateId: Identity,
    aDomainEvent: DomainEvent
  ): void;

  /**
   * Returns all events of an Aggregate.
   */
  public static add<DomainEvent extends ObjectLiteral>(
    aggregateId: PropertyKey,
    aDomainEvent: DomainEvent
  ): void;

  public static add<DomainEvent extends ObjectLiteral>(
    arg: Entity | Identity | PropertyKey,
    aDomainEvent: DomainEvent
  ): void {
    const instance = this.instance();

    const key = this.getPropertyKeyFrom(arg);

    const events = instance.sink.get(key);

    if (events) events.push(aDomainEvent);
    else instance.sink.set(key, [aDomainEvent]);
  }

  /**
   * Returns all events of an Aggregate.
   */
  public static get<DomainEvent extends ObjectLiteral>(
    aggregateRoot: Entity
  ): DomainEvent[];

  /**
   * Returns all events of an Aggregate.
   */
  public static get<DomainEvent extends ObjectLiteral>(
    aggregateId: Identity
  ): DomainEvent[];

  /**
   * Returns all events of an Aggregate.
   */
  public static get<DomainEvent extends ObjectLiteral>(
    aggregateId: PropertyKey
  ): DomainEvent[];

  public static get<DomainEvent extends ObjectLiteral>(
    arg: Entity | Identity | PropertyKey
  ): DomainEvent[] {
    const key = this.getPropertyKeyFrom(arg);

    return (this.instance().sink.get(key) as DomainEvent[]) || [];
  }

  /**
   * Clears all events of an Aggregate and returns them.
   */
  public static flush<DomainEvent extends ObjectLiteral>(
    aggregateRoot: Entity
  ): DomainEvent[];

  /**
   * Clears all events of an Aggregate and returns them.
   */
  public static flush<DomainEvent extends ObjectLiteral>(
    aggregateId: Identity
  ): DomainEvent[];

  /**
   * Clears all events of an Aggregate and returns them.
   */
  public static flush<DomainEvent extends ObjectLiteral>(
    aggregateId: PropertyKey
  ): DomainEvent[];

  public static flush<DomainEvent extends ObjectLiteral>(
    arg: Entity | Identity | PropertyKey
  ): DomainEvent[] {
    const instance = this.instance();

    const key = this.getPropertyKeyFrom(arg);

    const events = instance.sink.get(key);

    if (events) {
      instance.sink.delete(key);
      return events as DomainEvent[];
    } else return [];
  }

  private static instance() {
    if (!EventSink.singleton) EventSink.singleton = new EventSink();
    return EventSink.singleton;
  }

  private static getPropertyKeyFrom(
    arg: Entity | Identity | PropertyKey
  ): PropertyKey {
    if (arg instanceof Entity) return arg.entityId();
    else if (arg instanceof DomainPrimitive) return arg.unpack();
    else return arg;
  }
}

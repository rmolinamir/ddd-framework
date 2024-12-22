import { AggregateRoot } from '../aggregates';
import { AggregateMember } from '../aggregates/aggregate-member';
import { Entity } from '../entities';
import { Decorator } from '../helpers';
import { ObjectLiteral } from '../types';

/**
 * Manages the events of an Entity. Can be used to add, get, and flush events.
 * @privateRemarks Events are stored in a private property of the Entity accessed through the Reflect API.
 */
export class EventSink {
  private constructor() {}

  /**
   * Adds a DomainEvent to the EventSink.
   */
  public static add<DomainEvent extends ObjectLiteral>(
    entity: Entity,
    aDomainEvent: DomainEvent
  ): void {
    this.sink<DomainEvent>(entity).push(aDomainEvent);
  }

  /**
   * Returns all events of an Entity.
   */
  public static get<DomainEvent extends ObjectLiteral>(
    entity: Entity
  ): DomainEvent[] {
    const sink = this.sink<DomainEvent>(entity);

    const events: DomainEvent[] = [...sink];

    if (AggregateRoot.isRoot(entity)) {
      // Assuming aggregate members will be nested only one level deep at most
      // instead of recursively traversing the aggregate members.
      const aggregateMembers = this.getAggregateMembersFrom(entity);
      for (const aggregateMember of aggregateMembers) {
        if (this.isIterable(aggregateMember)) {
          for (const childEntity of aggregateMember) {
            events.push(...EventSink.get<DomainEvent>(childEntity));
          }
        } else {
          events.push(...EventSink.get<DomainEvent>(aggregateMember));
        }
      }
    }

    return events;
  }

  /**
   * Clears all events of an Entity and returns them.
   */
  public static flush<DomainEvent extends ObjectLiteral>(
    entity: Entity
  ): DomainEvent[] {
    const events: DomainEvent[] = EventSink.get<DomainEvent>(entity);

    Decorator.deleteMetadata(this.METADATA_SYMBOL, entity);

    if (AggregateRoot.isRoot(entity)) {
      // Assuming aggregate members will be nested only one level deep at most
      // instead of recursively traversing the aggregate members.
      const aggregateMembers = this.getAggregateMembersFrom(entity);
      for (const aggregateMember of aggregateMembers) {
        if (this.isIterable(aggregateMember)) {
          for (const childEntity of aggregateMember) {
            Decorator.deleteMetadata(this.METADATA_SYMBOL, childEntity);
          }
        } else {
          Decorator.deleteMetadata(this.METADATA_SYMBOL, aggregateMember);
        }
      }
    }

    return events;
  }

  /**
   * Returns the instance of the EventSink within the Entity.
   */
  private static sink<DomainEvent extends ObjectLiteral>(
    entity: Entity
  ): DomainEvent[] {
    if (Decorator.hasMetadata(this.METADATA_SYMBOL, entity)) {
      return Decorator.getMetadata<DomainEvent[]>(this.METADATA_SYMBOL, entity);
    }

    const sink: DomainEvent[] = [];

    Decorator.setMetadata<DomainEvent[]>(this.METADATA_SYMBOL, sink, entity);

    return sink;
  }

  /**
   * Returns the aggregate id of an object.
   */
  private static getAggregateMembersFrom(anEntity: Entity) {
    try {
      return AggregateMember.getMembers<Entity | Iterable<Entity>>(anEntity);
    } catch {
      return [];
    }
  }

  /**
   * Returns true if the object is an iterable.
   */
  private static isIterable(
    anObject: ObjectLiteral
  ): anObject is Iterable<ObjectLiteral> {
    return Boolean(anObject?.[Symbol.iterator]);
  }

  private static METADATA_SYMBOL = Symbol('__eventSink__');
}

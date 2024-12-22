import { AggregateId, AggregateRoot } from '../aggregates';
import { AggregateMember } from '../aggregates/aggregate-member';
import { Entity, EntityId, Identity } from '../entities';
import { ObjectLiteral } from '../types';

/**
 * A sink for DomainEvents.
 */
export class EventSink<DomainEvent extends ObjectLiteral> {
  private static singleton: EventSink<ObjectLiteral>;

  // TODO: Sink should be an LRU or LFU cache.
  private sink: Map<PropertyKey, DomainEvent[]> = new Map();

  private constructor() {}

  /**
   * Adds a DomainEvent to the EventSink.
   */
  public static add<DomainEvent extends ObjectLiteral>(
    aDomainEvent: DomainEvent,
    entity: Entity
  ): void {
    const { sink } = this.instance<DomainEvent>();

    const id = AggregateRoot.isRoot(entity)
      ? this.getAggregateIdFrom(entity)
      : this.getEntityIdFrom(entity);

    if (id) {
      const events = sink.get(id);
      if (events) events.push(aDomainEvent);
      else sink.set(id, [aDomainEvent]);
    }
  }

  /**
   * Returns all events of an Entity.
   */
  public static get<DomainEvent extends ObjectLiteral>(
    entity: Entity
  ): DomainEvent[] {
    const { sink } = this.instance<DomainEvent>();

    if (AggregateRoot.isRoot(entity)) {
      const events: DomainEvent[] = [];

      const aggregateId = this.getAggregateIdFrom(entity);
      if (aggregateId) events.push(...(sink.get(aggregateId) || []));

      const aggregateMembers = this.getAggregateMembersFrom(entity);

      // Assuming aggregate members will be nested only one level deep at most
      // instead of recursively traversing the aggregate members.
      for (const aggregateMember of aggregateMembers) {
        if (this.isIterable(aggregateMember)) {
          for (const childEntity of aggregateMember) {
            events.push(...EventSink.get<DomainEvent>(childEntity));
          }
        } else {
          events.push(...EventSink.get<DomainEvent>(aggregateMember));
        }
      }

      return events;
    }

    const entityId = this.getEntityIdFrom(entity);
    if (entityId) return sink.get(entityId) || [];

    return [];
  }

  /**
   * Clears all events of an Entity and returns them.
   */
  public static flush<DomainEvent extends ObjectLiteral>(
    entity: Entity
  ): DomainEvent[] {
    const { sink } = this.instance<DomainEvent>();

    if (AggregateRoot.isRoot(entity)) {
      const events: DomainEvent[] = EventSink.get<DomainEvent>(entity);

      const aggregateId = this.getAggregateIdFrom(entity);
      if (aggregateId) sink.delete(aggregateId);

      // Assuming aggregate members will be nested only one level deep at most
      // instead of recursively traversing the aggregate members.
      const aggregateMembers = this.getAggregateMembersFrom(entity);
      for (const aggregateMember of aggregateMembers) {
        if (this.isIterable(aggregateMember)) {
          for (const childEntity of aggregateMember) {
            const entityId = this.getEntityIdFrom(childEntity);
            if (entityId) sink.delete(entityId);
          }
        } else {
          const entityId = this.getEntityIdFrom(aggregateMember);
          if (entityId) sink.delete(entityId);
        }
      }

      return events;
    } else {
      const events = EventSink.get<DomainEvent>(entity);

      const entityId = this.getEntityIdFrom(entity);
      if (entityId) sink.delete(entityId);

      return events;
    }
  }

  /**
   * Returns the singleton instance of the EventSink.
   */
  private static instance<
    DomainEvent extends ObjectLiteral
  >(): EventSink<DomainEvent> {
    if (!EventSink.singleton) EventSink.singleton = new EventSink();
    return EventSink.singleton as EventSink<DomainEvent>;
  }

  /**
   * Returns the aggregate id of an object.
   */
  private static getAggregateIdFrom(anObject: ObjectLiteral) {
    try {
      const id = AggregateId.getId<Identity['value'] | Identity>(anObject);
      if (id instanceof Identity) return id.unpack();
      else return id;
    } catch {
      return undefined;
    }
  }

  /**
   * Returns the aggregate id of an object.
   */
  private static getAggregateMembersFrom(anEntity: Entity) {
    return AggregateMember.getMembers<Entity | Iterable<Entity>>(anEntity);
  }

  /**
   * Returns the entity id of an object.
   */
  private static getEntityIdFrom(anObject: ObjectLiteral) {
    try {
      const id = EntityId.getId<Identity['value'] | Identity>(anObject);
      if (id instanceof Identity) return id.unpack();
      else return id;
    } catch {
      return undefined;
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
}

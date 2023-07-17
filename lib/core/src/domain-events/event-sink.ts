import { AggregateId, AggregateRoot } from '../aggregates';
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
    aDomainEvent: DomainEvent
  ): void {
    const { sink } = this.instance<DomainEvent>();

    const aggregateId = this.getAggregateIdFrom(aDomainEvent);

    const events = sink.get(aggregateId);

    if (events) events.push(aDomainEvent);
    else sink.set(aggregateId, [aDomainEvent]);
  }

  /**
   * Returns all events of an Entity.
   */
  public static get<DomainEvent extends ObjectLiteral>(
    entity: Entity
  ): DomainEvent[] {
    const { sink } = this.instance<DomainEvent>();

    if (AggregateRoot.isRoot(entity)) {
      return sink.get(this.getAggregateIdFrom(entity)) || [];
    } else {
      if (!AggregateId.hasId(entity) || !EntityId.hasId(entity)) return [];

      const aggregateId = this.getAggregateIdFrom(entity);
      const entityId = this.getEntityIdFrom(entity)!;

      const events = sink.get(aggregateId) || [];

      const res = events.filter((event) => {
        const eventEntityId = this.getEntityIdFrom(event);

        if (eventEntityId) return entityId === eventEntityId;
        else return false;
      });

      return res;
    }
  }

  /**
   * Clears all events of an Entity and returns them.
   */
  public static flush<DomainEvent extends ObjectLiteral>(
    entity: Entity
  ): DomainEvent[] {
    const { sink } = this.instance<DomainEvent>();

    if (AggregateRoot.isRoot(entity)) {
      const events = EventSink.get<DomainEvent>(entity);
      sink.delete(this.getAggregateIdFrom(entity));
      return events;
    } else {
      if (!AggregateId.hasId(entity) || !EntityId.hasId(entity)) return [];

      const aggregateId = this.getAggregateIdFrom(entity);
      const entityId = this.getEntityIdFrom(entity)!;

      const aggregateEvents = sink.get(aggregateId) || [];

      const { events, remaining } = aggregateEvents.reduce<
        Record<'events' | 'remaining', DomainEvent[]>
      >(
        ({ events, remaining }, event) => {
          const eventEntityId = this.getEntityIdFrom(event);

          if (eventEntityId && entityId === eventEntityId) events.push(event);
          else remaining.push(event);

          return { events, remaining };
        },
        { events: [], remaining: [] }
      );

      sink.set(aggregateId, remaining);

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
  private static getAggregateIdFrom(anObject: ObjectLiteral): PropertyKey {
    const id = AggregateId.getId<PropertyKey | Identity>(anObject);
    if (id instanceof Identity) return id.unpack();
    else return id;
  }

  /**
   * Returns the entity id of an object.
   */
  private static getEntityIdFrom(
    anObject: ObjectLiteral
  ): PropertyKey | undefined {
    try {
      const id = EntityId.getId<PropertyKey | Identity>(anObject);
      if (id instanceof Identity) return id.unpack();
      else return id;
    } catch {
      return undefined;
    }
  }
}

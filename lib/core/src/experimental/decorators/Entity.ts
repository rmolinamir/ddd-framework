import { ObjectLiteral } from '../../types';
import { DomainPrimitive } from '../../value_objects';
import { getAggregateRootIdOf } from './aggregate/root';
import { getEntityIdOf } from './EntityId';
import EventSink from './EventSink';

/**
 * Entities are not fundamentally defined by their properties, but rather by a thread
 * of continuity and identity. An object defined primarily by its identity is called
 * an Entity.
 */
export default abstract class Entity<
  DomainEvent extends ObjectLiteral = ObjectLiteral
> {
  public get events(): readonly DomainEvent[] {
    return EventSink.get(this.aggregateRootId());
  }

  public aggregateRootId<Identity>() {
    return getAggregateRootIdOf<Identity>(this);
  }

  public entityId<Identity>() {
    return getEntityIdOf<Identity>(this);
  }

  public equals(anotherEntity: Entity): boolean {
    const entityId = this.entityId();

    if (entityId instanceof DomainPrimitive)
      return entityId.equals(anotherEntity.entityId());
    else return entityId === anotherEntity.entityId();
  }

  public notEquals(anotherEntity: Entity): boolean {
    return !this.equals(anotherEntity);
  }

  /**
   * Raises a Domain Event by adding it to the list of pending events of the Aggregate root.
   * Should be called after any state change.
   */
  protected raise(aDomainEvent: DomainEvent): void {
    if (this.validateInvariants) this.validateInvariants();
    EventSink.add(this.aggregateRootId(), aDomainEvent);
  }

  /**
   * Releases the list of pending events by emptying the list and returning the events.
   */
  public releasePendingEvents(): DomainEvent[] {
    return EventSink.flush(this.aggregateRootId());
  }

  /**
   * Validates any defined invariants depending on its implementation.
   * It's an optional abstract method that, if defined, will be called before raising events.
   */
  protected validateInvariants?(): void;
}

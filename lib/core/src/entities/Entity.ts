import { IdentifiedDomainObject, Identity } from '../common';
import { DomainEvent, EventSink } from '../domain_events';

/**
 * Entities are not fundamentally defined by their properties, but rather by a thread
 * of continuity and identity. An object defined primarily by its identity is called
 * an Entity.
 */
export default abstract class Entity<
  Id extends Identity = Identity,
  EntityEvent extends DomainEvent<any> = DomainEvent<any>
> extends IdentifiedDomainObject<Id> {
  public equals(
    anIdentifiedDomainObject: IdentifiedDomainObject<Identity>
  ): boolean {
    return this.id.equals(anIdentifiedDomainObject.id);
  }

  public notEquals(
    anIdentifiedDomainObject: IdentifiedDomainObject<Identity>
  ): boolean {
    return !this.equals(anIdentifiedDomainObject);
  }

  /**
   * Raises a Domain Event by adding it to the list of pending events of the Aggregate root.
   * Should be called after any Entity state change.
   */
  protected raise(aDomainEvent: EntityEvent, aggregateId: Identity): void {
    if (this.validateInvariants) this.validateInvariants();
    EventSink.add(aggregateId, aDomainEvent);
  }

  /**
   * Validates any defined invariants depending on its implementation.
   * It's an optional abstract method that, if defined, will be called before raising events.
   */
  protected validateInvariants?(): void;
}

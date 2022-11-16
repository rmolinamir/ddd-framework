import { Identity } from '../common';
import { DomainEvent, EventSink } from '../domain_events';
import { Entity } from '../entities';
import { DateValue } from '../value_objects';

/**
 * Entity serving as an Aggregate Root of an object cluster composed of
 * Entities and Value Objects for transactional boundaries.
 */
export default abstract class AggregateRoot<
  Id extends Identity = Identity,
  AggregateEvent extends DomainEvent<any> = DomainEvent<any>
> extends Entity<Id> {
  // TODO: Convert into a class method rather than a getter accessor.
  public get events(): readonly AggregateEvent[] {
    return EventSink.get(this.id);
  }

  constructor(
    public createdAt: DateValue = DateValue.now(),
    public updatedAt: DateValue = createdAt
  ) {
    super();
  }

  /**
   * Raises a Domain Event by adding it to the list of pending events.
   * Should be called after any Aggretate state change.
   */
  protected raise(aDomainEvent: AggregateEvent): void {
    this.changeUpdatedTimestamp();
    if (this.validateInvariants) this.validateInvariants();
    EventSink.add(this.id, aDomainEvent);
  }

  /**
   * Releases the list of pending events by emptying the list and returning the events.
   */
  public releasePendingEvents(): AggregateEvent[] {
    return EventSink.flush(this.id);
  }

  /**
   * Changes the updated date timestamp.
   * Automatically called when raising events (if enabled in the `raise` method parameters, and it's also enabled by default).
   */
  public changeUpdatedTimestamp(date: DateValue = DateValue.now()): void {
    this.updatedAt = date;
  }

  /**
   * Validates any defined invariants depending on its implementation.
   * It's an optional abstract method that, if defined, will be called before raising events.
   */
  protected validateInvariants?(): void;
}

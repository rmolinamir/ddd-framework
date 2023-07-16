import {
  DateValue,
  DomainEvent,
  IdentifiedDomainObject,
  Identity
} from '@ddd-framework/core';

import { Entity } from '../entities';

export default abstract class AggregateRoot<
  Id extends Identity<any> = Identity<any>,
  AggregateEvent extends DomainEvent<any> = DomainEvent<any>
> extends IdentifiedDomainObject<Id> {
  constructor(
    public createdAt: DateValue = DateValue.now(),
    public updatedAt?: DateValue
  ) {
    super();
  }

  /**
   * AggreateRoot version incremented every time a state-altering command is executed anywhere inside the Aggregate boundary, no matter how deep.
   * Can be used to implement Optimistic Concurrency.
   */
  public version = 0;

  /**
   * Uncommited changes to the state are expressed as new Events, and are
   * accumulated in this property.
   */
  private changes: AggregateEvent[] = [];

  /**
   * Returns list of uncommited changes to the state expressed as Events.
   */
  public getChanges(): AggregateEvent[] {
    return this.changes;
  }

  /**
   * Clears uncommited changes. Meant to be called after appending events to the EventStore.
   */
  public clearChanges(): void {
    this.changes = [];
  }

  /**
   * Loads the aggregate state by handling a list of events.
   * Meant to be called after loading the event stream from the EventStore.
   */
  public load(anEvent: AggregateEvent): void;
  public load(anEventList: AggregateEvent[]): void;
  public load(arg: AggregateEvent | AggregateEvent[]): void {
    if (Array.isArray(arg)) for (const event of arg) this.mutate(event);
    else this.mutate(arg);
  }

  /**
   * Used to mutate the current state of the Aggregate by handling the event.
   * Validates the invariants and saves the changes after handling.
   */
  protected apply(anEvent: AggregateEvent) {
    this.mutate(anEvent);
    this.validateInvariants();
    this.changes.push(anEvent);
  }

  /**
   * Used to mutate the current state of an Aggregate child Entity, by handling the event through the Entity event handler.
   */
  protected applyOnEntity<
    Event extends DomainEvent<any>,
    ChildEntity extends Entity<Id, Event>
  >(anEvent: Event, anEntity: ChildEntity): void {
    anEntity.mutate(anEvent);
  }

  /**
   * Handles an event by mutating state through `when` and bumps the aggregate version.
   */
  protected mutate(anEvent: AggregateEvent): void {
    this.when(anEvent);
    this.version += 1;
  }

  /**
   * Validates the Aggregate invariants, should throw if invalid.
   */
  protected abstract validateInvariants(): void;

  /**
   * Handles an event by mutating the in-memory state of the Aggregate.
   */
  protected abstract when(event: AggregateEvent): void;
}

import { Identity } from '@ddd-framework/core';

import AggregateRoot from './AggregateRoot';

/**
 * Reconstitute an Aggregate by using its unique identity by loading events from the Event Store.
 */
export default abstract class AggregateStore {
  /**
   * Appends new events to the aggregate stream, then clear the aggregate changes.
   */
  public abstract save<Aggregate extends AggregateRoot>(
    anAggregate: Aggregate
  ): Promise<Aggregate>;

  /**
   * Loads an aggregate from all events of a stream.
   */
  public abstract load<Aggregate extends AggregateRoot>(
    anId: Identity,
    anAggregate: Aggregate
  ): Promise<Aggregate>;

  /**
   * Checks if an Aggregate exists by checking if the stream exists.
   */
  public abstract exists<Id extends Identity>(anId: Id): Promise<boolean>;
}

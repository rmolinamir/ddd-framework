import { UnitOfWork } from '../repositories';

/**
 * Use the Event Store as a queue for publishing all Domain Events through
 * a messaging infrastructure. This is one of its the primary uses. It
 * allows integrations between Bounded Contexts, where remote subscribers
 * react to the Events in terms of their own contextual needs.
 *
 * You might use for other cases, such as but not limited to:
 * - Feed REST-based Event notifications to polling clients.
 * - Examine a historical record of the result of every command that has ever
 * been executed on the model.
 * - Use the data in trending, forecasting, and for other business analytics.
 * - Use the Events to reconstitute each Aggregate instance (Event Sourcing).
 * - Given an application of the preceding point, undo blocks of changes to an
 * Aggregate.
 */
export default abstract class EventStore<Record> {
  /**
   * Append the DomainEvent to the end of the EventStore.
   * It is recommended to first serialize the DomainEvent.
   */
  public abstract append(
    record: Record,
    unitOfWork?: UnitOfWork
  ): Promise<Record>;

  /**
   * Append many DomainEvents to the end of the EventStore.
   * It is recommended to first serialize the DomainEvent.
   */
  public abstract appendMany(
    records: Record[],
    unitOfWork?: UnitOfWork
  ): Promise<Record[]>;
}

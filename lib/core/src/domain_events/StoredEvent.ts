import { ObjectLiteral } from '../types';

/**
 * Serialized DomainEvents persisted in the EventStore.
 */
export default abstract class StoredEvent<
  SerializedDomainEvent = ObjectLiteral
> {
  /**
   * Copy of the DomainEvent `eventId`.
   */
  public abstract readonly eventId: string;

  /**
   * Copy of the `eventType` in the DomainEvent metadata.
   */
  public abstract readonly eventType: string;

  /**
   * Copy of the `eventVersion` in the DomainEvent metadata.
   */
  public abstract readonly eventVersion: string | number;

  /**
   * Serialized DomainEvent.
   * A possible serialization to be used is JSON, or it could just use another form.
   */
  public abstract readonly eventBody: SerializedDomainEvent;

  /**
   * Copy of the `occurredOn` in the DomainEvent metadata.
   */
  public abstract readonly occurredOn: Date;
}

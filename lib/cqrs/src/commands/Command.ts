/**
 * Commands are are part of the core domain model and follow the same semantics as Events.
 * Commands are serializable method calls in the domain model, they represent what the clients can do with the application.
 */
export default abstract class Command<
  Data = unknown,
  Id extends string | number = string | number
> {
  public readonly commandId: Id;

  /**
   * Data that describes the event, such as the id, aggregate, timestamp, etc.
   */
  public readonly metadata: {
    occurredOn: string;
  };

  /**
   * The serialized intent/action of the actor.
   */
  public readonly data: Data;

  // TODO: Constructor overloads taking, metadata, data, etc.
  // !> Should be able to instantiate a new command from multiple ways!
  constructor(commandId: Id, metadata: Command['metadata'], data: Data) {
    this.commandId = commandId;

    this.metadata = metadata;

    this.data = data;
  }
}

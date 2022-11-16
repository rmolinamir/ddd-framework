import { DataTransferObject } from '@ddd-framework/core';

export default abstract class Query<
  Data = unknown,
  Id extends string | number = string | number
> {
  public readonly queryId: Id;

  /**
   * The serialized intent/action of the actor.
   */
  public readonly data: DataTransferObject<Data>;

  // TODO: Constructor overloads taking, metadata, data, etc.
  // !> Should be able to instantiate a new command from multiple ways!
  constructor(queryId: Id, data: DataTransferObject<Data>) {
    this.queryId = queryId;

    this.data = data;
  }
}

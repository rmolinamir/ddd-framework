/**
 * Represents a unit of work, which encapsulates a set of operations that should be treated as a single transaction.
 * This pattern is used to manage the persistence of domain objects.
 */
export abstract class UnitOfWork {
  /**
   * Starts the unit of work, initializing any necessary resources or connections.
   * This method should be called before performing any operations within the unit of work.
   * @returns A promise that resolves when the unit of work has started successfully.
   */
  public abstract start?(): Promise<void>;

  /**
   * Commits the changes made within the unit of work.
   * This method should persist the changes to the underlying data store.
   * @returns A promise that resolves when the changes have been successfully committed.
   */
  public abstract commit(): Promise<void>;

  /**
   * Rolls back the changes made within the unit of work.
   * This method should undo any changes made since the unit of work was started.
   * @returns A promise that resolves when the changes have been successfully rolled back.
   */
  public abstract rollback(): Promise<void>;
}

/**
 * Represents a transaction in the domain-driven design (DDD) framework.
 *
 * A transaction ensures the atomicity, consistency, isolation, and durability (ACID) properties
 * when performing operations on a data store. It provides a way to rollback changes made within the transaction if
 * necessary.
 */
export abstract class Transaction {
  /**
   * Rolls back the changes made within the transaction.
   * @returns A promise that resolves when the rollback operation is complete.
   */
  public abstract rollback(): Promise<never>;
}

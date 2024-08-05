import { Transaction } from './transaction';

/**
 * Represents an abstract class for managing transactions in a Domain-Driven Design (DDD) framework.
 * This class sets a transactional boundary by passing an async callback with a transaction at the top of the context.
 */
export abstract class TransactionManager {
  /**
   * Starts a new transaction and executes the provided callback within the transaction context.
   * @param callback - The async callback function that will be executed within the transaction context.
   * @returns A Promise that resolves when the transaction and the callback have completed successfully.
   */
  public abstract startTransaction(
    callback: (transaction: Transaction) => Promise<void>
  ): Promise<void>;

  /**
   * Creates a savepoint within the specified transaction and executes the provided callback within the savepoint context.
   * @param transaction - The transaction in which the savepoint will be created.
   * @param callback - The async callback function that will be executed within the savepoint context.
   * @returns A Promise that resolves when the savepoint and the callback have completed successfully.
   */
  public abstract savePoint(
    transaction: Transaction,
    callback: (nestedTransaction: Transaction) => Promise<void>
  ): Promise<void>;
}

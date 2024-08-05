import { TransactionRollbackError } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { AsyncLocalStorage } from 'node:async_hooks';
import {
  InvalidOperationException,
  TransactionManager
} from '@ddd-framework/core';
import { NodePgDatabaseTransaction, PgTransaction } from './pg-transaction';

export class PgTransactionManager extends TransactionManager {
  constructor(protected db: NodePgDatabase) {
    super();
  }

  public startTransaction(
    callback: (transaction: PgTransaction) => Promise<void>
  ): Promise<void> {
    return PgTransactionManager.createTransaction(this.db, callback);
  }

  public savePoint(
    transaction: PgTransaction,
    callback: (nestedTransaction: PgTransaction) => Promise<void>
  ): Promise<void> {
    return PgTransactionManager.createTransaction(
      transaction.context,
      callback
    );
  }

  private static store = new AsyncLocalStorage<NodePgDatabaseTransaction>();

  private static async createTransaction(
    pgDriver: NodePgDatabase | NodePgDatabaseTransaction,
    callback: (transaction: PgTransaction) => Promise<void>
  ): Promise<void> {
    try {
      await pgDriver.transaction((context) => {
        const transaction = new PgTransaction(this.store);
        return this.store.run(context, () => callback(transaction));
      });
    } catch (error) {
      if (error instanceof TransactionRollbackError) return;
      const err = error instanceof Error ? error : new Error('Unknown error');
      throw new InvalidOperationException(err.message, error);
    }
  }
}

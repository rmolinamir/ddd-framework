import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { AsyncLocalStorage } from 'node:async_hooks';
import { TransactionManager } from '@ddd-framework/core';
import { NodePgDatabaseTransaction, PgTransaction } from './pg-transaction.js';

export class PgTransactionManager extends TransactionManager {
  constructor(protected db: NodePgDatabase) {
    super();
  }

  public startTransaction<Result>(
    callback: (transaction: PgTransaction) => Promise<Result>
  ) {
    return PgTransactionManager.createTransaction<Result>(this.db, callback);
  }

  public savePoint<Result>(
    transaction: PgTransaction,
    callback: (nestedTransaction: PgTransaction) => Promise<Result>
  ) {
    return PgTransactionManager.createTransaction<Result>(
      transaction.context,
      callback
    );
  }

  private static store = new AsyncLocalStorage<NodePgDatabaseTransaction>();

  private static async createTransaction<Result>(
    pgDriver: NodePgDatabase | NodePgDatabaseTransaction,
    callback: (transaction: PgTransaction) => Promise<Result>
  ) {
    return pgDriver.transaction<Result>((context) => {
      const transaction = new PgTransaction(this.store);
      return this.store.run(context, () => callback(transaction));
    });
  }
}

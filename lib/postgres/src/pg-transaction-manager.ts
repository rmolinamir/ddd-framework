import { AsyncLocalStorage } from 'node:async_hooks';
import { TransactionManager } from '@ddd-framework/core';
import { PgDatabaseTransaction, PgTransaction } from './pg-transaction.js';
import { DrizzlePgDatabase } from './drizzle-pg-database.js';

export class PgTransactionManager<
  PgDatabase extends DrizzlePgDatabase = DrizzlePgDatabase
> extends TransactionManager {
  constructor(public db: PgDatabase) {
    super();
  }

  public startTransaction<Result>(
    callback: (transaction: PgTransaction) => Promise<Result>
  ) {
    return PgTransactionManager.createTransaction<Result, PgDatabase>(
      this.db,
      callback
    );
  }

  public savePoint<Result>(
    transaction: PgTransaction,
    callback: (nestedTransaction: PgTransaction) => Promise<Result>
  ) {
    return PgTransactionManager.createTransaction<Result, PgDatabase>(
      transaction.context,
      callback
    );
  }

  private static store = new AsyncLocalStorage<PgDatabaseTransaction>();

  private static async createTransaction<
    Result,
    PgDatabase extends DrizzlePgDatabase = DrizzlePgDatabase
  >(
    pgDriver: PgDatabase | PgDatabaseTransaction,
    callback: (transaction: PgTransaction) => Promise<Result>
  ) {
    return pgDriver.transaction<Result>((context) => {
      const transaction = new PgTransaction(this.store);
      return this.store.run(context, () => callback(transaction));
    });
  }
}

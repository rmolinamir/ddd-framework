import { TransactionRollbackError } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { AsyncLocalStorage } from 'node:async_hooks';
import {
  InvalidOperationException,
  TransactionManager
} from '@ddd-framework/core';
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
    try {
      const res = await pgDriver.transaction<Result>((context) => {
        const transaction = new PgTransaction(this.store);
        return this.store.run(context, () => callback(transaction));
      });
      return res;
    } catch (error) {
      // Needed to cast because unreachable code after a `rollback` is not detected by the TypeScript compiler,
      // even though the `ReturnType` of the `rollback` is `never`
      // This is a workaround to make it work for now until it's fixed.
      if (error instanceof TransactionRollbackError) return undefined as Result;
      const err = error instanceof Error ? error : new Error('Unknown error');
      throw new InvalidOperationException(err.message, error);
    }
  }
}

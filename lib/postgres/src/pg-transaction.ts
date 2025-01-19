import { AsyncLocalStorage } from 'node:async_hooks';
import { IllegalStateException, Transaction } from '@ddd-framework/core';
import { DrizzlePgDatabase } from './drizzle-pg-database.js';

export type PgDatabaseTransaction<
  PgDatabase extends DrizzlePgDatabase = DrizzlePgDatabase
> = Parameters<Parameters<PgDatabase['transaction']>[0]>[0];

export class PgTransaction implements Transaction {
  constructor(private store: AsyncLocalStorage<PgDatabaseTransaction>) {}

  public get context(): PgDatabaseTransaction {
    const context = this.store.getStore();
    if (!context)
      throw new IllegalStateException(
        'Postgres Transaction context is not found, did you forget to run the async local storage?'
      );
    return context;
  }

  public rollback(): Promise<never> {
    return Promise.resolve(this.context.rollback());
  }
}

import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { AsyncLocalStorage } from 'node:async_hooks';
import { IllegalStateException, Transaction } from '@ddd-framework/core';

export type NodePgDatabaseTransaction<
  Pg extends NodePgDatabase = NodePgDatabase
> = Parameters<Parameters<Pg['transaction']>[0]>[0];

export class PgTransaction implements Transaction {
  constructor(private store: AsyncLocalStorage<NodePgDatabaseTransaction>) {}

  public get context(): NodePgDatabaseTransaction {
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

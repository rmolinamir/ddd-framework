import { TransactionManager } from '@ddd-framework/core';
import { Global, Module } from '@nestjs/common';
import { PgTransactionManager } from '../pg-transaction-manager.js';
import { PgDatabase } from 'drizzle-orm/pg-core';
import { DrizzlePgDatabase } from '../drizzle-pg-database.js';

@Global()
@Module({
  providers: [
    {
      provide: TransactionManager,
      useFactory: (db: DrizzlePgDatabase) => new PgTransactionManager(db),
      inject: [PgDatabase]
    }
  ],
  exports: [TransactionManager]
})
export class PgTransactionManagerModule {}

import { TransactionManager } from '@ddd-framework/core';
import { Module } from '@nestjs/common';
import { PgTransactionManager } from '../pg-transaction-manager';

@Module({
  providers: [{ provide: TransactionManager, useClass: PgTransactionManager }],
  exports: [TransactionManager]
})
export class PgTransactionManagerModule {}

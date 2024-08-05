import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { TransactionManager } from '@ddd-framework/core';
import { Test, TestingModule } from '@nestjs/testing';
import { DrizzleOrmModule } from '../nestjs/drizzle-orm.module';
import { PgTransactionManagerModule } from '../nestjs/pg-transaction.module';
import { PgTransactionManager } from '../pg-transaction-manager';

describe('PgTransactionManagerModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        DrizzleOrmModule.forRoot({ db: globalThis.__pgClient }),
        PgTransactionManagerModule
      ]
    }).compile();

    await module.init();
  });

  afterAll(async () => {
    await module?.close();
  });

  test('module returns an instance of PgTransactionManager', () => {
    const manager = module.get(TransactionManager);
    expect(manager).toBeInstanceOf(PgTransactionManager);
  });
});

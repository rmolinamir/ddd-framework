import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test
} from 'vitest';
import { TransactionManager } from '@ddd-framework/core';
import { Test, TestingModule } from '@nestjs/testing';
import { PgTransactionManagerModule } from '../nestjs/pg-transaction-manager.module.js';
import { PgTransactionManager } from '../pg-transaction-manager.js';
import { PgDatabase } from 'drizzle-orm/pg-core';
import { Uuid } from '@ddd-framework/uuid';
import { testTable1 } from './test.table.js';
import { DrizzleOrmModule } from '../nestjs/drizzle-orm.module.js';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { expectEntries } from './assertions.js';

describe('PgTransactionManagerModule', () => {
  let module: TestingModule;
  let db: NodePgDatabase;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        DrizzleOrmModule.forRoot({ pg: globalThis.__pgClient }),
        PgTransactionManagerModule
      ]
    }).compile();

    db = module.get(PgDatabase);

    await module.init();
  });

  beforeEach(async () => {
    await db.delete(testTable1);
  });

  afterAll(async () => {
    await module?.close();
  });

  test('module returns an instance of PgTransactionManager', () => {
    const manager = module.get<PgTransactionManager>(TransactionManager);

    expect(manager).toBeInstanceOf(PgTransactionManager);
  });

  test('starts transaction and implicitly commits', async () => {
    const firstId = Uuid.generate();
    const secondId = Uuid.generate();

    const manager = module.get<PgTransactionManager>(TransactionManager);

    await manager.startTransaction(async (transaction) => {
      await transaction.context
        .insert(testTable1)
        .values([{ id: firstId }, { id: secondId }]);
    });

    await expectEntries(db, testTable1, [{ id: firstId }, { id: secondId }]);
  });
});

import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { PgDatabase } from 'drizzle-orm/pg-core';
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
  vi
} from 'vitest';
import { Uuid } from '@ddd-framework/uuid';
import { Test, TestingModule } from '@nestjs/testing';
import { DrizzleOrmModule } from '../nestjs/drizzle-orm.module.js';
import { PgTransactionManager } from '../pg-transaction-manager.js';
import { NodePgDatabaseTransaction } from '../pg-transaction.js';
import { testTable } from './test.table.js';

export const expectEntries = vi.fn(
  async (
    context: NodePgDatabase | NodePgDatabaseTransaction,
    expected: typeof testTable.$inferSelect[]
  ) => expect(context.select().from(testTable)).resolves.toMatchObject(expected)
);

describe('PgTransactionManager', () => {
  let module: TestingModule;
  let db: NodePgDatabase;
  let manager: PgTransactionManager;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DrizzleOrmModule.forRoot({ client: globalThis.__pgClient })]
    }).compile();

    await module.init();

    db = module.get(PgDatabase);

    // This would be returned by a dependency injection container.
    manager = new PgTransactionManager(db);
  });

  beforeEach(async () => {
    await db.delete(testTable);
  });

  afterEach(async () => {
    vi.clearAllMocks();
  });

  afterAll(async () => {
    await module?.close();
  });

  test('starts transaction and implicitly commits', async () => {
    const firstId = Uuid.generate();
    const secondId = Uuid.generate();

    await manager.startTransaction(async (transaction) => {
      await transaction.context
        .insert(testTable)
        .values([{ id: firstId }, { id: secondId }]);
    });

    await expectEntries(db, [{ id: firstId }, { id: secondId }]);
  });

  test('returns result from transaction', async () => {
    const firstId = Uuid.generate();
    const secondId = Uuid.generate();

    const result = await manager.startTransaction(async (transaction) => {
      await transaction.context
        .insert(testTable)
        .values([{ id: firstId }, { id: secondId }]);

      return true;
    });

    expect(result).toBe(true);
  });

  test('returns undefined when transaction is rolled back', async () => {
    const firstId = Uuid.generate();
    const secondId = Uuid.generate();

    const result = await manager.startTransaction(async (transaction) => {
      await transaction.context
        .insert(testTable)
        .values([{ id: firstId }, { id: secondId }]);

      await transaction.rollback();
    });

    expect(result).toBeUndefined();
  });

  test('transaction is not committed when rolled back', async () => {
    const firstId = Uuid.generate();
    const secondId = Uuid.generate();

    await manager.startTransaction(async (transaction) => {
      await transaction.context
        .insert(testTable)
        .values([{ id: firstId }, { id: secondId }]);

      await transaction.rollback();
    });

    await expectEntries(db, []);
  });

  test('nested transaction is not committed when rolled back', async () => {
    const firstId = Uuid.generate();
    const secondId = Uuid.generate();
    const thirdId = Uuid.generate();
    const fourthId = Uuid.generate();

    await manager.startTransaction(async (transaction) => {
      await transaction.context
        .insert(testTable)
        .values([{ id: firstId }, { id: secondId }]);

      await expectEntries(transaction.context, [
        { id: firstId },
        { id: secondId }
      ]);

      await manager.savePoint(transaction, async (nestedTransaction) => {
        await nestedTransaction.context
          .insert(testTable)
          .values([{ id: thirdId }, { id: fourthId }]);

        await expectEntries(nestedTransaction.context, [
          { id: firstId },
          { id: secondId },
          { id: thirdId },
          { id: fourthId }
        ]);

        await nestedTransaction.rollback();
      });
    });

    await expectEntries(db, [{ id: firstId }, { id: secondId }]);
  });
});

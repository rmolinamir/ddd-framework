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
import { testTable2 } from './test.table.js';
import { InvalidOperationException } from '@ddd-framework/core';
import { expectEntries } from './assertions.js';
import { Pool } from 'pg';

describe('PgTransactionManager', () => {
  let module: TestingModule;
  let db: NodePgDatabase;
  let manager: PgTransactionManager;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DrizzleOrmModule.forRoot({ pg: globalThis.__pgClient })]
    }).compile();

    await module.init();

    db = module.get(PgDatabase);

    // This would be returned by a dependency injection container.
    manager = new PgTransactionManager(db);
  });

  beforeEach(async () => {
    await db.delete(testTable2);
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
        .insert(testTable2)
        .values([{ id: firstId }, { id: secondId }]);
    });

    await expectEntries(db, testTable2, [{ id: firstId }, { id: secondId }]);
  });

  test('returns result from transaction', async () => {
    const firstId = Uuid.generate();
    const secondId = Uuid.generate();

    const result = await manager.startTransaction(async (transaction) => {
      await transaction.context
        .insert(testTable2)
        .values([{ id: firstId }, { id: secondId }]);

      return true;
    });

    expect(result).toBe(true);

    await expectEntries(db, testTable2, [{ id: firstId }, { id: secondId }]);
  });

  test('transactions are automatically rolled back when an error occurs', async () => {
    const firstId = Uuid.generate();
    const secondId = Uuid.generate();

    await expect(() =>
      manager.startTransaction(async (transaction) => {
        await transaction.context
          .insert(testTable2)
          .values([{ id: firstId }, { id: secondId }]);

        throw new InvalidOperationException('An error occurred');
      })
    ).rejects.toThrow('An error occurred');

    await expectEntries(db, testTable2, []);
  });

  test('returns undefined when transaction is rolled back (unreachable code)', async () => {
    const firstId = Uuid.generate();
    const secondId = Uuid.generate();

    let result: boolean | undefined;

    try {
      result = await manager.startTransaction(async (transaction) => {
        await transaction.context
          .insert(testTable2)
          .values([{ id: firstId }, { id: secondId }]);

        await transaction.rollback();

        return false;
      });
    } catch {}

    expect(result).toBeUndefined();

    await expectEntries(db, testTable2, []);
  });

  test('transaction is not committed when manually rolled back', async () => {
    const firstId = Uuid.generate();
    const secondId = Uuid.generate();

    await expect(() =>
      manager.startTransaction(async (transaction) => {
        await transaction.context
          .insert(testTable2)
          .values([{ id: firstId }, { id: secondId }]);

        await transaction.rollback();
      })
    ).rejects.toThrow();

    await expectEntries(db, testTable2, []);
  });

  test('nested transaction is not committed when rolled back', async () => {
    const firstId = Uuid.generate();
    const secondId = Uuid.generate();
    const thirdId = Uuid.generate();
    const fourthId = Uuid.generate();

    await manager.startTransaction(async (transaction) => {
      await transaction.context
        .insert(testTable2)
        .values([{ id: firstId }, { id: secondId }]);

      await expectEntries(transaction.context, testTable2, [
        { id: firstId },
        { id: secondId }
      ]);

      await expect(() =>
        manager.savePoint(transaction, async (nestedTransaction) => {
          await nestedTransaction.context
            .insert(testTable2)
            .values([{ id: thirdId }, { id: fourthId }]);

          await expectEntries(nestedTransaction.context, testTable2, [
            { id: thirdId },
            { id: fourthId }
          ]);

          await nestedTransaction.rollback();
        })
      ).rejects.toThrow();
    });

    await expectEntries(db, testTable2, [{ id: firstId }, { id: secondId }]);
  });
});

describe('PgTransactionManager with a pool', () => {
  let module: TestingModule;
  let db: NodePgDatabase;
  let manager: PgTransactionManager;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        DrizzleOrmModule.forRoot({ pg: new Pool(globalThis.__dbCredentials) })
      ]
    }).compile();

    await module.init();

    db = module.get(PgDatabase);

    // This would be returned by a dependency injection container.
    manager = new PgTransactionManager(db);
  });

  beforeEach(async () => {
    await db.delete(testTable2);
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
        .insert(testTable2)
        .values([{ id: firstId }, { id: secondId }]);
    });

    await expectEntries(db, testTable2, [{ id: firstId }, { id: secondId }]);
  });

  test('returns result from transaction', async () => {
    const firstId = Uuid.generate();
    const secondId = Uuid.generate();

    const result = await manager.startTransaction(async (transaction) => {
      await transaction.context
        .insert(testTable2)
        .values([{ id: firstId }, { id: secondId }]);

      return true;
    });

    expect(result).toBe(true);

    await expectEntries(db, testTable2, [{ id: firstId }, { id: secondId }]);
  });

  test('transactions are automatically rolled back when an error occurs', async () => {
    const firstId = Uuid.generate();
    const secondId = Uuid.generate();

    await expect(() =>
      manager.startTransaction(async (transaction) => {
        await transaction.context
          .insert(testTable2)
          .values([{ id: firstId }, { id: secondId }]);

        throw new InvalidOperationException('An error occurred');
      })
    ).rejects.toThrow('An error occurred');

    await expectEntries(db, testTable2, []);
  });
});

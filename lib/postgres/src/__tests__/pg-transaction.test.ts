import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { PgDatabase } from 'drizzle-orm/pg-core';
import { AsyncLocalStorage } from 'node:async_hooks';
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  MockInstance,
  test,
  vi
} from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { DrizzleOrmModule } from '../nestjs/drizzle-orm.module.js';
import { PgDatabaseTransaction, PgTransaction } from '../pg-transaction.js';

describe('PgTransaction', () => {
  const store = new AsyncLocalStorage<PgDatabaseTransaction>();
  let module: TestingModule;
  let db: NodePgDatabase;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DrizzleOrmModule.forRoot({ pg: globalThis.__pgClient })]
    }).compile();

    await module.init();

    db = module.get(PgDatabase);
  });

  afterEach(async () => {
    vi.clearAllMocks();
  });

  afterAll(async () => {
    await module?.close();
  });

  test('correctly accesses the context', async () => {
    await db.transaction(async (context) => {
      const transaction = new PgTransaction(store);
      return store.run(context, () => {
        expect(transaction.context).toBeDefined();
      });
    });
  });

  test('throws if accesses context outside the store', async () => {
    await db.transaction(async () => {
      const transaction = new PgTransaction(store);
      expect(() => transaction.context).toThrowError();
    });
  });

  test('correctly rolls back a transaction', async () => {
    let rollbackSpy: MockInstance | undefined;

    await db.transaction(async (context) => {
      rollbackSpy = vi.spyOn(context, 'rollback');
      const transaction = new PgTransaction(store);
      return store.run(context, () =>
        expect(() => transaction.rollback()).toThrowError()
      );
    });

    expect(rollbackSpy).toHaveBeenCalled();
  });
});

import { PgDatabase } from 'drizzle-orm/pg-core';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { DrizzleOrmModule } from '../nestjs/drizzle-orm.module.js';
import { Pool } from 'pg';

describe('DrizzleOrmModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DrizzleOrmModule.forRoot({ pg: globalThis.__pgClient })]
    }).compile();

    await module.init();
  });

  afterAll(async () => {
    await module?.close();
  });

  test('return an instance of PgDatabase', () => {
    const db = module.get(PgDatabase);
    expect(db).toBeInstanceOf(PgDatabase);
  });
});

describe('DrizzleOrmModule with a pool', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        DrizzleOrmModule.forRoot({ pg: new Pool(globalThis.__dbCredentials) })
      ]
    }).compile();

    await module.init();
  });

  afterAll(async () => {
    await module?.close();
  });

  test('return an instance of PgDatabase', () => {
    const db = module.get(PgDatabase);
    expect(db).toBeInstanceOf(PgDatabase);
  });
});

import pg from 'pg';
import { describe, expect, test } from 'vitest';
import { Test } from '@nestjs/testing';
import { PgPoolModule } from '../nestjs/pg-pool.module.js';

describe('PgPoolModule', () => {
  test('module returns an instance of Pool using forRoot', async () => {
    const module = await Test.createTestingModule({
      imports: [
        PgPoolModule.forRoot({
          port: 5432
        })
      ]
    }).compile();

    const pool = module.get(pg.Pool);

    expect(pool).toBeInstanceOf(pg.Pool);

    await module.close();
  });

  test('module returns an instance of Client using forRootAsync', async () => {
    const module = await Test.createTestingModule({
      imports: [
        PgPoolModule.forRootAsync({
          useFactory: () => ({
            port: 5432
          })
        })
      ]
    }).compile();

    const pool = module.get(pg.Pool);

    expect(pool).toBeInstanceOf(pg.Pool);

    await module.close();
  });

  test('module disconnects pools on shutdown', async () => {
    const module = await Test.createTestingModule({
      imports: [PgPoolModule.forRoot(globalThis.__dbCredentials)]
    }).compile();

    await module.init();

    const pool = module.get(pg.Pool);

    const poolRes = await pool.query('SELECT NOW()');

    expect(poolRes.rows[0].now).toBeDefined();

    const client = await pool.connect();

    const clientRes = await client.query('SELECT NOW()');

    expect(clientRes.rows[0].now).toBeDefined();

    client.release();

    expect(() => client.query('SELECT NOW()')).rejects.toThrow();

    await module.close();

    expect(() => pool.connect()).rejects.toThrow();

    expect(() => pool.query('SELECT NOW()')).rejects.toThrow();
  });
});

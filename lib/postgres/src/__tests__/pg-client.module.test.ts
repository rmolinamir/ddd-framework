import pg from 'pg';
import { describe, expect, test } from 'vitest';
import { Test } from '@nestjs/testing';
import { PgClientModule } from '../nestjs/pg-client.module.js';

describe('PgClientModule', () => {
  test('module returns an instance of Client using forRoot', async () => {
    const module = await Test.createTestingModule({
      imports: [
        PgClientModule.forRoot({
          port: 5432
        })
      ]
    }).compile();

    const client = module.get(pg.Client);

    expect(client).toBeInstanceOf(pg.Client);

    await module.close();
  });

  test('module returns an instance of Client using forRootAsync', async () => {
    const module = await Test.createTestingModule({
      imports: [
        PgClientModule.forRootAsync({
          useFactory: () => ({
            port: 5432
          })
        })
      ]
    }).compile();

    const client = module.get(pg.Client);

    expect(client).toBeInstanceOf(pg.Client);

    await module.close();
  });

  test('module connects clients on bootstrap and disconnects on shutdown', async () => {
    const module = await Test.createTestingModule({
      imports: [PgClientModule.forRoot(globalThis.__dbCredentials)]
    }).compile();

    await module.init();

    const client = module.get(pg.Client);

    const res = await client.query('SELECT NOW()');

    expect(res.rows[0].now).toBeDefined();

    await module.close();

    expect(() => client.query('SELECT NOW()')).rejects.toThrow();
  });
});

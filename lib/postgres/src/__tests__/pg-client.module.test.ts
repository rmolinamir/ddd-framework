import { Client } from 'pg';
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

    const client = module.get(Client);

    expect(client).toBeInstanceOf(Client);

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

    const client = module.get(Client);

    expect(client).toBeInstanceOf(Client);

    await module.close();
  });
});

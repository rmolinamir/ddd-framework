import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { resolve } from 'node:path';
import pg from 'pg';
import { afterAll, beforeAll } from 'vitest';

beforeAll(async () => {
  const client = new pg.Client({
    host: 'localhost',
    user: 'postgres',
    password: 'postgres',
    database: 'ddd-framework',
    port: 5432
  });

  await client.connect();

  await migrate(drizzle(client), {
    migrationsFolder: resolve(__dirname, '../../drizzle')
  });

  globalThis.__pgClient = client;
});

afterAll(async () => {
  await globalThis.__pgClient.end();
});

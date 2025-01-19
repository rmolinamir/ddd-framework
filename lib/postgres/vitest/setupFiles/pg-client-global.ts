import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { resolve } from 'node:path';
import pg from 'pg';
import { afterAll, beforeAll } from 'vitest';

beforeAll(async () => {
  const dbCredentials: pg.ClientConfig = {
    host: 'localhost',
    user: 'postgres',
    password: 'postgres',
    database: 'ddd-framework',
    port: 5432
  };

  const client = new pg.Client(dbCredentials);

  await client.connect();

  await migrate(drizzle(client), {
    migrationsFolder: resolve(__dirname, '../../drizzle')
  });

  globalThis.__pgClient = client;
  globalThis.__dbCredentials = dbCredentials;
});

afterAll(async () => {
  await globalThis.__pgClient.end();
});

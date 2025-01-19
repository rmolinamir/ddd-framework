import { expect } from 'vitest';

import { testTable1, testTable2 } from './test.table.js';
import { PgDatabaseTransaction } from '../pg-transaction.js';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

export function expectEntries<T extends typeof testTable1 | typeof testTable2>(
  context: NodePgDatabase | PgDatabaseTransaction,
  table: T,
  expected: T['$inferSelect'][]
) {
  return expect(context.select().from(table)).resolves.toMatchObject(expected);
}

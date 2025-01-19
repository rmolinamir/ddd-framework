import { pgTable, text } from 'drizzle-orm/pg-core';

export const testTable1 = pgTable('test_1', {
  id: text('id').primaryKey()
});

export const testTable2 = pgTable('test_2', {
  id: text('id').primaryKey()
});

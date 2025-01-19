import { PgDatabase, PgQueryResultHKT } from 'drizzle-orm/pg-core';
import {
  ExtractTablesWithRelations,
  TablesRelationalConfig
} from 'drizzle-orm/relations';

export type DrizzlePgDatabase<
  TQueryResult extends PgQueryResultHKT = PgQueryResultHKT,
  TFullSchema extends Record<string, unknown> = Record<string, never>,
  TSchema extends TablesRelationalConfig = ExtractTablesWithRelations<TFullSchema>
> = PgDatabase<TQueryResult, TFullSchema, TSchema>;

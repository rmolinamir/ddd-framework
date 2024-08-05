import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/**/*.table.ts',
  out: './drizzle',
  dialect: 'postgresql'
});

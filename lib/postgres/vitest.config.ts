import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: ['./vitest/setupFiles/pg-client-global.ts'],
    include: ['./src/**/*.test.ts'],
  }
});

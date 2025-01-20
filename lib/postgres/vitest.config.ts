import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: ['./vitest/setupFiles/pg-global.ts'],
    include: ['./src/**/*.test.ts']
  }
});

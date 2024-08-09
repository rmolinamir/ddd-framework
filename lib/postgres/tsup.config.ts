import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  splitting: true,
  sourcemap: true,
  bundle: false,
  clean: true,
  config: 'tsconfig.build.json',
});

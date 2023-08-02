import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/cli.ts'],
  outDir: 'lib',
  splitting: false,
  clean: true,
  sourcemap: false,
  format: 'esm',
  dts: true,
  loader: {
    '.xml': 'text'
  }
});

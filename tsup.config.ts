import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['./node.ts', './browser.ts'],
  format: ['esm', 'cjs'],
  clean: true,
  dts: true,
})

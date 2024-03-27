import { defineConfig } from 'tsup'

export default defineConfig({
  clean: true,
  entry: ['src/index.ts', 'src/nes.css.ts'],
  format: ['cjs', 'esm'],
  dts: true,
})

import { defineConfig } from 'vitest/config'

const resolve = (val: string) => new URL(val, import.meta.url).pathname

export default defineConfig({
  root: process.cwd(),
  test: {
    hideSkippedTests: true,
  },
  resolve: {
    alias: {
      '#pandabox/fixtures': resolve('./fixtures/src/index.ts'),
    },
  },
})

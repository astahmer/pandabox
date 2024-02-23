import { defineConfig } from 'vitest/config'

export default defineConfig({
  root: process.cwd(),
  test: {
    hideSkippedTests: true,
  },
  resolve: {
    alias: {
      '#pandabox/fixtures': './fixtures/src/index.ts',
    },
  },
})

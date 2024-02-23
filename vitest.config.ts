import { defineConfig } from 'vitest/config'

export default defineConfig({
  root: process.cwd(),
  test: {
    hideSkippedTests: true,
  },
})

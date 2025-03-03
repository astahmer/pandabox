import { defineConfig } from 'vitest/config'

export default defineConfig({
  root: process.cwd(),
  test: {
    // playwright timeouts are pretty long, so the total test timeout needs to be longer too.
    testTimeout: 10000,
    hideSkippedTests: true,
    setupFiles: ['./e2e/test-setup.ts'],
    globalSetup: ['./e2e/test-global-setup.ts'],
  },
})

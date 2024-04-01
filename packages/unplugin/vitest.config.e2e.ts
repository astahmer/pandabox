import { defineConfig } from 'vitest/config'

export default defineConfig({
  root: process.cwd(),
  test: {
    hideSkippedTests: true,
    setupFiles: ['./e2e/test-setup.ts'],
    globalSetup: ['./e2e/test-global-setup.ts'],
  },
})

import { defineConfig } from 'vitest/config'

export default defineConfig({
  root: process.cwd(),
  test: {
    hideSkippedTests: true,
    setupFiles: ['./__tests__/test-setup.ts'],
    globalSetup: ['./__tests__/test-global-setup.ts'],
  },
})

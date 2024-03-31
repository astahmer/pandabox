import { defineConfig } from 'vitest/config'

export default defineConfig({
  root: process.cwd(),
  // optimizeDeps: { include: ['vitest > @vitest/expect > chai'], exclude: ['fsevents'] },
  test: {
    hideSkippedTests: true,
    testTimeout: Infinity,
    // globals: true,
    // browser: {
    //   enabled: false,

    //   // name: 'chrome',
    //   name: 'chromium',
    //   provider: 'playwright',
    //   // api: { port: 9601 },
    //   headless: true,
    // },
  },
})

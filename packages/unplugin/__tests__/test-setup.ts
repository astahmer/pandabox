// https://github.com/vitejs/vite/blob/8b3ab0771842bda44129148c07739ebd86bdd62f/playground/vitestSetup.ts

import { Browser, BrowserContext, chromium, Page } from '@playwright/test'
import path from 'path'
import fs from 'fs-extra'
import { createServer, loadConfigFromFile, UserConfig, ViteDevServer } from 'vite'
import { afterAll, beforeAll, inject } from 'vitest'
import type { File } from 'vitest'

const packageRoot = path.resolve(__dirname, '../')

export let page: Page
export let browser: Browser
export let context: BrowserContext
export let viteTestUrl: string
export let server: ViteDevServer

/**
 * Path to the current test file
 */
export let testPath: string
/**
 * Path to the test folder
 */
export let testDir: string
/**
 * Test folder name
 */
export let testName: string

beforeAll(async (s) => {
  const suite = s as any as File
  if (!suite.filepath.includes('scenarios')) {
    return
  }

  const wsEndpoint = inject('wsEndpoint')
  if (!wsEndpoint) {
    throw new Error('wsEndpoint not found')
  }

  testPath = suite.filepath!
  testName = slash(testPath).match(/scenarios\/([\w-]+)\//)?.[1]
  testDir = path.dirname(testPath)

  // if this is a test placed under scenarios/xxx/__tests__
  // start a vite server in that directory.
  if (testName) {
    testDir = path.resolve(packageRoot, '__tests__', 'scenarios-temp', testName)
  }

  browser = await chromium.connect(wsEndpoint)
  context = await browser.newContext()
  page = await context.newPage()

  const configFile = path.resolve(testDir, './vite.config.ts')
  let config: UserConfig = {}
  console.log('configFile', configFile, {
    testDir,
    testName,
    testPath,
    workspaceRoot: packageRoot,
  })

  if (fs.existsSync(configFile)) {
    const viteConfig = await loadConfigFromFile({ command: 'serve', mode: 'development' }, configFile)
    // console.log('viteConfig', viteConfig)
    config = viteConfig.config
  }

  try {
    server = await createServer({
      ...config,
      // server: { port: 9600 },
      root: testDir,
      server: {
        watch: {
          // During tests we edit the files too fast and sometimes chokidar
          // misses change events, so enforce polling for consistency
          usePolling: true,
          interval: 100,
        },
        fs: {
          strict: true,
        },
      },
      build: {
        // esbuild do not minify ES lib output since that would remove pure annotations and break tree-shaking
        // skip transpilation during tests to make it faster
        target: 'esnext',
        // tests are flaky when `emptyOutDir` is `true`
        emptyOutDir: false,
      },
    })
    await server.listen()
    viteTestUrl = server.resolvedUrls?.local[0] || `http://localhost:${server.config.server.port}`
    if (server.config.base === '/') {
      viteTestUrl = viteTestUrl.replace(/\/$/, '')
    }
    await page.goto(viteTestUrl)

    console.log('viteUrl', viteTestUrl)
  } catch (e) {
    console.log('error', e)
    await server?.close()
    await browser?.close()
  }
})

afterAll(async () => {
  await server?.close()
  await browser?.close()
})

declare module 'vitest' {
  export interface ProvidedContext {
    wsEndpoint: string
  }
}

function slash(p: string): string {
  return p.replace(/\\/g, '/')
}

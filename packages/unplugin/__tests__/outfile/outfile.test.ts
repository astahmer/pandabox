import { Browser, BrowserContext, chromium, expect, Page } from '@playwright/test'
import { afterAll, beforeAll, describe, test } from 'vitest'
import { createServer, loadConfigFromFile, ViteDevServer } from 'vite'
import path from 'path'
import { getElementStyle } from '../test-colors'
import { editFile, untilUpdated, withRetry } from '../test-utils'

const headless = true

// const wait = async (ms: number) => new Promise((r) => setTimeout(r, ms))
// await wait(60_000)

describe('playwright meets vitest', () => {
  let page: Page
  let browser: Browser
  let context: BrowserContext
  let viteUrl: string
  let server: ViteDevServer

  beforeAll(async () => {
    browser = await chromium.launch({ headless })
    context = await browser.newContext()
    page = await context.newPage()

    const configFile = path.resolve(__dirname, './vite.config.ts')
    const viteConfig = await loadConfigFromFile({ command: 'serve', mode: 'development' }, configFile)
    const root = path.resolve(__dirname)
    console.log('viteConfig', viteConfig, { root })

    try {
      server = await createServer({
        ...viteConfig?.config,
        // server: { port: 9600 },
        root,
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
      viteUrl = server.resolvedUrls?.local[0] || `http://localhost:${server.config.server.port}`
      console.log('viteUrl', viteUrl)
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

  test('HMR on file change', async () => {
    const cleanup = () => {
      editFile('hello.tsx', (content) => content.replace('14px', '12px'))
    }
    onTestFinished(cleanup)
    onTestFailed(cleanup)

    await page.goto(viteUrl)

    expect(await getClassName(page, "[data-testid='hello']")).toBe('fs_12px')
    expect(await getElementStyle(page, "[data-testid='hello']")).toMatchObject({
      fontSize: '12px',
    })

    editFile('hello.tsx', (content) => content.replace('12px', '14px'))
    await withRetry(async () => {
      expect(await getClassName(page, "[data-testid='hello']")).toBe('fs_14px')
      expect(await getElementStyle(page, "[data-testid='hello']")).toMatchObject({
        fontSize: '14px',
      })
    })
  })
})

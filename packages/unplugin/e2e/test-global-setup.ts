// https://github.com/vitejs/vite/blob/bf1e9c2fd7b05f84d05e59f72b3fc26ca22807bb/playground/vitestGlobalSetup.ts

import path from 'node:path'
import fs from 'fs-extra'
import type { GlobalSetupContext } from 'vitest/node'
import type { BrowserServer } from '@playwright/test'
import { chromium } from '@playwright/test'

let browserServer: BrowserServer | undefined

const scenarioDir = 'scenarios'
const tempDir = path.resolve(__dirname, './' + scenarioDir + '-temp')

export async function setup({ provide }: GlobalSetupContext): Promise<void> {
  process.env.NODE_ENV = process.env.VITE_TEST_BUILD ? 'production' : 'development'

  browserServer = await chromium.launchServer({
    headless: !process.env.VITE_DEBUG_SERVE,
    args: process.env.CI ? ['--no-sandbox', '--disable-setuid-sandbox'] : undefined,
  })

  provide('wsEndpoint', browserServer.wsEndpoint())

  await fs.ensureDir(tempDir)
  await fs.emptyDir(tempDir)
  await fs
    .copy(path.resolve(__dirname, './' + scenarioDir), tempDir, {
      dereference: false,
      filter(file) {
        file = file.replace(/\\/g, '/')
        return !file.includes('.test.ts') && !/dist(?:\/|$)/.test(file)
      },
    })
    .catch(async (error) => {
      if (error.code === 'EPERM' && error.syscall === 'symlink') {
        throw new Error(
          'Could not create symlinks. On Windows, consider activating Developer Mode to allow non-admin users to create symlinks by following the instructions at https://docs.microsoft.com/en-us/windows/apps/get-started/enable-your-device-for-development.',
        )
      } else {
        throw error
      }
    })
}

export async function teardown(): Promise<void> {
  await browserServer?.close()
  if (!process.env.VITE_PRESERVE_BUILD_ARTIFACTS) {
    await fs.remove(tempDir)
  }
}

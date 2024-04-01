// https://github.com/vitejs/vite/blob/17d71ecf74bdcb16fd1d80c13106a28f804c325f/playground/test-utils.ts

import fs from 'node:fs'
import path from 'node:path'
import { testDir } from './test-setup'

const timeout = (n: number) => new Promise((r) => setTimeout(r, n))

export function readFile(filename: string): string {
  return fs.readFileSync(path.resolve(testDir, filename), 'utf-8')
}

export function editFile(filename: string, replacer: (str: string) => string): void {
  filename = path.resolve(testDir, filename)
  const content = fs.readFileSync(filename, 'utf-8')
  const modified = replacer(content)
  fs.writeFileSync(filename, modified)
}

export function addFile(filename: string, content: string): void {
  fs.writeFileSync(path.resolve(testDir, filename), content)
}

export function removeFile(filename: string): void {
  fs.unlinkSync(path.resolve(testDir, filename))
}

/**
 * Retry `func` until it does not throw error.
 */
export async function withRetry(func: () => Promise<void>): Promise<void> {
  const maxTries = process.env.CI ? 200 : 50
  for (let tries = 0; tries < maxTries; tries++) {
    try {
      await func()
      return
    } catch {}
    await timeout(50)
  }
  await func()
}

import fs from 'node:fs'
import path from 'node:path'

import { expect } from 'vitest'
// import { isBuild, page, testDir } from './vitestSetup'

const timeout = (n: number) => new Promise((r) => setTimeout(r, n))
const testDir = path.resolve(__dirname, './outfile')

export function readFile(filename: string): string {
  return fs.readFileSync(path.resolve(testDir, filename), 'utf-8')
}

export function editFile(filename: string, replacer: (str: string) => string): void {
  filename = path.resolve(testDir, filename)
  console.log({ editFile: filename })
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

// export function listAssets(base = ''): string[] {
//   const assetsDir = path.join(testDir, 'dist', base, 'assets')
//   return fs.readdirSync(assetsDir)
// }

// export function findAssetFile(match: string | RegExp, base = '', assets = 'assets', matchAll = false): string {
//   const assetsDir = path.join(testDir, 'dist', base, assets)
//   let files: string[]
//   try {
//     files = fs.readdirSync(assetsDir)
//   } catch (e) {
//     if ((e as any).code === 'ENOENT') {
//       return ''
//     }
//     throw e
//   }
//   if (matchAll) {
//     const matchedFiles = files.filter((file) => file.match(match))
//     return matchedFiles.length
//       ? matchedFiles.map((file) => fs.readFileSync(path.resolve(assetsDir, file), 'utf-8')).join('')
//       : ''
//   } else {
//     const matchedFile = files.find((file) => file.match(match))
//     return matchedFile ? fs.readFileSync(path.resolve(assetsDir, matchedFile), 'utf-8') : ''
//   }
// }

/**
 * Poll a getter until the value it returns includes the expected value.
 */
export async function untilUpdated(poll: () => string | Promise<string>, expected: string | RegExp): Promise<void> {
  const maxTries = process.env.CI ? 200 : 50
  for (let tries = 0; tries < maxTries; tries++) {
    const actual = (await poll()) ?? ''
    if (
      (typeof expected === 'string' ? actual.indexOf(expected) > -1 : actual.match(expected)) ||
      tries === maxTries - 1
    ) {
      expect(actual).toMatch(expected)
      break
    } else {
      await timeout(50)
    }
  }
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

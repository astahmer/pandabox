import { expect } from '@playwright/test'
import { describe, test } from 'vitest'
import { getClassName, getElementStyle } from '../../test-elements'
import { page } from '../../test-setup'
import { editFile, withRetry } from '../../test-utils'

describe('unplugin with virtual-file', () => {
  test('HMR on file change', async () => {
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

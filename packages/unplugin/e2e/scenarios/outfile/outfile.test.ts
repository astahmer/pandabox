import { expect } from '@playwright/test'
import { describe, test } from 'vitest'
import { getClassName } from '../../test-elements'
import { page } from '../../test-setup'
import { editFile } from '../../test-utils'

// TODO: add a test with worker and many files
describe('unplugin with outfile', () => {
  test('HMR on file change', async () => {
    expect(await getClassName(page, "[data-testid='hello']")).toBe('fs_12px')
    await expect(page.getByTestId('hello')).toHaveCSS('font-size', '12px', { timeout: 1000 })

    editFile('hello.tsx', (content) => content.replace('12px', '14px'))
    await expect(page.getByTestId('hello')).toHaveClass('fs_14px', { timeout: 1000 })
    await expect(page.getByTestId('hello')).toHaveCSS('font-size', '14px', { timeout: 1000 })
  })
})

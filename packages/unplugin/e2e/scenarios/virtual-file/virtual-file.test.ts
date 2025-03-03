import { expect } from '@playwright/test'
import { describe, test } from 'vitest'
import { getClassName } from '../../test-elements'
import { page } from '../../test-setup'
import { editFile } from '../../test-utils'

describe('unplugin with virtual-file', () => {
  test('HMR on file change', async () => {
    await expect(page.getByTestId('hello')).toHaveClass('fs_12px', { timeout: 1000 })
    expect(await getClassName(page, "[data-testid='hello']")).toBe('fs_12px')
    await expect(page.getByTestId('hello')).toHaveCSS('font-size', '12px', { timeout: 1000 })

    editFile('hello.tsx', (content) => content.replace('12px', '14px'))
    await expect(page.getByTestId('hello')).toHaveCSS('font-size', '14px', { timeout: 3000 })
  })
})

import { expect, test, vi } from 'vitest'
import { css } from './styled-system-missing-css-warnings/css'

test('runtime', () => {
  const spy = vi.spyOn(console, 'error')

  const styleSheet = document.createElement('style')
  styleSheet.appendChild(
    document.createTextNode(`
      .fs_456px {
        font-size: 456px;
      }`),
  )
  document.head.appendChild(styleSheet)

  expect(css({ fontSize: '123px' })).toMatchInlineSnapshot(`"fs_123px"`)
  expect(css({ fontSize: '456px', color: 'red' })).toMatchInlineSnapshot(`"fs_456px text_red"`)

  expect(console.error).toHaveBeenCalledWith('No matching CSS rule found for "fs_123px"')
  expect(console.error).not.toHaveBeenCalledWith('No matching CSS rule found for "fs_456px"')

  expect(spy.mock.calls).toMatchInlineSnapshot(`
      [
        [
          "No matching CSS rule found for "fs_123px"",
        ],
        [
          "No matching CSS rule found for "text_red"",
        ],
      ]
    `)
})

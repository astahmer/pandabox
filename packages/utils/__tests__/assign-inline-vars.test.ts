import { test, expect } from 'vitest'
import { assignInlineVars } from '../src/assign-inline-vars'

// https://play.panda-css.com/TkiN7P8XZg
test('assign-inline-vars', () => {
  expect(
    assignInlineVars({
      colors: {
        primary: 'red',
        secondary: 'blue',
        'some.very.nested.path': 'green',
      },
      sizes: {
        sm: 10,
        md: 20,
      },
    }),
  ).toMatchInlineSnapshot(`
    {
      "var(--colors-primary)": "red",
      "var(--colors-secondary)": "blue",
      "var(--colors-some\\.very\\.nested\\.path)": "green",
      "var(--sizes-md)": 20,
      "var(--sizes-sm)": 10,
    }
  `)
})

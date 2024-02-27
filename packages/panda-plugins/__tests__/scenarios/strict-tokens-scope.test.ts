import { test } from 'vitest'
import { css } from './styled-system-strict-tokens-scope/css'

test('runtime', () => {
  css({
    // @ts-expect-error
    color: '#fff',
    fontSize: '123px',
    // @ts-expect-error
    margin: '-5px',
  })
})

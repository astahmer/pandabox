import { expectTypeOf, test } from 'vitest'
import type { SpacingToken } from './styled-system-remove-negative-spacing/tokens'

type ContainsNegative = `-${string}` extends SpacingToken ? true : false

test('runtime', () => {
  expectTypeOf<ContainsNegative>().toMatchTypeOf<false>()
})

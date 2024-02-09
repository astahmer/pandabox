import { type Unboxed } from '@pandacss/extractor'

export const combineResult = (unboxed: Unboxed) => {
  return [...unboxed.conditions, unboxed.raw, ...unboxed.spreadConditions] as LiteralObject[]
}

interface LiteralObject {
  [key: string]: any
}

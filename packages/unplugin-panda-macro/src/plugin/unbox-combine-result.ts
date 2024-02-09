import { Unboxed } from '@pandacss/extractor'

export const combineResult = (unboxed: Unboxed) => {
  return [...unboxed.conditions, unboxed.raw, ...unboxed.spreadConditions]
}

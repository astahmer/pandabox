import { traverse } from '@pandacss/shared'
import { type TokenCategory } from '@pandacss/types'
import { cssVar, type CssVarsOptions } from './css-var'

interface TokenRecord extends Record<TokenCategory | (string & {}), Record<string, number | string | undefined>> {}

export type ToTokenRecord<TTokens extends Record<string, any>> = {
  [Category in TokenCategory]-?: {
    [TokenName in TTokens[Category]]?: number | string
  }
}

export const assignInlineVars = <TRecord extends TokenRecord>(
  userVars?: Partial<TRecord>,
  options?: CssVarsOptions & { separator?: string },
) => {
  const vars = {} as TokenRecord

  for (const [category, tokens] of Object.entries(userVars ?? {})) {
    traverse(
      tokens,
      ({ value, path }) => {
        if (typeof value === 'string' || typeof value === 'number') {
          const cssVarRef = cssVar.create(category + '-' + path, options).ref
          vars[cssVarRef] = value as any
        }
      },
      { separator: options?.separator ?? '-' },
    )
  }

  return vars as Record<string, any>
}

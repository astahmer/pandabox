import { cssVar as createVar, type CssVarOptions } from '@pandacss/shared'

const cssVarRef = <Value extends string>(value: Value, fallback?: string) =>
  `var(--${value}${fallback ? ', ' + fallback : ''})` as const
const cssVarName = <Value extends string>(value: Value) => `--${value}` as const

const createCssVar = <Value extends string>(value: Value, options: CssVarOptions = {}) =>
  createVar(value, options) as CssVar<Value>

export type CssVar<Name extends string> = {
  var: `--${Name}`
  ref: `var(--${Name})`
}
export type ToCssVar<Cat extends string, T extends string> = `--${Cat}-${T}`

export type CssVarsOptions = Omit<CssVarOptions, 'fallback'>

function defineCssVars<K extends string>(scope: string, keys: Array<K | [K, string]>, options?: CssVarsOptions) {
  const vars = {} as Record<K, CssVar<K>>
  for (const key of keys) {
    if (Array.isArray(key)) {
      const [name, fallback] = key
      vars[name] = cssVar.create(`${scope}-${name}`, { ...options, fallback }) as CssVar<K>
      continue
    }

    vars[key] = cssVar.create(`${scope}-${key}`) as CssVar<K>
  }
  return vars as {
    [Var in K]: CssVar<Var>
  }
}

export const cssVar = {
  /**
   * ⚠️ doesn't handle prefixing/hashing, instead use `cssVar.create` for that
   */
  ref: cssVarRef,
  /**
   * ⚠️ doesn't handle prefixing/hashing, instead use `cssVar.create` for that
   */
  name: cssVarName,

  create: createCssVar,
  scope: defineCssVars,
}

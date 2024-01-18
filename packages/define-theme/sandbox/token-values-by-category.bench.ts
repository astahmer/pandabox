import { bench } from '@arktype/attest'

import { preset as presetPanda } from '../sandbox/preset-panda'
import { defineTheme, type TokenPaths } from '../src/define-theme'

const { tokens } = presetPanda.theme

bench('TokenValuesByCategory', () => {
  const t = defineTheme()

  const builder = t.tokens({
    colors: {
      blue: {
        50: { value: '#eef2ff' },
        100: { value: '#e0e7ff' },
        200: { value: '#c7d2fe' },
        300: { value: '#a5b4fc' },
        400: { value: '#818cf8' },
        500: { value: '#6366f1' },
        600: { value: '#4f46e5' },
        700: { value: '#4338ca' },
        800: { value: '#3730a3' },
        900: { value: '#312e81' },
        950: { value: '#1e1b4b' },
      },
    },
    sizes: {
      xs: { value: '0.125rem' },
      sm: { value: '0.25rem' },
      md: { value: '0.375rem' },
      lg: { value: '0.5rem' },
      xl: { value: '0.75rem' },
      '2xl': { value: '1rem' },
      '3xl': { value: '1.5rem' },
      full: { value: '9999px' },
    },
    spacing: {
      xs: { value: '0.125rem' },
      sm: { value: '0.25rem' },
      md: { value: '0.375rem' },
      lg: { value: '0.5rem' },
      xl: { value: '0.75rem' },
      '2xl': { value: '1rem' },
      '3xl': { value: '1.5rem' },
      full: { value: '9999px' },
    },
  })

  type Tokens = (typeof builder)['_tokens']
  type SemanticTokens = unknown

  type TokenValuesByCategory<TTokens, TSemanticTokens> = {
    [Cat in keyof (TTokens & SemanticTokens)]:
      | (Cat extends keyof TTokens ? TokenPaths<TTokens[Cat]> : never)
      | (Cat extends keyof TSemanticTokens ? TokenPaths<TSemanticTokens[Cat]> : never)
  }

  type Result = TokenValuesByCategory<Tokens, SemanticTokens>

  return {} as any as Result
}).types([47, 'instantiations'])

bench('TokenValuesByCategory with extend', () => {
  const t = defineTheme()

  const builder = t.tokens({
    colors: {
      blue: {
        50: { value: '#eef2ff' },
        100: { value: '#e0e7ff' },
        200: { value: '#c7d2fe' },
        300: { value: '#a5b4fc' },
        400: { value: '#818cf8' },
        500: { value: '#6366f1' },
        600: { value: '#4f46e5' },
        700: { value: '#4338ca' },
        800: { value: '#3730a3' },
        900: { value: '#312e81' },
        950: { value: '#1e1b4b' },
      },
    },
    sizes: {
      xs: { value: '0.125rem' },
      sm: { value: '0.25rem' },
      md: { value: '0.375rem' },
      lg: { value: '0.5rem' },
      xl: { value: '0.75rem' },
      '2xl': { value: '1rem' },
      '3xl': { value: '1.5rem' },
      full: { value: '9999px' },
    },
    spacing: {
      xs: { value: '0.125rem' },
      sm: { value: '0.25rem' },
      md: { value: '0.375rem' },
      lg: { value: '0.5rem' },
      xl: { value: '0.75rem' },
      '2xl': { value: '1rem' },
      '3xl': { value: '1.5rem' },
      full: { value: '9999px' },
    },
  })

  type Tokens = (typeof builder)['_tokens']
  type SemanticTokens = unknown

  type TokenValuesByCategory<TTokens, TSemanticTokens> = {
    [Cat in TTokens & SemanticTokens extends infer U ? keyof U : never]:
      | (Cat extends keyof TTokens ? TokenPaths<TTokens[Cat]> : never)
      | (Cat extends keyof TSemanticTokens ? TokenPaths<TSemanticTokens[Cat]> : never)
  }

  type Result = TokenValuesByCategory<Tokens, SemanticTokens>

  return {} as any as Result
}).types([47, 'instantiations'])

bench('TokenValuesByCategory with filter', () => {
  const t = defineTheme()

  const builder = t.tokens({
    colors: {
      blue: {
        50: { value: '#eef2ff' },
        100: { value: '#e0e7ff' },
        200: { value: '#c7d2fe' },
        300: { value: '#a5b4fc' },
        400: { value: '#818cf8' },
        500: { value: '#6366f1' },
        600: { value: '#4f46e5' },
        700: { value: '#4338ca' },
        800: { value: '#3730a3' },
        900: { value: '#312e81' },
        950: { value: '#1e1b4b' },
      },
    },
    sizes: {
      xs: { value: '0.125rem' },
      sm: { value: '0.25rem' },
      md: { value: '0.375rem' },
      lg: { value: '0.5rem' },
      xl: { value: '0.75rem' },
      '2xl': { value: '1rem' },
      '3xl': { value: '1.5rem' },
      full: { value: '9999px' },
    },
    spacing: {
      xs: { value: '0.125rem' },
      sm: { value: '0.25rem' },
      md: { value: '0.375rem' },
      lg: { value: '0.5rem' },
      xl: { value: '0.75rem' },
      '2xl': { value: '1rem' },
      '3xl': { value: '1.5rem' },
      full: { value: '9999px' },
    },
  })

  type Tokens = (typeof builder)['_tokens']
  type SemanticTokens = unknown

  // type oui = {
  //   aaa: true
  //   bbb: 'xxx'
  //   ccc: undefined
  //   ddd: never
  // }

  // type UndefinedOrNeverKeys<T> = {
  //   [K in keyof T]: undefined extends T[K] ? K : never
  // }[keyof T]

  // type aaaaa = UndefinedOrNeverKeys<oui>

  type TokenValuesByCategory<TTokens, TSemanticTokens> = {
    [Cat in keyof (TTokens & SemanticTokens) as undefined | never extends (TTokens & SemanticTokens)[Cat]
      ? never
      : Cat]:
      | (Cat extends keyof TTokens ? TokenPaths<TTokens[Cat]> : never)
      | (Cat extends keyof TSemanticTokens ? TokenPaths<TSemanticTokens[Cat]> : never)
  }

  type Result = TokenValuesByCategory<Tokens, SemanticTokens>

  return {} as any as Result
}).types([47, 'instantiations'])

bench('TokenValuesByCategory using preset', () => {
  const t = defineTheme()

  const builder = t.tokens(tokens)

  type Tokens = (typeof builder)['_tokens']
  type SemanticTokens = unknown

  type TokenValuesByCategory<TTokens, TSemanticTokens> = {
    [Cat in keyof (TTokens & SemanticTokens)]:
      | (Cat extends keyof TTokens ? TokenPaths<TTokens[Cat]> : never)
      | (Cat extends keyof TSemanticTokens ? TokenPaths<TSemanticTokens[Cat]> : never)
  }

  type Result = TokenValuesByCategory<Tokens, SemanticTokens>

  return {} as any as Result
}).types([45, 'instantiations'])

bench('TokenValuesByCategory using preset with intersection', () => {
  const t = defineTheme()

  const builder = t.tokens(tokens)

  type Tokens = (typeof builder)['_tokens']
  type SemanticTokens = unknown

  type TokenValuesByCategory<TTokens, TSemanticTokens> = {
    [Cat in keyof TTokens]: TokenPaths<TTokens[Cat]>
  } & {
    [Cat in keyof SemanticTokens]: TokenPaths<SemanticTokens[Cat]>
  }

  type Result = TokenValuesByCategory<Tokens, SemanticTokens>

  return {} as any as Result
}).types([45, 'instantiations'])

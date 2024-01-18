import { bench } from '@arktype/attest'

import { preset as presetBase } from '../sandbox/preset-base'
import { defineTheme, type LonghandUtilityProps, type TokenValuesByCategory } from '../src/define-theme'

const { utilities } = presetBase

bench('Shorthands', () => {
  const t = defineTheme()

  const builder = t
    .tokens({
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
    .utilities({
      background: {
        shorthand: 'bg',
        className: 'bg',
        values: 'colors',
      },
      width: {
        shorthand: 'w',
        className: 'w',
        values: 'sizes',
      },
      height: {
        shorthand: 'h',
        className: 'h',
        values: 'sizes',
      },
      paddingInline: {
        className: 'px',
        values: 'spacing',
        shorthand: ['paddingX', 'px'],
      },
      backgroundBlendMode: {
        shorthand: 'bgBlendMode',
        className: 'bg-blend',
      },
    })

  type Utilities = (typeof builder)['_utilities']
  type Tokens = (typeof builder)['_tokens']
  type Mapping = ShorthandMapping<Utilities>
  type ByCategory = TokenValuesByCategory<Tokens, {}>
  type Longhand = LonghandUtilityProps<Utilities, ByCategory>

  type Shorthands<TUtiliyConfig, TLonghandProps, TMapping = ShorthandMapping<TUtiliyConfig>> = {
    [TShorthand in keyof TMapping]: TMapping[TShorthand] extends keyof TLonghandProps
      ? {
          [K in TMapping[TShorthand]]: TLonghandProps[K]
        }[TMapping[TShorthand]]
      : never
  }

  type Result = Shorthands<Utilities, Longhand, Mapping>

  return {} as any as Result
}).types([115, 'instantiations'])

bench('ShorthandProps with never filter', () => {
  const t = defineTheme()

  const builder = t
    .tokens({
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
    .utilities({
      background: {
        shorthand: 'bg',
        className: 'bg',
        values: 'colors',
      },
      width: {
        shorthand: 'w',
        className: 'w',
        values: 'sizes',
      },
      height: {
        shorthand: 'h',
        className: 'h',
        values: 'sizes',
      },
      paddingInline: {
        className: 'px',
        values: 'spacing',
        shorthand: ['paddingX', 'px'],
      },
      backgroundBlendMode: {
        shorthand: 'bgBlendMode',
        className: 'bg-blend',
      },
    })

  type Utilities = (typeof builder)['_utilities']
  type Tokens = (typeof builder)['_tokens']
  type Mapping = ShorthandMapping<Utilities>
  type ByCategory = TokenValuesByCategory<Tokens, {}>
  type Longhand = LonghandUtilityProps<Utilities, ByCategory>

  type ShorthandProps<TUtiliyConfig, TLonghandProps, TMapping = ShorthandMapping<TUtiliyConfig>> = {
    [TShorthand in keyof TMapping as TMapping[TShorthand] extends keyof TLonghandProps
      ? TLonghandProps[TMapping[TShorthand]] extends never | undefined
        ? never
        : TShorthand
      : never]: TMapping[TShorthand] extends keyof TLonghandProps ? TLonghandProps[TMapping[TShorthand]] : never
  }
  type Result = ShorthandProps<Utilities, Longhand, Mapping>

  return {} as any as Result
}).types([115, 'instantiations'])

bench('BetterShorthands', () => {
  const t = defineTheme()

  const builder = t
    .tokens({
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
    .utilities({
      background: {
        shorthand: 'bg',
        className: 'bg',
        values: 'colors',
      },
      width: {
        shorthand: 'w',
        className: 'w',
        values: 'sizes',
      },
      height: {
        shorthand: 'h',
        className: 'h',
        values: 'sizes',
      },
      paddingInline: {
        className: 'px',
        values: 'spacing',
        shorthand: ['paddingX', 'px'],
      },
      backgroundBlendMode: {
        shorthand: 'bgBlendMode',
        className: 'bg-blend',
      },
    })

  type Utilities = (typeof builder)['_utilities']
  type Tokens = (typeof builder)['_tokens']
  type Mapping = ShorthandMapping<Utilities>
  type ByCategory = TokenValuesByCategory<Tokens, {}>
  type Longhand = LonghandUtilityProps<Utilities, ByCategory>

  type BetterShorthands<TUtiliyConfig, TLonghandProps, TMapping = ShorthandMapping<TUtiliyConfig>> = {
    [TShorthand in keyof TMapping]: TMapping[TShorthand] extends keyof TLonghandProps
      ? TLonghandProps[TMapping[TShorthand]]
      : never
  }

  type BetterResult = BetterShorthands<Utilities, Longhand, Mapping>

  return {} as any as BetterResult
}).types([115, 'instantiations'])

bench('Shorthands', () => {
  const t = defineTheme()

  const builder = t
    .tokens({
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
    .utilities(utilities)

  type Utilities = (typeof builder)['_utilities']
  type Tokens = (typeof builder)['_tokens']
  type Mapping = ShorthandMapping<Utilities>
  type ByCategory = TokenValuesByCategory<Tokens, {}>
  type Longhand = LonghandUtilityProps<Utilities, ByCategory>

  type Shorthands<TUtiliyConfig, TLonghandProps, TMapping = ShorthandMapping<TUtiliyConfig>> = {
    [TShorthand in keyof TMapping]: TMapping[TShorthand] extends keyof TLonghandProps
      ? {
          [K in TMapping[TShorthand]]: TLonghandProps[K]
        }[TMapping[TShorthand]]
      : never
  }

  type Result = Shorthands<Utilities, Longhand, Mapping>

  return {} as any as Result
}).types([115, 'instantiations'])

bench('Shorthands with preset with never filter', () => {
  const t = defineTheme()

  const builder = t
    .tokens({
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
    .utilities(utilities)

  type Utilities = (typeof builder)['_utilities']
  type Tokens = (typeof builder)['_tokens']
  type Mapping = ShorthandMapping<Utilities>
  type ByCategory = TokenValuesByCategory<Tokens, {}>
  type Longhand = LonghandUtilityProps<Utilities, ByCategory>

  type ShorthandProps<TUtiliyConfig, TLonghandProps, TMapping = ShorthandMapping<TUtiliyConfig>> = {
    [TShorthand in keyof TMapping as TMapping[TShorthand] extends keyof TLonghandProps
      ? TLonghandProps[TMapping[TShorthand]] extends never | undefined
        ? never
        : TShorthand
      : never]: TMapping[TShorthand] extends keyof TLonghandProps ? TLonghandProps[TMapping[TShorthand]] : never
  }

  type Result = ShorthandProps<Utilities, Longhand, Mapping>

  return {} as any as Result
}).types([115, 'instantiations'])

bench('BetterShorthands', () => {
  const t = defineTheme()

  const builder = t
    .tokens({
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
    .utilities(utilities)

  type Utilities = (typeof builder)['_utilities']
  type Tokens = (typeof builder)['_tokens']
  type Mapping = ShorthandMapping<Utilities>
  type ByCategory = TokenValuesByCategory<Tokens, {}>
  type Longhand = LonghandUtilityProps<Utilities, ByCategory>

  type BetterShorthands<TUtiliyConfig, TLonghandProps, TMapping = ShorthandMapping<TUtiliyConfig>> = {
    [TShorthand in keyof TMapping]: TMapping[TShorthand] extends keyof TLonghandProps
      ? TLonghandProps[TMapping[TShorthand]]
      : never
  }

  type BetterResult = BetterShorthands<Utilities, Longhand, Mapping>

  return {} as any as BetterResult
}).types([115, 'instantiations'])

type ShorthandMapping<TUtilityConfig> = {
  [TProp in keyof TUtilityConfig as TUtilityConfig[TProp] extends { shorthand: infer TShorthand }
    ? TShorthand extends string
      ? TShorthand
      : TShorthand extends string[]
        ? TShorthand[number]
        : never
    : never]: TProp
}

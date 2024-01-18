import { bench } from '@arktype/attest'

import { defineTheme } from '../src/define-theme'
import { utilities } from './preset-base/utilities'

bench('ShorthandMapping', () => {
  const t = defineTheme()

  const builder = t.utilities({
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
  // type Shorthands = ShorthandProps<Utilities, LonghandUtilityProps<Utilities, 'shorthands'>>
  type Mapping = ShorthandMapping<Utilities>

  return {} as any as Mapping
}).types([27, 'instantiations'])

bench('TransformMapping2', () => {
  const t = defineTheme()

  const builder = t.utilities({
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
  type TransformMapping2 = {
    [K in keyof Utilities as Utilities[K]['shorthand'] extends string
      ? Utilities[K]['shorthand']
      : Utilities[K]['shorthand'][number]]: K
  }

  return {} as any as TransformMapping2
}).types([73, 'instantiations'])

const presetUtilities = utilities

bench('ShorthandMapping on preset ', () => {
  const t = defineTheme()

  const builder = t.utilities(presetUtilities)

  type Utilities = (typeof builder)['_utilities']
  // type Shorthands = ShorthandProps<Utilities, LonghandUtilityProps<Utilities, 'shorthands'>>
  type Mapping = ShorthandMapping<Utilities>

  return {} as any as Mapping
}).types([27, 'instantiations'])

bench('TransformMapping2 on preset', () => {
  const t = defineTheme()

  const builder = t.utilities(presetUtilities)

  type Utilities = (typeof builder)['_utilities']
  type TransformMapping2 = {
    [K in keyof Utilities as Utilities[K]['shorthand'] extends string
      ? Utilities[K]['shorthand']
      : Utilities[K]['shorthand'][number]]: K
  }

  return {} as any as TransformMapping2
}).types([80, 'instantiations'])

type ShorthandMapping<TUtilityConfig> = {
  [TProp in keyof TUtilityConfig as TUtilityConfig[TProp] extends { shorthand: infer TShorthand }
    ? TShorthand extends string
      ? TShorthand
      : TShorthand extends string[]
        ? TShorthand[number]
        : never
    : never]: TProp
}

// type Mapping<TUtilityConfig> = hot.Call<hot.Objects.

type Shorthands<TUtiliyConfig, TLonghandProps, TMapping = ShorthandMapping<TUtiliyConfig>> = {
  [TShorthand in keyof TMapping]: TMapping[TShorthand] extends keyof TLonghandProps
    ? {
        [K in TMapping[TShorthand]]: TLonghandProps[K]
      }[TMapping[TShorthand]]
    : never
}

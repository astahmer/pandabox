import type { RecipeConfig, RecipeVariantRecord } from '@pandacss/types'
import deepmerge from 'lodash.merge'

import type { RecipeBuilder } from './builder-typings'

export { type RecipeBuilder }

export type {
  RecipeCompoundSelection,
  RecipeCompoundVariant,
  RecipeConfig,
  RecipeSelection,
  RecipeVariantRecord,
} from '@pandacss/types'

export function defineRecipe<T extends RecipeVariantRecord>(config: RecipeConfig<T>): RecipeBuilder<T> {
  return Object.assign(
    {
      extend: function (variants) {
        return defineRecipe(Object.assign({}, config, deepmerge({ variants: config.variants }, { variants })))
      },
      merge: function (extension) {
        return defineRecipe(deepmerge({}, config, extension as any))
      },
      pick: function (...keys) {
        return defineRecipe(
          Object.assign({}, config, {
            variants: keys.reduce((acc, key) => ({ ...acc, [key]: config.variants?.[key] }), {}),
            compoundVariants: config.compoundVariants?.filter((compound) => {
              return Object.keys(compound).some((variant) => keys.includes(variant as (typeof keys)[number]))
            }),
          }),
        )
      },
      omit: function (...keys) {
        return defineRecipe(
          Object.assign({}, config, {
            variants: Object.entries(config.variants ?? {}).reduce((acc, [key, value]) => {
              if (keys.includes(key as (typeof keys)[number])) return acc
              return Object.assign({}, acc, { [key]: value })
            }, {}),
            compoundVariants: config.compoundVariants?.filter((compound) => {
              return !Object.keys(compound).some((variant) => keys.includes(variant as (typeof keys)[number]))
            }),
          }),
        )
      },
      cast: function () {
        return config as RecipeConfig<RecipeVariantRecord>
      },
    } as RecipeBuilder<T>,
    config,
  ) as RecipeBuilder<T>
}

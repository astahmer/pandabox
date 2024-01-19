import type { RecipeConfig, SlotRecipeConfig, SlotRecipeVariantRecord } from '@pandacss/types'
import deepmerge from 'lodash.merge'

import type { SlotExtensionFns, SlotRecipeBuilder } from './builder-typings'

export type { SlotRecipeConfig, SlotRecipeVariantRecord } from '@pandacss/types'
export type { SlotExtensionFns, SlotRecipeBuilder }

export function defineSlotRecipe<S extends string, T extends SlotRecipeVariantRecord<S>>(
  config: SlotRecipeConfig<S, T>,
): SlotRecipeBuilder<S, T> {
  return Object.assign(
    {
      extend: function (variants) {
        return defineSlotRecipe(Object.assign({}, config, deepmerge({ variants: config.variants }, { variants })))
      },
      merge: function (extension) {
        return defineSlotRecipe(deepmerge({}, config, extension as any))
      },
      pick: function (...keys) {
        return defineSlotRecipe(
          Object.assign({}, config, {
            variants: keys.reduce((acc, key) => ({ ...acc, [key]: config.variants?.[key] }), {}),
            compoundVariants: config.compoundVariants?.filter((compound) => {
              return Object.keys(compound).some((variant) => keys.includes(variant as (typeof keys)[number]))
            }),
          }),
        )
      },
      omit: function (...keys) {
        return defineSlotRecipe(
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
        return config as SlotRecipeConfig<S, SlotRecipeVariantRecord<S>>
      },
      slot: {
        add: function (...slots) {
          return defineSlotRecipe(Object.assign({}, config, { slots: [...(config.slots ?? []), ...slots] }))
        },
        pick: function (...keys) {
          const { slots = [], compoundVariants = [] } = config
          const pickedSlots = slots.filter((slot) => keys.includes(slot as (typeof keys)[number]))
          const pickedVariants: SlotRecipeVariantRecord<S> = {}
          const variants = (config.variants ?? {}) as SlotRecipeVariantRecord<S>

          for (const [vName, variantRecord] of Object.entries(variants)) {
            pickedVariants[vName] ||= {}

            for (const [vKey, bySlots] of Object.entries(variantRecord)) {
              pickedVariants[vName][vKey] ||= {}

              for (const [vSlot, styles] of Object.entries(bySlots)) {
                if (keys.includes(vSlot as (typeof keys)[number])) {
                  // @ts-expect-error it's fine
                  pickedVariants[vName][vKey][vSlot] = styles
                }
              }
            }
          }

          const pickedCompoundVariants = compoundVariants.filter((compound) => {
            return !Object.keys(compound).some((variant) => keys.includes(variant as (typeof keys)[number]))
          })

          return defineSlotRecipe({
            ...config,
            slots: pickedSlots,
            variants: pickedVariants as T,
            compoundVariants: pickedCompoundVariants,
          })
        },
        omit: function (...keys) {
          const { slots = [], compoundVariants = [] } = config
          const pickedSlots = slots.filter((slot) => !keys.includes(slot as (typeof keys)[number]))
          const pickedVariants: SlotRecipeVariantRecord<S> = {}
          const variants = (config.variants ?? {}) as SlotRecipeVariantRecord<S>

          for (const [vName, variantRecord] of Object.entries(variants)) {
            if (!keys.includes(vName as (typeof keys)[number])) {
              pickedVariants[vName] ||= {}

              for (const [vKey, bySlots] of Object.entries(variantRecord)) {
                pickedVariants[vName][vKey] ||= {}

                for (const [vSlot, styles] of Object.entries(bySlots)) {
                  if (!keys.includes(vSlot as (typeof keys)[number])) {
                    // @ts-expect-error it's fine
                    pickedVariants[vName][vKey][vSlot] = styles
                  }
                }
              }
            }
          }

          const pickedCompoundVariants = compoundVariants.filter((compound) => {
            return !Object.keys(compound).some((variant) => keys.includes(variant as (typeof keys)[number]))
          })

          return defineSlotRecipe({
            ...config,
            slots: pickedSlots,
            variants: pickedVariants as T,
            compoundVariants: pickedCompoundVariants,
          })
        },
        assignTo: function <TSlot extends S, TRecipe extends RecipeConfig>(slot: TSlot, recipe: TRecipe) {
          const base = (config.base ?? {}) as Record<string, {}>
          const recipeVariants = recipe.variants ?? {}
          const variants = (config.variants ?? {}) as SlotRecipeVariantRecord<S>

          const overridenVariants = cloneDeep(variants)

          for (const [vName, variantRecord] of Object.entries(variants)) {
            overridenVariants[vName] ||= {}

            for (const [vKey, bySlots] of Object.entries(variantRecord)) {
              overridenVariants[vName][vKey] ||= {}

              for (const [vSlot, styles] of Object.entries(bySlots)) {
                if (vSlot === slot) {
                  const recipeStyles = recipeVariants[vName]?.[vKey]

                  overridenVariants[vName][vKey][vSlot] = Object.assign({}, styles, recipeStyles)
                }
              }
            }
          }

          const overridenBase = cloneDeep(base)
          for (const [vSlot, styles] of Object.entries(base)) {
            if (vSlot === slot) {
              overridenBase[vSlot] = Object.assign({}, styles, recipe.base)
            }
          }

          return defineSlotRecipe({ ...config, variants: overridenVariants, base: overridenBase })
        },
      },
    } as SlotRecipeBuilder<S, T>,
    config,
  ) as SlotRecipeBuilder<S, T>
}

function cloneDeep(variants: SlotRecipeVariantRecord<string>) {
  return JSON.parse(JSON.stringify(variants))
}

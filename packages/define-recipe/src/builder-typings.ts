import type {
  DistributiveOmit,
  Pretty,
  RecipeCompoundSelection,
  RecipeCompoundVariant,
  RecipeConfig,
  RecipeSelection,
  RecipeVariantRecord,
  SlotRecipeConfig,
  SlotRecipeVariantRecord,
} from '@pandacss/types'
import type { DistributivePick } from './type-helpers'

export type {
  RecipeCompoundSelection,
  RecipeCompoundVariant,
  RecipeConfig,
  RecipeSelection,
  RecipeVariantRecord,
} from '@pandacss/types'

export interface RecipeBuilder<T extends RecipeVariantRecord> extends RecipeConfig<T> {
  /* Add additional or override variants */
  extend: <TVariants extends RecipeVariantRecord>(variants: TVariants) => RecipeBuilder<Pretty<T & TVariants>>
  /* Deep merge with another recipe */
  merge: <TVariants extends RecipeVariantRecord, MergedVariants extends Pretty<TVariants & T> = Pretty<TVariants & T>>(
    extension: Partial<Omit<RecipeConfig<any>, 'variants' | 'compoundVariants' | 'defaultVariants'>> & {
      variants?: TVariants
      compoundVariants?: Array<Pretty<RecipeCompoundVariant<RecipeCompoundSelection<MergedVariants>>>>
      defaultVariants?: RecipeSelection<MergedVariants>
    },
  ) => RecipeBuilder<MergedVariants>
  /* Pick only specified variants (also filter compoundVariants) */
  pick: <TKeys extends keyof T>(...keys: TKeys[]) => RecipeBuilder<DistributivePick<T, TKeys>>
  /* Omit specified variants (also filter compoundVariants) */
  omit: <TKeys extends keyof T>(...keys: TKeys[]) => RecipeBuilder<DistributiveOmit<T, TKeys>>
  /* Make the recipe generic to simplify the typings */
  cast: () => RecipeConfig<RecipeVariantRecord>
}

type PickSlots<S extends string, T extends SlotRecipeVariantRecord<S>, TKeys extends S> = Pretty<{
  [VName in keyof T]: {
    [VKey in keyof T[VName]]: {
      [VSlot in Extract<keyof T[VName][VKey], TKeys>]: T[VName][VKey][VSlot]
    }
  }
}>

type OmitSlots<S extends string, T extends SlotRecipeVariantRecord<S>, TKeys extends S> = Pretty<{
  [VName in keyof T]: {
    [VKey in keyof T[VName]]: {
      [VSlot in Exclude<keyof T[VName][VKey], TKeys>]: T[VName][VKey][VSlot]
    }
  }
}>

export interface SlotExtensionFns<S extends string, T extends SlotRecipeVariantRecord<S>> {
  /* Add additional slots */
  add: <TSlots extends string>(
    ...slots: TSlots[]
  ) => SlotRecipeBuilder<S | TSlots, T extends SlotRecipeVariantRecord<S | TSlots> ? T : never>
  /* Pick only specified slots (also filter base/variants/compoundVariants) */
  pick: <TKeys extends S>(...keys: TKeys[]) => SlotRecipeBuilder<Extract<S, TKeys>, PickSlots<S, T, TKeys>>
  /* Omit specified slots (also filter base/slots/compoundVariants) */
  omit: <TKeys extends S>(...keys: TKeys[]) => SlotRecipeBuilder<Exclude<S, TKeys>, OmitSlots<S, T, TKeys>>
  /** Assign simple recipe to slot */
  assignTo: <
    TSlot extends S,
    TRecipe extends RecipeConfig,
    TVariants extends NonNullable<TRecipe['variants']> = NonNullable<TRecipe['variants']>,
  >(
    slot: TSlot,
    recipe: TRecipe,
  ) => SlotRecipeBuilder<
    S,
    // always fallback to (current) SlotRecipe variant value
    {
      [VName in keyof T]: {
        [VKey in keyof T[VName]]: {
          // we only care about the slot that we are assigning to
          [VSlot in keyof T[VName][VKey]]: VSlot extends TSlot
            ? {
                // if a variant name is not defined in the recipe to assign FROM
                [VRecipeVariant in keyof TVariants]: VRecipeVariant extends VName
                  ? // if a variant key is not defined in the recipe to assign FROM
                    VKey extends keyof TVariants[VRecipeVariant]
                    ? TVariants[VRecipeVariant][VKey]
                    : T[VName][VKey][VSlot]
                  : T[VName][VKey][VSlot]
              }[keyof TVariants]
            : T[VName][VKey][VSlot]
        }
      }
    }
  >
}

export interface SlotRecipeBuilder<S extends string, T extends SlotRecipeVariantRecord<S>>
  extends SlotRecipeConfig<S, T> {
  /* Add additional or override variants */
  extend: <TVariants extends SlotRecipeVariantRecord<S>>(
    variants: TVariants,
  ) => SlotRecipeBuilder<S, Pretty<T & TVariants>>
  /* Deep merge with another Slotrecipe */
  merge: <
    TVariants extends SlotRecipeVariantRecord<S>,
    MergedVariants extends Pretty<TVariants & T> = Pretty<TVariants & T>,
  >(
    extension: Partial<Omit<SlotRecipeConfig<any>, 'slots' | 'variants' | 'compoundVariants' | 'defaultVariants'>> & {
      slots?: S[]
      variants?: TVariants extends unknown ? SlotRecipeVariantRecord<S> : TVariants
      compoundVariants?: Array<Pretty<RecipeCompoundVariant<RecipeCompoundSelection<MergedVariants>>>>
      defaultVariants?: RecipeSelection<MergedVariants>
    },
  ) => SlotRecipeBuilder<S, MergedVariants>
  /* Pick only specified variants (also filter compoundVariants) */
  pick: <TKeys extends keyof T>(...keys: TKeys[]) => SlotRecipeBuilder<S, DistributivePick<T, TKeys>>
  /* Omit specified variants (also filter compoundVariants) */
  omit: <TKeys extends keyof T>(...keys: TKeys[]) => SlotRecipeBuilder<S, DistributiveOmit<T, TKeys>>
  /* Make the Slotrecipe generic to simplify the typings */
  cast: () => SlotRecipeConfig<S, SlotRecipeVariantRecord<S>>
  /** Add slots, pick or omit some or assign a config recipe to a slot */
  slot: SlotExtensionFns<S, T>
}

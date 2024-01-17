import type {
  CssProperties,
  Pretty,
  RecipeCompoundSelection,
  RecipeConfigMeta,
  RecipeRule,
  SemanticTokens,
  Tokens,
  UtilityConfig,
} from '@pandacss/types'
// import type { AnySelector, Selectors } from '../../types/src/selectors'
// import type { CssVarProperties } from '../../types/src/style-props'

/* -----------------------------------------------------------------------------
 * Theme builder types
 * -----------------------------------------------------------------------------*/

interface ThemeBuilder<TConditions, TTokens, TSemanticTokens, TUtilities> {
  // TODO breakpoints
  conditions<const T>(defs: T): ThemeBuilder<Pretty<T & TConditions>, TTokens, TSemanticTokens, TUtilities>
  tokens<const T>(
    tokens: T extends Tokens ? T : Tokens,
  ): ThemeBuilder<TConditions, Pretty<T & TTokens>, TSemanticTokens, TUtilities>
  semanticTokens<const T>(
    tokens: TConditions extends { [Key in infer TCondKeys]: string }
      ? T extends SemanticTokens<TCondKeys extends string ? TCondKeys : never>
        ? T
        : SemanticTokens
      : never,
  ): ThemeBuilder<TConditions, TTokens, Pretty<T & TSemanticTokens>, TUtilities>
  utilities: <const T extends UtilityConfig>(
    utilities: T,
  ) => ThemeBuilder<TConditions, TTokens, TSemanticTokens, Pretty<T & TUtilities>>
  // build: () => ThemeConfigFn<{
  //   conditions: TConditions
  //   tokens: TTokens
  //   semanticTokens: TSemanticTokens
  //   utilities: TUtilities
  // }>
  build: () => ThemeConfigFn<TConditions, TTokens, TSemanticTokens, TUtilities>
  //
  // /**
  //  * @internal The config.conditions of the theme. Only used for type inference.
  //  */
  // _conditions: TConditions
  // /**
  //  * @internal The config.tokens of the theme. Only used for type inference.
  //  */
  // _tokens: TTokens
  // /**
  //  * @internal The config.semanticTokens of the theme. Only used for type inference.
  //  */
  // _semanticTokens: TSemanticTokens
  // /**
  //  * @internal The config.utilities of the theme. Only used for type inference.
  //  */
  // _utilities: TUtilities
}

export function defineTheme(): ThemeBuilder<unknown, unknown, unknown, unknown> {
  return {} as any
}

export type TokenValuesByCategory<TTokens, TSemanticTokens> = {
  [Cat in keyof (TTokens & SemanticTokens)]:
    | (Cat extends keyof TTokens ? TokenPaths<TTokens[Cat]> : never)
    | (Cat extends keyof TSemanticTokens ? TokenPaths<TSemanticTokens[Cat]> : never)
}

type UnderscoreConditions<TConditions> = Pretty<{
  [K in keyof TConditions as `_${string & K}`]: TConditions[K]
}>

interface StyleFunctions<TProps, TConditions, TStyleObject = SystemStyleObject<TProps, TConditions>> {
  defineStyles(props: TStyleObject): TStyleObject
  defineRecipe: <T extends RecipeVariantRecord<TStyleObject>>(recipe: RecipeConfig<TStyleObject, T>) => this
}

interface ThemeConfigFn<
  TConditions,
  TTokens,
  TSemanticTokens,
  TUtilities,
  Conditions = UnderscoreConditions<TConditions>,
  TokenNames = TokenValuesByCategory<TTokens, TSemanticTokens>,
  Shorthands = ShorthandMapping<TUtilities>,
  PropertyValues = PropertyValueTypes<TUtilities, TokenNames>,
  Properties = SystemProperties<PropertyValues, Conditions, Shorthands>,
  // Styles = SystemStyleObject<Properties, Conditions>,
> extends StyleFunctions<Properties, Conditions> {
  // /**
  //  * @internal The names of all tokens using a dot-delimited path. Only used for type inference.
  //  */
  // _tokenNames: TokenNames
  // /**
  //  * @internal A record of known tokens/semanticTokens/utilities/shorthands properties with their possible values. Only used for type inference.
  //  */
  // _propertyValues: PropertyValues
  // /**
  //  * @internal The system properties, including native CSS properties and values. Only used for type inference.
  //  */
  // _properties: Properties
  // /**
  //  * @internal The system properties as a recursive nested style object with conditions and CSS variables. Only used for type inference.
  //  */
  // _styles: Styles
}

/* -----------------------------------------------------------------------------
 * System properties types
 * -----------------------------------------------------------------------------*/

type UtilityValues<TTokensByCategory, TValues> = TValues extends keyof TTokensByCategory
  ? TTokensByCategory[TValues]
  : TValues extends string
    ? TValues
    : TValues extends { type: infer ValueType }
      ? ValueType extends 'string'
        ? string
        : ValueType extends 'boolean'
          ? boolean
          : ValueType extends 'number'
            ? number
            : 'invalid utility type'
      : TValues extends string[]
        ? TValues[number]
        : TValues extends Record<string | number, any>
          ? keyof TValues
          : TValues extends Function
            ? 'using a function'
            : 'invalid value'

export type LonghandUtilityProps<TUtilities, TTokensByCategory> = {
  [K in keyof TUtilities]: TUtilities[K] extends { values: infer TValues }
    ? UtilityValues<TTokensByCategory, TValues>
    : never
}

// export type LonghandUtilityProps<TUtilities, TTokensByCategory> = {
//   [K in keyof TUtilities as TUtilities[K] extends { values: any } ? K : never]: TUtilities[K] extends {
//     values: infer TValues
//   }
//     ? UtilityValues<TTokensByCategory, TValues>
//     : never
// }

// export type ShorthandMapping<TUtiliyConfig> = Pretty<
//   UnionToIntersection<
//     {
//       [TProp in keyof TUtiliyConfig]: TUtiliyConfig[TProp] extends { shorthand: infer TShorthand }
//         ? TShorthand extends string
//           ? {
//               [K in TShorthand]: TProp
//             }
//           : never
//         : never
//     }[keyof TUtiliyConfig]
//   >
// >
export type ShorthandMapping<TUtilityConfig> = {
  [TProp in keyof TUtilityConfig as TUtilityConfig[TProp] extends { shorthand: infer TShorthand }
    ? TShorthand extends string
      ? TShorthand
      : never
    : never]: TProp
}

export type ShorthandProps<TUtiliyConfig, TLonghandProps, TMapping = ShorthandMapping<TUtiliyConfig>> = {
  [TShorthand in keyof TMapping]: TMapping[TShorthand] extends keyof TLonghandProps
    ? {
        [K in TMapping[TShorthand]]: TLonghandProps[K]
      }[TMapping[TShorthand]]
    : never
}

export type PropertyValueTypes<
  TUtilities,
  TTokensByCategory,
  TLonghand = LonghandUtilityProps<TUtilities, TTokensByCategory>,
  TShorthandProps = ShorthandProps<TUtilities, TLonghand>,
> = TLonghand & TShorthandProps
// > = TLonghand
// TODO fix TShorthandProps TS instantiations count

/* -----------------------------------------------------------------------------
 * Property values
 * -----------------------------------------------------------------------------*/

// TODO strictTokens + strictPropertyValues
type StrictableProps = 'alignContent' | 'alignItems'

type WithEscapeHatch<T> = T | `[${string}]`

type FilterVagueString<Key, Value> = Value extends boolean
  ? Value
  : Key extends StrictableProps
    ? Value extends `${infer _}`
      ? Value
      : never
    : Value

type Conditional<V, TConditions> =
  | V
  | Array<V | null>
  | {
      [K in keyof TConditions]?: Conditional<V, TConditions>
    }

type ConditionalValue<T, TConditions> = Conditional<T, TConditions>
type PropOrCondition<_Key, Value, TConditions> = ConditionalValue<Value | (string & {}), TConditions>

type CssValue<T> = T extends keyof CssProperties ? CssProperties[T] : never
type PropertyTypeValue<K extends string, TPropertyTypes, TConditions> = K extends keyof TPropertyTypes
  ? PropOrCondition<K, TPropertyTypes[K] | CssValue<K>, TConditions>
  : 2

type CssPropertyValue<T extends string, TConditions> = T extends keyof CssProperties
  ? PropOrCondition<T, CssProperties[T], TConditions>
  : 3

type PropertyValue<P extends string, TPropertyTypes, TConditions, TShorthands> = P extends keyof TShorthands
  ? PropertyTypeValue<TShorthands[P] extends string ? TShorthands[P] : never, TPropertyTypes, TConditions>
  : P extends keyof TPropertyTypes
    ? PropertyTypeValue<P, TPropertyTypes, TConditions>
    : P extends keyof CssProperties
      ? CssPropertyValue<P, TConditions>
      : PropOrCondition<P, string | number, TConditions>

/* -----------------------------------------------------------------------------
 * System style object types
 * -----------------------------------------------------------------------------*/

export type SystemProperties<TPropertyTypes, TConditions, TShorthands> = {
  [TProp in keyof (TPropertyTypes & CssProperties)]?: TProp extends string
    ? PropertyValue<TProp, TPropertyTypes, TConditions, TShorthands>
    : never
}

// TODO ? those types are currently not exported from `@pandacss/types`
// import type { AnySelector, Selectors } from '../../types/src/selectors'
// TSelectors = Selectors | AnySelector | keyof TConditions
type Nested<TProps, TConditions, TSelectors = keyof TConditions, Depth = 10> = Depth extends 0
  ? TProps
  : TProps & {
      [K in TSelectors as K extends string ? K : never]?: Nested<TProps, TConditions, TSelectors, Decrement<Depth>>
    }

// TODO ? those types are currently not exported from `@pandacss/types`
// import type { CssVarProperties } from '../../types/src/style-props'
// Nested<TProps & CssVarProperties, TConditions>
export type SystemStyleObject<TProps, TConditions> = Nested<TProps, TConditions>

/* -----------------------------------------------------------------------------
 * Recipe types
 * -----------------------------------------------------------------------------*/

type RecipeVariantRecord<TStyleObject> = Record<any, Record<any, TStyleObject>>
type RecipeCompoundVariant<T, TStyleObject> = T & {
  css: TStyleObject
}
type StringToBoolean<T> = T extends 'true' | 'false' ? boolean : T

type RecipeSelection<T> = keyof any extends keyof T
  ? {}
  : {
      [K in keyof T]?: StringToBoolean<keyof T[K]> | undefined
    }

interface RecipeDefinition<TStyleObject, T = RecipeVariantRecord<TStyleObject>> {
  /**
   * The base styles of the recipe.
   */
  base?: TStyleObject
  /**
   * The multi-variant styles of the recipe.
   */
  variants?: T
  /**
   * The default variants of the recipe.
   */
  defaultVariants?: RecipeSelection<T>
  /**
   * The styles to apply when a combination of variants is selected.
   */
  compoundVariants?: Pretty<RecipeCompoundVariant<RecipeCompoundSelection<T>, TStyleObject>>[]
  /**
   * Variants to pre-generate, will be include in the final `config.staticCss`
   */
  staticCss?: RecipeRule[]
}

interface RecipeConfig<TStyleObject, T = RecipeVariantRecord<TStyleObject>>
  extends RecipeDefinition<TStyleObject, T>,
    RecipeConfigMeta {}

/* -----------------------------------------------------------------------------
 * Utility types
 * -----------------------------------------------------------------------------*/

type TokenPaths<T, Prefix extends string = '', Depth extends number = 10> = Depth extends 0
  ? never
  : T extends object
    ? {
        [K in keyof T]-?: K extends 'value' | 'DEFAULT'
          ? never
          : K extends string | number
            ? `${Prefix}${K}` | TokenPaths<T[K], `${Prefix}${K}.`, Depth extends 1 ? 0 : Decrement<Depth>>
            : never
      }[keyof T]
    : ''

// Believe it or not this is the most efficient way to do it
type Decrement<N> = N extends 10
  ? 9
  : N extends 9
    ? 8
    : N extends 8
      ? 7
      : N extends 7
        ? 6
        : N extends 6
          ? 5
          : N extends 5
            ? 4
            : N extends 4
              ? 3
              : N extends 3
                ? 2
                : N extends 2
                  ? 1
                  : 0

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

export interface ThemeBuilder<TOptions, TConditions, TTokens, TSemanticTokens, TUtilities> {
  // TODO breakpoints
  conditions<const T>(defs: T): ThemeBuilder<TOptions, Pretty<T & TConditions>, TTokens, TSemanticTokens, TUtilities>
  tokens<const T>(
    tokens: T extends Tokens ? T : Tokens,
  ): ThemeBuilder<TOptions, TConditions, Pretty<T & TTokens>, TSemanticTokens, TUtilities>
  semanticTokens<const T>(
    tokens: TConditions extends { [Key in infer TCondKeys]: string }
      ? T extends SemanticTokens<TCondKeys extends string ? TCondKeys : never>
        ? T
        : SemanticTokens
      : never,
  ): ThemeBuilder<TOptions, TConditions, TTokens, Pretty<T & TSemanticTokens>, TUtilities>
  utilities: <const T extends UtilityConfig>(
    utilities: T,
  ) => ThemeBuilder<TOptions, TConditions, TTokens, TSemanticTokens, Pretty<T & TUtilities>>
  // build: () => ThemeConfigFn<{
  //   conditions: TConditions
  //   tokens: TTokens
  //   semanticTokens: TSemanticTokens
  //   utilities: TUtilities
  // }>
  build: () => ThemeConfigFn<TOptions, TConditions, TTokens, TSemanticTokens, TUtilities>
  //
  /**
   * @internal The config.conditions of the theme. Only used for type inference.
   */
  _conditions: TConditions
  /**
   * @internal The config.tokens of the theme. Only used for type inference.
   */
  _tokens: TTokens
  /**
   * @internal The config.semanticTokens of the theme. Only used for type inference.
   */
  _semanticTokens: TSemanticTokens
  /**
   * @internal The config.utilities of the theme. Only used for type inference.
   */
  _utilities: TUtilities
}

interface ThemeOptions {
  shorthands?: boolean
  strictTokens?: boolean
  strictPropertyValues?: boolean
}

interface DefaultThemeOptions {
  shorthands: true
  strictTokens: false
  strictPropertyValues: false
}

export function defineTheme<Options extends ThemeOptions = DefaultThemeOptions>(
  options: Options = {
    shorthands: true,
    strictTokens: false,
    strictPropertyValues: false,
  } as any,
): ThemeBuilder<Options, unknown, unknown, unknown, unknown> {
  return {} as any
}

export type TokenValuesByCategory<TTokens, TSemanticTokens> = {
  -readonly [Cat in keyof (TTokens & SemanticTokens)]:
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
  TOptions,
  TConditions,
  TTokens,
  TSemanticTokens,
  TUtilities,
  Conditions = UnderscoreConditions<TConditions>,
  TokenNames = TokenValuesByCategory<TTokens, TSemanticTokens>,
  ShorthandsMap = ShorthandMapping<TUtilities>,
  PropertyValues = PropertyValueTypes<TOptions, TUtilities, TokenNames, ShorthandsMap>,
  Properties = SystemProperties<PropertyValues, TOptions, Conditions, ShorthandsMap>,
  // Styles = SystemStyleObject<Properties, Conditions>,
> extends StyleFunctions<Properties, Conditions> {
  // /**
  //  * @internal The names of all tokens using a dot-delimited path. Only used for type inference.
  //  */
  // _tokenNames: TokenNames
  /**
   * @internal A record of known tokens/semanticTokens/utilities/shorthands properties with their possible values. Only used for type inference.
   */
  _propertyValues: PropertyValues
  // /**
  //  * @internal The system properties, including native CSS properties and values. Only used for type inference.
  //  */
  _properties: Properties
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

type PropertyValueWithShorthands<
  TUtilities,
  TTokensByCategory,
  ShorthandsMap,
  TLonghand = LonghandUtilityProps<TUtilities, TTokensByCategory>,
> = TLonghand & ShorthandProps<TUtilities, TLonghand, ShorthandsMap>

type PropertyValueWithoutShorthands<TUtilities, TTokensByCategory> = LonghandUtilityProps<TUtilities, TTokensByCategory>

export type PropertyValueTypes<TOptions, TUtilities, TTokensByCategory, ShorthandsMap> = TOptions extends {
  shorthands?: true
}
  ? PropertyValueWithShorthands<TUtilities, TTokensByCategory, ShorthandsMap>
  : PropertyValueWithoutShorthands<TUtilities, TTokensByCategory>

/* -----------------------------------------------------------------------------
 * Property values
 * -----------------------------------------------------------------------------*/

type StrictableProps =
  | 'alignContent'
  | 'alignItems'
  | 'alignSelf'
  | 'all'
  | 'animationComposition'
  | 'animationDirection'
  | 'animationFillMode'
  | 'appearance'
  | 'backfaceVisibility'
  | 'backgroundAttachment'
  | 'backgroundClip'
  | 'borderCollapse'
  | 'border'
  | 'borderBlock'
  | 'borderBlockEnd'
  | 'borderBlockStart'
  | 'borderBottom'
  | 'borderInline'
  | 'borderInlineEnd'
  | 'borderInlineStart'
  | 'borderLeft'
  | 'borderRight'
  | 'borderTop'
  | 'borderBlockEndStyle'
  | 'borderBlockStartStyle'
  | 'borderBlockStyle'
  | 'borderBottomStyle'
  | 'borderInlineEndStyle'
  | 'borderInlineStartStyle'
  | 'borderInlineStyle'
  | 'borderLeftStyle'
  | 'borderRightStyle'
  | 'borderTopStyle'
  | 'boxDecorationBreak'
  | 'boxSizing'
  | 'breakAfter'
  | 'breakBefore'
  | 'breakInside'
  | 'captionSide'
  | 'clear'
  | 'columnFill'
  | 'columnRuleStyle'
  | 'contentVisibility'
  | 'direction'
  | 'display'
  | 'emptyCells'
  | 'flexDirection'
  | 'flexWrap'
  | 'float'
  | 'fontKerning'
  | 'forcedColorAdjust'
  | 'isolation'
  | 'lineBreak'
  | 'mixBlendMode'
  | 'objectFit'
  | 'outlineStyle'
  | 'overflow'
  | 'overflowX'
  | 'overflowY'
  | 'overflowBlock'
  | 'overflowInline'
  | 'overflowWrap'
  | 'pointerEvents'
  | 'position'
  | 'resize'
  | 'scrollBehavior'
  | 'touchAction'
  | 'transformBox'
  | 'transformStyle'
  | 'userSelect'
  | 'visibility'
  | 'wordBreak'
  | 'writingMode'

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
type PropOrCondition<Key, Value, TOptions, TConditions> = TOptions extends {
  strictTokens?: true
  strictPropertyValues?: true
}
  ? ConditionalValue<WithEscapeHatch<FilterVagueString<Key, Value>>, TConditions>
  : TOptions extends { strictTokens?: true }
    ? ConditionalValue<WithEscapeHatch<Value>, TConditions>
    : TOptions extends { strictPropertyValues?: true }
      ? ConditionalValue<Value, TConditions>
      : ConditionalValue<Value | (string & {}), TConditions>

type CssValue<T> = T extends keyof CssProperties ? CssProperties[T] : never
type PropertyTypeValue<K extends string, TPropertyTypes, TOptions, TConditions> = K extends keyof TPropertyTypes
  ? PropOrCondition<
      K,
      TOptions extends {
        strictTokens?: true
        strictPropertyValues?: true
      }
        ? TPropertyTypes[K]
        : TOptions extends { strictPropertyValues?: true }
          ? K extends StrictableProps
            ? TPropertyTypes[K]
            : TPropertyTypes[K] | CssValue<K>
          : TPropertyTypes[K] | CssValue<K>,
      TOptions,
      TConditions
    >
  : never

type CssPropertyValue<K extends string, TOptions, TConditions> = K extends keyof CssProperties
  ? PropOrCondition<K, CssProperties[K], TOptions, TConditions>
  : never

type PropertyValue<K extends string, TPropertyTypes, TOptions, TConditions, TShorthands> = K extends keyof TShorthands
  ? PropertyTypeValue<TShorthands[K] extends string ? TShorthands[K] : never, TPropertyTypes, TOptions, TConditions>
  : K extends keyof TPropertyTypes
    ? PropertyTypeValue<K, TPropertyTypes, TOptions, TConditions>
    : K extends keyof CssProperties
      ? CssPropertyValue<K, TOptions, TConditions>
      : PropOrCondition<K, string | number, TOptions, TConditions>

/* -----------------------------------------------------------------------------
 * System style object types
 * -----------------------------------------------------------------------------*/

export type SystemProperties<TPropertyTypes, TOptions, TConditions, TShorthands> = {
  [TProp in keyof (TPropertyTypes & CssProperties)]?: TProp extends string
    ? PropertyValue<TProp, TPropertyTypes, TOptions, TConditions, TShorthands>
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

export type TokenPaths<T, Prefix extends string = '', Depth extends number = 10> = Depth extends 0
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

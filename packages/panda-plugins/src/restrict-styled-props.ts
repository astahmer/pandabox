import type { CodegenPrepareHookArgs, PandaPlugin } from '@pandacss/types'

const supportedJsxFrameworks = ['react']

/**
 * Adds a `props` on the `styled` JSX Factory to restrict the props that can be passed to the component
 */
export const pluginRestrictStyledProps = (): PandaPlugin => {
  return {
    name: 'restrict-styled-props',
    hooks: {
      'config:resolved': (args) => {
        const jsxFramework = args.config.jsxFramework
        if (!supportedJsxFrameworks.includes(jsxFramework as string)) {
          throw new Error(
            `[plugin:restrict-styled-props]: Unsupported jsxFramework: ${jsxFramework}. This Panda plugin only supports: ${supportedJsxFrameworks.join(', ')}`,
          )
        }
      },
      'codegen:prepare': (args) => {
        return transformRestrictStyledProps(args)
      },
    },
  }
}

export const transformRestrictStyledProps = (args: CodegenPrepareHookArgs) => {
  const factoryArtifact = args.artifacts.find((art) => art.id === 'jsx-factory')
  const factoryJs = factoryArtifact?.files.find((f) => f.file.includes('.mjs') || f.file.includes('.js'))
  const jsxTypes = args.artifacts.find((art) => art.id === 'types-jsx')?.files.find((f) => f.file.includes('jsx'))

  if (!factoryJs?.code || !jsxTypes?.code) {
    return args.artifacts
  }

  factoryJs.code = factoryJs.code
    .replace(
      'function styledFn',
      `
  const filterProps = (styles, allowedProps) => {
    if (!allowedProps) return styles

    return Object.fromEntries(Object.entries(styles).filter(([key]) => allowedProps.includes(key)))
  }

  function styledFn`,
    )
    .replaceAll('cssStyles)', 'filterProps(cssStyles, configOrCva.props))')

  factoryJs.code = factoryJs.code.replace('variantProps, styleProps', 'variantProps, _styleProps').replace(
    'function recipeClass',
    `
  const styleProps = filterProps(_styleProps, configOrCva.props)
  function recipeClass`,
  )

  const startIndex = jsxTypes.code.indexOf('export interface StyledComponent')
  const endIndex = jsxTypes.code.indexOf('export type JsxElements')

  jsxTypes.code =
    jsxTypes.code.slice(0, startIndex) +
    `export interface StyledComponent<T extends ElementType, P extends Dict = {}, TStyleProp> {
    (
      props: JsxHTMLProps<
        ComponentProps<T>,
        Assign<TStyleProp extends never ? JsxStyleProps : Pick<JsxStyleProps, TStyleProp>, P>
      >,
    ): JSX.Element
    displayName?: string
  }

  interface RecipeFn {
    __type: any
  }

  interface JsxFactoryOptions<TProps extends Dict> {
    dataAttr?: boolean
    defaultProps?: TProps
    shouldForwardProp?(prop: string, variantKeys: string[]): boolean
  }

  export type JsxRecipeProps<T extends ElementType, P extends Dict> = JsxHTMLProps<ComponentProps<T>, P>

  export type JsxElement<T extends ElementType, P extends Dict, TStyleProp extends StyleProp> =
    T extends StyledComponent<infer A, infer B, infer TStyleProp>
      ? StyledComponent<A, Pretty<DistributiveUnion<P, B>>, TStyleProp>
      : StyledComponent<T, P, TStyleProp>

  type StyleProp = keyof SystemProperties | 'css'

  interface StyledRecipeDefinition<T extends RecipeVariantRecord, TStyleProp extends StyleProp>
    extends RecipeDefinition<T> {
    props?: TStyleProp[]
  }

  export interface JsxFactory {
    <T extends ElementType>(component: T): StyledComponent<T, {}>
    <T extends ElementType, P extends RecipeVariantRecord, TStyleProp extends StyleProp>(
      component: T,
      recipe: StyledRecipeDefinition<P, TStyleProp>,
      options?: JsxFactoryOptions<JsxRecipeProps<T, RecipeSelection<P>>>,
    ): JsxElement<T, RecipeSelection<P>, TStyleProp>
    <T extends ElementType, P extends RecipeFn>(
      component: T,
      recipeFn: P,
      options?: JsxFactoryOptions<JsxRecipeProps<T, P['__type']>>,
    ): JsxElement<T, P['__type']>
  }` +
    jsxTypes.code.slice(endIndex)

  return args.artifacts
}

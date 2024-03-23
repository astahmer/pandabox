import { createContext } from '#pandabox/fixtures'
import type { Config } from '@pandacss/types'
import { describe, expect, test } from 'vitest'
import { transformRestrictStyledProps } from '../src/restrict-styled-props'

const run = (userConfig?: Config) => {
  const ctx = createContext(Object.assign({}, userConfig))
  const artifacts = ctx.getArtifacts()

  const updated = transformRestrictStyledProps({ artifacts, changed: undefined })

  const factoryArtifact = updated.find((art) => art.id === 'jsx-factory')
  const factoryJs = factoryArtifact?.files.find((f) => f.file.includes('.mjs') || f.file.includes('.js'))
  const jsxTypes = updated.find((art) => art.id === 'types-jsx')?.files.find((f) => f.file.includes('jsx'))

  return [factoryJs, jsxTypes]
}

describe('restrict-styled-props', () => {
  test('empty', () => {
    expect(run()).toMatchInlineSnapshot(`
      [
        {
          "code": "import { createElement, forwardRef, useMemo } from 'react'
      import { css, cx, cva } from '../css/index.mjs';
      import { defaultShouldForwardProp, composeShouldForwardProps, composeCvaFn, getDisplayName } from './factory-helper.mjs';
      import { splitProps, normalizeHTMLProps } from '../helpers.mjs';
      import { isCssProperty } from './is-valid-prop.mjs';


        const filterProps = (styles, allowedProps) => {
          if (!allowedProps) return styles

          return Object.fromEntries(Object.entries(styles).filter(([key]) => allowedProps.includes(key)))
        }

        function styledFn(Dynamic, configOrCva = {}, options = {}) {
        const cvaFn = configOrCva.__cva__ || configOrCva.__recipe__ ? configOrCva : cva(configOrCva)

        const forwardFn = options.shouldForwardProp || defaultShouldForwardProp
        const shouldForwardProp = (prop) => forwardFn(prop, cvaFn.variantKeys)

        const defaultProps = Object.assign(
          options.dataAttr && configOrCva.__name__ ? { 'data-recipe': configOrCva.__name__ } : {},
          options.defaultProps,
        )

        const __cvaFn__ = composeCvaFn(Dynamic.__cva__, cvaFn)
        const __shouldForwardProps__ = composeShouldForwardProps(Dynamic, shouldForwardProp)
        const __base__ = Dynamic.__base__ || Dynamic

        const StyledComponent = /* @__PURE__ */ forwardRef(function StyledComponent(props, ref) {
          const { as: Element = __base__, children, ...restProps } = props

          const combinedProps = useMemo(() => Object.assign({}, defaultProps, restProps), [restProps])

          const [htmlProps, forwardedProps, variantProps, _styleProps, elementProps] = useMemo(() => {
            return splitProps(combinedProps, normalizeHTMLProps.keys, __shouldForwardProps__, __cvaFn__.variantKeys, isCssProperty)
          }, [combinedProps])

          
        const styleProps = filterProps(_styleProps, configOrCva.props)
        function recipeClass() {
            const { css: cssStyles, ...propStyles } = styleProps
            const compoundVariantStyles = __cvaFn__.__getCompoundVariantCss__?.(variantProps)
            return cx(__cvaFn__(variantProps, false), css(compoundVariantStyles, propStyles, filterProps(cssStyles, configOrCva.props)), combinedProps.className)
          }

          function cvaClass() {
            const { css: cssStyles, ...propStyles } = styleProps
            const cvaStyles = __cvaFn__.raw(variantProps)
            return cx(css(cvaStyles, propStyles, filterProps(cssStyles, configOrCva.props)), combinedProps.className)
          }

          const classes = configOrCva.__recipe__ ? recipeClass : cvaClass

          return createElement(Element, {
            ref,
            ...forwardedProps,
            ...elementProps,
            ...normalizeHTMLProps(htmlProps),
            className: classes(),
          }, combinedProps.children ?? children)
        })

        const name = getDisplayName(__base__)

        StyledComponent.displayName = \`styled.\${name}\`
        StyledComponent.__cva__ = __cvaFn__
        StyledComponent.__base__ = __base__
        StyledComponent.__shouldForwardProps__ = shouldForwardProp

        return StyledComponent
      }

      function createJsxFactory() {
        const cache = new Map()

        return new Proxy(styledFn, {
          apply(_, __, args) {
            return styledFn(...args)
          },
          get(_, el) {
            if (!cache.has(el)) {
              cache.set(el, styledFn(el))
            }
            return cache.get(el)
          },
        })
      }

      export const styled = /* @__PURE__ */ createJsxFactory()
      ",
          "file": "factory.mjs",
        },
        {
          "code": "/* eslint-disable */
      import type { ComponentPropsWithoutRef, ElementType, ElementRef, Ref } from 'react'
      import type { RecipeDefinition, RecipeSelection, RecipeVariantRecord } from './recipe';
      import type { Assign, DistributiveOmit, DistributiveUnion, JsxHTMLProps, JsxStyleProps, Pretty } from './system-types';

      interface Dict {
        [k: string]: unknown
      }

      export type ComponentProps<T extends ElementType> = DistributiveOmit<ComponentPropsWithoutRef<T>, 'ref'> & {
        ref?: Ref<ElementRef<T>>
      }

      export interface StyledComponent<T extends ElementType, P extends Dict = {}, TStyleProp> {
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
        }export type JsxElements = {
        [K in keyof JSX.IntrinsicElements]: StyledComponent<K, {}>
      }

      export type Styled = JsxFactory & JsxElements

      export type HTMLStyledProps<T extends ElementType> = JsxHTMLProps<ComponentProps<T>, JsxStyleProps>

      export type StyledVariantProps<T extends StyledComponent<any, any>> = T extends StyledComponent<any, infer Props> ? Props : never",
          "file": "jsx.d.ts",
        },
      ]
    `)
  })
})

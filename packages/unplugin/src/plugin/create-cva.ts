import { compact } from '@pandacss/shared'
import { type RecipeConfig } from '@pandacss/types'
import { type PandaPluginContext } from './create-context'

type Cva = Pick<RecipeConfig, 'base' | 'variants' | 'compoundVariants'>

const defaults = (conf: Cva) => ({
  base: {},
  variants: {},
  defaultVariants: {},
  compoundVariants: [],
  ...conf,
})

export const createCva = (config: Cva, mergeCss: PandaPluginContext['mergeCss']) => {
  const { base, variants, defaultVariants, compoundVariants } = defaults(config)

  function resolve(props = {}) {
    const computedVariants = { ...defaultVariants, ...compact(props) }
    let variantCss = { ...base }
    for (const [key, value] of Object.entries(computedVariants)) {
      const variantStyleObj = variants[key]?.[value as any]
      if (variantStyleObj) {
        variantCss = mergeCss(variantCss, variantStyleObj)
      }
    }
    const compoundVariantCss = getCompoundVariantCss(compoundVariants, computedVariants, mergeCss)
    return mergeCss(variantCss, compoundVariantCss)
  }

  return resolve
}

function getCompoundVariantCss(
  compoundVariants: any[],
  variantMap: Record<string, string>,
  mergeCss: PandaPluginContext['mergeCss'],
) {
  let result = {}
  compoundVariants.forEach((compoundVariant) => {
    const isMatching = Object.entries(compoundVariant).every(([key, value]) => {
      if (key === 'css') return true

      const values = Array.isArray(value) ? value : [value]
      return values.some((value) => variantMap[key] === value)
    })

    if (isMatching) {
      result = mergeCss(result, compoundVariant.css)
    }
  })

  return result
}

export const transformCva = (
  name: string,
  config: Pick<RecipeConfig, 'base' | 'variants' | 'compoundVariants'>,
  css: PandaPluginContext['css'],
) => {
  const { base, variants, defaultVariants, compoundVariants } = defaults(config)

  return `(function () {
    const base = ${JSON.stringify(css(base))}
    const variantStyles = ${JSON.stringify(
      Object.fromEntries(
        Object.entries(variants).map(([variantKey, variantMap]) => [
          variantKey,
          Object.fromEntries(
            Object.entries(variantMap).map(([valueKey, variantStyle]) => [valueKey, css(variantStyle)]),
          ),
        ]),
      ),
      null,
      2,
    )}

    const defaultVariants = ${JSON.stringify(defaultVariants)}

    return function ${name}(variants) {
      ${
        compoundVariants.length > 0
          ? `
      const classList = [inlineCva(base, defaultVariants, variantStyles, variants)]
      const compoundVariants = ${JSON.stringify(compoundVariants)}

      addCompoundVariantCss(compoundVariants, variantProps, classList)
      return classList.join(' ')`
          : `return inlineCva(base, defaultVariants, variantStyles, variants)`
      }

    }
  })()`
}

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

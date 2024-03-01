import type { PandaPlugin } from '@pandacss/types'
import { removeUnusedCssVars, removeUnusedKeyframes } from '@pandabox/postcss-plugins'
import postcss from 'postcss'

export interface RemoveUnusedCssOptions {
  /**
   * Remove unused CSS variables
   * @default true
   *
   * NOTE: using this means you can't use the JS function `token.var(xxx)` / `token(xxx)` from `styled-system/tokens`
   * where `xxx` is the path to a semanticToken
   *
   * since the CSS variables will be removed based on the usage found in the generated CSS only
   * without looking at your style usage in your source files
   */
  removeCssVars?: boolean
  /**
   * Remove unused keyframes
   * @default true
   */
  removeKeyframes?: boolean
}

const defaultOptions: RemoveUnusedCssOptions = {
  removeCssVars: true,
  removeKeyframes: true,
}

/**
 * Removes unused CSS vars and/or @keyframes
 *
 * @see https://panda-css.com/docs/concepts/hooks#remove-unused-variables-from-final-css
 *
 * NOTE: using this means you can't use the JS function `token.var(xxx)` / `token(xxx)` from `styled-system/tokens`
 * where `xxx` is the path to a semanticToken
 *
 * since the CSS variables will be removed based on the usage found in the generated CSS only
 * without looking at your style usage in your source files
 */
export const pluginRemoveUnusedCss = (options: RemoveUnusedCssOptions = defaultOptions): PandaPlugin => {
  return {
    name: 'remove-unused-css',
    hooks: {
      'cssgen:done': ({ artifact, content }) => {
        const isEnabled = options.removeCssVars || options.removeKeyframes
        if (!isEnabled) return

        if (artifact !== 'styles.css') return

        let css = content
        const plugins = []

        if (options.removeCssVars) {
          plugins.push(removeUnusedCssVars)
        } else if (options.removeKeyframes) {
          plugins.push(removeUnusedKeyframes)
        }

        return postcss(plugins).process(css).toString()
      },
    },
  }
}

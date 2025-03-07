import { removeUnusedCssVars, removeUnusedKeyframes } from '@pandabox/postcss-plugins'
import type { Stylesheet } from '@pandacss/core'
import { PandaContext, codegen } from '@pandacss/node'
import { createCss, createMergeCss } from '@pandacss/shared'
import type { LoadConfigResult } from '@pandacss/types'
import path from 'node:path'
import postcss from 'postcss'

import type { PandaPluginOptions } from './core'
import { ensureAbsolute } from './ensure-absolute'

export interface ContextOptions {
  root: string
  conf: LoadConfigResult
  codegen?: boolean
}

export const createContext = (options: ContextOptions) => {
  const { conf } = options
  let panda = new PandaContext(conf)

  const root = ensureAbsolute('', options.root)
  const files = new Map<string, string>()

  const toCss = async (sheet: Stylesheet, opts: PandaPluginOptions) => {
    panda.appendLayerParams(sheet)
    panda.appendBaselineCss(sheet)
    panda.appendParserCss(sheet)
    let css = panda.getCss(sheet)

    if (opts.optimizeCss) {
      css = postcss([removeUnusedCssVars, removeUnusedKeyframes]).process(css).toString()
    }

    if (opts.minifyCss) {
      // esbuild is a peer dependency
      const { transform } = await import('esbuild')
      if (transform) {
        const { code } = await transform(css, { loader: 'css', minify: true })
        css = code
      }
    }

    return css
  }

  const css = createCss(panda.baseSheetContext)
  const mergeFns = createMergeCss(panda.baseSheetContext)
  const mergeCss: (...styles: StyleObject[]) => StyleObject = mergeFns.mergeCss

  return {
    // So that we can mutate the `panda` variable and it's still reflected outside
    get panda() {
      return panda
    },
    css,
    mergeCss,
    reloadContext: async () => {
      const affecteds = await panda.diff.reloadConfigAndRefreshContext((conf) => {
        panda = new PandaContext(conf)
      })

      // logger.info('ctx:updated', 'config rebuilt ✅')
      await panda.hooks['config:change']?.({ config: panda.config, changes: affecteds })
      if (options.codegen) {
        await codegen(panda, Array.from(affecteds.artifacts))
      }

      return panda
    },
    root,
    files,
    toCss,
    paths: { root },
  }
}
export type PandaPluginContext = Awaited<ReturnType<typeof createContext>>

export interface StyleObject {
  [key: string]: any
}

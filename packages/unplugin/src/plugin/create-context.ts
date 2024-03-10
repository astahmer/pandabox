import { removeUnusedCssVars, removeUnusedKeyframes } from '@pandabox/postcss-plugins'
import type { Stylesheet } from '@pandacss/core'
import { PandaContext, codegen } from '@pandacss/node'
import type { LoadConfigResult } from '@pandacss/types'
import postcss from 'postcss'

import type { PandaPluginOptions } from './core'
import { ensureAbsolute } from './ensure-absolute'

export interface ContextOptions {
  root: string
  conf: LoadConfigResult
}

export const createContext = (options: ContextOptions) => {
  const { conf } = options
  let panda = new PandaContext(conf)

  const root = ensureAbsolute('', options.root)
  const files = new Map<string, string>()

  const toCss = (sheet: Stylesheet, opts: PandaPluginOptions) => {
    panda.appendLayerParams(sheet)
    panda.appendBaselineCss(sheet)
    panda.appendParserCss(sheet)

    const css = panda.getCss(sheet)
    if (!opts.optimizeCss) return css

    const optimized = postcss([removeUnusedCssVars, removeUnusedKeyframes]).process(css)
    return optimized.toString()
  }

  return {
    // So that we can mutate the `panda` variable and it's still reflected outside
    get panda() {
      return panda
    },
    reloadContext: async () => {
      const affecteds = await panda.diff.reloadConfigAndRefreshContext((conf) => {
        panda = new PandaContext(conf)
      })

      // logger.info('ctx:updated', 'config rebuilt ✅')
      await panda.hooks['config:change']?.({ config: panda.config, changes: affecteds })
      await codegen(panda, Array.from(affecteds.artifacts))

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

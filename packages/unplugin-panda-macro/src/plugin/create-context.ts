import { removeUnusedCssVars, removeUnusedKeyframes } from '@pandabox/postcss-plugins'
import { PandaContext } from '@pandacss/node'
import { createCss, createMergeCss } from '@pandacss/shared'
import { type LoadConfigResult } from '@pandacss/types'
import { isAbsolute, resolve } from 'path'
import postcss from 'postcss'
import path from 'node:path'

import type { PluginOptions } from './core'

const ensureAbsolute = (path: string, root: string) => (path ? (isAbsolute(path) ? path : resolve(root, path)) : root)

export interface MacroContextOptions {
  root: string
  conf: LoadConfigResult
}

export const createMacroContext = (options: MacroContextOptions) => {
  const { conf } = options
  const panda = new PandaContext(conf)

  const root = ensureAbsolute('', options.root)
  const sheet = panda.createSheet()

  const css = createCss(panda.baseSheetContext)
  const mergeFns = createMergeCss(panda.baseSheetContext)
  const mergeCss: (...styles: StyleObject[]) => StyleObject = mergeFns.mergeCss

  const styles = new Map<string, string>()
  const files = new Set<string>()

  const toCss = (opts: PluginOptions) => {
    panda.appendLayerParams(sheet)
    panda.appendBaselineCss(sheet)

    if (opts.output === 'atomic') {
      panda.appendParserCss(sheet)
    } else {
      styles.forEach((serialized) => {
        sheet.layers.utilities.append(serialized)
      })
    }

    const css = sheet.toCss({ optimize: true })
    if (!opts.optimizeCss) return css

    const optimized = postcss([removeUnusedCssVars, removeUnusedKeyframes]).process(css)
    return optimized.toString()
  }

  const outfile = path.join(...panda.paths.getFilePath('panda.css'))
  const outdir = path.dirname(outfile)

  return {
    panda,
    root,
    sheet,
    css,
    mergeCss,
    styles,
    files,
    toCss,
    paths: {
      outfile,
      outdir,
      root,
    },
  }
}

export type MacroContext = Awaited<ReturnType<typeof createMacroContext>>

export interface StyleObject {
  [key: string]: any
}

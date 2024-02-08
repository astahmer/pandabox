import { loadConfig } from '@pandacss/config'
import { RuleProcessor } from '@pandacss/core'
import { PandaContext } from '@pandacss/node'
import { createCss, createMergeCss } from '@pandacss/shared'
import { LoadConfigResult } from '@pandacss/types'
import { isAbsolute, resolve } from 'path'
import { createFilter } from 'vite'

const ensureAbsolute = (path: string, root: string) => (path ? (isAbsolute(path) ? path : resolve(root, path)) : root)

export interface MacroContextOptions {
  root: string
  conf: LoadConfigResult
}

export const createMacroContext = async (options: MacroContextOptions) => {
  const { conf } = options
  const panda = new PandaContext(conf)

  const root = ensureAbsolute('', options.root)
  const isIncluded = createFilter(panda.config.include ?? /\.[jt]sx?$/, panda.config.exclude ?? [/node_modules/], {
    resolve: root,
  })

  const api = new RuleProcessor(panda)
  const sheet = panda.createSheet()

  const css = createCss(panda.baseSheetContext)
  const { mergeCss } = createMergeCss(panda.baseSheetContext)

  const styles = new Map<string, string>()
  const files = new Set<string>()

  return { panda, root, isIncluded, api, sheet, css, mergeCss, styles, files }
}

export type MacroContext = Awaited<ReturnType<typeof createMacroContext>>

// const conf = await loadConfig({ cwd: options.root })
// const panda = await loadConfigAndCreateContext()
// const panda = new PandaContext({
//   ...conf,
//   config: {
//     ...conf.config,
//     hooks: {
//       'context:created': (args) => {
//         console.log(0, args)
//       },
//     },
//   },
// })

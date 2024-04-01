import { loadConfig } from '@pandacss/config'
import { type LoadConfigResult, type RequiredBy } from '@pandacss/types'
import { createFilter } from '@rollup/pluginutils'
import type { UnpluginFactory } from 'unplugin'
import { type HmrContext } from 'vite'

import { createMacroContext, type MacroContext } from '../plugin/create-context'
import { tranformPanda, type TransformOptions } from '../plugin/transform'

const _fileId = 'panda.css'
const _virtualModuleId = 'virtual:' + _fileId
const ids = {
  virtualModuleId: 'virtual:' + _fileId,
  resolvedVirtualModuleId: '\0' + _virtualModuleId,
}

export interface PluginOptions extends Partial<TransformOptions> {
  /** @see https://panda-css.com/docs/references/config#cwd */
  cwd?: string
  /** @see https://panda-css.com/docs/references/cli#--config--c-1 */
  configPath?: string | undefined
  /**
   * @see https://www.npmjs.com/package/@rollup/pluginutils#include-and-exclude
   * @default `[/\.[cm]?[jt]sx?$/]`
   */
  include?: string | RegExp | (string | RegExp)[]
  /**
   * @see https://www.npmjs.com/package/@rollup/pluginutils#include-and-exclude
   * @default [/node_modules/]
   */
  exclude?: string | RegExp | (string | RegExp)[]
  /**
   * Will remove unused CSS variables and keyframes from the generated CSS
   */
  optimizeCss?: boolean
}

export const unpluginFactory: UnpluginFactory<PluginOptions | undefined> = (rawOptions) => {
  const options = resolveOptions(rawOptions ?? {})
  const filter = createFilter(options.include, options.exclude)

  let _ctx: MacroContext
  let initPromise: Promise<MacroContext> | undefined

  const getCtx = async () => {
    await init()
    if (!_ctx) throw new Error('@pandabox/unplugin-panda-macro context not initialized')
    return _ctx as MacroContext
  }

  const init = () => {
    if (initPromise) return initPromise
    // @ts-expect-error
    initPromise = loadConfig({ cwd: options.cwd, file: options.configPath }).then((conf: LoadConfigResult) => {
      _ctx = createMacroContext({ root: options.cwd, conf })
    })

    return initPromise
  }

  return {
    name: 'unplugin-panda-macro',
    enforce: 'pre',
    resolveId(id) {
      if (id === ids.virtualModuleId) {
        return ids.resolvedVirtualModuleId
      }
    },
    async load(id) {
      if (id !== ids.resolvedVirtualModuleId) return

      const ctx = await getCtx()
      const css = ctx.toCss(options)

      return css
    },

    transformInclude(id) {
      return filter(id)
    },
    async transform(code, id) {
      const ctx = await getCtx()
      const { panda } = ctx

      const sourceFile = panda.project.addSourceFile(id, code)
      const parserResult = panda.project.parseSourceFile(id)
      if (!parserResult) return null

      return tranformPanda(ctx, {
        code,
        id,
        output: options.output,
        sourceFile,
        parserResult,
        keepRecipeClassNames: options.keepRecipeClassNames,
        onlyMacroImports: options.onlyMacroImports,
      })
    },
    vite: {
      async handleHotUpdate(hmr: HmrContext) {
        const ctx = await getCtx()
        if (!ctx.files.has(hmr.file)) return

        const mod = hmr.server.moduleGraph.getModuleById(ids.resolvedVirtualModuleId)
        if (mod) {
          hmr.server.moduleGraph.invalidateModule(mod, new Set(), hmr.timestamp, true)
        }
      },
    },
  }
}

const resolveOptions = (options: PluginOptions): RequiredBy<PluginOptions, 'cwd'> => {
  return {
    cwd: options.cwd || process.cwd(),
    configPath: options.configPath,
    include: options.include || [/\.[cm]?[jt]sx?$/],
    exclude: options.exclude || [/node_modules/],
    output: options?.output || 'atomic',
    optimizeCss: options.optimizeCss ?? true,
    keepRecipeClassNames: options.keepRecipeClassNames ?? false,
    onlyMacroImports: options.onlyMacroImports ?? false,
  }
}

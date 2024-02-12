import { loadConfig } from '@pandacss/config'
import { type LoadConfigResult, type RequiredBy } from '@pandacss/types'
import { createFilter } from '@rollup/pluginutils'
import fs from 'node:fs'
import path from 'node:path'
import type { UnpluginFactory } from 'unplugin'
import { createUnplugin } from 'unplugin'
import { type HmrContext } from 'vite'
import { createMacroContext, type MacroContext } from '../plugin/create-context'
import { tranformPanda, type TransformOptions } from '../plugin/transform'

const virtualModuleId = 'virtual:panda.css'
const resolvedVirtualModuleId = '\0' + virtualModuleId

export interface PluginOptions extends Partial<TransformOptions> {
  /** @see https://panda-css.com/docs/references/config#cwd */
  cwd?: string
  /** @see https://panda-css.com/docs/references/cli#--config--c-1 */
  configPath?: string
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
   * @default true
   */
  optimizeCss?: boolean
  /**
   * File path to write the generated CSS
   */
  outfile?: string
}

export const unpluginFactory: UnpluginFactory<PluginOptions | undefined> = (rawOptions) => {
  const options = resolveOptions(rawOptions ?? {})
  const filter = createFilter(options.include, options.exclude)

  let ctx: MacroContext
  let initPromise: Promise<MacroContext> | undefined

  const getCtx = async () => {
    await init()
    if (!ctx) throw new Error('@pandabox/vite context not initialized')
    return ctx as MacroContext
  }

  const init = () => {
    if (initPromise) return initPromise
    // @ts-expect-error
    initPromise = loadConfig({ cwd: options.cwd, file: options.configPath }).then((conf: LoadConfigResult) => {
      ctx = createMacroContext({ root: options.cwd, conf })
    })

    return initPromise
  }

  return {
    name: 'unplugin-panda-macro',
    enforce: 'pre',
    async buildEnd() {
      if (options.outfile) {
        const ctx = await getCtx()
        const filePath = path.resolve(options.cwd, options.outfile)
        console.log('writing to', filePath)
        fs.writeFileSync(filePath, ctx.toCss(options))
      }
    },
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    async load(id) {
      if (id !== resolvedVirtualModuleId) return

      const ctx = await getCtx()
      return ctx.toCss(options)
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

      return tranformPanda(ctx, { code, id, output: options.output, sourceFile, parserResult })
    },
    vite: {
      async handleHotUpdate(hmr: HmrContext) {
        const ctx = await getCtx()
        if (!ctx.files.has(hmr.file)) return

        const mod = hmr.server.moduleGraph.getModuleById(resolvedVirtualModuleId)
        if (mod) {
          hmr.server.moduleGraph.invalidateModule(mod, new Set(), hmr.timestamp, true)
        }
      },
    },
  }
}

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin

const resolveOptions = (options: PluginOptions): RequiredBy<PluginOptions, 'cwd'> => {
  return {
    cwd: options.cwd || process.cwd(),
    configPath: options.configPath,
    include: options.include || [/\.[cm]?[jt]sx?$/],
    exclude: options.exclude || [/node_modules/],
    output: options?.output || 'atomic',
    optimizeCss: options.optimizeCss ?? true,
    keepRecipeClassNames: options.keepRecipeClassNames ?? false,
    outfile: options.outfile,
  }
}

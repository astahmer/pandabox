import { loadConfig } from '@pandacss/config'
import { type LoadConfigResult } from '@pandacss/types'
import { createFilter } from '@rollup/pluginutils'
import type { UnpluginFactory } from 'unplugin'
import { createUnplugin } from 'unplugin'
import { type HmrContext } from 'vite'
import { createMacroContext, type MacroContext } from './plugin/create-context'
import { tranformPanda, type TransformOptions } from './plugin/transform'
import { removeUnusedCssVars, removeUnusedKeyframes } from '@pandabox/postcss-plugins'
import postcss from 'postcss'

const virtualModuleId = 'virtual:panda.css'
const resolvedVirtualModuleId = '\0' + virtualModuleId

export interface PluginOptions extends Partial<TransformOptions> {
  cwd?: string
  configPath?: string
  include?: string | RegExp | (string | RegExp)[]
  exclude?: string | RegExp | (string | RegExp)[]
  optimizeCss?: boolean
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

  const init = async () => {
    if (initPromise) return initPromise
    // @ts-expect-error
    initPromise = loadConfig({ cwd: options.cwd, file: options.configPath }).then(async (conf: LoadConfigResult) => {
      initPromise = createMacroContext({ root: options.cwd, conf })
      ctx = await initPromise
    })

    return initPromise
  }

  return {
    name: 'unplugin-panda-macro',
    enforce: 'pre',
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    async load(id) {
      if (id !== resolvedVirtualModuleId) return

      const { panda, sheet, styles } = await getCtx()
      panda.appendLayerParams(sheet)
      panda.appendCssOfType('tokens', sheet)
      panda.appendCssOfType('global', sheet)

      if (options.output === 'atomic') {
        panda.appendParserCss(sheet)
      } else {
        styles.forEach((serialized) => {
          sheet.layers.utilities.append(serialized)
        })
        // console.log(styles)
      }

      const css = sheet.toCss({ optimize: true })
      if (!options.optimizeCss) return css

      const optimized = postcss([removeUnusedCssVars(panda.config.cssVarRoot), removeUnusedKeyframes]).process(css)
      return optimized.toString()
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

const resolveOptions = (options: PluginOptions) => {
  return {
    cwd: options.cwd || process.cwd(),
    configPath: options.configPath,
    include: options.include || [/\.[cm]?[jt]sx?$/],
    exclude: options.exclude || [/node_modules/],
    output: options?.output || 'atomic',
    optimizeCss: options.optimizeCss ?? true,
  }
}

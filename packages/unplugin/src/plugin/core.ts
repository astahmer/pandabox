import { loadConfig } from '@pandacss/config'
import type { LoadConfigResult, ParserResultBeforeHookArgs, RequiredBy } from '@pandacss/types'
import { createFilter } from '@rollup/pluginutils'
import { type TransformResult, type UnpluginFactory } from 'unplugin'
import type { HmrContext, Plugin } from 'vite'
import fs from 'node:fs/promises'
import { codegen } from '@pandacss/node'

import { createContext, type PandaPluginContext } from '../plugin/create-context'
import { ensureAbsolute } from './ensure-absolute'
import { tranformPanda } from './transform'
import path from 'node:path'

const _fileId = 'panda.css'
const _virtualModuleId = 'virtual:' + _fileId
const ids = {
  virtualModuleId: 'virtual:' + _fileId,
  resolvedVirtualModuleId: '\0' + _virtualModuleId,
}

export interface PandaPluginOptions extends Partial<PandaPluginHooks> {
  /** @see https://panda-css.com/docs/references/config#cwd */
  cwd?: string
  /** @see https://panda-css.com/docs/references/cli#--config--c-1 */
  configPath?: string | undefined
  /**
   * If set, output the generated CSS to the filesystem instead of the virtual module (`virtual:panda.css`).
   * @see https://panda-css.com/docs/references/cli#--outfile
   */
  outfile?: string | undefined
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
  /**
   * Will transform your source code to inline the `css` / `cva` / `${patternFn}` resulting classNames or even simplify `styled` JSX factory to their primitive HTML tags
   */
  optimizeJs?: boolean
}

export interface PandaPluginHooks {
  /**
   * A transform callback similar to the `transform` hook of `vite` that allows you to modify the source code before it's parsed.
   */
  transform: (args: Omit<ParserResultBeforeHookArgs, 'configure'>) => TransformResult | void
}

export const unpluginFactory: UnpluginFactory<PandaPluginOptions | undefined> = (rawOptions) => {
  const options = resolveOptions(rawOptions ?? {})
  const filter = createFilter(options.include, options.exclude)
  let outfile = options.outfile ? ensureAbsolute(options.outfile, options.cwd) : ids.resolvedVirtualModuleId

  let _ctx: PandaPluginContext
  let initPromise: Promise<PandaPluginContext> | undefined

  const getCtx = async () => {
    await init()
    if (!_ctx) throw new Error('@pandabox/unplugin context not initialized')
    return _ctx as PandaPluginContext
  }

  const init = () => {
    if (initPromise) return initPromise

    // console.log('loadConfig', options)
    // @ts-expect-error
    initPromise = loadConfig({ cwd: options.cwd, file: options.configPath }).then((conf: LoadConfigResult) => {
      conf.config.cwd = options.cwd
      _ctx = createContext({ root: options.cwd, conf })
    })

    return initPromise
  }

  return {
    name: 'unplugin-panda',
    enforce: 'pre',
    resolveId(id) {
      if (id === ids.virtualModuleId) {
        return ids.resolvedVirtualModuleId
      }
    },
    async load(id) {
      if (id !== outfile) return

      const ctx = await getCtx()
      const sheet = ctx.panda.createSheet()
      const css = ctx.toCss(sheet, options)

      return css
    },

    transformInclude(id) {
      return filter(id)
    },
    async transform(code, id) {
      const ctx = await getCtx()
      const { panda } = ctx

      let transformResult: TransformResult = { code, map: undefined }

      if (options.transform) {
        const result = options.transform({ filePath: id, content: code }) || code
        if (typeof result === 'string') {
          transformResult.code = result
        } else if (result) {
          transformResult = result
        }
      }

      const sourceFile = panda.project.addSourceFile(id, transformResult.code)
      const parserResult = panda.project.parseSourceFile(id)
      if (!parserResult) return null

      if (!parserResult.isEmpty()) {
        ctx.files.set(id, code)
      }

      if (!options.optimizeJs) {
        return null
      }

      const result = tranformPanda(ctx, {
        code,
        id,
        sourceFile,
        parserResult,
        keepRecipeClassNames: true,
        onlyMacroImports: false,
      })

      return result
    },
    vite: {
      configResolved(config) {
        if (!options.cwd) {
          options.cwd = config.configFile ? path.dirname(config.configFile) : config.root
          outfile = options.outfile ? ensureAbsolute(options.outfile, options.cwd) : ids.resolvedVirtualModuleId
        }

        // console.log('configResolved')
      },
      async configureServer(server) {
        // console.log('configureServer')
        const ctx = await getCtx()

        if (outfile !== ids.resolvedVirtualModuleId) {
          await fs.writeFile(outfile, ctx.toCss(ctx.panda.createSheet(), options))
        }

        // (re) generate the `styled-system` (outdir) on server (re)start
        const { msg } = await codegen(ctx.panda)
        // console.log(options)
        // console.log(ctx.panda.paths.root, ctx.panda.config.cwd)
        // console.log('codegen done', msg)

        const sources = new Set(
          [ctx.panda.conf.path, ...(ctx.panda.conf.dependencies ?? []), ...(ctx.panda.config.dependencies ?? [])].map(
            (f) => ensureAbsolute(f, ctx.root),
          ),
        )
        sources.forEach((file) => server.watcher.add(file))

        server.watcher.on('change', async (file) => {
          const filePath = ensureAbsolute(file, ctx.root)
          if (!sources.has(filePath)) return

          await ctx.reloadContext()

          const timestamp = Date.now()
          const invalidate = (file: string) => {
            const mod = server.moduleGraph.getModuleById(file)
            if (mod) {
              server.moduleGraph.invalidateModule(mod, new Set(), timestamp, true)
            }
          }

          // Invalidate CSS
          invalidate(outfile)
        })
      },
      async handleHotUpdate(hmr: HmrContext) {
        const ctx = await getCtx()
        if (hmr.file === outfile) return
        if (!ctx.files.has(hmr.file)) return

        // Invalidate CSS
        const mod = hmr.server.moduleGraph.getModuleById(outfile)
        if (mod) {
          hmr.server.moduleGraph.invalidateModule(mod, new Set(), hmr.timestamp, true)

          if (outfile !== ids.resolvedVirtualModuleId) {
            await fs.writeFile(outfile, ctx.toCss(ctx.panda.createSheet(), options))
          }
        }
      },
    } as Plugin,
  }
}

const resolveOptions = (options: PandaPluginOptions): RequiredBy<PandaPluginOptions, 'cwd'> => {
  return {
    ...options,
    cwd: options.cwd || '',
    configPath: options.configPath,
    include: options.include || [/\.[cm]?[jt]sx?$/],
    exclude: options.exclude || [/node_modules/, /styled-system/],
    optimizeCss: options.optimizeCss ?? true,
    optimizeJs: options.optimizeJs ?? true,
  }
}

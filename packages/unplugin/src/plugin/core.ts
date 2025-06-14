import { loadConfig } from '@pandacss/config'
import type { LoadConfigResult, ParserResultBeforeHookArgs, RequiredBy } from '@pandacss/types'
import { createFilter } from '@rollup/pluginutils'
import { type TransformResult, type UnpluginFactory } from 'unplugin'
import type { ModuleNode, Plugin, ViteDevServer } from 'vite'
import { writeFile } from 'node:fs/promises'
import { codegen, PandaContext } from '@pandacss/node'

import { createContext, type PandaPluginContext } from '../plugin/create-context'
import { ensureAbsolute } from './ensure-absolute'
import { tranformPanda, type TransformOptions } from './transform'
import path from 'node:path'
import { addCompoundVariantCss, inlineCva } from './cva-fns'
import type { SourceFile } from 'ts-morph'
import type { OutputAsset } from 'rollup'
import { throttle } from 'es-toolkit'
import { existsSync } from 'node:fs'

const createVirtualModuleId = (id: string) => {
  const base = `virtual:panda${id}`
  return {
    id: base,
    resolved: '\0' + base,
  }
}

const ids = {
  css: createVirtualModuleId('.css'),
  inlineCva: createVirtualModuleId('-inline-cva'),
  compoundVariants: createVirtualModuleId('-compound-variants'),
}

const pandaPreamble = '/*! PANDA_CSS */'
const throttleWaitMs = 1000

export interface PandaPluginOptions extends Partial<PandaPluginHooks>, Pick<TransformOptions, 'optimizeJs'> {
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
   * Perform CSS minification
   *
   * @default false
   */
  minifyCss?: boolean

  /**
   * Generate a styled-system folder on server start.
   *
   * @default true
   * @deprecated Use 'codegen' instead
   */
  codeGen?: boolean
  /**
   * Generate a styled-system folder on server start.
   *
   * @default true
   */
  codegen?: boolean
}

interface SourceFileHookArgs {
  sourceFile: SourceFile
  context: PandaContext
}

type MaybePromise<T> = T | Promise<T>
export interface PandaPluginHooks {
  contextCreated: (args: { context: PandaContext }) => MaybePromise<void>
  /**
   * A transform callback similar to the `transform` hook of `vite` that allows you to modify the source code before it's parsed.
   * Called before the source file is parsed by ts-morph and Panda.
   */
  transform: (
    args: Omit<ParserResultBeforeHookArgs, 'configure'> & Pick<SourceFileHookArgs, 'context'>,
  ) => MaybePromise<TransformResult | void>
  /**
   * A callback that allows you to modify or use the ts-morph sourceFile before it's parsed by Panda.
   * Called after ts-morph has parsed the source file, but before it was parsed by Panda.
   */
  onSourceFile: (args: SourceFileHookArgs) => MaybePromise<void>
}

export const unpluginFactory: UnpluginFactory<PandaPluginOptions | undefined> = (rawOptions) => {
  const options = resolveOptions(rawOptions ?? {})
  const filter = createFilter(options.include, options.exclude)
  let outfile = options.outfile ? ensureAbsolute(options.outfile, options.cwd) : ids.css.resolved

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
    initPromise = loadConfig({ cwd: options.cwd, file: options.configPath }).then(async (conf: LoadConfigResult) => {
      conf.config.cwd = options.cwd
      _ctx = createContext({ root: options.cwd, conf, codegen: options.codegen })
      if (options.contextCreated) {
        await options.contextCreated({ context: _ctx.panda })
      }
    })

    return initPromise
  }

  let server: ViteDevServer
  let lastCss: string | undefined
  let updateCssOnTransform = true
  /**
   * Throttle HMR updates to vite server
   */
  const updateCss = async () => {
    // console.log('invalidate', { from: file })
    const ctx = await getCtx()
    const css = await ctx.toCss(ctx.panda.createSheet(), options)
    const isCssUpdated = lastCss !== css
    lastCss = css
    if (!isCssUpdated) return
    if (outfile !== ids.css.resolved) {
      await writeFile(outfile, css)
    } else {
      if (!server) return
      const mod = server.moduleGraph.getModuleById(outfile.replaceAll('\\', '/'))
      if (!mod) return
      await server.reloadModule(mod)
    }
  }
  const requestUpdateCss = throttle(updateCss, throttleWaitMs, { edges: ['leading', 'trailing'] })
  return {
    name: 'unplugin-panda',
    enforce: 'pre',
    resolveId(id) {
      if (id === ids.css.id) {
        return ids.css.resolved
      }

      if (id === ids.inlineCva.id) {
        return ids.inlineCva.resolved
      }

      if (id === ids.compoundVariants.id) {
        return ids.compoundVariants.resolved
      }
    },
    async load(id) {
      if (id === ids.inlineCva.resolved) {
        return `export ${inlineCva.toString()}`
      }

      if (id === ids.compoundVariants.resolved) {
        return `export ${addCompoundVariantCss.toString()}`
      }

      if (id !== outfile) return

      if (!server) return pandaPreamble

      const ctx = await getCtx()
      const sheet = ctx.panda.createSheet()
      const css = await ctx.toCss(sheet, options)
      // console.log('load', { id, outfile, resolved: ids.css.resolved })
      return css
    },

    transformInclude(id) {
      return filter(id)
    },
    async transform(code, id) {
      // console.log('transform', { id })
      const ctx = await getCtx()
      const { panda } = ctx

      let transformResult: TransformResult = { code, map: undefined }

      if (options.transform) {
        const result = (await options.transform({ filePath: id, content: code, context: ctx.panda })) || code
        if (typeof result === 'string') {
          transformResult.code = result
        } else if (result) {
          transformResult = result
        }
      }

      const sourceFile = panda.project.addSourceFile(id, transformResult.code)
      if (options.onSourceFile) {
        await options.onSourceFile({ sourceFile, context: ctx.panda })
      }

      const parserResult = panda.project.parseSourceFile(id)
      if (!parserResult) return null

      if (!parserResult.isEmpty()) {
        ctx.files.set(id, code)
        if (updateCssOnTransform) requestUpdateCss()
      }

      if (!options.optimizeJs) {
        return transformResult.code !== code ? transformResult : null
      }

      // console.log(parserResult.toJSON().css.at(0)?.data)

      const result = tranformPanda(ctx, {
        code: transformResult.code,
        id,
        sourceFile,
        parserResult,
        optimizeJs: options.optimizeJs,
      })

      return result
    },
    vite: {
      name: 'unplugin-panda',
      configResolved(config) {
        if (!options.cwd) {
          options.cwd = config.configFile ? path.dirname(config.configFile) : config.root
          outfile = options.outfile ? ensureAbsolute(options.outfile, options.cwd) : ids.css.resolved
        }
        updateCssOnTransform = config.command !== 'build'
        // console.log('configResolved')
      },
      async configureServer(_server) {
        server = _server

        const ctx = await getCtx()

        // console.log('configureServer', { outfile, resolved: ids.css.resolved })
        if (outfile !== ids.css.resolved) {
          if (!existsSync(outfile)) await writeFile(outfile, '')
          let prevState = updateCssOnTransform
          updateCssOnTransform = false
          try {
            for (const file of ctx.panda.getFiles()) {
              if (path.basename(file) === 'panda.buildinfo.json') {
                ctx.panda.project.parseSourceFile(file)
              } else {
                await server.transformRequest(file)
              }
            }
          } finally {
            updateCssOnTransform = prevState
          }
          await updateCss()
        }

        // (re) generate the `styled-system` (outdir) on server (re)start
        if (options.codegen) {
          const { msg } = await codegen(ctx.panda)
        }
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
      async generateBundle(_, bundles) {
        const cssBundle = Object.values(bundles).find(
          (bundle) =>
            bundle.type === 'asset' &&
            bundle.name?.endsWith('.css') &&
            typeof bundle.source === 'string' &&
            bundle.source.includes(pandaPreamble),
        ) as OutputAsset | undefined
        if (cssBundle) {
          const source = cssBundle.source
          const ctx = await getCtx()
          const sheet = ctx.panda.createSheet()
          const css = await ctx.toCss(sheet, options)
          cssBundle.source = (source as string).replace(pandaPreamble, css)
        }
      },
    } as Plugin,
  }
}

const resolveOptions = (options: PandaPluginOptions): RequiredBy<PandaPluginOptions, 'cwd' | 'codegen'> => {
  let optimizeJs = options.optimizeJs ?? 'auto'
  if (typeof optimizeJs === 'object') {
    optimizeJs = {
      css: optimizeJs.css ?? 'auto',
      cva: optimizeJs.cva ?? 'auto',
      pattern: optimizeJs.cva ?? 'auto',
      recipe: optimizeJs.cva ?? 'auto',
      'jsx-factory': optimizeJs.cva ?? 'auto',
      'jsx-pattern': optimizeJs.cva ?? 'auto',
      ...optimizeJs,
    }
  }

  return {
    ...options,
    cwd: options.cwd || '',
    configPath: options.configPath,
    include: options.include || [/\.[cm]?[jt]sx?$/],
    exclude: options.exclude || [/node_modules/, /styled-system/],
    optimizeCss: options.optimizeCss ?? true,
    minifyCss: options.minifyCss ?? false,
    optimizeJs: options.optimizeJs ?? 'macro',
    codegen: options.codegen ?? options.codeGen ?? true,
  }
}

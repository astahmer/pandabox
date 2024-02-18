import { loadConfig } from '@pandacss/config'
import { type LoadConfigResult, type RequiredBy } from '@pandacss/types'
import { createFilter } from '@rollup/pluginutils'
import type { UnpluginFactory } from 'unplugin'
import { createUnplugin } from 'unplugin'
import { type HmrContext, type ViteDevServer } from 'vite'
import fs from 'node:fs'
import path from 'node:path'

import { createMacroContext, type MacroContext } from '../plugin/create-context'
import { tranformPanda, type TransformOptions } from '../plugin/transform'

const fileId = 'panda.css'
const virtualModuleId = 'virtual:' + fileId
const resolvedVirtualModuleId = '\0' + virtualModuleId
const virtualPath = '/_virtual/' + fileId

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
}

export const unpluginFactory: UnpluginFactory<PluginOptions | undefined> = (rawOptions) => {
  const options = resolveOptions(rawOptions ?? {})
  const filter = createFilter(options.include, options.exclude)

  let _ctx: MacroContext
  let initPromise: Promise<MacroContext> | undefined
  let cssContent: string | undefined
  let isUsingVirtualUrl = false
  let fileWithUrl: string | undefined

  const getCtx = async () => {
    await init()
    if (!_ctx) throw new Error('@pandabox/vite context not initialized')
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

  const mode = process.env.NODE_ENV === 'development' ? 'dev' : 'build'

  return {
    name: 'unplugin-panda-macro',
    enforce: 'pre',
    async resolveId(source) {
      const [id, query] = source.split('?')
      if (id !== virtualModuleId) return null

      if (mode === 'build') {
        // Convert the virtual module ID to a relative file path
        // `import pandaCss from 'virtual:panda.css?url'`
        // -> `import pandaCss from '/path/to/project/panda.css?url'`
        const ctx = await getCtx()
        return { id: ctx.paths.outfile + (query ? `?${query}` : ''), external: false }
      }

      return resolvedVirtualModuleId + (query ? `?${query}` : '')
    },
    async load(source) {
      const [id] = source.split('?')
      if (id !== resolvedVirtualModuleId) return null

      const ctx = await getCtx()
      const css = ctx.toCss(options)
      cssContent = css

      console.log({ source })
      if (source.endsWith('?url')) {
        fileWithUrl = source
        isUsingVirtualUrl = true
        // Convert the virtual module ID to a relative file path, handled by the Vite dev server
        // `import pandaCss from 'virtual:panda.css?url'`
        //  -> pandaCss = `export default '/path/to/project/panda.css'`
        return `export default ${JSON.stringify(virtualPath + '?time=' + Date.now() + '&t=' + Date.now())}`
      }

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

      return tranformPanda(ctx, { code, id, output: options.output, sourceFile, parserResult })
    },
    async buildEnd() {
      if (mode === 'dev') return
      // Generate the CSS content and write it to a file
      // This is done at the end of the build to ensure all files have been processed
      // This is useful when using `import pandaCss from 'virtual:panda.css?url'`

      const ctx = await getCtx()

      // Ensure output directory exists
      if (!fs.existsSync(ctx.paths.outdir)) {
        fs.mkdirSync(ctx.paths.outdir)
      }

      if (!cssContent) {
        const css = ctx.toCss(options)
        cssContent = css
      }

      // Write the CSS content to a file in the output directory
      // This is the file that will be served instead of the virtual module
      fs.writeFileSync(ctx.paths.outfile, cssContent)
    },
    vite: {
      async handleHotUpdate(hmr: HmrContext) {
        const ctx = await getCtx()
        if (!ctx.files.has(hmr.file)) return

        const mod = hmr.server.moduleGraph.getModuleById(resolvedVirtualModuleId)
        if (mod) {
          hmr.server.moduleGraph.invalidateModule(mod, new Set(), hmr.timestamp, true)
        } else if (isUsingVirtualUrl) {
          return hmr.modules
          const timestamp = new Date().getTime()
          hmr.server.ws.send({
            type: 'update',
            updates: [
              {
                type: 'css-update',
                timestamp,
                path: virtualPath,
                acceptedPath: virtualPath,
              },
            ],
          })
          hmr.server.ws.send({
            type: 'update',
            updates: [
              {
                type: 'js-update',
                timestamp,
                path: virtualModuleId,
                acceptedPath: virtualModuleId,
              },
            ],
          })
          hmr.server.ws.send({
            type: 'update',
            updates: [
              {
                type: 'js-update',
                timestamp,
                path: resolvedVirtualModuleId,
                acceptedPath: resolvedVirtualModuleId,
              },
            ],
          })
          hmr.server.ws.send({
            type: 'update',
            updates: [
              {
                type: 'js-update',
                timestamp,
                path: resolvedVirtualModuleId + '?url',
                acceptedPath: resolvedVirtualModuleId + '?url',
              },
            ],
          })
          // return

          // hmr.server.ws.send({
          //   type: 'full-reload',
          //   path: virtualPath,
          // })
          // console.log(hmr.server.moduleGraph.idToModuleMap)
          console.log({
            virtualModuleId,
            resolvedVirtualModuleId,
            virtualPath,
            fileWithUrl,
          })
          if (fileWithUrl) {
            const withUrlMod = hmr.server.moduleGraph.getModuleById(fileWithUrl)
            console.log(1, withUrlMod)
            if (withUrlMod) {
              await hmr.server.reloadModule(withUrlMod)
              // hmr.server.moduleGraph.invalidateModule(withUrlMod, new Set(), hmr.timestamp, true)

              // return [withUrlMod]
              return
            }
          }
          console.log(hmr.server.moduleGraph.getModulesByFile(virtualPath))
          // console.log(hmr.server.moduleGraph.urlToModuleMap)
          // console.log(hmr.server.moduleGraph.safeModulesPath)
          // console.log(hmr.server.moduleGraph.getModuleById('@id/__' + resolvedVirtualModuleId))
          const urlMod = await hmr.server.moduleGraph.getModuleByUrl(resolvedVirtualModuleId + '?url')
          console.log(urlMod?.id)
          if (urlMod) {
            hmr.server.moduleGraph.invalidateModule(urlMod, new Set(), hmr.timestamp, true)
            // const css = ctx.toCss(options)
            // cssContent = css

            return [urlMod, ...urlMod.importedModules, ...urlMod.importers]
          }
          // // const virtualMod = hmr.server.moduleGraph.getModuleById(virtualModuleId)
          // console.log(virtualMod)
          // const urlMod = hmr.server.moduleGraph.getModuleById(virtualPath)
          // hmr.server.moduleGraph.invalidateModule(urlMod, new Set(), hmr.timestamp, true)
        }
      },
      configureServer(server: ViteDevServer) {
        // Use middleware to serve the virtual CSS content when using ?url
        server.middlewares.use(async (req, res, next) => {
          const url = req.url?.split('?')[0]
          if (url === virtualPath) {
            const ctx = await getCtx()
            const css = ctx.toCss(options)
            console.log('from dev server')
            res.setHeader('Content-Type', 'text/css')
            res.setHeader('Cache-Control', 'no-cache')
            res.end(css)
          } else {
            next()
          }
        })
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
  }
}

import { loadConfig } from '@pandacss/config'
import { type LoadConfigResult, type RequiredBy } from '@pandacss/types'
import { createFilter } from '@rollup/pluginutils'
import fs from 'node:fs'
import type { UnpluginFactory } from 'unplugin'
import { type HmrContext } from 'vite'

import { createMacroContext, type MacroContext } from '../plugin/create-context'
import { tranformPanda, type TransformOptions } from '../plugin/transform'

const fileId = 'panda.css'
const _virtualModuleId = 'virtual:' + fileId
const _virtualInternalUrlId = 'virtual:internal:' + fileId
const ids = {
  virtualModuleId: 'virtual:' + fileId,
  resolvedVirtualModuleId: '\0' + _virtualModuleId,
  virtualInternalUrlId: _virtualInternalUrlId,
  resolvedVirtualInternalUrlId: '\0' + _virtualInternalUrlId,
}

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
      const withQuery = query ? `?${query}` : ''

      // This happens when the user imports the virtual entrypoint as url
      // after we already redirected the public entrypoint to the internal virtual module
      // `import pandaCss from 'virtual:panda.css?url'` -> `export default '/virtual:internal:panda.css'`
      // we now must make this url as virtual using the `'\0'` special character
      // so that we can load the content later on
      if (id === '/' + ids.virtualInternalUrlId) {
        return ids.resolvedVirtualInternalUrlId + withQuery
      }

      if (id !== ids.virtualModuleId) return null

      if (mode === 'build') {
        // Convert the virtual module ID to a relative file path
        // `import pandaCss from 'virtual:panda.css?url'`
        // -> `import pandaCss from '/path/to/project/panda.css?url'`
        const ctx = await getCtx()
        return { id: ctx.paths.outfile + withQuery, external: false }
      }

      return ids.resolvedVirtualModuleId + withQuery
    },
    async load(source) {
      const [id] = source.split('?')

      // If the virtual entrypoint is requested as a URL, we need to return the content
      if (ids.resolvedVirtualInternalUrlId === id) {
        console.time('toCss')
        const ctx = await getCtx()
        const css = ctx.toCss(options)
        console.timeEnd('toCss')

        return css
      }

      if (id !== ids.resolvedVirtualModuleId) return null

      const ctx = await getCtx()
      const css = ctx.toCss(options)
      cssContent = css

      if (source.endsWith('?url')) {
        fileWithUrl = source
        // Convert the virtual entrypoint module to another (internal) virtual module
        // `import pandaCss from 'virtual:panda.css?url'`
        //  -> pandaCss = `export default '/path/to/project/panda.css'`
        // for some reason we need to use `new Date` instead of `Date.now()` ?? at least now HMR is fine
        return `export default ${JSON.stringify('/' + ids.virtualInternalUrlId + '?t=' + new Date())}`
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

        const mod = hmr.server.moduleGraph.getModuleById(ids.resolvedVirtualModuleId)
        // importing virtual entrypoint `import 'virtual:panda.css'`
        if (mod) {
          hmr.server.moduleGraph.invalidateModule(mod, new Set(), hmr.timestamp, true)
        } else if (fileWithUrl) {
          // importing virtual entrypoint as url `import pandaCss from 'virtual:panda.css?url'`

          const modUrl = hmr.server.moduleGraph.getModuleById(ids.resolvedVirtualModuleId + '?url')
          console.log({ modUrl })

          if (modUrl) {
            hmr.server.moduleGraph.invalidateModule(modUrl, new Set(), hmr.timestamp, true)
          }
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
  }
}

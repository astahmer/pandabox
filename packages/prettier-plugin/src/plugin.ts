import type { ParserOptions, Plugin } from 'prettier'
import typescriptParser from 'prettier/plugins/typescript'
import { BuilderResolver } from './builder-resolver'
import type { PluginOptions } from './options'
import { PrettyPanda } from './pretty-panda'
import { Builder } from '@pandacss/node'

export { options } from './options'
export type { PluginOptions }

// Programatic usage
const builder = new Builder()
let configPath: string | undefined

// CLI/VSCode usage
const resolver = new BuilderResolver()

export const parsers: Plugin['parsers'] = {
  typescript: {
    ...typescriptParser.parsers.typescript,
    async parse(text, options: ParserOptions & Partial<PluginOptions>) {
      const ast = typescriptParser.parsers.typescript.parse(text, options)
      const filePath = options.filepath

      // Programatic usage
      if (!options.filepath) {
        if (options.pandaConfigPath) {
          configPath = options.pandaConfigPath
        }

        const setupOptions = { configPath: options.pandaConfigPath, cwd: options.pandaCwd }
        const ctx = (await builder.setup(setupOptions)) || builder.context
        if (!ctx) return ast

        // cache the config path
        if (!configPath) configPath = ctx.conf.path

        const pretty = new PrettyPanda(ast, ctx, options as any)
        return pretty.format(text)
      }

      // CLI/VSCode usage
      try {
        const ctx = await resolver.getOrCreate(filePath)
        if (!ctx) return ast
        if (options.pandaOnlyIncluded && !resolver.isIncluded(filePath)) return ast

        const pretty = new PrettyPanda(ast, ctx, options as any)
        return pretty.format(text)
      } catch (err) {
        console.log('prettier-plugin error')
        console.error(err)
        return ast
      }
    },
  },
}

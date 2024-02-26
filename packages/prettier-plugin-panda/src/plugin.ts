import { Builder } from '@pandacss/node'
import type { ParserOptions, Plugin } from 'prettier'
import typescriptParser from 'prettier/plugins/typescript'
import type { PluginOptions } from './options'
import { PrettyPanda } from './pretty-panda'

export { defaultOptions, options } from './options'
export type { PluginOptions }

const builder = new Builder()
let configPath: string | undefined

export const parsers: Plugin['parsers'] = {
  typescript: {
    ...typescriptParser.parsers.typescript,
    async parse(text, options: ParserOptions & Partial<PluginOptions>) {
      const ast = typescriptParser.parsers.typescript.parse(text, options)

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
    },
  },
}

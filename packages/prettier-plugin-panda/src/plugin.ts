import type { ParserOptions, Plugin } from 'prettier'
import typescriptParser from 'prettier/plugins/typescript'
import { BuilderResolver } from './builder-resolver'
import type { PluginOptions } from './options'
import { PrettyPanda } from './pretty-panda'

export { options } from './options'
export type { PluginOptions }

const resolver = new BuilderResolver()

export const parsers: Plugin['parsers'] = {
  typescript: {
    ...typescriptParser.parsers.typescript,
    async parse(text, options: ParserOptions & Partial<PluginOptions>) {
      const ast = typescriptParser.parsers.typescript.parse(text, options)
      const filePath = options.filepath

      try {
        const ctx = await resolver.getOrCreate(filePath)
        if (!ctx) return ast
        if (options.pandaOnlyIncluded && !resolver.isIncluded(filePath)) return ast

        const pretty = new PrettyPanda(ast, ctx, options as any)
        return pretty.format(text)
      } catch {
        return ast
      }
    },
  },
}

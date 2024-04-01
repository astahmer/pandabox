// https://github.com/chakra-ui/panda/blob/0bf09f214ec25ff3ea74b8e432bd10c7c9453805/packages/parser/src/get-import-declarations.ts
import { resolveTsPathPattern } from '@pandacss/config/ts-path'
import type { ImportResult, ParserOptions } from '@pandacss/core'
import type { SourceFile } from 'ts-morph'
import { getModuleSpecifierValue } from './get-module-specifier-value'
import { getMacroAttribute } from './has-macro-attribute'

export function getImportDeclarations(context: ParserOptions, sourceFile: SourceFile, onlyMacroImports = false) {
  const { imports, tsOptions } = context

  const importDeclarations: ImportResultWithAttribute[] = []

  sourceFile.getImportDeclarations().forEach((node) => {
    const mod = getModuleSpecifierValue(node)
    if (!mod) return

    // Keep track of the presence of `with { type: "xxx" }`
    const withAttr = getMacroAttribute(node) as ImportResultWithAttribute['withAttr']

    // import { flex, stack } from "styled-system/patterns"
    node.getNamedImports().forEach((specifier) => {
      const name = specifier.getNameNode().getText()
      const alias = specifier.getAliasNode()?.getText() || name

      const result: ImportResultWithAttribute = { name, alias, mod, kind: 'named', withAttr }

      const found = imports.match(result, (mod) => {
        if (!tsOptions?.pathMappings) return
        return resolveTsPathPattern(tsOptions.pathMappings, mod)
      })

      if (!found) return

      importDeclarations.push(result)
    })

    // import * as p from "styled-system/patterns
    const namespace = node.getNamespaceImport()
    if (namespace) {
      const name = namespace.getText()
      const result: ImportResultWithAttribute = { name, alias: name, mod, kind: 'namespace', withAttr }

      const found = imports.match(result, (mod) => {
        if (!tsOptions?.pathMappings) return
        return resolveTsPathPattern(tsOptions.pathMappings, mod)
      })

      if (!found) return

      importDeclarations.push(result)
    }
  })

  return importDeclarations
}

export interface ImportResultWithAttribute extends ImportResult {
  withAttr: 'macro' | 'runtime' | null
}

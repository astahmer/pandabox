import { box, extractCallExpressionArguments, unbox } from '@pandacss/extractor'
import { type ParserResultInterface, type RecipeConfig, type ResultItem, type SystemStyleObject } from '@pandacss/types'
import MagicString from 'magic-string'
import { CallExpression, Identifier, Node, SourceFile } from 'ts-morph'

import type { PandaPluginContext } from './create-context'
import { createCva, transformCva } from './create-cva'
import { getVariableName } from './get-cva-var-name'
import { getImportDeclarations, type ImportResultWithAttribute } from './get-import-declarations'
import { combineResult } from './unbox-combine-result'

export type OptimizeJsType = 'auto' | 'macro'

type Pretty<T> = { [K in keyof T]: T[K] } & {}
type ResultType = NonNullable<ResultItem['type']>
type OptimizeJsMap = Pretty<Partial<Record<Exclude<ResultType, 'sva' | 'jsx' | 'jsx-recipe'>, OptimizeJsType>>>

export type OptimizeJsOption = OptimizeJsType | OptimizeJsMap

export interface TransformOptions {
  /**
   * Will transform your source code to inline the `css` / `cva` / `${patternFn}` resulting classNames or even simplify `styled` JSX factory to their primitive HTML tags
   *
   * If set to "macro" -> will only transform imports marked as `with { type: "macro" }`
   * @example
   * ```ts
   * import { css } from '../styled-system/css' with { type: "macro" }
   *
   * const className = css({ display: "flex", flexDirection: "column", color: "red.300" })
   * // -> `const className = 'd_flex flex_column text_red.300'`
   * ```
   */
  optimizeJs?: OptimizeJsOption
}

export interface TransformArgs extends TransformOptions {
  code: string
  id: string
  sourceFile: SourceFile
  parserResult: ParserResultInterface | undefined
}

export const tranformPanda = (ctx: PandaPluginContext, options: TransformArgs) => {
  const { code, optimizeJs, sourceFile, parserResult } = options
  if (!parserResult) return null

  const { panda, css, mergeCss } = ctx
  const factoryName = panda.jsx.factoryName || 'styled'

  const s = new MagicString(code)

  const onlyMacroImports = optimizeJs === 'macro'
  const importDeclarations = getImportDeclarations(panda.parserOptions, sourceFile, onlyMacroImports)
  const file = panda.imports.file(importDeclarations)

  const jsxPatternKeys = panda.patterns.details.map((d) => d.jsxName)
  const isJsxPatternImported = file['createMatch'](file['importMap'].jsx, jsxPatternKeys) as (id: string) => boolean

  const cvaNames = collectCvaNames(parserResult)
  const cvaUsages = extractCvaUsages(sourceFile, cvaNames)
  const cvaConfigs = new Map<string, CvaConfig>()
  let needInlineCvaImport = false
  let needCompoundVariantsImport = false

  parserResult.all.forEach((result) => {
    const fnName = result.name
    if (!fnName) return

    if (!result.box) return
    if (result.type === 'jsx' || result.type === 'jsx-recipe') return

    const node = result.box.getNode()

    let shouldOnlyTransformMacroImport = onlyMacroImports
    // Early return if we only want to transform macro imports
    // for the current result type
    if (
      result.type &&
      !shouldOnlyTransformMacroImport &&
      typeof optimizeJs === 'object' &&
      result.type !== 'sva' &&
      optimizeJs[result.type] === 'macro'
    ) {
      shouldOnlyTransformMacroImport = true
    }

    const importedIdentifier = getImportedIdentifier(node)
    if (!importedIdentifier) return

    const importedName = fnName.split('.')[0]

    // Early return if we only want to transform macro imports and the current result is not coming from one
    // or if the import is marked as `with { type: "runtime" }`
    const importDecl = importDeclarations.find(
      (imp) => imp.name === importedName && imp.alias === importedIdentifier,
    ) as ImportResultWithAttribute

    if (
      !importDecl ||
      importDecl.withAttr === 'runtime' ||
      (shouldOnlyTransformMacroImport && importDecl.withAttr !== 'macro')
    ) {
      return
    }

    if (result.type?.includes('jsx')) {
      const isJsx = Node.isJsxOpeningElement(node) || Node.isJsxSelfClosingElement(node)
      if (!isJsx) return

      const tagName = node.getTagNameNode().getText()

      const isJsxPattern = panda.patterns.details.find((node) => node.jsxName === tagName)
      if (isJsxPattern && !isJsxPatternImported(tagName)) return

      const isPandaComponent = file.isPandaComponent(tagName)
      if (!isPandaComponent) return

      // we don't care about `xxx.div` but we do care about `styled.div`
      if (result.type === 'jsx-factory' && !tagName.includes(factoryName + '.')) {
        return
      }

      const styleProps = new Set(result.data.flatMap((data) => Object.keys(data)))
      const styleObjects =
        result.type === 'jsx-pattern'
          ? result.data.map((data) => panda.patterns.transform(panda.patterns.find(fnName!), data))
          : result.data

      const merged = mergeCss(...styleObjects)
      const className = css(merged)

      // Filter out every style props already extracted
      // `<Box color="red" onClick={() => "hello"} />` -> `color` will be filtered out
      const otherProps = node.getAttributes().filter((n) => {
        if (Node.isJsxAttribute(n)) {
          return !styleProps.has(n.getNameNode().getText())
        }

        return true
      })

      let tag
      // `styled.div` -> [`styled`, `div`]
      if (tagName.includes('.')) {
        ;[, tag] = tagName.split('.')
      } else if (result.type === 'jsx-pattern') {
        const patternName = panda.patterns.find(fnName!)
        const patternConfig = panda.patterns.getConfig(patternName)

        tag = patternConfig.jsxElement ?? 'div'
      }

      s.update(
        node.getStart(),
        node.getEnd(),
        `<${tag} className="${className}" ${otherProps.map((n) => n.getText()).join(' ')}${Node.isJsxSelfClosingElement(node) ? '/' : ''}>`,
      )

      if (Node.isJsxOpeningElement(node)) {
        const parent = node.getParent()

        if (Node.isJsxElement(parent)) {
          const closing = parent.getClosingElement()
          if (closing) {
            s.update(closing.getStart(), closing.getEnd(), `</${tag}>`)
          }
        }
      }

      return
    }

    if (!Node.isCallExpression(node) || !fnName) return

    const identifier = node.getExpression().getText()
    const isRaw = identifier.includes('.raw')

    // Remove the function call: `css.raw({ })` -> `({ })`
    if (isRaw) {
      const rawIndex = identifier.indexOf('.raw')
      const obj = s.slice(node.getStart() + rawIndex + 4, node.getEnd())
      s.update(node.getStart(), node.getEnd(), obj)
      return
    }

    if (result.type === 'cva') {
      result.data.forEach((recipe: Pick<RecipeConfig, 'base' | 'variants' | 'compoundVariants'>) => {
        const varName = getVariableName(node)
        if (!varName) return

        const resolve = createCva(recipe, mergeCss)
        cvaConfigs.set(varName, { config: recipe, resolve })

        // Replace cva declarations with an optimized function, in case it's exported and used elsewhere
        // `const xxx = cva({ ... })` -> `const xxx = () => ""`
        s.update(node.getStart(), node.getEnd(), transformCva(varName, recipe, css))

        needInlineCvaImport = true

        if (recipe.compoundVariants?.length) {
          needCompoundVariantsImport = true
        }
      })

      // Replace cva usages with the result of the function call
      cvaUsages.forEach((data, key) => {
        const { variants } = data
        const cva = cvaConfigs.get(key)
        if (!cva) return

        const computed = cva.resolve(variants)
        const className = css(computed)

        // `className={recipe({ size: "sm" })}` => `className="fs_12px"`
        s.update(data.node.getStart() - 1, data.node.getEnd() + 1, `"${className}"`)
      })

      return
    }

    const classList = new Set<string>()
    const styleObjects = new Set<SystemStyleObject>()

    const processAtomic = (data: SystemStyleObject) => {
      styleObjects.add(data)
    }

    // Collect all extracted styles object/class names
    if (result.type === 'css') {
      result.data.forEach((d) => processAtomic(d))
    } else if (result.type === 'pattern') {
      result.data.forEach((data) => {
        const styleProps = panda.patterns.transform(fnName, data)
        processAtomic(styleProps)
      })
    } else if (result.type === 'recipe') {
      const config = panda.recipes.getConfig(fnName)
      if (!config) return

      const transform = panda.recipes.getTransform(fnName, panda.recipes.isSlotRecipe(fnName))

      // Add the `recipe` className to the classList (needed for the `base` styles)
      const base = transform('__ignore__', '__ignore__')
      classList.add(base.className)
      config.base && processAtomic(config.base)

      // Add each `recipe.variants` resulting className to the classList
      result.data.forEach((variants) => {
        const computedVariants = Object.assign({}, config.defaultVariants, variants)

        Object.entries(computedVariants).forEach(([key, value]) => {
          const transformed = transform(key, value)
          classList.add(transformed.className)

          const variantStyles = config.variants?.[key]?.[value]
          variantStyles && processAtomic(variantStyles)
        })
      })

      config.compoundVariants?.forEach((compoundVariant) => {
        if (!compoundVariant) return
        processAtomic(compoundVariant.css)
      })
    }

    const merged = mergeCss(...Array.from(styleObjects))
    const className = result.type === 'recipe' ? Array.from(classList).join(' ') : css(merged)
    s.update(node.getStart(), node.getEnd(), `"${className}"`)
  })

  if (needCompoundVariantsImport) {
    s.prepend(`import { addCompoundVariantCss } from 'virtual:panda-compound-variants';\n`)
  }

  if (needInlineCvaImport) {
    s.prepend(`import { inlineCva } from 'virtual:panda-inline-cva';\n`)
  }

  return {
    code: s.toString(),
    map: s.generateMap({ hires: true }),
  }
}

interface CvaConfig {
  config: Pick<RecipeConfig, 'base' | 'variants' | 'compoundVariants'>
  resolve: ReturnType<typeof createCva>
}

/**
 * Collect all cva names
 * `const xxx = cva({ ... })` -> add `xxx` to the set
 */
const collectCvaNames = (parserResult: ParserResultInterface) => {
  const cvaNames = new Set<string>()
  parserResult.cva.forEach((cva) => {
    const node = cva.box?.getNode()
    if (!node) return

    const varName = getVariableName(node)
    if (!varName) return

    return cvaNames.add(varName)
  })

  return cvaNames
}

/**
 * Extract all cva usages
 * `const xxx = cva({ base: { ... }, variants: { ... }, defaultVariants: { ... } })`
 * -> extract `base` / `variants` / `defaultVariants`
 */
const extractCvaUsages = (sourceFile: SourceFile, cvaNames: Set<string>) => {
  const cvaUsages = new Map<
    string,
    {
      variants: Record<string, string>
      node: CallExpression
    }
  >()

  sourceFile.forEachDescendant((node) => {
    if (!Node.isIdentifier(node)) return

    const fnName = node.getText()
    if (!cvaNames.has(fnName)) return

    const parent = node.getParent()
    if (!Node.isCallExpression(parent)) return

    const array = extractCallExpressionArguments(parent, { flags: { skipTraverseFiles: true } })
    array.value.forEach((arg) => {
      if (box.isMap(arg)) {
        const unboxed = combineResult(unbox(arg))
        unboxed.forEach((variants) => {
          cvaUsages.set(fnName, { variants, node: parent })
        })
      }
    })
  })

  return cvaUsages
}

const getImportedIdentifier = (node: Node) => {
  if (Node.isJsxOpeningElement(node) || Node.isJsxSelfClosingElement(node)) {
    const tagName = node.getTagNameNode()
    if (Node.isIdentifier(tagName)) {
      return tagName.getText()
    }

    if (Node.isPropertyAccessExpression(tagName)) {
      return tagName.getExpression().getText().split('.')[0]
    }
  }

  if (Node.isCallExpression(node)) {
    const expr = node.getExpression()
    return expr.getText().split('.')[0]
  }
}

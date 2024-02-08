import { stringify } from '@pandacss/core'
import { box, extractCallExpressionArguments, unbox } from '@pandacss/extractor'
import { toHash } from '@pandacss/shared'
import { SystemStyleObject, type RecipeConfig, ParserResultInterface } from '@pandacss/types'
import MagicString from 'magic-string'
import { CallExpression, Node, SourceFile } from 'ts-morph'
import { PluginOption, ViteDevServer } from 'vite'

import { MacroContext, createMacroContext } from './create-context'
import { createCva } from './create-cva'
import { getVariableName } from './get-cva-var-name'
import { combineResult } from './unbox-combine-result'

interface TransformOptions {
  code: string
  id: string
  //
  output: 'atomic' | 'grouped'
  //
  sourceFile: SourceFile
  parserResult: ParserResultInterface | undefined
}

export const tranformPanda = (ctx: MacroContext, options: TransformOptions) => {
  const { code, id, output = 'atomic', sourceFile, parserResult } = options
  if (!parserResult) return null

  const { panda, css, mergeCss, sheet, styles } = ctx

  const s = new MagicString(code)

  const cvaNames = new Set<string>()
  // TODO keep a map of node+variants, replace usage, don't care about the config (remove it I guess)
  //   maybe make it return `() => "xxx"` so that it can't throw at runtime if exported and used elsewhere ?
  //   or just find every usage in every file and replace it with the result of the function call
  const cvaUsages = new Map<
    string,
    {
      variants: Record<string, string>
      node: CallExpression
    }
  >()
  const cvaMap = new Map<
    string,
    {
      config: Pick<RecipeConfig, 'base' | 'variants' | 'compoundVariants'>
      resolve: ReturnType<typeof createCva>
    }
  >()

  // Collect all cva names
  // `const xxx = cva({ ... })` -> add `xxx` to the set
  parserResult.cva.forEach((cva) => {
    const node = cva.box?.getNode()
    if (!node) return

    const varName = getVariableName(node)
    if (!varName) return

    return cvaNames.add(varName)
  })

  // Extract all cva usages
  // `const xxx = cva({ base: { ... }, variants: { ... }, defaultVariants: { ... } })`
  //  -> extract `base` / `variants` / `defaultVariants`
  if (cvaNames.size) {
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
  }

  parserResult.all.forEach((result) => {
    if (!result.box) return
    if (result.type?.includes('jsx')) return

    const node = result.box.getNode()
    const fnName = result.name
    if (!Node.isCallExpression(node) || !fnName) return

    const identifier = node.getExpression().getText()
    const isRaw = identifier.includes('.raw')
    console.log('fnName', { isRaw, fnName, node: node.getText() })

    // Remove the function call: `css.raw({ })` -> `({ })`
    if (isRaw) {
      const rawIndex = identifier.indexOf('.raw')
      const obj = s.slice(node.getStart() + rawIndex + 4, node.getEnd())
      s.update(node.getStart(), node.getEnd(), obj)
      return
    }

    const classList = new Set<string>()
    const styleObjects = new Set<SystemStyleObject>()

    const processAtomic = (data: SystemStyleObject) => {
      styleObjects.add(data)
    }

    // Collect all extracted styles object/class names
    // @ts-expect-error typing issue in panda parser
    if (result.type === 'css') {
      result.data.forEach((d) => processAtomic(d))
    } else if (result.type === 'pattern') {
      result.data.forEach((data) => {
        const styleProps = panda.patterns.transform(fnName, data)
        processAtomic(styleProps)
      })
    } else if (result.type === 'cva') {
      result.data.forEach((recipe: Pick<RecipeConfig, 'base' | 'variants' | 'compoundVariants'>) => {
        const varName = getVariableName(node)
        if (!varName) return

        cvaMap.set(varName, {
          config: recipe,
          resolve: createCva(recipe, mergeCss),
        })

        // Replace cva declarations with a dummy function, in case it's exported and used elsewhere
        // `const xxx = cva({ ... })` -> `const xxx = () => ""`
        s.update(node.getStart(), node.getEnd(), '() => ""')
      })
    } else if (result.type === 'recipe') {
      const config = panda.recipes.getConfig(fnName)
      if (!config) return

      const transform = panda.recipes.getTransform(fnName, panda.recipes.isSlotRecipe(fnName))
      // Add the `recipe` className to the classList (needed for the `base` styles)
      classList.add(transform('__ignore__', '__ignore__').className)

      // Add each `recipe.variants` resulting className to the classList
      result.data.forEach((variants) => {
        const computedVariants = Object.assign({}, config.defaultVariants, variants)

        Object.entries(computedVariants).forEach(([key, value]) => {
          const transformed = transform(key, value)
          classList.add(transformed.className)
        })
      })

      config.compoundVariants?.forEach((compoundVariant) => {
        if (!compoundVariant) return
        processAtomic(compoundVariant.css)
      })
    }

    // Replace cva usages with the result of the function call
    cvaUsages.forEach((data, key) => {
      const { variants } = data
      const cva = cvaMap.get(key)
      if (!cva) return

      const computed = cva.resolve(variants)

      let className = ''
      if (output === 'atomic') {
        className = css(computed)
      } else {
        className = toHash(css(computed))
        const resolved = sheet.serialize({ ['.' + className]: computed })
        styles.set(className, stringify(resolved))
      }

      // `className={recipe({ size: "sm" })}` => `className="fs_12px"`
      s.update(data.node.getStart() - 1, data.node.getEnd() + 1, `"${className}"`)
      ctx.files.add(id)
    })

    // If the result is a `cva` declaration, we don't need to do anything else
    if (result.type === 'cva') {
      return
    }

    const merged = mergeCss(...Array.from(styleObjects))
    const getClassName = () => {
      // Inline the usual recipe classNames (base+variants)
      if (result.type === 'recipe') {
        return Array.from(classList).join(' ')
      }

      // Inline the atomic styles
      if (output === 'atomic') {
        return css(merged)
      }

      // Hash atomic styles and inline the resulting className
      const className = toHash(css(merged))
      const resolved = sheet.serialize({ ['.' + className]: merged })

      styles.set(className, stringify(resolved))
      return className
    }

    const className = getClassName()
    s.update(node.getStart(), node.getEnd(), `"${className}"`)

    ctx.files.add(id)
  })

  return {
    code: s.toString(),
    map: s.generateMap({ hires: true }),
  }
}

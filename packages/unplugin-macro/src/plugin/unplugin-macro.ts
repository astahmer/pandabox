import { stringify } from '@pandacss/core'
import { box, extractCallExpressionArguments, unbox } from '@pandacss/extractor'
import { toHash } from '@pandacss/shared'
import { SystemStyleObject, type RecipeConfig } from '@pandacss/types'
import MagicString from 'magic-string'
import { CallExpression, Node } from 'ts-morph'
import { PluginOption, ViteDevServer } from 'vite'

import { MacroContext, createMacroContext } from './create-context'
import { createCva } from './create-cva'
import { getVariableName } from './get-cva-var-name'
import { removeUnusedCssVars } from './remove-unused-css-vars'
import { removeUnusedKeyframes } from './remove-unused-keyframes'

const virtualModuleId = 'virtual:panda.css'
const resolvedVirtualModuleId = '\0' + virtualModuleId

interface PandaViteOptions {
  output: 'atomic' | 'grouped'
}

const createPandaVite = (options: PandaViteOptions): PluginOption => {
  const output = options.output

  let ctx: MacroContext
  let server: ViteDevServer

  const getCtx = () => {
    if (!ctx) throw new Error('@pandabox/vite context not initialized')
    return ctx as MacroContext
  }

  return {
    name: 'panda',
    enforce: 'pre',
    async configResolved(resolvedConfig) {
      ctx = await createMacroContext({ root: resolvedConfig, conf: {} })
    },
    configureServer(_server) {
      server = _server
    },
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    load(id) {
      if (id !== resolvedVirtualModuleId) return

      const { panda, sheet, styles } = getCtx()
      panda.appendLayerParams(sheet)
      panda.appendCssOfType('tokens', sheet)
      panda.appendCssOfType('global', sheet)

      if (output === 'atomic') {
        panda.appendParserCss(sheet)
      } else {
        styles.forEach((serialized) => {
          sheet.layers.utilities.append(serialized)
        })
        // console.log(styles)
      }

      const css = sheet.toCss({ optimize: true })
      const optimized = removeUnusedCssVars(removeUnusedKeyframes(css))
      return optimized
    },
    handleHotUpdate(hmr) {
      const ctx = getCtx()
      if (!ctx.files.has(hmr.file)) return

      //   https://bjornlu.com/blog/hot-module-replacement-is-easy
      const module = server.moduleGraph.getModuleById(resolvedVirtualModuleId)
      if (module) {
        server.moduleGraph.invalidateModule(module)

        // Vite uses this timestamp to add `?t=` query string automatically for HMR.
        module.lastHMRTimestamp = module.lastInvalidationTimestamp || Date.now()
      }
    },
    transform(code, id) {
      if (id === resolvedVirtualModuleId) {
        return code
      }

      const ctx = getCtx()
      const { isIncluded, panda, css, mergeCss, sheet, styles } = ctx
      if (!isIncluded(id)) return null

      const sourceFile = panda.project.addSourceFile(id, code)
      const parserResult = panda.project.parseSourceFile(id)
      if (!parserResult) return null

      // return
      const s = new MagicString(code)

      const cvaNames = new Set<string>()
      // TODO keep a map of node+variants, replace usage, don't care about the config (remove it I guess)
      const cvaUsages = new Map<
        string,
        {
          variants: Record<string, string>
          node: CallExpression
        }
      >()
      // const cvaConfig = new Map<string, Pick<RecipeConfig, 'base' | 'variants' | 'compoundVariants'>>()
      const cvaMap = new Map<
        string,
        {
          config: Pick<RecipeConfig, 'base' | 'variants' | 'compoundVariants'>
          resolve: ReturnType<typeof createCva>
        }
      >()

      parserResult.cva.forEach((cva) => {
        const node = cva.box.getNode()
        if (!node) return

        const varName = getVariableName(node)
        return cvaNames.add(varName)
      })
      console.log({ cvaNames })

      if (cvaNames.size) {
        sourceFile.forEachDescendant((node) => {
          if (!Node.isIdentifier(node)) return

          const fnName = node.getText()
          if (!cvaNames.has(fnName)) return

          const parent = node.getParent()
          if (!Node.isCallExpression(parent)) return

          console.log(parent.getText())
          const array = extractCallExpressionArguments(parent, { flags: { skipTraverseFiles: true } })
          array.value.forEach((b) => {
            // const bNode = b.getNode()
            if (box.isMap(b)) {
              const unboxed = combineResult(unbox(b))
              unboxed.forEach((u) => {
                cvaUsages.set(fnName, { variants: u, node: parent })
                // s.update(bNode.getStart() - 1, bNode.getEnd() + 1, '')
              })
            }
          })
        })
      }

      console.log({ cvaUsages })

      parserResult.all.forEach((result) => {
        if (!result.box) return
        if (result.type?.includes('jsx')) return
        // if (result.type === 'cva') return

        console.log({ type: result.type, name: result.name })

        const node = result.box.getNode()
        // console.log(node.getKindName(), node.getText())
        // console.log(result.box.type, result.box.getRange(), result.box.value)
        if (!node) return

        const classList = new Set<string>()
        const styleObjects = new Set<SystemStyleObject>()
        const fnName = result.name

        const processAtomic = (data: SystemStyleObject) => {
          styleObjects.add(data)
        }

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

            // cvaConfig.set(varName, recipe)
            cvaMap.set(varName, {
              config: recipe,
              resolve: createCva(recipe, mergeCss),
            })

            // `const xxx = cva({ ... })` -> `const xxx = ""`
            s.update(node.getStart(), node.getEnd(), '""')
            console.log({ varName, recipe })
          })
        } else if (result.type === 'recipe') {
          const config = panda.recipes.getConfig(fnName)
          if (!config) return

          // process base styles
          // processAtomic(config.base)

          const transform = panda.recipes.getTransform(fnName, panda.recipes.isSlotRecipe(fnName))
          classList.add(transform('__ignore__', '__ignore__').className)

          result.data.forEach((variants) => {
            const computedVariants = Object.assign({}, config.defaultVariants, variants)
            Object.entries(computedVariants).forEach(([key, value]) => {
              // console.log({ fnName, key, value })
              const transformed = transform(key, value)

              classList.add(transformed.className)
              // processAtomic(transformed.styles)
            })
          })

          config.compoundVariants?.forEach((compoundVariant) => {
            if (!compoundVariant) return
            processAtomic(compoundVariant.css)
          })
        }

        console.log(cvaUsages.size)
        cvaUsages.forEach((data, key) => {
          // const config = cvaConfig.get(key)
          // if (!config) return

          const { variants } = data
          // console.log({ key, data })
          const cva = cvaMap.get(key)
          if (!cva) return

          const computed = cva.resolve(variants)
          // styleObjects.add(computed)

          // `className={recipe({ size: "sm" })}` => `className="fs_12px"`
          s.update(data.node.getStart() - 1, data.node.getEnd() + 1, `"${css(computed)}"`)

          console.log({ key, variants, computed, node: data.node.getText(), kind: data.node.getKindName() })
        })

        if (result.type === 'cva') {
          return
        }

        // console.log(result.data, result.box.getNode().getText())
        // if (result.type == 'css' || result.type === ) return
        if (result.type === 'recipe') {
          // console.log(result, { classList })
          // return
        }

        if (result.type === 'pattern') {
          // console.log(result, { classList })
          // return
        }

        const merged = mergeCss(...Array.from(styleObjects))
        const getClassName = () => {
          if (result.type === 'recipe') {
            return Array.from(classList).join(' ')
          }

          if (output === 'atomic') {
            return css(merged)
          }

          const className = toHash(css(merged))

          const resolved = sheet.serialize({ ['.' + className]: merged })
          styles.set(className, stringify(resolved))
        }

        // console.log(result.type, { classList, merged })
        const className = getClassName()
        s.update(node.getStart(), node.getEnd(), `"${className}"`)

        ctx.files.add(id)
      })

      return {
        code: s.toString(),
        map: s.generateMap({ hires: true }),
      }
    },
  }
}

export default createPandaVite

import type { PandaContext } from '@pandacss/node'
import { TSESTree } from '@typescript-eslint/types'
import { simpleTraverse } from '@typescript-eslint/typescript-estree'
import type { ParserOptions } from 'prettier'
import { getPropPriority, groupPriorities, type PriorityGroup, type PriorityGroupName } from './get-priority-index'
import type { PluginOptions } from './options'
import { compareAtRuleOrMixed, type ImportResult } from '@pandacss/core'
import { utilitiesGroups } from '@pandacss/preset-base'
import { defaultPriorityGroups } from './default-priority-groups'
import type { UtilityConfig } from '@pandacss/types'
import { resolveTsPathPattern } from '@pandacss/config/ts-path'

const NodeType = TSESTree.AST_NODE_TYPES

export class PrettyPanda {
  priorityGroups: PriorityGroup[] = []
  options: PluginOptions

  constructor(
    public ast: TSESTree.Program,
    public context: PandaContext,
    public prettierOptions?: ParserOptions & Partial<PluginOptions>,
  ) {
    this.priorityGroups = this.generatePriorityGroups(context)
    this.options = {
      firstProps: prettierOptions?.firstProps ?? [],
      lastProps: prettierOptions?.lastProps ?? [],
      isCompPropsBeforeStyleProps: true, // options?.displayCompPropsBeforeStyleProps ? ~ : defaultIsCompPropsBeforeStyleProps
      componentSpecificProps: undefined, // not supported yet
    }
  }

  getDefaultPriorityGroups = () => {
    const base = structuredClone(defaultPriorityGroups) as typeof defaultPriorityGroups

    const props = new Set()
    Object.entries(base).forEach(([_key, list]) => {
      list.forEach((item) => props.add(item))
    })

    const add = (inList: string[], config: UtilityConfig, filter?: (key: string) => boolean) => {
      const _keys = Object.keys(config)
      const keys = filter ? _keys.filter(filter) : _keys
      keys.forEach((key) => {
        if (props.has(key)) return
        inList.push(key)
        props.add(key)
      })
    }

    add(base.Margin, utilitiesGroups.spacing, (key) => key.startsWith('margin'))
    add(base.Padding, utilitiesGroups.spacing, (key) => key.startsWith('padding'))
    add(base.Background, utilitiesGroups.background)
    add(base.Border, utilitiesGroups.border, (key) => !key.includes('Radius'))
    add(base['Border Radius'], utilitiesGroups.border, (key) => key.includes('Radius'))
    add(base['Other Style Props'], utilitiesGroups.container)
    add(base.Layout, utilitiesGroups.display)
    add(base['Other Style Props'], utilitiesGroups.divide)
    add(base.Effects, utilitiesGroups.effects)
    add(base['Other Style Props'], utilitiesGroups.helpers)
    add(base['Other Style Props'], utilitiesGroups.interactivity)
    add(base.Position, utilitiesGroups.layout, (key) => key.includes('inset'))
    add(base.Layout, utilitiesGroups.layout)
    add(base['Other Style Props'], utilitiesGroups.list)
    add(base['Other Style Props'], utilitiesGroups.list)
    add(base.Border, utilitiesGroups.outline)
    add(base.Effects, utilitiesGroups.polyfill)
    add(base.Width, utilitiesGroups.sizing, (key) => key.includes('Width') || key.includes('Inline'))
    add(base.Height, utilitiesGroups.sizing, (key) => key.includes('Height') || key.includes('Block'))
    add(base.Effects, utilitiesGroups.svg)
    add(base.Effects, utilitiesGroups.tables)
    add(base.Effects, utilitiesGroups.transforms)
    add(base.Effects, utilitiesGroups.transitions)
    add(base.Typography, utilitiesGroups.typography)

    return base
  }

  generatePriorityGroups = (context: PandaContext) => {
    const base = this.getDefaultPriorityGroups()
    const priorityGroups = [] as PriorityGroup[]

    Object.entries(base).forEach(([_name, keys]) => {
      const name = _name as PriorityGroupName
      const priorityGroup: PriorityGroup = { name, keys, priority: groupPriorities[name] }
      priorityGroups.push(priorityGroup)
    })

    const shorthandsMap = context.utility.getPropShorthandsMap()

    // Prepend shorthands right before their longhand
    priorityGroups.forEach((group) => {
      const keys = [] as string[]
      group.keys.forEach((key) => {
        const shorthands = shorthandsMap.get(key)

        if (shorthands?.length) {
          keys.push(...shorthands)
        }

        keys.push(key)
      })

      group.keys = uniq(keys)
    })

    const conditionGroup = priorityGroups.find((g) => g.name === 'Conditions')!

    // Sort conditions in the same order as in the generated CSS
    const sortedConditionKeys = Object.keys(context.conditions.values).sort((a, b) => {
      const aCondition = this.context.conditions.values[a]
      const bCondition = this.context.conditions.values[b]

      const score = compareAtRuleOrMixed(
        { entry: {} as any, conditions: [aCondition] },
        { entry: {} as any, conditions: [bCondition] },
      )
      return score
    })

    sortedConditionKeys.forEach((condName) => {
      conditionGroup.keys.push(condName)
    })

    return priorityGroups
  }

  getPriority = (key: string) => {
    return getPropPriority(key, this.options, this.priorityGroups)
  }

  format = (_text: string) => {
    const ignoredLines =
      this.ast.comments
        ?.filter((comment) => comment.value.startsWith(' prettier-ignore'))
        .map((comment) => comment.loc.end.line) ?? []

    // Only keep imports from panda
    const importDeclarations = this.getImports().filter((result) => {
      return this.context.imports.match(result, (mod) => {
        const { tsOptions } = this.context.parserOptions
        if (!tsOptions?.pathMappings) return
        return resolveTsPathPattern(tsOptions.pathMappings, mod)
      })
    })

    const file = this.context.imports.file(importDeclarations)

    const { jsx } = this.context
    if (file.isEmpty() && !jsx.isEnabled) {
      return this.ast
    }

    simpleTraverse(this.ast, {
      enter: (node) => {
        // sort `<Box ... />` style props
        if (node.type === NodeType.JSXElement) {
          // <Box ... /> -> Box
          let tagName = node.openingElement.name.type === NodeType.JSXIdentifier ? node.openingElement.name.name : ''

          // <Box ... /> -> Box
          // <styled.div /> -> styled
          let tagIdentifier = tagName

          // <styled.div />
          if (
            node.openingElement.name.type === NodeType.JSXMemberExpression &&
            node.openingElement.name.object.type === NodeType.JSXIdentifier
          ) {
            tagIdentifier = node.openingElement.name.object.name
            tagName = node.openingElement.name.object.name + '.' + node.openingElement.name.property.name
          }

          // <> ... </>
          if (!tagName) return

          const isPandaComponent = file.matchTag(tagName) && file.find(tagIdentifier)
          if (!isPandaComponent) return

          if (ignoredLines.includes(node.loc.start.line - 1)) {
            return
          }

          // sort style props
          node.openingElement.attributes.sort((a, b) => {
            if (a.type !== NodeType.JSXAttribute || b.type !== NodeType.JSXAttribute) return 0
            if (a.name.type !== NodeType.JSXIdentifier || b.name.type !== NodeType.JSXIdentifier) return 0

            return this.compareProp(a.name, b.name)
          })

          // sort style props inside css={{ ... }} prop
          const cssProp = node.openingElement.attributes.find(
            (attr) => attr.type === NodeType.JSXAttribute && attr.name.name.toString() === 'css',
          )
          if (
            cssProp &&
            cssProp.type === NodeType.JSXAttribute &&
            cssProp.value?.type === NodeType.JSXExpressionContainer &&
            cssProp.value.expression.type === NodeType.ObjectExpression
          ) {
            cssProp.value.expression.properties.sort((a, b) => {
              if (a.type !== NodeType.Property || b.type !== NodeType.Property) return 0
              if (a.key.type !== NodeType.Identifier || b.key.type !== NodeType.Identifier) return 0

              return this.compareProp(a.key, b.key)
            })
          }
        }

        // sort `css({ ... })` call expression arguments
        if (node.type === NodeType.CallExpression) {
          if (node.callee.type !== NodeType.Identifier && node.callee.type !== NodeType.MemberExpression) return

          // css({ ... })
          const fnName =
            node.callee.type === NodeType.Identifier
              ? node.callee.name
              : // css.raw({ ... })
                node.callee.object.type === NodeType.Identifier
                ? node.callee.object.name
                : ''
          if (!fnName) return

          // also sort patterns (e.g. `stack.raw({ direction: "row", mt: "4" })`)
          const isPandaFn = file.matchFn(fnName) && file.find(fnName)
          if (!isPandaFn) return

          if (ignoredLines.includes(node.loc.start.line - 1)) {
            return
          }

          node.arguments.forEach((arg) => {
            if (arg.type !== NodeType.ObjectExpression) return

            arg.properties.sort((a, b) => {
              if (a.type !== NodeType.Property || b.type !== NodeType.Property) return 0
              if (a.key.type !== NodeType.Identifier || b.key.type !== NodeType.Identifier) return 0

              return this.compareProp(a.key, b.key)
            })
          })
        }
      },
    })

    return this.ast
  }

  compareProp = (a: TSESTree.Identifier | TSESTree.JSXIdentifier, b: TSESTree.Identifier | TSESTree.JSXIdentifier) => {
    const aPriority = this.getPriority(a.name.toString())
    const bPriority = this.getPriority(b.name.toString())

    if (aPriority !== bPriority) {
      return aPriority - bPriority
    }

    // Same Priority. Then compare it alphabetically
    return a.name < b.name ? -1 : 1
  }

  getImports = () => {
    const imports: ImportResult[] = []

    this.ast.body.forEach((node) => {
      if (node.type !== NodeType.ImportDeclaration) return

      const mod = node.source.value
      if (!mod) return

      node.specifiers.forEach((specifier) => {
        if (specifier.type !== NodeType.ImportSpecifier) return

        const name = specifier.imported.name
        const alias = specifier.local.name
        const result = { name, alias, mod }

        imports.push(result)
      })
    })

    return imports
  }
}

const uniq = <T>(...items: T[][]): T[] =>
  items.filter(Boolean).reduce<T[]>((acc, item) => Array.from(new Set([...acc, ...item])), [])

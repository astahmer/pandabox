import { resolveTsPathPattern } from '@pandacss/config/ts-path'
import { type ImportResult } from '@pandacss/core'
import type { PandaContext } from '@pandacss/node'
import { getPropertyPriority } from '@pandacss/shared'
import { TSESTree } from '@typescript-eslint/types'
import { simpleTraverse } from '@typescript-eslint/typescript-estree'
import type { ParserOptions } from 'prettier'
import { getPropPriority, defaultGroupNames, type PriorityGroup, type PriorityGroupName } from './get-priority-index'
import type { PluginOptions } from './options'

const NodeType = TSESTree.AST_NODE_TYPES

export class PrettyPanda {
  priorityGroups: PriorityGroup[] = []
  options: PluginOptions

  constructor(
    public ast: TSESTree.Program,
    public context: PandaContext,
    public prettierOptions?: ParserOptions & Partial<PluginOptions>,
  ) {
    this.options = {
      pandaFirstProps: prettierOptions?.pandaFirstProps?.length
        ? prettierOptions?.pandaFirstProps
        : ['as', 'layerStyle', 'textStyle'],
      pandaLastProps: prettierOptions?.pandaLastProps ?? [],
      pandaOnlyComponents: prettierOptions?.pandaOnlyComponents ?? false,
      pandaOnlyIncluded: prettierOptions?.pandaOnlyIncluded ?? false,
      pandaStylePropsFirst: prettierOptions?.pandaStylePropsFirst ?? true,
      pandaSortOtherProps: prettierOptions?.pandaSortOtherProps ?? true,
      pandaGroupOrder: prettierOptions?.pandaGroupOrder?.length
        ? (prettierOptions?.pandaGroupOrder as any)
        : defaultGroupNames,
      // componentSpecificProps: undefined, // not supported yet
    }
    this.priorityGroups = this.generatePriorityGroups(context)
  }

  generatePriorityGroups = (context: PandaContext) => {
    const groups = new Map<PriorityGroupName, Set<string>>([
      ['Other', new Set()],
      ['Conditions', new Set()],
      ['Arbitrary conditions', new Set()],
      ['Css', new Set('css')],
    ])
    const otherStyleProps = groups.get('Other')!

    Object.entries(context.utility.config).map(([key, value]) => {
      if (!value?.group) {
        otherStyleProps.add(key)
        return
      }

      if (!groups.has(value.group)) {
        groups.set(value.group, new Set())
      }

      const set = groups.get(value.group)!
      set.add(key)
    })

    const groupNames = this.options?.pandaGroupOrder
    const groupPriorities = groupNames.reduce(
      (acc, key, index) => {
        acc[key as PriorityGroupName] = index + 1
        return acc
      },
      {} as Record<PriorityGroupName, number>,
    )

    const priorityGroups = [] as PriorityGroup[]
    groups.forEach((keys, _name) => {
      const name = _name as PriorityGroupName
      const priorityGroup: PriorityGroup = {
        name,
        keys: Array.from(keys).sort((a, b) => {
          const aPriority = getPropertyPriority(a)
          const bPriority = getPropertyPriority(b)
          return aPriority - bPriority
        }),
        priority: groupPriorities[name],
      }
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
    const sortedConditionKeys = context.conditions.getSortedKeys()
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

          if (this.options.pandaOnlyComponents) {
            const isPandaComponent = file.isPandaComponent(tagName) && file.find(tagIdentifier)
            if (!isPandaComponent) return
          } else if (!file.matchTag(tagName)) {
            return
          }

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

    // Sort other props alphabetically
    if (this.options.pandaSortOtherProps) {
      return a.name < b.name ? -1 : 1
    }

    return 0
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

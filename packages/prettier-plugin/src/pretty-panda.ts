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
const recipeFnNames = ['cva', 'sva', 'defineRecipe', 'defineSlotRecipe']
const cvaOrder = [
  'className',
  'description',
  'slots',
  'base',
  'variants',
  'defaultVariants',
  'compoundVariants',
  'staticCss',
]
const pandaConfigFns = ['defineStyles', 'defineRecipe', 'defineSlotRecipe']

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
        : ['as', 'asChild', 'ref', 'className', 'layerStyle', 'textStyle'],
      pandaLastProps: prettierOptions?.pandaLastProps ?? [],
      pandaOnlyComponents: prettierOptions?.pandaOnlyComponents ?? false,
      pandaOnlyIncluded: prettierOptions?.pandaOnlyIncluded ?? false,
      pandaStylePropsFirst: prettierOptions?.pandaStylePropsFirst ?? false,
      pandaSortOtherProps: prettierOptions?.pandaSortOtherProps ?? false,
      pandaGroupOrder: prettierOptions?.pandaGroupOrder?.length
        ? (prettierOptions?.pandaGroupOrder as any)
        : defaultGroupNames,
      pandaFunctions: prettierOptions?.pandaFunctions ?? [],
      // componentSpecificProps: undefined, // not supported yet
    }
    this.priorityGroups = this.generatePriorityGroups(context)
  }

  generatePriorityGroups = (context: PandaContext) => {
    const groups = new Map<PriorityGroupName, Set<string>>([
      ['System', new Set(['base', 'colorPalette'])],
      ['Other', new Set()],
      ['Conditions', new Set()],
      ['Arbitrary conditions', new Set()],
      ['Css', new Set(['css'])],
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

  getPriority = (key: string, identifier?: string) => {
    if (identifier) {
      const pattern = this.context.patterns.details.find((p) => p.baseName === identifier || p.match.test(identifier))
      if (pattern) {
        const prop = pattern.config.properties?.[key]
        if (prop && prop.type === 'property' && typeof prop.value === 'string') {
          return getPropPriority({ key: prop.value, config: this.options, priorityGroups: this.priorityGroups })
        }
      }
    }

    return getPropPriority({ key, config: this.options, priorityGroups: this.priorityGroups })
  }

  format = (_text: string) => {
    const ignoredLines =
      this.ast.comments
        ?.filter((comment) => comment.value.startsWith(' prettier-ignore'))
        .map((comment) => comment.loc.end.line) ?? []

    // Only keep imports from panda
    const importDeclarations = this.getImports().filter((result) => {
      if (result.mod === '@pandacss/dev' && pandaConfigFns.includes(result.name)) return true

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

            return this.compareIdent(a.name, b.name, tagName)
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

              return this.compareIdent(a.key, b.key)
            })
          }
        }

        // sort `css({ ... })` call expression arguments
        if (node.type === NodeType.CallExpression) {
          if (node.callee.type !== NodeType.Identifier && node.callee.type !== NodeType.MemberExpression) return

          // css({ ... })
          const names = this.getFnName(node)
          if (!names) return

          const fnName = names.fnName
          // also sort patterns (e.g. `stack.raw({ direction: "row", mt: "4" })`)
          const foundImport = file.find(fnName)
          const isRuntimeFn = file.matchFn(fnName) && foundImport

          // and also sort config functions `defineStyles`, `defineRecipe`, `defineSlotRecipe`
          // or custom functions from the `pandaFunctions` option
          const isPandaFn =
            isRuntimeFn ||
            (foundImport && foundImport.mod === '@pandacss/dev') ||
            pandaConfigFns.includes(fnName) ||
            this.options.pandaFunctions.includes(fnName) ||
            this.options.pandaFunctions.includes(fnName + '.' + names.fnIdentifier)
          if (!isPandaFn) return

          if (ignoredLines.includes(node.loc.start.line - 1)) {
            return
          }

          this.sortFunction(node, fnName)
        }
      },
    })

    return this.ast
  }

  sortObjectProperties = (node: TSESTree.Node, identifier?: string) => {
    if (node.type !== NodeType.ObjectExpression) return
    node.properties = this.sortProps(node.properties, identifier)
  }

  sortFunction = (node: TSESTree.CallExpression, fnName: string) => {
    const kind = this.guessFnKind(node, fnName)
    if (!kind) return

    return kind === 'atomic' ? this.sortCssFn(node, fnName) : this.sortCvaConfig(node, kind)
  }

  getFnName = (node: TSESTree.CallExpression) => {
    if (node.callee.type !== NodeType.Identifier && node.callee.type !== NodeType.MemberExpression) return

    let fnName = ''
    let fnIdentifier = ''
    if (node.callee.type === NodeType.Identifier) {
      fnName = node.callee.name
    } else if (node.callee.object.type === NodeType.Identifier) {
      fnName = node.callee.object.name

      if (node.callee.property.type === NodeType.Identifier) {
        fnIdentifier = node.callee.property.name
      } else if (node.callee.property.type === NodeType.Literal && typeof node.callee.property.value === 'string') {
        fnIdentifier = node.callee.property.value
      }
    }

    return { fnName, fnIdentifier }
  }

  guessFnKind = (node: TSESTree.CallExpression, fnName: string) => {
    if (node.callee.type !== NodeType.Identifier && node.callee.type !== NodeType.MemberExpression) return

    if (fnName === 'css') {
      return 'atomic'
    }

    if (recipeFnNames.includes(fnName)) {
      return recipeFnNamesToType[fnName as keyof typeof recipeFnNamesToType]
    }

    const firstArgument = node.arguments[0]
    if (firstArgument) {
      if (firstArgument.type === NodeType.ObjectExpression) {
        const propNames = firstArgument.properties.map((prop) => {
          if (prop.type !== NodeType.Property) return
          if (prop.key.type !== NodeType.Identifier) return
          return prop.key.name
        })

        const isSva = propNames.includes('slots')
        const isCva = cvaOrder.some((key) => propNames.includes(key))

        if (isSva) return 'slot-recipe'
        if (isCva) return 'recipe'
      }
    }

    return 'atomic'
  }

  sortCssFn = (node: TSESTree.CallExpression, fnName: string) => {
    // css / css.raw / {pattern(?.raw)}
    node.arguments.forEach((arg) => {
      this.sortObjectProperties(arg, fnName)
    })
  }

  sortCvaConfig = (node: TSESTree.CallExpression, kind: FnKind) => {
    node.arguments.forEach((arg) => {
      if (arg.type !== NodeType.ObjectExpression) return

      // Sort cva root keys in predefined order
      arg.properties.sort((a, b) => {
        if (a.type !== NodeType.Property || b.type !== NodeType.Property) return 0
        if (a.key.type !== NodeType.Identifier || b.key.type !== NodeType.Identifier) return 0

        return cvaOrder.indexOf(a.key.name) - cvaOrder.indexOf(b.key.name)
      })

      // Sort each variants styles object
      arg.properties.forEach((prop) => {
        if (prop.type !== NodeType.Property) return
        if (prop.key.type !== NodeType.Identifier) return

        if (prop.key.name === 'base') {
          if (kind === 'slot-recipe') {
            const base = prop.value
            if (base.type !== NodeType.ObjectExpression) return
            base.properties.forEach((slot) => {
              if (slot.type !== NodeType.Property) return
              if (slot.key.type !== NodeType.Identifier) return

              this.sortObjectProperties(slot.value)
            })
          } else {
            this.sortObjectProperties(prop.value)
          }
        } else if (prop.key.name === 'variants') {
          const variants = prop.value
          if (variants.type !== NodeType.ObjectExpression) return

          variants.properties.forEach((variant) => {
            if (variant.type !== NodeType.Property) return

            const variantObj = variant.value
            if (variantObj.type !== NodeType.ObjectExpression) return

            variantObj.properties.forEach((variantProp) => {
              if (variantProp.type !== NodeType.Property) return
              if (variantProp.key.type !== NodeType.Identifier) return

              const styles = variantProp.value
              if (styles.type !== NodeType.ObjectExpression) return

              if (kind === 'slot-recipe') {
                styles.properties.forEach((slotObj) => {
                  if (slotObj.type !== NodeType.Property) return
                  if (slotObj.key.type !== NodeType.Identifier) return

                  const slotStyles = slotObj.value
                  if (slotStyles.type !== NodeType.ObjectExpression) return

                  this.sortObjectProperties(slotStyles)
                })
              } else {
                this.sortObjectProperties(styles)
              }
            })
          })
        }
      })
    })
  }

  sortProps = (unsorted: (TSESTree.Property | TSESTree.SpreadElement)[], identifier?: string) => {
    const noSpread = isOnlyProperties(unsorted)

    if (noSpread) {
      const sorted = [...unsorted].sort((a, b) => this.compareProp(a, b, identifier))
      return this.sortNestedProps(sorted, identifier)
    }

    // contains SpreadElement
    // Sort sections which has only Properties.
    let start = 0
    let end = 0
    let sorted: (TSESTree.Property | TSESTree.SpreadElement)[] = []

    for (let i = 0; i < unsorted.length; i++) {
      if (unsorted[i].type === NodeType.SpreadElement) {
        end = i
        if (start < end) {
          // Sort sections which don't have SpreadElement.
          const sectionToSort = unsorted.slice(start, end) as TSESTree.Property[]
          const sectionSorted = sectionToSort.sort((a, b) => this.compareProp(a, b, identifier))
          sorted = sorted.concat(sectionSorted)
        }
        // SpreadElement will be pushed as is.
        sorted.push(unsorted[i])

        start = i + 1
      } else if (i === unsorted.length - 1) {
        // This is last property and not spread one.
        end = i + 1
        if (start < end) {
          const sectionToSort = unsorted.slice(start, end) as TSESTree.Property[]
          const sectionSorted = sectionToSort.sort((a, b) => this.compareProp(a, b, identifier))
          sorted = sorted.concat(sectionSorted)
        }
      }
    }

    return this.sortNestedProps(sorted, identifier)
  }

  sortNestedProps = (props: (TSESTree.Property | TSESTree.SpreadElement)[], identifier?: string) => {
    return props.map((prop) => {
      if (prop.type === NodeType.Property && prop.value.type === NodeType.ObjectExpression) {
        prop.value.properties = this.sortProps(prop.value.properties, identifier)
      }

      return prop
    })
  }

  compareProp = (a: TSESTree.Property, b: TSESTree.Property, identifier?: string) => {
    if (a.type !== NodeType.Property || b.type !== NodeType.Property) return 0

    // Sort arbitrary conditions last
    if (a.key.type === NodeType.Literal) return 1
    if (b.key.type === NodeType.Literal) return -1

    if (a.key.type !== NodeType.Identifier || b.key.type !== NodeType.Identifier) return 0

    return this.compareIdent(a.key, b.key, identifier)
  }

  compareIdent = (
    a: TSESTree.Identifier | TSESTree.JSXIdentifier,
    b: TSESTree.Identifier | TSESTree.JSXIdentifier,
    identifier?: string,
  ) => {
    const aPriority = this.getPriority(a.name.toString(), identifier)
    const bPriority = this.getPriority(b.name.toString(), identifier)

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

const isOnlyProperties = (
  properties: (TSESTree.Property | TSESTree.SpreadElement)[],
): properties is TSESTree.Property[] => {
  return properties.every((property) => property.type === NodeType.Property)
}

const recipeFnNamesToType = {
  cva: 'recipe',
  sva: 'slot-recipe',
  defineRecipe: 'recipe',
  defineSlotRecipe: 'slot-recipe',
} as const

type FnKind = 'atomic' | 'recipe' | 'slot-recipe'

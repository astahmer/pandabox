import type { CodegenPrepareHookArgs, CssProperties, PandaPlugin, TokenCategory } from '@pandacss/types'

export interface StrictTokensRuntimeOptions {
  categories?: TokenCategory[]
  props?: Array<keyof CssProperties | (string & {})>
}

/**
 * Enforce `strictTokens` at runtime, optionnally scope it to a set of `TokenCategory` or style props
 * - `categories`: Every properties bound to those token categories will be restricted (at runtime) with `strictTokens`
 * - `props`: Explicit list of props that will be restricted (at runtime) with `strictTokens`
 *
 * @see https://panda-css.com/docs/concepts/writing-styles#type-safety
 */
export const pluginStrictTokensRuntime = (options: StrictTokensRuntimeOptions): PandaPlugin => {
  let isStrictTokens = false
  return {
    name: 'strict-tokens-runtime',
    hooks: {
      'config:resolved': (args) => {
        if (args.config.strictTokens) isStrictTokens = true
      },
      'context:created': (args) => {
        if (!isStrictTokens) {
          args.logger.debug('plugin:strict-tokens-runtime', `strictTokens is not enabled, skipping`)
        }
      },
      'codegen:prepare': (args) => {
        if (!isStrictTokens) return args.artifacts

        return transformStrictTokensRuntime(args, options)
      },
    },
  }
}

export const transformStrictTokensRuntime = (args: CodegenPrepareHookArgs, options: StrictTokensRuntimeOptions) => {
  // Skip if it shouldnt apply to any category/props
  const { categories, props } = options
  if (categories && !categories.length && props && !props.length) return args.artifacts

  const cssFn = args.artifacts.find((art) => art.id === 'css-fn')
  const cssFile = cssFn?.files.find((f) => f.file.includes('css'))

  const tokens = args.artifacts.find((art) => art.id === 'design-tokens')
  const tokenJs = tokens?.files.find((f) => f.file.includes('index.mjs'))

  const typesStyles = args.artifacts.find((art) => art.id === 'types-styles')
  const propTypesDts = typesStyles?.files.find((f) => f.file.includes('prop-type'))

  if (!cssFile?.code || !tokenJs?.code || !propTypesDts?.code) {
    return args.artifacts
  }

  const propsByCategory = mapPropsToTokenCategory(propTypesDts.code)
  const shorthandMap = mapShorthandsToProperties(propTypesDts.code)
  // Add shorthands in token categories
  propsByCategory.forEach((set) => {
    set.forEach((key) => {
      const shorthand = shorthandMap[key]
      if (shorthand) {
        set.add(shorthand)
      }
    })
  })

  // Filter out categories/props that are not in the options
  propsByCategory.forEach((set, cat) => {
    if (categories && !categories.includes(cat as TokenCategory)) {
      propsByCategory.delete(cat)
      return
    }

    if (props?.length) {
      set.forEach((prop) => {
        if (!props.includes(prop)) {
          set.delete(prop)
        }
      })
    }
  })

  const tokenObj = tokenJs.code.slice(
    tokenJs.code.indexOf('const tokens = ') + 'const tokens = '.length,
    tokenJs.code.indexOf('export function token'),
  )
  const tokensJSON = JSON.parse(tokenObj) as Record<string, { value: string; var: string }>

  const tokenValuesByCategory = new Map<string, Set<string>>()
  Object.keys(tokensJSON).map((key) => {
    const [category, ...tokenName] = key.split('.')
    if (categories && !categories.includes(category as TokenCategory)) {
      return
    }

    const prop = tokenName.join('.')
    if (props?.length && !props.includes(prop)) {
      return
    }

    if (!tokenValuesByCategory.has(category)) {
      tokenValuesByCategory.set(category, new Set())
    }
    const set = tokenValuesByCategory.get(category)!
    set.add(prop)
  })

  // List of all props + token categories + token values
  cssFile.code = cssFile.code.replace(
    'const context = {',
    `
          const tokenValues = ${JSON.stringify(mapToObj(tokenValuesByCategory), null, 2)}
          const propsByCat = ${JSON.stringify(mapToObj(propsByCategory), null, 2)}
          const propList = new Set(Object.values(propsByCat).flat())

          const categoryByProp = new Map()
          propList.forEach((prop) => {
            Object.entries(propsByCat).forEach(([category, list]) => {
              if (list.includes(prop)) {
                categoryByProp.set(prop, category)
              }
            })
          })

          const context = {`,
  )

  // Update the `transform` function to throw an error if a token is not a valid token value
  // (only for the categories/props that are passed as arguments, if any)
  cssFile.code = cssFile.code.replace(
    'transform: (prop, value) => {',
    `transform: (prop, value) => {
          // Only throw error if the property is in the list of props
          // bound to a token category and the value is not a valid token value for that category

          if (propList.has(prop)) {
            const category = categoryByProp.get(prop)
            if (category) {
              const values = tokenValues[category]
              if (values && !values.includes(value)) {
                throw new Error(\`[super-strict-tokens]: Unknown value:\n { \${prop}: \${value} }\n Valid values in \${category} are: \${values.join(', ')}\`)
              }
            }
          }
          `,
  )

  return args.artifacts
}

const propertyRegex = /(\w+):.+Tokens\["(\w+)"\]\s?;/g
const mapPropsToTokenCategory = (file: string) => {
  // Match property lines within the interface string
  const byCategories = new Map<string, Set<string>>()

  for (const match of file.matchAll(propertyRegex)) {
    const propertyName = match[1]
    const propertyType = match[2]

    if (!byCategories.has(propertyType)) {
      byCategories.set(propertyType, new Set())
    }
    const set = byCategories.get(propertyType)!
    set.add(propertyName)
  }

  return byCategories
}

const shorthandRegex = /(\w+):\s+Shorthand<"(\w+)">;/g
const mapShorthandsToProperties = (file: string) => {
  const shorthandMap = {} as Record<string, string>

  for (const match of file.matchAll(shorthandRegex)) {
    const shorthand = match[1]
    const fullPropertyName = match[2]

    shorthandMap[fullPropertyName] = shorthand
  }

  return shorthandMap
}

const mapToObj = (map: Map<string, Set<string>>) => {
  const obj = {} as Record<string, string[]>
  map.forEach((set, key) => {
    obj[key] = [...set]
  })
  return obj
}

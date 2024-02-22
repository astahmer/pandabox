import type { CodegenPrepareHookArgs, PandaPlugin, TokenCategory } from '@pandacss/types'

export interface RestrictOptions {
  categories?: TokenCategory[]
  props?: string[]
}

export const transformPropTypes = (args: CodegenPrepareHookArgs, options: RestrictOptions) => {
  const { categories = [], props = [] } = options
  if (!categories.length && !props.length) return args.artifacts

  const artifact = args.artifacts.find((x) => x.id === 'types-styles')
  const content = artifact?.files.find((x) => x.file.includes('prop-type'))
  if (!content?.code) return args.artifacts

  const longhands = findPropertiesByType(content.code, categories)

  const shorthandMap = mapShorthandsToProperties(content.code)
  const shorthands = findShorthandsForProperties(longhands, shorthandMap)

  const strictTokenProps = longhands.concat(shorthands).concat(props)
  if (!strictTokenProps.length) return args.artifacts

  const transformed =
    content.code
      .replace(
        'type Shorthand<T> = T extends keyof PropertyValueTypes ? PropertyValueTypes[T] : CssValue<T>',
        'type Shorthand<T> = T extends keyof PropertyValueTypes ? PropertyValueTypes[T] : CssValue<T>',
      )
      // strictTokens: true, strictPropertyValues: false
      .replace('PropOrCondition<T, PropertyTypes[T]>', 'PropOrCondition<T, Restrict<T, PropertyTypes[T], CssValue<T>>>')
      // strictTokens: true, strictPropertyValues: true
      .replace(
        'PropOrCondition<T, T extends StrictableProps ? PropertyTypes[T] : PropertyTypes[T]>',
        'PropOrCondition<T, Restrict<T, T extends StrictableProps ? PropertyTypes[T] : PropertyTypes[T], CssValue<T>>>',
      )
      // strictTokens: true, strictPropertyValues: false
      .replace(
        'type PropOrCondition<Key, Value> = ConditionalValue<WithEscapeHatch<Value>>',
        'type PropOrCondition<Key, Value> = ConditionalValue<Restrict<Key, Value, (string & {})> | WithEscapeHatch<Value>>',
      )
      // strictTokens: true, strictPropertyValues: true
      .replace(
        'type PropOrCondition<Key, Value> = ConditionalValue<WithEscapeHatch<FilterVagueString<Key, Value>>>',
        'type PropOrCondition<Key, Value> = ConditionalValue<Restrict<Key, Value, (string & {})> | WithEscapeHatch<FilterVagueString<Key, Value>>>',
      ) +
    [
      `\n\ntype StrictTokenProps = ${strictTokenProps.map((t) => `"${t}"`).join(' | ')}`,
      `type Restrict<Key, Value, Fallback> = Key extends StrictTokenProps ? Value : Value | Fallback`,
    ].join('\n\n')

  content.code = transformed
  return args.artifacts
}

export const createStrictTokensScope = (options: RestrictOptions): PandaPlugin => ({
  name: 'restrict-strict-tokens',
  hooks: {
    'codegen:prepare': (args) => {
      return transformPropTypes(args, options)
    },
  },
})

const propertyRegex = /(\w+):\s+Tokens\["(\w+)"\];/g
const findPropertiesByType = (file: string, tokenCategories: string[]) => {
  // Match property lines within the interface string
  const properties = []

  for (const match of file.matchAll(propertyRegex)) {
    const propertyName = match[1]
    const propertyType = match[2]

    // Check if the property type is in the given token categories
    if (tokenCategories.includes(propertyType)) {
      properties.push(propertyName)
    }
  }

  return properties
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

const findShorthandsForProperties = (properties: string[], shorthandMap: Record<string, string>) => {
  return properties.map((property) => shorthandMap[property] || property)
}

// 'codegen:prepare': (args) => {
//     return restrictStrictTokens(args, ['colors', 'fontSizes'])
//   },

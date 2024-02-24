import type {
  CodegenPrepareHookArgs,
  CssProperties,
  LoggerInterface,
  PandaPlugin,
  TokenCategory,
} from '@pandacss/types'

export interface StrictTokensScopeOptions {
  categories?: TokenCategory[]
  props?: Array<keyof CssProperties | (string & {})>
}

/**
 * Restricts the additional type-safety from `strictTokens` to some props only.
 * - `categories`: Every properties bound to those token categories will be restricted with `strictTokens`
 * - `props`: Explicit list of props that will be restricted with `strictTokens`
 *
 * @see https://panda-css.com/docs/concepts/writing-styles#type-safety
 */
export const pluginStrictTokensScope = (options: StrictTokensScopeOptions): PandaPlugin => {
  let logger: LoggerInterface
  return {
    name: 'strict-tokens-scope',
    hooks: {
      'context:created': (context) => {
        logger = context.logger
      },
      'codegen:prepare': (args) => {
        return transformPropTypes(args, options, logger)
      },
    },
  }
}

export const transformPropTypes = (
  args: CodegenPrepareHookArgs,
  options: StrictTokensScopeOptions,
  logger?: LoggerInterface,
) => {
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

  if (logger) {
    logger.debug('plugin:restrict-strict-tokens', `🐼  Strict token props: ${strictTokenProps.join(', ')}`)
  }

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

const propertyRegex = /(\w+):.+Tokens\["(\w+)"\]\s?;/g
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

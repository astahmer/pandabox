// Adapted from https://gist.github.com/trys/520e8860e6974e7442646fdf2746128f
// https://utopia.fyi/

import type { Preset } from '@pandacss/dev'
import type { TextStyle, Token } from '@pandacss/types'
import { calculateSpaceScale, calculateTypeScale, type UtopiaTypeConfig, type UtopiaSpaceConfig } from 'utopia-core'

const MIN_WIDTH = 320
const MAX_WIDTH = 1920
const MIN_SCALE = 1.2
const MAX_SCALE = 1.333
const MIN_BASE_SIZE = 16
const MAX_BASE_SIZE = 20

const defaultSpace = {
  minWidth: MIN_WIDTH,
  maxWidth: MAX_WIDTH,
  minSize: MIN_BASE_SIZE,
  maxSize: MAX_BASE_SIZE,
  negativeSteps: [0.75, 0.5, 0.25],
  positiveSteps: [1.5, 2, 3, 4, 6, 8],
} satisfies CreateUtopiaOptions['space']

const themeKeys = {
  textStyles: true,
  fontSizes: true,
  spacing: true,
  sizes: true,
} as const

const defaults = {
  type: {
    minWidth: MIN_WIDTH,
    maxWidth: MAX_WIDTH,
    minTypeScale: MIN_SCALE,
    maxTypeScale: MAX_SCALE,
    minFontSize: MIN_BASE_SIZE,
    maxFontSize: MAX_BASE_SIZE,
    negativeSteps: 3,
    positiveSteps: 5,
  },
  space: defaultSpace,
  size: defaultSpace,
  enabled: themeKeys,
} satisfies CreateUtopiaOptions

export interface CreateUtopiaOptions {
  enabled?: Partial<Record<keyof typeof themeKeys, boolean>>
  /**
   * Fluid fonts
   * Reference: https://utopia.fyi/type/calculator
   *
   * The following constants are used to calculate fluid typography.
   * Feel free to change these initial numbers to suit your needs.
   *
   * Panda CSS can compute all of this at compile time as all the information
   * is statically available in the same file and the only functions used are
   * the Math.pow and Math.round functions.
   */
  type?: Partial<UtopiaTypeConfig & WithKeyFormat>
  /**
   * Fluid space
   * Reference: https://utopia.fyi/space/calculator
   *
   * Similar to the fluid typography, we can create fluid values for spacing.
   * Using similar formulas and similar scales.
   *
   * NOTE: It is common to have more varied needs for spacing than for font-size.
   * So feel free to add some more values by following the pattern below.
   *
   * EXCEPT: We are using `px` instead of `rem`
   * ------------------------------------------
   * When talking about font-size, it is the best practice to use
   * `rem` so that an end user can change the font-size using the
   * browser's font-size setting.
   *
   * However, when talking about spacing, it is the best practice to
   * use `px` because using `rems` here makes font-size behave like zoom.
   *
   * Users that prefer larger text, don't necessarily want larger spacing as well.
   *
   */
  space?: Partial<UtopiaSpaceConfig & WithKeyFormat>
  /**
   * Same as space but will generate sizes tokens
   */
  size?: Partial<UtopiaSpaceConfig & WithKeyFormat>
}

export const createUtopia = (configs: CreateUtopiaOptions = defaults): Preset => {
  const options = mergeWithDefaults(configs)

  const typeScale = calculateTypeScale(options.type)
  const typeSizes = generateTypeSizeKeys(options.type)
  const fontSizes = typeSizes.reduce(
    (acc, size, sizeIndex) => {
      const fontSize = typeScale[sizeIndex]
      acc[size] = { value: fontSize.clamp || '' }
      return acc
    },
    {} as Record<string, Token<string>>,
  )
  const textStyles = typeSizes.reduce(
    (acc, size, sizeIndex) => {
      const fontSize = typeScale[sizeIndex]
      acc[size] = { value: { fontSize: fontSize.clamp || '', lineHeight: '1.05' } }
      return acc
    },
    {} as Record<string, { value: TextStyle }>,
  )

  const spaceScale = calculateSpaceScale(options.space)
  const spaceSizes = generateSpaceSizeKeys(options.space)
  const spacing = spaceSizes.reduce(
    (acc, size, sizeIndex) => {
      const space = spaceScale.sizes[sizeIndex]
      acc[size] = { value: space?.clampPx || '' }
      return acc
    },
    {} as Record<string, Token<string>>,
  )

  const sizeScale = calculateSpaceScale(options.size)
  const sizeSizes = generateSpaceSizeKeys(options.size)
  const sizes = sizeSizes.reduce(
    (acc, size, sizeIndex) => {
      const space = sizeScale.sizes[sizeIndex]
      acc[size] = { value: space?.clampPx || '' }
      return acc
    },
    {} as Record<string, Token<string>>,
  )

  const preset: Preset['theme'] = {
    textStyles,
    tokens: {
      fontSizes,
      spacing,
      sizes,
    },
  }

  if (options.enabled) {
    if (!options.enabled.textStyles) {
      delete preset.textStyles
    }

    if (!options.enabled.fontSizes) {
      delete preset.tokens?.fontSizes
    }

    if (!options.enabled.spacing) {
      delete preset.tokens?.spacing
    }

    if (!options.enabled.sizes) {
      delete preset.tokens?.sizes
    }
  }

  return {
    theme: {
      extend: preset,
    },
  }
}

const mergeWithDefaults = (configs: CreateUtopiaOptions) => {
  const type = Object.assign({}, defaults.type, configs.type)
  const space = Object.assign({}, defaults.space, configs.space)
  const size = Object.assign({}, defaults.size, configs.size)

  const enabled = Object.assign(
    {},
    configs.enabled
      ? {
          textStyles: Boolean(configs.type),
          fontSizes: Boolean(configs.size),
          spacing: Boolean(configs.space),
          sizes: Boolean(configs.size),
        }
      : defaults.enabled,
    configs.enabled,
  )
  return { enabled, type, space, size }
}

const getIndexKeys = (negativeSteps: number, positiveSteps: number) => {
  // return Array.from({ length: negativeSteps + positiveSteps + 1 }, (_, index) => (index - negativeSteps + 1).toString())
  return Array.from({ length: negativeSteps + positiveSteps + 1 }, (_, index) => index + 1)
}

interface WithKeyFormat {
  format?: 'tshirt' | 'index'
}

const generateTypeSizeKeys = (config: UtopiaTypeConfig & WithKeyFormat) => {
  const negativeSteps = config.negativeSteps || 0
  const positiveSteps = config.positiveSteps || 0

  const format = config.format ?? 'tshirt'
  if (format === 'index') return getIndexKeys(negativeSteps, positiveSteps)

  return generateSizes(negativeSteps, positiveSteps).reverse()
}

const generateSpaceSizeKeys = (config: UtopiaSpaceConfig & WithKeyFormat) => {
  const negativeSteps = config.negativeSteps?.length || 0
  const positiveSteps = config.positiveSteps?.length || 0

  const format = config.format ?? 'tshirt'
  if (format === 'index') return getIndexKeys(negativeSteps, positiveSteps)

  return generateSizes(negativeSteps, positiveSteps)
}

export const generateSizes = (negativeSteps: number, positiveSteps: number) => {
  const initialSizes = ['xs', 'sm', 'md', 'lg', 'xl']
  const createSizeLabel = (prefix: string, count: number) => {
    return count > 1 ? `${count}${prefix}` : prefix
  }

  const sizes = [] as string[]

  for (let i = negativeSteps; i > 1; i--) {
    sizes.push(createSizeLabel('xs', i))
  }

  const baseIndex = initialSizes.indexOf('md')
  sizes.push(...initialSizes.slice(0, baseIndex + 1))

  for (let i = 1; i <= positiveSteps - 1; i++) {
    if (i <= initialSizes.length - baseIndex - 1) {
      sizes.push(initialSizes[baseIndex + i])
    } else {
      sizes.push(createSizeLabel('xl', i - 1))
    }
  }

  return sizes
}

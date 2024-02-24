import type { PandaPlugin } from '@pandacss/types'
import { transformFeatures, type RemoveFeaturesOptions } from '.'

/**
 * Enables a minimal setup for Panda CSS.
 * @see https://panda-css.com/docs/guides/minimal-setup
 *
 * - Removes the `@pandacss/preset-base` preset with `eject: true`
 * @see https://panda-css.com/docs/references/config#eject
 *
 * - Removes the built-in `@pandacss/preset-panda` by setting `presets: []` if not defined
 * @see https://panda-css.com/docs/customization/presets#which-panda-presets-will-be-included-
 *
 * - Allows removing features from the `styled-system` generated folder
 *
 */
export const pluginMinimalSetup = (options: RemoveFeaturesOptions): PandaPlugin => {
  return {
    name: 'minimal-setup',
    hooks: {
      'config:resolved': (args) => {
        // Eject `@pandacss/preset-base`
        args.config.eject = true

        // If the user has not defined presets, we need to define it as an empty array
        // to remove the built-in `@pandacss/preset-panda`
        if (!args.config.presets) {
          args.config.presets = []
        }
      },
      'codegen:prepare': (args) => {
        return transformFeatures(args, options)
      },
    },
  }
}

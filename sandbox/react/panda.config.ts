import { defineConfig } from '@pandacss/dev'
import {
  pluginStrictTokensScope,
  pluginRemoveNegativeSpacing,
  pluginRemoveFeatures,
  pluginRestrictStyledProps,
  pluginStrictTokensRuntime,
} from '@pandabox/panda-plugins'
import { nesCss } from '@pandabox/presets'

export default defineConfig({
  // Whether to use css reset
  preflight: true,
  // shorthands: false,

  // Where to look for your css declarations
  include: ['./src/**/*.{js,jsx,ts,tsx}', './pages/**/*.{js,jsx,ts,tsx}'],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {},
  },

  // The output directory for your css system
  outdir: 'styled-system',

  //
  // presets: ['@pandacss/dev/presets', createNesCss()],
  // presets: ['@pandacss/dev/presets', '@pandabox/presets/nes.css'],
  presets: ['@pandacss/dev/presets', nesCss],
  plugins: [
    // pluginStrictTokensScope({ categories: ['colors', 'spacing'] }),
    // pluginStrictTokensRuntime({ categories: ['colors', 'spacing'] }),
    // pluginRemoveFeatures({ features: ['no-jsx', 'no-cva'] }),
    // pluginRemoveNegativeSpacing({ spacingTokenType: true, tokenType: true }),
    // pluginRestrictStyledProps(),
  ],
  jsxFramework: 'react',
  // strictTokens: true,
  // outExtension: 'js',
})

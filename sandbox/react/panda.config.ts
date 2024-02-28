import { defineConfig } from '@pandacss/dev'
import {
  pluginStrictTokensScope,
  pluginRemoveNegativeSpacing,
  pluginRemoveFeatures,
  pluginStrictTokensRuntime,
} from '@pandabox/panda-plugins'

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
  plugins: [
    pluginStrictTokensScope({ categories: ['colors', 'spacing'] }),
    pluginStrictTokensRuntime({ categories: ['colors', 'spacing'] }),
    pluginRemoveFeatures({ features: ['no-jsx', 'no-cva'] }),
    pluginRemoveNegativeSpacing({ spacingTokenType: true, tokenType: true }),
  ],
  jsxFramework: 'react',
  strictTokens: true,
  // outExtension: 'js',
})

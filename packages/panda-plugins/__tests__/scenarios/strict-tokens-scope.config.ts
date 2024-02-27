import { defineConfig } from '@pandacss/dev'
import { pluginStrictTokensScope } from '../../src/strict-tokens-scope'

export default defineConfig({
  plugins: [pluginStrictTokensScope({ categories: ['colors', 'spacing'] })],
  strictTokens: true,
  outdir: 'styled-system-strict-tokens-scope',
})

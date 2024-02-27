import { defineConfig } from '@pandacss/dev'
import { pluginStrictTokensRuntime } from '../../src/strict-tokens-runtime'

export default defineConfig({
  plugins: [pluginStrictTokensRuntime({ categories: ['colors', 'spacing'] })],
  strictTokens: true,
  outdir: 'styled-system-strict-tokens-runtime',
})

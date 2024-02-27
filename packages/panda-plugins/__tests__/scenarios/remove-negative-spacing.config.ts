import { defineConfig } from '@pandacss/dev'
import { pluginRemoveNegativeSpacing } from '../../src/remove-negative-spacing'

export default defineConfig({
  plugins: [pluginRemoveNegativeSpacing()],
  outdir: 'styled-system-remove-negative-spacing',
})

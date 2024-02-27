import { defineConfig } from '@pandacss/dev'
import { pluginMissingCssWarnings } from '../../src/missing-css-warnings'

export default defineConfig({
  plugins: [pluginMissingCssWarnings()],
  outdir: 'styled-system-missing-css-warnings',
})

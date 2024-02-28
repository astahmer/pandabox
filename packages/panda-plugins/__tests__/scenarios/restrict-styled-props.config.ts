import { defineConfig } from '@pandacss/dev'
import { pluginRestrictStyledProps } from '../../src'

export default defineConfig({
  plugins: [pluginRestrictStyledProps()],
  outdir: 'styled-system-restrict-styled-props',
  jsxFramework: 'react',
})

// import { defineConfig } from '@pandacss/dev'

// export default defineConfig({
export default {
  preflight: true,
  include: ['./src/**/*.{tsx,jsx}', './pages/**/*.{jsx,tsx}'],
  exclude: [],
  outdir: 'styled-system',
  jsxFramework: 'react',
}

import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ['./src/**/*.{js,jsx,ts,tsx}', './{App,main,minimal}*.{js,jsx,ts,tsx}'],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {
      recipes: {
        button: {
          className: 'button',
          description: 'The styles for the Button component',
          base: {
            display: 'flex',
            cursor: 'pointer',
            fontWeight: 'bold',
          },
          variants: {
            visual: {
              funky: { bg: 'blue.200', color: 'slate.800' },
              edgy: { border: '1px solid {colors.red.500}' },
            },
            size: {
              sm: { padding: '4', fontSize: '12px' },
              lg: { padding: '8', fontSize: '40px' },
            },
            shape: {
              square: { borderRadius: '0' },
              circle: { borderRadius: 'full' },
            },
          },
          defaultVariants: {
            visual: 'funky',
            size: 'sm',
            shape: 'circle',
          },
        },
      },
    },
  },

  // The output directory for your css system
  outdir: 'styled-system',

  // The JSX framework to use
  jsxFramework: 'react',
})

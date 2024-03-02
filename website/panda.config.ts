import { defineConfig } from '@pandacss/dev'
import { preset as basePreset } from '@pandacss/preset-base'
import { createUtopia } from '@pandabox/presets'
import { pluginRemoveUnusedCss } from '@pandabox/panda-plugins'

export default defineConfig({
  plugins: [pluginRemoveUnusedCss()],
  presets: [
    '@pandacss/preset-panda',
    '@park-ui/panda-preset',
    createUtopia({
      enabled: { textStyles: true, fontSizes: true },
      // space: { format: 'index' },
      // size: { format: 'index' },
      type: { positiveSteps: 8 },
    }),
  ],

  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ['./app/**/*.{js,jsx,ts,tsx}'],

  // Files to exclude
  exclude: [],

  conditions: {
    // next-themes
    dark: '.dark &, [data-theme="dark"] &',
    light: '.light &, [data-theme="light"] &',
    // react-resizable-panels
    resizeHandleActive: '[data-resize-handle-active] &',
    panelHorizontalActive: '[data-panel-group-direction="horizontal"] &',
    panelVerticalActive: '[data-panel-group-direction="vertical"] &',
  },

  // Useful for theme customization
  theme: {
    extend: {
      tokens: {
        colors: {
          whiteish: { value: 'rgba(255, 255, 255, 0.87)' },
          blackish: { value: '#242424' },
        },
        spacing: {
          0.25: { value: '0.065rem' },
        },
      },
      semanticTokens: {
        colors: {
          'text.main': {
            value: { base: '{colors.blackish}', _dark: '{colors.whiteish}' },
          },
          'bg.main': {
            value: { base: '{colors.whiteish}', _dark: '{colors.blackish}' },
          },
        },
      },
    },
  },

  utilities: {
    boxSize: {
      values: basePreset.utilities?.width?.values,
      transform: (value) => {
        return {
          width: value,
          height: value,
        }
      },
    },
  },

  globalCss: {
    '*': {
      minH: '0',
    },
    'html, body': {
      h: 'full',
      color: 'text.main',
      backgroundColor: 'bg.main',
    },
  },

  // The output directory for your css system
  outdir: 'styled-system',

  // The JSX framework to use
  jsxFramework: 'react',
})

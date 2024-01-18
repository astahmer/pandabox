# @pandakit/define-theme

End to end type-safe theme definition (without any codegen step), so that the `panda.config.ts` can also benefit from
type-safety and token/conditions/utilities autocomplete.

## Usage

```ts
import { defineTheme } from '@pandakit/define-theme'

const t = defineTheme()

// Define tokens with the builder. TypeScript infers the structure.
const theme = t
  .conditions({
    hover: '&:is(:hover, [data-hover])',
    focus: '&:is(:focus, [data-focus])',
  })
  .breakpoints({
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  })
  .tokens({
    colors: {
      black: { value: '#000' },
      white: { value: '#fff' },
      rose: {
        50: { value: '#fff1f2' },
        100: { value: '#ffe4e6' },
        200: { value: '#fecdd3' },
      },
    },
    sizes: {
      sm: { value: '0.75rem' },
      md: { value: '1rem' },
      lg: { value: '1.25rem' },
    },
  })
  .semanticTokens({
    colors: {
      primary: { value: 'blue' },
      text: {
        DEFAULT: { value: 'xxx' },
        foreground: { value: 'xxx' },
        background: { value: 'xxx' },
        heading: {
          DEFAULT: { value: 'xxx' },
          value: { base: 'xxx', _osDark: 'xxx' },
          subheading: { value: 'xxx' },
        },
      },
    },
    sizes: {
      header: {
        value: { base: 'xxx', md: 'xxx', xl: 'xxx' },
      },
    },
    zIndex: {
      tooltip: { value: 'xxx' },
    },
  })
  .utilities({
    background: {
      shorthand: 'bg',
      className: 'bg',
      values: 'colors',
    },
    width: {
      shorthand: 'w',
      className: 'w',
      values: 'sizes',
    },
    height: {
      shorthand: 'h',
      className: 'h',
      values: 'sizes',
    },
    color: {
      className: 'text',
      values: 'colors',
    },
  })

const config = theme.build()

// Everything here will be typed, without any codegen
config.defineStyles({ bg: 'text.background', background: 'text.foreground' })
config.defineRecipe({
  className: 'aaa',
  base: {
    _hover: {
      color: 'text',
      sm: {
        _focus: {
          fontSize: '12px',
        },
      },
    },
    display: 'flex',
    background: 'text',
  },
  variants: {
    type: {
      success: {
        bg: 'rose.200',
        background: 'tex.',
      },
    },
  },
  defaultVariants: {
    type: 'success',
  },
})
```

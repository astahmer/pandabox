import { defineTheme } from '../src/define-theme'

const t = defineTheme()

// Define tokens with the builder. TypeScript infers the structure.
const theme = t
  .conditions({
    _hover: '&:is(:hover, [data-hover])',
    _focus: '&:is(:focus, [data-focus])',
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

config.defineStyles({ bg: 'text.background', background: 'text.foreground' })
config.defineRecipe({
  className: 'aaa',
  base: {
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

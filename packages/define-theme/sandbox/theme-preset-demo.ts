import { config } from './theme-preset'

config.defineStyles({
  bg: 'blue.100',
  fontSize: 'xxx-large',
  color: 'blue.300',
  // backgroundGradient: "",
  background: 'text.foreground',
  _hover: {
    _dark: {
      bg: 'text.background',
    },
  },
})

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

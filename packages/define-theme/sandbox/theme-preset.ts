import { defineTheme } from '../src/define-theme'
import { preset as presetBase } from './preset-base'
import { preset as presetPanda } from './preset-panda'

const t = defineTheme()

const { conditions, utilities } = presetBase
const { tokens } = presetPanda.theme

// Define tokens with the builder. TypeScript infers the structure.
const builder = t.conditions(conditions).tokens(tokens).utilities(utilities)

// const config = defineTheme(builder)
const config = builder.build()

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

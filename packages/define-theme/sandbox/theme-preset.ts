import { defineTheme } from '../src/define-theme'
import { preset as presetBase } from './preset-base'
import { preset as presetPanda } from './preset-panda'

const t = defineTheme()

const { conditions, utilities } = presetBase
const { tokens, breakpoints, textStyles } = presetPanda.theme

// Define tokens with the builder. TypeScript infers the structure.
const builder = t
  .conditions(conditions)
  .breakpoints(breakpoints)
  .tokens(tokens)
  .utilities(utilities)
  .textStyles(textStyles)

// const config = defineTheme(builder)
export const config = builder.build()

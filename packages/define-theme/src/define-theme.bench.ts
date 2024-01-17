import { bench } from '@arktype/attest'

import { preset as presetBase } from '../sandbox/preset-base'
import { preset as presetPanda } from '../sandbox/preset-panda'

import { defineTheme } from './define-theme'

const { conditions, utilities } = presetBase
const { tokens } = presetPanda.theme

bench('defineTheme conditions + tokens + utilities', () => {
  const t = defineTheme()

  const builder = t.conditions(conditions).tokens(tokens).utilities(utilities)
  const config = builder.build()

  return {} as any as typeof config
}).types([285, 'instantiations'])

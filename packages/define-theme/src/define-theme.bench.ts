import { bench } from '@arktype/attest'

import { preset as presetBase } from '../sandbox/preset-base'

import { preset as presetPanda } from '../sandbox/preset-panda'
import { defineTheme } from './define-theme'

const { conditions, utilities } = presetBase
const { tokens } = presetPanda.theme

const { conditions: presetConditions } = presetBase

bench('from builder - defineTheme conditions + tokens + utilities', () => {
  const t = defineTheme()

  const builder = t.conditions(presetBase.conditions).tokens(tokens).utilities(presetBase.utilities)
  const config = builder.build()

  return {} as any as typeof config
  // }).types([7352, 'instantiations'])
  //   [84, 'instantiations']
}).types([253, 'instantiations'])

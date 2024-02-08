import { mergeConfigs } from '@pandacss/config'
import presetBase from '@pandacss/preset-base'
import presetPanda from '@pandacss/preset-panda'
import { parseJson, stringifyJson } from '@pandacss/shared'
import { Config, LoadConfigResult, PresetCore, UserConfig } from '@pandacss/types'

const buttonRecipe = {
  className: 'button',
  description: 'The styles for the Button component',
  base: {
    display: 'flex',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  variants: {
    visual: {
      funky: { bg: 'red.200', color: 'slate.800' },
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
}

const fixturePreset: Omit<PresetCore, 'globalCss' | 'staticCss'> = {
  ...presetBase,
  ...presetPanda,
  theme: {
    ...presetPanda.theme,
    recipes: {
      button: buttonRecipe,
    },
  },
}

const config: UserConfig = {
  ...fixturePreset,
  optimize: true,
  cwd: '',
  outdir: 'styled-system',
  include: [],
  //
  cssVarRoot: ':where(html)',
  jsxFramework: 'react',
}

const fixtureDefaults = {
  dependencies: [],
  config,
  path: '',
  hooks: {},
  serialized: stringifyJson(config),
  deserialize: () => parseJson(stringifyJson(config)),
} as LoadConfigResult

export const createConfigResult = (userConfig: Config) => {
  const resolvedConfig = (
    userConfig ? mergeConfigs([userConfig, fixtureDefaults.config]) : fixtureDefaults.config
  ) as UserConfig

  return { ...fixtureDefaults, config: resolvedConfig }
}

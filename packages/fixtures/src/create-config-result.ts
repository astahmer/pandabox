import { mergeConfigs } from '@pandacss/config'
import { PandaContext } from '@pandacss/node'
import presetBase from '@pandacss/preset-base'
import presetPanda from '@pandacss/preset-panda'
import { parseJson, stringifyJson } from '@pandacss/shared'
import type { Config, LoadConfigResult, PresetCore, UserConfig } from '@pandacss/types'
import { utils } from './utils'

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

export const createConfigResult = (userConfig?: Config) => {
  const resolvedConfig = (
    userConfig ? mergeConfigs([userConfig, fixtureDefaults.config]) : fixtureDefaults.config
  ) as UserConfig

  return { ...fixtureDefaults, config: resolvedConfig }
}

export const createContext = (userConfig?: Config) => {
  let resolvedConfig = (
    userConfig ? mergeConfigs([userConfig, fixtureDefaults.config]) : fixtureDefaults.config
  ) as UserConfig

  const hooks = userConfig?.hooks ?? {}

  // This allows editing the config before the context is created
  // since this function is only used in tests, we only look at the user hooks
  // not the presets hooks, so that we can keep this fn sync
  if (hooks['config:resolved']) {
    const result = hooks['config:resolved']({
      config: resolvedConfig,
      path: fixtureDefaults.path,
      dependencies: fixtureDefaults.dependencies,
      utils: utils,
    })
    if (result) {
      resolvedConfig = result as UserConfig
    }
  }

  return new PandaContext({
    ...fixtureDefaults,
    hooks,
    config: resolvedConfig,
    tsconfig: {
      useInMemoryFileSystem: true,
    },
  })
}

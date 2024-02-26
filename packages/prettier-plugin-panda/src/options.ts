import type { Plugin, SupportOption } from 'prettier'

export interface PluginOptions {
  pandaConfigPath?: string
  pandaCwd?: string
  //
  firstProps: string[]
  lastProps: string[]
  isCompPropsBeforeStyleProps: boolean
  componentSpecificProps: string[] | undefined
}

export const options: Plugin['options'] = {
  pandaConfigPath: {
    type: 'path',
    category: 'Panda',
    description: 'The path to the panda config file',
    default: undefined,
  },
  pandaCwd: {
    type: 'string',
    category: 'Panda',
    description: 'The current working directory',
    default: undefined,
  },
  //
  firstProps: {
    array: true,
    type: 'string',
    category: 'Panda',
    description: 'The first props to sort',
  },
  lastProps: {
    array: true,
    type: 'string',
    category: 'Panda',
    description: 'The last props to sort',
  },
  isCompPropsBeforeStyleProps: {
    type: 'boolean',
    category: 'Panda',
    description: 'Whether to sort the style props before the component props',
    default: true,
  },
  componentSpecificProps: {
    array: true,
    type: 'string',
    category: 'Panda',
    description: 'The component specific props to sort',
  },
} satisfies Record<keyof PluginOptions, SupportOption>

export const defaultOptions: Plugin['defaultOptions'] = {
  pandaConfigPath: options.pandaConfigPath.default,
  pandaCwd: options.pandaCwd.default,
  //
  firstProps: options.firstProps.default,
  lastProps: options.lastProps.default,
  isCompPropsBeforeStyleProps: options.isCompPropsBeforeStyleProps.default,
  componentSpecificProps: options.componentSpecificProps.default,
} satisfies Record<keyof PluginOptions, SupportOption>

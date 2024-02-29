import type { Plugin, SupportOption } from 'prettier'

export interface PluginOptions {
  pandaConfigPath?: string
  pandaCwd?: string
  //
  pandaFirstProps: string[]
  pandaLastProps: string[]
  pandaOnlyComponents: boolean
  pandaOnlyIncluded: boolean
  // isCompPropsBeforeStyleProps: boolean
  // componentSpecificProps: string[] | undefined
}

export const options = {
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
  pandaFirstProps: {
    array: true,
    type: 'string',
    category: 'Panda',
    description: 'The first props to sort',
    default: [{ value: [] }],
  },
  pandaLastProps: {
    array: true,
    type: 'string',
    category: 'Panda',
    description: 'The last props to sort',
    default: [{ value: [] }],
  },
  pandaOnlyComponents: {
    type: 'boolean',
    category: 'Panda',
    description: 'Only sort props in Panda components (JSX patterns and `<styled.xxx /> factory`)',
    default: false,
  },
  pandaOnlyIncluded: {
    type: 'boolean',
    category: 'Panda',
    description: 'Only sort props in files that are included in the config',
    default: false,
  },
  // isCompPropsBeforeStyleProps: {
  //   type: 'boolean',
  //   category: 'Panda',
  //   description: 'Whether to sort the style props before the component props',
  //   default: true,
  // },
  // componentSpecificProps: {
  //   array: true,
  //   type: 'string',
  //   category: 'Panda',
  //   description: 'The component specific props to sort',
  // },
} satisfies Record<keyof PluginOptions, SupportOption>

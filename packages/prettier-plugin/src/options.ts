import type { SupportOption } from 'prettier'

export interface PluginOptions {
  pandaConfigPath?: string
  pandaCwd?: string
  //
  pandaFirstProps: string[]
  pandaLastProps: string[]
  pandaOnlyComponents: boolean
  pandaOnlyIncluded: boolean
  pandaStylePropsFirst: boolean
  pandaSortOtherProps: boolean
  pandaGroupOrder: string[]
  pandaFunctions: string[]
  pandaIgnoreComponents: string[]
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
    description: 'Only sort props in known Panda components (JSX patterns and `<styled.xxx /> factory`)',
    default: false,
  },
  pandaOnlyIncluded: {
    type: 'boolean',
    category: 'Panda',
    description: 'Only sort props in files that are included in the config',
    default: false,
  },
  pandaStylePropsFirst: {
    type: 'boolean',
    category: 'Panda',
    description: 'Whether to sort the style props before the component props',
    default: false,
  },
  pandaSortOtherProps: {
    type: 'boolean',
    category: 'Panda',
    description: 'Whether to sort the other props alphabetically',
    default: false,
  },
  pandaGroupOrder: {
    array: true,
    type: 'string',
    category: 'Panda',
    description:
      "The order of the style groups. Defaults to: ['System', 'Container', 'Display', 'Visibility', 'Position', 'Transform', 'Flex Layout', 'Grid Layout', 'Layout', 'Border', 'Border Radius', 'Width', 'Height', 'Margin', 'Padding', 'Color', 'Typography', 'Background', 'Shadow', 'Table', 'List', 'Scroll', 'Interactivity', 'Transition', 'Effect', 'Other', 'Conditions', 'Arbitrary conditions', 'Css']",
    default: [{ value: [] }],
  },
  pandaFunctions: {
    array: true,
    type: 'string',
    category: 'Panda',
    description: 'Additional functions to sort. Defaults to: []',
    default: [{ value: [] }],
  },
  pandaIgnoreComponents: {
    array: true,
    type: 'string',
    category: 'Panda',
    description: 'Additional functions to sort. Defaults to: []',
    default: [{ value: [] }],
  },
  // componentSpecificProps: {
  //   array: true,
  //   type: 'string',
  //   category: 'Panda',
  //   description: 'The component specific props to sort',
  // },
} satisfies Record<keyof PluginOptions, SupportOption>

// Adapted from
// https://github.com/yukukotani/eslint-plugin-chakra-ui/blob/dba8a50774e7b133ff9a9d3ae099202ac4d620c4/src/rules/props-order.ts

import type { CssSemanticGroup } from '@pandacss/types'
import type { PluginOptions } from './options'

export const groupNames = [
  'System',
  'Container',
  'Display',
  'Visibility',
  'Position',
  'Transform',
  'Flex Layout',
  'Grid Layout',
  'Layout',
  'Border',
  'Border Radius',
  'Width',
  'Height',
  'Margin',
  'Padding',
  'Color',
  'Typography',
  'Background',
  'Shadow',
  'Table',
  'List',
  'Scroll',
  'Interactivity',
  'Transition',
  'Effect',
  'Other',
  'Conditions',
  'Arbitrary conditions',
  'Css',
] as const

export type PriorityGroupName = CssSemanticGroup | (typeof groupNames)[number]

export const groupPriorities = groupNames.reduce(
  (acc, key, index) => {
    acc[key] = index + 1
    return acc
  },
  {} as Record<PriorityGroupName, number>,
)

type Priority = typeof groupPriorities

export type PriorityGroup = {
  name: PriorityGroupName
  keys: string[]
  priority: Priority[PriorityGroupName]
}

/**
 * getPriority returns a number. The smaller is the higher priority.
 * Internally, each property should have 2 priorities.
 * One is its "group priority", determined by which group property belongs,
 * and the other is its "inGroup priority", determined by index in that group.
 */
export function getPropPriority(key: string, config: PluginOptions, priorityGroups: PriorityGroup[]): number {
  const { firstProps = [], lastProps = [], componentSpecificProps = [] } = config
  const indexInFirstProps = firstProps.indexOf(key)
  const indexInLastProps = lastProps.indexOf(key)

  if (indexInFirstProps !== -1) {
    return calcPriorityFromIndex({ type: 'reservedFirstProps', value: indexInFirstProps }, config, priorityGroups)
  }
  if (indexInLastProps !== -1) {
    return calcPriorityFromIndex({ type: 'reservedLastProps', value: indexInLastProps }, config, priorityGroups)
  }

  if (componentSpecificProps) {
    const index = componentSpecificProps.indexOf(key)
    if (index !== -1) {
      return calcPriorityFromIndex({ type: 'componentSpecificProps', value: index }, config, priorityGroups)
    }
  }

  // Then it can be either `stylePropsPriority` or `otherPropsPriority`
  const groupIndex = priorityGroups.findIndex((group) => {
    return group.keys.includes(key)
  })

  const isStyleProps = groupIndex > -1
  if (isStyleProps) {
    const keyIndex = priorityGroups[groupIndex].keys.indexOf(key)
    return calcPriorityFromIndex({ type: 'styleProps', groupIndex, keyIndex }, config, priorityGroups)
  }

  return calcPriorityFromIndex({ type: 'otherProps' }, config, priorityGroups)
}

type Index =
  | { type: 'reservedFirstProps' | 'componentSpecificProps' | 'reservedLastProps'; value: number }
  | { type: 'styleProps'; groupIndex: number; keyIndex: number }
  | { type: 'otherProps' }

const calcPriorityFromIndex = (index: Index, config: PluginOptions, priorityGroups: PriorityGroup[]) => {
  // This calculates the priority, in which every property has different priority.
  // As an exception, non-predefined properties have the same priority.
  // They will be treated as "other Props".

  // Currently, the priority is determined from the index of the array.
  // We assume that the length of each array is at most 100.
  // When changing the specification, be sure to check that the stylePropsPriority range does not overlap with others.
  // Now its range is 20000 <= x < 30000;

  // Perhaps we may want to handle -1 as error in some future.
  // Therefore I set the priority to numbers greater than or equal to zero.
  const isComponentSpecBeforeStyle = config.isCompPropsBeforeStyleProps
  const basePriorities = {
    firstProps: 0,
    styleProps: 20000,
    componentSpecificProps: isComponentSpecBeforeStyle ? 10000 : 30000,
    otherProps: 40000,
    lastProps: 50000,
  }

  switch (index.type) {
    case 'reservedFirstProps': {
      const groupPriority = basePriorities.firstProps
      const InGroupPriority = index.value

      return groupPriority + InGroupPriority
    }
    case 'styleProps': {
      const { groupIndex, keyIndex } = index
      const basePriority = basePriorities.styleProps
      const groupPriority = priorityGroups[groupIndex].priority
      const InGroupPriority = keyIndex

      // By using the following formula, we can assign a unique priority to each props of style props.
      // Justification: Since priorityGroups[**].length is less than 100, there is no duplicate.
      return basePriority + groupPriority * 100 + InGroupPriority
    }
    case 'componentSpecificProps': {
      const groupPriority = basePriorities.componentSpecificProps
      return groupPriority
    }
    case 'otherProps': {
      const groupPriority = basePriorities.otherProps
      // This will always return same priority value. It needs non-priority-based sorting.
      return groupPriority
    }
    case 'reservedLastProps': {
      const groupPriority = basePriorities.lastProps
      const InGroupPriority = index.value
      return groupPriority + InGroupPriority
    }
  }
}

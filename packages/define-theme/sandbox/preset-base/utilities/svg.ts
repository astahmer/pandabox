import type { UtilityConfig } from '@pandacss/types'

export const svg = {
  fill: {
    className: 'fill',
    values: 'colors',
  },
  stroke: {
    className: 'stroke',
    values: 'colors',
  },
  strokeWidth: {
    className: 'stroke-w',
    values: 'borderWidths',
  },
} as const satisfies UtilityConfig

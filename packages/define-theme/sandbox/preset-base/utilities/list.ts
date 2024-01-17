import type { UtilityConfig } from '@pandacss/types'

export const list = {
  listStyleType: {
    className: 'list',
  },
  listStylePosition: {
    className: 'list',
  },
  listStyleImage: {
    className: 'list-img',
    values: 'assets',
  },
} as const satisfies UtilityConfig

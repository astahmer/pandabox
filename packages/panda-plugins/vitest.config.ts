import type { UserConfig } from 'vitest'

const options: UserConfig = {
  'missing-css-warnings': {
    test: {
      environment: 'happy-dom',
      include: ['**/__tests__/scenarios/missing-css-warnings.{test,spec}.{j,t}s?(x)'],
    },
  },
} as Record<string, UserConfig>

const mode = process.env.MODE ?? 'react'
console.log({ mode })
export default (options as any)[mode]

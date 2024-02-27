import type { UserConfig } from 'vitest'

const options: UserConfig = {
  'missing-css-warnings': {
    test: {
      environment: 'happy-dom',
      include: ['**/__tests__/scenarios/missing-css-warnings.{test,spec}.{j,t}s?(x)'],
    },
  },
  'remove-negative-spacing': {
    test: {
      typecheck: {
        enabled: true,
      },
      include: ['**/__tests__/scenarios/remove-negative-spacing.{test,spec}.{j,t}s?(x)'],
    },
  },
  'strict-tokens-scope': {
    test: {
      typecheck: {
        enabled: true,
      },
      include: ['**/__tests__/scenarios/strict-tokens-scope.{test,spec}.{j,t}s?(x)'],
    },
  },
  'strict-tokens-runtime': {
    test: {
      typecheck: {
        enabled: true,
      },
      include: ['**/__tests__/scenarios/strict-tokens-runtime.{test,spec}.{j,t}s?(x)'],
    },
  },
} as Record<string, UserConfig>

const mode = process.env.MODE ?? 'missing-css-warnings'
const config = (options as any)[mode]
console.log({ mode })

export default config

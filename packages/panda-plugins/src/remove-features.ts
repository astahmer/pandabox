import type { CodegenPrepareHookArgs, PandaPlugin } from '@pandacss/types'

type Feature = 'no-jsx' | 'no-styled' | 'no-recipes' | 'no-patterns' | 'only-css-dir' | 'no-cva' | 'no-sva'

export interface RemoveFeaturesOptions {
  features: Feature[]
}

/**
 * Removes features from the `styled-system` generated folder.
 * - `no-jsx`: Removes every file in `/jsx
 * - `no-styled`: Removes `factory.m?(j|d.t)s` from `/jsx`
 * - `no-recipes`: Removes every file in `/recipes`
 * - `no-patterns`: Removes every file in `/patterns`
 * - `only-css-dir`: Removes jsx/recipes/patterns files
 * - `no-cva`: Removes `cva.m?(j|d.t)s` from `/css`
 * - `no-sva`: Removes `sva.m?(j|d.t)s` from `/css`
 */
export const pluginRemoveFeatures = (options: RemoveFeaturesOptions): PandaPlugin => {
  return {
    name: 'remove-features',
    hooks: {
      'codegen:prepare': (args) => {
        return transformFeatures(args, options)
      },
    },
  }
}

export const transformFeatures = (args: CodegenPrepareHookArgs, options: RemoveFeaturesOptions) => {
  const { features: transforms } = options
  const features = {
    'no-jsx': transforms.includes('no-jsx'),
    'no-styled': transforms.includes('no-styled'),
    'no-recipes': transforms.includes('no-recipes'),
    'no-patterns': transforms.includes('no-patterns'),
    'no-cva': transforms.includes('no-cva'),
    'no-sva': transforms.includes('no-sva'),
    'only-css-dir': transforms.includes('only-css-dir'),
  }

  const filtered = args.artifacts.filter((a) => {
    // Remove every file in `/jsx`
    if (features['no-jsx'] && a.dir?.at(-1) === 'jsx') return false

    // Remove every file in `/recipes`
    if (features['no-recipes'] && a.dir?.at(-1) === 'recipes') return false

    // Remove every file in `/patterns`
    if (features['no-patterns'] && a.dir?.at(-1) === 'patterns') return false

    // Remove jsx/recipes/patterns files
    if (features['only-css-dir']) {
      const dir = a.dir?.at(-1)
      if (dir && ['jsx', 'recipes', 'patterns'].includes(dir)) return false
    }

    // Remove `factory.m?(j|d.t)s` from `/jsx`
    if (features['no-styled'] && a.id === 'jsx-factory') return false

    // Remove `cva.m?(j|d.t)s` from `/css`
    if (features['no-cva'] && a.id.includes('cva')) return false

    // Remove `sva.m?(j|d.t)s` from `/css`
    if (features['no-sva'] && a.id.includes('sva')) return false

    return true
  })

  // Remove the `export * from './factory` line from `index.m?(j|d.t)s files
  if (features['no-styled']) {
    const jsxIndex = filtered.find((a) => a.id === 'jsx-patterns-index')
    if (jsxIndex) {
      jsxIndex.files.forEach((f) => {
        if (!f.code) return

        const lines = f.code.split('\n')
        const exportFactory = lines.findIndex((l) => l.includes("export * from './factory"))
        if (exportFactory === -1) return

        lines.splice(exportFactory, 1)
        f.code = lines.join('\n')
      })
    }
  }

  if (features['no-cva'] || features['no-sva']) {
    const cssIndex = filtered.find((a) => a.id === 'css-index')
    if (cssIndex) {
      cssIndex.files.forEach((f) => {
        if (!f.code) return

        // Remove the `export * from './cva` line from `index.m?(j|d.t)s files
        const lines = f.code.split('\n')
        if (features['no-cva']) {
          const exportIndex = lines.findIndex((l) => l.includes("export * from './cva"))
          if (exportIndex > -1) {
            lines.splice(exportIndex, 1)
          }
        }

        // Remove the `export * from './sva` line from `index.m?(j|d.t)s files
        if (features['no-sva']) {
          const exportIndex = lines.findIndex((l) => l.includes("export * from './sva"))
          if (exportIndex > -1) {
            lines.splice(exportIndex, 1)
          }
        }

        f.code = lines.join('\n')
      })
    }
  }

  return filtered
}

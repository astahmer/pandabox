import { createContext } from '#pandabox/fixtures'
import type { Config } from '@pandacss/types'
import { describe, expect, test } from 'vitest'
import { transformFeatures, type RemoveFeaturesOptions } from '../src/remove-features'

const removeFeatures = (userConfig: Config, options: RemoveFeaturesOptions) => {
  const ctx = createContext(userConfig)
  const artifacts = ctx.getArtifacts()

  return transformFeatures({ artifacts, changed: undefined }, options)
}

describe('remove-features', () => {
  test('no-jsx', () => {
    const artifacts = removeFeatures({}, { features: ['no-jsx'] })
    expect(artifacts.map((a) => a.dir?.at(-1))).toMatchInlineSnapshot(`
      [
        undefined,
        "tokens",
        "types",
        "types",
        "types",
        "types",
        "types",
        "types",
        "css",
        "css",
        "css",
        "css",
        "recipes",
        "recipes",
        "recipes",
        "patterns",
        "patterns",
        "css",
      ]
    `)
  })

  test('no-recipes', () => {
    const artifacts = removeFeatures({}, { features: ['no-recipes'] })
    expect(artifacts.map((a) => a.dir?.at(-1))).toMatchInlineSnapshot(`
      [
        undefined,
        "tokens",
        "types",
        "types",
        "types",
        "types",
        "types",
        "types",
        "css",
        "css",
        "css",
        "css",
        "patterns",
        "patterns",
        "jsx",
        "jsx",
        "jsx",
        "jsx",
        "jsx",
        "css",
      ]
    `)
  })

  test('no-patterns', () => {
    const artifacts = removeFeatures({}, { features: ['no-patterns'] })
    expect(artifacts.map((a) => a.dir?.at(-1))).toMatchInlineSnapshot(`
      [
        undefined,
        "tokens",
        "types",
        "types",
        "types",
        "types",
        "types",
        "types",
        "css",
        "css",
        "css",
        "css",
        "recipes",
        "recipes",
        "recipes",
        "jsx",
        "jsx",
        "jsx",
        "jsx",
        "jsx",
        "css",
      ]
    `)
  })

  test('only-css-dir', () => {
    const artifacts = removeFeatures({}, { features: ['only-css-dir'] })
    expect(artifacts.map((a) => a.dir?.at(-1))).toMatchInlineSnapshot(`
      [
        undefined,
        "tokens",
        "types",
        "types",
        "types",
        "types",
        "types",
        "types",
        "css",
        "css",
        "css",
        "css",
        "css",
      ]
    `)
  })

  test('no-styled', () => {
    const artifacts = removeFeatures({}, { features: ['no-styled'] })
    const ids = artifacts.flatMap((a) => a.files.map((f) => f.file))
    expect(ids).toMatchInlineSnapshot(`
      [
        "helpers.mjs",
        "index.d.ts",
        "index.mjs",
        "tokens.d.ts",
        "jsx.d.ts",
        "global.d.ts",
        "index.d.ts",
        "prop-type.d.ts",
        "style-props.d.ts",
        "conditions.d.ts",
        "csstype.d.ts",
        "static-css.d.ts",
        "selectors.d.ts",
        "composition.d.ts",
        "recipe.d.ts",
        "pattern.d.ts",
        "parts.d.ts",
        "system-types.d.ts",
        "conditions.mjs",
        "css.mjs",
        "css.d.ts",
        "cva.mjs",
        "cva.d.ts",
        "sva.mjs",
        "sva.d.ts",
        "cx.mjs",
        "cx.d.ts",
        "create-recipe.mjs",
        "index.mjs",
        "index.d.ts",
        "button.mjs",
        "button.d.ts",
        "index.mjs",
        "index.d.ts",
        "box.mjs",
        "box.d.ts",
        "flex.mjs",
        "flex.d.ts",
        "stack.mjs",
        "stack.d.ts",
        "vstack.mjs",
        "vstack.d.ts",
        "hstack.mjs",
        "hstack.d.ts",
        "spacer.mjs",
        "spacer.d.ts",
        "square.mjs",
        "square.d.ts",
        "circle.mjs",
        "circle.d.ts",
        "center.mjs",
        "center.d.ts",
        "link-box.mjs",
        "link-box.d.ts",
        "link-overlay.mjs",
        "link-overlay.d.ts",
        "aspect-ratio.mjs",
        "aspect-ratio.d.ts",
        "grid.mjs",
        "grid.d.ts",
        "grid-item.mjs",
        "grid-item.d.ts",
        "wrap.mjs",
        "wrap.d.ts",
        "container.mjs",
        "container.d.ts",
        "divider.mjs",
        "divider.d.ts",
        "float.mjs",
        "float.d.ts",
        "bleed.mjs",
        "bleed.d.ts",
        "visually-hidden.mjs",
        "visually-hidden.d.ts",
        "cq.mjs",
        "cq.d.ts",
        "is-valid-prop.mjs",
        "is-valid-prop.d.ts",
        "factory-helper.mjs",
        "box.mjs",
        "box.d.ts",
        "flex.mjs",
        "flex.d.ts",
        "stack.mjs",
        "stack.d.ts",
        "vstack.mjs",
        "vstack.d.ts",
        "hstack.mjs",
        "hstack.d.ts",
        "spacer.mjs",
        "spacer.d.ts",
        "square.mjs",
        "square.d.ts",
        "circle.mjs",
        "circle.d.ts",
        "center.mjs",
        "center.d.ts",
        "link-box.mjs",
        "link-box.d.ts",
        "link-overlay.mjs",
        "link-overlay.d.ts",
        "aspect-ratio.mjs",
        "aspect-ratio.d.ts",
        "grid.mjs",
        "grid.d.ts",
        "grid-item.mjs",
        "grid-item.d.ts",
        "wrap.mjs",
        "wrap.d.ts",
        "container.mjs",
        "container.d.ts",
        "divider.mjs",
        "divider.d.ts",
        "float.mjs",
        "float.d.ts",
        "bleed.mjs",
        "bleed.d.ts",
        "visually-hidden.mjs",
        "visually-hidden.d.ts",
        "cq.mjs",
        "cq.d.ts",
        "index.mjs",
        "index.d.ts",
        "index.mjs",
        "index.d.ts",
      ]
    `)
    expect(ids.some((f) => f.includes('factory.'))).toMatchInlineSnapshot(`false`)

    const jsxIndex = artifacts.find((a) => a.id === 'jsx-patterns-index')
    expect(jsxIndex?.files.map((f) => f.code?.includes('factory'))).toMatchInlineSnapshot(`
      [
        false,
        false,
      ]
    `)
  })

  test('no-cva', () => {
    const artifacts = removeFeatures({}, { features: ['no-cva'] })
    expect(artifacts.map((a) => a.dir?.at(-1))).toMatchInlineSnapshot(`
      [
        undefined,
        "tokens",
        "types",
        "types",
        "types",
        "types",
        "types",
        "types",
        "css",
        "css",
        "css",
        "recipes",
        "recipes",
        "recipes",
        "patterns",
        "patterns",
        "jsx",
        "jsx",
        "jsx",
        "jsx",
        "jsx",
        "css",
      ]
    `)

    const cssIndex = artifacts.find((a) => a.id === 'css-index')
    expect(cssIndex?.files.map((f) => f.code?.includes('cva'))).toMatchInlineSnapshot(`
      [
        false,
        false,
      ]
    `)
  })

  test('no-sva', () => {
    const artifacts = removeFeatures({}, { features: ['no-sva'] })
    expect(artifacts.map((a) => a.dir?.at(-1))).toMatchInlineSnapshot(`
      [
        undefined,
        "tokens",
        "types",
        "types",
        "types",
        "types",
        "types",
        "types",
        "css",
        "css",
        "css",
        "recipes",
        "recipes",
        "recipes",
        "patterns",
        "patterns",
        "jsx",
        "jsx",
        "jsx",
        "jsx",
        "jsx",
        "css",
      ]
    `)

    const cssIndex = artifacts.find((a) => a.id === 'css-index')
    expect(cssIndex?.files.map((f) => f.code?.includes('sva'))).toMatchInlineSnapshot(`
      [
        false,
        false,
      ]
    `)
  })
})

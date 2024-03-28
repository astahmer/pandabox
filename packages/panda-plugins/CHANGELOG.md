# @pandabox/panda-plugins

## 0.0.7

### Patch Changes

- 25fed76: Update to panda 0.36.1

## 0.0.6

### Patch Changes

- 91b4f3a: Add `@pandabox/presets` with `createUtopia`, see https://utopia.fyi/

  BREAKING: Update `@pandabox/postcss-plugins` `removeUnusedCssVars` API to directly return a postcss plugin

  Add `pluginRemoveUnusedCss` to `@pandabox/panda-plugins` that uses `@pandabox/postcss-plugins`

- Updated dependencies [91b4f3a]
  - @pandabox/postcss-plugins@0.0.2

## 0.0.5

### Patch Changes

- 3510541: new plugin - `restrict-styled-props` - Adds a `props` on the `styled` JSX Factory to restrict the props that can be
  passed to the component

## 0.0.4

### Patch Changes

- 10e72e0: Add `pluginMissingCssWarnings` - Logs a warning message when a CSS rule was used at runtime but couldn't be statically
  extracted
- 04032ec: Fix `strict-tokens-runtime` when using `shorthands: false` or `outExtension: js`

## 0.0.3

### Patch Changes

- b355420: Add `pluginStrictTokensRuntime` to throw at runtime when using arbitrary values with strictTokens

## 0.0.2

### Patch Changes

- 8471320: Add `pluginMinimalSetup` / `pluginStrictTokensScope` / `pluginRemoveFeatures` / `pluginRemoveNegativeSpacing`

  # @pandabox/panda-plugins

  - `strict-tokens-scope` - Enforce `strictTokens` only for a set of `TokenCategory` or style props
  - `remove-negative-spacing` - Removes negative spacing tokens
  - `remove-features` - Removes features from the `styled-system`
  - `minimal-setup` - Removes the built-in presets and allow removing features from the `styled-system`

  ## Installation

  ```bash
  pnpm add -D @pandabox/panda-plugins
  ```

  ## Usage

  ```tsx
  import { defineConfig } from "@pandacss/dev";
  import {
    pluginStrictTokensScope,
    pluginRemoveNegativeSpacing,
    pluginRemoveFeatures,
  } from "@pandabox/panda-plugins";

  export default defineConfig({
    // ...
    strictTokens: true,
    // can also be used together with
    // strictPropertyValues: true,
    //
    plugins: [
      pluginStrictTokensScope({ categories: ["colors", "spacing"] }),
      pluginRemoveFeatures({ features: ["no-jsx", "no-cva"] }),
      pluginRemoveNegativeSpacing({ spacingTokenType: true, tokenType: true }),
    ],
  });
  ```

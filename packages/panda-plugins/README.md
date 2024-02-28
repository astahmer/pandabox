# @pandabox/panda-plugins

- `missing-css-warnings` - Logs a warning message when a CSS rule was used at runtime but couldn't be statically
  extracted
- `strict-tokens-scope` - Enforce `strictTokens` only for a set of `TokenCategory` or style props
- `strict-tokens-runtime` - Enforce `strictTokens` at runtime, optionally scope this behaviour to a set of
  `TokenCategory` or style props
- `restrict-styled-props` - Adds a `props` on the `styled` JSX Factory to restrict the props that can be passed to the
  component
- `remove-negative-spacing` - Removes negative spacing tokens
- `remove-features` - Removes features from the `styled-system`
- `minimal-setup` - Removes the built-in presets and allow removing features from the `styled-system`

## Installation

```bash
pnpm add -D @pandabox/panda-plugins
```

## Usage

```tsx
import { defineConfig } from '@pandacss/dev'
import { pluginStrictTokensScope, pluginRemoveNegativeSpacing, pluginRemoveFeatures } from '@pandabox/panda-plugins'

export default defineConfig({
  // ...
  strictTokens: true,
  // can also be used together with
  // strictPropertyValues: true,
  //
  plugins: [
    pluginStrictTokensScope({ categories: ['colors', 'spacing'] }),
    pluginRemoveFeatures({ features: ['no-jsx', 'no-cva'] }),
    pluginRemoveNegativeSpacing({ spacingTokenType: true, tokenType: true }),
  ],
})
```

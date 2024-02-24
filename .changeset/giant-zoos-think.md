# @pandabox/panda-plugins

- `strict-tokens-scope` - Enforce `strictTokens` only for a set of `TokenCategory` or style props

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

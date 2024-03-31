# @pandabox

This will be the home for utilities around Panda CSS.

# @pandabox/prettier-plugin

Prettier plugin for Panda CSS.

Will sort style props based on your local `panda.config.ts`:

- in any Panda function like `css({ ... })` or `stack({ ... })`
- in the `css` prop of any JSX component
- etc...

## Installation

```bash
pnpm add -D prettier @pandabox/prettier-plugin
```

```json
{
  "plugins": ["@pandabox/prettier-plugin"]
}
```

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

# @pandabox/unplugin-panda-macro

Directly inline your `styled-system` functions and components results as class names (`atomic` or `grouped`)

```bash
pnpm i @pandabox/unplugin-panda-macro
```

From:

```tsx
import { css } from '../styled-system/css'

export const App = () => {
  return (
    <>
      <div
        className={css({
          display: 'flex',
          flexDirection: 'column',
          fontWeight: 'semibold',
          color: 'green.300',
          textAlign: 'center',
          textStyle: '4xl',
        })}
      >
        <span>Hello from Panda</span>
      </div>
      <styled.div
        display="flex"
        flexDirection="column"
        fontWeight="semibold"
        color="green.300"
        textAlign="center"
        textStyle="4xl"
        onClick={() => console.log('hello')}
        unresolvable={something}
      >
        <span>Hello from Panda</span>
      </styled.div>
    </>
  )
}
```

To (`atomic`):

```tsx
import { css } from '../styled-system/css'

export const App = () => {
  return (
    <>
      <div className={'d_flex flex_column font_semibold text_green.300 text_center textStyle_4xl'}>
        <span>Hello from Panda</span>
      </div>
      <div
        className="d_flex flex_column font_semibold text_green.300 text_center textStyle_4xl"
        onClick={() => console.log('hello')}
        unresolvable={something}
      >
        <span>Hello from Panda</span>
      </div>
    </>
  )
}
```

# @pandabox/utils

```bash
pnpm i @pandabox/utils
```

- `assignInlineVars`
- `cssVar`
- `wrapValue`

# @pandabox/postcss-plugins

```bash
pnpm i @pandabox/postcss-plugins
```

- `removeUnusedCssVars`
- `removeUnusedKeyframes`

## @pandabox/define-recipe

```bash
pnpm i @pandabox/define-recipe
```

The `defineRecipe` method will now return a `RecipeBuilder` object instead of a `RecipeConfig` object. The
`RecipeBuilder` object has the following methods:

- `extend`: add additional variants to or override variants of a recipe.

```ts
const button = defineRecipe({
  className: 'btn',
  variants: {
    variant: { primary: { color: 'red' } },
  },
}).extend({
  variant: {
    primary: { px: 2 },
    secondary: { color: 'blue' },
  },
})
```

resulting in:

```json
{
  "className": "btn",
  "variants": {
    "variant": {
      "primary": { "color": "red", "px": 2 },
      "secondary": { "color": "blue" }
    }
  }
}
```

More methods are available on the `RecipeBuilder` object, see the [README](./packages/define-recipe/README.md) for more

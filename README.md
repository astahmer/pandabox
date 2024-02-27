# @pandabox

This will be the home for utilities around Panda CSS.

# @pandabox/panda-plugins

- `missing-css-warnings` - Logs a warning message when a CSS rule was used at runtime but couldn't be statically
  extracted
- `strict-tokens-scope` - Enforce `strictTokens` only for a set of `TokenCategory` or style props
- `strict-tokens-runtime` - Enforce `strictTokens` at runtime, optionally scope this behaviour to a set of
  `TokenCategory` or style props
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

## @pandabox/define-theme

End to end type-safe theme definition (without any codegen step), so that the `panda.config.ts` can also benefit from
type-safety and token/conditions/utilities autocomplete.

```bash
pnpm i @pandabox/define-theme
```

## Usage

```ts
import { defineTheme } from '@pandabox/define-theme'

const t = defineTheme()

// Define tokens with the builder. TypeScript infers the structure.
const theme = t
  .conditions({
    hover: '&:is(:hover, [data-hover])',
    focus: '&:is(:focus, [data-focus])',
  })
  .breakpoints({
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  })
  .tokens({
    colors: {
      black: { value: '#000' },
      white: { value: '#fff' },
      rose: {
        50: { value: '#fff1f2' },
        100: { value: '#ffe4e6' },
        200: { value: '#fecdd3' },
      },
    },
    sizes: {
      sm: { value: '0.75rem' },
      md: { value: '1rem' },
      lg: { value: '1.25rem' },
    },
  })
  .semanticTokens({
    colors: {
      primary: { value: 'blue' },
      text: {
        DEFAULT: { value: 'xxx' },
        foreground: { value: 'xxx' },
        background: { value: 'xxx' },
        heading: {
          DEFAULT: { value: 'xxx' },
          value: { base: 'xxx', _osDark: 'xxx' },
          subheading: { value: 'xxx' },
        },
      },
    },
    sizes: {
      header: {
        value: { base: 'xxx', md: 'xxx', xl: 'xxx' },
      },
    },
    zIndex: {
      tooltip: { value: 'xxx' },
    },
  })
  .utilities({
    background: {
      shorthand: 'bg',
      className: 'bg',
      values: 'colors',
    },
    width: {
      shorthand: 'w',
      className: 'w',
      values: 'sizes',
    },
    height: {
      shorthand: 'h',
      className: 'h',
      values: 'sizes',
    },
    color: {
      className: 'text',
      values: 'colors',
    },
  })

const config = theme.build()

// Everything here will be typed, without any codegen
config.defineStyles({ bg: 'text.background', background: 'text.foreground' })
config.defineRecipe({
  className: 'aaa',
  base: {
    _hover: {
      color: 'text',
      sm: {
        _focus: {
          fontSize: '12px',
        },
      },
    },
    display: 'flex',
    background: 'text',
  },
  variants: {
    type: {
      success: {
        bg: 'rose.200',
        background: 'tex.',
      },
    },
  },
  defaultVariants: {
    type: 'success',
  },
})
```

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

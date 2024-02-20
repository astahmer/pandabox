# @pandabox/unplugin-panda-macro

Make your `styled-system` disappear at build-time by inlining the results as class names.

## Features

- [x] Zero runtime
- [x] Works with any panda.config
- [x] You don't need to use the Panda CLI or postcss plugin
- [x] Works with React/Solid
- [x] Automatically remove unused CSS variables/keyframes

## Supports

- [x] css `css({ ... })` / `css.raw({ ... })`
- [x] cva `const xxx = cva({ ... })`
- [x] recipes `button({ ... })`
- [x] JSX styled factory `styled.div({ ... })` / `styled('div', { ... })`
- [x] any function or JSX pattern like `box()` / `<Box />`, `stack()` / `<Stack />` etc

> ⚠️ Avoid [anything dynamic](https://panda-css.com/docs/guides/dynamic-styling) as usual, if not more, with Panda CSS
> due to static analysis limitations.

> ❌ [Runtime conditions](https://panda-css.com/docs/guides/dynamic-styling#runtime-conditions) will NOT be transformed

You can even choose to inline as `atomic` or `grouped` class names.

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

To (`grouped`):

```tsx
import { css } from '../styled-system/css'

export const App = () => {
  return (
    <>
      <div className={'gTAnXW'}>
        <span>Hello from Panda</span>
      </div>
      <div className="gTAnXW" onClick={() => console.log('hello')} unresolvable={something}>
        <span>Hello from Panda</span>
      </div>
    </>
  )
}
```

## Install

```bash
npm i @pandabox/unplugin-panda-macro
```

Plugin Options:

````ts
type PluginOptions = {
  /** @see https://panda-css.com/docs/references/config#cwd */
  cwd?: string
  /** @see https://panda-css.com/docs/references/cli#--config--c-1 */
  configPath?: string | undefined
  /**
   * @see https://www.npmjs.com/package/@rollup/pluginutils#include-and-exclude
   * @default `[/\.[cm]?[jt]sx?$/]`
   */
  include?: string | RegExp | (string | RegExp)[]
  /**
   * @see https://www.npmjs.com/package/@rollup/pluginutils#include-and-exclude
   * @default [/node_modules/]
   */
  exclude?: string | RegExp | (string | RegExp)[]
  /**
   * @example
   * ```ts
   * // `atomic`
   * const className = css({ display: "flex", flexDirection: "column", color: "red.300" })`
   * // -> `const className = 'd_flex flex_column text_red.300'`
   *
   * // `grouped`
   * const className = css({ display: "flex", flexDirection: "column", color: "red.300" })`
   * // -> `const className = 'hkogUJ'`
   * ```
   *
   * @default `'atomic'`
   */
  output?: 'atomic' | 'grouped'
  /**
   * Will remove unused CSS variables and keyframes from the generated CSS
   */
  optimizeCss?: boolean
  /**
   * Do not transform Panda recipes to `atomic` or `grouped` and instead keep their defaults BEM-like classes
   */
  keepRecipeClassNames?: boolean
  /**
   * Only transform macro imports
   * @example
   * ```ts
   * import { css } from '../styled-system/css' with { type: "macro" }
   *
   * const className = css({ display: "flex", flexDirection: "column", color: "red.300" })
   * // -> `const className = 'd_flex flex_column text_red.300'`
   * ```
   *
   */
  onlyMacroImports?: boolean
}
````

Then you can add this line `import 'virtual:panda.css'` somewhere in your app

> You don't need to use Panda CSS `postcss` plugin and you don't need to import the `styled-system/styles.css` either

<details>
<summary>Vite</summary><br>

```ts
// vite.config.ts
import panda from '@pandabox/unplugin-panda-macro/vite'

export default defineConfig({
  plugins: [
    panda({
      /* options */
    }),
  ],
})
```

Example: [`playground/`](./playground/)

<br></details>

<details>
<summary>Rollup</summary><br>

```ts
// rollup.config.js
import panda from '@pandabox/unplugin-panda-macro/rollup'

export default {
  plugins: [
    panda({
      /* options */
    }),
  ],
}
```

<br></details>

<details>
<summary>Webpack</summary><br>

```ts
// webpack.config.js
module.exports = {
  /* ... */
  plugins: [
    require('@pandabox/unplugin-panda-macro/webpack')({
      /* options */
    }),
  ],
}
```

<br></details>

<details>
<summary>Nuxt</summary><br>

```ts
// nuxt.config.js
export default defineNuxtConfig({
  modules: [
    [
      '@pandabox/unplugin-panda-macro/nuxt',
      {
        /* options */
      },
    ],
  ],
})
```

> This module works for both Nuxt 2 and [Nuxt Vite](https://github.com/nuxt/vite)

<br></details>

<details>
<summary>Vue CLI</summary><br>

```ts
// vue.config.js
module.exports = {
  configureWebpack: {
    plugins: [
      require('@pandabox/unplugin-panda-macro/webpack')({
        /* options */
      }),
    ],
  },
}
```

<br></details>

<details>
<summary>esbuild</summary><br>

```ts
// esbuild.config.js
import { build } from 'esbuild'
import panda from '@pandabox/unplugin-panda-macro/esbuild'

build({
  plugins: [panda()],
})
```

<br></details>

# Made with

[![NPM version](https://img.shields.io/npm/v/unplugin-panda?color=a1b858&label=)](https://www.npmjs.com/package/unplugin-panda)

Panda template for [unplugin](https://github.com/unjs/unplugin).

# @pandabox/unplugin-panda-macro

Directly inline your `styled-system` functions and components results as class names (`atomic` or `grouped`)

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
- [x] any JSX pattern like `<Box />`, `<Stack />` etc

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

<details>
<summary>Vite</summary><br>

```ts
// vite.config.ts
import panda from '@pandabox/unplugin-panda-macro/vite'

export default defineConfig({
  plugins: [
    Panda({
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
    Panda({
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
  plugins: [Panda()],
})
```

<br></details>

# Made with

[![NPM version](https://img.shields.io/npm/v/unplugin-panda?color=a1b858&label=)](https://www.npmjs.com/package/unplugin-panda)

Panda template for [unplugin](https://github.com/unjs/unplugin).

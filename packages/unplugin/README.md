# @pandabox/unplugin

Alternative distribution entrypoint for Panda CSS (other than the [CLI](https://panda-css.com/docs/installation/cli) and
[PostCSS plugin](https://panda-css.com/docs/installation/postcss)).

## Installation

```bash
npm i @pandabox/unplugin
```

## Usage

```ts
import { defineConfig } from 'vite'
import { unplugin } from '@pandabox/unplugin'

export default defineConfig({
  plugins: [
    unplugin.vite({
      /* options */
    }),
  ],
})
```

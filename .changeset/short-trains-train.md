---
'@pandabox/unplugin-panda-macro': patch
---

Allow only inlining macro imports

```ts
import { css } from '../styled-system/css' with { type: 'macro' }
//                                         ^^^^^^^^^^^^^^^^^^^^
// without this, the plugin will not transform the `css` usage

const className = css({ display: 'flex', flexDirection: 'column', color: 'red.300' })
// -> `const className = 'd_flex flex_column text_red.300'`
```

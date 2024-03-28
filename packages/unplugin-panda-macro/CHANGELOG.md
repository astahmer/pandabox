# @pandabox/unplugin-panda-macro

## 0.0.4

### Patch Changes

- 4af7ef7: Fix an issue where some unrelated components from Panda would be transformed due to having the same name as some Panda components (JSX Patterns like Stack)
- 25fed76: Update to panda 0.36.1

## 0.0.3

### Patch Changes

- Updated dependencies [91b4f3a]
  - @pandabox/postcss-plugins@0.0.2

## 0.0.2

### Patch Changes

- e99bf0e: Allow only inlining macro imports

  ```ts
  import { css } from "../styled-system/css" with { type: "macro" };
  //                                         ^^^^^^^^^^^^^^^^^^^^
  // without this, the plugin will not transform the `css` usage

  const className = css({
    display: "flex",
    flexDirection: "column",
    color: "red.300",
  });
  // -> `const className = 'd_flex flex_column text_red.300'`
  ```

## 0.0.1

### Patch Changes

- ed8bfb4: initial release
- Updated dependencies [ed8bfb4]
  - @pandabox/postcss-plugins@0.0.1

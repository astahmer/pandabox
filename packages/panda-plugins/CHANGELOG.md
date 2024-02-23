# @pandabox/panda-plugins

## 0.0.2

### Patch Changes

- 16d1d92: Initial release

  # @pandabox/panda-plugins

  - `strict-tokens-scoped` - Enforce `strictTokens` only for a set of `TokenCategory` or style props

  ## Installation

  ```bash
  pnpm add -D @pandabox/panda-plugins
  ```

  ## Usage

  ```tsx
  import { defineConfig } from "@pandacss/dev";
  import { createStrictTokensScope } from "@pandabox/panda-plugins";

  export default defineConfig({
    // ...
    strictTokens: true,
    // can also be used together with
    // strictPropertyValues: true,
    plugins: [createStrictTokensScope({ categories: ["colors"] })],
  });
  ```

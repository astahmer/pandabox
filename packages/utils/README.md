# @pandabox/utils

- `assignInlineVars` is like
  [the one from vanilla-extract](https://vanilla-extract.style/documentation/packages/dynamic/#assigninlinevars) but
  type-safe with typings using your own panda.config tokens
- `cssVar` allows creating creating css vars as JS objects so you can reference them in your panda config or at runtime
- `wrapValue` will wrap every objects inside the first argument with a { value: xxx }, mostly meant to easily migrate
  from a chakra theme tokens object to a panda.config tokens object

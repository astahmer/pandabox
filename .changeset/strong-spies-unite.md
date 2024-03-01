---
'@pandabox/postcss-plugins': patch
'@pandabox/panda-plugins': patch
'@pandabox/presets': patch
---

Add `@pandabox/presets` with `createUtopia`, see https://utopia.fyi/

BREAKING: Update `@pandabox/postcss-plugins` `removeUnusedCssVars` API to directly return a postcss plugin

Add `pluginRemoveUnusedCss` to `@pandabox/panda-plugins` that uses `@pandabox/postcss-plugins`

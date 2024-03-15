# @pandabox/prettier-plugin

## 0.1.0

### Minor Changes

- e404253: Better sorting for sva/defineSlotRecipe sorting + allow sorting custom functions using the `pandaFunctions` option

## 0.0.6

### Patch Changes

- 30e511c: Sort pattern specific properties that are bound to a CSS property

  ex: `stack` pattern (from `@pandacss/preset-base`) has a `direction` property bound to the `flexDirection`, it will be
  sorted near the `flexDirection` property.

  ***

  Fix an issue where some CSS properties were sorted after conditions due to not being tied to a utility (ex: `cursor`).
  -> Now if a property is not tied to a utility but is a valid CSS property, it will be sorted in the `Other` group.

  ***

  Change the default `pandaStylePropsFirst` and `pandaSortOtherProps` options to `false`.

  Change `pandaFirstProps` defaults to `['as', 'asChild', 'ref', 'className', 'layerStyle', 'textStyle']`.

## 0.0.5

### Patch Changes

- 31ea13e: feat(prettier): sort nested objects / cva / defineStyles / defineRecipe / defineSlotRecipes
- 771ff92: Set `cwd` to the config dirpath so that the plugin can resolve the config file when using `presets` from npm

## 0.0.4

### Patch Changes

- 91b4f3a: rename to `@pandabox/prettier-plugin` instead of `@pandabox/prettier-plugin-panda`

## 0.0.3

### Patch Changes

- c68aade: Add `pandaStylePropsFirst` / `pandaSortOtherProps` / `pandaGroupOrder` options

## 0.0.2

### Patch Changes

- 5e3d5cb: Fix CLI/VSCode usage & automatically detect / lazy load config by filepath (share context when possible)

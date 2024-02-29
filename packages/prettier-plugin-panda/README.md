# @pandabox/prettier-plugin-panda

Prettier plugin for Panda CSS.

Will sort style props based on your local `panda.config.ts`:
- in any Panda function like `css({ ... })` or `stack({ ... })`
- in the `css` prop of any JSX component

## Installation

```bash
pnpm add -D prettier @pandabox/prettier-plugin-panda
```

## Usage

```json
{
  "plugins": ["@pandabox/prettier-plugin-panda"],
  "pandaFirstProps": ["as", "layerStyle", "textStyle"],
  "pandaLastProps": [],
  "pandaOnlyComponents": false,
  "pandaOnlyIncluded": false,
  "pandaStylePropsFirst": true,
  "pandaSortOtherProps": true
}
```


## Sorting

The plugin will dynamically resolve your `panda.config.ts` file and sort the style properties based on your [`utilities`](https://panda-css.com/docs/customization/utilities) (keys and shorthands) and their associated `group`.

Each utility in the [`@pandacss/preset-base`](https://github.com/chakra-ui/panda/pull/2269/files) has a group name.

The [group names and their order](https://github.com/astahmer/pandakit/blob/5e3d5cb6c5bbed211c3bf608b69b307568cdff06/packages/prettier-plugin-panda/src/get-priority-index.ts#L7) are:

```ts
const groupNames = ['System', 'Container', 'Display', 'Visibility', 'Position', 'Transform', 'Flex Layout', 'Grid Layout', 'Layout', 'Border', 'Border Radius', 'Width', 'Height', 'Margin', 'Padding', 'Color', 'Typography', 'Background', 'Shadow', 'Table', 'List', 'Scroll', 'Interactivity', 'Transition', 'Effect', 'Other']
```

- [Conditions](https://panda-css.com/docs/concepts/conditional-styles) (`_hover`, `_dark`...) will be sorted after `Other` and are always sorted in the same order as in the generated CSS
- [Arbitrary conditions](https://panda-css.com/docs/concepts/conditional-styles#arbitrary-selectors) will be sorted after `Conditions`
- `Css` will be sorted after `Arbitrary conditions`, since the JSX `css` prop will override any other JSX style prop with JSX patterns / `styled` factory

Finally, other (non-style) props will be sorted alphabetically.

## Extending

You can extend the `utilities` in your `panda.config.ts` and bind (or re-bind an existing) them to a `group` name so that they will be sorted with the other utilities in that group.

```ts
export default defineConfig({
  utilities: {
    boxSize: {
      values: "sizes",
      group: "Width",
      transform: (value) => {
        return {
          width: value,
          height: value,
        }
      },
    },
  },
})

// will be sorted near the `width` prop
css({
  position: "relative",
  boxSize: "2xl",
  width: "100%",
  fontSize: "2xl",
})
```

## Options

### `pandaConfigPath`

The path to the panda config file.

### `pandaCwd`

The current working directory from which the config file will be searched for.

### `pandaFirstProps`

The first props to sort. Defaults to `['as', 'layerStyle', 'textStyle']`.

### `pandaLastProps`

The last props to sort. Defaults to `[]`.

### `pandaOnlyComponents`

Only sort props in known Panda components (JSX patterns and `<styled.xxx /> factory`). Defaults to `false`.

### `pandaOnlyIncluded`

Only sort props in files that are included in the config. Defaults to `false`.

### `pandaStylePropsFirst`

Whether to sort the style props before the component props. Defaults to `true`.

### `pandaSortOtherProps`

Whether to sort the other props alphabetically. Defaults to `true`.

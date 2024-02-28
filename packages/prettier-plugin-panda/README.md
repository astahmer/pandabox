# prettier-plugin-panda

## Installation

```bash
pnpm add -D prettier prettier-plugin-panda
```

## Usage

```json
{
  "plugins": ["prettier-plugin-panda"]
}
```

## Options

### `pandaConfigPath`

The path to the panda config file.

### `pandaCwd`

The current working directory from which the config file will be searched for.

### `firstProps`

The first props to sort. Defaults to `['as', 'layerStyle', 'textStyle']`.

### `lastProps`

The last props to sort. Defaults to `[]`.

### `isCompPropsBeforeStyleProps`

Whether to sort style props before component props. Defaults to `true`.

### `componentSpecificProps`

The component specific props to sort. Defaults to `undefined`.

## Example

```json
{
  "plugins": ["prettier-plugin-panda"],
  "overrides": [
    {
      "files": "*.{ts,tsx}",
      "options": {
        "pandaConfigPath": "./panda.config.ts",
        "pandaCwd": "./packages/my-package",
        "firstProps": ["as"],
        "lastProps": ["css"],
        "isCompPropsBeforeStyleProps": true
      }
    }
  ]
}
```

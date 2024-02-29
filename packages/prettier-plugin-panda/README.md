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

### `pandaFirstProps`

The first props to sort. Defaults to `['as', 'layerStyle', 'textStyle']`.

### `pandaLastProps`

The last props to sort. Defaults to `[]`.

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
        "pandaFirstProps": ["as"],
        "pandaLastProps": ["css"],
      }
    }
  ]
}
```

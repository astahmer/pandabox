# @pandabox/unplugin

## 0.2.2

### Patch Changes

- 9614ea0: Parse the `panda.buildinfo.json` files.

## 0.2.1

### Patch Changes

- 01d8b1d: Fix outfile build

## 0.2.0

### Minor Changes

- d86bc37: only HMR reload the stylesheet if it doesn't match the current CSS

## 0.1.7

### Patch Changes

- 580ef2c: Reduce update CSS calls
- 580ef2c: Avoid generating output file if no changes
- 580ef2c: Fix compatibility with Windows paths

## 0.1.6

### Patch Changes

- 7f21dee: minify output css
- 6c23093: throttle HMR updates

## 0.1.5

### Patch Changes

- 1baa877: hmr support for virtual module

## 0.1.4

### Patch Changes

- 7ab6b99: output a final css once all modules have been loaded by tapping into the generateBundle hook and updating the CSS source
  with parsed PandaContext which contains all loaded modules.

## 0.1.3

### Patch Changes

- 65d951a: Change `optimizeJs` default value to `macro` + fix HMR when using `outfile` option (and maybe for SSR ?)

## 0.1.2

### Patch Changes

- fdac578: fix: optimizeJs should be based off transformResult.code

## 0.1.1

### Patch Changes

- dfd87f9: - Add `onSourceFile` hook + provide PandaContext in hooks

  - Add `contextCreated` hook
  - Await hooks to allow for asynchronous operations

  Fix case where if the `transform` hook returns a different code than the original code but `optimizeJs` was disabled,
  the transformed code would not be returned

## 0.1.0

### Minor Changes

- c1b48fd: - Fix CSS generation when using `outfile`

  - Add `optimizeJs` option to optionally transform your source code by inlining the `css` / `cva` / `${patternFn}`
    resulting classNames or even simplify `styled` JSX factory to their primitive HTML tags (originally coming from
    `@pandabox/unplugin-panda-macro`)

    -> This is enabled by default and can be disabled by setting `optimizeJs` to `false` or `"macro"` (to only transform
    functions using `with { type: "macro" }`)

  - Transform `cva` to an optimized string-version of the `cva` function :

    -> Style objects are converted to class strings, this might not work when styles should be merged and you can opt-out
    of this by using `with { type: "runtime" }` on your `cva` import or by setting `optimizeJs` to false (or `macro` to
    only transform functions using `with { type: "macro" }`)

  - Add e2e tests (in-browser + HMR)

## 0.0.2

### Patch Changes

- 25fed76: Update to panda 0.36.1

## 0.0.1

### Patch Changes

- de44963: fix(unplugin): use peerDependencies & fix config change HMR

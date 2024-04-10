# @pandabox/unplugin

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

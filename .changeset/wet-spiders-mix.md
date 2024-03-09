---
'@pandabox/prettier-plugin': patch
---

Sort pattern specific properties that are bound to a CSS property

ex: `stack` pattern (from `@pandacss/preset-base`) has a `direction` property bound to the `flexDirection`, it will be
sorted near the `flexDirection` property.

---

Fix an issue where some CSS properties were sorted after conditions due to not being tied to a utility (ex: `cursor`).
-> Now if a property is not tied to a utility but is a valid CSS property, it will be sorted in the `Other` group.

---

Change the default `pandaStylePropsFirst` and `pandaSortOtherProps` options to `false`.

Change `pandaFirstProps` defaults to `['as', 'asChild', 'ref', 'className', 'layerStyle', 'textStyle']`.

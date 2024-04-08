---
'@pandabox/unplugin': patch
---

- Add `onSourceFile` hook + provide PandaContext in hooks
- Add `contextCreated` hook
- Await hooks to allow for asynchronous operations

Fix case where if the `transform` hook returns a different code than the original code but `optimizeJs` was disabled,
the transformed code would not be returned

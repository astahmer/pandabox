---
'@pandabox/unplugin': patch
---

output a final css once all modules have been loaded by tapping into the generateBundle hook and updating the CSS source
with parsed PandaContext which contains all loaded modules.

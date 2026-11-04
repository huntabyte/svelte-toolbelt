---
"svelte-toolbelt": patch
---

fix(mergeProps): keep an event handler as-is instead of wrapping it when a later props object passes a non-function value (e.g. `onclick: undefined`)

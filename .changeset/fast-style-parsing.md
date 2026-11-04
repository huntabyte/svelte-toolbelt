---
"svelte-toolbelt": patch
---

perf: parse simple inline style strings without `style-to-object` and cache property-name conversions, speeding up `mergeProps` style merging, `cssToStyleObj` and `styleToString`

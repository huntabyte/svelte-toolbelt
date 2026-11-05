---
"svelte-toolbelt": minor
---

breaking: raise the minimum supported Svelte version to 5.31.0. Since 0.12.0, `simpleBox` uses `$state` in a class constructor, which only compiles on Svelte 5.31.0 and up, so 0.12.0 failed to compile on Svelte 5.30.x despite declaring `^5.30.2` as its peer range. The `svelte` peer dependency is now `^5.31.0`.

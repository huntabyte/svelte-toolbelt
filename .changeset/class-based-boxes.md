---
"svelte-toolbelt": minor
---

perf: make `boxWith` and `simpleBox` much cheaper to create by backing them with classes. Read-only `boxWith` no longer allocates an unused `$derived`, and no box allocates per-instance getter/setter closures.

**Behavior change:** `current` and the `BoxSymbol`/`isWritableSymbol` markers now live on the box's prototype instead of being own properties. `isBox`, `isWritableBox`, `box.from`, `box.flatten`, `box.readonly` and `attachRef` are unaffected (they check markers with `in`), but code that inspects own properties of boxes created by `boxWith`, `simpleBox` or `box.readonly` will see a difference: `{ ...box }`, `Object.keys(box)`, `Object.getOwnPropertySymbols(box)` and `JSON.stringify(box)` no longer include `current` or the markers. Use `isBox`/`isWritableBox` and the exported `BoxSymbol`/`isWritableSymbol` instead of sniffing own symbols.

Released as a minor (not a patch) because of that observable change: in 0.x, a minor isn't picked up automatically by `^0.11.x` ranges, so consumers opt in.

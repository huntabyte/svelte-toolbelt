# svelte-toolbelt

## 0.12.0

### Minor Changes

- perf: make `boxWith` and `simpleBox` much cheaper to create by backing them with classes. Read-only `boxWith` no longer allocates an unused `$derived`, and no box allocates per-instance getter/setter closures. ([#91](https://github.com/huntabyte/svelte-toolbelt/pull/91))

  **Behavior change:** `current` and the `BoxSymbol`/`isWritableSymbol` markers now live on the box's prototype instead of being own properties. `isBox`, `isWritableBox`, `box.from`, `box.flatten`, `box.readonly` and `attachRef` are unaffected (they check markers with `in`), but code that inspects own properties of boxes created by `boxWith`, `simpleBox` or `box.readonly` will see a difference: `{ ...box }`, `Object.keys(box)`, `Object.getOwnPropertySymbols(box)` and `JSON.stringify(box)` no longer include `current` or the markers. Use `isBox`/`isWritableBox` and the exported `BoxSymbol`/`isWritableSymbol` instead of sniffing own symbols.

  Released as a minor (not a patch) because of that observable change: in 0.x, a minor isn't picked up automatically by `^0.11.x` ranges, so consumers opt in.

## 0.11.0

### Minor Changes

- feat: export the `BoxSymbol` and `isWritableSymbol` box markers from the package entry so custom box implementations can be recognised by `isBox`/`isWritableBox` ([#89](https://github.com/huntabyte/svelte-toolbelt/pull/89))

## 0.10.7

### Patch Changes

- fix: omit nullish and empty values in styleToCSS ([#83](https://github.com/huntabyte/svelte-toolbelt/pull/83))

- perf: parse simple inline style strings without `style-to-object` and cache property-name conversions, speeding up `mergeProps` style merging, `cssToStyleObj` and `styleToString` ([#87](https://github.com/huntabyte/svelte-toolbelt/pull/87))

- fix(mergeProps): keep an event handler as-is instead of wrapping it when a later props object passes a non-function value (e.g. `onclick: undefined`) ([#85](https://github.com/huntabyte/svelte-toolbelt/pull/85))

## 0.10.6

### Patch Changes

- chore: update runed ([#80](https://github.com/huntabyte/svelte-toolbelt/pull/80))

## 0.10.5

### Patch Changes

- change exports strategy ([#78](https://github.com/huntabyte/svelte-toolbelt/pull/78))

## 0.10.4

### Patch Changes

- fix(mergeProps): allow other `hidden` attributes like `until-found` ([#76](https://github.com/huntabyte/svelte-toolbelt/pull/76))

## 0.10.3

### Patch Changes

- perf: optimize ([#74](https://github.com/huntabyte/svelte-toolbelt/pull/74))

## 0.10.2

### Patch Changes

- fix: side effects ([#72](https://github.com/huntabyte/svelte-toolbelt/pull/72))

## 0.10.1

### Patch Changes

- perf: export sr-only styles from separate file ([#70](https://github.com/huntabyte/svelte-toolbelt/pull/70))

## 0.10.0

### Minor Changes

- expose individual box utils as standalone functions ([#68](https://github.com/huntabyte/svelte-toolbelt/pull/68))

## 0.9.3

### Patch Changes

- chore: update runed ([#67](https://github.com/huntabyte/svelte-toolbelt/pull/67))

- fix: add `defaults` export ([#65](https://github.com/huntabyte/svelte-toolbelt/pull/65))

## 0.9.2

### Patch Changes

- fix: `attachRef` setting reference values to null when node is still in DOM ([#63](https://github.com/huntabyte/svelte-toolbelt/pull/63))

## 0.9.1

### Patch Changes

- feat: setTimeout/clearTimeout on DOMContext ([#55](https://github.com/huntabyte/svelte-toolbelt/pull/55))

## 0.9.0

### Minor Changes

- feat: dom-context utils ([#53](https://github.com/huntabyte/svelte-toolbelt/pull/53))

## 0.8.2

### Patch Changes

- fix(attachRef): untrack `onChange` handler ([#51](https://github.com/huntabyte/svelte-toolbelt/pull/51))

## 0.8.1

### Patch Changes

- improve: add optional change handler arg to `attachRef` ([#49](https://github.com/huntabyte/svelte-toolbelt/pull/49))

## 0.8.0

### Minor Changes

- chore: update minimum svelte peer dep to attachments version ([#47](https://github.com/huntabyte/svelte-toolbelt/pull/47))

- feat: `attachRef` attachment helper to replace `useRefById` ([#47](https://github.com/huntabyte/svelte-toolbelt/pull/47))

## 0.7.1

### Patch Changes

- update dependencies ([#42](https://github.com/huntabyte/svelte-toolbelt/pull/42))

## 0.7.0

### Minor Changes

- `EnvironmentState` utils ([#40](https://github.com/huntabyte/svelte-toolbelt/pull/40))

## 0.6.1

### Patch Changes

- adjust `useRefById` internals ([#38](https://github.com/huntabyte/svelte-toolbelt/pull/38))

## 0.6.0

### Minor Changes

- add `env` utils ([#36](https://github.com/huntabyte/svelte-toolbelt/pull/36))

## 0.5.0

### Minor Changes

- add `onMountEffect` util which has the same behavior as `onMount` ([#33](https://github.com/huntabyte/svelte-toolbelt/pull/33))

- add `useOnChange` hook to react to changes to reactive state ([#33](https://github.com/huntabyte/svelte-toolbelt/pull/33))

### Patch Changes

- return result of `setTimeout` from `afterSleep` ([#33](https://github.com/huntabyte/svelte-toolbelt/pull/33))

- fix: allow use of any clsx `ClassValue` types for `class` property ([#33](https://github.com/huntabyte/svelte-toolbelt/pull/33))

- fix: issue with `mergeProps` where styles in second argument wouldn't be merged ([#33](https://github.com/huntabyte/svelte-toolbelt/pull/33))

## 0.4.6

### Patch Changes

- hotfix: document check ([#29](https://github.com/huntabyte/svelte-toolbelt/pull/29))

## 0.4.5

### Patch Changes

- feat: shadow dom support ([#27](https://github.com/huntabyte/svelte-toolbelt/pull/27))

## 0.4.4

### Patch Changes

- fix: dependencies ([#25](https://github.com/huntabyte/svelte-toolbelt/pull/25))

## 0.4.3

### Patch Changes

- support node 18 for stackblitz ;? ([#22](https://github.com/huntabyte/svelte-toolbelt/pull/22))

## 0.4.2

### Patch Changes

- fix: useRefById dependencies ([#20](https://github.com/huntabyte/svelte-toolbelt/pull/20))

## 0.4.1

### Patch Changes

- fix: exports ([#18](https://github.com/huntabyte/svelte-toolbelt/pull/18))

## 0.4.0

### Minor Changes

- feat: add additional utils ([#16](https://github.com/huntabyte/svelte-toolbelt/pull/16))

## 0.3.1

### Patch Changes

- chore: update svelte ([#14](https://github.com/huntabyte/svelte-toolbelt/pull/14))

## 0.3.0

### Minor Changes

- Expose new helper methods commonly used in libraries ([#11](https://github.com/huntabyte/svelte-toolbelt/pull/11))

- useRefById ([#11](https://github.com/huntabyte/svelte-toolbelt/pull/11))

## 0.2.0

### Minor Changes

- Expose new helper methods commonly used in libraries ([#9](https://github.com/huntabyte/svelte-toolbelt/pull/9))

## 0.1.0

### Minor Changes

- breaking change: change box `.value` to `.current` ([#5](https://github.com/huntabyte/svelte-toolbelt/pull/5))

- breaking: value -> current ([#6](https://github.com/huntabyte/svelte-toolbelt/pull/6))

## 0.0.2

### Patch Changes

- fix: actually export box ([#3](https://github.com/huntabyte/svelte-toolbelt/pull/3))

## 0.0.1

### Patch Changes

- initial release ([#1](https://github.com/huntabyte/svelte-toolbelt/pull/1))

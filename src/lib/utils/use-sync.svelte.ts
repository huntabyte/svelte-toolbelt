import { untrack } from "svelte";
import type { Getter } from "svelte-toolbelt";

/**
 * Simple helper function to sync a read-only dependency with writable state. This only syncs
 * in one direction, from the dependency to the state. If you need to sync both directions, you
 * should use the `box.with(() => dep, (v) => (dep = v))` pattern.
 *
 * @param getDep - A getter that returns the value that may change and whose new value should be synced via the `setDep` function.
 * @param onChange - A function that accepts a new value to keep other state in sync with the dependency.
 */
export function useSync<T>(getDep: Getter<T>, onChange: (value: T) => void) {
	const dep = $derived(getDep());
	$effect(() => {
		dep;
		untrack(() => onChange(dep));
	});
}

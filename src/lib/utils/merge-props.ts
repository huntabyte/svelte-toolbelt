/**
 * Modified from https://github.com/adobe/react-spectrum/blob/main/packages/%40react-aria/utils/src/mergeProps.ts (see NOTICE.txt for source)
 */
import { clsx } from "clsx";
import type { EventCallback } from "./events.js";
import { composeHandlers } from "./compose-handlers.js";
import { cssToStyleObj } from "./css-to-style-obj.js";
import { executeCallbacks } from "$lib/utils/execute-callbacks.js";
import { styleToString } from "$lib/utils/style.js";
import type { StyleProperties } from "$lib/types.js";

type Props = Record<string, unknown>;

type PropsArg = Props | null | undefined;

// Source: https://stackoverflow.com/questions/51603250/typescript-3-parameter-list-intersection-type/51604379#51604379
type TupleTypes<T> = { [P in keyof T]: T[P] } extends { [key: number]: infer V }
	? NullToObject<V>
	: never;

type NullToObject<T> = T extends null | undefined ? {} : T;
// eslint-disable-next-line ts/no-explicit-any
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void
	? I
	: never;

function isEventHandler(key: string): boolean {
	// we check if the 3rd character is uppercase to avoid merging our own
	// custom callbacks like `onValueChange` and strictly merge native event handlers
	return key.length > 2 && key.startsWith("on") && key[2] === key[2]?.toLowerCase();
}

/**
 * Given a list of prop objects, merges them into a single object.
 * - Automatically composes event handlers (e.g. `onclick`, `oninput`, etc.)
 * - Chains regular functions with the same name so they are called in order
 * - Merges class strings with `clsx`
 * - Merges style objects and converts them to strings
 * - Handles a bug with Svelte where setting the `hidden` attribute to `false` doesn't remove it
 * - Overrides other values with the last one
 */
export function mergeProps<T extends PropsArg[]>(
	...args: T
): UnionToIntersection<TupleTypes<T>> & {
	style?: string;
} {
	const result: Props = { ...args[0] };

	for (let i = 1; i < args.length; i++) {
		const props = args[i];
		for (const key in props) {
			const a = result[key];
			const b = props[key];

			const aIsFunction = typeof a === "function";
			const bIsFunction = typeof b === "function";

			// compose event handlers
			if (aIsFunction && typeof bIsFunction && isEventHandler(key)) {
				// handle merging of event handlers
				const aHandler = a as EventCallback;
				const bHandler = b as EventCallback;
				result[key] = composeHandlers(aHandler, bHandler);
			} else if (aIsFunction && bIsFunction) {
				// chain non-event handler functions
				result[key] = executeCallbacks(a, b);
			} else if (key === "class" && typeof a === "string" && typeof b === "string") {
				// handle merging class strings
				result[key] = clsx(a, b);
			} else if (key === "style") {
				const aIsObject = typeof a === "object";
				const bIsObject = typeof b === "object";
				const aIsString = typeof a === "string";
				const bIsString = typeof b === "string";
				if (aIsObject && bIsObject) {
					// both are style objects, merge them
					result[key] = { ...a, ...b };
				} else if (aIsObject && bIsString) {
					// a is style object, b is string, convert b to style object and merge
					const parsedStyle = cssToStyleObj(b);
					result[key] = { ...a, ...parsedStyle };
				} else if (aIsString && bIsObject) {
					// a is string, b is style object, convert a to style object and merge
					const parsedStyle = cssToStyleObj(a);
					result[key] = { ...parsedStyle, ...b };
				} else if (aIsString && bIsString) {
					// both are strings, convert both to objects and merge
					const parsedStyleA = cssToStyleObj(a);
					const parsedStyleB = cssToStyleObj(b);
					result[key] = { ...parsedStyleA, ...parsedStyleB };
				} else if (aIsObject) {
					result[key] = a;
				} else if (bIsObject) {
					result[key] = b;
				}
			} else {
				// override other values
				result[key] = b !== undefined ? b : a;
			}
		}
	}

	// convert style object to string
	if (typeof result.style === "object") {
		result.style = styleToString(result.style as StyleProperties).replaceAll("\n", " ");
	}

	// handle weird svelte bug where `hidden` is not removed when set to `false`
	if (result.hidden !== true) {
		result.hidden = undefined;
	}

	// handle weird svelte bug where `disabled` is not removed when set to `false`
	if (result.disabled !== true) {
		result.disabled = undefined;
	}

	return result as UnionToIntersection<TupleTypes<T>> & { style?: string };
}

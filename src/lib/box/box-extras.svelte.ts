import type { Getter, MaybeBoxOrGetter } from "$lib/types.js";
import { isFunction, isObject } from "$lib/utils/is.js";

/**
 * The marker `isBox` checks for. Set it (to `true`) on custom box implementations,
 * either on the object or its prototype, so they're recognised as boxes.
 */
export const BoxSymbol = Symbol("box");
/**
 * The marker `isWritableBox` checks for (alongside {@link BoxSymbol}). Set it (to `true`)
 * on custom writable box implementations, either on the object or its prototype.
 */
export const isWritableSymbol = Symbol("is-writable");

export type ReadableBox<T> = {
	readonly [BoxSymbol]: true;
	readonly current: T;
};

export type WritableBox<T> = ReadableBox<T> & {
	readonly [isWritableSymbol]: true;
	current: T;
};

/**
 * Creates a readonly box
 *
 * @param getter Function to get the value of the box
 * @returns A box with a `current` property whose value is the result of the getter.
 * Useful to pass state to other functions.
 *
 * @see {@link https://runed.dev/docs/functions/box}
 */
function boxWith<T>(getter: () => T): ReadableBox<T>;
/**
 * Creates a writable box
 *
 * @param getter Function to get the value of the box
 * @param setter Function to set the value of the box
 * @returns A box with a `current` property which can be set to a new value.
 * Useful to pass state to other functions.
 *
 * @see {@link https://runed.dev/docs/functions/box}
 */
function boxWith<T>(getter: () => T, setter: (v: T) => void): WritableBox<T>;
function boxWith<T>(getter: () => T, setter?: (v: T) => void): ReadableBox<T> | WritableBox<T> {
	// the markers are on the prototype, which TypeScript can't see
	return (setter
		? new WritableGetterBox(getter, setter)
		: new ReadonlyGetterBox(getter)) as unknown as WritableBox<T>;
}

// Boxes are classes so `current` and the markers live on a shared prototype: creating
// one is a single allocation with no per-instance closures. bits-ui creates thousands.
// Getters/setters are called through a local so they don't receive the box as `this`.

class ReadonlyGetterBox<T> {
	readonly #getter: () => T;
	constructor(getter: () => T) {
		this.#getter = getter;
	}
	get current() {
		const getter = this.#getter;
		return getter();
	}
}
Object.defineProperty(ReadonlyGetterBox.prototype, BoxSymbol, { value: true });

class WritableGetterBox<T> {
	readonly #getter: () => T;
	readonly #setter: (v: T) => void;
	readonly #derived = $derived.by(() => {
		const getter = this.#getter;
		return getter();
	});
	constructor(getter: () => T, setter: (v: T) => void) {
		this.#getter = getter;
		this.#setter = setter;
	}
	get current() {
		return this.#derived;
	}
	set current(v: T) {
		const setter = this.#setter;
		setter(v);
	}
}
Object.defineProperty(WritableGetterBox.prototype, BoxSymbol, { value: true });
Object.defineProperty(WritableGetterBox.prototype, isWritableSymbol, { value: true });

class StateBox<T> {
	current: T;
	constructor(initialValue: T) {
		// assigning `$state` in the constructor creates the source directly, rather than
		// creating an empty one and then running it through the setter
		this.current = $state(initialValue);
	}
}
Object.defineProperty(StateBox.prototype, BoxSymbol, { value: true });
Object.defineProperty(StateBox.prototype, isWritableSymbol, { value: true });

/**
 * @returns Whether the value is a Box
 *
 * @see {@link https://runed.dev/docs/functions/box}
 */
function isBox(value: unknown): value is ReadableBox<unknown> {
	return isObject(value) && BoxSymbol in value;
}
/**
 * @returns Whether the value is a WritableBox
 *
 * @see {@link https://runed.dev/docs/functions/box}
 */
function isWritableBox(value: unknown): value is WritableBox<unknown> {
	return isBox(value) && isWritableSymbol in value;
}

/**
 * Creates a box from either a static value, a box, or a getter function.
 * Useful when you want to receive any of these types of values and generate a boxed version of it.
 *
 * @returns A box with a `current` property whose value.
 *
 * @see {@link https://runed.dev/docs/functions/box}
 */
function boxFrom<T>(value: T | WritableBox<T>): WritableBox<T>;
function boxFrom<T>(value: ReadableBox<T>): ReadableBox<T>;
function boxFrom<T>(value: Getter<T>): ReadableBox<T>;
function boxFrom<T>(value: MaybeBoxOrGetter<T>): ReadableBox<T>;
function boxFrom<T>(value: T): WritableBox<T>;
function boxFrom<T>(value: MaybeBoxOrGetter<T>) {
	if (isBox(value)) return value;
	if (isFunction(value)) return boxWith(value);
	return simpleBox(value);
}

type GetKeys<T, U> = {
	[K in keyof T]: T[K] extends U ? K : never;
}[keyof T];
type RemoveValues<T, U> = Omit<T, GetKeys<T, U>>;

type BoxFlatten<R extends Record<string, unknown>> = Expand<
	RemoveValues<
		{
			[K in keyof R]: R[K] extends WritableBox<infer T> ? T : never;
		},
		never
	> &
		RemoveValues<
			{
				readonly [K in keyof R]: R[K] extends WritableBox<infer _>
					? never
					: R[K] extends ReadableBox<infer T>
						? T
						: never;
			},
			never
		>
> &
	RemoveValues<
		{
			[K in keyof R]: R[K] extends ReadableBox<infer _> ? never : R[K];
		},
		never
	>;

/**
 * Function that gets an object of boxes, and returns an object of reactive values
 *
 * @example
 * const count = box(0)
 * const flat = box.flatten({ count, double: box.with(() => count.current) })
 * // type of flat is { count: number, readonly double: number }
 *
 * @see {@link https://runed.dev/docs/functions/box}
 */
function boxFlatten<R extends Record<string, unknown>>(boxes: R): BoxFlatten<R> {
	return Object.entries(boxes).reduce<BoxFlatten<R>>((acc, [key, b]) => {
		if (!isBox(b)) {
			return Object.assign(acc, { [key]: b });
		}

		if (isWritableBox(b)) {
			Object.defineProperty(acc, key, {
				get() {
					return b.current;
				},
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				set(v: any) {
					b.current = v;
				}
			});
		} else {
			Object.defineProperty(acc, key, {
				get() {
					return b.current;
				}
			});
		}

		return acc;
	}, {} as BoxFlatten<R>);
}

/**
 * Function that converts a box to a readonly box.
 *
 * @example
 * const count = box(0) // WritableBox<number>
 * const countReadonly = box.readonly(count) // ReadableBox<number>
 *
 * @see {@link https://runed.dev/docs/functions/box}
 */
function toReadonlyBox<T>(b: ReadableBox<T>): ReadableBox<T> {
	if (!isWritableBox(b)) return b;

	return boxWith(() => b.current);
}

/**
 * Creates a writable box.
 *
 * @returns A box with a `current` property which can be set to a new value.
 * Useful to pass state to other functions.
 *
 * @see {@link https://runed.dev/docs/functions/box}
 */
function simpleBox<T>(): WritableBox<T | undefined>;
/**
 * Creates a writable box with an initial value.
 *
 * @param initialValue The initial value of the box.
 * @returns A box with a `current` property which can be set to a new value.
 * Useful to pass state to other functions.
 *
 * @see {@link https://runed.dev/docs/functions/box}
 */
function simpleBox<T>(initialValue: T): WritableBox<T>;
function simpleBox(initialValue?: unknown) {
	return new StateBox(initialValue);
}

export { boxWith, isBox, isWritableBox, boxFrom, boxFlatten, toReadonlyBox, simpleBox };

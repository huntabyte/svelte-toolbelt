import { describe, expect, test } from "vitest";
import {
	boxFlatten,
	boxWith,
	isBox,
	isWritableBox,
	simpleBox,
	toReadonlyBox
} from "./box-extras.svelte.js";

describe("boxWith (read-only)", () => {
	test("calls the getter on every read instead of memoizing", () => {
		let calls = 0;
		const b = boxWith(() => ++calls);
		expect(b.current).toBe(1);
		expect(b.current).toBe(2);
		expect(calls).toBe(2);
	});

	test("does not call the getter with the box as `this`", () => {
		const receivers: unknown[] = [];
		const b = boxWith(function (this: unknown) {
			receivers.push(this);
			return 1;
		});
		void b.current;
		expect(receivers).toEqual([undefined]);
	});

	test("cannot be set", () => {
		const b = boxWith(() => 0);
		// @ts-expect-error -- read-only box
		expect(() => (b.current = 1)).toThrow();
	});

	test("is a box but not writable", () => {
		const b = boxWith(() => 0);
		expect(isBox(b)).toBe(true);
		expect(isWritableBox(b)).toBe(false);
	});
});

describe("boxWith (writable)", () => {
	test("reads through the getter and writes through the setter", () => {
		let value = $state(1);
		const b = boxWith(
			() => value,
			(v) => (value = v)
		);
		expect(b.current).toBe(1);
		value = 2;
		expect(b.current).toBe(2);
		b.current = 3;
		expect(value).toBe(3);
		expect(b.current).toBe(3);
	});

	test("does not call the setter with the box as `this`", () => {
		const receivers: unknown[] = [];
		const b = boxWith(
			() => 0,
			function (this: unknown) {
				receivers.push(this);
			}
		);
		b.current = 1;
		expect(receivers).toEqual([undefined]);
	});

	test("is a writable box", () => {
		const b = boxWith(
			() => 0,
			() => {}
		);
		expect(isBox(b)).toBe(true);
		expect(isWritableBox(b)).toBe(true);
	});
});

describe("simpleBox", () => {
	test("holds and updates a value", () => {
		const b = simpleBox(0);
		expect(b.current).toBe(0);
		b.current = 1;
		expect(b.current).toBe(1);
	});

	test("defaults to undefined", () => {
		expect(simpleBox().current).toBeUndefined();
	});

	test("is deeply reactive for objects and arrays", () => {
		const obj = simpleBox({ count: 0 });
		const arr = simpleBox([1]);
		const count = $derived(obj.current.count);
		const length = $derived(arr.current.length);
		expect(count).toBe(0);
		expect(length).toBe(1);
		obj.current.count++;
		arr.current.push(2);
		expect(count).toBe(1);
		expect(length).toBe(2);

		// values assigned later are proxied too
		obj.current = { count: 5 };
		obj.current.count++;
		expect(count).toBe(6);
	});

	test("is a writable box", () => {
		const b = simpleBox(0);
		expect(isBox(b)).toBe(true);
		expect(isWritableBox(b)).toBe(true);
	});
});

describe("helpers on class-based boxes", () => {
	test("toReadonlyBox", () => {
		const b = simpleBox(0);
		const ro = toReadonlyBox(b);
		expect(isBox(ro)).toBe(true);
		expect(isWritableBox(ro)).toBe(false);
		b.current = 1;
		expect(ro.current).toBe(1);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		expect(() => ((ro as any).current = 2)).toThrow();

		const already = boxWith(() => 0);
		expect(toReadonlyBox(already)).toBe(already);
	});

	test("boxFlatten", () => {
		let value = $state(0);
		const state = simpleBox(1);
		const writable = boxWith(
			() => value,
			(v) => (value = v)
		);
		const readonly = boxWith(() => state.current * 2);
		const flat = boxFlatten({ state, writable, readonly, plain: "x" });

		expect(flat).toMatchObject({ state: 1, writable: 0, readonly: 2, plain: "x" });
		flat.state = 2;
		flat.writable = 3;
		expect(state.current).toBe(2);
		expect(value).toBe(3);
		expect(flat.readonly).toBe(4);
		// @ts-expect-error -- read-only key
		expect(() => (flat.readonly = 0)).toThrow();
	});
});

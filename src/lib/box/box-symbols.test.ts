import { describe, expect, test } from "vitest";
import { BoxSymbol, isBox, isWritableBox, isWritableSymbol } from "$lib/index.js";

describe("box marker symbols", () => {
	test("objects carrying the markers are boxes", () => {
		expect(isBox({ [BoxSymbol]: true, current: 1 })).toBe(true);
		expect(isWritableBox({ [BoxSymbol]: true, current: 1 })).toBe(false);
		expect(isWritableBox({ [BoxSymbol]: true, [isWritableSymbol]: true, current: 1 })).toBe(true);
	});

	test("markers on a class prototype are recognised", () => {
		class ReadBox {
			constructor(public current: number) {}
		}
		Object.defineProperty(ReadBox.prototype, BoxSymbol, { value: true });
		class WriteBox extends ReadBox {}
		Object.defineProperty(WriteBox.prototype, isWritableSymbol, { value: true });

		expect(isBox(new ReadBox(1))).toBe(true);
		expect(isWritableBox(new ReadBox(1))).toBe(false);
		expect(isBox(new WriteBox(1))).toBe(true);
		expect(isWritableBox(new WriteBox(1))).toBe(true);
	});
});

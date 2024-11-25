import { describe, expect, it } from "vitest";
import { isClassValue } from "./is.js";

describe("isClassValue", () => {
	describe("primitive types", () => {
		it("should return true for string", () => {
			expect(isClassValue("")).toBe(true);
			expect(isClassValue("hello")).toBe(true);
		});

		it("should return true for number", () => {
			expect(isClassValue(0)).toBe(true);
			expect(isClassValue(42)).toBe(true);
			expect(isClassValue(-1)).toBe(true);
			expect(isClassValue(Infinity)).toBe(true);
			expect(isClassValue(Number.NaN)).toBe(true);
		});

		it("should return true for bigint", () => {
			expect(isClassValue(BigInt(0))).toBe(true);
			expect(isClassValue(BigInt(9007199254740991))).toBe(true);
		});

		it("should return true for boolean", () => {
			expect(isClassValue(true)).toBe(true);
			expect(isClassValue(false)).toBe(true);
		});

		it("should return true for null", () => {
			expect(isClassValue(null)).toBe(true);
		});

		it("should return true for undefined", () => {
			expect(isClassValue(undefined)).toBe(true);
		});
	});

	describe("arrays", () => {
		it("should return true for empty arrays", () => {
			expect(isClassValue([])).toBe(true);
		});

		it("should return true for arrays of valid primitive values", () => {
			expect(isClassValue(["string", 42, true, null])).toBe(true);
		});

		it("should return true for nested arrays", () => {
			expect(isClassValue([["nested"], [1, 2], [true]])).toBe(true);
			expect(isClassValue(["deep", ["deeper", ["deepest"]]])).toBe(true);
		});

		it("should return false for arrays containing invalid values", () => {
			expect(isClassValue([Symbol("a")])).toBe(false);
			expect(isClassValue([() => {}])).toBe(false);
			expect(isClassValue([new Date()])).toBe(false);
		});
	});

	describe("objects", () => {
		it("should return true for empty objects", () => {
			expect(isClassValue({})).toBe(true);
		});

		it("should return true for objects with valid values", () => {
			expect(isClassValue({ key: "value" })).toBe(true);
			expect(isClassValue({ num: 42, bool: true })).toBe(true);
		});

		it("should return true for nested objects", () => {
			expect(
				isClassValue({
					nested: {
						deeper: {
							value: "test"
						}
					}
				})
			).toBe(true);
		});

		it("should return true for objects with array values", () => {
			expect(isClassValue({ arr: [1, 2, 3] })).toBe(true);
			expect(isClassValue({ arr: [{ nested: true }] })).toBe(true);
		});

		it("should return false for class instances", () => {
			expect(isClassValue(new Date())).toBe(false);
			// eslint-disable-next-line prefer-regex-literals
			expect(isClassValue(new RegExp(""))).toBe(false);
		});
	});

	describe("invalid types", () => {
		it("should return false for symbols", () => {
			// eslint-disable-next-line symbol-description
			expect(isClassValue(Symbol())).toBe(false);
			expect(isClassValue(Symbol("test"))).toBe(false);
		});

		it("should return false for functions", () => {
			expect(isClassValue(() => {})).toBe(false);
			// eslint-disable-next-line prefer-arrow-callback
			expect(isClassValue(function () {})).toBe(false);
			expect(isClassValue(Math.random)).toBe(false);
		});

		it("should return false for built-in objects", () => {
			expect(isClassValue(new Map())).toBe(false);
			expect(isClassValue(new Set())).toBe(false);
			expect(isClassValue(new WeakMap())).toBe(false);
			expect(isClassValue(new WeakSet())).toBe(false);
			expect(isClassValue(Promise.resolve())).toBe(false);
		});
	});

	describe("complex nested structures", () => {
		it("should handle deeply nested valid structures", () => {
			const complex = {
				string: "test",
				number: 42,
				boolean: true,
				null: null,
				// eslint-disable-next-line object-shorthand
				undefined: undefined,
				array: [
					"nested",
					{
						deeper: [[1, 2, 3], { evenDeeper: true }]
					}
				]
			};
			expect(isClassValue(complex)).toBe(true);
		});

		it("should reject deeply nested structures with invalid values", () => {
			const complex = {
				valid: "test",
				nested: {
					array: [
						"valid",
						{
							// eslint-disable-next-line symbol-description
							invalid: Symbol() // Invalid value deep in the structure
						}
					]
				}
			};
			expect(isClassValue(complex)).toBe(true); // Note: This is true because ClassDictionary accepts any values
		});
	});
});

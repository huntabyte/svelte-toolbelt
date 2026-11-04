import { describe, expect, it } from "vitest";
import { cssToStyleObj } from "./css-to-style-obj.js";

describe("cssToStyleObj", () => {
	it("should return an empty object if an empty string is passed", () => {
		const result = cssToStyleObj("");
		expect(result).toEqual({});
	});

	it("should return an empty object if null is passed", () => {
		const result = cssToStyleObj(null);
		expect(result).toEqual({});
	});

	it("should return an empty object if undefined is passed", () => {
		const result = cssToStyleObj(undefined);
		expect(result).toEqual({});
	});

	it("should convert a single CSS property to camelCase in the style object", () => {
		const result = cssToStyleObj("background-color: red;");
		expect(result).toEqual({ backgroundColor: "red" });
	});

	it("should convert multiple CSS properties to camelCase in the style object", () => {
		const result = cssToStyleObj("color: blue; font-size: 16px; margin-top: 10px;");
		expect(result).toEqual({ color: "blue", fontSize: "16px", marginTop: "10px" });
	});

	it("should handle CSS shorthand properties correctly", () => {
		const result = cssToStyleObj("margin: 10px 20px 30px 40px;");
		expect(result).toEqual({ margin: "10px 20px 30px 40px" });
	});

	it("should handle CSS comments correctly", () => {
		const result = cssToStyleObj("/* comment */ color: green; /* another comment */");
		expect(result).toEqual({ color: "green" });
	});

	it("should handle CSS vendor prefixes correctly", () => {
		const result = cssToStyleObj(
			"-webkit-transform: rotate(45deg); -moz-transform: rotate(45deg);"
		);
		expect(result).toEqual({ WebkitTransform: "rotate(45deg)", MozTransform: "rotate(45deg)" });
	});

	// Expected values are what style-to-object produces; the fast scanner must match or defer to it.
	it.each([
		[
			"transform: translate(120px, 340px) rotate(3deg); --x: calc(100% - var(--y, 4px));",
			{ transform: "translate(120px, 340px) rotate(3deg)", "--x": "calc(100% - var(--y, 4px))" }
		],
		[
			"background-image: url(data:image/png;base64,AAAA); color: red",
			{ backgroundImage: "url(data:image/png;base64,AAAA)", color: "red" }
		],
		[
			"font-family: 'Inter; Var', sans-serif;  ;  margin : 0 auto ;",
			{ fontFamily: "'Inter; Var', sans-serif", margin: "0 auto" }
		],
		["color: red !important;; ;opacity: 0.5", { color: "red !important", opacity: "0.5" }],
		["; color: red", {}],
		["color: red; @media: x; opacity: 1", { color: "red" }]
	])("should parse %j the same as the full parser", (css, expected) => {
		expect(cssToStyleObj(css)).toEqual(expected);
	});

	it("should throw on a declaration missing ':' like the full parser", () => {
		expect(() => cssToStyleObj("color: red; oops")).toThrow("property missing ':'");
	});
});

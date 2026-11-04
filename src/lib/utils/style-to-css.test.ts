import { describe, expect, it } from "vitest";
import { styleToCSS } from "./style-to-css.js";

describe("styleToCSS", () => {
	it("should omit nullish and empty values", () => {
		expect(styleToCSS({ color: undefined, top: null, width: "", left: "0" })).toBe("left: 0;");
	});

	it("should keep falsy values that are valid CSS", () => {
		expect(styleToCSS({ opacity: 0, zIndex: 0 })).toBe("opacity: 0;\nz-index: 0;");
	});

	it("should return an empty string when every value is omitted", () => {
		expect(styleToCSS({ color: undefined })).toBe("");
	});
});

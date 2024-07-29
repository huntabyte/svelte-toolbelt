import styleToCSS from "style-object-to-css-string";
import type { StyleProperties } from "$lib/types.js";

export function styleToString(style: StyleProperties = {}): string {
	return styleToCSS(style).replace("\n", " ");
}

import { styleToCSS } from "./style-to-css.js";
import type { StyleProperties } from "$lib/types.js";

export function styleToString(style: StyleProperties = {}): string {
	return styleToCSS(style).replace("\n", " ");
}

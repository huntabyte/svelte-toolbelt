import { styleToCSS } from "./style-to-css.js";
import type { StyleProperties } from "$lib/types.js";

export function styleToString(style: StyleProperties = {}): string {
	return styleToCSS(style).replace("\n", " ");
}

export const srOnlyStyles: StyleProperties = {
	position: "absolute",
	width: "1px",
	height: "1px",
	padding: "0",
	margin: "-1px",
	overflow: "hidden",
	clip: "rect(0, 0, 0, 0)",
	whiteSpace: "nowrap",
	borderWidth: "0",
	transform: "translateX(-100%)"
};

export const srOnlyStylesString = styleToString(srOnlyStyles);

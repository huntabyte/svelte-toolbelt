import parse from "style-to-object";
import { camelCase, pascalCase } from "./strings.js";
import type { StyleProperties } from "$lib/types.js";

export function cssToStyleObj(css: string | null | undefined): StyleProperties {
	if (!css) return {};
	const styleObj: Record<string, unknown> = {};

	function iterator(name: string, value: string) {
		if (
			name.startsWith("-moz-") ||
			name.startsWith("-webkit-") ||
			name.startsWith("-ms-") ||
			name.startsWith("-o-")
		) {
			styleObj[pascalCase(name)] = value;
			return;
		}
		if (name.startsWith("--")) {
			styleObj[name] = value;
			return;
		}
		styleObj[camelCase(name)] = value;
	}

	parse(css, iterator);

	return styleObj;
}

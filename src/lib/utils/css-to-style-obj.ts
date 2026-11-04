import parse from "style-to-object";
import { camelCase, pascalCase } from "./strings.js";
import type { StyleProperties } from "$lib/types.js";

// ponytail: cleared when full; bounded because custom property names can be dynamic.
const CACHE_LIMIT = 1000;
const styleKeyCache = new Map<string, string>();

function toStyleKey(name: string): string {
	let key = styleKeyCache.get(name);
	if (key !== undefined) return key;
	if (
		name.startsWith("-moz-") ||
		name.startsWith("-webkit-") ||
		name.startsWith("-ms-") ||
		name.startsWith("-o-")
	) {
		key = pascalCase(name);
	} else if (name.startsWith("--")) {
		key = name;
	} else {
		key = camelCase(name);
	}
	if (styleKeyCache.size >= CACHE_LIMIT) styleKeyCache.clear();
	styleKeyCache.set(name, key);
	return key;
}

// Anything here can make inline-style-parser split or reject declarations in ways the fast scanner doesn't model.
const NEEDS_FULL_PARSER = /["'\\{}]|\/\*/;
const SIMPLE_PROPERTY = /^[-\w]+$/;

/**
 * Splits simple inline styles (`a: b; c: d(e, f)`) into a flat `[name, value, ...]` list.
 * Returns `null` for anything where the result could differ from `style-to-object`, so the caller
 * can fall back to it.
 */
function scanSimpleStyle(css: string): string[] | null {
	if (NEEDS_FULL_PARSER.test(css)) return null;
	const out: string[] = [];
	let depth = 0;
	let start = 0;
	let colon = -1;
	for (let i = 0; i <= css.length; i++) {
		const c = i < css.length ? css.charCodeAt(i) : 59; /* ; */
		if (c === 40 /* ( */) depth++;
		else if (c === 41 /* ) */) {
			if (--depth < 0) return null;
		} else if (c === 58 /* : */) {
			if (colon < 0) colon = i;
		} else if (c === 59 /* ; */) {
			if (depth !== 0) return null;
			const segment = css.slice(start, i);
			if (colon < 0) {
				// empty segments are skipped after a declaration, but stop the full parser before the first one
				if (segment.trim() || out.length === 0) return null;
			} else {
				const name = css.slice(start, colon).trim();
				const value = css.slice(colon + 1, i).trim();
				if (!SIMPLE_PROPERTY.test(name) || !value) return null;
				out.push(name, value);
			}
			start = i + 1;
			colon = -1;
		}
	}
	return out;
}

/**
 * Parses an inline style string into `target`, using the same keys as `cssToStyleObj`.
 * Later declarations overwrite earlier ones, keeping the first one's position.
 */
export function parseStyleInto(target: Record<string, unknown>, css: string): void {
	const pairs = scanSimpleStyle(css);
	if (pairs) {
		for (let i = 0; i < pairs.length; i += 2) target[toStyleKey(pairs[i]!)] = pairs[i + 1];
		return;
	}
	parse(css, (name, value) => {
		target[toStyleKey(name)] = value;
	});
}

export function cssToStyleObj(css: string | null | undefined): StyleProperties {
	if (!css) return {};
	const styleObj: Record<string, unknown> = {};
	parseStyleInto(styleObj, css);
	return styleObj;
}

function createParser(matcher: string | RegExp, replacer: (match: string) => string) {
	const regex = RegExp(matcher, "g");
	return (str: string): string => {
		// throw an error if not a string
		if (typeof str !== "string") {
			throw new TypeError(`expected an argument of type string, but got ${typeof str}`);
		}

		// if no match between string and matcher
		if (!str.match(regex)) return str;

		// executes the replacer function for each match
		return str.replace(regex, replacer);
	};
}

const camelToKebabUncached = createParser(/[A-Z]/, (match) => `-${match.toLowerCase()}`);

// ponytail: cleared when full; bounded because custom property names can be dynamic.
const kebabCache = new Map<string, string>();
function camelToKebab(property: string): string {
	let kebab = kebabCache.get(property);
	if (kebab === undefined) {
		kebab = camelToKebabUncached(property);
		if (kebabCache.size >= 1000) kebabCache.clear();
		kebabCache.set(property, kebab);
	}
	return kebab;
}

export function styleToCSS(styleObj: object) {
	if (!styleObj || typeof styleObj !== "object" || Array.isArray(styleObj)) {
		throw new TypeError(`expected an argument of type object, but got ${typeof styleObj}`);
	}
	return Object.keys(styleObj)
		.map((property) => `${camelToKebab(property)}: ${styleObj[property as keyof typeof styleObj]};`)
		.join("\n");
}

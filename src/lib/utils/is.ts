import type { ClassValue } from "clsx";

export function isFunction(value: unknown): value is (...args: unknown[]) => unknown {
	return typeof value === "function";
}

export function isObject(value: unknown): value is Record<PropertyKey, unknown> {
	return value !== null && typeof value === "object";
}

const CLASS_VALUE_PRIMITIVE_TYPES = ["string", "number", "bigint", "boolean"];

export function isClassValue(value: unknown): value is ClassValue {
	// handle primitive types
	if (value === null || value === undefined) return true;
	if (CLASS_VALUE_PRIMITIVE_TYPES.includes(typeof value)) return true;

	// handle arrays (ClassArray)
	if (Array.isArray(value)) return value.every((item) => isClassValue(item));

	// handle objects (ClassDictionary)
	if (typeof value === "object") {
		// ensure it's a plain object and not some other object type
		if (Object.getPrototypeOf(value) !== Object.prototype) return false;
		return true;
	}

	return false;
}

const ELEMENT_NODE: typeof Node.ELEMENT_NODE = 1;
const DOCUMENT_NODE: typeof Node.DOCUMENT_NODE = 9;
const DOCUMENT_FRAGMENT_NODE: typeof Node.DOCUMENT_FRAGMENT_NODE = 11;

export function isHTMLElement(v: unknown): v is HTMLElement {
	return isObject(v) && v.nodeType === ELEMENT_NODE && typeof v.nodeName === "string";
}

export function isDocument(v: unknown): v is Document {
	return isObject(v) && v.nodeType === DOCUMENT_NODE;
}

export function isWindow(v: unknown): v is Window {
	return isObject(v) && v === v.window;
}

export function getNodeName(node: Node | Window): string {
	if (isHTMLElement(node)) return node.localName || "";
	return "#document";
}

export function isRootElement(node: Node): boolean {
	return ["html", "body", "#document"].includes(getNodeName(node));
}

export function isNode(v: unknown): v is Node {
	return isObject(v) && v.nodeType !== undefined;
}

export function isShadowRoot(v: unknown): v is ShadowRoot {
	return isNode(v) && v.nodeType === DOCUMENT_FRAGMENT_NODE && "host" in v;
}

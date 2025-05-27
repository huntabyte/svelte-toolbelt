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

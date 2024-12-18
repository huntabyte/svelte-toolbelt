import { isDocument, isHTMLElement, isShadowRoot, isWindow } from "./is.js";

type NodeType = Element | Window | Node | Document | null | undefined;

export function getDocument(node: NodeType) {
	if (isDocument(node)) return node;
	if (isWindow(node)) return node.document;
	return node?.ownerDocument ?? document;
}

export function getDocumentElement(node: NodeType): HTMLElement {
	return getDocument(node).documentElement;
}

export function getWindow(node: Node | ShadowRoot | Document | null | undefined) {
	if (isShadowRoot(node)) return getWindow(node.host);
	if (isDocument(node)) return node.defaultView ?? window;
	if (isHTMLElement(node)) return node.ownerDocument?.defaultView ?? window;
	return window;
}

export function getActiveElement(rootNode: Document | ShadowRoot): HTMLElement | null {
	let activeElement = rootNode.activeElement as HTMLElement | null;

	while (activeElement?.shadowRoot) {
		const node = activeElement.shadowRoot.activeElement as HTMLElement | null;
		if (node === activeElement) break;
		else activeElement = node;
	}

	return activeElement;
}

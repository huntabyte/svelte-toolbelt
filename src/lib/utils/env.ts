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

export type EnvironmentStateProps = {
	getRootNode?: () => Document | ShadowRoot | Node;
};

export class EnvironmentState {
	constructor(readonly props: EnvironmentStateProps = {}) {}

	getRootNode() {
		return (this.props?.getRootNode?.() ?? document) as Document | ShadowRoot;
	}

	getDoc() {
		return getDocument(this.getRootNode());
	}

	getWin() {
		return this.getDoc().defaultView ?? window;
	}

	getActiveElement() {
		return getActiveElement(this.getRootNode());
	}

	isActiveElement(node: HTMLElement | null | undefined) {
		return node === this.getActiveElement();
	}

	getById<T extends Element = HTMLElement>(id: string) {
		return this.getRootNode().getElementById(id) as T | null;
	}
}

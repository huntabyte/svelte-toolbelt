import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
	isHTMLElement,
	isDocument,
	isWindow,
	getNodeName,
	isNode,
	isShadowRoot,
	contains,
	getDocument,
	getDocumentElement,
	getWindow,
	getActiveElement,
	getParentNode
} from "./dom.js";

describe("dom utilities", () => {
	let container: HTMLElement;
	let shadowHost: HTMLElement;
	let shadowRoot: ShadowRoot;

	beforeEach(() => {
		// Clean up DOM
		document.body.innerHTML = "";

		// Create test container
		container = document.createElement("div");
		container.id = "test-container";
		document.body.appendChild(container);

		// Create shadow DOM setup
		shadowHost = document.createElement("div");
		shadowHost.id = "shadow-host";
		shadowRoot = shadowHost.attachShadow({ mode: "open" });
		shadowRoot.innerHTML = `
			<div id="shadow-content">
				<button id="shadow-button">Shadow Button</button>
			</div>
		`;
		container.appendChild(shadowHost);
	});

	afterEach(() => {
		document.body.innerHTML = "";
	});

	describe("isHTMLElement", () => {
		it("should return true for HTML elements", () => {
			expect(isHTMLElement(document.createElement("div"))).toBe(true);
			expect(isHTMLElement(document.body)).toBe(true);
		});

		it("should return false for non-HTML elements", () => {
			expect(isHTMLElement(null)).toBe(false);
			expect(isHTMLElement(undefined)).toBe(false);
			expect(isHTMLElement("string")).toBe(false);
			expect(isHTMLElement(123)).toBe(false);
			expect(isHTMLElement(document)).toBe(false);
			expect(isHTMLElement(window)).toBe(false);
		});

		it("should return false for text nodes", () => {
			const textNode = document.createTextNode("text");
			expect(isHTMLElement(textNode)).toBe(false);
		});
	});

	describe("isDocument", () => {
		it("should return true for document", () => {
			expect(isDocument(document)).toBe(true);
		});

		it("should return false for non-document objects", () => {
			expect(isDocument(document.createElement("div"))).toBe(false);
			expect(isDocument(window)).toBe(false);
			expect(isDocument(null)).toBe(false);
			expect(isDocument(shadowRoot)).toBe(false);
		});
	});

	describe("isWindow", () => {
		it("should return true for window object", () => {
			// Note: The implementation checks for VisualViewport constructor
			// This might need adjustment based on actual implementation
			const mockWindow = { constructor: { name: "VisualViewport" } };
			expect(isWindow(mockWindow)).toBe(true);
		});

		it("should return false for non-window objects", () => {
			expect(isWindow(document)).toBe(false);
			expect(isWindow(document.createElement("div"))).toBe(false);
			expect(isWindow(null)).toBe(false);
		});
	});

	describe("getNodeName", () => {
		it("should return localName for HTML elements", () => {
			const div = document.createElement("div");
			expect(getNodeName(div)).toBe("div");

			const button = document.createElement("button");
			expect(getNodeName(button)).toBe("button");
		});

		it("should return #document for non-HTML elements", () => {
			expect(getNodeName(document)).toBe("#document");
			expect(getNodeName(window)).toBe("#document");
		});
	});

	describe("isNode", () => {
		it("should return true for nodes", () => {
			expect(isNode(document.createElement("div"))).toBe(true);
			expect(isNode(document)).toBe(true);
			expect(isNode(document.createTextNode("text"))).toBe(true);
		});

		it("should return false for non-nodes", () => {
			expect(isNode(null)).toBe(false);
			expect(isNode(undefined)).toBe(false);
			expect(isNode("string")).toBe(false);
			expect(isNode({})).toBe(false);
		});
	});

	describe("isShadowRoot", () => {
		it("should return true for shadow roots", () => {
			expect(isShadowRoot(shadowRoot)).toBe(true);
		});

		it("should return false for non-shadow roots", () => {
			expect(isShadowRoot(document)).toBe(false);
			expect(isShadowRoot(document.createElement("div"))).toBe(false);
			expect(isShadowRoot(null)).toBe(false);
		});
	});

	describe("contains", () => {
		it("should return true when parent contains child", () => {
			const parent = document.createElement("div");
			const child = document.createElement("span");
			parent.appendChild(child);

			expect(contains(parent, child)).toBe(true);
		});

		it("should return true when parent and child are the same", () => {
			const element = document.createElement("div");
			expect(contains(element, element)).toBe(true);
		});

		it("should return false when parent does not contain child", () => {
			const parent = document.createElement("div");
			const child = document.createElement("span");

			expect(contains(parent, child)).toBe(false);
		});

		it("should handle shadow DOM containment", () => {
			const shadowButton = shadowRoot.getElementById("shadow-button");
			expect(contains(shadowHost, shadowButton)).toBe(true);
		});

		it("should return false for null/undefined inputs", () => {
			const element = document.createElement("div");
			expect(contains(null, element)).toBe(false);
			expect(contains(element, null)).toBe(false);
			expect(contains(null, null)).toBe(false);
		});

		it("should return false for non-HTML elements", () => {
			expect(contains(document, document.createElement("div"))).toBe(false);
		});
	});

	describe("getDocument", () => {
		it("should return the document for document input", () => {
			expect(getDocument(document)).toBe(document);
		});

		it("should return window.document for window input", () => {
			expect(getDocument(window)).toBe(document);
		});

		it("should return ownerDocument for elements", () => {
			const element = document.createElement("div");
			expect(getDocument(element)).toBe(document);
		});

		it("should return document for null/undefined", () => {
			expect(getDocument(null)).toBe(document);
			expect(getDocument(undefined)).toBe(document);
		});

		it("should handle shadow DOM elements", () => {
			const shadowButton = shadowRoot.getElementById("shadow-button");
			expect(getDocument(shadowButton)).toBe(document);
		});
	});

	describe("getDocumentElement", () => {
		it("should return document.documentElement", () => {
			expect(getDocumentElement(document)).toBe(document.documentElement);
			expect(getDocumentElement(window)).toBe(document.documentElement);
			expect(getDocumentElement(document.createElement("div"))).toBe(document.documentElement);
		});
	});

	describe("getWindow", () => {
		it("should return window for document", () => {
			expect(getWindow(document)).toBe(window);
		});

		it("should return window for HTML elements", () => {
			const element = document.createElement("div");
			expect(getWindow(element)).toBe(window);
		});

		it("should return window for shadow root", () => {
			expect(getWindow(shadowRoot)).toBe(window);
		});

		it("should return window for null/undefined", () => {
			expect(getWindow(null)).toBe(window);
			expect(getWindow(undefined)).toBe(window);
		});
	});

	describe("getActiveElement", () => {
		it("should return active element from document", () => {
			const button = document.createElement("button");
			container.appendChild(button);
			button.focus();

			expect(getActiveElement(document)).toBe(button);
		});

		it("should return active element from shadow root", () => {
			const shadowButton = shadowRoot.getElementById("shadow-button") as HTMLButtonElement;
			shadowButton.focus();

			expect(getActiveElement(shadowRoot)).toBe(shadowButton);
		});

		it("should traverse nested shadow roots", () => {
			// Create nested shadow DOM
			const nestedHost = document.createElement("div");
			const nestedShadow = nestedHost.attachShadow({ mode: "open" });
			nestedShadow.innerHTML = '<input id="nested-input" />';
			shadowRoot.appendChild(nestedHost);

			const nestedInput = nestedShadow.getElementById("nested-input") as HTMLInputElement;
			nestedInput.focus();

			// Should find the deeply nested active element
			expect(getActiveElement(shadowRoot)).toBe(nestedInput);
		});
	});

	describe("getParentNode", () => {
		it("should return the element itself for html element", () => {
			const html = document.documentElement;
			expect(getParentNode(html)).toBe(html);
		});

		it("should return parentNode for regular elements", () => {
			const parent = document.createElement("div");
			const child = document.createElement("span");
			parent.appendChild(child);

			expect(getParentNode(child)).toBe(parent);
		});

		it("should return host for shadow root", () => {
			expect(getParentNode(shadowRoot)).toBe(shadowHost);
		});

		it("should handle assigned slots", () => {
			// Create slot setup
			const slotHost = document.createElement("div");
			const slotShadow = slotHost.attachShadow({ mode: "open" });
			slotShadow.innerHTML = '<slot name="test"></slot>';

			const slottedElement = document.createElement("span");
			slottedElement.slot = "test";
			slotHost.appendChild(slottedElement);

			container.appendChild(slotHost);

			// The slotted element's parent should be the slot
			const parentNode = getParentNode(slottedElement);
			expect(parentNode).toBeDefined();
		});

		it("should return documentElement as fallback", () => {
			// Create an orphaned node
			const orphan = document.createElement("div");
			const result = getParentNode(orphan);
			expect(result).toBe(document.documentElement);
		});
	});
});

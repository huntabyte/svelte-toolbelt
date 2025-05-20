import { box, type WritableBox } from "../box/box.svelte.js";
import { createAttachmentKey } from "svelte/attachments";

type RefSetter<T> = (v: T) => void;

/**
 * Creates a Svelte Attachment that attaches a DOM element to a ref.
 * The ref can be either a WritableBox or a callback function.
 *
 * @param ref - Either a WritableBox to store the element in, or a callback function that receives the element
 * @param onChange - Optional callback that fires when the ref changes
 * @returns An object with a spreadable attachment key that should be spread onto the element
 *
 * @example
 * // Using with WritableBox
 * const ref = box<HTMLDivElement | null>(null);
 * <div {...attachRef(ref)}>Content</div>
 *
 * @example
 * // Using with callback
 * <div {...attachRef((node) => myNode = node)}>Content</div>
 *
 * @example
 * // Using with onChange
 * <div {...attachRef(ref, (node) => console.log(node))}>Content</div>
 */
export function attachRef<T extends EventTarget = Element>(
	ref: WritableBox<T | null> | RefSetter<T | null>,
	onChange?: (v: T | null) => void
) {
	return {
		[createAttachmentKey()]: (node: T) => {
			if (box.isBox(ref)) {
				ref.current = node;
				onChange?.(node);
				return () => {
					ref.current = null;
					onChange?.(null);
				};
			}
			ref(node);
			onChange?.(node);
			return () => {
				ref(null);
				onChange?.(null);
			};
		}
	};
}

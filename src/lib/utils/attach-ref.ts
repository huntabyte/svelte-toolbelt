import { box, type WritableBox } from "../box/box.svelte.js";
import { createAttachmentKey } from "svelte/attachments";

type RefSetter<T> = (v: T) => void;

export function attachRef<T extends EventTarget = Element>(
	ref: WritableBox<T | null> | RefSetter<T | null>
) {
	return {
		[createAttachmentKey()]: (node: T) => {
			if (box.isBox(ref)) {
				ref.current = node;
				return () => (ref.current = null);
			}
			ref(node);
			return () => ref(null);
		}
	};
}

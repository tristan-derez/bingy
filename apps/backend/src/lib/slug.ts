import { nanoid } from "nanoid";
import * as emoji from "node-emoji";
import slugify from "slugify";

const options = {
	lower: true,
	strict: true,
	trim: true,
};

export function createSlug(text: string, prefix = "item"): string {
	const emojiConverted = emoji.unemojify(text);
	const base = slugify(emojiConverted, options);

	if (base.length === 0) {
		return `${prefix}-${nanoid(8)}`;
	}

	return base;
}

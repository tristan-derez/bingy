import { nanoid } from "nanoid";
import slugify from "slugify";

const options = {
	lower: true,
	strict: true,
	trim: true,
};

export function createSlug(text: string, prefix = "item"): string {
	// @todo: add node-emoji to get the string corresponding to an emoji
	const base = slugify(text, options);

	if (base.length === 0) {
		return `${prefix}-${nanoid(8)}`;
	}

	return base;
}

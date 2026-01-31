import { nanoid } from "nanoid";
import slugify from "slugify";

const options = {
	lower: true,
	strict: true,
	trim: true,
};

export function createSlug(text: string, prefix = "item"): string {
	const base = slugify(text, options);

	if (base.length === 0) {
		return `${prefix}-${nanoid(8)}`;
	}

	return base;
}

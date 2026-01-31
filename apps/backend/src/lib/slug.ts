import { nanoid } from "nanoid";
import slugify from "slugify";

const options = {
	lower: true,
	strict: true,
	trim: true,
};

export function createSlug(text: string): string {
	const base = slugify(text, options);

	if (base.length === 0) {
		return `list-${nanoid(8)}`;
	}

	return base;
}

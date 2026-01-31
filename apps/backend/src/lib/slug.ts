import { nanoid } from "nanoid";
import slugify from "slugify";

const options = {
	lower: true,
	strict: true,
	trim: true,
};

export function createSlug(text: string): string {
	const base = slugify(text, options) || "list";
	return `${base}-${nanoid(8)}`;
}

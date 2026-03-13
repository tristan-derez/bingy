export const getNumberOrNull = (value: string) =>
	value ? Number(value) : null;

export type ImageSize = "w200" | "w500" | "original";

export const getTmdbImageUrl = (
	path: string | null,
	size: ImageSize = "original",
): string | null => {
	if (!path) return null;
	return `https://image.tmdb.org/t/p/${size}${path}`;
};

export const capitalize = (str: string) =>
	str.charAt(0).toUpperCase() + str.slice(1);

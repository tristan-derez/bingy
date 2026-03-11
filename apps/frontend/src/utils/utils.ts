export const getNumberOrNull = (value: string) =>
	value ? Number(value) : null;

type ImageSize = "w200" | "w500" | "original";

export const getTmdbImageUrl = (
	path: string | null,
	size: ImageSize = "original",
): string | null => {
	if (!path) return null;
	return `https://image.tmdb.org/t/p/${size}${path}`;
};

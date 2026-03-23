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

export function isOwnProfile(
	sessionUsername: string | null | undefined,
	urlUsername: string | null | undefined,
): boolean {
	if (!sessionUsername || !urlUsername) {
		return false;
	}
	return sessionUsername.toLowerCase() === urlUsername.toLowerCase();
}

export const isMacOS = () => {
	return navigator.userAgent.indexOf("Mac") > -1;
};

export const getMediaProps = (
	mediaType: "movie" | "tv",
	id: number,
	title: string,
	posterPath: string | null,
	releaseDate: string,
) => {
	return mediaType === "movie"
		? {
				movie: {
					mediaType,
					id,
					title,
					posterPath,
					releaseDate,
				},
			}
		: {
				tvShow: {
					mediaType,
					id,
					name: title,
					posterPath,
					releaseDate,
				},
			};
};

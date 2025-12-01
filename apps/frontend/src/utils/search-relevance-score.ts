import type { Schemas } from "shared";

export const getRelevanceScore = (
	item: Schemas.MediaMulti,
	searchQuery: string,
): number => {
	const lowerQuery = searchQuery.toLowerCase().trim();

	if (item.media_type === "person") {
		const name = item.name?.toLowerCase() ?? "";
		const popularity = item.popularity ?? 0;

		if (name.startsWith(lowerQuery)) return 5000 + popularity;
		if (name.includes(lowerQuery)) return 2000 + popularity;
		return popularity;
	}

	if (item.media_type === "movie") {
		const movie = item as Schemas.MovieMedia;
		const title = movie.title?.toLowerCase() ?? "";
		const originalTitle = movie.original_title?.toLowerCase() ?? "";
		const baseScore =
			(movie.vote_average ?? 0) * Math.log10((movie.vote_count ?? 0) + 10);

		if (title.startsWith(lowerQuery) || originalTitle.startsWith(lowerQuery))
			return 5000 + baseScore;
		if (title.includes(lowerQuery) || originalTitle.includes(lowerQuery))
			return 2000 + baseScore;
		return baseScore;
	}

	if (item.media_type === "tv") {
		const tv = item as Schemas.TvMedia;
		const name = tv.name?.toLowerCase() ?? "";
		const originalName = tv.original_name?.toLowerCase() ?? "";
		const baseScore =
			(tv.vote_average ?? 0) * Math.log10((tv.vote_count ?? 0) + 10);

		if (name.startsWith(lowerQuery) || originalName.startsWith(lowerQuery))
			return 5000 + baseScore;
		if (name.includes(lowerQuery) || originalName.includes(lowerQuery))
			return 2000 + baseScore;
		return baseScore;
	}

	return 0;
};

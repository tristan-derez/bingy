import type { Schemas } from "shared";

export type MediaItem =
	| (Schemas.MovieDetails & { mediaType: "movie" })
	| (Schemas.TvDetails & { mediaType: "tv" });

interface MediaInfo {
	title: string;
	imageUrl: string;
	linkTo: string;
}

export function getMediaInfo(
	item: MediaItem,
	fallbackPoster: string,
): MediaInfo {
	const title = item.mediaType === "movie" ? item.title : item.name;
	const posterPath = item.poster_path;
	const imageUrl = posterPath
		? `https://image.tmdb.org/t/p/w500${posterPath}`
		: fallbackPoster;
	const linkTo =
		item.mediaType === "movie" ? `/movies/${item.id}` : `/tv/${item.id}`;

	return { title, imageUrl, linkTo };
}

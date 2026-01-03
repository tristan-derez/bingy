import type { Pretty } from "shared";
import { apiFetch } from "./fetcher";

export const getRatings = async (
	username: string,
	page: number,
	language: string,
	mediaType?: "movie" | "tv",
) => {
	const res = await apiFetch<GetRatingsResponse>(`/history/${username}`, {
		method: "GET",
		query: { page, language, ...(mediaType && { mediaType }) },
	});
	return res;
};

export const getMovieRating = async (username: string, tmdbId: number) => {
	const res = await apiFetch<GetRatingResponse>(
		`/history/${username}/movie/${tmdbId}`,
	);
	return res;
};

export const getTvRating = async (username: string, tmdbId: number) => {
	const res = await apiFetch<GetRatingResponse>(
		`/history/${username}/tv/${tmdbId}`,
	);
	return res;
};

export const rateMovie = async (payload: RateMoviePayload) => {
	const res = await apiFetch<PostMovieRating>("/history/movie", {
		method: "POST",
		body: payload,
	});
	return res;
};

export const rateTvShow = async (payload: RateTvPayload) => {
	const res = await apiFetch<PostTvRating>("/history/tv", {
		method: "POST",
		body: payload,
	});
	return res;
};

type TMDBMedia = {
	id: number;
	title: string;
	originalTitle: string;
	releaseDate: string;
	posterPath: string | null;
	voteAverage: number;
};

export type HistoryItem = TMDBMedia & {
	mediaType: "movie" | "tv";
	watchedAt: Date | null;
	rating: string;
	progress?: {
		lastWatchedSeason: number;
		lastWatchedEpisode: number;
		absoluteEpisode?: number;
	} | null;
	addedAt: Date;
};

export type GetRatingsResponse = Pretty<{
	data: HistoryItem[];
	page: number;
	total_pages: number;
	total_results: number;
}>;

export type GetRatingResponse = Pretty<{
	rating: number | null;
	review: string | null;
	watchedAt: Date | null;
	seasonNumber?: string | null;
	episodeNumber?: string | null;
}>;

export type PostMovieRating = Pretty<{
	id: string;
	loggedAt: Date;
	mediaId: string;
	rating: number | null;
	review: string | null;
	userId: string;
	watchedAt: Date | null;
}>;

export type PostTvRating = {
	watchEntry?: {
		id: string;
		loggedAt: Date;
		mediaId: string;
		rating: number | null;
		review: string | null;
		userId: string;
		watchedAt: Date | null;
	};
	progressEntry?: {
		createdAt: Date;
		deletedAt: Date | null;
		id: string;
		lastWatchedEpisode: number;
		lastWatchedSeason: number;
		absoluteEpisode?: number;
		mediaId: string;
		updatedAt: Date | null;
		userId: string;
	};
};

export type RateMoviePayload = {
	tmdbId: number;
	rating?: number | null;
	review?: string | null;
	watchedAt?: Date | null;
};

export type RateTvPayload = {
	tmdbId: number;
	rating?: number | null;
	review?: string | null;
	lastWatchedSeason?: number;
	lastWatchedEpisode?: number;
	absoluteEpisode?: number;
	watchedAt?: Date | null;
};

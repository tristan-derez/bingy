import type { Pretty } from "shared";
import { apiFetch } from "./fetcher";

type WatchlistResponse = {
	data: Array<{
		id: number;
		title: string;
		originalTitle: string;
		releaseDate: string;
		posterPath: string | null;
		voteAverage: number;
		mediaType: string;
		addedAt: Date;
	}>;
	page: number;
	total_pages: number;
	total_results: number;
};

export const fetchWatchlist = async (
	username: string,
	page = 1,
	language: string,
	mediaType?: "movie" | "tv",
): Promise<WatchlistResponse> => {
	const res = await apiFetch(`/lists/${username}/watchlist`, {
		method: "GET",
		query: { page, language, ...(mediaType && { mediaType }) },
	});
	return res;
};

export const fetchCheckItemInWatchlist = async (
	tmdbMediaType: string,
	tmdbId: number,
) => {
	const res = await apiFetch(
		`/lists/watchlist/check/${tmdbMediaType}/${tmdbId}`,
	);
	return res.item_present;
};

export const postMediaWatchlist = async (
	payload: AddMediaToWatchlistPayload,
) => {
	const res = await apiFetch("/lists/watchlist", {
		method: "POST",
		body: payload,
	});
	return res.data;
};

export const deleteMediaWatchlist = async (
	payload: RemoveMediaFromWatchlistPayload,
) => {
	await apiFetch(`/lists/watchlist/${payload.mediaType}/${payload.tmdbId}`, {
		method: "DELETE",
	});
};

export type AddMediaToWatchlistPayload = Pretty<{
	tmdbId: number;
	mediaType: "movie" | "tv";
	title?: string;
	name?: string;
}>;

export type RemoveMediaFromWatchlistPayload = {
	tmdbId: number;
	mediaType: "movie" | "tv";
	title?: string;
	name?: string;
};

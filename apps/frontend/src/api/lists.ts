import type { Pretty } from "shared";
import { apiFetch } from "./fetcher";

export const fetchWatchlist = async () => {
	const res = await apiFetch("/lists/watchlist", {
		method: "GET",
	});
	return res.data;
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
	await apiFetch(`/lists/watchlist/${payload.tmdbId}/${payload.mediaType}`, {
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

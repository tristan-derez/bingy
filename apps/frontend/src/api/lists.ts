import type { Pretty } from "shared";
import { apiFetch } from "./fetcher";

type WatchlistResponse = Pretty<{
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
}>;

type ListsResponse = Pretty<{
	data: Array<{
		updatedAt: Date | null;
		createdAt: Date;
		deletedAt: Date | null;
		id: string;
		userId: string;
		name: string;
		description: string | null;
		visibility: "limited" | "private" | "public";
	}>;
	page: number;
	total_pages: number;
	total_results: number;
}>;

export const fetchWatchlist = async (
	username: string,
	page = 1,
	language: string,
	mediaType?: "movie" | "tv",
) => {
	const res = await apiFetch<WatchlistResponse>(
		`/lists/${username}/watchlist`,
		{
			method: "GET",
			query: { page, language, ...(mediaType && { mediaType }) },
		},
	);
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

export const fetchLists = async (
	username: string,
	page = 1,
	filter = "all",
) => {
	const res = await apiFetch<ListsResponse>(`/lists/${username}`, {
		method: "GET",
		query: { page, filter },
	});
	return res;
};

export const postMediaList = async (payload: AddMediaToListPayload) => {
	const res = await apiFetch(`/lists/items`, {
		method: "POST",
		body: payload,
	});
	return res.data;
};

export const deleteMediaList = async (payload: RemoveMediaFromListPayload) => {
	await apiFetch(
		`/lists/${payload.listId}/items/${payload.mediaType}/${payload.tmdbId}`,
		{
			method: "DELETE",
		},
	);
};

export type AddMediaToListPayload = Pretty<{
	tmdbId: number;
	mediaType: "movie" | "tv";
	visibility: "private" | "public" | "limited";
	listId?: string;
	listName: string;
	title?: string;
	name?: string;
}>;

export type RemoveMediaFromListPayload = Pretty<{
	listId: string;
	tmdbId: number;
	mediaType: "movie" | "tv";
	listName: string;
	title?: string;
	name?: string;
}>;

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

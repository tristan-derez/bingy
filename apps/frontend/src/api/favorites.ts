import type { Pretty } from "shared";
import { apiFetch } from "./fetcher";

export const getFavorites = async (
	username: string,
	page: number,
	language: string,
	mediaType?: "movie" | "tv",
) => {
	const res = await apiFetch<GetFavoritesResponse>(`/favorites/${username}`, {
		method: "GET",
		query: { page, language, ...(mediaType && { mediaType }) },
	});
	return res;
};

export const getFavorite = async (
	tmdbId: number,
	mediaType: "movie" | "tv",
) => {
	const res = await apiFetch<GetFavoriteResponse>(
		`/favorites/${tmdbId}/${mediaType}`,
	);
	return res;
};

export const addToFavorites = async (payload: AddToFavoritesPayload) => {
	const res = await apiFetch<PostFavoriteResponse>("/favorites", {
		method: "POST",
		body: payload,
	});
	return res;
};

export const removeFromFavorites = async (
	tmdbId: number,
	mediaType: "movie" | "tv",
) => {
	const res = await apiFetch(`/favorites/${tmdbId}/${mediaType}`, {
		method: "DELETE",
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

export type FavoriteItem = TMDBMedia & {
	mediaType: "movie" | "tv";
	addedAt: Date;
	rating: string;
	watchedAt: Date;
};

export type GetFavoritesResponse = Pretty<{
	data: FavoriteItem[];
	page: number;
	total_pages: number;
	total_results: number;
}>;

export type GetFavoriteResponse = Pretty<{
	id: string;
	addedAt: Date;
} | null>;

export type PostFavoriteResponse = Pretty<{
	id: string;
	userId: string;
	mediaId: string;
	addedAt: Date;
}>;

export type AddToFavoritesPayload = {
	tmdbId: number;
	mediaType: "movie" | "tv";
};

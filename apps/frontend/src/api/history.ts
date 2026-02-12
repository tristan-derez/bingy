import type { Pretty } from "shared";
import { apiFetch } from "./fetcher";

export type TrackMoviePayload = {
	tmdbId: number;
	watchedAt: Date | null;
};

export type TrackTvPayload = {
	tmdbId: number;
	lastWatchedSeason?: number;
	lastWatchedEpisode?: number;
	absoluteEpisode?: number;
	trackingMode: string;
	watchedAt: Date | null;
};

export type TrackMovieResponse = Pretty<{
	id: string;
	loggedAt: Date;
	mediaId: string;
	rating: number | null;
	review: string | null;
	userId: string;
	watchedAt: Date | null;
}>;

export type TrackTvResponse = {
	id: string;
	loggedAt: Date;
	mediaId: string;
	rating: string | null;
	review: string | null;
	userId: string;
	watchedAt: Date | null;
};

export const addMovieToHistory = async (payload: TrackMoviePayload) => {
	const res = await apiFetch<TrackMovieResponse>(`history/movie`, {
		method: "POST",
		body: payload,
	});
	return res;
};

export const addTvToHistory = async (payload: TrackTvPayload) => {
	const res = await apiFetch<TrackTvResponse>(`history/tv`, {
		method: "POST",
		body: payload,
	});
	return res;
};

// delete the movie history / including rating/review
export const removeMovieHistory = async (tmdbId: number) => {
	const res = await apiFetch(`/history/movie/${tmdbId}`, {
		method: "DELETE",
		credentials: "include",
	});
	return res;
};

// delete the movie history / including rating/review
export const removeTvHistory = async (tmdbId: number) => {
	const res = await apiFetch(`/history/tv/${tmdbId}`, {
		method: "DELETE",
		credentials: "include",
	});
	return res;
};

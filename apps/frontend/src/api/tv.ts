import type {
	TvEndPoints,
	TvEpisodeEndpoints,
	TvParams,
	TvSeasonEndpoints,
} from "@/types/tv";
import { apiFetch } from "./fetcher";

export const fetchTvSeries = async (
	endpoint: TvEndPoints,
	params?: TvParams,
) => {
	const res = await apiFetch(`/tv/${endpoint}`, {
		method: "GET",
		query: params,
	});
	return res.data;
};

export const fetchTvResources = async (
	tv_id: number,
	endpoint: TvEndPoints,
	params?: TvParams,
) => {
	const path = endpoint ? `/tv/${tv_id}/${endpoint}` : `/tv/${tv_id}`;

	const res = await apiFetch(path, {
		method: "GET",
		query: params,
	});
	return res.data;
};

export const fetchTvSeasonResources = async (
	tv_id: number,
	season_number: number,
	endpoint?: TvSeasonEndpoints,
	params?: TvParams,
) => {
	const path = endpoint
		? `/tv/${tv_id}/season/${season_number}/${endpoint}`
		: `/tv/${tv_id}/season/${season_number}`;

	const res = await apiFetch(path, {
		method: "GET",
		query: params,
	});
	return res.data;
};

export const fetchTvEpisodeResources = async (
	tv_id: number,
	season_number: number,
	episode_number: number,
	endpoint?: TvEpisodeEndpoints,
	params?: TvParams,
) => {
	const path = endpoint
		? `/tv/${tv_id}/season/${season_number}/episode/${episode_number}/${endpoint}`
		: `/tv/${tv_id}/season/${season_number}/episode/${episode_number}`;

	const res = await apiFetch(path, {
		method: "GET",
		query: params,
	});
	return res.data;
};

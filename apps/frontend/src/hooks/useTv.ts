import { useQuery } from "@tanstack/react-query";
import {
	fetchTvEpisodeResources,
	fetchTvResources,
	fetchTvSeasonResources,
	fetchTvSeries,
} from "@/api/tv";
import type {
	TvEndPoints,
	TvEpisodeEndpoints,
	TvParams,
	TvSeasonEndpoints,
} from "@/types/tv";

export function useLatestTv(params?: TvParams) {
	return useQuery({
		queryKey: ["tv", "latest"],
		queryFn: () => fetchTvSeries("latest", params),
	});
}

export function useTopRatedTv(params?: TvParams) {
	return useQuery({
		queryKey: ["tv", "top_rated", params],
		queryFn: () => fetchTvSeries("top_rated", params),
	});
}

export function useTv(id: number, params?: TvParams) {
	return useQuery({
		queryKey: ["tv", id, params],
		queryFn: () => fetchTvResources(id, { params }),
	});
}

export function useTvResources(
	id: number,
	endpoint: TvEndPoints,
	params?: TvParams,
) {
	return useQuery({
		queryKey: ["tv", id, endpoint, params],
		queryFn: () => fetchTvResources(id, { endpoint, params }),
	});
}

export function useTvSeasonResources(
	tv_id: number,
	season_number: number,
	endpoint: TvSeasonEndpoints,
	params?: TvParams,
) {
	return useQuery({
		queryKey: ["tv", tv_id, season_number, endpoint, params],
		queryFn: () =>
			fetchTvSeasonResources(tv_id, season_number, { endpoint, params }),
	});
}

export function useTvEpisodeResources(
	tv_id: number,
	season_number: number,
	episode_number: number,
	endpoint: TvEpisodeEndpoints,
	params?: TvParams,
) {
	return useQuery({
		queryKey: ["tv", tv_id, season_number, episode_number, endpoint, params],
		queryFn: () =>
			fetchTvEpisodeResources(tv_id, season_number, episode_number, {
				endpoint,
				params,
			}),
	});
}

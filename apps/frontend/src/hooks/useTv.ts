import { useQuery } from "@tanstack/react-query";
import { fetchMultiPagesTrending } from "@/api/trending";
import {
	fetchMultiPagesTv,
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
		staleTime: 1000 * 60 * 5,
	});
}

export function useTopRatedTv(params?: TvParams) {
	return useQuery({
		queryKey: ["tv", "top_rated", params],
		queryFn: () => fetchMultiPagesTv("top_rated", { maxPages: 2, params }),
		staleTime: 1000 * 60 * 40,
	});
}

export function usePopularTv(params?: TvParams) {
	return useQuery({
		queryKey: ["tv", "popular", params],
		queryFn: () => fetchMultiPagesTv("popular", { maxPages: 2, params }),
		staleTime: 1000 * 60 * 40,
	});
}

export function useTrendingTodayTv(params?: TvParams) {
	return useQuery({
		queryKey: ["tv", "trending", "day", params],
		queryFn: () =>
			fetchMultiPagesTrending("tv", "day", { maxPages: 2, params }),
		staleTime: 1000 * 60 * 40,
	});
}

export function useTrendingWeekTv(params?: TvParams) {
	return useQuery({
		queryKey: ["tv", "trending", "week", params],
		queryFn: () =>
			fetchMultiPagesTrending("tv", "week", { maxPages: 2, params }),
		staleTime: 1000 * 60 * 40,
	});
}

export function useTv(id: number, params?: TvParams) {
	return useQuery({
		queryKey: ["tv", id, params],
		queryFn: () => fetchTvResources(id, { params }),
		staleTime: 1000 * 60 * 20,
	});
}

export function useTvResources<T>(
	id: number,
	endpoint: TvEndPoints,
	params?: TvParams,
) {
	return useQuery<T>({
		queryKey: ["tv", id, endpoint, params],
		queryFn: () => fetchTvResources(id, { endpoint, params }),
		staleTime: 1000 * 60 * 20,
	});
}

export function useTvSeasonResources<T>(
	tv_id: number,
	season_number: number,
	endpoint: TvSeasonEndpoints,
	params?: TvParams,
) {
	return useQuery<T>({
		queryKey: ["tv", tv_id, season_number, endpoint, params],
		queryFn: () =>
			fetchTvSeasonResources(tv_id, season_number, { endpoint, params }),
		staleTime: 1000 * 60 * 20,
	});
}

export function useTvEpisodeResources<T>(
	tv_id: number,
	season_number: number,
	episode_number: number,
	endpoint: TvEpisodeEndpoints,
	params?: TvParams,
) {
	return useQuery<T>({
		queryKey: ["tv", tv_id, season_number, episode_number, endpoint, params],
		queryFn: () =>
			fetchTvEpisodeResources(tv_id, season_number, episode_number, {
				endpoint,
				params,
			}),
		staleTime: 1000 * 60 * 20,
	});
}

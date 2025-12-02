import type { Pretty } from "shared";
import { apiFetch } from "./fetcher";

export const fetchTvSeries = async (
	endpoint: TvSeriesEndpoints,
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
	options: {
		endpoint?: TvEndPoints;
		params?: TvParams;
	},
) => {
	const path = options.endpoint
		? `/tv/${tv_id}/${options.endpoint}`
		: `/tv/${tv_id}`;

	const res = await apiFetch(path, {
		method: "GET",
		query: options.params,
	});
	return res.data;
};

export const fetchMultiPagesTv = async (
	endpoint: TvSeriesEndpoints,
	options: {
		maxPages: number;
		params?: TvParams;
	},
) => {
	const firstPage = await apiFetch(`/tv/${endpoint}`, {
		method: "GET",
		query: options.params,
	});

	const totalPages = firstPage.data.total_pages;
	const allResults = [...firstPage.data.results];

	const pagePromises = [];
	for (let page = 2; page <= Math.min(totalPages, options.maxPages); page++) {
		pagePromises.push(
			apiFetch(`/tv/${endpoint}`, {
				method: "GET",
				query: { ...options.params, page },
			}),
		);
	}

	const pages = await Promise.all(pagePromises);
	for (const pageData of pages) {
		allResults.push(...pageData.data.results);
	}

	return { ...firstPage.data, results: allResults };
};

export const fetchTvSeasonResources = async (
	tv_id: number,
	season_number: number,
	options: {
		endpoint?: TvSeasonEndpoints;
		params?: TvParams;
	},
) => {
	const path = options.endpoint
		? `/tv/${tv_id}/season/${season_number}/${options.endpoint}`
		: `/tv/${tv_id}/season/${season_number}`;

	const res = await apiFetch(path, {
		method: "GET",
		query: options.params,
	});
	return res.data;
};

export const fetchTvEpisodeResources = async (
	tv_id: number,
	season_number: number,
	episode_number: number,
	options: {
		endpoint?: TvEpisodeEndpoints;
		params?: TvParams;
	},
) => {
	const path = options.endpoint
		? `/tv/${tv_id}/season/${season_number}/episode/${episode_number}/${options.endpoint}`
		: `/tv/${tv_id}/season/${season_number}/episode/${episode_number}`;

	const res = await apiFetch(path, {
		method: "GET",
		query: options.params,
	});
	return res.data;
};

export type TvSeriesEndpoints = Pretty<"top_rated" | "popular" | "latest">;

export type TvEndPoints = Pretty<
	| "aggregate_credits"
	| "alternative_titles"
	| "content_ratings"
	| "credits"
	| "episode_groups"
	| "external_ids"
	| "images"
	| "keywords"
	| "lists"
	| "recommendations"
	| "reviews"
	| "screened_theatrically"
	| "similar"
	| "translations"
	| "videos"
	| "watch/providers"
>;

export type TvSeasonEndpoints = Pretty<
	| ""
	| "aggregate_credits"
	| "credits"
	| "external_ids"
	| "images"
	| "translations"
	| "videos"
	| "watch/providers"
>;

export type TvEpisodeEndpoints = Pretty<
	"" | "credits" | "external_ids" | "images" | "translations" | "videos"
>;

export type TvParams = Pretty<{
	language?: string;
	append_to_response?: string;
	page?: number;
	region?: string;
}>;

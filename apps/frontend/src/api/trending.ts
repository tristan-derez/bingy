import type { Pretty } from "shared";
import { apiFetch } from "./fetcher";

export const fetchMultiPagesTrending = async (
	endpoint: TrendingEndpoints,
	time_window: "day" | "week",
	options: {
		maxPages: number;
		params?: TrendingParams;
	},
) => {
	const firstPage = await apiFetch(`/trending/${endpoint}/${time_window}`, {
		method: "GET",
		query: options.params,
	});

	const totalPages = firstPage.data.total_pages;
	const allResults = [...firstPage.data.results];

	const pagePromises = [];
	for (let page = 2; page <= Math.min(totalPages, options.maxPages); page++) {
		pagePromises.push(
			apiFetch(`/trending/${endpoint}/${time_window}`, {
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

export type TrendingEndpoints = Pretty<"all" | "movie" | "tv" | "person">;

export type TrendingParams = Pretty<{
	language?: string;
	page?: number;
}>;

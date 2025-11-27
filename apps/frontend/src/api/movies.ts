import type { Pretty } from "shared";
import { apiFetch } from "./fetcher";

export const fetchMovies = async (
	endpoint: MoviesEndpoint,
	params?: MoviesParams,
) => {
	const res = await apiFetch(`/movies/${endpoint}`, {
		method: "GET",
		query: params,
	});
	return res.data;
};

export const fetchMultiPagesMovies = async (
	endpoint: MoviesEndpoint,
	maxPages: number,
	params?: MoviesParams,
) => {
	const firstPage = await apiFetch(`/movies/${endpoint}`, {
		method: "GET",
		query: params,
	});

	const totalPages = firstPage.data.total_pages;
	const allResults = [...firstPage.data.results];

	const pagePromises = [];
	for (let page = 2; page <= Math.min(totalPages, maxPages); page++) {
		pagePromises.push(
			apiFetch(`/movies/${endpoint}`, {
				method: "GET",
				query: { ...params, page },
			}),
		);
	}

	const pages = await Promise.all(pagePromises);
	for (const pageData of pages) {
		allResults.push(...pageData.data.results);
	}

	return { ...firstPage.data, results: allResults };
};

export const fetchMovie = async (id: number, params?: MoviesParams) => {
	const res = await apiFetch(`/movies/${id}`, {
		method: "GET",
		query: params,
	});
	return res.data;
};

export const fetchMovieResources = async (
	id: number,
	endpoint: MovieEndpoint,
	params?: MoviesParams,
) => {
	const res = await apiFetch(`/movies/${id}/${endpoint}`, {
		method: "GET",
		query: params,
	});
	return res.data;
};

export type MoviesEndpoint = Pretty<
	"latest" | "now_playing" | "popular" | "top_rated" | "upcoming"
>;

export type MovieEndpoint = Pretty<
	| "alternative_titles"
	| "credits"
	| "external_ids"
	| "images"
	| "keywords"
	| "lists"
	| "recommendations"
	| "release_dates"
	| "reviews"
	| "similar"
	| "translations"
	| "videos"
	| "watch/providers"
>;

export type MoviesParams = Pretty<{
	language?: string;
	page?: number;
	region?: string;
}>;

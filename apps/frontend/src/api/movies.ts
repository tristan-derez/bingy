import type { MovieEndpoint, MovieParams, MoviesEndpoint } from "@/types/movie";
import { apiFetch } from "./fetcher";

export const fetchMovies = async (
	endpoint: MoviesEndpoint,
	params?: MovieParams,
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
	params?: MovieParams,
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

export const fetchMovie = async (id: number, params?: MovieParams) => {
	const res = await apiFetch(`/movies/${id}`, {
		method: "GET",
		query: params,
	});
	return res.data;
};

export const fetchMovieResources = async (
	id: number,
	endpoint: MovieEndpoint,
	params?: MovieParams,
) => {
	const res = await apiFetch(`/movies/${id}/${endpoint}`, {
		method: "GET",
		query: params,
	});
	return res.data;
};

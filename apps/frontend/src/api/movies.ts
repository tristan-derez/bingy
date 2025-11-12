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

export const fetchMovie = async (id: string, params?: MovieParams) => {
	const res = await apiFetch(`/movies/${id}`, {
		method: "GET",
		query: params,
	});
	return res.data;
};

export const fetchMovieResources = async (
	id: string,
	endpoint: MovieEndpoint,
	params?: MovieParams,
) => {
	const res = await apiFetch(`/movies/${id}/${endpoint}`, {
		method: "GET",
		query: params,
	});
	return res.data;
};

import { useQuery } from "@tanstack/react-query";
import type { Schemas } from "shared";
import {
	fetchMovie,
	fetchMovieResources,
	fetchMovies,
	fetchMultiPagesMovies,
	type MovieEndpoint,
	type MoviesParams,
} from "@/api/movies";

export function useLatestMovie() {
	return useQuery({
		queryKey: ["movie", "latest"],
		queryFn: () => fetchMovies("latest"),
		staleTime: 1000 * 60 * 10,
	});
}

export function useNowPlayingMovies(params?: MoviesParams) {
	return useQuery({
		queryKey: ["movies", "now_playing", params],
		queryFn: () => fetchMultiPagesMovies("now_playing", 2, params),
		staleTime: 1000 * 60 * 10,
	});
}

export function usePopularMovies(params?: MoviesParams) {
	return useQuery({
		queryKey: ["movies", "popular", params],
		queryFn: () => fetchMovies("popular", params),
		staleTime: 1000 * 60 * 40,
	});
}

export function useTopRatedMovies(params?: MoviesParams) {
	return useQuery({
		queryKey: ["movies", "top_rated", params],
		queryFn: () => fetchMultiPagesMovies("top_rated", 2, params),
		staleTime: 1000 * 60 * 40,
	});
}

export function useUpcomingMovies(params?: MoviesParams) {
	return useQuery({
		queryKey: ["movies", "upcoming", params],
		queryFn: () => fetchMultiPagesMovies("upcoming", 2, params),
		staleTime: 1000 * 60 * 10,
	});
}

export function useMovie(id: number, params?: MoviesParams) {
	return useQuery<Schemas.MovieDetails>({
		queryKey: ["movie", id, params],
		queryFn: () => fetchMovie(id, params),
		staleTime: 1000 * 60 * 30,
	});
}

export function useMovieResource<T>(
	id: number,
	endpoint: MovieEndpoint,
	params?: MoviesParams,
) {
	return useQuery<T>({
		queryKey: ["movie", id, endpoint, params],
		queryFn: () => fetchMovieResources(id, endpoint, params),
		staleTime: 1000 * 60 * 10,
	});
}

import { useQuery } from "@tanstack/react-query";
import {
	fetchMovie,
	fetchMovieResources,
	fetchMovies,
	fetchMultiPagesMovies,
} from "@/api/movies";
import type { MovieDetails, MovieEndpoint, MovieParams } from "@/types/movie";

export function useLatestMovie() {
	return useQuery({
		queryKey: ["movies", "latest"],
		queryFn: () => fetchMovies("latest"),
		staleTime: 1000 * 60 * 10,
	});
}

export function useNowPlayingMovies(params?: MovieParams) {
	return useQuery({
		queryKey: ["movies", "now_playing", params],
		queryFn: () => fetchMultiPagesMovies("now_playing", 3, params),
		staleTime: 1000 * 60 * 10,
	});
}

export function usePopularMovies(params?: MovieParams) {
	return useQuery({
		queryKey: ["movies", "popular", params],
		queryFn: () => fetchMovies("popular", params),
		staleTime: 1000 * 60 * 10,
	});
}

export function useTopRatedMovies(params?: MovieParams) {
	return useQuery({
		queryKey: ["movies", "top_rated", params],
		queryFn: () => fetchMultiPagesMovies("top_rated", 3, params),
		staleTime: 1000 * 60 * 10,
	});
}

export function useUpcomingMovies(params?: MovieParams) {
	return useQuery({
		queryKey: ["movies", "upcoming", params],
		queryFn: () => fetchMultiPagesMovies("upcoming", 4, params),
		staleTime: 1000 * 60 * 10,
	});
}

export function useMovie(id: number, params?: MovieParams) {
	return useQuery<MovieDetails>({
		queryKey: ["movies", id, params],
		queryFn: () => fetchMovie(id, params),
		staleTime: 1000 * 60 * 10,
	});
}

export function useMovieResource<T>(
	id: number,
	endpoint: MovieEndpoint,
	params?: MovieParams,
) {
	return useQuery<T>({
		queryKey: ["movies", id, endpoint, params],
		queryFn: () => fetchMovieResources(id, endpoint, params),
		staleTime: 1000 * 60 * 10,
	});
}

import { useQuery } from "@tanstack/react-query";
import { fetchMovie, fetchMovieResources, fetchMovies } from "@/api/movies";
import type { MovieEndpoint, MovieParams } from "@/types/movie";

export function useLatestMovie() {
	return useQuery({
		queryKey: ["movies", "latest"],
		queryFn: () => fetchMovies("latest"),
	});
}

export function useNowPlayingMovies(params?: MovieParams) {
	return useQuery({
		queryKey: ["movies", "now_playing", params],
		queryFn: () => fetchMovies("now_playing", params),
	});
}

export function usePopularMovies(params?: MovieParams) {
	return useQuery({
		queryKey: ["movies", "popular", params],
		queryFn: () => fetchMovies("popular", params),
	});
}

export function useTopRatedMovies(params?: MovieParams) {
	return useQuery({
		queryKey: ["movies", "top_rated", params],
		queryFn: () => fetchMovies("top_rated", params),
	});
}

export function useUpcomingMovies(params?: MovieParams) {
	return useQuery({
		queryKey: ["movies", "upcoming", params],
		queryFn: () => fetchMovies("upcoming", params),
	});
}

export function useMovie(id: number, params?: MovieParams) {
	return useQuery({
		queryKey: ["movies", id, params],
		queryFn: () => fetchMovie(id, params),
	});
}

export function useMovieResource(
	id: number,
	endpoint: MovieEndpoint,
	params?: MovieParams,
) {
	return useQuery({
		queryKey: ["movies", id, endpoint, params],
		queryFn: () => fetchMovieResources(id, endpoint, params),
	});
}

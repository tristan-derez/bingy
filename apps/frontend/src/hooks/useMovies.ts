import { useQuery } from "@tanstack/react-query";
import { fetchMovie, fetchMovieCredits, fetchMovies } from "@/api/movies";
import type { MovieParams } from "@/types/movie";

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

export function useMovie(id: string, language?: string) {
	return useQuery({
		queryKey: ["movies", id, { language }],
		queryFn: () => fetchMovie(id, { language }),
	});
}

export function useMovieCredits(id: string, language?: string) {
	return useQuery({
		queryKey: ["movies", id, "credits", { language }],
		queryFn: () => fetchMovieCredits(id, language),
	});
}

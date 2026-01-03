import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
	getMovieRating,
	getRatings,
	getTvRating,
	type RateMoviePayload,
	type RateTvPayload,
	rateMovie,
	rateTvShow,
} from "@/api/rating";
import { m } from "@/paraglide/messages";

export function useRatings(
	username: string,
	page = 1,
	language: string,
	mediaType?: "movie" | "tv",
) {
	return useQuery({
		queryKey: ["ratings", username, page, language, mediaType],
		queryFn: () => getRatings(username, page, language, mediaType),
		staleTime: 1000 * 60 * 10,
	});
}

export function useMovieRating(username: string, tmdbId: number) {
	return useQuery({
		queryKey: ["ratings", "movie", tmdbId],
		queryFn: () => getMovieRating(username, tmdbId),
		staleTime: 1000 * 60 * 10,
		enabled: !!tmdbId,
	});
}

export function useTvRating(username: string, tmdbId: number) {
	return useQuery({
		queryKey: ["ratings", "tv", tmdbId],
		queryFn: () => getTvRating(username, tmdbId),
		staleTime: 1000 * 60 * 10,
		enabled: !!tmdbId,
	});
}

export function useRateMovie() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: RateMoviePayload) => rateMovie(payload),
		onSuccess: (_, _variables) => {
			queryClient.invalidateQueries({
				queryKey: ["ratings"],
			});
			queryClient.invalidateQueries({
				queryKey: ["lists", "watchlist"],
			});
			toast.success(m.rate_movie_success());
		},
		onError: () => {
			toast.error(m.rate_movie_error());
		},
	});
}

export function useRateTvShow() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: RateTvPayload) => rateTvShow(payload),
		onSuccess: (_, _variables) => {
			queryClient.invalidateQueries({
				queryKey: ["ratings"],
			});
			queryClient.invalidateQueries({
				queryKey: ["lists", "watchlist"],
			});
			toast.success(m.rate_tv_success());
		},
		onError: () => {
			toast.error(m.rate_tv_error());
		},
	});
}

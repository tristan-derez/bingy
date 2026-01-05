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
	removeMovieRating,
	removeTvRating,
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
		onSuccess: (res, _variables) => {
			queryClient.invalidateQueries({
				queryKey: ["ratings"],
			});
			queryClient.invalidateQueries({
				queryKey: ["lists", "watchlist"],
			});
			if (!res.rating) {
				toast.success(m.add_movie_watched());
			} else {
				toast.success(m.rate_movie_success());
			}
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
		onSuccess: (res, _variables) => {
			queryClient.invalidateQueries({
				queryKey: ["ratings"],
			});
			queryClient.invalidateQueries({
				queryKey: ["lists", "watchlist"],
			});
			console.log(res);
			if (!res.rating) {
				toast.success(m.add_tv_watched());
			} else {
				toast.success(m.rate_tv_success());
			}
		},
		onError: () => {
			toast.error(m.rate_tv_error());
		},
	});
}

export function useRemoveMovieRating() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (tmdbId: number) => removeMovieRating(tmdbId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["ratings"],
			});
			queryClient.invalidateQueries({
				queryKey: ["lists", "watchlist"],
			});
			toast.success(m.remove_movie_rating_success());
		},
		onError: () => {
			toast.error(m.remove_movie_rating_error());
		},
	});
}

export function useRemoveTvRating() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (tmdbId: number) => removeTvRating(tmdbId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["ratings"],
			});
			queryClient.invalidateQueries({
				queryKey: ["lists", "watchlist"],
			});
			toast.success(m.remove_tv_rating_success());
		},
		onError: () => {
			toast.error(m.remove_tv_rating_error());
		},
	});
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
	getMediaAverageRating,
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
import { toast } from "@/components/toast/toast";
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

export function useRateMovie(username: string) {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: (payload: RateMoviePayload) => rateMovie(payload),
		onSuccess: (res, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["ratings"],
			});
			queryClient.invalidateQueries({
				queryKey: ["ratings", "movie", variables.tmdbId],
			});
			queryClient.invalidateQueries({
				queryKey: ["lists", "watchlist"],
			});
			queryClient.invalidateQueries({
				queryKey: ["average-rating", "movie", variables.tmdbId],
			});

			if (res.rating) {
				toast.success({
					title: m.toast_rate_movie_success(),
					button: {
						label: m.btn_go_to_history_page(),
						onClick: () => {
							navigate({
								to: "/user/$username/history",
								params: { username },
							});
						},
					},
				});
			} else {
				toast.success({ title: m.toast_add_movie_watched_success() });
			}
		},
		onError: () => {
			toast.error({ title: m.toast_rate_movie_error() });
		},
	});
}

export function useRateTvShow(username: string) {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: (payload: RateTvPayload) => rateTvShow(payload),
		onSuccess: (res, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["ratings"],
			});
			queryClient.invalidateQueries({
				queryKey: ["ratings", "tv", variables.tmdbId],
			});
			queryClient.invalidateQueries({
				queryKey: ["lists", "watchlist"],
			});
			queryClient.invalidateQueries({
				queryKey: ["average-rating", "tv", variables.tmdbId],
			});

			if (res.rating) {
				toast.success({
					title: m.toast_rate_tv_success(),
					button: {
						label: m.btn_go_to_history_page(),
						onClick: () => {
							navigate({
								to: "/user/$username/history",
								params: { username },
							});
						},
					},
				});
			} else {
				toast.success({
					title: m.toast_add_tv_watched_success(),
					button: {
						label: m.btn_go_to_history_page(),
						onClick: () => {
							navigate({
								to: "/user/$username/history",
								params: { username },
							});
						},
					},
				});
			}
		},
		onError: () => {
			toast.error({ title: m.toast_rate_tv_error() });
		},
	});
}

export function useRemoveMovieRating() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (tmdbId: number) => removeMovieRating(tmdbId),
		onSuccess: (_res, tmdbId) => {
			queryClient.invalidateQueries({
				queryKey: ["ratings"],
			});
			queryClient.invalidateQueries({
				queryKey: ["ratings", "movie", tmdbId],
			});
			queryClient.invalidateQueries({
				queryKey: ["average-rating", "movie", tmdbId],
			});

			toast.success({ title: m.toast_remove_movie_rating_success() });
		},
		onError: () => {
			toast.error({ title: m.toast_remove_movie_rating_error() });
		},
	});
}

export function useRemoveTvRating() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (tmdbId: number) => removeTvRating(tmdbId),
		onSuccess: (_res, tmdbId) => {
			queryClient.invalidateQueries({
				queryKey: ["ratings"],
			});
			queryClient.invalidateQueries({
				queryKey: ["ratings", "tv", tmdbId],
			});
			queryClient.invalidateQueries({
				queryKey: ["average-rating", "tv", tmdbId],
			});

			toast.success({ title: m.toast_remove_tv_rating_success() });
		},
		onError: () => {
			toast.error({ title: m.toast_remove_tv_rating_error() });
		},
	});
}

export function useMediaAverageRating(
	mediaType: "movie" | "tv",
	tmdbId: number,
) {
	return useQuery({
		queryKey: ["average-rating", mediaType, tmdbId],
		queryFn: () => getMediaAverageRating(mediaType, tmdbId),
		staleTime: 1000 * 60 * 5,
		enabled: !!tmdbId,
	});
}

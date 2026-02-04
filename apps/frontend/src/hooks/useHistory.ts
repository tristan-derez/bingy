import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
	addMovieToHistory,
	addTvToHistory,
	removeMovieHistory,
	removeTvHistory,
	type TrackMoviePayload,
	type TrackTvPayload,
} from "@/api/history";
import { m } from "@/paraglide/messages";

export function useAddMovieToHistory() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: TrackMoviePayload) => addMovieToHistory(payload),
		onSuccess: (_res, _variables) => {
			queryClient.invalidateQueries({
				queryKey: ["ratings"],
			});
			queryClient.invalidateQueries({
				queryKey: ["lists", "watchlist"],
			});

			toast.success(m.toast_add_movie_watched_success());
		},
		onError: () => {
			toast.error(m.toast_add_movie_watched_error());
		},
	});
}

export function useAddTvToHistory() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: TrackTvPayload) => addTvToHistory(payload),
		onSuccess: (_res, _variables) => {
			queryClient.invalidateQueries({
				queryKey: ["ratings"],
			});
			queryClient.invalidateQueries({
				queryKey: ["lists", "watchlist"],
			});

			toast.success(m.toast_add_tv_watched_success());
		},
		onError: () => {
			toast.error(m.toast_add_tv_watched_error());
		},
	});
}

export function useRemoveMovieHistory() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (tmdbId: number) => removeMovieHistory(tmdbId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["ratings"],
			});
			queryClient.invalidateQueries({
				queryKey: ["lists", "watchlist"],
			});
			toast.success(m.toast_remove_movie_history_success());
		},
		onError: () => {
			toast.error(m.toast_remove_movie_history_error());
		},
	});
}

export function useRemoveTvHistory() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (tmdbId: number) => removeTvHistory(tmdbId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["ratings"],
			});
			queryClient.invalidateQueries({
				queryKey: ["lists", "watchlist"],
			});
			toast.success(m.toast_remove_tv_history_success());
		},
		onError: () => {
			toast.error(m.toast_remove_tv_history_error());
		},
	});
}

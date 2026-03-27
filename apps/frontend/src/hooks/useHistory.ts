import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
	addMovieToHistory,
	addTvToHistory,
	removeMovieHistory,
	removeTvHistory,
	type TrackMoviePayload,
	type TrackTvPayload,
} from "@/api/history";
import { toast } from "@/components/toast/toast";
import { m } from "@/paraglide/messages";

export function useAddMovieToHistory(username: string) {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: (payload: TrackMoviePayload) => addMovieToHistory(payload),
		onSuccess: (_res, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["ratings"],
			});
			queryClient.invalidateQueries({
				queryKey: ["ratings", "movie", variables.tmdbId],
			});
			queryClient.invalidateQueries({
				queryKey: ["lists", "watchlist"],
			});

			toast.success({
				title: m.toast_add_movie_watched_success(),
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
		},
		onError: () => {
			toast.error({ title: m.toast_add_movie_watched_error() });
		},
	});
}

export function useAddTvToHistory(username: string) {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: (payload: TrackTvPayload) => addTvToHistory(payload),
		onSuccess: (_res, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["ratings"],
			});
			queryClient.invalidateQueries({
				queryKey: ["ratings", "tv", variables.tmdbId],
			});
			queryClient.invalidateQueries({
				queryKey: ["lists", "watchlist"],
			});

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
		},
		onError: () => {
			toast.error({ title: m.toast_add_tv_watched_error() });
		},
	});
}

export function useRemoveMovieHistory() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (tmdbId: number) => removeMovieHistory(tmdbId),
		onSuccess: (_res, tmdbId) => {
			queryClient.invalidateQueries({
				queryKey: ["ratings"],
			});
			queryClient.invalidateQueries({
				queryKey: ["ratings", "movie", tmdbId],
			});
			queryClient.invalidateQueries({
				queryKey: ["lists", "watchlist"],
			});
			queryClient.invalidateQueries({
				queryKey: ["favorites"],
			});

			toast.success({ title: m.toast_remove_movie_history_success() });
		},
		onError: () => {
			toast.error({ title: m.toast_remove_movie_history_error() });
		},
	});
}

export function useRemoveTvHistory() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (tmdbId: number) => removeTvHistory(tmdbId),
		onSuccess: (_res, tmdbId) => {
			queryClient.invalidateQueries({
				queryKey: ["ratings"],
			});
			queryClient.invalidateQueries({
				queryKey: ["ratings", "tv", tmdbId],
			});
			queryClient.invalidateQueries({
				queryKey: ["lists", "watchlist"],
			});
			queryClient.invalidateQueries({
				queryKey: ["favorites"],
			});

			toast.success({ title: m.toast_remove_tv_history_success() });
		},
		onError: () => {
			toast.error({ title: m.toast_remove_tv_history_error() });
		},
	});
}

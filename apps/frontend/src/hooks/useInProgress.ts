import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	type GetInProgressResponse,
	getInProgress,
	getUserTvProgress,
	type InProgressFilter,
	type MarkEpisodeWatchedPayload,
	markTvEpisodeWatched,
} from "@/api/in-progress";
import { toast } from "@/components/toast/toast";
import { m } from "@/paraglide/messages";

export function useInProgress(
	username: string,
	page = 1,
	language = "en-US",
	limit = 24,
	status: InProgressFilter = "all",
) {
	return useQuery({
		queryKey: ["in-progress", username, page, language, limit, status],
		queryFn: (): Promise<GetInProgressResponse> =>
			getInProgress(username, page, language, limit, status),
		staleTime: 1000 * 60 * 10,
		enabled: !!username,
	});
}

export function useMarkEpisodeWatched(username: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: MarkEpisodeWatchedPayload) =>
			markTvEpisodeWatched(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["in-progress", username],
			});
			queryClient.invalidateQueries({
				queryKey: ["user-profile", username],
			});
		},
	});
}

export function useUserTvProgress(
	username: string,
	tmdbId: number,
	enabled = true,
) {
	return useQuery({
		queryKey: ["progress", username, "tv", tmdbId],
		queryFn: () => getUserTvProgress(username, tmdbId),
		staleTime: 1000 * 60 * 10,
		enabled: enabled && !!username && !!tmdbId,
	});
}

export function useAddTvToCurrentlyWatching(username: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: MarkEpisodeWatchedPayload) =>
			markTvEpisodeWatched(payload),
		onSuccess: (_res, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["in-progress", username],
			});
			queryClient.invalidateQueries({
				queryKey: ["progress", username, "tv", variables.tmdbId],
			});
			queryClient.invalidateQueries({
				queryKey: ["user-profile", username],
			});

			toast.success({ title: m.toast_add_currently_watching_success() });
		},
		onError: () => {
			toast.error({ title: m.toast_add_currently_watching_error() });
		},
	});
}

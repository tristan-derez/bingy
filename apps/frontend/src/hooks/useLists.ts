import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
	type AddMediaToWatchlistPayload,
	deleteMediaWatchlist,
	fetchWatchlist,
	postMediaWatchlist,
	type RemoveMediaFromWatchlistPayload,
} from "@/api/lists";
import { m } from "@/paraglide/messages";

export function useWatchlist() {
	return useQuery({
		queryKey: ["lists", "watchlist"],
		queryFn: () => fetchWatchlist(),
		staleTime: 1000 * 60 * 10,
	});
}

export function useAddMediaToWatchlist() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (payload: AddMediaToWatchlistPayload) => {
			return postMediaWatchlist(payload);
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["lists", "watchlist"],
			});
			const title = variables.title || variables.name;
			toast.success(m.toast_watchlist_media_success({ media: `"${title}"` }));
		},
		onError: (_, variables) => {
			const title = variables.title || variables.name;
			toast.error(m.toast_watchlist_media_error({ media: `"${title}"` }));
		},
	});
}

export function useRemoveFromWatchlist() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (payload: RemoveMediaFromWatchlistPayload) => {
			return deleteMediaWatchlist(payload);
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["lists", "watchlist"],
			});
			const title = variables.title || variables.name;
			toast.success(m.toast_remove_watchlist_success({ media: `"${title}"` }));
		},
		onError: (_, variables) => {
			const title = variables.title || variables.name;
			toast.error(m.toast_remove_watchlist_error({ media: `"${title}"` }));
		},
	});
}
